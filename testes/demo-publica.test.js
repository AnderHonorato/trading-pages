const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {gerar}=require('../scripts/scripts-gerar-demo-publica.js');

test('demo pública não inclui sessão, conta ou segredos',()=>{
  const pasta=gerar();
  const html=fs.readFileSync(path.join(pasta,'index.html'),'utf8');
  const js=fs.readFileSync(path.join(pasta,'evolucao-v11.js'),'utf8');
  assert.equal(html.includes('painel-sessao.js'),false);
  assert.equal(html.includes('painel-conta.css'),false);
  assert.equal(html.includes('demo-publica.css'),true);
  assert.equal(js.includes("fetch('/api/status'"),false);
  assert.equal(js.includes("fetch('/api/sinais'"),false);
  assert.equal(js.includes('./api/status.json'),true);
  assert.equal(fs.existsSync(path.join(pasta,'.env')),false);
  assert.equal(fs.existsSync(path.join(pasta,'banco')),false);
  assert.equal(fs.existsSync(path.join(pasta,'servidor')),false);
});

test('demo tem JSONs locais e marcador explícito de simulação',()=>{
  const pasta=gerar();
  const status=JSON.parse(fs.readFileSync(path.join(pasta,'api/status.json'),'utf8'));
  const html=fs.readFileSync(path.join(pasta,'index.html'),'utf8');
  assert.equal(status.publica,true);
  assert.equal(status.conectadoCorretora,false);
  assert.match(html,/Demo pública · dados simulados/);
});
