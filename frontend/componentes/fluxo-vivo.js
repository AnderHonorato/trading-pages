/* Fluxo Vivo: mapa de trabalho baseado em registros locais, sem IA simulada. */
(()=>{'use strict';
const KD='ander-flow-despachos-v1',KE='ander-flow-equipe-v1',KR='ander-flow-revisoes-v1';
const ler=(k,p)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??p}catch{return p}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const raiz=document.createElement('section');raiz.id='fluxo-vivo';
raiz.innerHTML=`<button id="fv-abrir" aria-haspopup="dialog">Fluxo Vivo · Mapa de trabalho</button><div id="fv-fundo" hidden><div id="fv-painel" role="dialog" aria-modal="true" aria-labelledby="fv-titulo"><header><div><small>ANDER FLOW · CENTRO DE FLUXOS</small><h2 id="fv-titulo">Fluxo Vivo</h2><p>Veja por onde cada tarefa passou e o que precisa da sua atenção. Movimentos representam registros reais, não execução automática de agentes.</p></div><button id="fv-fechar" aria-label="Fechar Fluxo Vivo">×</button></header><div id="fv-resumo" class="fv-resumo"></div><div class="fv-controles"><label>Buscar tarefa<input id="fv-busca" type="search" placeholder="Título, agente ou resultado"></label><label>Responsável<select id="fv-agente"><option value="">Todos</option></select></label><button id="fv-limpar">Limpar filtros</button></div><div id="fv-mapa" class="fv-mapa" aria-label="Etapas do fluxo de trabalho"></div><div class="fv-detalhes"><h3 id="fv-detalhe-titulo">Selecione uma etapa</h3><p id="fv-detalhe-ajuda">Toque numa etapa para examinar tarefas e decisões registradas.</p><div id="fv-lista"></div></div><p class="fv-nota">Dados armazenados neste navegador. Aprovação é manual; não representa teste automático, operação financeira ou IA conectada.</p><p id="fv-aviso" role="status"></p></div></div>`;
document.body.append(raiz);const $=s=>raiz.querySelector(s);let etapa='todas',busca='',agente='';
const fases=[{id:'pendente',nome:'Planejamento',sub:'Aguardando início',simbolo:'✦'},{id:'andamento',nome:'Produção',sub:'Trabalho registrado',simbolo:'✎'},{id:'revisao',nome:'Revisão',sub:'Aguardando decisão',simbolo:'◇'},{id:'aprovado',nome:'Aprovado',sub:'Conferência manual',simbolo:'✓'},{id:'devolvido',nome:'Ajustes',sub:'Retorno ao trabalho',simbolo:'↶'}];
const equipe=()=>{const v=ler(KE,{});return {chefe:v?.chefe?.nome||'Chefinho',agentes:Array.isArray(v?.agentes)?v.agentes:[]}};
const tarefas=()=>{const v=ler(KD,[]);return Array.isArray(v)?v:[]};
const revisoes=()=>{const v=ler(KR,{});return v&&typeof v==='object'&&!Array.isArray(v)?v:{}};
const nome=(id,e)=>id==='chefe'||!id?e.chefe:e.agentes.find(a=>String(a.id)===String(id))?.nome||'Agente removido';
function classificar(t,r){const x=r[t.id];if(x?.decisao==='rejeitado'&&t.status!=='concluido')return 'devolvido';if(t.status==='concluido'){if(x?.decisao==='aprovado'&&(!t.concluido||x.quando>=t.concluido))return 'aprovado';return 'revisao'}return t.status==='andamento'?'andamento':'pendente'}
function render(){const e=equipe(),r=revisoes(),todos=tarefas().map(t=>({...t,fase:classificar(t,r)}));
const selecionados=todos.filter(t=>(!agente||String(t.agente)===agente)&&[t.titulo,t.descricao,t.resultado,nome(t.agente,e)].some(v=>String(v||'').toLocaleLowerCase('pt-BR').includes(busca)));
const counts=Object.fromEntries(fases.map(f=>[f.id,selecionados.filter(t=>t.fase===f.id).length]));
$('#fv-resumo').innerHTML=`<div><strong>${todos.length}</strong><span>Tarefas registradas</span></div><div><strong>${todos.filter(t=>t.status!=='concluido').length}</strong><span>Em aberto</span></div><div><strong>${counts.revisao||0}</strong><span>Para revisar</span></div><div><strong>${counts.aprovado||0}</strong><span>Aprovadas</span></div>`;
const opcoes=[{id:'chefe',nome:e.chefe},...e.agentes];$('#fv-agente').innerHTML='<option value="">Todos</option>'+opcoes.map(a=>`<option value="${esc(a.id)}">${esc(a.nome)}</option>`).join('');$('#fv-agente').value=agente;
$('#fv-mapa').innerHTML=`<div class="fv-chefe"><div class="fv-rosto" aria-hidden="true"><i class="fv-olho"></i><i class="fv-olho"></i><b></b></div><strong>${esc(e.chefe)}</strong><small>Coordena os encaminhamentos</small></div><div class="fv-trilho">${fases.map((f,i)=>`<button class="fv-etapa ${etapa===f.id?'fv-ativa':''}" data-etapa="${f.id}" aria-pressed="${etapa===f.id}"><span class="fv-simbolo">${f.simbolo}</span><strong>${f.nome}</strong><small>${f.sub}</small><em>${counts[f.id]}</em></button>`).join('')}</div>`;
const exibidos=selecionados.filter(t=>etapa==='todas'||t.fase===etapa).sort((a,b)=>String(b.atualizado||b.criado||'').localeCompare(String(a.atualizado||a.criado||'')));
$('#fv-detalhe-titulo').textContent=etapa==='todas'?'Todas as tarefas':fases.find(f=>f.id===etapa)?.nome||'Tarefas';
$('#fv-detalhe-ajuda').textContent=`${exibidos.length} tarefa(s) nesta seleção. Use os filtros para localizar uma entrega.`;
$('#fv-lista').innerHTML=exibidos.map(t=>{const f=fases.find(x=>x.id===t.fase),rev=r[t.id];return `<article class="fv-cartao"><div class="fv-cartao-cab"><span>${esc(f?.nome)}</span><span>${esc(nome(t.agente,e))}</span></div><h4>${esc(t.titulo)}</h4><p>${esc(t.descricao||'Sem orientações adicionais')}</p>${t.resultado?`<blockquote><strong>Resultado manual:</strong> ${esc(t.resultado)}</blockquote>`:''}${rev?`<p class="fv-parecer"><strong>Última revisão:</strong> ${esc(rev.decisao==='aprovado'?'Aprovada':'Devolvida')} — ${esc(rev.nota||'Sem observações')}</p>`:''}<small>Origem: ${esc(t.origem||'registro local')} · ${t.atualizado||t.criado?esc(new Date(t.atualizado||t.criado).toLocaleString('pt-BR')):'Sem data registrada'}</small></article>`}).join('')||'<div class="fv-vazio">Nenhuma tarefa nesta etapa. Crie uma na Sala Flow para começar.</div>';
}
$('#fv-mapa').onclick=ev=>{const b=ev.target.closest('[data-etapa]');if(b){etapa=etapa===b.dataset.etapa?'todas':b.dataset.etapa;render()}};
$('#fv-busca').oninput=ev=>{busca=ev.target.value.toLocaleLowerCase('pt-BR');render()};
$('#fv-agente').onchange=ev=>{agente=ev.target.value;render()};
$('#fv-limpar').onclick=()=>{busca='';agente='';etapa='todas';$('#fv-busca').value='';render()};
$('#fv-abrir').onclick=()=>{$('#fv-fundo').hidden=false;render();$('#fv-fechar').focus()};
$('#fv-fechar').onclick=()=>{$('#fv-fundo').hidden=true;$('#fv-abrir').focus()};
$('#fv-fundo').onclick=ev=>{if(ev.target===$('#fv-fundo'))$('#fv-fechar').click()};
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&!$('#fv-fundo').hidden)$('#fv-fechar').click()});
window.addEventListener('storage',ev=>{if([KD,KE,KR].includes(ev.key)&&!$('#fv-fundo').hidden)render()});
for(const evento of ['ander-flow:radar-atualizado','ander-flow-despachos-alterados'])window.addEventListener(evento,()=>{if(!$('#fv-fundo').hidden)render()});
})();