/* Diário de trabalho local e verificável — Ander Flow. */
(()=>{'use strict';
const chave='ander-flow-diario-v1',missoesChave='ander-flow-missoes-v1';
const ler=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return []}};
const salvar=v=>{try{localStorage.setItem(chave,JSON.stringify(v));return true}catch{return false}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let eventos=ler(chave);if(!Array.isArray(eventos))eventos=[];
const raiz=document.createElement('section');raiz.id='flow-diario';
raiz.innerHTML='<button id="fd-abrir" aria-haspopup="dialog">Diário de trabalho</button><div id="fd-sombra" hidden><div id="fd-painel" role="dialog" aria-modal="true" aria-label="Diário de trabalho"><header><div><small>ANDER FLOW · REGISTROS LOCAIS</small><h2>Diário de trabalho</h2><p>Registre resultados reais manualmente; nenhuma IA é executada aqui.</p></div><button id="fd-fechar" aria-label="Fechar diário">×</button></header><div id="fd-resumo"></div><form id="fd-form"><label>Missão<select name="missao" id="fd-missao"></select></label><label>Tipo<select name="tipo"><option>Progresso</option><option>Resultado</option><option>Bloqueio</option><option>Revisão</option></select></label><label>O que aconteceu?<textarea name="texto" maxlength="1200" rows="3" required placeholder="Descreva a atividade ou resultado verificável"></textarea></label><button>Registrar atividade</button></form><label>Filtrar histórico<select id="fd-filtro"><option value="">Todas as missões</option></select></label><ol id="fd-lista"></ol><button id="fd-exportar">Exportar histórico JSON</button><p id="fd-aviso" role="status"></p></div></div>';
document.body.append(raiz);
const $=s=>raiz.querySelector(s),sombra=$('#fd-sombra');
let filtro='';
const missoes=()=>{const a=ler(missoesChave);return Array.isArray(a)?a:[]};
function atualizar(){
 const ms=missoes(),opcoes='<option value="">Atividade geral</option>'+ms.map(m=>'<option value="'+esc(m.id)+'">'+esc(m.titulo)+'</option>').join('');
 const seletor=$('#fd-missao'),anterior=seletor.value;seletor.innerHTML=opcoes;seletor.value=ms.some(m=>m.id===anterior)?anterior:'';
 $('#fd-filtro').innerHTML='<option value="">Todas as missões</option>'+ms.map(m=>'<option value="'+esc(m.id)+'">'+esc(m.titulo)+'</option>').join('');$('#fd-filtro').value=filtro;
 const visiveis=eventos.filter(e=>!filtro||e.missao===filtro);
 $('#fd-resumo').textContent=eventos.length+' atividades registradas · '+eventos.filter(e=>e.tipo==='Resultado').length+' resultados · '+eventos.filter(e=>e.tipo==='Bloqueio').length+' bloqueios';
 $('#fd-lista').innerHTML=visiveis.slice().reverse().map(e=>'<li><strong>'+esc(e.tipo)+'</strong><time>'+esc(new Date(e.quando).toLocaleString('pt-BR'))+'</time><p>'+esc(e.texto)+'</p><small>'+esc(ms.find(m=>m.id===e.missao)?.titulo||'Atividade geral')+' · '+(e.origem==='foco-manual'?'foco manual ('+esc(e.sessaoId||'')+')':'registro manual')+'</small></li>').join('')||'<li class="fd-vazio">Nenhuma atividade ainda. Registre o primeiro resultado para acompanhar sua evolução.</li>';
}
function fechar(){sombra.hidden=true;$('#fd-abrir').focus()}
$('#fd-abrir').onclick=()=>{atualizar();sombra.hidden=false;$('#fd-fechar').focus()};
$('#fd-fechar').onclick=fechar;sombra.onclick=e=>{if(e.target===sombra)fechar()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!sombra.hidden)fechar()});
$('#fd-form').onsubmit=e=>{e.preventDefault();const d=new FormData(e.currentTarget),texto=String(d.get('texto')||'').trim();if(!texto)return;const novo={id:crypto.randomUUID?.()||String(Date.now()),missao:String(d.get('missao')||''),tipo:String(d.get('tipo')||'Progresso'),texto,quando:new Date().toISOString(),origem:'manual'};const proximos=[...eventos,novo].slice(-500);if(!salvar(proximos)){$('#fd-aviso').textContent='Não foi possível salvar no navegador.';return}eventos=proximos;e.currentTarget.querySelector('textarea').value='';$('#fd-aviso').textContent='Atividade registrada neste navegador.';atualizar()};
$('#fd-filtro').onchange=e=>{filtro=e.target.value;atualizar()};
window.addEventListener('ander-flow:diario-atualizado',()=>{const novo=ler(chave);if(Array.isArray(novo))eventos=novo;atualizar()});
window.addEventListener('storage',e=>{if(e.key===chave){const novo=ler(chave);if(Array.isArray(novo))eventos=novo;atualizar()}});
$('#fd-exportar').onclick=()=>{const blob=new Blob([JSON.stringify({modo:'demonstracao',eventos},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='flow-diario.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
})();