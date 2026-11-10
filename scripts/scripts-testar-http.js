require('dotenv').config();
const crypto=require('node:crypto');
const autenticacao=require('../servidor/rotas/autenticacao/autenticacao-servico.js');
const {obterBanco,fecharBanco}=require('../banco/banco.js');

async function principal(){
  const origem=process.env.ORIGEM_SMOKE||'http://127.0.0.1:4312';
  const usuario='smoke_'+Date.now();
  const senha=crypto.randomBytes(16).toString('base64url')+'!9Z';
  autenticacao.criarAdmin({usuario,senha});
  try{
    const entrar=await fetch(origem+'/entrar',{redirect:'manual'});
    const csp=entrar.headers.get('content-security-policy')||'';
    console.log('entrar',entrar.status,'csp',Boolean(csp),'unsafe-inline',csp.includes("'unsafe-inline'"),'unsafe-eval',csp.includes("'unsafe-eval'"));
    if(entrar.status!==200||!csp||csp.includes("'unsafe-inline'")||csp.includes("'unsafe-eval'"))throw new Error('CSP/login inválidos');

    const painelAnon=await fetch(origem+'/painel',{redirect:'manual'});
    console.log('painel_anon',painelAnon.status,painelAnon.headers.get('location'));
    if(painelAnon.status!==302||painelAnon.headers.get('location')!=='/entrar')throw new Error('painel não protegido');

    const inicio=await fetch(origem+'/api/autenticacao/iniciar',{redirect:'manual'});
    const inicioJson=await inicio.json();
    const cookiesAnon=inicio.headers.getSetCookie?inicio.headers.getSetCookie():[inicio.headers.get('set-cookie')];
    const cookieAnon=cookiesAnon.filter(Boolean).map(x=>x.split(';')[0]).join('; ');

    const login=await fetch(origem+'/api/autenticacao/entrar',{
      method:'POST',redirect:'manual',
      headers:{'content-type':'application/json','x-csrf-token':inicioJson.csrf,'cookie':cookieAnon},
      body:JSON.stringify({usuario,senha})
    });
    const loginJson=await login.json();
    console.log('login',login.status,'troca_obrigatoria',loginJson.forcarTrocaSenha);
    if(login.status!==200||!loginJson.forcarTrocaSenha)throw new Error('login inicial inválido');

    const cookiesLogin=login.headers.getSetCookie?login.headers.getSetCookie():[login.headers.get('set-cookie')];
    const sessaoCookie=cookiesLogin.filter(Boolean).map(x=>x.split(';')[0]).find(x=>x.startsWith('trading_sessao='));
    if(!sessaoCookie)throw new Error('cookie de sessão ausente');

    const sessao=await fetch(origem+'/api/autenticacao/sessao',{headers:{cookie:sessaoCookie}});
    const sessaoJson=await sessao.json();
    console.log('sessao',sessao.status,'autenticado',sessaoJson.autenticado,'2fa',sessaoJson.doisFatoresAtivo);
    if(!sessaoJson.autenticado)throw new Error('sessão não autenticada');

    const painel=await fetch(origem+'/painel',{headers:{cookie:sessaoCookie},redirect:'manual'});
    console.log('painel_primeiro_acesso',painel.status,painel.headers.get('location'));
    if(painel.status!==302||painel.headers.get('location')!=='/trocar-senha')throw new Error('troca obrigatória não aplicada');

    const sair=await fetch(origem+'/api/autenticacao/sair',{method:'POST',headers:{cookie:sessaoCookie,'x-csrf-token':loginJson.csrf}});
    console.log('logout',sair.status);
    if(sair.status!==200)throw new Error('logout falhou');
  } finally {
    obterBanco().prepare('DELETE FROM usuarios WHERE usuario=?').run(usuario);
    fecharBanco();
  }
}
principal().catch(e=>{console.error(e);try{fecharBanco();}catch{}process.exit(1);});
