const test=require('node:test');
const assert=require('node:assert/strict');
const dois=require('../servidor/seguranca/seguranca-2fa.js');

test('TOTP gerado valida na mesma janela e falha com código incorreto',()=>{
  const segredo=dois.gerarSegredoBase32();
  const instante=Date.UTC(2026,10,9,22,0,0);
  const codigo=dois.gerarTotp(segredo,instante);
  assert.match(codigo,/^\d{6}$/);
  assert.equal(dois.verificarTotp(segredo,codigo,instante),true);
  assert.equal(dois.verificarTotp(segredo,'000000',instante),codigo==='000000');
});

test('códigos de recuperação são únicos e verificáveis por hash',()=>{
  const codigos=dois.gerarCodigosRecuperacao(8);
  assert.equal(codigos.length,8);
  assert.equal(new Set(codigos).size,8);
  const hashes=codigos.map(dois.hashCodigoRecuperacao);
  assert.equal(dois.verificarCodigoRecuperacao(codigos[2],hashes),2);
  assert.equal(dois.verificarCodigoRecuperacao('INVALIDO',hashes),-1);
});
