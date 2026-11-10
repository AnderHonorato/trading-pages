const test = require('node:test');
const assert = require('node:assert/strict');
const fisica = require('../frontend/compartilhado/orbital-fisica.js');

test('órbita cosmo usa elipse e mantém sentido progressivo', () => {
  const a = fisica.calcularOrbitaCosmo({raio: 1, excentricidade: 0.18, inclinacao: 0.2, no: 0.1, angulo: 0});
  const b = fisica.calcularOrbitaCosmo({raio: 1, excentricidade: 0.18, inclinacao: 0.2, no: 0.1, angulo: 0.1});
  assert.ok(Number.isFinite(a.x) && Number.isFinite(a.y) && Number.isFinite(a.z));
  assert.notDeepEqual(a, b);
  assert.equal(fisica.sentidoOrbitalCosmo(), 1);
});

test('rotação própria avança continuamente e respeita fase', () => {
  const a = fisica.calcularRotacaoPropria({tempo: 2, velocidade: 0.4, fase: 0.3});
  const b = fisica.calcularRotacaoPropria({tempo: 3, velocidade: 0.4, fase: 0.3});
  assert.ok(b > a);
  assert.equal(a, 1.1);
});

test('raio orbital cresce com população para evitar aglomeração', () => {
  assert.equal(fisica.multiplicadorEspacamento(6), 1);
  assert.ok(fisica.multiplicadorEspacamento(14) > 1.35);
  assert.ok(fisica.escalaVisualPorPopulacao(14) < fisica.escalaVisualPorPopulacao(6));
});

test('sucção sempre aproxima o agente do núcleo e termina no centro', () => {
  const origem = {x: 100, y: 0};
  const centro = {x: 0, y: 0};
  const p1 = fisica.calcularSuccao({origem, centro, progresso: 0.25, fase: 0.2});
  const p2 = fisica.calcularSuccao({origem, centro, progresso: 0.75, fase: 0.2});
  assert.ok(Math.hypot(p2.x, p2.y) < Math.hypot(p1.x, p1.y));
  const fim = fisica.calcularSuccao({origem, centro, progresso: 1, fase: 0.2});
  assert.ok(Math.hypot(fim.x, fim.y) < 0.001);
});

test('humor reage a absorção, perigo, dano e estado positivo', () => {
  assert.equal(fisica.determinarHumor({vida: 80, vidaMax: 100, absorvendo: true}), 'panico');
  assert.equal(fisica.determinarHumor({vida: 20, vidaMax: 100}), 'machucado');
  assert.equal(fisica.determinarHumor({vida: 80, vidaMax: 100, ameacado: true}), 'assustado');
  assert.equal(fisica.determinarHumor({vida: 100, vidaMax: 100, feliz: true}), 'feliz');
  assert.equal(fisica.determinarHumor({vida: 100, vidaMax: 100}), 'neutro');
});
