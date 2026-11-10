const fs=require('node:fs');

function pidAtivo(pid){
  try{process.kill(Number(pid),0);return true;}catch(e){return e?.code==='EPERM';}
}

function verificarInstancia({arquivoPid,pidAtual=process.pid}){
  if(!fs.existsSync(arquivoPid))return {ativa:false,pid:null};
  const pid=Number(fs.readFileSync(arquivoPid,'utf8').trim());
  if(!Number.isInteger(pid)||pid<=0){
    try{fs.unlinkSync(arquivoPid);}catch{}
    return {ativa:false,pid:null};
  }
  if(pid===pidAtual)return {ativa:false,pid};
  if(pidAtivo(pid))return {ativa:true,pid};
  try{fs.unlinkSync(arquivoPid);}catch{}
  return {ativa:false,pid:null};
}

function removerPidProprio(arquivoPid,pidAtual=process.pid){
  try{
    if(!fs.existsSync(arquivoPid))return;
    const pid=Number(fs.readFileSync(arquivoPid,'utf8').trim());
    if(pid===pidAtual)fs.unlinkSync(arquivoPid);
  }catch{}
}

module.exports={pidAtivo,verificarInstancia,removerPidProprio};