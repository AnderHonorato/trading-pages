(()=>{'use strict';
const MISSOES='ander-flow-missoes-v1',HISTORICO='ander-flow-historico-v1',MAXIMO=1000;
const ler=(chave,padrao)=>{try{return JSON.parse(localStorage.getItem(chave))??padrao}catch{return padrao}};
const lista=()=>{const d=ler(MISSOES,[]);return Array.isArray(d)?d.filter(m=>m&&typeof m.id==='string'&&typeof m.titulo==='string'):[]};
let anterior=new Map(lista().map(m=>[m.id,{...m}]));
function registrar(){const atual=lista(),novos=new Map(atual.map(m=>[m.id,{...m}])),eventos=[];
for(const m of atual){const velho=anterior.get(m.id);if(!velho){eventos.push({id:m.id,titulo:m.titulo,tipo:'criacao',descricao:'Missão criada',quando:Date.now()});continue}
for(const [campo,rotulo] of [['etapa','Etapa'],['responsavel','Responsável'],['prioridade','Prioridade'],['prazo','Prazo']])if((velho[campo]||'')!==(m[campo]||''))eventos.push({id:m.id,titulo:m.titulo,tipo:'alteracao',descricao:rotulo+': '+(velho[campo]||'não definido')+' → '+(m[campo]||'não definido'),quando:Date.now()})}
for(const [id,m] of anterior)if(!novos.has(id))eventos.push({id,titulo:m.titulo,tipo:'exclusao',descricao:'Missão excluída',quando:Date.now()});
anterior=novos;if(!eventos.length)return;
try{const antigos=ler(HISTORICO,[]),validos=Array.isArray(antigos)?antigos:[];localStorage.setItem(HISTORICO,JSON.stringify([...validos,...eventos].slice(-MAXIMO)));window.dispatchEvent(new Event('flow:historico-atualizado'))}catch{console.warn('Histórico local indisponível: armazenamento cheio ou bloqueado')}}
window.addEventListener('flow:missoes-atualizadas',registrar);
window.addEventListener('storage',e=>{if(e.key===MISSOES)registrar()});
})();
