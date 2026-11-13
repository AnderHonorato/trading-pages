(()=>{'use strict';
const CHAVE='ander-flow-missoes-v1',EQUIPE='ander-flow-equipe-v1',ETAPAS={fila:'A preparar',fazendo:'Em produção',revisao:'Em revisão',concluida:'Concluída'};
const $=id=>document.getElementById(id),criar=(tag,classe,valor)=>{const n=document.createElement(tag);if(classe)n.className=classe;if(valor!==undefined)n.textContent=valor;return n};
const ler=(chave,padrao)=>{try{return JSON.parse(localStorage.getItem(chave))??padrao}catch{return padrao}};
const hoje=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
const iso=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
const data=s=>{const [a,m,d]=s.split('-').map(Number);return new Date(a,m-1,d)};
const tarefas=()=>{const lista=ler(CHAVE,[]);return Array.isArray(lista)?lista.filter(m=>m&&typeof m.id==='string'&&typeof m.titulo==='string'&&Object.hasOwn(ETAPAS,m.etapa)):[]};
let inicio=hoje(),dia=hoje(),filtro='ativas';
function nomeResponsavel(m){const e=ler(EQUIPE,{});return m.responsavel==='chefe'?(e.chefe?.nome||'Chefinho'):(e.agentes||[]).find(a=>a.id===m.responsavel)?.nome||'Agente removido'}
function alterar(id,campos){const lista=tarefas(),m=lista.find(x=>x.id===id);if(!m)return;Object.assign(m,campos,{alterada:Date.now()});try{localStorage.setItem(CHAVE,JSON.stringify(lista));window.dispatchEvent(new Event('flow:missoes-atualizadas'))}catch{alert('Não foi possível salvar a missão.')}} 
function semana(){const d=data(inicio);d.setDate(d.getDate()-((d.getDay()+6)%7));return d}
function render(){const lista=tarefas(),base=semana(),dias=Array.from({length:7},(_,i)=>{const d=new Date(base);d.setDate(d.getDate()+i);return iso(d)}),hojeIso=hoje();
$('calendario-periodo').textContent=data(dias[0]).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})+' — '+data(dias[6]).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'});
const totalAtrasadas=lista.filter(m=>m.etapa!=='concluida'&&m.prazo&&m.prazo<hojeIso).length;
$('calendario-resumo').textContent=lista.filter(m=>m.prazo&&dias.includes(m.prazo)).length+' missões nesta semana · '+totalAtrasadas+' atrasadas · '+lista.filter(m=>!m.prazo&&m.etapa!=='concluida').length+' sem prazo';
const grade=$('calendario-grade');grade.replaceChildren();
dias.forEach(s=>{const itens=lista.filter(m=>m.prazo===s&&(filtro==='todas'||m.etapa!=='concluida'));const b=criar('button','calendario-dia'+(dia===s?' selecionado':'')+(s===hojeIso?' hoje':'')+(itens.some(m=>m.etapa!=='concluida'&&s<hojeIso)?' atrasado':''));b.type='button';b.setAttribute('aria-pressed',String(dia===s));b.setAttribute('aria-label',data(s).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})+', '+itens.length+' missões');b.append(criar('small','',data(s).toLocaleDateString('pt-BR',{weekday:'short'})),criar('strong','',String(data(s).getDate())),criar('span','calendario-contagem',itens.length+' missões'));b.onclick=()=>{dia=s;render()};grade.append(b)});
const listaDia=$('calendario-tarefas');listaDia.replaceChildren();const visiveis=lista.filter(m=>m.prazo===dia&&(filtro==='todas'||m.etapa!=='concluida')).sort((a,b)=>({urgente:0,alta:1,normal:2}[a.prioridade]??2)-({urgente:0,alta:1,normal:2}[b.prioridade]??2));
$('calendario-dia-titulo').textContent=data(dia).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
if(!visiveis.length)listaDia.append(criar('p','calendario-vazio','Sem missões neste dia. Escolha uma missão sem prazo para agendar.'));
visiveis.forEach(m=>{const artigo=criar('article','calendario-cartao'),topo=criar('div','calendario-cartao-topo');topo.append(criar('strong','',m.titulo),criar('span','calendario-prioridade '+(m.prioridade||'normal'),m.prioridade==='urgente'?'Urgente':m.prioridade==='alta'?'Alta':'Normal'));artigo.append(topo,criar('small','',ETAPAS[m.etapa]+' · '+nomeResponsavel(m)));const acoes=criar('div','calendario-acoes'),anterior=criar('button','secundario','← Dia anterior'),proximo=criar('button','secundario','Próximo dia →');anterior.type=proximo.type='button';anterior.onclick=()=>moverDia(m,-1);proximo.onclick=()=>moverDia(m,1);acoes.append(anterior,proximo);if(m.etapa!=='concluida'){const avancar=criar('button','','Avançar etapa');avancar.type='button';avancar.onclick=()=>{const e=Object.keys(ETAPAS),i=e.indexOf(m.etapa);alterar(m.id,{etapa:e[Math.min(i+1,3)]})};acoes.append(avancar)}artigo.append(acoes);listaDia.append(artigo)});
const pendentes=$('calendario-sem-prazo');pendentes.replaceChildren();const sem=lista.filter(m=>!m.prazo&&m.etapa!=='concluida').sort((a,b)=>(b.alterada||b.criada||0)-(a.alterada||a.criada||0)).slice(0,30);
if(!sem.length)pendentes.append(criar('p','calendario-vazio','Todas as missões ativas já têm prazo.'));
sem.forEach(m=>{const linha=criar('div','calendario-pendente'),titulo=criar('span','',m.titulo),botao=criar('button','secundario','Agendar para '+data(dia).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}));botao.type='button';botao.onclick=()=>alterar(m.id,{prazo:dia});linha.append(titulo,botao);pendentes.append(linha)})}
function moverDia(m,delta){const d=data(m.prazo);d.setDate(d.getDate()+delta);const novo=iso(d);dia=novo;inicio=novo;alterar(m.id,{prazo:novo})}
$('calendario-anterior').onclick=()=>{const d=semana();d.setDate(d.getDate()-7);inicio=iso(d);dia=inicio;render()};
$('calendario-proxima').onclick=()=>{const d=semana();d.setDate(d.getDate()+7);inicio=iso(d);dia=inicio;render()};
$('calendario-hoje').onclick=()=>{inicio=dia=hoje();render()};
$('calendario-filtro').onchange=ev=>{filtro=ev.target.value;render()};
document.querySelector('[data-aba="calendario"]').addEventListener('click',render);
window.addEventListener('flow:missoes-atualizadas',render);
window.addEventListener('storage',ev=>{if([CHAVE,EQUIPE].includes(ev.key))render()});
render();
})();