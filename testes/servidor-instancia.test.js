const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const instancia=require('../servidor/servidor-instancia.js');

test('PID inexistente é tratado como registro obsoleto',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'trading-inst-'));
  const arq=path.join(dir,'servidor.pid');
  fs.writeFileSync(arq,'99999999');
  const r=instancia.verificarInstancia({arquivoPid:arq});
  assert.equal(r.ativa,false);
  assert.equal(fs.existsSync(arq),false);
});

test('PID do processo atual não bloqueia a própria instância',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'trading-inst-'));
  const arq=path.join(dir,'servidor.pid');
  fs.writeFileSync(arq,String(process.pid));
  const r=instancia.verificarInstancia({arquivoPid:arq,pidAtual:process.pid});
  assert.equal(r.ativa,false);
  instancia.removerPidProprio(arq,process.pid);
  assert.equal(fs.existsSync(arq),false);
});