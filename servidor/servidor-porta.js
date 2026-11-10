const net=require('node:net');
const PROIBIDAS=new Set([3000,3001,4200,5000,5173,5500,8000,8080,8888]);

function testarEscuta(porta,host){
  return new Promise(resolve=>{
    const servidor=net.createServer();
    servidor.unref();
    servidor.once('error',()=>resolve(false));
    servidor.listen({port:porta,host,exclusive:true},()=>servidor.close(()=>resolve(true)));
  });
}
async function encontrarPortaLivre(inicial,quantidade=20){
  for(let porta=inicial;porta<inicial+quantidade;porta++){
    if(PROIBIDAS.has(porta))continue;
    const ipv4=await testarEscuta(porta,'127.0.0.1');
    if(!ipv4)continue;
    let ipv6=true;
    try{ipv6=await testarEscuta(porta,'::1');}catch{ipv6=true;}
    if(!ipv6)continue;
    const wildcard=await testarEscuta(porta,'0.0.0.0');
    if(wildcard)return porta;
  }
  throw new Error('nenhuma_porta_livre');
}
module.exports={encontrarPortaLivre,PROIBIDAS};
