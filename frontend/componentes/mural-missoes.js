/* Mural de missoes local, sem execucao automatica. Ander Flow. */
(()=>{'use strict';
const CHAVE='ander-flow-missoes-v1', EQUIPE='ander-flow-equipe-v1';
const fases=['A fazer','Em andamento','Revisao','Concluida'];
const ler=(chave,padrao)=>{try{return JSON.parse(localStorage.getItem(chave))||padrao}catch{return padrao}};
let missoes=ler(CHAVE,[]);if(!Array.isArray(missoes))missoes=[];
const guardar=()=>{try{localStorage.setItem(CHAVE,JSON.stringify(missoes));return true}catch{return false}};
const equipe=()=>{const e=ler(EQUIPE,{});return {chefe:e.chefe||{nome:'Chefinho'},agentes:Array.isArray(e.agentes)?e.agentes:[]}};
const escapar=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const painel=document.createElement('section');painel.id='flow-missoes';painel.innerHTML=`<button id="fm-abrir" aria-haspopup="dialog">Missões <span id="fm-total">0</span></button><div id="fm-fundo" hidden><div id="fm-dialogo" role="dialog" aria-modal="true" aria-label="Mural de missões"><header><div><small>ANDER FLOW · CENTRAL DE MISSÕES</small><h2>Mural vivo</h2><p>Atividades manuais · nenhuma IA é executada</p></div><button id="fm-fechar" aria-label="Fechar mural">×</button></header><form id="fm-form"><label>Nova missão<input name="titulo" maxlength="110" required placeholder="Ex.: Revisar interface do app"></label><label>Responsável<select name="agente"></select></label><button type="submit">Criar missão</button></form><div class="fm-filtros"><label>Pesquisar<input id="fm-busca" placeholder="Buscar missão..."></label><label>Filtrar<select id="fm-filtro"><option value="">Todos</option></select></label></div><div id="fm-resumo" role="status" aria-live="polite"></div><div id="fm-colunas"></div><button id="fm-exportar">Exportar JSON</button><p id="fm-aviso" role="status"></p></div></div>`;document.body.append(painel);
const $=s=>painel.querySelector(s), fundo=$('#fm-fundo');
let busca='',filtro='';
const nomeAgente=id=>id==='chefe'?equipe().chefe.nome:equipe().agentes.find(a=>a.id===id)?.nome||'Agente removido';
function atualizar(){
$('#fm-total').textContent=missoes.length;
const e=equipe(),opts=[{id:'chefe',nome:e.chefe.nome},...e.agentes.map(a=>({id:a.id,nome:a.nome}))];
const select=$('#fm-form select'),atual=select.value;
select.innerHTML=opts.map(a=>`<option value="${escapar(a.id)}">${escapar(a.nome)}</option>`).join('');
if(opts.some(a=>a.id===atual))select.value=atual;
$('#fm-filtro').innerHTML='<option value="">Todos os responsáveis</option>'+opts.map(a=>`<option value="${escapar(a.id)}">${escapar(a.nome)}</option>`).join('');
$('#fm-filtro').value=filtro;
const exibidas=missoes.filter(m=>m.titulo.toLowerCase().includes(busca.toLowerCase())&&(!filtro||m.agente===filtro));
$('#fm-resumo').textContent=`${missoes.length} missões · ${missoes.filter(m=>m.fase===3).length} concluídas · ${exibidas.length} visíveis`;
$('#fm-colunas').innerHTML=fases.map((fase,i)=>`<section class="fm-coluna" data-fase="${i}"><h3>${fase} <span>${exibidas.filter(m=>m.fase===i).length}</span></h3><div class="fm-lista">${exibidas.filter(m=>m.fase===i).map(m=>`<article class="fm-cartao" draggable="true" data-id="${escapar(m.id)}"><strong>${escapar(m.titulo)}</strong><small>Por ${escapar(nomeAgente(m.agente))} · ${escapar(m.criado)}</small><div class="fm-progresso"><span style="width:${(m.fase+1)*25}%"></span></div><div class="fm-comandos"><button data-mover="-1" data-id="${escapar(m.id)}" ${m.fase===0?'disabled':''} aria-label="Voltar etapa">←</button><button data-mover="1" data-id="${escapar(m.id)}" ${m.fase===3?'disabled':''} aria-label="Avançar etapa">→</button><button data-excluir="${escapar(m.id)}" aria-label="Excluir missão">Excluir</button></div></article>`).join('')||'<p class="fm-vazio">Nenhuma missão nesta etapa.</p>'}</div></section>`).join('');
}
function mover(id,delta,absoluto=false){const m=missoes.find(x=>x.id===id);if(!m)return;m.fase=Math.max(0,Math.min(3,absoluto?delta:m.fase+delta));m.atualizado=new Date().toISOString();if(!guardar())$('#fm-aviso').textContent='Sem espaço para salvar as alterações.';atualizar();}
$('#fm-abrir').onclick=()=>{fundo.hidden=false;atualizar();$('#fm-fechar').focus()};
function fechar(){fundo.hidden=true;$('#fm-abrir').focus()}
$('#fm-fechar').onclick=fechar;
fundo.onclick=e=>{if(e.target===fundo)fechar()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!fundo.hidden)fechar()});
$('#fm-form').onsubmit=e=>{e.preventDefault();const d=new FormData(e.currentTarget),titulo=String(d.get('titulo')||'').trim();if(!titulo)return;missoes.unshift({id:crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random(),titulo,agente:String(d.get('agente')||'chefe'),fase:0,criado:new Date().toLocaleDateString('pt-BR'),atualizado:new Date().toISOString()});guardar();e.currentTarget.reset();atualizar()};
$('#fm-busca').oninput=e=>{busca=e.target.value;atualizar()};
$('#fm-filtro').onchange=e=>{filtro=e.target.value;atualizar()};
$('#fm-colunas').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.mover)mover(b.dataset.id,Number(b.dataset.mover));if(b.dataset.excluir){if(confirm('Excluir esta missão?')){missoes=missoes.filter(m=>m.id!==b.dataset.excluir);guardar();atualizar()}}};
let arrastado=null;
$('#fm-colunas').addEventListener('dragstart',e=>{const c=e.target.closest('.fm-cartao');if(c){arrastado=c.dataset.id;e.dataTransfer.effectAllowed='move'}});
$('#fm-colunas').addEventListener('dragover',e=>{if(arrastado&&e.target.closest('.fm-coluna'))e.preventDefault()});
$('#fm-colunas').addEventListener('drop',e=>{const c=e.target.closest('.fm-coluna');if(c&&arrastado){e.preventDefault();mover(arrastado,Number(c.dataset.fase),true);arrastado=null}});
$('#fm-exportar').onclick=()=>{const blob=new Blob([JSON.stringify({tipo:'demonstracao',missoes},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='ander-flow-missoes.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
atualizar();
})();