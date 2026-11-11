require('dotenv').config();
const path=require('node:path');
const fs=require('node:fs');
const crypto=require('node:crypto');
const {chromium}=require('playwright-core');
const auth=require('../servidor/rotas/autenticacao/autenticacao-servico.js');
const {obterBanco,fecharBanco}=require('../banco/banco.js');

const TEMAS=['pixel','dados','naves','cartas','voxel','criaturas','cosmos','cyber','bio','arcano','oceano','floresta','clima','deserto','artico','comida','musica','esportes','origami','brinquedos'];
const CAPTURAR=new Set(['pixel','naves','oceano','musica','cosmos']);

async function principal(){
  const usuario='visual_v14_'+Date.now(),senha=crypto.randomBytes(16).toString('base64url')+'!V14';
  const criado=auth.criarAdmin({usuario,senha});
  obterBanco().prepare('UPDATE usuarios SET forcar_troca_senha=0 WHERE id=?').run(criado.id);
  const execucao=path.resolve(__dirname,'..','.execucao');fs.mkdirSync(execucao,{recursive:true});
  const candidatos=[process.env.CHROME_BIN,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Google/Chrome/Application/chrome.exe','/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].filter(Boolean);
  const chrome=candidatos.find(c=>fs.existsSync(c));if(!chrome)throw new Error('Chrome/Chromium não encontrado.');
  const navegador=await chromium.launch({headless:true,executablePath:chrome});
  const erros=[],resultados=[];
  try{
    const contexto=await navegador.newContext({viewport:{width:1440,height:900}});
    const pagina=await contexto.newPage();
    pagina.on('console',m=>{if(m.type()==='error')erros.push('console: '+m.text());});
    pagina.on('pageerror',e=>erros.push('page: '+e.message));
    await pagina.goto('http://127.0.0.1:4312/entrar',{waitUntil:'domcontentloaded'});
    await pagina.fill('#usuario',usuario);await pagina.fill('#senha',senha);await pagina.click('button[type="submit"]');
    await pagina.waitForURL('**/painel',{timeout:10000});
    await pagina.waitForFunction(()=>window.AgentesOrbitais&&window.MovimentosTematicos&&window.OrbitalCoreografia);
    for(const tema of TEMAS){
      await pagina.evaluate(id=>window.AgentesOrbitais.tema(id),tema);
      await pagina.waitForTimeout(620);
      const antes=await pagina.evaluate(()=>window.AgentesOrbitais.layout().map(x=>({nome:x.nome,x:x.x,y:x.y,r:x.r})));
      await pagina.waitForTimeout(220);
      const info=await pagina.evaluate(()=>{
        const layout=window.AgentesOrbitais.layout(),estado=window.AgentesOrbitais.estado(),combate=window.AgentesOrbitais.combate();
        let min=Infinity;
        for(let i=0;i<layout.length;i++)for(let j=i+1;j<layout.length;j++){
          const a=layout[i],b=layout[j],ratio=Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,a.r+b.r);
          min=Math.min(min,ratio);
        }
        return {layout,estado,combate,minRatio:Number.isFinite(min)?min:99,scroll:document.documentElement.scrollWidth,largura:innerWidth};
      });
      const mapaAntes=new Map(antes.map(x=>[x.nome,x]));
      const deslocamentos=info.layout.map(x=>{const a=mapaAntes.get(x.nome);return a?Math.hypot(x.x-a.x,x.y-a.y):0;});
      const media=deslocamentos.reduce((a,b)=>a+b,0)/Math.max(1,deslocamentos.length);
      const assinatura=info.layout.slice(0,6).map(x=>Math.round(x.x/35)+':'+Math.round(x.y/35)).join('|');
      const esperado=tema==='cosmos'?'orbita-cosmica':'tematico:'+tema;
      resultados.push({tema,movimento:info.combate?.movimento,modo:info.combate?.modo,minRatio:info.minRatio,movimentoPx:Number(media.toFixed(2)),assinatura,overflow:info.scroll-info.largura});
      if(info.combate?.modo!==esperado)erros.push(tema+': modo '+info.combate?.modo+' != '+esperado);
      if(tema!=='cosmos'&&!info.combate?.movimento)erros.push(tema+': movimento temático sem nome');
      if(media<.08)erros.push(tema+': formação visual não se move');
      if(info.minRatio<1)erros.push(tema+': agentes visualmente sobrepostos '+info.minRatio.toFixed(2));
      if(info.scroll>info.largura+1)erros.push(tema+': overflow horizontal');
      if(CAPTURAR.has(tema))await pagina.screenshot({path:path.join(execucao,'v14-'+tema+'-desktop.png'),fullPage:true});
    }
    const assinaturas=new Set(resultados.filter(x=>x.tema!=='cosmos').map(x=>x.assinatura));
    if(assinaturas.size<15)erros.push('formações visuais distintas insuficientes: '+assinaturas.size);
    await pagina.setViewportSize({width:390,height:844});
    for(const tema of ['pixel','naves','oceano','musica','cosmos']){
      await pagina.evaluate(id=>window.AgentesOrbitais.tema(id),tema);await pagina.waitForTimeout(500);
      const mob=await pagina.evaluate(()=>({largura:innerWidth,scroll:document.documentElement.scrollWidth}));
      if(mob.scroll>mob.largura+1)erros.push(tema+': overflow mobile');
    }
    console.log(JSON.stringify({assinaturasDistintas:assinaturas.size,resultados,erros},null,2));
    if(erros.length)process.exitCode=1;
    await contexto.close();
  }finally{
    await navegador.close();
    obterBanco().prepare('DELETE FROM usuarios WHERE usuario=?').run(usuario);
    fecharBanco();
  }
}
principal().catch(e=>{console.error(e);try{fecharBanco();}catch{}process.exit(1);});