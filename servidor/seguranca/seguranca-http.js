function lerCookies(req) {
  const resultado={};
  const cabecalho=req.headers.cookie||'';
  for(const parte of cabecalho.split(';')){
    const i=parte.indexOf('=');
    if(i<0)continue;
    const chave=parte.slice(0,i).trim();
    const valor=parte.slice(i+1).trim();
    if(chave)resultado[chave]=decodeURIComponent(valor);
  }
  return resultado;
}

function cookie(nome,valor,{maxAge,httpOnly=true,secure=false,sameSite='Lax',path='/'}={}) {
  const partes=[`${nome}=${encodeURIComponent(valor)}`,`Path=${path}`,`SameSite=${sameSite}`];
  if(httpOnly)partes.push('HttpOnly');
  if(secure)partes.push('Secure');
  if(Number.isFinite(maxAge))partes.push(`Max-Age=${Math.max(0,Math.floor(maxAge))}`);
  return partes.join('; ');
}

function ipCliente(req) {
  return String(req.ip || req.socket?.remoteAddress || '').replace(/^::ffff:/,'').slice(0,100);
}

module.exports={lerCookies,cookie,ipCliente};
