/* Equipe Flow: perfis locais demonstrativos; nenhum envio a IA externa. */
(function(){
'use strict';
const CHAVE='ander-flow-equipe-v1';
const FUNCOES=[['Pesquisa','Pipoca'],['Design','Lumi'],['Programacao','Byte'],['Seguranca','Escudinho'],['Testes','Tico'],['Dados','Nuvem']];
const ler=()=>{try{const v=JSON.parse(localStorage.getItem(CHAVE));return v&&v.versao===1&&Array.isArray(v.agentes)?v:null;}catch{return null;}};
let estado=ler();
const salvar=()=>{try{localStorage.setItem(CHAVE,JSON.stringify(estado));}catch{aviso('Não foi possível salvar neste navegador.');}};
const limpar=s=>String(s||'').trim().slice(0,60);
const escapar=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const raiz=document.createElement('section');raiz.id='flow-equipe';raiz.setAttribute('aria-label','Equipe e conversas');
raiz.innerHTML='<div class="flow-acoes"><button type="button" data-aba="equipe">Equipe</button><button type="button" data-aba="conversas">Conversas</button></div><div class="flow-janela" hidden><header><strong id="flow-titulo">Equipe</strong><button type="button" id="flow-fechar" aria-label="Fechar painel">×</button></header><div id="flow-conteudo"></div></div>';
document.body.appendChild(raiz);
const janela=raiz.querySelector('.flow-janela'),conteudo=raiz.querySelector('#flow-conteudo');
let aba='equipe',editar=null;
function aviso(msg){const el=raiz.querySelector('#flow-aviso');if(el)el.textContent=msg;}
function abrir(destino){aba=destino;janela.hidden=false;render();}
function fechar(){janela.hidden=true;}
raiz.querySelectorAll('[data-aba]').forEach(b=>b.addEventListener('click',()=>abrir(b.dataset.aba)));
raiz.querySelector('#flow-fechar').addEventListener('click',fechar);
function render(){
if(!estado){janela.hidden=false;raiz.querySelector('#flow-titulo').textContent='Conheça seu Chefinho';conteudo.innerHTML='<p>Comece com um orquestrador fixo. Nenhum agente auxiliar será criado automaticamente.</p><form id="flow-inicio"><label>Nome do orquestrador<input name="nome" maxlength="60" placeholder="Chefinho"></label><label>Personalidade<textarea name="personalidade" maxlength="240" placeholder="Gentil, curioso e organizado"></textarea></label><button>Começar minha equipe</button></form>';conteudo.querySelector('form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);estado={versao:1,orquestrador:{nome:limpar(f.get('nome'))||'Chefinho',personalidade:limpar(f.get('personalidade'))||'Gentil e organizado'},agentes:[],mensagens:[]};salvar();render();};return;}
raiz.querySelector('#flow-titulo').textContent=aba==='equipe'?'Minha equipe':'Conversas pelo orquestrador';
if(aba==='equipe')equipe();else conversas();
}
function equipe(){
const o=estado.orquestrador;
conteudo.innerHTML='<div class="flow-chefe"><span class="flow-rosto" aria-hidden="true">◕‿◕</span><div><strong>'+escapar(o.nome)+'</strong><small>Orquestrador fixo · '+escapar(o.personalidade)+'</small></div></div><button type="button" id="flow-editar-chefe">Personalizar Chefinho</button><h3>Agentes auxiliares ('+estado.agentes.length+')</h3><div class="flow-agentes">'+(estado.agentes.length?estado.agentes.map(a=>'<article><span class="flow-rosto" aria-hidden="true">•ᴗ•</span><div><strong>'+escapar(a.nome)+'</strong><small>'+escapar(a.funcao)+' · '+escapar(a.personalidade)+'</small></div><button data-editar="'+a.id+'">Editar</button><button data-excluir="'+a.id+'">Excluir</button></article>').join(''):'<p>Seu time começa vazio. Crie o primeiro agente quando quiser.</p>')+'</div><button id="flow-novo">+ Criar agente</button><div id="flow-formulario"></div><p id="flow-aviso" role="status"></p>';
conteudo.querySelector('#flow-editar-chefe').onclick=()=>formulario('chefe');
conteudo.querySelector('#flow-novo').onclick=()=>formulario('novo');
conteudo.querySelectorAll('[data-editar]').forEach(b=>b.onclick=()=>formulario(b.dataset.editar));
conteudo.querySelectorAll('[data-excluir]').forEach(b=>b.onclick=()=>{const id=b.dataset.excluir;estado.agentes=estado.agentes.filter(a=>a.id!==id);salvar();render();});
}
function formulario(id){
editar=id;const chefe=id==='chefe',novo=id==='novo',a=chefe?estado.orquestrador:novo?{nome:'',funcao:'Pesquisa',personalidade:'Curioso e prestativo'}:estado.agentes.find(a=>a.id===id);if(!a)return;
const alvo=conteudo.querySelector('#flow-formulario');
alvo.innerHTML='<form id="flow-form"><h3>'+(chefe?'Personalizar orquestrador':novo?'Novo agente':'Editar agente')+'</h3>'+(!chefe?'<label>Função<select name="funcao">'+FUNCOES.map(([f])=>'<option '+(a.funcao===f?'selected':'')+'>'+f+'</option>').join('')+'</select></label>':'')+'<label>Nome<input name="nome" maxlength="60" required value="'+escapar(a.nome)+'"></label><label>Personalidade<textarea name="personalidade" maxlength="240">'+escapar(a.personalidade)+'</textarea></label><button>Salvar alterações</button><button type="button" id="flow-cancelar">Cancelar</button></form>';
if(novo){const sel=alvo.querySelector('select'),nome=alvo.querySelector('[name=nome]');sel.onchange=()=>{nome.value=FUNCOES.find(([f])=>f===sel.value)?.[1]||'';};sel.onchange();}
alvo.querySelector('#flow-cancelar').onclick=()=>alvo.replaceChildren();
alvo.querySelector('form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),dados={nome:limpar(f.get('nome'))||'Chefinho',personalidade:limpar(f.get('personalidade'))||'Gentil',...(!chefe?{funcao:limpar(f.get('funcao'))}:{})};if(chefe)estado.orquestrador=dados;else if(novo)estado.agentes.push({...dados,id:'a'+Date.now().toString(36)+Math.random().toString(36).slice(2,7)});else Object.assign(a,dados);salvar();render();};
}
function conversas(){
conteudo.innerHTML='<p class="flow-nota">Demonstração local. Todas as mensagens passam pelo orquestrador; nenhuma IA externa é chamada.</p><div class="flow-historico" aria-live="polite">'+(estado.mensagens.length?estado.mensagens.slice(-30).map(m=>'<article><small>'+escapar(m.origem)+' → '+escapar(m.destino)+'</small><p>'+escapar(m.texto)+'</p></article>').join(''):'<p>Sem mensagens ainda. Converse com seu orquestrador.</p>')+'</div><form id="flow-enviar"><label>Destinatário<select name="destino"><option value="chefe">'+escapar(estado.orquestrador.nome)+'</option>'+estado.agentes.map(a=>'<option value="'+a.id+'">'+escapar(a.nome)+'</option>').join('')+'</select></label><label>Mensagem<textarea name="texto" required maxlength="1000" placeholder="Escreva sua missão..."></textarea></label><button>Enviar pelo orquestrador</button></form><p id="flow-aviso" role="status"></p>';
conteudo.querySelector('form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),texto=limparTexto(f.get('texto')),id=f.get('destino');if(!texto)return;const destino=id==='chefe'?estado.orquestrador.nome:estado.agentes.find(a=>a.id===id)?.nome;if(!destino)return;estado.mensagens.push({origem:'Você',destino:estado.orquestrador.nome,texto});if(id!=='chefe')estado.mensagens.push({origem:estado.orquestrador.nome,destino,texto:'Encaminhamento local: '+texto});estado.mensagens=estado.mensagens.slice(-100);salvar();render();};
}
function limparTexto(s){return String(s||'').trim().slice(0,1000);}
if(!estado)abrir('equipe');
})();