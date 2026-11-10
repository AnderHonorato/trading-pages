const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const workflow=fs.readFileSync(path.resolve(__dirname,'../.github/workflows/ci-release.yml'),'utf8');

test('CI roda no main e em pull requests',()=>{
  assert.match(workflow,/push:\s*\n\s*branches: \[main\]/);
  assert.match(workflow,/pull_request:\s*\n\s*branches: \[main\]/);
});

test('CI cobre gates críticos e testes visuais',()=>{
  for(const comando of ['npm ci','npm run verificar','npm run testar','npm run auditar:seguranca','npm audit --omit=dev','npm run testar:http','npm run testar:2fa','npm run testar:visual']){
    assert.ok(workflow.includes(comando),comando+' ausente');
  }
});

test('release só é publicado após sucesso e fonte usa git archive',()=>{
  assert.match(workflow,/Preparar pacote de release\s*\n\s*if: success\(\)/);
  assert.match(workflow,/Publicar release validado\s*\n\s*if: success\(\)/);
  assert.match(workflow,/git archive --format=zip/);
  assert.match(workflow,/actions\/upload-artifact@v4/);
});

test('falhas geram artefato de diagnóstico separado',()=>{
  assert.match(workflow,/Publicar diagnóstico de falha\s*\n\s*if: failure\(\)/);
  assert.match(workflow,/trading-pages-v13-falha-/);
});
