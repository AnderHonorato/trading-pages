/* Radar Flow — central de prioridades local, sem agentes ficticios. Ander Flow. */
(()=>{'use strict';
const CH={missao:'ander-flow-missoes-v1',despacho:'ander-flow-despachos-v1',equipe:'ander-flow-equipe-v1'};
const ler=(k,p)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??p}catch{return p}};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const raiz=document.createElement('section');raiz.id='flow-radar';
raiz.innerHTML=`<button id="fr-abrir" aria-haspopup="dialog"><span class="fr-sinal" aria-hidden="true"></span>Radar Flow <span id="fr-pendencias">0</span></button><div id="fr-fundo" hidden><div id="fr-painel" role="dialog" aria-modal="true" aria-labelledby="fr-titulo"><header><div><small>ANDER FLOW · CENTRO DE COMANDO</small><h2 id="fr-titulo">Radar de prioridades</h2><p>O que precisa da sua atenção agora? Tudo é manual e fica neste navegador.</p></div><button id="fr-fechar" aria-label="Fechar Radar">×</button></header><div id="fr-metricas" class="fr-metricas"></div><div class="fr-ferramentas"><label>Buscar atividade<input id="fr-busca" type="search" placeholder="Título, responsável ou orientação"></label><label>Exibir<select id="fr-filtro"><option value="abertas">Em aberto</option><option value="todas">Todas</option><option value="concluidas">Concluídas</option></select></label></div><div class="fr-cabecalho"><h3>Fila de atenção</h3><span id="fr-contagem"></span></div><div id="fr-lista" class="fr-lista"></div><p id="fr-aviso" role="status" aria-live="polite"></p><p class="fr-nota">O Radar reúne missões e despachos existentes. Nenhuma tarefa é executada automaticamente.</p></div></div>`;
document.body.append(raiz);const $=s=>raiz.querySelector(s),fundo=$('#fr-fundo');
const fase=['A fazer','Em andamento','Revisão','Concluída'];
function dados(){const m=ler(CH.missao,[]),d=ler(CH.despacho,[]),e=ler(CH.equipe,{});const agentes=Array.isArray(e?.agentes)?e.agentes:[];const chefe=e?.chefe?.nome||'Chefinho';
const nome=id=>id==='chefe'||!id?chefe:agentes.find(a=>a.id===id)?.nome||'Agente removido';
const missoes=Array.isArray(m)?m:[],despachos=Array.isArray(d)?d:[];
return {missoes,despachos,itens:[...missoes.filter(x=>x&&typeof x==='object').map(x=>({tipo:'missao',id:String(x.id),titulo:String(x.titulo||'Missão sem título'),responsavel:nome(x.agente),estado:fase[Math.max(0,Math.min(3,Number(x.fase)||0))],concluida:Number(x.fase)===3,prioridade:2,descricao:'Missão',data:x.atualizado||x.criado||''})),...despachos.filter(x=>x&&typeof x==='object').map(x=>({tipo:'despacho',id:String(x.id),titulo:String(x.titulo||'Despacho sem título'),responsavel:nome(x.agente),estado:({pendente:'A fazer',andamento:'Em andamento',concluido:'Concluído'})[x.status]||'A fazer',concluida:x.status==='concluido',prioridade:x.prioridade==='alta'?0:x.prioridade==='baixa'?3:1,descricao:String(x.descricao||'Despacho manual'),data:x.atualizado||x.criado||''}))]}}
let termo='',filtro='abertas';
function pintar(){const d=dados(),abertas=d.itens.filter(x=>!x.concluida),feitas=d.itens.length-abertas.length;
$('#fr-pendencias').textContent=abertas.length;
$('#fr-metricas').innerHTML=`<article><strong>${abertas.length}</strong><span>Em aberto</span></article><article><strong>${feitas}</strong><span>Concluídas</span></article><article><strong>${d.missoes.length}</strong><span>Missões</span></article><article><strong>${d.despachos.length}</strong><span>Despachos</span></article>`;
const visiveis=d.itens.filter(x=>(filtro==='todas'||(filtro==='abertas'?!x.concluida:x.concluida))&&[x.titulo,x.responsavel,x.descricao].some(v=>v.toLowerCase().includes(termo))).sort((a,b)=>Number(a.concluida)-Number(b.concluida)||a.prioridade-b.prioridade||String(b.data).localeCompare(String(a.data)));
$('#fr-contagem').textContent=visiveis.length+' atividades';
$('#fr-lista').innerHTML=visiveis.map(x=>`<article class="fr-item ${x.concluida?'fr-feita':''}"><div class="fr-item-topo"><span class="fr-tipo">${x.tipo==='missao'?'Missão':'Despacho'}</span><span class="fr-estado">${esc(x.estado)}</span></div><h4>${esc(x.titulo)}</h4><p>${esc(x.descricao)}</p><div class="fr-item-rodape"><span>Responsável: ${esc(x.responsavel)}</span><button data-tipo="${x.tipo}" data-id="${esc(x.id)}" data-acao="${x.concluida?'reabrir':'avancar'}">${x.concluida?'Reabrir':x.tipo==='missao'?'Avançar etapa':'Avançar despacho'}</button></div></article>`).join('')||'<div class="fr-vazio"><strong>Fila tranquila!</strong><p>Nenhuma atividade corresponde ao filtro. Crie uma missão ou despacho para começar.</p></div>'}
function salvar(chave,lista){try{localStorage.setItem(chave,JSON.stringify(lista));window.dispatchEvent(new CustomEvent('ander-flow:radar-atualizado',{detail:{chave}}));return true}catch{$('#fr-aviso').textContent='Não foi possível salvar. Verifique o espaço do navegador.';return false}}
$('#fr-lista').addEventListener('click',e=>{const b=e.target.closest('button[data-acao]');if(!b)return;const d=dados(),lista=b.dataset.tipo==='missao'?d.missoes:d.despachos,chave=b.dataset.tipo==='missao'?CH.missao:CH.despacho,alvo=lista.find(x=>String(x.id)===b.dataset.id);if(!alvo)return;
const antes=JSON.stringify(alvo);
if(b.dataset.tipo==='missao')alvo.fase=b.dataset.acao==='reabrir'?0:Math.min(3,(Number(alvo.fase)||0)+1);
else alvo.status=b.dataset.acao==='reabrir'?'pendente':alvo.status==='pendente'?'andamento':'concluido';
alvo.atualizado=new Date().toISOString();
if(!salvar(chave,lista))Object.assign(alvo,JSON.parse(antes));else $('#fr-aviso').textContent='Etapa atualizada no navegador. Abra a ferramenta original para conferir.';
pintar()});
$('#fr-abrir').onclick=()=>{pintar();fundo.hidden=false;$('#fr-fechar').focus()};
function fechar(){fundo.hidden=true;$('#fr-abrir').focus()}
$('#fr-fechar').onclick=fechar;fundo.addEventListener('click',e=>{if(e.target===fundo)fechar()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!fundo.hidden)fechar()});
$('#fr-busca').oninput=e=>{termo=e.target.value.trim().toLowerCase();pintar()};
$('#fr-filtro').onchange=e=>{filtro=e.target.value;pintar()};
window.addEventListener('storage',e=>{if(Object.values(CH).includes(e.key))pintar()});
window.addEventListener('ander-flow-despachos-alterados',pintar);
pintar();
})();