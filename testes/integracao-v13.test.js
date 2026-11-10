const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const raiz=path.resolve(__dirname,'..');

test('HTML carrega coreografia e conversa antes do motor',()=>{
  const html=fs.readFileSync(path.join(raiz,'agentes-orbitais.html'),'utf8');
  const c=html.indexOf('orbital-coreografia.js');
  const f=html.indexOf('conversa-contextual.js');
  const v=html.indexOf('evolucao-v11.js');
  const p=html.indexOf('frontend/paginas/painel/painel.js');
  assert.ok(c>=0&&f>c&&v>f&&p>v);
});

test('painel usa slots orbitais e fila contextual',()=>{
  const js=fs.readFileSync(path.join(raiz,'frontend/paginas/painel/painel.js'),'utf8');
  assert.match(js,/OrbitalCoreografia/);
  assert.match(js,/distribuirFases/);
  assert.match(js,/interpolarAngulo/);
  assert.match(js,/ConversaContextual/);
  assert.match(js,/criarFila\(\{maxAtivas:1/);
  assert.match(js,/function falarContextual/);
  assert.equal(js.includes("'pronto!'"),false);
});

test('motor usa coreografia para micro movimento e separação',()=>{
  const js=fs.readFileSync(path.join(raiz,'evolucao-v11.js'),'utf8');
  assert.match(js,/OrbitalCoreografia/);
  assert.match(js,/escalaMicroMovimento/);
  assert.match(js,/resolverSeparacao/);
});

test('V13 libera o centro e garante um único balão visual',()=>{
  const js=fs.readFileSync(path.join(raiz,'frontend/paginas/painel/painel.js'),'utf8');
  assert.equal(js.includes('CONFIG.nucleo.titulo'),false);
  assert.match(js,/AG\.forEach\(outro=>\{if\(outro!==a\)outro\.balao=null;/);
  assert.match(js,/intervaloPulso:1450/);
});

test('API visual expõe layout sem dados sensíveis para QA de colisão',()=>{
  const js=fs.readFileSync(path.join(raiz,'frontend/paginas/painel/painel.js'),'utf8');
  assert.match(js,/layout\(\)\{return ativos\(\)\.filter\(a=>a\.p\)/);
  assert.equal(js.includes('senha_hash'),false);
  assert.equal(js.includes('token_hash'),false);
});
