const test = require('node:test');
const assert = require('node:assert/strict');

const credenciais = require('../servidor/seguranca/seguranca-credenciais.js');
const trafego = require('../servidor/seguranca/seguranca-limite-trafego.js');

test('senha usa hash com salt e valida corretamente', () => {
  const hash = credenciais.gerarHashSenha('Senha-Forte-123!');
  assert.match(hash, /^scrypt\$/);
  assert.equal(credenciais.verificarSenha('Senha-Forte-123!', hash), true);
  assert.equal(credenciais.verificarSenha('errada', hash), false);
});

test('token de sessão não precisa ser armazenado em texto puro', () => {
  const token = credenciais.gerarTokenSessao();
  assert.ok(token.bruto.length >= 40);
  assert.match(token.hash, /^[a-f0-9]{64}$/);
  assert.notEqual(token.bruto, token.hash);
});

test('segredo de API é criptografado e recuperado com AES-GCM', () => {
  const chave = credenciais.gerarChaveCriptografia();
  const pacote = credenciais.criptografarSegredo('sk-exemplo-123', chave);
  assert.notEqual(pacote.cifrado, 'sk-exemplo-123');
  assert.equal(credenciais.descriptografarSegredo(pacote, chave), 'sk-exemplo-123');
});

test('bloqueio progressivo cresce de 1 minuto até 24 horas', () => {
  assert.equal(trafego.minutosBloqueioPorInfracao(1), 1);
  assert.equal(trafego.minutosBloqueioPorInfracao(2), 5);
  assert.equal(trafego.minutosBloqueioPorInfracao(3), 15);
  assert.equal(trafego.minutosBloqueioPorInfracao(4), 60);
  assert.equal(trafego.minutosBloqueioPorInfracao(5), 360);
  assert.equal(trafego.minutosBloqueioPorInfracao(6), 1440);
  assert.equal(trafego.minutosBloqueioPorInfracao(20), 1440);
});
