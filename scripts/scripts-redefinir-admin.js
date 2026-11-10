require('dotenv').config();
const crypto=require('node:crypto');
const {migrar}=require('../banco/banco-migrador.js');
const {obterBanco}=require('../banco/banco.js');
const {gerarHashSenha}=require('../servidor/seguranca/seguranca-credenciais.js');

migrar();
const usuario=(process.argv[2]||'ander').trim().toLowerCase();
const banco=obterBanco();
const linha=banco.prepare('SELECT id FROM usuarios WHERE usuario=?').get(usuario);
if(!linha){console.error('Usuário não encontrado:',usuario);process.exit(2);}
const senha=crypto.randomBytes(15).toString('base64url')+'!6R';
const agora=new Date().toISOString();
const transacao=banco.transaction(()=>{
  banco.prepare('UPDATE usuarios SET senha_hash=?,forcar_troca_senha=1,atualizado_em=? WHERE id=?').run(gerarHashSenha(senha),agora,linha.id);
  banco.prepare('UPDATE sessoes SET revogada_em=? WHERE usuario_id=? AND revogada_em IS NULL').run(agora,linha.id);
});
transacao();
console.log(JSON.stringify({ok:true,usuario,senhaTemporaria:senha,forcarTrocaSenha:true,sessoesRevogadas:true}));
