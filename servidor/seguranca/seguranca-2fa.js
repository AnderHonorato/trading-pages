const crypto=require('node:crypto');
const ALFABETO='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function codificarBase32(buffer){
  let bits='',saida='';
  for(const byte of buffer)bits+=byte.toString(2).padStart(8,'0');
  for(let i=0;i<bits.length;i+=5){
    const bloco=bits.slice(i,i+5).padEnd(5,'0');
    saida+=ALFABETO[parseInt(bloco,2)];
  }
  return saida;
}
function decodificarBase32(texto){
  let bits='';
  for(const c of String(texto).replace(/=+$/,'').toUpperCase()){
    const i=ALFABETO.indexOf(c);if(i<0)throw new Error('segredo_2fa_invalido');
    bits+=i.toString(2).padStart(5,'0');
  }
  const bytes=[];for(let i=0;i+8<=bits.length;i+=8)bytes.push(parseInt(bits.slice(i,i+8),2));
  return Buffer.from(bytes);
}
function gerarSegredoBase32(){return codificarBase32(crypto.randomBytes(20));}
function gerarTotp(segredo,instante=Date.now(),periodo=30,digitos=6){
  const contador=Math.floor(Number(instante)/1000/periodo);
  const buf=Buffer.alloc(8);buf.writeBigUInt64BE(BigInt(contador));
  const h=crypto.createHmac('sha1',decodificarBase32(segredo)).update(buf).digest();
  const offset=h[h.length-1]&15;
  const bin=((h[offset]&0x7f)<<24)|((h[offset+1]&0xff)<<16)|((h[offset+2]&0xff)<<8)|(h[offset+3]&0xff);
  return String(bin%(10**digitos)).padStart(digitos,'0');
}
function verificarTotp(segredo,codigo,instante=Date.now()){
  const recebido=String(codigo||'').replace(/\s/g,'');
  if(!/^\d{6}$/.test(recebido))return false;
  for(const deslocamento of[-30000,0,30000]){
    const esperado=gerarTotp(segredo,Number(instante)+deslocamento);
    if(crypto.timingSafeEqual(Buffer.from(esperado),Buffer.from(recebido)))return true;
  }
  return false;
}
function gerarCodigosRecuperacao(quantidade=8){
  return Array.from({length:quantidade},()=>crypto.randomBytes(6).toString('hex').toUpperCase().match(/.{1,4}/g).join('-'));
}
function hashCodigoRecuperacao(codigo){return crypto.createHash('sha256').update(String(codigo).trim().toUpperCase()).digest('hex');}
function verificarCodigoRecuperacao(codigo,hashes){
  const hash=hashCodigoRecuperacao(codigo);
  return Array.isArray(hashes)?hashes.findIndex(x=>{try{return crypto.timingSafeEqual(Buffer.from(x,'hex'),Buffer.from(hash,'hex'));}catch{return false;}}):-1;
}
module.exports={gerarSegredoBase32,gerarTotp,verificarTotp,gerarCodigosRecuperacao,hashCodigoRecuperacao,verificarCodigoRecuperacao};
