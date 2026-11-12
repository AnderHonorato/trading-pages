const fs=require('node:fs');
const path=require('node:path');

const raiz=path.resolve(__dirname,'..');
const destino=path.join(raiz,'.site-publico');

function limpar(){
  fs.rmSync(destino,{recursive:true,force:true});
  fs.mkdirSync(destino,{recursive:true});
}
function copiar(origem,alvo){
  const src=path.join(raiz,origem),dst=path.join(destino,alvo||origem);
  fs.mkdirSync(path.dirname(dst),{recursive:true});
  fs.copyFileSync(src,dst);
}

function gerar(){
  limpar();

  let html=fs.readFileSync(path.join(raiz,'agentes-orbitais.html'),'utf8');
  html=html
    .replace('<title>Agentes Orbitais</title>','<title>Ander Quant OS · Demo Pública</title>\n<link rel="icon" href="data:,">')
    .replace('<link rel="stylesheet" href="./frontend/paginas/painel/painel-conta.css">','<link rel="stylesheet" href="./frontend/paginas/painel/demo-publica.css">')
    .replace('<script src="./frontend/paginas/painel/painel-sessao.js"></script>','')
    .replace('<body>','<body>\n<div id="demo-publica" aria-label="Demonstração pública com dados simulados">Demo pública · dados simulados</div>');
  fs.writeFileSync(path.join(destino,'index.html'),html);

  copiar('frontend/paginas/painel/painel.css');
  copiar('frontend/paginas/painel/painel.js');
  copiar('frontend/paginas/painel/demo-publica.css');
  copiar('frontend/compartilhado/orbital-fisica.js');
  copiar('frontend/compartilhado/reciclagem-agentes.js');
  copiar('frontend/compartilhado/orbital-coreografia.js');
  copiar('frontend/compartilhado/conversa-contextual.js');
  copiar('frontend/compartilhado/movimentos-tematicos.js');
  copiar('evolucao-v11.css');
  copiar('frontend/componentes/equipe-flow.css');
  copiar('frontend/componentes/equipe-flow.js');
  copiar('frontend/componentes/mural-missoes.css');
  copiar('frontend/componentes/mural-missoes.js');
  copiar('frontend/componentes/diario-trabalho.css');
  copiar('frontend/componentes/diario-trabalho.js');
  copiar('frontend/componentes/agenda-semanal.css');
  copiar('frontend/componentes/agenda-semanal.js');
  copiar('frontend/componentes/estudio-foco.css');
  copiar('frontend/componentes/estudio-foco.js');
  copiar('frontend/componentes/jornada-flow.css');
  copiar('frontend/componentes/jornada-flow.js');
  copiar('frontend/componentes/cofre-flow.css');
  copiar('frontend/componentes/cofre-flow.js');
  copiar('frontend/componentes/radar-flow.css');
  copiar('frontend/componentes/radar-flow.js');
  copiar('frontend/componentes/linha-tempo-flow.css');
  copiar('frontend/componentes/linha-tempo-flow.js');
  copiar('frontend/componentes/sala-flow.css');
  copiar('frontend/componentes/sala-flow.js');
  copiar('frontend/componentes/revisao-flow.css');
  copiar('frontend/componentes/revisao-flow.js');
  copiar('frontend/componentes/fluxo-vivo.css');
  copiar('frontend/componentes/fluxo-vivo.js');
  copiar('frontend/componentes/quadro-despachos.css');
  copiar('frontend/componentes/quadro-despachos.js');

  let evolucao=fs.readFileSync(path.join(raiz,'evolucao-v11.js'),'utf8');
  evolucao=evolucao
    .replaceAll("fetch('/api/status'","fetch('./api/status.json'")
    .replaceAll("fetch('/api/sinais'","fetch('./api/sinais.json'")
    .replaceAll("'SERVIDOR LOCAL / DEMO'","'DEMO PÚBLICA / SIMULADA'")
    .replaceAll("'SERVIDOR INDISPONÍVEL / DEMO'","'DEMO PÚBLICA / SIMULADA'")
    .replaceAll("'LOCAL / DEMO'","'DEMO PÚBLICA / SIMULADA'");
  fs.writeFileSync(path.join(destino,'evolucao-v11.js'),evolucao);

  fs.mkdirSync(path.join(destino,'api'),{recursive:true});
  fs.writeFileSync(path.join(destino,'api','status.json'),JSON.stringify({
    ok:true,versao:'14.0-demo',modo:'demonstracao',conectadoCorretora:false,
    orquestracao:'visual',publica:true
  },null,2));
  fs.writeFileSync(path.join(destino,'api','sinais.json'),JSON.stringify({
    ok:true,demonstracao:true,versao:'14.0-demo',
    eventos:[{id:'demo-publica-inicial',tipo:'observacao',agente:'LUNA',descricao:'Pulso visual simulado.'}]
  },null,2));
  fs.writeFileSync(path.join(destino,'.nojekyll'),'');
  fs.writeFileSync(path.join(destino,'README.txt'),
    'Trading Pages / Ander Quant OS — demo visual pública. Sem login, banco, chaves de API ou trading real.\n'
  );

  return destino;
}

if(require.main===module)console.log(gerar());
module.exports={gerar};