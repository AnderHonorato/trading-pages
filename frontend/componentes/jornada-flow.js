/* Painel de jornada semanal — Ander Flow. Dados locais, sem IA externa. */
(()=>{'use strict';
const CH={m:'ander-flow-missoes-v1',a:'ander-flow-agenda-v1',f:'ander-flow-foco-v1',d:'ander-flow-diario-v1'};
const ler=(k,def)=>{try{return JSON.parse(localStorage.getItem(k))??def}catch{return def}};
const lista=k=>{const x=ler(k,[]);return Array.isArray(x)?x:[]};
const escapar=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const data=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
const diaIso=s=>{const d=new Date(s);return Number.isFinite(d.getTime())?data(d):''};
const deslocar=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const nome=(id,ms)=>ms.find(m=>m.id===id)?.titulo||'Atividade geral';
const raiz=document.createElement('section');raiz.id='flow-jornada';
raiz.innerHTML=`<button id="fj-abrir" aria-haspopup="dialog">Minha jornada</button><div id="fj-sombra" hidden><div id="fj-painel" role="dialog" aria-modal="true" aria-labelledby="fj-titulo"><header><div><small>ANDER FLOW · PROGRESSO REAL</small><h2 id="fj-titulo">Minha jornada</h2><p>Um mapa visual das missões, agenda e tempo de foco registrados neste navegador.</p></div><button id="fj-fechar" aria-label="Fechar jornada">×</button></header><div class="fj-indicadores" id="fj-indicadores"></div><div class="fj-conteudo"><section><div class="fj-topo"><h3>Atividade nos últimos 7 dias</h3><span id="fj-legenda">Minutos de foco</span></div><div id="fj-dias" class="fj-dias" role="group" aria-label="Selecionar dia"></div><div id="fj-detalhe" aria-live="polite"></div></section><section class="fj-missoes"><h3>Progresso das missões</h3><div id="fj-etapas"></div><h3>Próximas atividades</h3><ol id="fj-proximas"></ol></section></div><div class="fj-acoes"><button id="fj-atualizar">Atualizar dados</button><button id="fj-exportar">Exportar resumo JSON</button></div><p id="fj-aviso" role="status">Dados locais e manuais. Nenhum agente ou corretora é acionado.</p></div></div>`;
document.body.append(raiz);const $=s=>raiz.querySelector(s);let selecionado=data(new Date());
const sombra=$('#fj-sombra');
function coletar(){const missoes=lista(CH.m),agenda=lista(CH.a),diario=lista(CH.d),foco=ler(CH.f,{});return {missoes,agenda,diario,foco:Array.isArray(foco?.historico)?foco.historico:[]}}
function desenhar(){
const x=coletar(),hoje=data(new Date()),total=x.missoes.length,concluidas=x.missoes.filter(m=>Number(m.fase)===3).length;
const minutos=x.foco.reduce((s,f)=>s+(Number(f.minutos)||0),0);
const pendentes=x.agenda.filter(a=>!a.feito&&a.data>=hoje).length;
$('#fj-indicadores').innerHTML=[['Missões',total],['Concluídas',concluidas],['Foco acumulado',minutos+' min'],['Agendadas',pendentes]].map(([t,n])=>`<div class="fj-indicador"><strong>${escapar(n)}</strong><span>${t}</span></div>`).join('');
const dias=Array.from({length:7},(_,i)=>deslocar(new Date(),i-6));
const max=Math.max(1,...dias.map(d=>x.foco.filter(f=>diaIso(f.data)===data(d)).reduce((s,f)=>s+(Number(f.minutos)||0),0)));
$('#fj-dias').innerHTML=dias.map(d=>{const chave=data(d),mins=x.foco.filter(f=>diaIso(f.data)===chave).reduce((s,f)=>s+(Number(f.minutos)||0),0),pct=Math.max(6,Math.round(mins/max*100));return `<button type="button" class="fj-dia ${selecionado===chave?'fj-ativo':''}" data-dia="${chave}" aria-pressed="${selecionado===chave}" aria-label="${escapar(d.toLocaleDateString('pt-BR'))}: ${mins} minutos"><span class="fj-coluna"><i style="height:${pct}%"></i></span><strong>${d.toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','')}</strong><small>${mins} min</small></button>`}).join('');
const fDia=x.foco.filter(f=>diaIso(f.data)===selecionado),aDia=x.agenda.filter(a=>a.data===selecionado),dDia=x.diario.filter(d=>diaIso(d.quando)===selecionado);
$('#fj-detalhe').innerHTML=`<h4>${escapar(new Date(selecionado+'T12:00:00').toLocaleDateString('pt-BR',{dateStyle:'full'}))}</h4><p>${fDia.length} sessões de foco · ${aDia.length} atividades agendadas · ${dDia.length} registros no diário</p><ul>${[...aDia.map(a=>({t:(a.feito?'Concluída':'Planejada')+' · '+nome(a.missao,x.missoes),s:a.hora||''})),...dDia.map(d=>({t:d.tipo+' · '+d.texto,s:'Diário manual'})),...fDia.map(f=>({t:(f.minutos||0)+' min · '+nome(f.missao,x.missoes),s:'Foco manual'}))].slice(0,12).map(i=>`<li><strong>${escapar(i.t)}</strong><small>${escapar(i.s)}</small></li>`).join('')||'<li>Nenhuma atividade registrada neste dia.</li>'}</ul>`;
const fases=['A fazer','Em andamento','Revisão','Concluída'];$('#fj-etapas').innerHTML=fases.map((fase,i)=>{const n=x.missoes.filter(m=>Number(m.fase)===i).length;return `<div class="fj-etapa"><span>${fase} <strong>${n}</strong></span><div class="fj-trilha"><i style="width:${total?Math.round(n/total*100):0}%"></i></div></div>`}).join('');
$('#fj-proximas').innerHTML=x.agenda.filter(a=>!a.feito&&a.data>=hoje).sort((a,b)=>(a.data+' '+a.hora).localeCompare(b.data+' '+b.hora)).slice(0,5).map(a=>`<li><time>${escapar(a.data)} · ${escapar(a.hora)}</time><strong>${escapar(nome(a.missao,x.missoes))}</strong></li>`).join('')||'<li>Nenhuma atividade futura. Use a Agenda Semanal para planejar.</li>';
}
$('#fj-abrir').onclick=()=>{desenhar();sombra.hidden=false;$('#fj-fechar').focus()};
const fechar=()=>{sombra.hidden=true;$('#fj-abrir').focus()};$('#fj-fechar').onclick=fechar;
sombra.addEventListener('click',e=>{if(e.target===sombra)fechar()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!sombra.hidden)fechar()});
$('#fj-dias').onclick=e=>{const b=e.target.closest('button[data-dia]');if(b){selecionado=b.dataset.dia;desenhar()}};
$('#fj-atualizar').onclick=desenhar;
$('#fj-exportar').onclick=()=>{const dados={exportadoEm:new Date().toISOString(),origem:'registros locais manuais',...coletar()},blob=new Blob([JSON.stringify(dados,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='ander-flow-jornada.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
window.addEventListener('storage',e=>{if(Object.values(CH).includes(e.key)&&!sombra.hidden)desenhar()});
window.addEventListener('ander-flow:diario-atualizado',()=>{if(!sombra.hidden)desenhar()});
})();