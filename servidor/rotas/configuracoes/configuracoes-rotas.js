const express=require('express');
const servico=require('./configuracoes-api-servico.js');
const {exigirAutenticacao,exigirCsrf}=require('../../seguranca/seguranca-autenticacao.js');
const {registrarAuditoria}=require('../../seguranca/seguranca-auditoria.js');
const {ipCliente}=require('../../seguranca/seguranca-http.js');

const rotas=express.Router();
rotas.use(exigirAutenticacao);

rotas.get('/apis',(req,res)=>{
  res.json({ok:true,provedores:servico.listar(req.sessao.usuario_id)});
});

rotas.put('/apis/:provedor',exigirCsrf,(req,res)=>{
  try{
    const salvo=servico.salvar({
      usuarioId:req.sessao.usuario_id,
      provedor:req.params.provedor,
      chave:String(req.body?.chave||''),
      modelo:String(req.body?.modelo||''),
      ativo:req.body?.ativo!==false
    });
    registrarAuditoria({usuarioId:req.sessao.usuario_id,acao:'api_configurada',ip:ipCliente(req),detalhes:{provedor:salvo.provedor,modelo:salvo.modelo}});
    res.json({ok:true,configuracao:salvo});
  }catch(e){
    res.status(400).json({ok:false,erro:e.message});
  }
});

module.exports=rotas;
