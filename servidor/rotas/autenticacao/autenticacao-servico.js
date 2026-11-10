const { obterBanco } = require('../../../banco/banco.js');
const credenciais = require('../../seguranca/seguranca-credenciais.js');
const doisFatores = require('../../seguranca/seguranca-2fa.js');

const agoraIso = () => new Date().toISOString();
const chaveCripto = () => {
  if (!process.env.CHAVE_CRIPTOGRAFIA) throw new Error('chave_criptografia_ausente');
  return process.env.CHAVE_CRIPTOGRAFIA;
};

function criarAdmin({ usuario, senha }) {
  const nome = String(usuario || '').trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,40}$/.test(nome)) throw new Error('usuario_invalido');
  if (String(senha || '').length < 12) throw new Error('senha_fraca');
  const banco = obterBanco();
  const existente = banco.prepare('SELECT id FROM usuarios WHERE usuario=?').get(nome);
  if (existente) throw new Error('usuario_existente');
  const agora = agoraIso();
  const info = banco.prepare(
    'INSERT INTO usuarios (usuario,senha_hash,papel,forcar_troca_senha,ativo,criado_em,atualizado_em) VALUES (?,?,?,?,?,?,?)'
  ).run(nome, credenciais.gerarHashSenha(senha), 'admin', 1, 1, agora, agora);
  return banco.prepare('SELECT id,usuario,papel,forcar_troca_senha,ativo FROM usuarios WHERE id=?').get(info.lastInsertRowid);
}

function autenticar({ usuario, senha }) {
  const nome = String(usuario || '').trim().toLowerCase();
  const linha = obterBanco().prepare(
    'SELECT id,usuario,senha_hash,papel,forcar_troca_senha,ativo,totp_ativo FROM usuarios WHERE usuario=?'
  ).get(nome);
  if (!linha || !linha.ativo || !credenciais.verificarSenha(String(senha || ''), linha.senha_hash)) {
    return { ok:false, erro:'credenciais_invalidas' };
  }
  delete linha.senha_hash;
  linha.totp_ativo = Boolean(linha.totp_ativo);
  return { ok:true, usuario:linha };
}

function criarSessao({ usuarioId, ip='', agenteUsuario='' }) {
  const banco = obterBanco();
  const token = credenciais.gerarTokenSessao();
  const csrfToken = credenciais.gerarTokenCsrf();
  const horas = Math.max(1, Math.min(72, Number(process.env.SESSAO_HORAS || 8)));
  const criadoEm = agoraIso();
  const expiraEm = new Date(Date.now() + horas * 3600000).toISOString();
  const info = banco.prepare(
    'INSERT INTO sessoes (usuario_id,token_hash,csrf_token,ip,agente_usuario,criado_em,expira_em) VALUES (?,?,?,?,?,?,?)'
  ).run(usuarioId, token.hash, csrfToken, String(ip).slice(0,100), String(agenteUsuario).slice(0,300), criadoEm, expiraEm);
  return { id:Number(info.lastInsertRowid), token:token.bruto, csrfToken, expiraEm };
}

function obterSessaoPorToken(tokenBruto) {
  if (!tokenBruto) return null;
  const hash = credenciais.hashToken(tokenBruto);
  const linha = obterBanco().prepare(`
    SELECT s.id,s.usuario_id,s.csrf_token,s.expira_em,s.revogada_em,
           u.usuario,u.papel,u.forcar_troca_senha,u.ativo,u.totp_ativo
    FROM sessoes s
    JOIN usuarios u ON u.id=s.usuario_id
    WHERE s.token_hash=?
  `).get(hash);
  if (!linha || linha.revogada_em || !linha.ativo || Date.parse(linha.expira_em) <= Date.now()) return null;
  linha.totp_ativo=Boolean(linha.totp_ativo);
  return linha;
}

function revogarSessao(tokenBruto) {
  if (!tokenBruto) return;
  obterBanco().prepare('UPDATE sessoes SET revogada_em=? WHERE token_hash=? AND revogada_em IS NULL')
    .run(agoraIso(), credenciais.hashToken(tokenBruto));
}

function trocarSenha({ usuarioId, senhaAtual, novaSenha }) {
  if (String(novaSenha || '').length < 12) throw new Error('senha_fraca');
  const banco = obterBanco();
  const linha = banco.prepare('SELECT senha_hash FROM usuarios WHERE id=? AND ativo=1').get(usuarioId);
  if (!linha || !credenciais.verificarSenha(senhaAtual, linha.senha_hash)) throw new Error('senha_atual_incorreta');
  banco.prepare('UPDATE usuarios SET senha_hash=?,forcar_troca_senha=0,atualizado_em=? WHERE id=?')
    .run(credenciais.gerarHashSenha(novaSenha), agoraIso(), usuarioId);
  banco.prepare('UPDATE sessoes SET revogada_em=? WHERE usuario_id=? AND revogada_em IS NULL')
    .run(agoraIso(), usuarioId);
  return true;
}

function preparar2fa({usuarioId,conta}) {
  const segredo=doisFatores.gerarSegredoBase32();
  const pacote=credenciais.criptografarSegredo(segredo,chaveCripto());
  obterBanco().prepare(`
    UPDATE usuarios SET totp_cifrado=?,totp_iv=?,totp_tag=?,totp_ativo=0,recuperacao_hashes=NULL,atualizado_em=? WHERE id=?
  `).run(pacote.cifrado,pacote.iv,pacote.tag,agoraIso(),usuarioId);
  const rotulo=encodeURIComponent('Trading Pages:'+String(conta||'admin'));
  const emissor=encodeURIComponent('Trading Pages');
  return {segredo,uri:`otpauth://totp/${rotulo}?secret=${segredo}&issuer=${emissor}&algorithm=SHA1&digits=6&period=30`};
}

function obterSegredo2fa(usuarioId) {
  const linha=obterBanco().prepare('SELECT totp_cifrado,totp_iv,totp_tag FROM usuarios WHERE id=?').get(usuarioId);
  if(!linha?.totp_cifrado)return null;
  return credenciais.descriptografarSegredo({cifrado:linha.totp_cifrado,iv:linha.totp_iv,tag:linha.totp_tag},chaveCripto());
}

function ativar2fa({usuarioId,codigo}) {
  const segredo=obterSegredo2fa(usuarioId);
  if(!segredo || !doisFatores.verificarTotp(segredo,codigo))throw new Error('codigo_2fa_invalido');
  const codigosRecuperacao=doisFatores.gerarCodigosRecuperacao(8);
  const hashes=codigosRecuperacao.map(doisFatores.hashCodigoRecuperacao);
  obterBanco().prepare('UPDATE usuarios SET totp_ativo=1,recuperacao_hashes=?,atualizado_em=? WHERE id=?')
    .run(JSON.stringify(hashes),agoraIso(),usuarioId);
  return {ativo:true,codigosRecuperacao};
}

function validarSegundoFator({usuarioId,codigo}) {
  const linha=obterBanco().prepare('SELECT totp_ativo,totp_cifrado,totp_iv,totp_tag,recuperacao_hashes FROM usuarios WHERE id=?').get(usuarioId);
  if(!linha?.totp_ativo)return true;
  const segredo=credenciais.descriptografarSegredo({cifrado:linha.totp_cifrado,iv:linha.totp_iv,tag:linha.totp_tag},chaveCripto());
  if(doisFatores.verificarTotp(segredo,codigo))return true;
  const hashes=linha.recuperacao_hashes?JSON.parse(linha.recuperacao_hashes):[];
  const indice=doisFatores.verificarCodigoRecuperacao(codigo,hashes);
  if(indice<0)return false;
  hashes.splice(indice,1);
  obterBanco().prepare('UPDATE usuarios SET recuperacao_hashes=?,atualizado_em=? WHERE id=?')
    .run(JSON.stringify(hashes),agoraIso(),usuarioId);
  return true;
}

function desativar2fa({usuarioId,codigo}) {
  if(!validarSegundoFator({usuarioId,codigo}))throw new Error('codigo_2fa_invalido');
  obterBanco().prepare('UPDATE usuarios SET totp_cifrado=NULL,totp_iv=NULL,totp_tag=NULL,totp_ativo=0,recuperacao_hashes=NULL,atualizado_em=? WHERE id=?')
    .run(agoraIso(),usuarioId);
  return true;
}

module.exports = {
  criarAdmin, autenticar, criarSessao, obterSessaoPorToken, revogarSessao, trocarSenha,
  preparar2fa, ativar2fa, validarSegundoFator, desativar2fa
};
