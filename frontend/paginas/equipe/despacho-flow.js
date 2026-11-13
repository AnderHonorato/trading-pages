(()=>{'use strict';
const CHAVE='ander-flow-missoes-v1',EQUIPE='ander-flow-equipe-v1',NOTAS='ander-flow-despacho-v1';
const etapas={fila:'A preparar',fazendo:'Em produção',revisao:'Em revisão',concluida:'Concluída'};
const $=id=>document.getElementById(id);let filtro='todas',selecionada=null;
const ler=(chave,padrao)=>{try{return JSON.parse(localStorage.getItem(chave))??padrao}catch{return padrao}};
const missoes=()=>{const lista=ler(CHAVE,[]);return Array.isArray(lista)?lista.filter(m=>m&&typeof m.id==='string'&&etapas[m.etapa]):[]};
const equipe=()=>{const e=ler(EQUIPE,{});return {chefe:e.chefe?.nome||'Chefinho',agentes:Array.isArray(e.agentes)?e.agentes:[]}};
const notas=()=>{const n=ler(NOTAS,{});return n&&typeof n==='object'&&!Array.isArray(n)?n:{}};
const criar=(tag,classe,txt)=>{const n=document.createElement(tag);if(classe)n.className=classe;if(txt!==undefined)n.textContent=txt;return n};
const responsavel=(m,e)=>m.responsavel==='chefe'?e.chefe:e.agentes.find(a=>a.id===m.responsavel)?.nome||'Agente removido';
function gravar(lista){try{localStorage.setItem(CHAVE,JSON.stringify(lista));window.dispatchEvent(new Event('flow:missoes-atualizadas'));return true}catch{alert('Não foi possível salvar as missões.');return false}}
function registrar(id,texto){const n=notas(),atual=Array.isArray(n[id])?n[id]:[];n[id]=[...atual,{texto,quando:Date.now()}].slice(-30);try{localStorage.setItem(NOTAS,JSON.stringify(n));return true}catch{alert('Não foi possível salvar o registro.');return false}}
function atualizar(){const lista=missoes(),e=equipe(),concluidas=lista.filter(m=>m.etapa==='concluida').length,ativas=lista.filter(m=>m.etapa!=='concluida').length;
$('despacho-resumo').textContent=`${ativas} missões ativas · ${concluidas} concluídas · ${lista.filter(m=>m.etapa==='revisao').length} em revisão`;
const palco=$('despacho-palco');palco.replaceChildren();['fila','fazendo','revisao','concluida'].forEach((etapa,i)=>{const grupo=lista.filter(m=>m.etapa===etapa),estacao=criar('div','despacho-estacao'),mascote=criar('div','despacho-mascote'),olhos=criar('span','despacho-olhos'),boca=criar('span','despacho-boca'),rotulo=criar('strong','',etapas[etapa]),numero=criar('small','',grupo.length+' missões');mascote.append(olhos,boca);estacao.style.setProperty('--indice',i);estacao.append(mascote,rotulo,numero);palco.append(estacao)});
const grade=$('despacho-lista');grade.replaceChildren();const visiveis=lista.filter(m=>filtro==='todas'||m.etapa===filtro).sort((a,b)=>(b.alterada||b.criada||0)-(a.alterada||a.criada||0));if(!visiveis.length)grade.append(criar('p','despacho-vazio','Nenhuma missão neste filtro. Crie uma na aba Missões.'));
visiveis.forEach(m=>{const card=criar('button','despacho-item'+(selecionada===m.id?' ativo':'')),titulo=criar('strong','',m.titulo),meta=criar('small','',etapas[m.etapa]+' · '+responsavel(m,e));card.type='button';card.append(titulo,meta);card.onclick=()=>{selecionada=m.id;atualizar()};grade.append(card)});
const atual=lista.find(m=>m.id===selecionada);const detalhe=$('despacho-detalhe');detalhe.replaceChildren();if(!atual){detalhe.append(criar('p','','Selecione uma missão para registrar decisões, trocar responsável ou mudar de etapa.'));return}
detalhe.append(criar('h3','',atual.titulo),criar('p','',etapas[atual.etapa]+' · '+responsavel(atual,e)));
const campo=(titulo,opcoes,valor,aoMudar)=>{const label=criar('label','',titulo),select=criar('select');opcoes.forEach(([id,nome])=>{const opt=criar('option','',nome);opt.value=id;select.append(opt)});select.value=valor;select.onchange=()=>aoMudar(select.value);label.append(select);detalhe.append(label)};
const alterar=(prop,valor)=>{const nova=missoes();const item=nova.find(x=>x.id===atual.id);if(!item)return;item[prop]=valor;item.alterada=Date.now();if(gravar(nova))atualizar()};
campo('Etapa',Object.entries(etapas),atual.etapa,v=>alterar('etapa',v));campo('Responsável',[['chefe',e.chefe],...e.agentes.map(a=>[a.id,a.nome])],atual.responsavel,v=>alterar('responsavel',v));
const hist=criar('div','despacho-historico'),registros=notas()[atual.id]||[];hist.append(criar('h4','','Diário da missão'));if(!registros.length)hist.append(criar('p','','Sem registros ainda.'));registros.forEach(n=>hist.append(criar('p','',new Date(n.quando).toLocaleString('pt-BR')+' · '+n.texto)));detalhe.append(hist);
const form=criar('form','despacho-form'),label=criar('label','', 'Registrar decisão ou evidência'),textarea=criar('textarea');textarea.required=true;textarea.maxLength=500;textarea.rows=3;textarea.placeholder='Ex.: Chefinho revisou o layout mobile e solicitou ajuste.';label.append(textarea);const enviar=criar('button','','Salvar no diário');form.append(label,enviar);form.onsubmit=ev=>{ev.preventDefault();const texto=textarea.value.trim();if(texto&&registrar(atual.id,texto))atualizar()};detalhe.append(form)
}
document.querySelectorAll('[data-despacho-filtro]').forEach(b=>b.addEventListener('click',()=>{filtro=b.dataset.despachoFiltro;document.querySelectorAll('[data-despacho-filtro]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));atualizar()}));
document.querySelector('[data-aba="despacho"]').addEventListener('click',atualizar);
window.addEventListener('storage',ev=>{if([CHAVE,EQUIPE,NOTAS].includes(ev.key))atualizar()});
window.addEventListener('flow:missoes-atualizadas',atualizar);
atualizar();
})();