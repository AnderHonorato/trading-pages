/* Ander Flow — Sala de Comando: gestao visual local, sem IA ou trading real. */
(()=>{
'use strict';
const tarefas=window.FlowTarefas,equipe=window.FlowEquipe;
if(!tarefas||!equipe||!document.getElementById('flow-quadro'))return;
const estados=['fila','andamento','revisao','concluida'];
const nomes=['Aguardando','Em acao','Revisao','Concluida'];
const painel=document.createElement('section');
painel.id='flow-sala';painel.hidden=true;
painel.innerHTML='<header class="flow-sala-cab"><div><small>ANDER FLOW · CONTROLE LOCAL</small><h3>Sala de Comando</h3><p>O Chefinho acompanha a equipe. Movimentos sao manuais e ficam no diario.</p></div><button type="button" id="flow-sala-fechar">Fechar</button></header><div class="flow-sala-resumo" role="status"></div><div class="flow-sala-filtros"><label>Buscar missao<input id="flow-sala-busca" placeholder="Nome da tarefa" maxlength="90"></label><label>Responsavel<select id="flow-sala-agente"></select></label></div><div class="flow-sala-corpo"><div class="flow-sala-pista" role="list" aria-label="Missoes e progresso"></div><aside class="flow-sala-detalhe" aria-live="polite"></aside></div><footer class="flow-sala-rodape"><span>Demonstracao local · sem agentes de IA conectados</span><button type="button" id="flow-sala-exportar">Exportar quadro</button></footer>';
document.body.append(painel);
const atalho=document.createElement('button');atalho.type='button';atalho.id='flow-sala-abrir';atalho.textContent='Sala de Comando';atalho.setAttribute('aria-label','Abrir Sala de Comando');
document.body.append(atalho);
const pista=painel.querySelector('.flow-sala-pista'),detalhe=painel.querySelector('.flow-sala-detalhe'),busca=painel.querySelector('#flow-sala-busca'),seletor=painel.querySelector('#flow-sala-agente');
let selecionada=null;
function rotuloResp(t){return t.responsavel==='chefe'?equipe.orquestrador().nome:(equipe.listar().find(a=>a.tipo===t.responsavel)?.nome||'Agente removido');}
function botao(texto,acao){const b=document.createElement('button');b.type='button';b.textContent=texto;b.addEventListener('click',acao);return b;}
function atualizarAgentes(){
 const valor=seletor.value;seletor.replaceChildren();
 const todos=document.createElement('option');todos.value='';todos.textContent='Todos os agentes';seletor.append(todos);
 const op=document.createElement('option');op.value='chefe';op.textContent=equipe.orquestrador().nome;seletor.append(op);
 equipe.listar().forEach(a=>{const o=document.createElement('option');o.value=a.tipo;o.textContent=a.nome;seletor.append(o);});
 if([...seletor.options].some(o=>o.value===valor))seletor.value=valor;
}
function renderizar(){
 if(painel.hidden)return;
 atualizarAgentes();
 const lista=tarefas.listar(),filtrada=lista.filter(t=>(!seletor.value||t.responsavel===seletor.value)&&t.titulo.toLocaleLowerCase('pt-BR').includes(busca.value.toLocaleLowerCase('pt-BR')));
 const contagens=estados.map(e=>lista.filter(t=>t.estado===e).length);
 painel.querySelector('.flow-sala-resumo').replaceChildren(...nomes.map((n,i)=>{const e=document.createElement('div');e.className='flow-sala-indicador';const forte=document.createElement('strong');forte.textContent=contagens[i];const legenda=document.createElement('span');legenda.textContent=n;e.append(forte,legenda);return e;}));
 pista.replaceChildren();
 if(!filtrada.length){const vazio=document.createElement('p');vazio.className='flow-sala-vazio';vazio.textContent=lista.length?'Nenhuma missao corresponde ao filtro.':'Nenhuma missao criada. Abra Missoes para criar a primeira.';pista.append(vazio);}
 filtrada.forEach(t=>{
 const indice=estados.indexOf(t.estado),card=document.createElement('button');card.type='button';card.className='flow-sala-card'+(selecionada===t.id?' ativo':'');card.setAttribute('role','listitem');card.setAttribute('aria-label',t.titulo+', '+nomes[indice]+', responsavel '+rotuloResp(t));
 const rosto=document.createElement('span');rosto.className='flow-sala-rosto';rosto.setAttribute('aria-hidden','true');rosto.innerHTML='<i></i><i></i><b></b>';
 const info=document.createElement('span');info.className='flow-sala-card-info';const titulo=document.createElement('strong');titulo.textContent=t.titulo;const resp=document.createElement('small');resp.textContent=rotuloResp(t)+' · '+nomes[indice];const barra=document.createElement('span');barra.className='flow-sala-barra';const progresso=document.createElement('i');progresso.style.width=((indice+1)*25)+'%';barra.append(progresso);info.append(titulo,resp,barra);card.append(rosto,info);card.addEventListener('click',()=>{selecionada=t.id;renderizar();});pista.append(card);
 });
 const atual=lista.find(t=>t.id===selecionada)||filtrada[0];detalhe.replaceChildren();
 if(!atual){const vazio=document.createElement('p');vazio.textContent='Selecione uma missao para acompanhar e mudar a etapa.';detalhe.append(vazio);return;}
 selecionada=atual.id;const indice=estados.indexOf(atual.estado);
 const cab=document.createElement('h4');cab.textContent=atual.titulo;const sub=document.createElement('p');sub.textContent='Responsavel: '+rotuloResp(atual)+' · '+nomes[indice];detalhe.append(cab,sub);
 const trilha=document.createElement('ol');trilha.className='flow-sala-etapas';
 nomes.forEach((nome,i)=>{const li=document.createElement('li');li.className=i<indice?'feito':i===indice?'atual':'';li.textContent=nome;trilha.append(li);});detalhe.append(trilha);
 const acoes=document.createElement('div');acoes.className='flow-sala-acoes';
 if(indice>0)acoes.append(botao('Voltar etapa',()=>{tarefas.voltar(atual.id);renderizar();}));
 if(indice<3)acoes.append(botao(indice===2?'Aprovar e concluir':'Avancar etapa',()=>{tarefas.avancar(atual.id);renderizar();}));
 acoes.append(botao('Abrir mural',()=>{painel.hidden=true;window.FlowMural?.abrir();}));
 detalhe.append(acoes);
 const log=document.createElement('div');log.className='flow-sala-log';const h=document.createElement('h5');h.textContent='Historico desta missao';log.append(h);
 const eventos=tarefas.historico().filter(e=>e.tarefa===atual.id).slice(-5).reverse();
 if(!eventos.length){const p=document.createElement('p');p.textContent='Ainda sem movimentacoes registradas.';log.append(p);}
 eventos.forEach(e=>{const p=document.createElement('p');const data=document.createElement('time');data.textContent=new Date(e.data).toLocaleString('pt-BR');p.append(data,document.createTextNode(' · '+e.texto));log.append(p);});
 detalhe.append(log);
}
function abrir(){painel.hidden=false;selecionada=null;renderizar();painel.querySelector('#flow-sala-fechar').focus();}
function fechar(){painel.hidden=true;atalho.focus();}
atalho.addEventListener('click',abrir);painel.querySelector('#flow-sala-fechar').addEventListener('click',fechar);
busca.addEventListener('input',()=>{selecionada=null;renderizar();});seletor.addEventListener('change',()=>{selecionada=null;renderizar();});
document.addEventListener('flow:historico',renderizar);
document.addEventListener('flow:tarefa',renderizar);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!painel.hidden)fechar();});
painel.querySelector('#flow-sala-exportar').addEventListener('click',()=>{
 const blob=new Blob([JSON.stringify({autor:'Ander Flow',modo:'demonstracao-local',tarefas:tarefas.listar(),historico:tarefas.historico()},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='ander-flow-sala-comando.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
window.FlowSala={abrir,fechar,atualizar:renderizar};
})();