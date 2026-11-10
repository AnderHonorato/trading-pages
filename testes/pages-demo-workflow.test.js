const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const workflow=fs.readFileSync(path.resolve(__dirname,'../.github/workflows/pages-demo.yml'),'utf8');

test('Pages publica apenas a demo gerada e testada',()=>{
  assert.match(workflow,/npm run testar:demo-publica/);
  assert.match(workflow,/path: \.site-publico/);
  assert.match(workflow,/actions\/upload-pages-artifact@v3/);
  assert.match(workflow,/actions\/deploy-pages@v4/);
});

test('Pages tem permissões mínimas necessárias',()=>{
  assert.match(workflow,/contents: read/);
  assert.match(workflow,/pages: write/);
  assert.match(workflow,/id-token: write/);
});

test('Pages tenta habilitação explícita e usa ambiente github-pages',()=>{
  assert.match(workflow,/actions\/configure-pages@v5/);
  assert.match(workflow,/enablement: true/);
  assert.match(workflow,/name: github-pages/);
});
