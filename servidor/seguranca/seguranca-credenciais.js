const crypto = require('node:crypto');

function gerarHashSenha(senha) {
  if (typeof senha !== 'string' || senha.length < 10) throw new Error('senha_invalida');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(senha, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

function verificarSenha(senha, armazenado) {
  try {
    const [metodo, salt, esperadoHex] = String(armazenado).split('$');
    if (metodo !== 'scrypt' || !salt || !esperadoHex) return false;
    const esperado = Buffer.from(esperadoHex, 'hex');
    const obtido = crypto.scryptSync(String(senha), salt, esperado.length);
    return esperado.length === obtido.length && crypto.timingSafeEqual(esperado, obtido);
  } catch {
    return false;
  }
}

function gerarTokenSessao() {
  const bruto = crypto.randomBytes(32).toString('base64url');
  return { bruto, hash: crypto.createHash('sha256').update(bruto).digest('hex') };
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token || '')).digest('hex');
}

function gerarTokenCsrf() {
  return crypto.randomBytes(24).toString('base64url');
}

function gerarChaveCriptografia() {
  return crypto.randomBytes(32).toString('base64');
}

function normalizarChave(chave) {
  const buffer = Buffer.from(String(chave || ''), 'base64');
  if (buffer.length !== 32) throw new Error('chave_criptografia_invalida');
  return buffer;
}

function criptografarSegredo(valor, chave) {
  const iv = crypto.randomBytes(12);
  const cifra = crypto.createCipheriv('aes-256-gcm', normalizarChave(chave), iv);
  const cifrado = Buffer.concat([cifra.update(String(valor), 'utf8'), cifra.final()]);
  return {
    cifrado: cifrado.toString('base64'),
    iv: iv.toString('base64'),
    tag: cifra.getAuthTag().toString('base64')
  };
}

function descriptografarSegredo(pacote, chave) {
  const decifra = crypto.createDecipheriv(
    'aes-256-gcm',
    normalizarChave(chave),
    Buffer.from(pacote.iv, 'base64')
  );
  decifra.setAuthTag(Buffer.from(pacote.tag, 'base64'));
  return Buffer.concat([
    decifra.update(Buffer.from(pacote.cifrado, 'base64')),
    decifra.final()
  ]).toString('utf8');
}

module.exports = {
  gerarHashSenha,
  verificarSenha,
  gerarTokenSessao,
  hashToken,
  gerarTokenCsrf,
  gerarChaveCriptografia,
  criptografarSegredo,
  descriptografarSegredo
};
