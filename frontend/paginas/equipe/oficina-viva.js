(()=>{'use strict';
const $=id=>document.getElementById(id),CHAVE='ander-flow-missoes-v1',EQUIPE='ander-flow-equipe-v1',ETAPAS=['fila','fazendo','revisao','concluida'];
const ler=(k,p)=>{try{return JSON.parse(localStorage.getItem(k))??p}catch{return p}};
const texto=(tag,classe,valor)=>{const e=document.createElement(tag);if(classe)e.className=classe;if(valor!==undefined)e.textContent=valor;return e};
const equipe=()=>{const e=ler(EQUIPE,{});return {chefe:e.chefe||{nome:'Chefinho'},agentes:Array.isArray(e.agentes)?e.agentes:[]}};
const missoes=()=>{const m=ler(CHAVE,[]);return Array.isArray(m)?m.filter(x=>x&&typeof x.id==='string'&&ETAPAS.includes(x.etapa)):[]};
let selecionado=null,mostrar='todas';
function atualizarMissao(id,alteracao){const lista=missoes(),m=lista.find(x=>x.id===id);if(!m)return;Object.assign(m,alteracao,{alterada:Date.now()});try{localStorage.setItem(CHAVE,JSON.stringify(lista));window.dispatchEvent(new Event('flow:missoes-atualizadas'))}catch{alert('Não foi possível salvar esta alteração.')}}
function render(){const e=equipe(),lista=missoes(),ativos=lista.filter(m=>m.etapa!=='concluida'),pessoas=[{id:'chefe',nome:e.chefe.nome||'Chefinho',funcao:'Orquestrador',animacao:'respirar'},...e.agentes];
$('oficina-resumo').textContent=pessoas.length+' personagens · '+ativos.length+' missões ativas · '+lista.filter(m=>m.etapa==='concluida').length+' concluídas';
const palco=$('oficina-palco');palco.replaceChildren();pessoas.forEach((p,i)=>{const tarefas=ativos.filter(m=>m.responsavel===p.id),posto=texto('button','oficina-posto'+(mostrar===p.id?' selecionado':'')),mesa=texto('span','oficina-mesa'),rosto=texto('span','oficina-rosto '+(p.animacao||'respirar')),olhos=texto('span','oficina-olhos'),boca=texto('span','oficina-boca'),nome=texto('strong','',p.nome),funcao=texto('small','',p.funcao+' · '+tarefas.length+' missões'),selo=texto('span','oficina-selo',tarefas.length?'Em atividade':'Disponível');posto.type='button';posto.setAttribute('aria-pressed',String(mostrar===p.id));posto.setAttribute('aria-label','Filtrar missões de '+p.nome);rosto.append(olhos,boca);posto.append(mesa,rosto,nome,funcao,selo);posto.onclick=()=>{mostrar=mostrar===p.id?'todas':p.id;render()};palco.append(posto)});
if(!e.agentes.length)$('oficina-ajuda').textContent='Só o Chefinho está na oficina. Crie auxiliares na aba Equipe para abrir novos postos de trabalho.';else $('oficina-ajuda').textContent='Toque em um personagem para ver suas tarefas. Os personagens representam apenas os dados locais, sem IA conectada.';
const fila=$('oficina-fila');fila.replaceChildren();const visiveis=lista.filter(m=>mostrar==='todas'||m.responsavel===mostrar).sort((a,b)=>(a.etapa==='concluida')-(b.etapa==='concluida')||(b.alterada||b.criada||0)-(a.alterada||a.criada||0));
if(!visiveis.length)fila.append(texto('p','oficina-vazio','Nenhuma missão para este posto. Crie uma na aba Missões.'));
visiveis.forEach(m=>{const card=texto('button','oficina-tarefa'+(selecionado===m.id?' ativa':'')),rotulo=texto('small','',({fila:'A preparar',fazendo:'Produzindo',revisao:'Revisando',concluida:'Concluída'})[m.etapa]),titulo=texto('strong','',m.titulo);card.type='button';card.append(rotulo,titulo);card.onclick=()=>{selecionado=m.id;render()};fila.append(card)});
const detalhe=$('oficina-detalhe');detalhe.replaceChildren();const m=lista.find(x=>x.id===selecionado);if(!m){detalhe.append(texto('p','','Selecione uma missão para acompanhar o trabalho e alterar seu andamento.'));return}
detalhe.append(texto('h3','',m.titulo),texto('p','','Estado: '+({fila:'A preparar',fazendo:'Em produção',revisao:'Em revisão',concluida:'Concluída'})[m.etapa]));
const linha=texto('div','oficina-acoes');const criarBotao=(nome,fn)=>{const b=texto('button','secundario',nome);b.type='button';b.onclick=fn;linha.append(b)};
const i=ETAPAS.indexOf(m.etapa);if(i>0)criarBotao('← Etapa anterior',()=>atualizarMissao(m.id,{etapa:ETAPAS[i-1]}));if(i<3)criarBotao('Avançar etapa →',()=>atualizarMissao(m.id,{etapa:ETAPAS[i+1]}));detalhe.append(linha);
const label=texto('label','','Atribuir a'),sel=texto('select');pessoas.forEach(p=>{const op=texto('option','',p.nome);op.value=p.id;sel.append(op)});sel.value=m.responsavel;sel.onchange=()=>atualizarMissao(m.id,{responsavel:sel.value});label.append(sel);detalhe.append(label);
const barra=texto('div','oficina-progresso');barra.setAttribute('role','progressbar');barra.setAttribute('aria-valuemin','0');barra.setAttribute('aria-valuemax','100');barra.setAttribute('aria-valuenow',String(i*100/3));const preenchimento=texto('span');preenchimento.style.width=(i*100/3)+'%';barra.append(preenchimento);detalhe.append(barra);
}
$('oficina-limpar-filtro').addEventListener('click',()=>{mostrar='todas';render()});
document.querySelector('[data-aba="oficina"]').addEventListener('click',render);
window.addEventListener('flow:missoes-atualizadas',render);
window.addEventListener('storage',ev=>{if([CHAVE,EQUIPE].includes(ev.key))render()});
render();
})();