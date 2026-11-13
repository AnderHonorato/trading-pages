(()=>{'use strict';
const CHAVE='ander-flow-missoes-v1',EQUIPE='ander-flow-equipe-v1';
const etapas=[['fila','A preparar'],['fazendo','Em produção'],['revisao','Em revisão'],['concluida','Concluídas']];
const $=id=>document.getElementById(id);
const prioridade={urgente:0,alta:1,normal:2};
const dataHoje=()=>new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
const ordenar=(a,b)=>(prioridade[a.prioridade]??2)-(prioridade[b.prioridade]??2)||(a.prazo||'9999-12-31').localeCompare(b.prazo||'9999-12-31')||(a.criada||0)-(b.criada||0);
let missoes=[];
try{const salvo=JSON.parse(localStorage.getItem(CHAVE)||'[]');if(Array.isArray(salvo))missoes=salvo.filter(m=>m&&typeof m.titulo==='string'&&etapas.some(e=>e[0]===m.etapa)).slice(-200)}catch{}
function equipe(){try{const d=JSON.parse(localStorage.getItem(EQUIPE)||'{}');return {chefe:d.chefe?.nome||'Chefinho',agentes:Array.isArray(d.agentes)?d.agentes:[]}}catch{return {chefe:'Chefinho',agentes:[]}}}
function lerMissoes(){try{const dados=JSON.parse(localStorage.getItem(CHAVE)||'[]');return Array.isArray(dados)?dados.filter(m=>m&&typeof m.id==='string'&&typeof m.titulo==='string'&&etapas.some(e=>e[0]===m.etapa)).slice(-200):[]}catch{return []}}
function gravar(){try{localStorage.setItem(CHAVE,JSON.stringify(missoes));window.dispatchEvent(new Event('flow:missoes-atualizadas'));return true}catch{alert('Não foi possível salvar. Verifique o armazenamento do navegador.');return false}}
function el(tag,classe,texto){const n=document.createElement(tag);if(classe)n.className=classe;if(texto!==undefined)n.textContent=texto;return n}
function atualizarResponsaveis(){const sel=$('missao-responsavel'),antigo=sel.value,eq=equipe();sel.replaceChildren();[[ 'chefe',eq.chefe],...eq.agentes.map(a=>[a.id,a.nome])].forEach(([id,nome])=>{const op=el('option','',nome);op.value=id;sel.append(op)});if([...sel.options].some(o=>o.value===antigo))sel.value=antigo}
function render(){
const atual=lerMissoes();missoes=atual;
atualizarResponsaveis();const quadro=$('kanban-flow');quadro.replaceChildren();
const feitas=missoes.filter(m=>m.etapa==='concluida').length;
$('indicadores-missao').textContent=missoes.length+' missões · '+feitas+' concluídas · '+(missoes.length?Math.round(feitas/missoes.length*100):0)+'% de progresso';
const eq=equipe();
const pendentes=missoes.filter(m=>m.etapa!=='concluida').sort(ordenar),vencidas=pendentes.filter(m=>m.prazo&&m.prazo<dataHoje()).length;
$('foco-resumo').textContent=pendentes.length+' pendentes · '+vencidas+' atrasadas · '+pendentes.filter(m=>m.prioridade==='urgente').length+' urgentes';
const foco=$('foco-lista');foco.replaceChildren();
if(!pendentes.length)foco.append(el('p','','Nenhuma missão pendente. Crie uma para planejar o dia.'));
pendentes.slice(0,3).forEach(m=>{const item=el('article','foco-item'),info=el('div'),etiqueta=el('small','',((m.prioridade||'normal').toUpperCase())+' · '+(m.prazo||'Sem prazo')),titulo=el('strong','',m.titulo),botao=el('button','secundario','Próxima etapa →');info.append(etiqueta,titulo);botao.type='button';botao.disabled=m.etapa==='concluida';botao.onclick=()=>{const i=etapas.findIndex(e=>e[0]===m.etapa);if(i>=0&&i<etapas.length-1)mover(m,etapas[i+1][0])};item.append(info,botao);foco.append(item)});
const filtro=$('filtrar-responsavel'),anterior=filtro.value;
filtro.replaceChildren();[['todos','Toda a equipe'],['chefe',eq.chefe],...eq.agentes.map(a=>[a.id,a.nome])].forEach(([id,nome])=>{const op=el('option','',nome);op.value=id;filtro.append(op)});
if([...filtro.options].some(o=>o.value===anterior))filtro.value=anterior;
const busca=$('buscar-missao').value.trim().toLocaleLowerCase('pt-BR');
const visiveis=missoes.filter(m=>(filtro.value==='todos'||m.responsavel===filtro.value)&&(!busca||(m.titulo+' '+(m.responsavel==='chefe'?eq.chefe:eq.agentes.find(a=>a.id===m.responsavel)?.nome||'')).toLocaleLowerCase('pt-BR').includes(busca)));
etapas.forEach(([id,nome],indice)=>{
const coluna=el('section','coluna-flow'),cab=el('h3','',nome+' · '+visiveis.filter(m=>m.etapa===id).length);
coluna.append(cab);const grupo=visiveis.filter(m=>m.etapa===id).sort(ordenar);
if(!grupo.length)coluna.append(el('p','coluna-vazia','Nenhuma missão nesta etapa'));
grupo.forEach(m=>{
const card=el('article','cartao-missao'),titulo=el('h4','',m.titulo),nomeResp=m.responsavel==='chefe'?eq.chefe:eq.agentes.find(a=>a.id===m.responsavel)?.nome||'Agente removido';
const meta=el('p','',nomeResp+' · '+new Date(m.criada).toLocaleDateString('pt-BR')),prazo=el('p','missao-prazo'+(m.prazo&&m.prazo<dataHoje()&&m.etapa!=='concluida'?' atrasada':''),(m.prioridade||'normal').toUpperCase()+' · '+(m.prazo?'Prazo '+m.prazo:'Sem prazo')),acoes=el('div','acoes-missao');
const botao=(texto,acao)=>{const b=el('button','secundario',texto);b.type='button';b.onclick=acao;return b};
if(indice>0)acoes.append(botao('← Voltar',()=>mover(m,etapas[indice-1][0])));
if(indice<etapas.length-1)acoes.append(botao('Avançar →',()=>mover(m,etapas[indice+1][0])));
acoes.append(botao('Excluir',()=>{if(confirm('Excluir esta missão?')){missoes=lerMissoes().filter(x=>x.id!==m.id);gravar();render()}}));
card.append(titulo,meta,prazo,acoes);coluna.append(card)
});quadro.append(coluna)
})}
function mover(m,etapa){missoes=lerMissoes();m=missoes.find(x=>x.id===m.id);if(!m)return;m.etapa=etapa;m.alterada=Date.now();gravar();render()}
$('form-missao').addEventListener('submit',ev=>{ev.preventDefault();missoes=lerMissoes();const titulo=$('missao-titulo').value.trim().slice(0,100);if(!titulo)return;if(missoes.length>=200){alert('Limite de 200 missões locais atingido.');return}
missoes.push({id:globalThis.crypto?.randomUUID?.()||'m-'+Date.now()+'-'+Math.random().toString(36).slice(2),titulo,responsavel:$('missao-responsavel').value,etapa:'fila',prioridade:$('missao-prioridade').value,prazo:$('missao-prazo').value,criada:Date.now()});if(gravar()){$('missao-titulo').value='';$('missao-prazo').value='';$('missao-prioridade').value='normal'}render()});
window.addEventListener('flow:missoes-atualizadas',render);
window.addEventListener('storage',ev=>{if(ev.key===EQUIPE)render();if(ev.key===CHAVE){try{const d=JSON.parse(ev.newValue||'[]');if(Array.isArray(d))missoes=d}catch{}render()}});
document.querySelector('[data-aba="missoes"]').addEventListener('click',render);
$('buscar-missao').addEventListener('input',render);
$('filtrar-responsavel').addEventListener('change',render);
$('exportar-missoes').addEventListener('click',()=>{const conteudo=JSON.stringify({versao:1,exportadoEm:new Date().toISOString(),missoes:lerMissoes()},null,2);const url=URL.createObjectURL(new Blob([conteudo],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='missoes-flow-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
$('importar-missoes').addEventListener('change',async ev=>{const arquivo=ev.target.files?.[0];if(!arquivo)return;try{if(arquivo.size>1024*1024)throw Error('Arquivo maior que 1 MB');const dados=JSON.parse(await arquivo.text());if(dados?.versao!==1||!Array.isArray(dados.missoes)||dados.missoes.length>200)throw Error('Formato ou limite de missões inválido');const ids=new Set();const importadas=dados.missoes.map(m=>{if(!m||typeof m.id!=='string'||!m.id||ids.has(m.id)||typeof m.titulo!=='string'||!m.titulo.trim()||m.titulo.length>100||typeof m.responsavel!=='string'||m.responsavel.length>100||!etapas.some(e=>e[0]===m.etapa)||!Number.isFinite(m.criada))throw Error('Missão inválida ou ID repetido');ids.add(m.id);return {id:m.id,titulo:m.titulo,responsavel:m.responsavel,etapa:m.etapa,criada:m.criada,alterada:Number.isFinite(m.alterada)?m.alterada:undefined,prioridade:['normal','alta','urgente'].includes(m.prioridade)?m.prioridade:'normal',prazo:typeof m.prazo==='string'&&(/^\d{4}-\d{2}-\d{2}$/.test(m.prazo)||m.prazo==='')?m.prazo:''}});if(!confirm('Substituir as '+lerMissoes().length+' missões atuais por '+importadas.length+' do arquivo? Exporte um backup antes.'))return;missoes=importadas;if(gravar())render()}catch(erro){alert('Importação cancelada: '+erro.message)}finally{ev.target.value=''}});
render();
})();