(()=>{'use strict';
const CHAVE='ander-flow-missoes-v1', EQUIPE='ander-flow-equipe-v1', DIARIO='ander-flow-comando-v1';
const $=id=>document.getElementById(id);
const ler=(chave,padrao)=>{try{return JSON.parse(localStorage.getItem(chave))??padrao}catch{return padrao}};
const hoje=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
const etapas=['fila','fazendo','revisao','concluida'],nomes=['Na fila','Em produção','Em revisão','Concluída'];
let selecionadas=new Set(),filtro='ativas';
const elemento=(tag,classe,texto)=>{const n=document.createElement(tag);if(classe)n.className=classe;if(texto!==undefined)n.textContent=texto;return n};
function missoes(){const d=ler(CHAVE,[]);return Array.isArray(d)?d.filter(m=>m&&typeof m.id==='string'&&etapas.includes(m.etapa)):[]}
function nome(m){const e=ler(EQUIPE,{});return m.responsavel==='chefe'?(e.chefe?.nome||'Chefinho'):(e.agentes||[]).find(a=>a.id===m.responsavel)?.nome||'Sem agente ativo'}
function ordenar(a,b){const peso={urgente:0,alta:1,normal:2};return (peso[a.prioridade]??2)-(peso[b.prioridade]??2)||(a.prazo||'9999').localeCompare(b.prazo||'9999')}
function salvar(lista){try{localStorage.setItem(CHAVE,JSON.stringify(lista));window.dispatchEvent(new Event('flow:missoes-atualizadas'));return true}catch{$('comando-aviso').textContent='Armazenamento indisponível. Nada foi alterado.';return false}}
function render(){
 const lista=missoes(),ativas=lista.filter(m=>m.etapa!=='concluida'),atrasadas=ativas.filter(m=>m.prazo&&m.prazo<hoje()),urgentes=ativas.filter(m=>m.prioridade==='urgente');
 $('comando-resumo').textContent=ativas.length+' ativas · '+atrasadas.length+' atrasadas · '+urgentes.length+' urgentes · '+lista.filter(m=>m.etapa==='concluida').length+' concluídas';
 const base=filtro==='atrasadas'?atrasadas:filtro==='urgentes'?urgentes:filtro==='todas'?lista:ativas;
 const area=$('comando-lista');area.replaceChildren();
 const ids=new Set(lista.map(m=>m.id));selecionadas=new Set([...selecionadas].filter(id=>ids.has(id)));
 if(!base.length)area.append(elemento('p','comando-vazio','Nenhuma missão neste filtro. Crie uma na aba Missões.'));
 base.sort(ordenar).forEach(m=>{
  const linha=elemento('label','comando-item'),check=elemento('input');check.type='checkbox';check.checked=selecionadas.has(m.id);check.setAttribute('aria-label','Selecionar '+m.titulo);
  check.onchange=()=>{check.checked?selecionadas.add(m.id):selecionadas.delete(m.id);atualizarSelecao()};
  const corpo=elemento('span','comando-item-texto'),titulo=elemento('strong','',m.titulo),meta=elemento('small','',nome(m)+' · '+nomes[etapas.indexOf(m.etapa)]+' · '+(m.prazo||'Sem prazo')+' · '+(m.prioridade||'normal'));
  corpo.append(titulo,meta);linha.append(check,corpo);area.append(linha)
 });
 atualizarSelecao();
 const anotacoes=ler(DIARIO,{});$('comando-nota').value=anotacoes[hoje()]||'';
 $('comando-data').textContent=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
}
function atualizarSelecao(){$('comando-selecao').textContent=selecionadas.size+' selecionadas';$('comando-avancar').disabled=!selecionadas.size;$('comando-concluir').disabled=!selecionadas.size;$('comando-selecionar').textContent=selecionadas.size?'Limpar seleção':'Selecionar visíveis'}
function aplicar(concluir){
 const lista=missoes(),alvos=lista.filter(m=>selecionadas.has(m.id)&&m.etapa!=='concluida');
 if(!alvos.length){$('comando-aviso').textContent='Nenhuma missão ativa selecionada.';return}
 if(!confirm((concluir?'Concluir ':'Avançar ')+alvos.length+' missão(ões)?'))return;
 const momento=Date.now();alvos.forEach(m=>{m.etapa=concluir?'concluida':etapas[Math.min(etapas.indexOf(m.etapa)+1,3)];m.alterada=momento});
 if(salvar(lista)){selecionadas.clear();render();$('comando-aviso').textContent=alvos.length+' missão(ões) atualizada(s) e salvas neste navegador.'}
}
document.querySelector('[data-aba="comando"]').addEventListener('click',render);
document.querySelectorAll('[data-comando-filtro]').forEach(b=>b.onclick=()=>{filtro=b.dataset.comandoFiltro;document.querySelectorAll('[data-comando-filtro]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render()});
$('comando-selecionar').onclick=()=>{if(selecionadas.size)selecionadas.clear();else document.querySelectorAll('#comando-lista input[type="checkbox"]').forEach(c=>{c.checked=true;c.dispatchEvent(new Event('change'))});render()};
$('comando-avancar').onclick=()=>aplicar(false);$('comando-concluir').onclick=()=>aplicar(true);
$('comando-salvar-nota').onclick=()=>{const notas=ler(DIARIO,{}),chave=hoje();const texto=$('comando-nota').value.trim().slice(0,2000);if(texto)notas[chave]=texto;else delete notas[chave];const chaves=Object.keys(notas).sort();while(chaves.length>90)delete notas[chaves.shift()];try{localStorage.setItem(DIARIO,JSON.stringify(notas));$('comando-aviso').textContent='Diário de hoje salvo localmente.'}catch{$('comando-aviso').textContent='Falha ao salvar diário.'}};
$('comando-exportar').onclick=()=>{const dados={versao:1,exportadoEm:new Date().toISOString(),diario:ler(DIARIO,{}),missoes:missoes()};const url=URL.createObjectURL(new Blob([JSON.stringify(dados,null,2)],{type:'application/json'}));const a=elemento('a');a.href=url;a.download='comando-flow-'+hoje()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
window.addEventListener('flow:missoes-atualizadas',()=>{if(!$('aba-comando').hidden)render()});window.addEventListener('storage',e=>{if([CHAVE,EQUIPE,DIARIO].includes(e.key)&&!$('aba-comando').hidden)render()});
render();
})();