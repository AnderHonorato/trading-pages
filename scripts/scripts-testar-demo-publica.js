const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright-core');
const {gerar}=require('./scripts-gerar-demo-publica.js');

function mime(arquivo){
  const ext=path.extname(arquivo).toLowerCase();
  return ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'})[ext]||'application/octet-stream';
}
function chromeLocal(){
  const candidatos=[
    process.env.CHROME_BIN,
    process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':null,
    process.platform==='win32'?'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe':null,
    '/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'
  ].filter(Boolean);
  const achado=candidatos.find(c=>fs.existsSync(c));
  if(!achado)throw new Error('Chrome/Chromium não encontrado. Defina CHROME_BIN.');
  return achado;
}
async function principal(){
  const raiz=gerar();
  const execucao=path.resolve(__dirname,'..','.execucao');fs.mkdirSync(execucao,{recursive:true});
  const servidor=http.createServer((req,res)=>{
    let rota=decodeURIComponent((req.url||'/').split('?')[0]);
    if(rota==='/')rota='/index.html';
    const alvo=path.resolve(raiz,'.'+rota);
    if(!alvo.startsWith(path.resolve(raiz))){res.writeHead(403);return res.end();}
    fs.stat(alvo,(erro,info)=>{
      if(erro||!info.isFile()){res.writeHead(404);return res.end('not found');}
      res.writeHead(200,{'Content-Type':mime(alvo),'Cache-Control':'no-store'});
      fs.createReadStream(alvo).pipe(res);
    });
  });
  await new Promise((resolve,reject)=>servidor.listen(0,'127.0.0.1',erro=>erro?reject(erro):resolve()));
  const porta=servidor.address().port;
  const origem='http://127.0.0.1:'+porta;
  const navegador=await chromium.launch({headless:true,executablePath:chromeLocal()});
  const erros=[];
  try{
    const contexto=await navegador.newContext({viewport:{width:1440,height:900}});
    const pagina=await contexto.newPage();
    pagina.on('console',m=>{if(m.type()==='error')erros.push('console: '+m.text());});
    pagina.on('pageerror',e=>erros.push('page: '+(e.stack||e.message)));
    await pagina.goto(origem+'/',{waitUntil:'networkidle'});
    await pagina.waitForFunction(()=>window.AgentesOrbitais&&window.AgentesOrbitais.tema,{timeout:10000});
    await pagina.evaluate(()=>window.AgentesOrbitais.tema('cosmos'));
    await pagina.waitForTimeout(2500);
    const desktop=await pagina.evaluate(()=>({
      largura:innerWidth,scroll:document.documentElement.scrollWidth,
      demo:Boolean(document.querySelector('#demo-publica')),
      conta:Boolean(document.querySelector('#painel-conta')),
      tema:window.AgentesOrbitais.estado().tema
    }));
    // Fluxo de ponta a ponta da central de missoes.
    await pagina.locator('#flow-abrir').click();
    if(await pagina.locator('#flow-corpo').isHidden())erros.push('missoes: painel nao abriu');
    await pagina.locator('[data-acao="pulso"]').click();
    if((await pagina.locator('#flow-historico li').count())<1)erros.push('missoes: historico vazio');
    if((await pagina.evaluate(()=>window.FlowMissoes.estado().comandos))<1)erros.push('missoes: comando nao registrado');
    await pagina.locator('#flow-fechar').click();
    if(!(await pagina.locator('#flow-corpo').isHidden()))erros.push('missoes: painel nao fechou');
    // A central precisa responder a cliques reais e refletir o estado do motor.
    await pagina.locator('#ao-pausa').click();
    if(await pagina.locator('#ao-pausa').getAttribute('aria-pressed')!=='true')erros.push('controle: pausa nao ativou');
    await pagina.locator('#ao-pausa').click();
    if(await pagina.locator('#ao-pausa').getAttribute('aria-pressed')!=='false')erros.push('controle: retomada falhou');
    await pagina.locator('#ao-velocidade').click();
    if((await pagina.locator('#ao-velocidade').textContent()).trim()!=='1.5×')erros.push('controle: velocidade nao mudou');
    const anterior=await pagina.evaluate(()=>window.AgentesOrbitais.estado().tema);
    await pagina.locator('#ao-proximo').click();
    const seguinte=await pagina.evaluate(()=>window.AgentesOrbitais.estado().tema);
    if(anterior===seguinte)erros.push('controle: proximo cenario nao mudou');
    // A oficina deve fabricar uma peca ao toque, sem depender de orbitas.
    await pagina.evaluate(()=>window.AgentesOrbitais.tema('oficina'));
    const oficinaAntes=await pagina.evaluate(()=>window.OficinaViva.estado().pecas);
    await pagina.evaluate(()=>window.OficinaViva.acionar(300,400,800,600));
    const oficinaDepois=await pagina.evaluate(()=>window.OficinaViva.estado().pecas);
    if(oficinaDepois!==oficinaAntes+1)erros.push('oficina: fabricacao interativa falhou');
    // Validação de todas as categorias e das trocas repetidas no navegador real.
    const temas=['pixel','dados','naves','cartas','voxel','criaturas','cosmos','cyber','bio','arcano','oceano','floresta','clima','deserto','artico','comida','musica','esportes','origami','brinquedos','jardim','aquario','oficina'];
    const categorias=[];
    for(const tema of temas){
      await pagina.evaluate(id=>window.AgentesOrbitais.tema(id),tema);
      await pagina.waitForTimeout(110);
      const atual=await pagina.evaluate(()=>window.AgentesOrbitais.estado().tema);
      categorias.push({tema,atual,ok:atual===tema});
      if(atual!==tema)erros.push('tema: '+tema+' retornou '+atual);
    }
    await pagina.evaluate(()=>window.AgentesOrbitais.tema('cosmos'));
    await pagina.evaluate(()=>window.AgentesOrbitais.tema('aquario'));
    const ecossistema=await pagina.evaluate(()=>window.AquarioVivo?.estado());
    if(!ecossistema||ecossistema.peixes!==11)erros.push('aquario: cardume nao inicializado');
    await pagina.locator('#ao-canvas').click({position:{x:120,y:180}});
    const comida=await pagina.evaluate(()=>window.AquarioVivo?.estado().alimentos);
    if(!comida)erros.push('aquario: toque nao alimentou cardume');
    await pagina.evaluate(()=>window.AgentesOrbitais.tema('cosmos'));
    await pagina.waitForTimeout(500);
    await pagina.screenshot({path:path.join(execucao,'demo-publica-desktop.png'),fullPage:true});
    await pagina.setViewportSize({width:390,height:844});
    await pagina.waitForTimeout(800);
    const mobile=await pagina.evaluate(()=>({largura:innerWidth,scroll:document.documentElement.scrollWidth,altura:innerHeight,scrollAltura:document.documentElement.scrollHeight}));
    await pagina.screenshot({path:path.join(execucao,'demo-publica-mobile.png'),fullPage:true});
    console.log(JSON.stringify({desktop,mobile,categorias,erros},null,2));
    if(!desktop.demo||desktop.conta||desktop.scroll>desktop.largura+1||mobile.scroll>mobile.largura+1||erros.length)process.exitCode=1;
    await contexto.close();
  }finally{
    await navegador.close();
    await new Promise(resolve=>servidor.close(resolve));
  }
}
principal().catch(e=>{console.error(e);process.exit(1);});
