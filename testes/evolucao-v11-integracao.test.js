const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const raiz = path.resolve(__dirname, '..');

test('v11 integra física do cosmo, meteoros e sucção', () => {
  const js = fs.readFileSync(path.join(raiz, 'evolucao-v11.js'), 'utf8');
  assert.match(js, /OrbitalFisica/);
  assert.match(js, /perigosExternos/);
  assert.match(js, /iniciarSuccao/);
  assert.match(js, /desenharRostoCosmo/);
  assert.match(js, /determinarHumor/);
});

test('HTML carrega física antes do controlador v11', () => {
  const html = fs.readFileSync(path.join(raiz, 'agentes-orbitais.html'), 'utf8');
  const fisica = html.indexOf('frontend/compartilhado/orbital-fisica.js');
  const v11 = html.indexOf('evolucao-v11.js');
  assert.ok(fisica >= 0);
  assert.ok(v11 > fisica);
  assert.equal(html.includes('evolucao-v10.js'), false);
});


test('Cosmo fixa núcleo como buraco negro e bloqueia disparos dos planetas', () => {
  const painel = fs.readFileSync(path.join(raiz, 'frontend/paginas/painel/painel.js'), 'utf8');
  assert.match(painel, /TEMA\.id==='cosmos'&&a&&a\.nome\)return false/);
  assert.match(painel, /nucleo\(nv,t,u,est\)\{nucleoCosmos\(5,t,u,est\);\}/);
});


test('Cosmo omite placa central textual para manter a arena limpa', () => {
  const painel = fs.readFileSync(path.join(raiz, 'frontend/paginas/painel/painel.js'), 'utf8');
  assert.match(painel, /if\(T\.id==='cosmos'\)return;\s*\/\* placa \+ barra de XP \*\//);
});


test('Cosmo não desenha balões textuais sobre os planetas', () => {
  const painel = fs.readFileSync(path.join(raiz, 'frontend/paginas/painel/painel.js'), 'utf8');
  assert.match(painel, /function desenhaBalao\(a\)\{if\(TEMA\.id==='cosmos'\)return;/);
});
