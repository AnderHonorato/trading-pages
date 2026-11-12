/* Painel Flow: radar operacional local, sem execução automática ou IA externa. */
(()=>{'use strict';
const CHAVES={missoes:'ander-flow-missoes-v1',diario:'ander-flow-diario-v1',planos:'ander-flow-oficina-v1',equipe:'ander-flow-equipe-v1'};
const ler=(ch)=>{try{const v=JSON.parse(localStorage.getItem(ch)||'null');return v}catch{return null}};
const lista=(ch)=>{const v=ler(ch);return Array.isArray(v)?v:[]};
const seguro=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const raiz=document.createElement('section');raiz.id='central-pulso-flow';
raiz.innerHTML=`<button id="cpf-abrir" type="button">◈ Central de Pulso <span id="cpf-alertas"></span></button>
<div id="cpf-cortina" hidden><div id="cpf-painel" role="dialog" aria-modal="true" aria-labelledby="cpf-titulo">
<header><div><small>ANDER FLOW · DADOS DESTE NAVEGADOR</small><h2 id="cpf-titulo">Central de Pulso</h2><p>Um retrato vivo das suas missões, projetos e atividades reais — sem inventar trabalho de agentes.</p></div><button id="cpf-fechar" aria-label="Fechar Central de Pulso">×</button></header>
<div class="cpf-cards" id="cpf-cards" aria-live="polite"></div>
<div class="cpf-cena" aria-label="Cenário de produção 2D com quatro estações de trabalho"><div class="cpf-esteira"></div><div id="cpf-estacoes"></div></div>
<div class="cpf-layout"><section><h3>Fila de atenção</h3><div class="cpf-filtros"><label>Mostrar <select id="cpf-filtro"><option value="todas">Todas</option><option value="bloqueios">Bloqueios</option><option value="andamento">Em andamento</option><option value="sem-responsavel">Sem responsável válido</option></select></label></div><div id="cpf-fila"></div></section>
<section><h3>Atividade recente</h3><div id="cpf-atividade"></div><button id="cpf-exportar">Exportar diagnóstico JSON</button></section></div>
<footer><button id="cpf-atualizar">Atualizar dados</button><span id="cpf-status" role="status">Dados locais, sem sincronização com servidor.</span></footer></div></div>`;
document.body.append(raiz);
const $=s=>raiz.querySelector(s),cortina=$('#cpf-cortina');
const estacoes=[['entrada','Entrada','▣'],['producao','Produção','⚙'],['revisao','Revisão','◇'],['entrega','Entrega','✓']];
let filtro='todas';
function dados(){
const missoes=lista(CHAVES.missoes).filter(m=>m&&typeof m.titulo==='string');
const diario=lista(CHAVES.diario).filter(e=>e&&typeof e.texto==='string');
const planos=lista(CHAVES.planos);
const equipe=ler(CHAVES.equipe)||{},ids=new Set(['chefe',...(Array.isArray(equipe.agentes)?equipe.agentes:[]).map(a=>a.id)]);
const bloqueios=diario.filter(e=>e.tipo==='Bloqueio');
const pendentes=missoes.filter(m=>Number(m.fase)<3);
const semResponsavel=pendentes.filter(m=>m.agente&&!ids.has(m.agente));
return {missoes,diario,planos,bloqueios,pendentes,semResponsavel};
}
function render(){
const d=dados(),cont=[0,1,2,3].map(i=>d.missoes.filter(m=>Number(m.fase)===i).length);
$('#cpf-alertas').textContent=d.bloqueios.length?'· '+d.bloqueios.length+' bloqueios':'';
$('#cpf-cards').innerHTML=[['Missões',d.missoes.length],['Em andamento',cont[1]+cont[2]],['Entregues',cont[3]],['Bloqueios registrados',d.bloqueios.length],['Projetos na oficina',d.planos.length]].map(([k,v])=>`<article><strong>${v}</strong><span>${k}</span></article>`).join('');
$('#cpf-estacoes').innerHTML=estacoes.map(([id,nome,icone],i)=>`<article class="cpf-estacao cpf-${id}"><div class="cpf-personagem" aria-hidden="true"><div class="cpf-chapeu">${icone}</div><div class="cpf-olhos"><i></i><i></i></div><div class="cpf-boca"></div></div><strong>${nome}</strong><span>${cont[i]} missões</span><div class="cpf-barra"><span style="width:${d.missoes.length?Math.round(cont[i]/d.missoes.length*100):0}%"></span></div></article>`).join('');
const itens=[...d.pendentes.map(m=>({tipo:'missao',id:m.id,texto:m.titulo,fase:Number(m.fase),invalido:!!m.agente&&!new Set(['chefe',...(ler(CHAVES.equipe)?.agentes||[]).map(a=>a.id)]).has(m.agente)})),...d.bloqueios.slice(-15).map(e=>({tipo:'bloqueio',id:e.id,texto:e.texto}))];
const exibidos=itens.filter(x=>filtro==='todas'||(filtro==='bloqueios'&&x.tipo==='bloqueio')||(filtro==='andamento'&&x.tipo==='missao'&&x.fase>0)||(filtro==='sem-responsavel'&&x.invalido));
$('#cpf-fila').innerHTML=exibidos.slice(0,35).map(x=>`<article class="cpf-item"><span class="cpf-marcador ${x.tipo==='bloqueio'?'cpf-erro':''}"></span><div><strong>${seguro(x.texto)}</strong><small>${x.tipo==='bloqueio'?'Bloqueio registrado':x.invalido?'Responsável excluído · reatribuir na Central de Missões':estacoes[x.fase]?.[1]||'Missão'}</small></div></article>`).join('')||'<p class="cpf-vazio">Nada nesta fila. Crie uma missão ou registre atividades para começar.</p>';
$('#cpf-atividade').innerHTML=d.diario.slice(-8).reverse().map(e=>`<article class="cpf-evento"><strong>${seguro(e.tipo||'Atividade')}</strong><p>${seguro(e.texto)}</p><small>${seguro(e.quando?new Date(e.quando).toLocaleString('pt-BR'):'Data não informada')}</small></article>`).join('')||'<p class="cpf-vazio">O Diário de Trabalho ainda não possui registros.</p>';
$('#cpf-status').textContent='Atualizado às '+new Date().toLocaleTimeString('pt-BR')+' · armazenamento local';
}
function fechar(){cortina.hidden=true;$('#cpf-abrir').focus()}
$('#cpf-abrir').onclick=()=>{render();cortina.hidden=false;$('#cpf-fechar').focus()};
$('#cpf-fechar').onclick=fechar;cortina.onclick=e=>{if(e.target===cortina)fechar()};
$('#cpf-filtro').onchange=e=>{filtro=e.target.value;render()};
$('#cpf-atualizar').onclick=render;
$('#cpf-exportar').onclick=()=>{const blob=new Blob([JSON.stringify({origem:'navegador-local',geradoEm:new Date().toISOString(),...dados()},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='central-pulso-flow.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!cortina.hidden)fechar()});
window.addEventListener('storage',e=>{if(Object.values(CHAVES).includes(e.key)&&!cortina.hidden)render()});
})();
