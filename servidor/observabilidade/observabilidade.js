const crypto=require('node:crypto');
const os=require('node:os');

function criarObservabilidade({versao='13.0',inicio=Date.now()}={}){
  const estado={
    total:0,status2xx:0,status3xx:0,status4xx:0,status5xx:0,
    ativas:0,tempoTotalMs:0,tempoMaxMs:0
  };

  function middleware(req,res,next){
    const comeco=process.hrtime.bigint();
    const requestId=crypto.randomUUID();
    req.requestId=requestId;
    if(typeof res.setHeader==='function')res.setHeader('X-Request-Id',requestId);
    estado.total++;estado.ativas++;
    let terminou=false;
    const finalizar=()=>{
      if(terminou)return;terminou=true;
      estado.ativas=Math.max(0,estado.ativas-1);
      const ms=Number(process.hrtime.bigint()-comeco)/1e6;
      estado.tempoTotalMs+=ms;estado.tempoMaxMs=Math.max(estado.tempoMaxMs,ms);
      const status=Number(res.statusCode||200);
      if(status>=500)estado.status5xx++;else if(status>=400)estado.status4xx++;else if(status>=300)estado.status3xx++;else estado.status2xx++;
    };
    if(typeof res.on==='function'){res.on('finish',finalizar);res.on('close',finalizar);}
    next();
  }

  function snapshot(){
    return {
      requisicoes:{
        total:estado.total,
        ativas:estado.ativas,
        status2xx:estado.status2xx,
        status3xx:estado.status3xx,
        status4xx:estado.status4xx,
        status5xx:estado.status5xx,
        tempoMedioMs:estado.total?Number((estado.tempoTotalMs/estado.total).toFixed(2)):0,
        tempoMaxMs:Number(estado.tempoMaxMs.toFixed(2))
      },
      processo:{
        uptimeSegundos:Math.floor(process.uptime()),
        memoriaRssMb:Number((process.memoryUsage().rss/1024/1024).toFixed(1)),
        heapUsadoMb:Number((process.memoryUsage().heapUsed/1024/1024).toFixed(1)),
        pid:process.pid,
        plataforma:process.platform,
        node:process.version
      },
      maquina:{hostname:os.hostname(),cpus:os.cpus()?.length||0}
    };
  }

  function health(){
    return {
      ok:true,
      versao,
      estado:'operacional',
      uptimeSegundos:Math.floor((Date.now()-inicio)/1000),
      hora:new Date().toISOString()
    };
  }

  return {middleware,snapshot,health};
}

module.exports={criarObservabilidade};
