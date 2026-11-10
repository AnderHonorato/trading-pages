const {obterBanco}=require('../banco/banco.js');
const autenticacao=require('./rotas/autenticacao/autenticacao-servico.js');

function garantirAdminInicial({usuario,senha}={}){
  const banco=obterBanco();
  const total=Number(banco.prepare('SELECT COUNT(*) AS n FROM usuarios').get().n||0);
  if(total>0)return {criado:false,motivo:'usuarios_existentes'};
  const nome=String(usuario||'').trim().toLowerCase();
  const segredo=String(senha||'');
  if(!nome||!segredo)return {criado:false,motivo:'credenciais_ausentes'};
  const criado=autenticacao.criarAdmin({usuario:nome,senha:segredo});
  return {criado:true,usuario:criado.usuario};
}

module.exports={garantirAdminInicial};
