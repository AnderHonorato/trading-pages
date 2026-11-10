require('dotenv').config();
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const express=require('express');
const compression=require('compression');
const {migrar}=require('../banco/banco-migrador.js');
const {fecharBanco}=require('../banco/banco.js');
const {segurancaCabecalhos}=require('./seguranca/seguranca-cabecalhos.js');
const {carregarSessao}=require('./seguranca/seguranca-autenticacao.js');
const {limitarRequisicoes}=require('./seguranca/seguranca-limite-requisicoes.js');
const {encontrarPortaLivre}=require('./servidor-porta.js');
const {verificarInstancia,removerPidProprio}=require('./servidor-instancia.js');
const autenticacaoRotas=require('./rotas/autenticacao/autenticacao-rotas.js');
const configuracoesRotas=require('./rotas/configuracoes/configuracoes-rotas.js');
const {criarObservabilidade}=require('./observabilidade/observabilidade.js');
const {obterBanco}=require('../banco/banco.js');

if(!process.env.CHAVE_CRIPTOGRAFIA)throw new Error('CHAVE_CRIPTOGRAFIA ausente no .env');
migrar();

const raiz=path.resolve(__dirname,'..');
const app=express();
const observabilidade=criarObservabilidade({versao:'12.0'});
app.disable('x-powered-by');
if(String(process.env.TRUST_PROXY).toLowerCase()==='true')app.set('trust proxy',1);
app.use(segurancaCabecalhos());
app.use(observabilidade.middleware);
app.use(compression());
app.use(express.json({limit:'100kb'}));
app.use(express.urlencoded({extended:false,limit:'100kb'}));
app.use(carregarSessao);

app.use('/frontend',express.static(path.join(raiz,'frontend'),{fallthrough:false,maxAge:'1h'}));
for(const arquivo of ['evolucao-v11.js','evolucao-v11.css']){
  app.get('/'+arquivo,(_req,res)=>res.sendFile(path.join(raiz,arquivo)));
}

app.get('/api/saude',(_req,res)=>{
  res.set('Cache-Control','no-store');
  try{
    obterBanco().prepare('SELECT 1 AS ok').get();
    res.json({...observabilidade.health(),banco:'ok'});
  }catch{
    res.status(503).json({ok:false,versao:'12.0',estado:'degradado',banco:'erro',hora:new Date().toISOString()});
  }
});

app.use('/api',limitarRequisicoes({grupo:'api_geral',limite:120,janelaMinutos:1}));
app.use('/api/autenticacao',autenticacaoRotas);
app.use('/api/configuracoes',limitarRequisicoes({grupo:'admin',limite:60,janelaMinutos:1,chave:req=>req.sessao?.usuario||req.ip}),configuracoesRotas);

app.get('/api/diagnostico',(req,res)=>{
  if(!req.sessao)return res.status(401).json({ok:false,erro:'autenticacao_necessaria'});
  const banco=obterBanco();
  const sessoesAtivas=banco.prepare("SELECT COUNT(*) AS n FROM sessoes WHERE revogada_em IS NULL AND expira_em>?").get(new Date().toISOString()).n;
  const auditoria24h=banco.prepare("SELECT COUNT(*) AS n FROM auditoria WHERE criado_em>?").get(new Date(Date.now()-86400000).toISOString()).n;
  res.set('Cache-Control','no-store');
  res.json({ok:true,versao:'12.0',...observabilidade.snapshot(),banco:{sessoesAtivas:Number(sessoesAtivas),eventosAuditoria24h:Number(auditoria24h)}});
});

app.get('/api/status',(req,res)=>{
  if(!req.sessao)return res.status(401).json({ok:false,erro:'autenticacao_necessaria'});
  res.set('Cache-Control','no-store');
  res.json({ok:true,versao:'12.0',modo:'demonstracao',conectadoCorretora:false,orquestracao:'visual',hora:new Date().toISOString()});
});
app.get('/api/sinais',(req,res)=>{
  if(!req.sessao)return res.status(401).json({ok:false,erro:'autenticacao_necessaria'});
  const agentes=['KELLY','SPOTTER','TAKER','CLOSER','PRIOR','EDGE','LUNA','RUBI','AXO'];
  const ciclo=Math.floor(Date.now()/30000);
  res.set('Cache-Control','no-store');
  res.json({ok:true,demonstracao:true,versao:'12.0',eventos:[{id:'demo-'+ciclo,tipo:'observacao',agente:agentes[ciclo%agentes.length],horario:new Date(ciclo*30000).toISOString(),descricao:'Pulso visual demonstrativo — sem ordem real.'}]});
});

function paginaProtegida(arquivo,{permitirTroca=false}={}){
  return (req,res)=>{
    if(!req.sessao)return res.redirect(302,'/entrar');
    if(req.sessao.forcar_troca_senha&&!permitirTroca)return res.redirect(302,'/trocar-senha');
    res.sendFile(path.join(raiz,arquivo));
  };
}

app.get('/favicon.ico',(_req,res)=>res.status(204).end());
app.get('/',(req,res)=>res.redirect(302,req.sessao?(req.sessao.forcar_troca_senha?'/trocar-senha':'/painel'):'/entrar'));
app.get('/entrar',(req,res)=>res.sendFile(path.join(raiz,'frontend/paginas/entrar/entrar.html')));
app.get('/trocar-senha',paginaProtegida('frontend/paginas/trocar-senha/trocar-senha.html',{permitirTroca:true}));
app.get('/configuracoes/apis',paginaProtegida('frontend/paginas/configuracoes/configuracoes.html'));
app.get('/painel',paginaProtegida('agentes-orbitais.html'));
app.get('/agentes-orbitais.html',paginaProtegida('agentes-orbitais.html'));

app.use('/api',(req,res)=>res.status(404).json({ok:false,erro:'rota_nao_encontrada'}));
app.use((_req,res)=>res.status(404).type('text/plain').send('Página não encontrada.'));
app.use((erro,req,res,_next)=>{
  console.error(JSON.stringify({nivel:'erro',evento:'erro_http',requestId:req.requestId||null,metodo:req.method,rota:req.originalUrl,mensagem:String(erro?.message||'erro_interno'),hora:new Date().toISOString()}));
  if(res.headersSent)return;
  res.status(500).json({ok:false,erro:'erro_interno',requestId:req.requestId||null});
});

const host=process.env.HOST||'0.0.0.0';
const portaPlataforma=Number(process.env.PORT||0);
const inicial=Math.max(1024,Number(process.env.PORTA||4312));
const execucao=path.join(raiz,'.execucao');
const arquivoPid=path.join(execucao,'servidor.pid');
const arquivoPorta=path.join(execucao,'servidor.porta');
const usarGuardaLocal=!portaPlataforma;
let servidor=null;

async function iniciar(){
  fs.mkdirSync(execucao,{recursive:true});
  if(usarGuardaLocal){
    const existente=verificarInstancia({arquivoPid});
    if(existente.ativa)throw new Error('outra_instancia_ativa_pid_'+existente.pid);
  }
  const porta=portaPlataforma>0 ? portaPlataforma : await encontrarPortaLivre(inicial,20);
  servidor=http.createServer({maxHeaderSize:16384},app);
  servidor.headersTimeout=10000;
  servidor.requestTimeout=15000;
  servidor.keepAliveTimeout=5000;
  servidor.maxHeadersCount=100;
  await new Promise((resolve,reject)=>{servidor.once('error',reject);servidor.listen(porta,host,resolve);});
  if(usarGuardaLocal){
    fs.writeFileSync(arquivoPid,String(process.pid));
    fs.writeFileSync(arquivoPorta,String(porta));
  }
  console.log(`Trading Pages v12 em http://127.0.0.1:${porta} · bind ${host}:${porta}`);
}

function encerrar(){
  const finalizar=()=>{
    try{
      fecharBanco();
      if(usarGuardaLocal)removerPidProprio(arquivoPid);
    }finally{process.exit(0);}
  };
  if(servidor)servidor.close(finalizar);else finalizar();
  setTimeout(()=>{
    if(usarGuardaLocal)removerPidProprio(arquivoPid);
    process.exit(1);
  },3000).unref();
}
process.on('SIGINT',encerrar);
process.on('SIGTERM',encerrar);
iniciar().catch(e=>{
  console.error('Falha ao iniciar:',e);
  fecharBanco();
  if(usarGuardaLocal)removerPidProprio(arquivoPid);
  process.exit(1);
});
