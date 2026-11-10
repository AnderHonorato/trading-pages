const helmet=require('helmet');

function segurancaCabecalhos(){
  return helmet({
    contentSecurityPolicy:{
      directives:{
        defaultSrc:["'self'"],
        baseUri:["'self'"],
        objectSrc:["'none'"],
        frameAncestors:["'none'"],
        scriptSrc:["'self'"],
        styleSrc:["'self'","https://fonts.googleapis.com"],
        fontSrc:["'self'","https://fonts.gstatic.com","data:"],
        imgSrc:["'self'","data:"],
        connectSrc:["'self'"],
        formAction:["'self'"],
        upgradeInsecureRequests:null
      }
    },
    crossOriginEmbedderPolicy:false,
    referrerPolicy:{policy:'no-referrer'}
  });
}
module.exports={segurancaCabecalhos};
