const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'trading-v11-'));
process.env.BANCO_CAMINHO = path.join(tmp, 'teste.sqlite');
process.env.CHAVE_CRIPTOGRAFIA = Buffer.alloc(32, 7).toString('base64');

const banco = require('../banco/banco.js');
const migrador = require('../banco/banco-migrador.js');
const autenticacao = require('../servidor/rotas/autenticacao/autenticacao-servico.js');
const apis = require('../servidor/rotas/configuracoes/configuracoes-api-servico.js');

test.before(() => migrador.migrar());

test('admin pode ser criado, autenticado e forçado a trocar senha', () => {
  const criado = autenticacao.criarAdmin({usuario:'ander', senha:'Senha-Temporaria-123!'});
  assert.equal(criado.usuario, 'ander');
  assert.equal(criado.forcar_troca_senha, 1);
  const login = autenticacao.autenticar({usuario:'ander', senha:'Senha-Temporaria-123!'});
  assert.equal(login.ok, true);
  assert.equal(login.usuario.usuario, 'ander');
});

test('sessão guarda apenas hash do token e pode ser revogada', () => {
  const login = autenticacao.autenticar({usuario:'ander', senha:'Senha-Temporaria-123!'});
  const sessao = autenticacao.criarSessao({usuarioId:login.usuario.id, ip:'127.0.0.1', agenteUsuario:'teste'});
  const linha = banco.obterBanco().prepare('SELECT token_hash FROM sessoes WHERE id=?').get(sessao.id);
  assert.notEqual(linha.token_hash, sessao.token);
  assert.equal(autenticacao.obterSessaoPorToken(sessao.token).usuario, 'ander');
  autenticacao.revogarSessao(sessao.token);
  assert.equal(autenticacao.obterSessaoPorToken(sessao.token), null);
});

test('configuração de API não devolve segredo em listagem', () => {
  const usuario = banco.obterBanco().prepare('SELECT id FROM usuarios WHERE usuario=?').get('ander');
  apis.salvar({usuarioId:usuario.id, provedor:'openai', chave:'sk-teste-super-secreta', modelo:'gpt-5', ativo:true});
  const lista = apis.listar(usuario.id);
  assert.equal(lista[0].provedor, 'openai');
  assert.equal(lista[0].configurada, true);
  assert.equal('chave' in lista[0], false);
  assert.equal(apis.obterSegredo(usuario.id, 'openai'), 'sk-teste-super-secreta');
});


test('2FA TOTP pode ser preparado, ativado e validado', () => {
  const usuario = banco.obterBanco().prepare('SELECT id FROM usuarios WHERE usuario=?').get('ander');
  const preparado = autenticacao.preparar2fa({usuarioId:usuario.id, conta:'ander'});
  const dois = require('../servidor/seguranca/seguranca-2fa.js');
  const codigo = dois.gerarTotp(preparado.segredo);
  const ativado = autenticacao.ativar2fa({usuarioId:usuario.id, codigo});
  assert.equal(ativado.ativo, true);
  assert.equal(ativado.codigosRecuperacao.length, 8);
  assert.equal(autenticacao.validarSegundoFator({usuarioId:usuario.id, codigo}), true);
  assert.equal(autenticacao.validarSegundoFator({usuarioId:usuario.id, codigo:'111111'}), false);
});
