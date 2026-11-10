const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'trading-bootstrap-'));
process.env.BANCO_CAMINHO=path.join(tmp,'teste.sqlite');
process.env.CHAVE_CRIPTOGRAFIA=Buffer.alloc(32,5).toString('base64');

const {migrar}=require('../banco/banco-migrador.js');
const {obterBanco}=require('../banco/banco.js');
const {garantirAdminInicial}=require('../servidor/bootstrap-admin.js');
const auth=require('../servidor/rotas/autenticacao/autenticacao-servico.js');

test.before(()=>migrar());

test('não cria admin sem credenciais de bootstrap',()=>{
  const r=garantirAdminInicial({});
  assert.equal(r.criado,false);
  assert.equal(r.motivo,'credenciais_ausentes');
});

test('cria admin somente quando banco está vazio',()=>{
  const r=garantirAdminInicial({usuario:'ander',senha:'Senha-Temporaria-Publica-12!'});
  assert.equal(r.criado,true);
  assert.equal(r.usuario,'ander');
  assert.equal(auth.autenticar({usuario:'ander',senha:'Senha-Temporaria-Publica-12!'}).ok,true);

  const r2=garantirAdminInicial({usuario:'outro',senha:'Outra-Senha-Segura-12!'});
  assert.equal(r2.criado,false);
  assert.equal(r2.motivo,'usuarios_existentes');
  assert.equal(obterBanco().prepare('SELECT COUNT(*) AS n FROM usuarios').get().n,1);
});
