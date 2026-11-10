const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const raiz=path.resolve(__dirname,'..');

test('servidor usa guarda local e aceita PORT de plataforma sem varredura',()=>{
  const js=fs.readFileSync(path.join(raiz,'servidor/servidor.js'),'utf8');
  assert.match(js,/process\.env\.PORT/);
  assert.match(js,/verificarInstancia/);
  assert.match(js,/removerPidProprio/);
  assert.match(js,/portaPlataforma>0 \? portaPlataforma : await encontrarPortaLivre/);
  assert.match(js,/Trading Pages v13/);
});