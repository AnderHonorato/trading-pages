/* Ferramentas acessiveis para cultivar o Jardim Vivo. */
(()=>{
'use strict';
const raiz=document.getElementById('ao-root'),painel=document.createElement('section');
painel.id='flow-jardim';painel.hidden=true; painel.setAttribute('aria-label','Ferramentas do jardim');
painel.innerHTML='<strong>JARDIM VIVO</strong><span id="flow-jardim-contagem" aria-live="polite">7 flores</span><p>Toque na terra para plantar uma flor.</p><div><button type="button" id="flow-regar">Regar jardim</button><button type="button" id="flow-sol">Abrir sol</button></div>';
raiz.appendChild(painel);
function atualizar(){if(window.JardimVivo)painel.querySelector('#flow-jardim-contagem').textContent=window.JardimVivo.estado().flores+' flores';}
painel.querySelector('#flow-regar').addEventListener('click',()=>{window.JardimVivo.regar();atualizar();});
painel.querySelector('#flow-sol').addEventListener('click',()=>{window.JardimVivo.iluminar();atualizar();});
document.addEventListener('flow:jardim',atualizar);
document.addEventListener('flow:tema',e=>{painel.hidden=e.detail.id!=='jardim';if(!painel.hidden)atualizar();});
window.FlowJardim={atualizar};
})();
