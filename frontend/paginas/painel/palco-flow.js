/* Palco Flow: personagens e atividades locais. Sem execucao de IA externa. */
(()=>{'use strict';
const raiz=document.querySelector('#palco-flow');if(!raiz)return;const abrirPalco=document.querySelector('#abrir-palco');
const chave='ander-flow-palco-v1',tarefas=['planejar','produzir','revisar','descansar'],rotulos={planejar:'Planejando',produzir:'Produzindo',revisar:'Revisando',descansar:'Descansando'};
const papeis=[['Criativo','Pincelinho'],['Programacao','Codiguinho'],['Pesquisa','Lupinha'],['Qualidade','Testinho'],['Organizacao','Listinha']];
let estado={chefinho:'Chefinho',personalidade:'Organizado e gentil',agentes:[],eventos:[]};
try{const v=JSON.parse(localStorage.getItem(chave)||'null');if(v&&Array.isArray(v.agentes)){estado={...estado,...v,agentes:v.agentes.slice(0,12).filter(a=>a&&typeof a.nome==='string')};}}catch{}
const $=s=>raiz.querySelector(s),salvar=()=>{try{localStorage.setItem(chave,JSON.stringify(estado));}catch{aviso('Sem armazenamento disponível.');}};
const aviso=s=>{$('[data-aviso]').textContent=s;};
const registrar=(texto)=>{estado.eventos.unshift({texto,em:new Date().toLocaleTimeString('pt-BR')});estado.eventos=estado.eventos.slice(0,30);salvar();};
const escapar=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function pintar(){
 $('[data-chefinho]').textContent=estado.chefinho||'Chefinho';$('[data-personalidade]').textContent=estado.personalidade;
 const palco=$('[data-personagens]');palco.replaceChildren();
 const nucleo=document.createElement('div');nucleo.className='palco-chefinho';nucleo.innerHTML='<span class="palco-rosto"><i></i><i></i><b></b></span><strong></strong><small>Orquestrador fixo</small>';nucleo.querySelector('strong').textContent=estado.chefinho;palco.append(nucleo);
 if(!estado.agentes.length){const vazio=document.createElement('p');vazio.className='palco-vazio';vazio.textContent='Sua equipe começa vazia. Crie um personagem para acompanhar atividades reais.';palco.append(vazio);}
 estado.agentes.forEach((a,i)=>{const item=document.createElement('article');item.className='palco-personagem';item.dataset.atividade=a.atividade||'descansar';item.innerHTML='<div class="palco-avatar"><span class="palco-rosto"><i></i><i></i><b></b></span></div><strong></strong><small></small><label>Atividade<select aria-label="Atividade do personagem"></select></label><div class="palco-botoes"><button type="button" data-editar>Editar</button><button type="button" data-excluir>Excluir</button></div>';
 item.querySelector('strong').textContent=a.nome;item.querySelector('small').textContent=a.papel+' · '+rotulos[a.atividade||'descansar'];const select=item.querySelector('select');tarefas.forEach(t=>{const opt=document.createElement('option');opt.value=t;opt.textContent=rotulos[t];select.append(opt);});select.value=a.atividade||'descansar';
 select.addEventListener('change',()=>{a.atividade=select.value;registrar(estado.chefinho+' encaminhou '+rotulos[a.atividade].toLowerCase()+' para '+a.nome+' (ação local)');pintar();});
 item.querySelector('[data-editar]').addEventListener('click',()=>{const nome=prompt('Nome do personagem',a.nome);if(nome===null)return;const limpo=nome.trim().slice(0,32);if(!limpo)return aviso('Informe um nome.');a.nome=limpo;registrar('Perfil atualizado: '+limpo);pintar();});
 item.querySelector('[data-excluir]').addEventListener('click',()=>{if(!confirm('Excluir '+a.nome+' da equipe?'))return;estado.agentes.splice(i,1);registrar('Personagem excluído: '+a.nome);pintar();});palco.append(item);});
 $('[data-contagem]').textContent=estado.agentes.length+' auxiliares';const eventos=$('[data-eventos]');eventos.replaceChildren();estado.eventos.slice(0,8).forEach(e=>{const li=document.createElement('li');li.textContent=e.em+' · '+e.texto;eventos.append(li);});
}
abrirPalco.addEventListener('click',()=>{raiz.hidden=false;pintar();$('[data-fechar-palco]').focus();});
$('[data-fechar-palco]').addEventListener('click',()=>{raiz.hidden=true;abrirPalco.focus();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!raiz.hidden)raiz.querySelector('[data-fechar-palco]').click();});
$('[data-configurar]').addEventListener('click',()=>{const nome=prompt('Nome do orquestrador',estado.chefinho);if(nome===null)return;const personalidade=prompt('Personalidade do orquestrador',estado.personalidade);if(personalidade===null)return;estado.chefinho=nome.trim().slice(0,32)||'Chefinho';estado.personalidade=personalidade.trim().slice(0,120)||'Organizado e gentil';registrar('Orquestrador personalizado');pintar();});
const catalogo=$('[data-catalogo]');papeis.forEach(([papel,nome])=>{const opt=document.createElement('option');opt.value=papel;opt.textContent=papel+' · '+nome;catalogo.append(opt);});
$('[data-criar]').addEventListener('click',()=>{if(estado.agentes.length>=12)return aviso('Limite de 12 personagens.');const papel=catalogo.value;const padrao=papeis.find(x=>x[0]===papel)?.[1]||'Ajudante';const nome=prompt('Nome do novo personagem',padrao);if(nome===null)return;const agente={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),nome:nome.trim().slice(0,32)||padrao,papel,atividade:'descansar'};estado.agentes.push(agente);registrar(estado.chefinho+' recebeu '+agente.nome+' na equipe (demonstração local)');pintar();});
$('[data-todos-descansar]').addEventListener('click',()=>{estado.agentes.forEach(a=>a.atividade='descansar');registrar(estado.chefinho+' encerrou as atividades da equipe');pintar();});
pintar();
})();