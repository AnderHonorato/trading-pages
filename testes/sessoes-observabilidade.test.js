const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'trading-v12-'));
process.env.BANCO_CAMINHO=path.join(tmp,'teste.sqlite');
process.env.CHAVE_CRIPTOGRAFIA=Buffer.alloc(32,9).toString('base64');

const {migrar}=require('../banco/banco-migrador.js');
const autenticacao=require('../servidor/rotas/autenticacao/autenticacao-servico.js');
const observabilidade=require('../servidor/observabilidade/observabilidade.js');

test.before(()=>migrar());

test('lista sessões do usuário sem expor token ou csrf e identifica a atual',()=>{
  const usuario=autenticacao.criarAdmin({usuario:'ander_v12',senha:'Senha-Segura-V12!'});
  const atual=autenticacao.criarSessao({usuarioId:usuario.id,ip:'192.168.1.10',agenteUsuario:'Mozilla/5.0 Android Chrome'});
  const outra=autenticacao.criarSessao({usuarioId:usuario.id,ip:'192.168.1.20',agenteUsuario:'Mozilla/5.0 Windows Chrome'});
  const lista=autenticacao.listarSessoes({usuarioId:usuario.id,tokenAtual:atual.token});
  assert.equal(lista.length,2);
  assert.equal(lista.filter(x=>x.atual).length,1);
  assert.equal(lista.find(x=>x.atual).id,atual.id);
  assert.equal('token_hash' in lista[0],false);
  assert.equal('csrf_token' in lista[0],false);
  assert.ok(lista.every(x=>typeof x.dispositivo==='string'&&x.dispositivo.length>0));
  assert.ok(lista.some(x=>x.id===outra.id));
});

test('usuário só revoga suas próprias sessões',()=>{
  const a=autenticacao.criarAdmin({usuario:'a_v12',senha:'Senha-Segura-A12!'});
  const b=autenticacao.criarAdmin({usuario:'b_v12',senha:'Senha-Segura-B12!'});
  const sa=autenticacao.criarSessao({usuarioId:a.id,ip:'127.0.0.1',agenteUsuario:'A'});
  const sb=autenticacao.criarSessao({usuarioId:b.id,ip:'127.0.0.2',agenteUsuario:'B'});
  assert.equal(autenticacao.revogarSessaoPorId({usuarioId:a.id,sessaoId:sb.id}),false);
  assert.equal(autenticacao.revogarSessaoPorId({usuarioId:a.id,sessaoId:sa.id}),true);
  assert.equal(autenticacao.obterSessaoPorToken(sa.token),null);
  assert.notEqual(autenticacao.obterSessaoPorToken(sb.token),null);
});

test('encerrar outras sessões preserva a atual',()=>{
  const u=autenticacao.criarAdmin({usuario:'c_v12',senha:'Senha-Segura-C12!'});
  const atual=autenticacao.criarSessao({usuarioId:u.id,ip:'1.1.1.1',agenteUsuario:'Atual'});
  const outra=autenticacao.criarSessao({usuarioId:u.id,ip:'2.2.2.2',agenteUsuario:'Outra'});
  const encerradas=autenticacao.revogarOutrasSessoes({usuarioId:u.id,tokenAtual:atual.token});
  assert.equal(encerradas,1);
  assert.notEqual(autenticacao.obterSessaoPorToken(atual.token),null);
  assert.equal(autenticacao.obterSessaoPorToken(outra.token),null);
});

test('observabilidade gera request id, métricas e health sem segredos',()=>{
  const obs=observabilidade.criarObservabilidade({versao:'13.0'});
  const req={headers:{},method:'GET',originalUrl:'/api/saude'};
  const cabecalhos={};
  const res={statusCode:200,setHeader:(k,v)=>cabecalhos[k]=v,on:(evento,fn)=>{if(evento==='finish')res.finalizar=fn;}};
  let proximo=false;
  obs.middleware(req,res,()=>{proximo=true;});
  assert.equal(proximo,true);
  assert.match(cabecalhos['X-Request-Id'],/^[a-f0-9-]{20,}$/);
  res.finalizar();
  const snap=obs.snapshot();
  assert.equal(snap.requisicoes.total,1);
  assert.equal(snap.requisicoes.status2xx,1);
  const health=obs.health();
  assert.equal(health.ok,true);
  assert.equal(health.versao,'13.0');
  assert.equal('segredos' in health,false);
});
