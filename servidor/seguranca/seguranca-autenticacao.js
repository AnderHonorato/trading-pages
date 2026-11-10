const autenticacao=require('../rotas/autenticacao/autenticacao-servico.js');
const {lerCookies}=require('./seguranca-http.js');

const COOKIE_SESSAO='trading_sessao';

function carregarSessao(req,_res,next){
  const token=lerCookies(req)[COOKIE_SESSAO];
  req.tokenSessao=token||null;
  req.sessao=token?autenticacao.obterSessaoPorToken(token):null;
  next();
}

function exigirAutenticacao(req,res,next){
  if(!req.sessao)return res.status(401).json({ok:false,erro:'autenticacao_necessaria'});
  next();
}

function exigirCsrf(req,res,next){
  if(!req.sessao)return res.status(401).json({ok:false,erro:'autenticacao_necessaria'});
  const recebido=String(req.get('x-csrf-token')||'');
  if(!recebido || recebido!==req.sessao.csrf_token)return res.status(403).json({ok:false,erro:'csrf_invalido'});
  next();
}

module.exports={COOKIE_SESSAO,carregarSessao,exigirAutenticacao,exigirCsrf};
