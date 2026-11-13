/* Painel de prioridades: leitura local e ações verificáveis sem IA externa. */
(() => {
  'use strict';
  const CHAVE='ander-flow-rotinas-v1', PLANOS='ander-flow-rotinas-planos-v2', HIST='ander-flow-rotinas-historico-v1';
  const raiz=document.querySelector('#painel-do-dia');
  if(!raiz)return;
  const hoje=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
  const ler=(chave,padrao)=>{try{return JSON.parse(localStorage.getItem(chave)||JSON.stringify(padrao))}catch{return padrao}};
  const elemento=(tag,classe,texto)=>{const el=document.createElement(tag);if(classe)el.className=classe;if(texto!==undefined)el.textContent=texto;return el};
  let modo='urgentes';
  function salvar(tarefas,planos,mensagem){
    try {
      const historico=ler(HIST,[]);
      historico.push(new Date().toLocaleString('pt-BR')+' · Chefinho: '+mensagem+' (ação local).');
      localStorage.setItem(CHAVE,JSON.stringify(tarefas));
      localStorage.setItem(PLANOS,JSON.stringify(planos));
      localStorage.setItem(HIST,JSON.stringify(historico.slice(-60)));
      location.reload();
    } catch {document.querySelector('#aviso').textContent='Não foi possível salvar a alteração.'}
  }
  function agir(id,acao){
    const tarefas=ler(CHAVE,[]),planos=ler(PLANOS,{});
    const tarefa=tarefas.find(t=>t.id===id);if(!tarefa)return;
    if(acao==='concluir'){tarefa.estado='concluida';salvar(tarefas,planos,'concluiu '+tarefa.titulo)}
    if(acao==='iniciar'){tarefa.estado='andamento';salvar(tarefas,planos,'iniciou '+tarefa.titulo)}
    if(acao==='adiar'){
      const data=new Date(hoje()+'T12:00:00');data.setDate(data.getDate()+1);
      planos[id]={...(planos[id]||{etapas:[]}),prazo:[data.getFullYear(),String(data.getMonth()+1).padStart(2,'0'),String(data.getDate()).padStart(2,'0')].join('-')};
      salvar(tarefas,planos,'reprogramou '+tarefa.titulo+' para amanhã');
    }
  }
  function renderizar(){
    const tarefas=ler(CHAVE,[]).filter(t=>t&&t.estado!=='concluida'),planos=ler(PLANOS,{});
    const agora=hoje();
    const enriquecidas=tarefas.map(t=>({...t,prazo:planos[t.id]?.prazo||'',etapas:planos[t.id]?.etapas||[]}));
    const atrasadas=enriquecidas.filter(t=>t.prazo&&t.prazo<agora);
    const hojeLista=enriquecidas.filter(t=>t.prazo===agora);
    const semPrazo=enriquecidas.filter(t=>!t.prazo);
    const alta=enriquecidas.filter(t=>t.prioridade==='alta');
    raiz.replaceChildren();
    const cab=elemento('div','dia-cabecalho');
    const titulo=elemento('div');titulo.append(elemento('p','sobretitulo','PLANEJAMENTO LOCAL · '+new Date().toLocaleDateString('pt-BR')),elemento('h2','','Meu dia'));
    cab.append(titulo,elemento('p','dia-descricao','Prioridades e prazos reais das suas atividades. Nenhuma ação financeira ou chamada de IA.'));
    raiz.append(cab);
    const metricas=elemento('div','dia-metricas');
    [[atrasadas.length,'Atrasadas'],[hojeLista.length,'Vencem hoje'],[alta.length,'Alta prioridade'],[semPrazo.length,'Sem prazo']].forEach(([n,nome])=>{const item=elemento('div');item.append(elemento('strong','',String(n)),elemento('span','',nome));metricas.append(item)});
    raiz.append(metricas);
    const abas=elemento('div','dia-abas');
    [['urgentes','Urgentes'],['hoje','Hoje'],['sem-prazo','Sem prazo'],['todas','Todas abertas']].forEach(([valor,rotulo])=>{const b=elemento('button',modo===valor?'ativo':'',rotulo);b.type='button';b.setAttribute('aria-pressed',String(modo===valor));b.addEventListener('click',()=>{modo=valor;renderizar()});abas.append(b)});
    raiz.append(abas);
    const lista=elemento('div','dia-lista');
    const selecao=modo==='urgentes'?enriquecidas.filter(t=>(t.prazo&&t.prazo<=agora)||t.prioridade==='alta'):modo==='hoje'?hojeLista:modo==='sem-prazo'?semPrazo:enriquecidas;
    selecao.sort((a,b)=>(a.prazo||'9999').localeCompare(b.prazo||'9999')||({alta:0,normal:1,baixa:2}[a.prioridade]-{alta:0,normal:1,baixa:2}[b.prioridade]));
    if(!selecao.length)lista.append(elemento('p','dia-vazio','Tudo em dia nesta seleção. Crie uma atividade ou escolha outra aba.'));
    selecao.slice(0,30).forEach(t=>{
      const card=elemento('article','dia-item');
      const corpo=elemento('div','dia-item-corpo');
      corpo.append(elemento('strong','',t.titulo),elemento('small','',t.prazo?(t.prazo<agora?'Atrasada · ':t.prazo===agora?'Hoje · ':'Prazo · ')+t.prazo:'Sem prazo definido'));
      const total=t.etapas.length,feitas=t.etapas.filter(e=>e.feito).length;
      corpo.append(elemento('span','',t.prioridade.toUpperCase()+' · '+t.estado+' · '+feitas+'/'+total+' etapas'));
      const acoes=elemento('div','dia-item-acoes');
      [['iniciar','Iniciar'],['concluir','Concluir'],['adiar','Amanhã']].forEach(([acao,rotulo])=>{if(acao==='iniciar'&&t.estado==='andamento')return;const b=elemento('button','',rotulo);b.type='button';b.setAttribute('aria-label',rotulo+' '+t.titulo);b.addEventListener('click',()=>agir(t.id,acao));acoes.append(b)});
      card.append(corpo,acoes);lista.append(card);
    });
    raiz.append(lista);
  }
  window.addEventListener('storage',renderizar);
  renderizar();
})();
