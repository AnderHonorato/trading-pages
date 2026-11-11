/* Ander Flow — equipe personalizavel e mensagens mediadas pelo orquestrador.
   Este modulo e uma simulacao LOCAL, nao faz chamadas a modelos de IA. */
(()=>{
'use strict';
const api=window.AgentesOrbitais;
const arena=document.getElementById('ao-root');
if(!api||!arena)return;
const CHAVE='anderflow.equipe.v1';
const papeis=[
 {tipo:'analise',indice:1,nome:'Lupinha',funcao:'Analise',cor:'#9d7bff',simbolo:'M12 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm5.5 14.5L22 22',texto:'Investiguei os sinais e preparei um resumo para o Chefinho.'},
 {tipo:'execucao',indice:2,nome:'Foguetinho',funcao:'Execucao',cor:'#ff996a',simbolo:'M5 16l-2 5 5-2M13 3c4 0 7 3 8 8l-8 8-8-8 8-8zm-3 8h.1M3 13l-1 5 5-1',texto:'A tarefa foi recebida e entrou na fila de execucao.'},
 {tipo:'seguranca',indice:3,nome:'Escudinho',funcao:'Seguranca',cor:'#55c7c4',simbolo:'M12 2l9 4v6c0 6-4 9-9 11C7 21 3 18 3 12V6l9-4z',texto:'Verifiquei os riscos e registrei os cuidados para o Chefinho.'},
 {tipo:'monitoramento',indice:4,nome:'Farolinho',funcao:'Monitoramento',cor:'#f6bc62',simbolo:'M12 4v2M4 12H2m20 0h-2M5 5l2 2m12-2l-2 2M7 16v-5a5 5 0 0 1 10 0v5H7zm-2 4h14',texto:'Estou de olho nos eventos; avisei o Chefinho sobre o andamento.'},
 {tipo:'estrategia',indice:5,nome:'Corujinha',funcao:'Estrategia',cor:'#c9a6ff',simbolo:'M3 20V8l4-5 5 3 5-3 4 5v12M6 12h12M8 11a1 1 0 1 0 2 0m4 0a1 1 0 1 0 2 0M10 16l2 2 2-2',texto:'Organizei as prioridades e enviei minha sugestao ao Chefinho.'},
 {tipo:'interface',indice:6,nome:'Pixelzinho',funcao:'Interface',cor:'#f18cf7',simbolo:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',texto:'Preparei uma proposta visual e mandei para o Chefinho revisar.'},
 {tipo:'observacao',indice:7,nome:'Espiadinha',funcao:'Observacao',cor:'#87bafa',simbolo:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',texto:'Observei as mudancas e encaminhei os achados ao Chefinho.'},
 {tipo:'suporte',indice:18,nome:'Abracinho',funcao:'Suporte',cor:'#65d9ac',simbolo:'M12 21s-9-5.5-9-12a5 5 0 0 1 9-2.5A5 5 0 0 1 21 9c0 6.5-9 12-9 12z',texto:'Estou ajudando a organizar as pendencias; contei tudo ao Chefinho.'}
];
const porTipo=tipo=>papeis.find(p=>p.tipo===tipo);
const limpar=s=>String(s||'').trim().slice(0,250);
const seguro=(texto,padrao,tamanho=32)=>limpar(texto).slice(0,tamanho)||padrao;
let equipe=null;
try{const dado=JSON.parse(localStorage.getItem(CHAVE)||'null');if(dado&&dado.versao===1&&Array.isArray(dado.agentes)){
  equipe={versao:1,orquestrador:{nome:seguro(dado.orquestrador?.nome,'Chefinho'),personalidade:seguro(dado.orquestrador?.personalidade,'Gentil, organizado e prestativo.',220)},
  agentes:dado.agentes.filter(a=>porTipo(a.tipo)).map(a=>({tipo:a.tipo,nome:seguro(a.nome,porTipo(a.tipo).nome),personalidade:seguro(a.personalidade,'Prestativo e curioso.',220),animacao:['flutuar','pular','girar','piscar'].includes(a.animacao)?a.animacao:'flutuar'})).filter((a,i,arr)=>arr.findIndex(x=>x.tipo===a.tipo)===i),
  mensagens:Array.isArray(dado.mensagens)?dado.mensagens.slice(-100):[]};
}}catch(_){}
const novo=!equipe;
if(!equipe)equipe={versao:1,orquestrador:{nome:'Chefinho',personalidade:'Gentil, organizado e prestativo.'},agentes:[],mensagens:[]};
function guardar(){try{localStorage.setItem(CHAVE,JSON.stringify(equipe));}catch(_){aviso('Armazenamento indisponivel: as alteracoes podem nao permanecer.');}}
function avatar(tipo,animacao='flutuar'){
 const p=porTipo(tipo);
 const el=document.createElement('span');el.className='flow-avatar flow-avatar--'+animacao;
 el.style.setProperty('--flow-cor',p?p.cor:'#9a73ff');
 el.innerHTML='<span class="flow-avatar-acessorio"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(p?p.simbolo:'M5 8l3-5 4 4 4-4 3 5v9H5z')+'"/></svg></span><span class="flow-avatar-olhos"><i></i><i></i></span><span class="flow-avatar-boca"></span>';
 el.setAttribute('aria-hidden','true');return el;
}
function aviso(texto){const alvo=document.getElementById('flow-aviso');if(alvo){alvo.textContent=texto;alvo.hidden=false;}}
function sincronizar(){
 api.desligarTodos();
 api.config.nucleo.titulo=equipe.orquestrador.nome;
 api.config.fluxos=[];api.config.eventos.passe=0;
 equipe.agentes.forEach(a=>{const p=porTipo(a.tipo);api.configurarAgente(p.indice,{nome:a.nome,papel:p.funcao,status:'Aguardando recados do orquestrador',personalidade:a.personalidade});api.ativar(a.nome);});
 if(window.FlowMissoes?.atualizar)window.FlowMissoes.atualizar();
}
const botoes=document.createElement('nav');botoes.id='flow-atalhos';botoes.setAttribute('aria-label','Equipe e conversas');
botoes.innerHTML='<button type="button" id="flow-abrir-equipe">✦ Equipe <b id="flow-qtd">0</b></button><button type="button" id="flow-abrir-conversa">◉ Conversas</button>';
document.body.append(botoes);
const fixo=document.createElement('div');fixo.id='flow-orquestrador-fixo';fixo.setAttribute('aria-label','Orquestrador fixo');
const etiqueta=document.createElement('span');etiqueta.className='flow-orq-nome';fixo.append(avatar('orq','flutuar'),etiqueta);arena.append(fixo);
const modal=document.createElement('dialog');modal.id='flow-modal';modal.setAttribute('aria-labelledby','flow-modal-titulo');
modal.innerHTML='<header class="flow-modal-cabecalho"><div><small>ANDER FLOW • EQUIPE VIVA</small><h2 id="flow-modal-titulo">Minha equipe</h2></div><button type="button" id="flow-equipe-fechar" aria-label="Fechar">×</button></header><div class="flow-abas" role="group" aria-label="Secoes"><button type="button" data-aba="equipe" aria-pressed="true">Agentes</button><button type="button" data-aba="conversas" aria-pressed="false">Conversas</button></div><div id="flow-aba-equipe"></div><div id="flow-aba-conversas" hidden></div><p id="flow-aviso" role="status" hidden></p>';
document.body.append(modal);
const inicio=document.createElement('dialog');inicio.id='flow-inicio';inicio.setAttribute('aria-labelledby','flow-inicio-titulo');
inicio.innerHTML='<form method="dialog" id="flow-form-inicio"><div class="flow-boas-vindas"><div id="flow-avatar-boas"></div><small>SUA EQUIPE COMECA AQUI</small><h2 id="flow-inicio-titulo">Como vamos chamar quem comanda tudo?</h2><p>O orquestrador fica no centro e recebe todos os recados. Os ajudantes so aparecem quando voce os criar.</p></div><label>Nome do orquestrador<input id="flow-nome-inicial" maxlength="32" autocomplete="off" placeholder="Chefinho"></label><label>Personalidade<input id="flow-personalidade-inicial" maxlength="220" placeholder="Gentil, organizado e prestativo"></label><button class="flow-principal" type="submit">Criar meu orquestrador</button><small>Se deixar em branco, ele se chamara Chefinho. Nenhum ajudante sera criado automaticamente.</small></form>';
document.body.append(inicio);inicio.querySelector('#flow-avatar-boas').append(avatar('orq'));
inicio.addEventListener('cancel',e=>e.preventDefault());
function abrir(aba='equipe'){modal.showModal();trocarAba(aba);}
function fechar(){modal.close();}
function atualizarCabecalho(){etiqueta.textContent=equipe.orquestrador.nome;botoes.querySelector('#flow-qtd').textContent=equipe.agentes.length;fixo.setAttribute('aria-label','Orquestrador '+equipe.orquestrador.nome);}
function trocarAba(aba){modal.querySelectorAll('[data-aba]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.aba===aba)));document.getElementById('flow-aba-equipe').hidden=aba!=='equipe';document.getElementById('flow-aba-conversas').hidden=aba!=='conversas';modal.querySelector('#flow-modal-titulo').textContent=aba==='equipe'?'Minha equipe':'Conversas com '+equipe.orquestrador.nome;if(aba==='equipe')renderizarEquipe();else renderizarConversa();}
botoes.querySelector('#flow-abrir-equipe').addEventListener('click',()=>abrir('equipe'));botoes.querySelector('#flow-abrir-conversa').addEventListener('click',()=>abrir('conversas'));
modal.querySelector('#flow-equipe-fechar').addEventListener('click',fechar);
modal.querySelectorAll('[data-aba]').forEach(b=>b.addEventListener('click',()=>trocarAba(b.dataset.aba)));
inicio.querySelector('form').addEventListener('submit',e=>{e.preventDefault();equipe.orquestrador.nome=seguro(inicio.querySelector('#flow-nome-inicial').value,'Chefinho');equipe.orquestrador.personalidade=seguro(inicio.querySelector('#flow-personalidade-inicial').value,'Gentil, organizado e prestativo.',220);guardar();sincronizar();atualizarCabecalho();inicio.close();abrir('equipe');});
function elemento(tag,classe,conteudo){const e=document.createElement(tag);if(classe)e.className=classe;if(conteudo!=null)e.textContent=conteudo;return e;}
function acao(rotulo,fn,classe=''){const b=elemento('button',classe,rotulo);b.type='button';b.addEventListener('click',fn);return b;}
let editando=null;
function renderizarEquipe(){
 const pagina=document.getElementById('flow-aba-equipe');pagina.replaceChildren();
 const lider=elemento('div','flow-ficha flow-ficha-lider');lider.append(avatar('orq'));
 const info=elemento('div','flow-ficha-info');info.append(elemento('strong','',equipe.orquestrador.nome),elemento('small','','Orquestrador fixo • recebe e distribui todos os recados'));lider.append(info,acao('Editar',()=>editar('orq')));
 pagina.append(lider);
 const titulo=elemento('div','flow-secao-titulo');titulo.append(elemento('h3','', 'Agentes auxiliares ('+equipe.agentes.length+')'),acao('+ Criar agente',()=>editar(null),'flow-principal'));pagina.append(titulo);
 if(!equipe.agentes.length)pagina.append(elemento('p','flow-vazio','Sua equipe comeca vazia. Crie o primeiro ajudante, escolha a funcao, nome e personalidade.'));
 const grade=elemento('div','flow-grade');equipe.agentes.forEach(a=>{
  const p=porTipo(a.tipo),card=elemento('article','flow-ficha');card.append(avatar(a.tipo,a.animacao));
  const texto=elemento('div','flow-ficha-info');texto.append(elemento('strong','',a.nome),elemento('small','',p.funcao+' • '+a.personalidade));card.append(texto);
  const botoes=elemento('div','flow-ficha-acoes');botoes.append(acao('Editar',()=>editar(a.tipo)),acao('Falar',()=>{trocarAba('conversas');document.getElementById('flow-destino').value=a.tipo;}));
  card.append(botoes);grade.append(card);
 });pagina.append(grade);
 if(editando!==undefined&&editando!==null){formulario(editando,pagina);}
}
function editar(tipo){editando=tipo===null?'novo':tipo;renderizarEquipe();}
function formulario(tipo,pagina){
 const a=tipo==='orq'?equipe.orquestrador:equipe.agentes.find(x=>x.tipo===tipo),p=tipo==='orq'?null:porTipo(tipo);
 const form=elemento('form','flow-formulario');form.id='flow-formulario';form.append(elemento('h3','',tipo==='novo'?'Novo agente':tipo==='orq'?'Personalizar orquestrador':'Editar agente'));
 const campo=(rotulo,entrada)=>{const label=elemento('label','',rotulo);label.append(entrada);form.append(label);return entrada;};
 const tipoSelect=document.createElement('select');
 if(tipo==='novo'){
  const livres=papeis.filter(p=>!equipe.agentes.some(a=>a.tipo===p.tipo));
  livres.forEach(p=>{const o=document.createElement('option');o.value=p.tipo;o.textContent=p.funcao+' — '+p.nome;tipoSelect.append(o);});
  if(!livres.length){form.append(elemento('p','', 'Todos os perfis disponiveis ja foram criados.'));form.append(acao('Fechar',()=>{editando=null;renderizarEquipe();}));pagina.append(form);return;}
  campo('Funcao do agente',tipoSelect);
 }else if(p)form.append(elemento('p','flow-cargo','Funcao: '+p.funcao));
 const nome=document.createElement('input');nome.maxLength=32;nome.required=false;nome.placeholder=tipo==='orq'?'Chefinho':(p?.nome||papeis.find(x=>x.tipo===tipoSelect.value)?.nome||'Nome opcional');nome.value=a?.nome||'';campo('Nome (opcional)',nome);
 const pers=document.createElement('textarea');pers.maxLength=220;pers.rows=3;pers.placeholder='Ex.: curioso, brincalhao, cuidadoso e objetivo';pers.value=a?.personalidade||'';campo('Personalidade e jeito de falar',pers);
 const anim=document.createElement('select');[['flutuar','Flutuar suavemente'],['pular','Pulinho animado'],['girar','Giro delicado'],['piscar','Piscar e observar']].forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.textContent=l;anim.append(o);});anim.value=a?.animacao||'flutuar';if(tipo!=='orq')campo('Animacao do icone',anim);
 const rodape=elemento('div','flow-form-botoes');rodape.append(acao('Cancelar',()=>{editando=null;renderizarEquipe();}));
 if(tipo!=='novo'&&tipo!=='orq')rodape.append(acao('Excluir',()=>{equipe.agentes=equipe.agentes.filter(x=>x.tipo!==tipo);editando=null;guardar();sincronizar();renderizarEquipe();atualizarCabecalho();},'flow-perigo'));
 const salvar=elemento('button','flow-principal','Salvar');salvar.type='submit';rodape.append(salvar);form.append(rodape);
 form.addEventListener('submit',e=>{
  e.preventDefault();const papel=tipo==='novo'?porTipo(tipoSelect.value):p,antigo=tipo==='novo'?null:a;
  const item={tipo:papel?.tipo,nome:seguro(nome.value,tipo==='orq'?'Chefinho':papel.nome),personalidade:seguro(pers.value,'Prestativo, gentil e curioso.',220),animacao:anim.value};
  if(tipo==='orq'){equipe.orquestrador.nome=item.nome;equipe.orquestrador.personalidade=item.personalidade;}
  else if(tipo==='novo')equipe.agentes.push(item);else Object.assign(antigo,item);
  editando=null;guardar();sincronizar();atualizarCabecalho();renderizarEquipe();
 });pagina.append(form);form.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function registrar(de,para,texto){
 equipe.mensagens.push({de,para,texto:seguro(texto,'',500),hora:new Date().toISOString()});
 equipe.mensagens=equipe.mensagens.slice(-100);guardar();
}
function recado(texto,destino='todos'){
 const msg=seguro(texto,'',500);if(!msg)return false;
 const chefe=equipe.orquestrador.nome;
 const alvos=destino==='todos'?equipe.agentes:equipe.agentes.filter(a=>a.tipo===destino);
 registrar('Voce',chefe,msg);
 if(!alvos.length){registrar(chefe,'Voce','Recebi seu recado. Ainda nao ha auxiliares nesse destino.');return true;}
 alvos.forEach(a=>{const p=porTipo(a.tipo);
  registrar(chefe,a.nome,'Mensagem encaminhada: '+msg);
  registrar(a.nome,chefe,p.texto);
 });
 registrar(chefe,'Voce','Encaminhei para '+alvos.map(a=>a.nome).join(', ')+'. Cada resposta voltou primeiro para mim.');
 return true;
}
function renderizarConversa(){
 const pagina=document.getElementById('flow-aba-conversas');pagina.replaceChildren();
 const dica=elemento('p','flow-nota','Tudo passa pelo orquestrador. Nenhum agente conversa diretamente com outro. Respostas demonstrativas locais, sem IA conectada.');pagina.append(dica);
 const historico=elemento('div','flow-mensagens');historico.id='flow-mensagens';historico.setAttribute('aria-live','polite');
 if(!equipe.mensagens.length)historico.append(elemento('p','flow-vazio','Envie um recado ao Chefinho. Ele distribuirá e reunirá as respostas da equipe.'));
 equipe.mensagens.forEach(m=>{const item=elemento('article','flow-mensagem');item.classList.toggle('flow-mensagem-voce',m.de==='Voce');item.append(elemento('small','',m.de+' → '+m.para),elemento('p','',m.texto));historico.append(item);});pagina.append(historico);
 const form=elemento('form','flow-enviar');const selecao=document.createElement('select');selecao.id='flow-destino';
 let o=document.createElement('option');o.value='todos';o.textContent='Recado para todos';selecao.append(o);
 equipe.agentes.forEach(a=>{const opt=document.createElement('option');opt.value=a.tipo;opt.textContent='Via '+equipe.orquestrador.nome+' → '+a.nome;selecao.append(opt);});
 const campo=document.createElement('textarea');campo.id='flow-texto';campo.rows=2;campo.maxLength=500;campo.placeholder='Escreva para '+equipe.orquestrador.nome+'...';
 const botao=elemento('button','flow-principal','Enviar recado');botao.type='submit';form.append(selecao,campo,botao);
 form.addEventListener('submit',e=>{e.preventDefault();const destino=selecao.value;if(!recado(campo.value,destino))return;renderizarConversa();document.getElementById('flow-destino').value=destino;});
 pagina.append(form);historico.scrollTop=historico.scrollHeight;
}
sincronizar();atualizarCabecalho();
if(novo)inicio.showModal();
window.FlowEquipe={
 listar:()=>equipe.agentes.map(a=>({...a})),orquestrador:()=>({...equipe.orquestrador}),
 conversar:()=>abrir('conversas'),abrir:()=>abrir('equipe'),
 encaminhar:(de,para,texto)=>{const a=equipe.agentes.find(x=>x.nome===de),b=equipe.agentes.find(x=>x.nome===para);if(!a||!b)return false;
  const chefe=equipe.orquestrador.nome;registrar(a.nome,chefe,seguro(texto,'Pedido de encaminhamento'));registrar(chefe,b.nome,'Encaminhamento autorizado: '+seguro(texto,'Pedido de encaminhamento'));registrar(chefe,'Voce','Encaminhei a mensagem de '+a.nome+' para '+b.nome+'.');return true;},
 estado:()=>({iniciado:!novo,total:equipe.agentes.length,mensagens:equipe.mensagens.length})
};
})();