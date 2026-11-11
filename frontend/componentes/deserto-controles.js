/* Comandos acessiveis da caravana. */
(function(){
'use strict';
const painel=document.createElement('section');painel.id='flow-deserto-controles';painel.hidden=true;painel.setAttribute('aria-label','Exploracao do deserto');
painel.innerHTML='<strong>Caravana do deserto</strong><span id="flow-deserto-info" aria-live="polite">Explore a areia</span><button type="button" id="flow-deserto-vento">Ativar tempestade</button><button type="button" id="flow-deserto-oasis">Descobrir oasis</button>';
document.getElementById('ao-root').appendChild(painel);
function atualizar(){if(!window.DesertoVivo)return;const e=window.DesertoVivo.estado();painel.querySelector('#flow-deserto-info').textContent=e.oases+' oases | '+e.animais+' exploradores | '+e.exploracoes+' descobertas';painel.querySelector('#flow-deserto-vento').textContent=e.tempestade>.5?'Acalmar tempestade':'Ativar tempestade';}
painel.querySelector('#flow-deserto-vento').addEventListener('click',()=>{window.DesertoVivo.ventania();atualizar();});
painel.querySelector('#flow-deserto-oasis').addEventListener('click',()=>{const c=document.getElementById('ao-canvas');window.DesertoVivo.explorar(c.clientWidth*.55,c.clientHeight*.75,c.clientWidth,c.clientHeight);atualizar();});
document.addEventListener('flow:tema',e=>{painel.hidden=e.detail.id!=='deserto';if(!painel.hidden)atualizar();});
document.addEventListener('flow:deserto',atualizar);
})();
