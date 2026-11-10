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
const autenticacaoRotas=require('./rotas/autenticacao/autenticacao-rotas.js');
const configuracoesRotas=require('./rotas/configuracoes/configuracoes-rotas.js');

if(!process.env.CHAVE_CRIPTOGRAFIA)throw new Error('CHAVE_CRIPTOGRAFIA ausente no .env');
migrar();

const raiz=path.resolve(__dirname,'..');
const app=express();
app.disable('x-powered-by');
if(String(process.env.TRUST_PROXY).toLowerCase()==='true')app.set('trust proxy',1);
app.use(segurancaCabecalhos());
app.use(compression());
app.use(express.json({limit:'100kb'}));
app.use(express.urlencoded({extended:false,limit:'100kb'}));
app.use(carregarSessao);

app.use('/frontend',express.static(path.join(raiz,'frontend'),{fallthrough:false,maxAge:'1h'}));
for(const arquivo of ['evolucao-v11.js','evolucao-v11.css']){
  app.get('/'+arquivo,(_req,res)=>res.sendFile(path.join(raiz,arquivo)));
}

app.use('/api',limitarRequisicoes({grupo:'api_geral',limite:120,janelaMinutos:1}));
app.use('/api/autenticacao',autenticacaoRotas);
app.use('/api/configuracoes',limitarRequisicoes({grupo:'admin',limite:60,janelaMinutos:1,chave:req=>req.sessao?.usuario||req.ip}),configuracoesRotas);

app.get('/api/status',(req,res)=>{
  if(!req.sessao)return res.status(401).json({ok:false,erro:'autenticacao_necessaria'});
  res.set('Cache-Control','no-store');
  res.json({ok:true,versao:'11.0',modo:'demonstracao',conectadoCorretora:false,orquestracao:'visual',hora:new Date().toISOString()});
});
app.get('/api/sinais',(req,res)=>{
  if(!req.sessao)return res.status(401).json({ok:false,erro:'autenticacao_necessaria'});
  const agentes=['KELLY','SPOTTER','TAKER','CLOSER','PRIOR','EDGE','LUNA','RUBI','AXO'];
  const ciclo=Math.floor(Date.now()/30000);
  res.set('Cache-Control','no-store');
  res.json({ok:true,demonstracao:true,versao:'11.0',eventos:[{id:'demo-'+ciclo,tipo:'observacao',agente:agentes[ciclo%agentes.length],horario:new Date(ciclo*30000).toISOString(),descricao:'Pulso visual demonstrativo — sem ordem real.'}]});
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

const host=process.env.HOST||'0.0.0.0';
const inicial=Math.max(1024,Number(process.env.PORTA||4312));
let servidor=null;

async function iniciar(){
  const porta=await encontrarPortaLivre(inicial,20);
  servidor=http.createServer({maxHeaderSize:16384},app);
  servidor.headersTimeout=10000;
  servidor.requestTimeout=15000;
  servidor.keepAliveTimeout=5000;
  servidor.maxHeadersCount=100;
  await new Promise((resolve,reject)=>{servidor.once('error',reject);servidor.listen(porta,host,resolve);});
  const execucao=path.join(raiz,'.execucao');fs.mkdirSync(execucao,{recursive:true});
  fs.writeFileSync(path.join(execucao,'servidor.pid'),String(process.pid));
  fs.writeFileSync(path.join(execucao,'servidor.porta'),String(porta));
  console.log(`Trading Pages v11 em http://127.0.0.1:${porta} · LAN habilitada em ${host}:${porta}`);
}

function encerrar(){
  const finalizar=()=>{try{fecharBanco();}finally{process.exit(0);}};
  if(servidor)servidor.close(finalizar);else finalizar();
  setTimeout(()=>process.exit(1),3000).unref();
}
process.on('SIGINT',encerrar);
process.on('SIGTERM',encerrar);
iniciar().catch(e=>{console.error('Falha ao iniciar:',e);fecharBanco();process.exit(1);});
