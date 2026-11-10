const trafego=require('./seguranca-trafego-servico.js');
const {ipCliente}=require('./seguranca-http.js');

function limitarRequisicoes({grupo,limite,janelaMinutos=1,chave}){
  return (req,res,next)=>{
    const id=chave?chave(req):ipCliente(req);
    const estado=trafego.consultarBloqueio({grupo,chave:id});
    if(estado.bloqueado){
      res.set('Retry-After',String(estado.retryAfter));
      return res.status(429).json({ok:false,erro:'muitas_requisicoes',tentar_em:estado.retryAfter});
    }
    const registro=trafego.registrarFalha({grupo,chave:id,limite,janelaMinutos});
    if(registro.bloqueado){
      res.set('Retry-After',String(registro.retryAfter));
      return res.status(429).json({ok:false,erro:'muitas_requisicoes',tentar_em:registro.retryAfter});
    }
    next();
  };
}
module.exports={limitarRequisicoes};
