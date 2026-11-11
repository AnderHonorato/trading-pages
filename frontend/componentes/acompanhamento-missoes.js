/* Ander Flow — acompanhamento real das missoes locais, sem execucao ficticia. */
(()=>{
'use strict';
const tarefas=window.FlowTarefas,equipe=window.FlowEquipe;
if(!tarefas||!equipe)return;
const painel=document.getElementById('flow-quadro');
if(!painel)return;
const filtro=document.createElement('section');filtro.id='flow-acompanhamento';
filtro.innerHTML='<div class="flow-acomp-topo"><strong>Central de acompanhamento</strong><span id="flow-acomp-total" role="status"></span></div><div class="flow-acomp-indicadores" id="flow-acomp-indicadores"></div><div class="flow-acomp-filtros"><label>Buscar missao<input id="flow-acomp-busca" type="search" placeholder="Nome da tarefa..." aria-label="Buscar missao"></label><label>Etapa<select id="flow-acomp-estado"><option value="todas">Todas</option><option value="fila">Aguardando</option><option value="andamento">Em andamento</option><option value="revisao">Revisao</option><option value="concluida">Concluidas</option></select></label><label>Agente<select id="flow-acomp-agente"><option value="todos">Todos</option></select></label></div><div class="flow-acomp-acoes"><button type="button" id="flow-acomp-limpar">Limpar filtros</button><button type="button" id="flow-acomp-exportar">Exportar minhas missoes</button></div><div id="flow-acomp-avisos" role="status" aria-live="polite"></div>';
painel.querySelector('#flow-tarefa-resumo').before(filtro);
const busca=filtro.querySelector('#flow-acomp-busca'),estado=filtro.querySelector('#flow-acomp-estado'),agente=filtro.querySelector('#flow-acomp-agente');
const nomes={fila:'Aguardando',andamento:'Executando',revisao:'Em revisao',concluida:'Concluidas'};
const original=window.FlowTarefas;
function atualizar(){
 const todas=original.listar(),contagem=Object.fromEntries(Object.keys(nomes).map(x=>[x,todas.filter(t=>t.estado===x).length]));
 const indicadores=filtro.querySelector('#flow-acomp-indicadores');indicadores.replaceChildren();
 Object.entries(nomes).forEach(([chave,nome])=>{
  const botao=document.createElement('button');botao.type='button';botao.className='flow-acomp-indicador'+(estado.value===chave?' selecionado':'');
  botao.innerHTML='<span class="flow-acomp-numero"></span><small></small>';
  botao.querySelector('span').textContent=contagem[chave];botao.querySelector('small').textContent=nome;
  botao.setAttribute('aria-pressed',String(estado.value===chave));
  botao.addEventListener('click',()=>{estado.value=estado.value===chave?'todas':chave;atualizar();});indicadores.append(botao);
 });
 const anterior=agente.value;agente.replaceChildren(new Option('Todos','todos'),new Option(equipe.orquestrador().nome,'chefe'));
 equipe.listar().forEach(a=>agente.append(new Option(a.nome,a.tipo)));
 if([...agente.options].some(x=>x.value===anterior))agente.value=anterior;
 const termo=busca.value.trim().toLocaleLowerCase('pt-BR');
 let visiveis=0;
 painel.querySelectorAll('.flow-tarefa').forEach(card=>{
  const id=card.dataset.tarefaId;
  const t=todas.find(x=>x.id===id);
  if(!t)return;
  const mostra=(estado.value==='todas'||t.estado===estado.value)&&(agente.value==='todos'||t.responsavel===agente.value)&&(!termo||t.titulo.toLocaleLowerCase('pt-BR').includes(termo));
  card.hidden=!mostra;if(mostra)visiveis++;
 });
 filtro.querySelector('#flow-acomp-total').textContent=visiveis+' de '+todas.length+' visiveis';
 filtro.querySelector('#flow-acomp-avisos').textContent=todas.length&&!visiveis?'Nenhuma tarefa corresponde aos filtros.':'';
}
const observer=new MutationObserver(()=>{observer.disconnect();atualizar();observer.observe(painel.querySelector('#flow-tarefa-lista'),{childList:true});});
const lista=painel.querySelector('#flow-tarefa-lista');
observer.observe(lista,{childList:true});
busca.addEventListener('input',atualizar);estado.addEventListener('change',atualizar);agente.addEventListener('change',atualizar);
filtro.querySelector('#flow-acomp-limpar').addEventListener('click',()=>{busca.value='';estado.value='todas';agente.value='todos';atualizar();});
filtro.querySelector('#flow-acomp-exportar').addEventListener('click',()=>{
 const dados={formato:'ander-flow-missoes-v1',exportadoEm:new Date().toISOString(),orquestrador:equipe.orquestrador().nome,tarefas:original.listar()};
 const url=URL.createObjectURL(new Blob([JSON.stringify(dados,null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='ander-flow-missoes-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 filtro.querySelector('#flow-acomp-avisos').textContent='Arquivo de missoes preparado para download.';
});
window.FlowAcompanhamento={atualizar,contagens:()=>Object.fromEntries(Object.keys(nomes).map(x=>[x,original.listar().filter(t=>t.estado===x).length]))};
atualizar();
})();