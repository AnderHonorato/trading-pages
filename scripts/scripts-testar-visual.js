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
  const candidatos=[
    process.env.CHROME_BIN,
    process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':null,
    process.platform==='win32'?'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe':null,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ].filter(Boolean);
  const chrome=candidatos.find(c=>fs.existsSync(c));
  if(!chrome)throw new Error('Chrome/Chromium não encontrado. Defina CHROME_BIN.');
  const navegador=await chromium.launch({headless:true,executablePath:chrome});
  const erros=[];
  try{
    const contexto=await navegador.newContext({viewport:{width:1440,height:900}});
    const pagina=await contexto.newPage();
    pagina.on('console',m=>{if(m.type()==='error')erros.push('console: '+m.text());});
    pagina.on('pageerror',e=>erros.push('page: '+e.message));
    await pagina.goto('http://127.0.0.1:4312/entrar',{waitUntil:'domcontentloaded'});
    await pagina.fill('#usuario',usuario);await pagina.fill('#senha',senha);
    await pagina.click('button[type="submit"]');
    await pagina.waitForURL('**/painel',{timeout:10000});
    await pagina.waitForFunction(()=>window.AgentesOrbitais&&window.AgentesOrbitais.tema);
    async function medirSeparacao(){
      return pagina.evaluate(()=>{
        const itens=window.AgentesOrbitais.layout();
        let min=Infinity,par=null;
        for(let i=0;i<itens.length;i++)for(let j=i+1;j<itens.length;j++){
          const a=itens[i],b=itens[j],soma=Math.max(1,a.r+b.r);
          const ratio=Math.hypot(a.x-b.x,a.y-b.y)/soma;
          if(ratio<min){min=ratio;par=[a.nome,b.nome];}
        }
        return {minRatio:Number.isFinite(min)?min:99,par,itens:itens.length};
      });
    }
    await pagina.waitForTimeout(1800);
    const separacaoPixel=await medirSeparacao();
    await pagina.evaluate(()=>window.AgentesOrbitais.tema('cosmos'));
    await pagina.waitForTimeout(2600);
    const separacaoCosmos=await medirSeparacao();
    const desktop=await pagina.evaluate(()=>({
      largura:innerWidth,scroll:document.documentElement.scrollWidth,
      estado:window.AgentesOrbitais.estado(),combate:window.AgentesOrbitais.combate()
    }));
    await pagina.screenshot({path:path.join(execucao,'cosmo-desktop.png'),fullPage:true});
    await pagina.setViewportSize({width:390,height:844});
    await pagina.waitForTimeout(1600);
    const mobile=await pagina.evaluate(()=>({largura:innerWidth,scroll:document.documentElement.scrollWidth,altura:innerHeight,scrollAltura:document.documentElement.scrollHeight}));
    await pagina.screenshot({path:path.join(execucao,'cosmo-mobile.png'),fullPage:true});

    await pagina.goto('http://127.0.0.1:4312/configuracoes/apis',{waitUntil:'domcontentloaded'});
    await pagina.waitForSelector('.sessao',{timeout:10000});
    const configuracoesMobile=await pagina.evaluate(()=>({
      largura:innerWidth,
      scroll:document.documentElement.scrollWidth,
      sessoes:document.querySelectorAll('.sessao').length,
      metricas:document.querySelectorAll('.metrica').length
    }));
    await pagina.screenshot({path:path.join(execucao,'configuracoes-mobile.png'),fullPage:true});
    await pagina.setViewportSize({width:1440,height:900});
    await pagina.waitForTimeout(300);
    const configuracoesDesktop=await pagina.evaluate(()=>({largura:innerWidth,scroll:document.documentElement.scrollWidth}));
    await pagina.screenshot({path:path.join(execucao,'configuracoes-desktop.png'),fullPage:true});

    console.log(JSON.stringify({desktop,mobile,separacaoPixel,separacaoCosmos,configuracoesMobile,configuracoesDesktop,erros},null,2));
    if(separacaoPixel.minRatio<.86||separacaoCosmos.minRatio<.86||
       desktop.scroll>desktop.largura+1||mobile.scroll>mobile.largura+1||
       configuracoesMobile.scroll>configuracoesMobile.largura+1||
       configuracoesDesktop.scroll>configuracoesDesktop.largura+1||
       configuracoesMobile.sessoes<1||configuracoesMobile.metricas<4||erros.length)process.exitCode=1;
    await contexto.close();
  }finally{
    await navegador.close();
    obterBanco().prepare('DELETE FROM usuarios WHERE usuario=?').run(usuario);
    fecharBanco();
  }
}
principal().catch(e=>{console.error(e);try{fecharBanco();}catch{}process.exit(1);});
