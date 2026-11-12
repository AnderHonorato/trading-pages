/* Estudio de foco manual para missoes — Ander Flow. Sem execucao automatica de IA. */
(()=>{'use strict';
const CHAVE='ander-flow-foco-v1',MISSOES='ander-flow-missoes-v1',AGENDA='ander-flow-agenda-v1',DIARIO='ander-flow-diario-v1';
const ler=(k,p)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??p}catch{return p}};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;':'&quot;',"'":'&#39;'}[c]));
const raiz=document.createElement('section');raiz.id='flow-foco';
raiz.innerHTML=`<button id="ff-abrir" aria-haspopup="dialog">Estúdio de foco</button><div id="ff-fundo" hidden><div id="ff-painel" role="dialog" aria-modal="true" aria-labelledby="ff-titulo"><header><div><small>ANDER FLOW · CONCENTRAÇÃO MANUAL</small><h2 id="ff-titulo">Estúdio de foco</h2><p>Concentre-se em uma missão real. O Chefinho não executa tarefas neste modo.</p></div><button id="ff-fechar" aria-label="Fechar estúdio">×</button></header><div class="ff-grade"><div class="ff-relogio"><div class="ff-anel" id="ff-anel"><span id="ff-tempo" role="timer">25:00</span><small id="ff-estado" role="status">Pronto para começar</small></div><div class="ff-controles"><button id="ff-iniciar">Iniciar</button><button id="ff-pausar" disabled>Pausar</button><button id="ff-finalizar" disabled>Finalizar sessão</button></div></div><div class="ff-lateral"><label>Missão<select id="ff-missao"></select></label><label>Duração<select id="ff-duracao"><option value="15">15 minutos</option><option value="25" selected>25 minutos</option><option value="45">45 minutos</option><option value="60">60 minutos</option></select></label><label>Objetivo da sessão<input id="ff-objetivo" maxlength="120" placeholder="O que você vai concluir?"></label><div class="ff-resumo"><strong id="ff-total">0 min</strong><span>de foco concluído hoje</span></div><p>O relógio usa o horário real: continua correto ao trocar de aba ou recarregar.</p></div></div><div class="ff-historico"><h3>Últimas sessões</h3><ol id="ff-lista"></ol><button id="ff-exportar">Exportar histórico JSON</button><div class="ff-integracao"><h3>Resultado da sessão</h3><p>Ao finalizar, registre no Diário de Trabalho o tempo e o resultado real, sem atribuir trabalho à IA.</p><label>Resultado obtido<textarea id="ff-resultado" maxlength="600" rows="3" placeholder="Ex.: revisei a tela inicial e corrigi o menu"></textarea></label><button id="ff-registrar" disabled>Registrar última sessão no Diário</button></div></div><p id="ff-aviso" role="status" aria-live="polite"></p></div></div>`;
document.body.append(raiz);
const $=s=>raiz.querySelector(s),fundo=$('#ff-fundo');
let dados=ler(CHAVE,{atual:null,historico:[]});if(!dados||typeof dados!=='object'||!Array.isArray(dados.historico))dados={atual:null,historico:[]};
const missoes=()=>{const x=ler(MISSOES,[]);return Array.isArray(x)?x:[]};
const agenda=()=>{const x=ler(AGENDA,[]);return Array.isArray(x)?x:[]};
const salvar=()=>{try{localStorage.setItem(CHAVE,JSON.stringify(dados));return true}catch{$('#ff-aviso').textContent='Falha ao salvar. Libere espaço no navegador.';return false}};
const formatar=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
function restante(){const a=dados.atual;if(!a)return Number($('#ff-duracao').value)*60;return Math.max(0,Math.ceil((a.restanteMs-(a.inicio?Date.now()-a.inicio:0))/1000))}
function concluir(){const a=dados.atual;if(!a)return;const feito=Math.max(0,a.duracao*60-restante());if(feito>=60){dados.historico.unshift({id:crypto.randomUUID?.()||String(Date.now()),missao:a.missao,objetivo:a.objetivo,minutos:Math.floor(feito/60),data:new Date().toISOString(),concluida:feito>=a.duracao*60,origem:'manual',diarioId:null});dados.historico=dados.historico.slice(0,200)}dados.atual=null;salvar();$('#ff-aviso').textContent=feito>=60?'Sessão registrada. Descreva seu resultado para enviar ao Diário.':'Sessão curta descartada.';atualizar()}
function atualizar(){
if(dados.atual?.inicio&&restante()===0){concluir();return}
const a=dados.atual,seg=restante(),dur=a?.duracao||Number($('#ff-duracao').value);
$('#ff-tempo').textContent=formatar(seg);$('#ff-anel').style.setProperty('--ff-progresso',`${100*(1-seg/(dur*60))}%`);
$('#ff-estado').textContent=!a?'Pronto para começar':a.inicio?'Foco em andamento':'Pausado';
$('#ff-iniciar').textContent=a?'Retomar':'Iniciar';$('#ff-iniciar').disabled=!!a?.inicio;
$('#ff-pausar').disabled=!a?.inicio;$('#ff-finalizar').disabled=!a;
$('#ff-missao').disabled=!!a;$('#ff-duracao').disabled=!!a;$('#ff-objetivo').disabled=!!a;
const hoje=new Date().toDateString(),ms=missoes();
$('#ff-total').textContent=dados.historico.filter(h=>new Date(h.data).toDateString()===hoje).reduce((s,h)=>s+h.minutos,0)+' min';
$('#ff-registrar').disabled=!dados.historico.some(h=>!h.diarioId);$('#ff-lista').innerHTML=dados.historico.slice(0,12).map(h=>`<li><strong>${esc(ms.find(m=>m.id===h.missao)?.titulo||'Missão removida')}</strong><span>${h.minutos} min · ${new Date(h.data).toLocaleString('pt-BR')} · ${h.concluida?'Concluída':'Interrompida'}</span><small>${esc(h.objetivo||'Sessão de foco manual')}</small></li>`).join('')||'<li>Nenhuma sessão registrada ainda.</li>';
}
function opcoes(){const ms=missoes(),prev=$('#ff-missao').value;$('#ff-missao').innerHTML='<option value="">Foco livre</option>'+ms.map(m=>`<option value="${esc(m.id)}">${esc(m.titulo)}</option>`).join('');if(ms.some(m=>m.id===prev))$('#ff-missao').value=prev;else{const hoje=new Date().toISOString().slice(0,10),proxima=agenda().find(a=>a.data===hoje&&!a.feito&&ms.some(m=>m.id===a.missao));if(proxima)$('#ff-missao').value=proxima.missao}}
$('#ff-abrir').onclick=()=>{opcoes();fundo.hidden=false;atualizar();$('#ff-fechar').focus()};
const fechar=()=>{fundo.hidden=true;$('#ff-abrir').focus()};$('#ff-fechar').onclick=fechar;
fundo.addEventListener('click',e=>{if(e.target===fundo)fechar()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!fundo.hidden)fechar()});
$('#ff-iniciar').onclick=()=>{if(!dados.atual){const dur=Number($('#ff-duracao').value);dados.atual={duracao:dur,restanteMs:dur*60000,inicio:Date.now(),missao:$('#ff-missao').value,objetivo:$('#ff-objetivo').value.trim().slice(0,120)}}else dados.atual.inicio=Date.now();if(salvar())atualizar()};
$('#ff-pausar').onclick=()=>{const a=dados.atual;if(!a?.inicio)return;a.restanteMs=Math.max(0,a.restanteMs-(Date.now()-a.inicio));a.inicio=null;salvar();atualizar()};
$('#ff-finalizar').onclick=()=>{if(confirm('Finalizar a sessão e registrar o tempo realizado?'))concluir()};
$('#ff-duracao').onchange=atualizar;
$('#ff-registrar').onclick=()=>{
 const sessao=dados.historico.find(h=>!h.diarioId),resultado=$('#ff-resultado').value.trim();
 if(!sessao){$('#ff-aviso').textContent='Não há sessões pendentes de registro.';return}
 if(!resultado){$('#ff-aviso').textContent='Descreva o resultado real antes de registrar.';$('#ff-resultado').focus();return}
 const eventos=ler(DIARIO,[]);if(!Array.isArray(eventos)){ $('#ff-aviso').textContent='Histórico do Diário inválido. Nenhum dado foi alterado.';return}
 const id=crypto.randomUUID?.()||String(Date.now()),novo={id,missao:sessao.missao,tipo:'Progresso',texto:'Sessão de foco manual ('+sessao.minutos+' min). Objetivo: '+(sessao.objetivo||'não informado')+'. Resultado: '+resultado,quando:new Date().toISOString(),origem:'foco-manual',sessaoId:sessao.id};
 const proximos=[...eventos,novo].slice(-500);
 try{localStorage.setItem(DIARIO,JSON.stringify(proximos))}catch{$('#ff-aviso').textContent='Não foi possível gravar no Diário.';return}
 sessao.diarioId=id;salvar();$('#ff-resultado').value='';$('#ff-aviso').textContent='Resultado registrado no Diário de Trabalho.';window.dispatchEvent(new CustomEvent('ander-flow:diario-atualizado'));atualizar();
};
$('#ff-exportar').onclick=()=>{const blob=new Blob([JSON.stringify({tipo:'historico-foco-manual',sessoes:dados.historico},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='ander-flow-historico-foco.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
document.addEventListener('visibilitychange',()=>{if(!document.hidden)atualizar()});
window.addEventListener('storage',e=>{if(e.key===CHAVE){const x=ler(CHAVE,null);if(x&&Array.isArray(x.historico))dados=x;atualizar()}});
setInterval(()=>{if(!document.hidden&&dados.atual?.inicio)atualizar()},1000);
atualizar();
})();