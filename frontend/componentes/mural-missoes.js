/* Ander Flow — mural visual das missoes com arrastar, toque e transicoes reais. */
(()=>{
'use strict';
const api=window.FlowTarefas, equipe=window.FlowEquipe, quadro=document.getElementById('flow-quadro');
if(!api||!equipe||!quadro)return;
const etapas=[['fila','Aguardando'],['andamento','Em acao'],['revisao','Revisao'],['concluida','Concluidas']];
const mural=document.createElement('section');mural.id='flow-mural';mural.hidden=true;
mural.innerHTML='<div class="flow-mural-topo"><div><small>VISUALIZACAO INTERATIVA</small><h4>Mural vivo de missoes</h4><p>Arraste um cartao ou use os botoes para mudar sua etapa. Todas as mudancas sao manuais.</p></div><button type="button" id="flow-mural-voltar">Ver lista</button></div><div class="flow-mural-colunas" role="group" aria-label="Etapas das missoes"></div><p class="flow-mural-aviso" role="status" aria-live="polite"></p>';
quadro.querySelector('#flow-tarefa-resumo').before(mural);
const alternar=document.createElement('button');alternar.type='button';alternar.id='flow-mural-abrir';alternar.textContent='Ver mural de missoes';quadro.querySelector('#flow-tarefa-criar').after(alternar);
const colunas=mural.querySelector('.flow-mural-colunas'),aviso=mural.querySelector('.flow-mural-aviso');
let emMovimento=false;
function mudar(id,destino){
 const atual=api.listar().find(t=>t.id===id),indice=etapas.findIndex(e=>e[0]===destino);
 if(!atual||indice<0)return false;
 let pos=etapas.findIndex(e=>e[0]===atual.estado);
 if(pos===indice)return true;
 emMovimento=true;
 while(pos<indice){api.avancar(id);pos++;}
 while(pos>indice){api.voltar(id);pos--;}
 emMovimento=false;
 aviso.textContent='Missao "'+atual.titulo+'" movida para '+etapas[indice][1]+'. Registro atualizado no Diario do Chefinho.';
 desenhar();return true;
}
function desenhar(){
 if(emMovimento||mural.hidden)return;
 const tarefas=api.listar(),agentes=equipe.listar(),chefe=equipe.orquestrador().nome;
 colunas.replaceChildren();
 for(const [estado,rotulo] of etapas){
  const coluna=document.createElement('section');coluna.className='flow-mural-coluna';coluna.dataset.estado=estado;
  const itens=tarefas.filter(t=>t.estado===estado);
  const titulo=document.createElement('h5');titulo.textContent=rotulo+' ('+itens.length+')';coluna.append(titulo);
  coluna.addEventListener('dragover',e=>{e.preventDefault();coluna.classList.add('flow-mural-alvo');});
  coluna.addEventListener('dragleave',e=>{if(!coluna.contains(e.relatedTarget))coluna.classList.remove('flow-mural-alvo');});
  coluna.addEventListener('drop',e=>{e.preventDefault();coluna.classList.remove('flow-mural-alvo');const id=e.dataTransfer?.getData('text/plain');if(id)mudar(id,estado);});
  if(!itens.length){const vazio=document.createElement('p');vazio.className='flow-mural-vazio';vazio.textContent='Nenhuma missao aqui';coluna.append(vazio);}
  for(const t of itens){
   const card=document.createElement('article');card.className='flow-mural-cartao';card.draggable=true;card.dataset.id=t.id;
   card.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',t.id);e.dataTransfer.effectAllowed='move';card.classList.add('flow-mural-arrastando');});
   card.addEventListener('dragend',()=>card.classList.remove('flow-mural-arrastando'));
   const rosto=document.createElement('span');rosto.className='flow-mural-rosto';rosto.setAttribute('aria-hidden','true');rosto.innerHTML='<i></i><i></i><b></b>';
   const conteudo=document.createElement('div');conteudo.className='flow-mural-conteudo';
   const nome=document.createElement('strong');nome.textContent=t.titulo;
   const resp=document.createElement('small');resp.textContent=t.responsavel==='chefe'?chefe:(agentes.find(a=>a.tipo===t.responsavel)?.nome||'Agente removido');
   conteudo.append(nome,resp);card.append(rosto,conteudo);
   const acoes=document.createElement('div');acoes.className='flow-mural-acoes';
   const pos=etapas.findIndex(e=>e[0]===estado);
   if(pos>0){const anterior=document.createElement('button');anterior.type='button';anterior.textContent='Anterior';anterior.setAttribute('aria-label','Voltar etapa de '+t.titulo);anterior.addEventListener('click',()=>mudar(t.id,etapas[pos-1][0]));acoes.append(anterior);}
   if(pos<3){const proximo=document.createElement('button');proximo.type='button';proximo.textContent='Proxima';proximo.setAttribute('aria-label','Avancar etapa de '+t.titulo);proximo.addEventListener('click',()=>mudar(t.id,etapas[pos+1][0]));acoes.append(proximo);}
   card.append(acoes);coluna.append(card);
  }
  colunas.append(coluna);
 }
}
function mostrar(sim){quadro.classList.toggle('flow-quadro-mural',sim);mural.hidden=!sim;quadro.querySelector('#flow-tarefa-lista').hidden=sim;quadro.querySelector('#flow-acompanhamento').hidden=sim;quadro.querySelector('#flow-historico-painel').hidden=sim;alternar.hidden=sim;if(sim)desenhar();}
alternar.addEventListener('click',()=>mostrar(true));
mural.querySelector('#flow-mural-voltar').addEventListener('click',()=>mostrar(false));
const observador=new MutationObserver(()=>{if(!emMovimento)desenhar();});
observador.observe(quadro.querySelector('#flow-tarefa-lista'),{childList:true});
window.FlowMural={abrir:()=>{api.abrir();mostrar(true);},listar:()=>api.listar(),mover:mudar};
})();