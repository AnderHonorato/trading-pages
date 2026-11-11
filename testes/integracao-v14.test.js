const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const raiz=path.resolve(__dirname,'..');

test('HTML carrega movimentos temáticos antes do controlador e painel',()=>{
  const html=fs.readFileSync(path.join(raiz,'agentes-orbitais.html'),'utf8');
  const m=html.indexOf('movimentos-tematicos.js');
  const e=html.indexOf('evolucao-v11.js');
  const p=html.indexOf('frontend/paginas/painel/painel.js');
  assert.ok(m>=0&&e>m&&p>e);
});

test('painel posiciona temas comuns pelo motor temático e restringe órbita ao Cosmo',()=>{
  const js=fs.readFileSync(path.join(raiz,'frontend/paginas/painel/painel.js'),'utf8');
  assert.match(js,/const MOVIMENTOS=window\.MovimentosTematicos/);
  assert.match(js,/TEMA\.id==='cosmos'\s*\?\s*posOrbita/);
  assert.match(js,/MOVIMENTOS\.calcular\(TEMA\.id/);
  assert.match(js,/if\(TEMA\.id==='cosmos'\)\{\s*CONFIG\.orbitas\.forEach/);
  assert.match(js,/else desenhaGuiasTematicas\(t\)/);
});

test('controlador não oferece órbita genérica fora do Cosmo',()=>{
  const js=fs.readFileSync(path.join(raiz,'evolucao-v11.js'),'utf8');
  assert.match(js,/botaoModo\.disabled=!cosmo/);
  assert.match(js,/somente o Cosmo usa órbita/);
  assert.match(js,/modo:tema\(\)\?\.id==='cosmos'\?'orbita-cosmica':'tematico:'/);
  assert.match(js,/movimento:MOVIMENTOS\?\.nomeMovimento/);
});

test('V14 mantém 50 níveis e reciclagem por relevância',()=>{
  const painel=fs.readFileSync(path.join(raiz,'frontend/paginas/painel/painel.js'),'utf8');
  const evo=fs.readFileSync(path.join(raiz,'evolucao-v11.js'),'utf8');
  assert.match(painel,/Array\.from\(\{length:50\}/);
  assert.match(evo,/escolherMenorRelevancia/);
  assert.match(evo,/SUBSTITUI/);
});
