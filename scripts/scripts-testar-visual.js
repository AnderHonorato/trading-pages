require('dotenv').config();
const path=require('node:path');
const fs=require('node:fs');
const crypto=require('node:crypto');
const {chromium}=require('playwright-core');
const autenticacao=require('../servidor/rotas/autenticacao/autenticacao-servico.js');
const {obterBanco,fecharBanco}=require('../banco/banco.js');

async function principal(){
  const usuario='visual_'+Date.now(),senha=crypto.randomBytes(16).toString('base64url')+'!8V';
  const criado=autenticacao.criarAdmin({usuario,senha});
  obterBanco().prepare('UPDATE usuarios SET forcar_troca_senha=0 WHERE id=?').run(criado.id);
  const execucao=path.resolve(__dirname,'..','.execucao');fs.mkdirSync(execucao,{recursive:true});
  const navegador=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const erros=[];
  try{
    const contexto=await navegador.newContext({viewport:{width:1440,height:900}});
    const pagina=await contexto.newPage();
    pagina.on('console',m=>{if(m.type()==='error')erros.push('console: '+m.text());});
    pagina.on('pageerror',e=>erros.push('page: '+e.message));
    await pagina.goto('http://127.0.0.1:4312/entrar',{waitUntil:'networkidle'});
    await pagina.fill('#usuario',usuario);await pagina.fill('#senha',senha);
    await pagina.click('button[type="submit"]');
    await pagina.waitForURL('**/painel',{timeout:10000});
    await pagina.waitForFunction(()=>window.AgentesOrbitais&&window.AgentesOrbitais.tema);
    await pagina.evaluate(()=>window.AgentesOrbitais.tema('cosmos'));
    await pagina.waitForTimeout(3500);
    const desktop=await pagina.evaluate(()=>({
      largura:innerWidth,scroll:document.documentElement.scrollWidth,
      estado:window.AgentesOrbitais.estado(),combate:window.AgentesOrbitais.combate()
    }));
    await pagina.screenshot({path:path.join(execucao,'cosmo-desktop.png'),fullPage:true});
    await pagina.setViewportSize({width:390,height:844});
    await pagina.waitForTimeout(1600);
    const mobile=await pagina.evaluate(()=>({largura:innerWidth,scroll:document.documentElement.scrollWidth,altura:innerHeight,scrollAltura:document.documentElement.scrollHeight}));
    await pagina.screenshot({path:path.join(execucao,'cosmo-mobile.png'),fullPage:true});
    console.log(JSON.stringify({desktop,mobile,erros},null,2));
    if(desktop.scroll>desktop.largura+1||mobile.scroll>mobile.largura+1||erros.length)process.exitCode=1;
    await contexto.close();
  }finally{
    await navegador.close();
    obterBanco().prepare('DELETE FROM usuarios WHERE usuario=?').run(usuario);
    fecharBanco();
  }
}
principal().catch(e=>{console.error(e);try{fecharBanco();}catch{}process.exit(1);});
