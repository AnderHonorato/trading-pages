const express=require('express');
const autenticacao=require('./autenticacao-servico.js');
const trafego=require('../../seguranca/seguranca-trafego-servico.js');
const credenciais=require('../../seguranca/seguranca-credenciais.js');
const {COOKIE_SESSAO,exigirAutenticacao,exigirCsrf}=require('../../seguranca/seguranca-autenticacao.js');
const {lerCookies,cookie,ipCliente}=require('../../seguranca/seguranca-http.js');
const {registrarAuditoria}=require('../../seguranca/seguranca-auditoria.js');

const rotas=express.Router();
const COOKIE_CSRF_ANON='trading_csrf_anon';
const seguro=()=>String(process.env.MODO_PRODUCAO).toLowerCase()==='true';

function validarCsrfAnon(req){
  const cookies=lerCookies(req);
  const header=String(req.get('x-csrf-token')||'');
  return Boolean(header&&cookies[COOKIE_CSRF_ANON]&&header===cookies[COOKIE_CSRF_ANON]);
}
function registrarTentativaRuim({chave,usuario,ip,acao='login_falhou'}){
  const falha=trafego.registrarFalha({grupo:'entrar',chave,limite:5,janelaMinutos:15});
  registrarAuditoria({acao,ip,detalhes:{usuario}});
  return falha;
}

rotas.get('/iniciar',(req,res)=>{
  const csrf=credenciais.gerarTokenCsrf();
  res.setHeader('Set-Cookie',cookie(COOKIE_CSRF_ANON,csrf,{httpOnly:false,secure:seguro(),sameSite:'Lax',maxAge:900}));
  res.json({ok:true,csrf});
});

rotas.get('/sessao',(req,res)=>{
  if(!req.sessao)return res.json({ok:true,autenticado:false});
  res.json({ok:true,autenticado:true,usuario:req.sessao.usuario,papel:req.sessao.papel,
    forcarTrocaSenha:Boolean(req.sessao.forcar_troca_senha),doisFatoresAtivo:Boolean(req.sessao.totp_ativo),csrf:req.sessao.csrf_token});
});

rotas.post('/entrar',(req,res)=>{
  if(!validarCsrfAnon(req))return res.status(403).json({ok:false,erro:'csrf_invalido'});
  const usuario=String(req.body?.usuario||'').trim().toLowerCase();
  const ip=ipCliente(req),chave=`${ip}|${usuario}`;
  const bloqueio=trafego.consultarBloqueio({grupo:'entrar',chave});
  if(bloqueio.bloqueado){
    res.set('Retry-After',String(bloqueio.retryAfter));
    return res.status(429).json({ok:false,erro:'muitas_tentativas',tentar_em:bloqueio.retryAfter});
  }
  const resultado=autenticacao.autenticar({usuario,senha:String(req.body?.senha||'')});
  if(!resultado.ok){
    const falha=registrarTentativaRuim({chave,usuario,ip});
    if(falha.bloqueado){res.set('Retry-After',String(falha.retryAfter));return res.status(429).json({ok:false,erro:'muitas_tentativas',tentar_em:falha.retryAfter});}
    return res.status(401).json({ok:false,erro:'credenciais_invalidas'});
  }
  if(resultado.usuario.totp_ativo){
    const codigo=String(req.body?.codigo2fa||'').trim();
    if(!codigo)return res.status(401).json({ok:false,erro:'2fa_necessario'});
    if(!autenticacao.validarSegundoFator({usuarioId:resultado.usuario.id,codigo})){
      const falha=registrarTentativaRuim({chave,usuario,ip,acao:'2fa_falhou'});
      if(falha.bloqueado){res.set('Retry-After',String(falha.retryAfter));return res.status(429).json({ok:false,erro:'muitas_tentativas',tentar_em:falha.retryAfter});}
      return res.status(401).json({ok:false,erro:'codigo_2fa_invalido'});
    }
  }
  trafego.limparFalhas({grupo:'entrar',chave});
  const sessao=autenticacao.criarSessao({usuarioId:resultado.usuario.id,ip,agenteUsuario:req.get('user-agent')||''});
  res.setHeader('Set-Cookie',[
    cookie(COOKIE_SESSAO,sessao.token,{httpOnly:true,secure:seguro(),sameSite:'Lax',maxAge:Math.max(60,Math.floor((Date.parse(sessao.expiraEm)-Date.now())/1000))}),
    cookie(COOKIE_CSRF_ANON,'',{httpOnly:false,secure:seguro(),sameSite:'Lax',maxAge:0})
  ]);
  registrarAuditoria({usuarioId:resultado.usuario.id,acao:'login_sucesso',ip});
  res.json({ok:true,forcarTrocaSenha:Boolean(resultado.usuario.forcar_troca_senha),csrf:sessao.csrfToken});
});

rotas.get('/sessoes',exigirAutenticacao,(req,res)=>{
  res.set('Cache-Control','no-store');
  res.json({ok:true,sessoes:autenticacao.listarSessoes({usuarioId:req.sessao.usuario_id,tokenAtual:req.tokenSessao})});
});

rotas.delete('/sessoes/:id',exigirAutenticacao,exigirCsrf,(req,res)=>{
  const sessaoId=Number(req.params.id);
  if(!Number.isInteger(sessaoId)||sessaoId<=0)return res.status(400).json({ok:false,erro:'sessao_invalida'});
  const atual=sessaoId===Number(req.sessao.id);
  const revogada=autenticacao.revogarSessaoPorId({usuarioId:req.sessao.usuario_id,sessaoId});
  if(!revogada)return res.status(404).json({ok:false,erro:'sessao_nao_encontrada'});
  registrarAuditoria({usuarioId:req.sessao.usuario_id,acao:'sessao_revogada',ip:ipCliente(req),detalhes:{sessaoId,atual}});
  if(atual)res.setHeader('Set-Cookie',cookie(COOKIE_SESSAO,'',{httpOnly:true,secure:seguro(),sameSite:'Lax',maxAge:0}));
  res.json({ok:true,sessaoAtualRevogada:atual});
});

rotas.post('/sessoes/encerrar-outras',exigirAutenticacao,exigirCsrf,(req,res)=>{
  const encerradas=autenticacao.revogarOutrasSessoes({usuarioId:req.sessao.usuario_id,tokenAtual:req.tokenSessao});
  registrarAuditoria({usuarioId:req.sessao.usuario_id,acao:'outras_sessoes_revogadas',ip:ipCliente(req),detalhes:{encerradas}});
  res.json({ok:true,encerradas});
});

rotas.post('/sair',exigirAutenticacao,exigirCsrf,(req,res)=>{
  registrarAuditoria({usuarioId:req.sessao.usuario_id,acao:'logout',ip:ipCliente(req)});
  autenticacao.revogarSessao(req.tokenSessao);
  res.setHeader('Set-Cookie',cookie(COOKIE_SESSAO,'',{httpOnly:true,secure:seguro(),sameSite:'Lax',maxAge:0}));
  res.json({ok:true});
});

rotas.post('/trocar-senha',exigirAutenticacao,exigirCsrf,(req,res)=>{
  try{
    autenticacao.trocarSenha({usuarioId:req.sessao.usuario_id,senhaAtual:String(req.body?.senhaAtual||''),novaSenha:String(req.body?.novaSenha||'')});
    registrarAuditoria({usuarioId:req.sessao.usuario_id,acao:'senha_alterada',ip:ipCliente(req)});
    res.setHeader('Set-Cookie',cookie(COOKIE_SESSAO,'',{httpOnly:true,secure:seguro(),sameSite:'Lax',maxAge:0}));
    res.json({ok:true,reauth:true});
  }catch(e){
    res.status(400).json({ok:false,erro:e.message==='senha_fraca'?'senha_fraca':'senha_atual_incorreta'});
  }
});

rotas.post('/2fa/preparar',exigirAutenticacao,exigirCsrf,(req,res)=>{
  try{
    const dados=autenticacao.preparar2fa({usuarioId:req.sessao.usuario_id,conta:req.sessao.usuario});
    registrarAuditoria({usuarioId:req.sessao.usuario_id,acao:'2fa_preparado',ip:ipCliente(req)});
    res.json({ok:true,...dados});
  }catch(e){res.status(400).json({ok:false,erro:e.message});}
});
rotas.post('/2fa/ativar',exigirAutenticacao,exigirCsrf,(req,res)=>{
  try{
    const dados=autenticacao.ativar2fa({usuarioId:req.sessao.usuario_id,codigo:String(req.body?.codigo||'')});
    registrarAuditoria({usuarioId:req.sessao.usuario_id,acao:'2fa_ativado',ip:ipCliente(req)});
    res.json({ok:true,...dados});
  }catch(e){res.status(400).json({ok:false,erro:'codigo_2fa_invalido'});}
});
rotas.post('/2fa/desativar',exigirAutenticacao,exigirCsrf,(req,res)=>{
  try{
    autenticacao.desativar2fa({usuarioId:req.sessao.usuario_id,codigo:String(req.body?.codigo||'')});
    registrarAuditoria({usuarioId:req.sessao.usuario_id,acao:'2fa_desativado',ip:ipCliente(req)});
    res.json({ok:true});
  }catch(e){res.status(400).json({ok:false,erro:'codigo_2fa_invalido'});}
});

module.exports=rotas;
