const {obterBanco}=require('../../banco/banco.js');
function registrarAuditoria({usuarioId=null,acao,ip='',detalhes=null}){
  const texto=detalhes==null?null:JSON.stringify(detalhes).slice(0,2000);
  obterBanco().prepare('INSERT INTO auditoria (usuario_id,acao,ip,detalhes,criado_em) VALUES (?,?,?,?,?)')
    .run(usuarioId,String(acao).slice(0,120),String(ip).slice(0,100),texto,new Date().toISOString());
}
module.exports={registrarAuditoria};
