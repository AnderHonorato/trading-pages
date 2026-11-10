const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'trading-trafego-'));
process.env.BANCO_CAMINHO = path.join(tmp, 'teste.sqlite');

const migrador = require('../banco/banco-migrador.js');
const trafego = require('../servidor/seguranca/seguranca-trafego-servico.js');

test.before(() => migrador.migrar());

test('quinta falha de login bloqueia por um minuto e informa retry-after', () => {
  const chave='127.0.0.1|ander';
  for(let i=0;i<4;i++) assert.equal(trafego.registrarFalha({grupo:'entrar',chave,limite:5,janelaMinutos:15}).bloqueado,false);
  const quinto=trafego.registrarFalha({grupo:'entrar',chave,limite:5,janelaMinutos:15});
  assert.equal(quinto.bloqueado,true);
  assert.ok(quinto.retryAfter>=50 && quinto.retryAfter<=60);
  const consulta=trafego.consultarBloqueio({grupo:'entrar',chave});
  assert.equal(consulta.bloqueado,true);
});

test('limpar sucesso remove falhas sem apagar histórico de infração', () => {
  const chave='10.0.0.2|ander';
  trafego.registrarFalha({grupo:'entrar',chave,limite:5,janelaMinutos:15});
  trafego.limparFalhas({grupo:'entrar',chave});
  const estado=trafego.obterEstado({grupo:'entrar',chave});
  assert.equal(estado.falhas,0);
});
