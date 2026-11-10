require('dotenv').config();
const crypto=require('node:crypto');
const {migrar}=require('../banco/banco-migrador.js');
const autenticacao=require('../servidor/rotas/autenticacao/autenticacao-servico.js');

migrar();
const usuario=(process.argv[2]||'ander').trim().toLowerCase();
const senha=crypto.randomBytes(15).toString('base64url')+'!7a';
try{
  const criado=autenticacao.criarAdmin({usuario,senha});
  console.log(JSON.stringify({ok:true,usuario:criado.usuario,senhaTemporaria:senha,forcarTrocaSenha:true}));
}catch(e){
  if(e.message==='usuario_existente'){
    console.log(JSON.stringify({ok:false,erro:'usuario_existente',usuario}));
    process.exitCode=2;
  }else throw e;
}
