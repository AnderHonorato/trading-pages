const { obterBanco } = require('../../../banco/banco.js');
const credenciais = require('../../seguranca/seguranca-credenciais.js');

const PROVEDORES = new Set(['openai','anthropic','deepseek','xai','gemini','openrouter']);

function chaveCripto() {
  if (!process.env.CHAVE_CRIPTOGRAFIA) throw new Error('chave_criptografia_ausente');
  return process.env.CHAVE_CRIPTOGRAFIA;
}
function validarProvedor(provedor) {
  const p=String(provedor||'').toLowerCase();
  if(!PROVEDORES.has(p)) throw new Error('provedor_invalido');
  return p;
}
function salvar({usuarioId,provedor,chave,modelo='',ativo=true}) {
  const p=validarProvedor(provedor);
  if(typeof chave!=='string'||chave.length<8||chave.length>512) throw new Error('chave_api_invalida');
  const pacote=credenciais.criptografarSegredo(chave,chaveCripto());
  obterBanco().prepare(`
    INSERT INTO configuracoes_api (usuario_id,provedor,chave_cifrada,iv,tag,modelo,ativo,atualizado_em)
    VALUES (?,?,?,?,?,?,?,?)
    ON CONFLICT(usuario_id,provedor) DO UPDATE SET
      chave_cifrada=excluded.chave_cifrada,iv=excluded.iv,tag=excluded.tag,
      modelo=excluded.modelo,ativo=excluded.ativo,atualizado_em=excluded.atualizado_em
  `).run(usuarioId,p,pacote.cifrado,pacote.iv,pacote.tag,String(modelo).slice(0,120),ativo?1:0,new Date().toISOString());
  return {provedor:p,modelo:String(modelo).slice(0,120),ativo:Boolean(ativo),configurada:true};
}
function listar(usuarioId) {
  return obterBanco().prepare('SELECT provedor,modelo,ativo,atualizado_em FROM configuracoes_api WHERE usuario_id=? ORDER BY provedor')
    .all(usuarioId).map(x=>({...x,ativo:Boolean(x.ativo),configurada:true}));
}
function obterSegredo(usuarioId,provedor) {
  const p=validarProvedor(provedor);
  const linha=obterBanco().prepare('SELECT chave_cifrada,iv,tag FROM configuracoes_api WHERE usuario_id=? AND provedor=?').get(usuarioId,p);
  if(!linha)return null;
  return credenciais.descriptografarSegredo({cifrado:linha.chave_cifrada,iv:linha.iv,tag:linha.tag},chaveCripto());
}
module.exports={salvar,listar,obterSegredo,PROVEDORES};
