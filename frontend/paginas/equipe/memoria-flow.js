(()=>{'use strict';
const MISSOES='ander-flow-missoes-v1',NOTAS='ander-flow-despacho-v1',EQUIPE='ander-flow-equipe-v1',ETAPAS={fila:'A preparar',fazendo:'Em produção',revisao:'Em revisão',concluida:'Concluída'};
const $=id=>document.getElementById(id),ler=(ch,p)=>{try{return JSON.parse(localStorage.getItem(ch))??p}catch{return p}};
const criar=(tag,classe,conteudo)=>{const e=document.createElement(tag);if(classe)e.className=classe;if(conteudo!==undefined)e.textContent=conteudo;return e};
const missoes=()=>{const m=ler(MISSOES,[]);return Array.isArray(m)?m.filter(x=>x&&typeof x.id==='string'&&typeof x.titulo==='string'&&Object.hasOwn(ETAPAS,x.etapa)):[]};
const equipe=()=>{const e=ler(EQUIPE,{});return {chefe:e.chefe?.nome||'Chefinho',agentes:Array.isArray(e.agentes)?e.agentes:[]}};
const notas=()=>{const n=ler(NOTAS,{});return n&&typeof n==='object'&&!Array.isArray(n)?n:{}};
let filtro='todos',periodo='todos',selecionada=null;
function eventos(){const lista=missoes(),diario=notas(),e=equipe(),itens=[];
for(const m of lista){const responsavel=m.responsavel==='chefe'?e.chefe:e.agentes.find(a=>a.id===m.responsavel)?.nome||'Agente removido';
if(Number.isFinite(m.criada))itens.push({id:m.id,quando:m.criada,tipo:'criacao',titulo:m.titulo,descricao:'Missão criada · '+responsavel,etapa:m.etapa});
if(Number.isFinite(m.alterada)&&m.alterada!==m.criada)itens.push({id:m.id,quando:m.alterada,tipo:'alteracao',titulo:m.titulo,descricao:'Estado atual: '+ETAPAS[m.etapa]+' · '+responsavel,etapa:m.etapa});
const registros=Array.isArray(diario[m.id])?diario[m.id]:[];
for(const n of registros){if(n&&typeof n.texto==='string'&&Number.isFinite(n.quando))itens.push({id:m.id,quando:n.quando,tipo:'diario',titulo:m.titulo,descricao:n.texto.slice(0,500),etapa:m.etapa})}}
return itens.sort((a,b)=>b.quando-a.quando).slice(0,1000)}
function render(){const lista=missoes(),itens=eventos(),agora=Date.now(),limite=periodo==='7'?agora-7*864e5:periodo==='30'?agora-30*864e5:0;
const visiveis=itens.filter(x=>(filtro==='todos'||x.tipo===filtro)&&x.quando>=limite);
const concluidas=lista.filter(x=>x.etapa==='concluida').length,progresso=lista.length?Math.round(100*concluidas/lista.length):0;
$('memoria-resumo').textContent=lista.length+' missões · '+concluidas+' concluídas · '+itens.filter(x=>x.tipo==='diario').length+' registros no diário';
$('memoria-progresso').style.width=progresso+'%';$('memoria-percentual').textContent=progresso+'% concluídas';
const contagens={criacao:0,alteracao:0,diario:0};visiveis.forEach(x=>contagens[x.tipo]++);
const painel=$('memoria-estacoes');painel.replaceChildren();[['criacao','Novas missões','✦'],['alteracao','Movimentações','↗'],['diario','Decisões registradas','✎']].forEach(([tipo,titulo,simbolo])=>{const b=criar('button','memoria-estacao'+(filtro===tipo?' ativa':''));b.type='button';b.setAttribute('aria-pressed',String(filtro===tipo));b.append(criar('span','memoria-simbolo',simbolo),criar('strong','',String(contagens[tipo])),criar('small','',titulo));b.onclick=()=>{filtro=filtro===tipo?'todos':tipo;$('memoria-filtro').value=filtro;render()};painel.append(b)});
const linha=$('memoria-linha');linha.replaceChildren();if(!visiveis.length)linha.append(criar('p','memoria-vazio','Ainda não há atividades neste filtro. Crie missões ou registre decisões na Sala de Despacho.'));
let diaAnterior='';for(const item of visiveis.slice(0,120)){const data=new Date(item.quando),dia=data.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});if(dia!==diaAnterior){linha.append(criar('h3','memoria-dia',dia));diaAnterior=dia}
const cartao=criar('article','memoria-evento '+item.tipo),marcador=criar('span','memoria-marcador'),corpo=criar('div','memoria-conteudo'),topo=criar('div','memoria-evento-topo');topo.append(criar('strong','',item.titulo),criar('time','',data.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})));corpo.append(topo,criar('p','',item.descricao));const botao=criar('button','secundario','Abrir no Despacho');botao.type='button';botao.onclick=()=>{selecionada=item.id;const aba=document.querySelector('[data-aba="despacho"]');aba?.click();window.dispatchEvent(new CustomEvent('flow:abrir-missao',{detail:{id:item.id}}))};corpo.append(botao);cartao.append(marcador,corpo);linha.append(cartao)}
$('memoria-quantidade').textContent=visiveis.length>120?'Exibindo 120 de '+visiveis.length+' eventos':visiveis.length+' eventos';}
$('memoria-filtro').addEventListener('change',e=>{filtro=e.target.value;render()});
$('memoria-periodo').addEventListener('change',e=>{periodo=e.target.value;render()});
$('memoria-exportar').addEventListener('click',()=>{const conteudo=JSON.stringify({versao:1,geradoEm:new Date().toISOString(),eventos:eventos()},null,2);const url=URL.createObjectURL(new Blob([conteudo],{type:'application/json'}));const a=criar('a');a.href=url;a.download='linha-do-tempo-flow-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
document.querySelector('[data-aba="memoria"]').addEventListener('click',render);
window.addEventListener('flow:missoes-atualizadas',render);window.addEventListener('storage',e=>{if([MISSOES,NOTAS,EQUIPE].includes(e.key))render()});window.addEventListener('flow:diario-atualizado',render);
render();
})();