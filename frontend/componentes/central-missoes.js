/* Central de missoes interativa. Ander Flow - apenas simulacao. */
(()=>{
'use strict';
const api=window.AgentesOrbitais,root=document.getElementById('ao-root');
if(!api||!root)return;
const painel=document.createElement('aside');painel.id='flow-missoes';
painel.innerHTML=`<button id="flow-abrir" type="button" aria-expanded="false" aria-controls="flow-corpo">✦ MISSÕES <span id="flow-total">0</span></button><section id="flow-corpo" hidden><header><div><small>ANDER FLOW · SIMULAÇÃO</small><h2>Central de missões</h2><p>Comande seus agentes em tempo real.</p></div><button id="flow-fechar" type="button" aria-label="Fechar">×</button></header><div class="flow-indices"><div><strong id="flow-ativos">0</strong><small>Ativos</small></div><div><strong id="flow-eventos">0</strong><small>Comandos</small></div><div><strong id="flow-nivel">1</strong><small>Nível</small></div></div><label for="flow-agente">Agente selecionado</label><select id="flow-agente"></select><div class="flow-ficha"><span id="flow-ponto"></span><div><strong id="flow-nome"></strong><small id="flow-papel"></small></div><b id="flow-situacao"></b></div><div class="flow-comandos"><button data-acao="pulso">✦ Emitir pulso</button><button data-acao="ordem">◎ Convocar núcleo</button><button data-acao="passe">⇢ Transferir sinal</button><button data-acao="ataque">⚡ Desafio</button><button data-acao="alternar" class="flow-alternar">Alternar agente</button></div><div class="flow-historico-titulo"><strong>Atividade recente</strong><button id="flow-limpar">Limpar</button></div><ol id="flow-historico" aria-live="polite"><li>Selecione um agente para começar.</li></ol><small class="flow-aviso">Ações demonstrativas: nenhuma ordem financeira real.</small></section>`;
root.append(painel);const $=s=>painel.querySelector(s),select=$('#flow-agente'),lista=$('#flow-historico');
let aberto=false,comandos=0;
const agentes=()=>api.agentes(),escolhido=()=>agentes().find(a=>a.nome===select.value);
function atualizar(){
 const todos=agentes(),atual=select.value,chave=todos.map(a=>a.nome+':'+a.ativo).join('|');
 if(select.dataset.chave!==chave){
  select.replaceChildren();todos.forEach(a=>{const o=document.createElement('option');o.value=a.nome;o.textContent=(a.ativo?'● ':'○ ')+a.nome+' · '+a.papel;select.append(o);});
  select.value=todos.some(a=>a.nome===atual)?atual:(todos.find(a=>a.ativo)||todos[0]||{}).nome||'';select.dataset.chave=chave;
 }
 const a=escolhido();$('#flow-ativos').textContent=todos.filter(x=>x.ativo).length;$('#flow-total').textContent=todos.filter(x=>x.ativo).length;$('#flow-eventos').textContent=comandos;$('#flow-nivel').textContent=api.estado().nivel;
 if(!a)return;
 $('#flow-nome').textContent=a.nome;$('#flow-papel').textContent=a.papel+' · '+(a.status||'Aguardando');$('#flow-situacao').textContent=a.ativo?'ATIVO':'RESERVA';$('#flow-ponto').style.background=a.cor||'#82d8c6';$('.flow-alternar').textContent=a.ativo?'Colocar em reserva':'Ativar agente';
}
function registrar(msg){
 comandos++;if(comandos===1)lista.replaceChildren();
 const li=document.createElement('li'),time=document.createElement('time');time.textContent=new Date().toLocaleTimeString('pt-BR');li.textContent=msg+' ';li.append(time);lista.prepend(li);while(lista.children.length>10)lista.lastElementChild.remove();atualizar();
}
function comando(tipo){
 const a=escolhido();if(!a)return;
 if(tipo==='alternar'){a.ativo?api.desativar(a.nome):api.ativar(a.nome);registrar(a.nome+(a.ativo?' enviado à reserva.':' ativado.'));return;}
 if(!a.ativo){registrar('Ative '+a.nome+' antes de comandar.');return;}
 if(tipo==='pulso'){api.pulso(a.nome);registrar(a.nome+' emitiu pulso ao núcleo.');}
 if(tipo==='ordem'){api.ordem(a.nome);registrar(a.nome+' convocou o núcleo.');}
 if(tipo==='ataque'){api.ataque(a.nome);registrar(a.nome+' iniciou desafio.');}
 if(tipo==='passe'){const outros=agentes().filter(x=>x.ativo&&x.nome!==a.nome);if(!outros.length){registrar('Ative outro agente para transferir.');return;}const destino=outros[comandos%outros.length];api.passe(a.nome,destino.nome);registrar(a.nome+' transferiu sinal para '+destino.nome+'.');}
}
function abrir(valor){aberto=valor;$('#flow-corpo').hidden=!valor;$('#flow-abrir').setAttribute('aria-expanded',String(valor));painel.classList.toggle('flow-aberto',valor);if(valor)atualizar();}
$('#flow-abrir').addEventListener('click',()=>abrir(!aberto));$('#flow-fechar').addEventListener('click',()=>abrir(false));select.addEventListener('change',atualizar);
$('#flow-limpar').addEventListener('click',()=>{comandos=0;lista.innerHTML='<li>Histórico limpo.</li>';atualizar();});
painel.querySelectorAll('[data-acao]').forEach(b=>b.addEventListener('click',()=>comando(b.dataset.acao)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&aberto)abrir(false);});
atualizar();setInterval(()=>{if(aberto)atualizar();},2000);
window.FlowMissoes={abrir,atualizar,comando,estado:()=>({aberto,comandos,agente:select.value})};
})();
