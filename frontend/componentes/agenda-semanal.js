/* Agenda semanal de missões, local e demonstrativa — Ander Flow. */
(()=>{'use strict';
const CHAVE='ander-flow-agenda-v1',MISSOES='ander-flow-missoes-v1';
const dias=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const ler=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return []}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dataLocal=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
const inicio=d=>{const a=new Date(d);a.setHours(12,0,0,0);a.setDate(a.getDate()-(a.getDay()+6)%7);return a};
const somar=(d,n)=>{const a=new Date(d);a.setDate(a.getDate()+n);return a};
let agenda=ler(CHAVE);if(!Array.isArray(agenda))agenda=[];
let semana=inicio(new Date()),selecionado=dataLocal(new Date()),filtro='todos';
const raiz=document.createElement('section');raiz.id='flow-agenda';
raiz.innerHTML=`<button id="fa-abrir" aria-haspopup="dialog">Agenda semanal</button><div id="fa-fundo" hidden><div id="fa-painel" role="dialog" aria-modal="true" aria-label="Agenda semanal"><header><div><small>ANDER FLOW · PLANEJAMENTO LOCAL</small><h2>Agenda de missões</h2><p>Planeje a semana. Nenhum agente executa atividades automaticamente.</p></div><button id="fa-fechar" aria-label="Fechar agenda">×</button></header><nav class="fa-navegar"><button id="fa-anterior" aria-label="Semana anterior">←</button><strong id="fa-periodo"></strong><button id="fa-proxima" aria-label="Próxima semana">→</button><button id="fa-hoje">Hoje</button></nav><div id="fa-dias" role="group" aria-label="Dias da semana"></div><div id="fa-resumo" role="status" aria-live="polite"></div><form id="fa-form"><h3>Agendar atividade</h3><label>Missão<select name="missao" id="fa-missao" required></select></label><label>Data<input name="data" id="fa-data" type="date" required></label><label>Horário<input name="hora" type="time" value="09:00" required></label><label>Observação<input name="nota" maxlength="160" placeholder="Ex.: revisar protótipo"></label><button type="submit">Adicionar à agenda</button></form><div class="fa-filtros"><h3>Atividades do dia</h3><select id="fa-filtro" aria-label="Filtrar atividades"><option value="todos">Todas</option><option value="pendente">Pendentes</option><option value="feito">Concluídas</option></select></div><ol id="fa-lista"></ol><p id="fa-aviso" role="status"></p></div></div>`;
document.body.append(raiz);
const $=s=>raiz.querySelector(s),fundo=$('#fa-fundo');
const missoes=()=>{const m=ler(MISSOES);return Array.isArray(m)?m:[]};
function salvar(){try{localStorage.setItem(CHAVE,JSON.stringify(agenda));return true}catch{$('#fa-aviso').textContent='Não foi possível salvar a agenda.';return false}}
function atualizar(){
const ms=missoes(),op=$('#fa-missao'),ant=op.value;
op.innerHTML=ms.length?ms.map(m=>`<option value="${esc(m.id)}">${esc(m.titulo)}</option>`).join(''):'<option value="">Crie uma missão no Mural primeiro</option>';
if(ms.some(m=>m.id===ant))op.value=ant;
$('#fa-form button[type=submit]').disabled=!ms.length;
$('#fa-periodo').textContent=`${somar(semana,0).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})} — ${somar(semana,6).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'})}`;
$('#fa-dias').innerHTML=Array.from({length:7},(_,i)=>{const d=somar(semana,i),ch=dataLocal(d),total=agenda.filter(a=>a.data===ch).length;return `<button data-dia="${ch}" class="${ch===selecionado?'fa-selecionado':''}" aria-pressed="${ch===selecionado}"><small>${dias[d.getDay()]}</small><strong>${d.getDate()}</strong><span>${total?total+' tarefa'+(total>1?'s':''):'Livre'}</span></button>`}).join('');
$('#fa-data').value=selecionado;
const todas=agenda.filter(a=>a.data===selecionado),vis=todas.filter(a=>filtro==='todos'||(filtro==='feito')===!!a.feito).sort((a,b)=>a.hora.localeCompare(b.hora));
$('#fa-resumo').textContent=`${agenda.filter(a=>a.data>=dataLocal(semana)&&a.data<=dataLocal(somar(semana,6))).length} atividades na semana · ${todas.filter(a=>a.feito).length}/${todas.length} concluídas no dia`;
$('#fa-lista').innerHTML=vis.map(a=>`<li class="${a.feito?'fa-feito':''}"><div><time>${esc(a.hora)}</time><strong>${esc(ms.find(m=>m.id===a.missao)?.titulo||'Missão removida')}</strong><p>${esc(a.nota||'Atividade planejada')}</p><small>Planejamento manual · ${a.feito?'concluída manualmente':'pendente'}</small></div><div class="fa-acoes"><button data-alternar="${esc(a.id)}">${a.feito?'Reabrir':'Concluir'}</button><button data-excluir="${esc(a.id)}" aria-label="Excluir atividade">Excluir</button></div></li>`).join('')||'<li class="fa-vazio">Dia livre! Escolha uma missão e programe sua próxima atividade.</li>';
}
$('#fa-abrir').onclick=()=>{fundo.hidden=false;atualizar();$('#fa-fechar').focus()};
const fechar=()=>{fundo.hidden=true;$('#fa-abrir').focus()};
$('#fa-fechar').onclick=fechar;fundo.onclick=e=>{if(e.target===fundo)fechar()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!fundo.hidden)fechar()});
$('#fa-anterior').onclick=()=>{semana=somar(semana,-7);selecionado=dataLocal(semana);atualizar()};
$('#fa-proxima').onclick=()=>{semana=somar(semana,7);selecionado=dataLocal(semana);atualizar()};
$('#fa-hoje').onclick=()=>{semana=inicio(new Date());selecionado=dataLocal(new Date());atualizar()};
$('#fa-dias').onclick=e=>{const b=e.target.closest('[data-dia]');if(b){selecionado=b.dataset.dia;atualizar()}};
$('#fa-filtro').onchange=e=>{filtro=e.target.value;atualizar()};
$('#fa-form').onsubmit=e=>{e.preventDefault();const d=new FormData(e.currentTarget),missao=String(d.get('missao')||''),data=String(d.get('data')||''),hora=String(d.get('hora')||'');if(!missoes().some(m=>m.id===missao)||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(data)||!/^[0-9]{2}:[0-9]{2}$/.test(hora))return;const nova={id:crypto.randomUUID?.()||String(Date.now()),missao,data,hora,nota:String(d.get('nota')||'').trim().slice(0,160),feito:false,origem:'manual'};agenda=[...agenda,nova].slice(-1000);if(!salvar())return;selecionado=data;semana=inicio(new Date(data+'T12:00:00'));e.currentTarget.querySelector('[name=nota]').value='';$('#fa-aviso').textContent='Atividade salva neste navegador.';atualizar()};
$('#fa-lista').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.alternar){const a=agenda.find(x=>x.id===b.dataset.alternar);if(a){a.feito=!a.feito;if(salvar())atualizar()}}if(b.dataset.excluir){if(confirm('Excluir esta atividade da agenda?')){agenda=agenda.filter(x=>x.id!==b.dataset.excluir);if(salvar())atualizar()}}};
window.addEventListener('storage',e=>{if(e.key===CHAVE){const novo=ler(CHAVE);if(Array.isArray(novo))agenda=novo;if(!fundo.hidden)atualizar()}});
atualizar();
})();