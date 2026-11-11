/* Ander Flow: quadro de tarefas local, eventos reais de interface e coreografia. */
(()=>{
'use strict';
const api=window.FlowEquipe;
if(!api)return;
const CHAVE='anderflow.tarefas.v1';
let tarefas=[];
try{const dados=JSON.parse(localStorage.getItem(CHAVE)||'[]');if(Array.isArray(dados))tarefas=dados.filter(t=>t&&typeof t.titulo==='string'&&['fila','andamento','revisao','concluida'].includes(t.estado)).slice(-50);}catch(_){}
const estados=['fila','andamento','revisao','concluida'];
const rotulos={fila:'Aguardando',andamento:'Em andamento',revisao:'Revisao do Chefinho',concluida:'Concluida'};
const salvar=()=>{try{localStorage.setItem(CHAVE,JSON.stringify(tarefas.slice(-50)));}catch(_){}};
const area=document.createElement('section');area.id='flow-quadro';area.setAttribute('aria-label','Quadro de tarefas da equipe');
area.innerHTML='<div class="flow-quadro-topo"><div><small>FLUXO DE TRABALHO</small><h3>Atelie de missoes</h3><p>Crie tarefas e acompanhe as etapas reais. Nenhuma execucao automatica e simulada.</p></div><button type="button" id="flow-quadro-fechar" aria-label="Fechar atelie">×</button></div><form id="flow-tarefa-criar"><label>Nova tarefa<input id="flow-tarefa-titulo" maxlength="90" required placeholder="Ex.: revisar o visual do jardim"></label><label>Responsavel<select id="flow-tarefa-responsavel"></select></label><button type="submit">Criar tarefa</button></form><div id="flow-tarefa-resumo" role="status"></div><div id="flow-tarefa-lista"></div>';
document.body.append(area);
const botao=document.createElement('button');botao.type='button';botao.id='flow-abrir-quadro';botao.textContent='✦ Missoes';document.getElementById('flow-atalhos')?.append(botao);
const obter=()=>api.listar();
const nomeChefe=()=>api.orquestrador().nome;
function atualizaResponsaveis(){
 const sel=area.querySelector('#flow-tarefa-responsavel'),valor=sel.value;sel.replaceChildren();
 const opcao=(v,t)=>{const o=document.createElement('option');o.value=v;o.textContent=t;sel.append(o);};
 opcao('chefe',nomeChefe()+' (orquestrador)');
 obter().forEach(a=>opcao(a.tipo,a.nome+' • '+a.tipo));
 if([...sel.options].some(o=>o.value===valor))sel.value=valor;
}
function tituloResp(t){
 if(t.responsavel==='chefe')return nomeChefe();
 return obter().find(a=>a.tipo===t.responsavel)?.nome||'Agente removido';
}
function emitir(t,anterior){
 area.dispatchEvent(new CustomEvent('flow:tarefa',{detail:{id:t.id,estado:t.estado,anterior},bubbles:true}));
}
function criar(titulo,responsavel){
 const novo={id:String(Date.now())+'-'+Math.random().toString(36).slice(2,7),titulo:String(titulo).trim().slice(0,90),responsavel,estado:'fila',criado:new Date().toISOString()};
 if(!novo.titulo)return false;
 tarefas.push(novo);tarefas=tarefas.slice(-50);salvar();emitir(novo,null);renderizar();return true;
}
function avancar(id){
 const t=tarefas.find(x=>x.id===id);if(!t)return;
 const pos=estados.indexOf(t.estado);if(pos===3)return;
 const anterior=t.estado;t.estado=estados[pos+1];salvar();emitir(t,anterior);renderizar();
}
function excluir(id){tarefas=tarefas.filter(t=>t.id!==id);salvar();renderizar();}
function renderizar(){
 atualizaResponsaveis();
 const lista=area.querySelector('#flow-tarefa-lista');lista.replaceChildren();
 const abertas=tarefas.filter(t=>t.estado!=='concluida').length;
 area.querySelector('#flow-tarefa-resumo').textContent=tarefas.length+' tarefas • '+abertas+' abertas • '+(tarefas.length-abertas)+' concluidas';
 if(!tarefas.length){const vazio=document.createElement('p');vazio.className='flow-quadro-vazio';vazio.textContent='Seu atelie esta vazio. Crie uma missao para acompanhar a equipe!';lista.append(vazio);return;}
 for(const t of tarefas.slice().reverse()){
  const item=document.createElement('article');item.className='flow-tarefa flow-tarefa--'+t.estado;
  const cab=document.createElement('div');cab.className='flow-tarefa-cab';
  const figura=document.createElement('span');figura.className='flow-tarefa-personagem';figura.setAttribute('aria-hidden','true');figura.innerHTML='<i class="flow-tarefa-olho"></i><i class="flow-tarefa-olho"></i><i class="flow-tarefa-sorriso"></i>';
  const info=document.createElement('div');info.className='flow-tarefa-info';
  const nome=document.createElement('strong');nome.textContent=t.titulo;
  const sub=document.createElement('small');sub.textContent=tituloResp(t)+' • '+rotulos[t.estado];
  info.append(nome,sub);cab.append(figura,info);item.append(cab);
  const trilha=document.createElement('div');trilha.className='flow-tarefa-trilha';trilha.setAttribute('aria-label','Progresso: '+rotulos[t.estado]);
  const idx=estados.indexOf(t.estado);
  estados.forEach((estado,i)=>{const etapa=document.createElement('span');etapa.className='flow-etapa'+(i<=idx?' flow-etapa-feita':'');etapa.title=rotulos[estado];trilha.append(etapa);});
  item.append(trilha);
  const acoes=document.createElement('div');acoes.className='flow-tarefa-acoes';
  if(idx<3){const avancarBtn=document.createElement('button');avancarBtn.type='button';avancarBtn.textContent=['Iniciar','Enviar para revisao','Aprovar e concluir'][idx];avancarBtn.addEventListener('click',()=>avancar(t.id));acoes.append(avancarBtn);}
  const remover=document.createElement('button');remover.type='button';remover.className='flow-tarefa-excluir';remover.textContent='Excluir';remover.setAttribute('aria-label','Excluir tarefa '+t.titulo);remover.addEventListener('click',()=>excluir(t.id));acoes.append(remover);item.append(acoes);lista.append(item);
 }
}
area.querySelector('#flow-tarefa-criar').addEventListener('submit',e=>{e.preventDefault();const campo=area.querySelector('#flow-tarefa-titulo');if(criar(campo.value,area.querySelector('#flow-tarefa-responsavel').value))campo.value='';});
botao?.addEventListener('click',()=>{area.classList.add('flow-quadro-aberto');renderizar();});
area.querySelector('#flow-quadro-fechar').addEventListener('click',()=>area.classList.remove('flow-quadro-aberto'));
document.addEventListener('keydown',e=>{if(e.key==='Escape')area.classList.remove('flow-quadro-aberto');});
window.FlowTarefas={listar:()=>tarefas.map(t=>({...t})),criar,avancar,excluir,abrir:()=>botao.click()};
renderizar();
})();