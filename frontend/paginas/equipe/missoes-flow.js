(()=>{'use strict';
const CHAVE='ander-flow-missoes-v1',EQUIPE='ander-flow-equipe-v1';
const etapas=[['fila','A preparar'],['fazendo','Em produção'],['revisao','Em revisão'],['concluida','Concluídas']];
const $=id=>document.getElementById(id);
let missoes=[];
try{const salvo=JSON.parse(localStorage.getItem(CHAVE)||'[]');if(Array.isArray(salvo))missoes=salvo.filter(m=>m&&typeof m.titulo==='string'&&etapas.some(e=>e[0]===m.etapa)).slice(-200)}catch{}
function equipe(){try{const d=JSON.parse(localStorage.getItem(EQUIPE)||'{}');return {chefe:d.chefe?.nome||'Chefinho',agentes:Array.isArray(d.agentes)?d.agentes:[]}}catch{return {chefe:'Chefinho',agentes:[]}}}
function gravar(){try{localStorage.setItem(CHAVE,JSON.stringify(missoes))}catch{alert('Não foi possível salvar. Verifique o armazenamento do navegador.')}}
function el(tag,classe,texto){const n=document.createElement(tag);if(classe)n.className=classe;if(texto!==undefined)n.textContent=texto;return n}
function atualizarResponsaveis(){const sel=$('missao-responsavel'),antigo=sel.value,eq=equipe();sel.replaceChildren();[[ 'chefe',eq.chefe],...eq.agentes.map(a=>[a.id,a.nome])].forEach(([id,nome])=>{const op=el('option','',nome);op.value=id;sel.append(op)});if([...sel.options].some(o=>o.value===antigo))sel.value=antigo}
function render(){
atualizarResponsaveis();const quadro=$('kanban-flow');quadro.replaceChildren();
const feitas=missoes.filter(m=>m.etapa==='concluida').length;
$('indicadores-missao').textContent=missoes.length+' missões · '+feitas+' concluídas · '+(missoes.length?Math.round(feitas/missoes.length*100):0)+'% de progresso';
const eq=equipe();
etapas.forEach(([id,nome],indice)=>{
const coluna=el('section','coluna-flow'),cab=el('h3','',nome+' · '+missoes.filter(m=>m.etapa===id).length);
coluna.append(cab);const grupo=missoes.filter(m=>m.etapa===id);
if(!grupo.length)coluna.append(el('p','coluna-vazia','Nenhuma missão nesta etapa'));
grupo.forEach(m=>{
const card=el('article','cartao-missao'),titulo=el('h4','',m.titulo),nomeResp=m.responsavel==='chefe'?eq.chefe:eq.agentes.find(a=>a.id===m.responsavel)?.nome||'Agente removido';
const meta=el('p','',nomeResp+' · '+new Date(m.criada).toLocaleDateString('pt-BR')),acoes=el('div','acoes-missao');
const botao=(texto,acao)=>{const b=el('button','secundario',texto);b.type='button';b.onclick=acao;return b};
if(indice>0)acoes.append(botao('← Voltar',()=>mover(m,etapas[indice-1][0])));
if(indice<etapas.length-1)acoes.append(botao('Avançar →',()=>mover(m,etapas[indice+1][0])));
acoes.append(botao('Excluir',()=>{if(confirm('Excluir esta missão?')){missoes=missoes.filter(x=>x.id!==m.id);gravar();render()}}));
card.append(titulo,meta,acoes);coluna.append(card)
});quadro.append(coluna)
})}
function mover(m,etapa){m.etapa=etapa;m.alterada=Date.now();gravar();render()}
$('form-missao').addEventListener('submit',ev=>{ev.preventDefault();const titulo=$('missao-titulo').value.trim().slice(0,100);if(!titulo)return;if(missoes.length>=200){alert('Limite de 200 missões locais atingido.');return}
missoes.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random(),titulo,responsavel:$('missao-responsavel').value,etapa:'fila',criada:Date.now()});$('missao-titulo').value='';gravar();render()});
window.addEventListener('storage',ev=>{if(ev.key===EQUIPE)render();if(ev.key===CHAVE){try{const d=JSON.parse(ev.newValue||'[]');if(Array.isArray(d))missoes=d}catch{}render()}});
document.querySelector('[data-aba="missoes"]').addEventListener('click',render);
render();
})();