/* Central de Missoes local: nenhum comando e enviado a corretoras ou IAs externas. */
(() => {
  'use strict';
  const CHAVE = 'ander-flow-missoes-v1';
  const $ = (s, raiz=document) => raiz.querySelector(s);
  const gerarId = () => crypto.randomUUID?.() || String(Date.now()) + Math.random().toString(36).slice(2);
  const inicial = () => ({nome:'Chefinho', personalidade:'Acolhedor e organizado', equipe:[], missoes:[], historico:[], configurado:false});
  function carregar() {
    try {
      const valor=JSON.parse(localStorage.getItem(CHAVE));
      if (!valor || typeof valor!=='object') return inicial();
      return {...inicial(), ...valor, equipe:Array.isArray(valor.equipe)?valor.equipe:[], missoes:Array.isArray(valor.missoes)?valor.missoes:[], historico:Array.isArray(valor.historico)?valor.historico:[]};
    } catch { return inicial(); }
  }
  let estado=carregar();
  const salvar=()=>{localStorage.setItem(CHAVE,JSON.stringify(estado));window.dispatchEvent(new Event('flow:equipe-alterada'));};
  const escapar=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const funcoes=[['Pesquisa','Lupinha'],['Design','Pincelinho'],['Código','Codinho'],['Segurança','Escudinho'],['Testes','Testinho'],['Documentação','Letrinha']];
  const painel=document.createElement('section');
  painel.id='flow-central';
  painel.setAttribute('aria-label','Central de missões');
  painel.innerHTML=`<div class="flow-topo"><strong>Flow · Central de Missões</strong><button type="button" data-acao="fechar" aria-label="Fechar central">×</button></div><div class="flow-conteudo"></div>`;
  document.body.append(painel);
  const botoes=document.createElement('nav');
  botoes.id='flow-acoes';
  botoes.setAttribute('aria-label','Equipe e conversas');
  botoes.innerHTML='<button type="button" data-abrir="missoes">Missões</button><button type="button" data-abrir="equipe">Equipe</button><button type="button" data-abrir="conversas">Conversas</button>';
  document.body.append(botoes);
  let aba='missoes';
  let filtroMissoes='Todas';
  let buscaMissoes='';
  let detalhesAberto=null;
  const etapasDaMissao=m=>Array.isArray(m.etapas)?m.etapas:[];
  const progressoDaMissao=m=>{const etapas=etapasDaMissao(m);return etapas.length?Math.round(100*etapas.filter(e=>e.feita).length/etapas.length):(m.estado==='Concluída'?100:0);};
  function registrarAtividade(m,acao){m.atividade=Array.isArray(m.atividade)?m.atividade:[];m.atividade.unshift({acao,em:new Date().toISOString()});m.atividade=m.atividade.slice(0,40);}
  function filtrarMissoes(){return estado.missoes.filter(m=>(filtroMissoes==='Todas'||m.estado===filtroMissoes)&&(!buscaMissoes||[m.titulo,m.notas,estado.equipe.find(a=>a.id===m.responsavel)?.nome].some(v=>String(v||'').toLocaleLowerCase('pt-BR').includes(buscaMissoes.toLocaleLowerCase('pt-BR'))))).sort((a,b)=>({'Alta':0,'Normal':1,'Baixa':2}[a.prioridade||'Normal']??1)-({'Alta':0,'Normal':1,'Baixa':2}[b.prioridade||'Normal']??1));}
  function detalhesMissao(m){const etapas=etapasDaMissao(m);return `<section class="flow-detalhes" aria-label="Plano da missão"><div class="flow-progresso"><span style="width:${progressoDaMissao(m)}%"></span></div><small>${progressoDaMissao(m)}% das etapas · ${etapas.filter(e=>e.feita).length}/${etapas.length}</small><form data-form-etapa="${escapar(m.id)}"><input name="etapa" maxlength="120" required placeholder="Nova etapa da missão" aria-label="Descrição da etapa"><button type="submit">Adicionar etapa</button></form><ul class="flow-etapas">${etapas.map(e=>`<li><label><input type="checkbox" data-marcar-etapa="${escapar(m.id)}" data-etapa="${escapar(e.id)}" ${e.feita?'checked':''}><span>${escapar(e.texto)}</span></label><button type="button" data-excluir-etapa="${escapar(m.id)}" data-etapa="${escapar(e.id)}" aria-label="Remover etapa">×</button></li>`).join('')}</ul><label>Prazo<input type="date" data-prazo="${escapar(m.id)}" value="${escapar(m.prazo||'')}"></label><label>Responsável<select data-responsavel="${escapar(m.id)}"><option value="">${escapar(estado.nome)}</option>${estado.equipe.map(a=>`<option value="${escapar(a.id)}" ${a.id===m.responsavel?'selected':''}>${escapar(a.nome)}</option>`).join('')}</select></label><h3>Histórico da missão</h3><ol class="flow-historico">${(m.atividade||[]).slice(0,8).map(a=>`<li>${escapar(a.acao)} <small>${escapar(new Date(a.em).toLocaleString('pt-BR'))}</small></li>`).join('')}</ol></section>`;}

  function cabecalho() {return `<div class="flow-chefe"><span class="flow-rosto" aria-hidden="true"><i></i><i></i><b>ᴗ</b></span><div><strong>${escapar(estado.nome)}</strong><small>Orquestrador fixo · ${escapar(estado.personalidade)}</small></div><button type="button" data-acao="editar-chefe">Editar</button></div>`;}
  function renderizar() {
    const raiz=$('.flow-conteudo',painel);
    if (!estado.configurado) {
      raiz.innerHTML=`<div class="flow-intro"><div class="flow-mascote" aria-hidden="true">◕‿◕</div><h2>Conheça seu orquestrador</h2><p>Comece sem agentes auxiliares. Você escolhe quem entra na equipe.</p><form id="flow-onboarding"><label>Nome<input name="nome" maxlength="40" placeholder="Chefinho"></label><label>Personalidade<textarea name="personalidade" maxlength="160" rows="2" placeholder="Acolhedor e organizado"></textarea></label><button type="submit">Começar</button></form></div>`;
      return;
    }
    const abas='<div class="flow-abas"><button data-aba="missoes">Missões</button><button data-aba="equipe">Equipe</button><button data-aba="conversas">Conversas</button></div>';
    let corpo='';
    if (aba==='missoes') {
      corpo=`<h2>Quadro vivo de missões</h2><div class="flow-resumo" aria-live="polite"><span><b>${estado.missoes.filter(m=>m.estado==='A fazer').length}</b> A fazer</span><span><b>${estado.missoes.filter(m=>m.estado==='Em andamento').length}</b> Em andamento</span><span><b>${estado.missoes.filter(m=>m.estado==='Concluída').length}</b> Concluídas</span></div><form id="flow-nova-missao"><input name="titulo" required maxlength="100" placeholder="Qual é a próxima missão?" aria-label="Título da missão"><select name="prioridade" aria-label="Prioridade"><option value="Normal">Normal</option><option value="Alta">Alta</option><option value="Baixa">Baixa</option></select><select name="responsavel" aria-label="Responsável"><option value="">Chefinho</option>${estado.equipe.map(a=>`<option value="${escapar(a.id)}">${escapar(a.nome)}</option>`).join('')}</select><button type="submit">Criar missão</button></form><div class="flow-filtros" role="group" aria-label="Filtrar missões"><button type="button" data-filtro="Todas">Todas</button><button type="button" data-filtro="A fazer">A fazer</button><button type="button" data-filtro="Em andamento">Em andamento</button><button type="button" data-filtro="Concluída">Concluídas</button></div><label class="flow-busca">Buscar missões<input type="search" id="flow-busca" value="${escapar(buscaMissoes)}" placeholder="Título, notas ou responsável"></label><div class="flow-lista">${filtrarMissoes().length?filtrarMissoes().map(m=>`<article class="flow-item flow-missao" data-estado="${escapar(m.estado)}"><div><strong>${escapar(m.titulo)}</strong>${m.notas?'<p class="flow-notas">'+escapar(m.notas)+'</p>':''}<div class="flow-progresso" role="progressbar" aria-label="Progresso de ${escapar(m.titulo)}" aria-valuenow="${progressoDaMissao(m)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${progressoDaMissao(m)}%"></span></div><small>${m.prazo?`Prazo ${escapar(m.prazo)} · `:''}Prioridade ${escapar(m.prioridade||'Normal')} · ${escapar(m.estado)} · via ${escapar(estado.nome)} · ${escapar(estado.equipe.find(a=>a.id===m.responsavel)?.nome||estado.nome)}</small></div><div><button data-detalhes="${escapar(m.id)}" aria-expanded="${detalhesAberto===m.id}" aria-label="Abrir planejamento da missão">Planejar</button><button data-notas="${escapar(m.id)}" aria-label="Editar anotações da missão">Notas</button><button data-avancar="${escapar(m.id)}">${m.estado==='Concluída'?'Reabrir':'Avançar'}</button><button data-remover-missao="${escapar(m.id)}" aria-label="Excluir missão">×</button></div>${detalhesAberto===m.id?detalhesMissao(m):''}</article>`).join(''):'<p class="flow-vazio">Nenhuma missão encontrada. Ajuste os filtros ou crie uma missão.</p>'}</div>`;
    } else if(aba==='equipe') {
      corpo=`<h2>Sua equipe · ${estado.equipe.length} auxiliares</h2><p>Somente você cria agentes. Nenhum auxiliar aparece automaticamente.</p><form id="flow-novo-agente"><select name="funcao" aria-label="Função">${funcoes.map(f=>`<option value="${f[0]}">${f[0]} — ${f[1]}</option>`).join('')}</select><input name="nome" maxlength="40" placeholder="Nome opcional"><input name="personalidade" maxlength="120" placeholder="Personalidade opcional"><button type="submit">Adicionar agente</button></form><div class="flow-lista">${estado.equipe.length?estado.equipe.map(a=>`<article class="flow-item"><span class="flow-mini" aria-hidden="true">◕ᴗ◕</span><div><strong>${escapar(a.nome)}</strong><small>${escapar(a.funcao)} · ${escapar(a.personalidade)}</small></div><button data-editar="${escapar(a.id)}">Editar</button><button data-remover-agente="${escapar(a.id)}">Excluir</button></article>`).join(''):'<p class="flow-vazio">Só o Chefinho está aqui. Escolha uma função para começar.</p>'}</div>`;
    } else {
      corpo=`<h2>Conversas roteadas</h2><p>Todo recado passa pelo orquestrador. Mensagens locais são demonstrações, não respostas de IA.</p><form id="flow-recado"><select name="destino" aria-label="Destinatário"><option value="">Chefinho</option>${estado.equipe.map(a=>`<option value="${escapar(a.id)}">${escapar(a.nome)}</option>`).join('')}</select><input name="mensagem" maxlength="300" required placeholder="Escreva um recado"><button type="submit">Enviar</button></form><div class="flow-lista" aria-live="polite">${estado.historico.length?estado.historico.slice(-35).reverse().map(h=>`<article class="flow-item"><div><strong>${escapar(h.origem)} → ${escapar(h.via)} → ${escapar(h.destino)}</strong><p>${escapar(h.texto)}</p><small>Demonstração local · ${escapar(h.hora)}</small></div></article>`).join(''):'<p class="flow-vazio">Nenhuma conversa registrada.</p>'}</div>`;
    }
    raiz.innerHTML=cabecalho()+abas+corpo;
    $('[data-aba="'+aba+'"]',raiz)?.setAttribute('aria-current','page');
    $('[data-filtro="'+filtroMissoes+'"]',raiz)?.setAttribute('aria-pressed','true');
  }
  function registrar(destino,texto) {
    estado.historico.push({id:gerarId(),origem:'Você',via:estado.nome,destino,texto,hora:new Date().toLocaleString('pt-BR')});
    estado.historico=estado.historico.slice(-200); salvar();
  }
  function abrir(novaAba) {aba=novaAba||aba;renderizar();painel.classList.add('aberto');painel.querySelector('button').focus();}
  botoes.addEventListener('click',e=>{const botao=e.target.closest('[data-abrir]');if(botao)abrir(botao.dataset.abrir);});
  painel.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.acao==='fechar'){painel.classList.remove('aberto');return;}
    if(b.dataset.acao==='editar-chefe'){
      const nome=prompt('Nome do orquestrador',estado.nome);if(nome===null)return;
      const personalidade=prompt('Personalidade',estado.personalidade);if(personalidade===null)return;
      estado.nome=nome.trim().slice(0,40)||'Chefinho';estado.personalidade=personalidade.trim().slice(0,160)||'Acolhedor e organizado';salvar();renderizar();
    }
    if(b.dataset.aba){aba=b.dataset.aba;renderizar();}
    if(b.dataset.filtro){filtroMissoes=b.dataset.filtro;renderizar();}
    if(b.dataset.detalhes){detalhesAberto=detalhesAberto===b.dataset.detalhes?null:b.dataset.detalhes;renderizar();}
    if(b.dataset.excluirEtapa){const m=estado.missoes.find(x=>x.id===b.dataset.excluirEtapa);if(!m)return;m.etapas=etapasDaMissao(m).filter(x=>x.id!==b.dataset.etapa);registrarAtividade(m,'Etapa removida');salvar();renderizar();}
    if(b.dataset.notas){const m=estado.missoes.find(x=>x.id===b.dataset.notas);if(!m)return;const nota=prompt('Anotações da missão',m.notas||'');if(nota===null)return;m.notas=nota.trim().slice(0,2000);registrarAtividade(m,'Anotações atualizadas');salvar();renderizar();}
    if(b.dataset.avancar){const m=estado.missoes.find(x=>x.id===b.dataset.avancar);if(m){m.estado=({'A fazer':'Em andamento','Em andamento':'Concluída','Concluída':'A fazer'})[m.estado];registrarAtividade(m,'Estado: '+m.estado);salvar();renderizar();}}
    if(b.dataset.removerMissao){estado.missoes=estado.missoes.filter(m=>m.id!==b.dataset.removerMissao);salvar();renderizar();}
    if(b.dataset.removerAgente){if(!confirm('Excluir este agente auxiliar?'))return;estado.equipe=estado.equipe.filter(a=>a.id!==b.dataset.removerAgente);estado.missoes.forEach(m=>{if(m.responsavel===b.dataset.removerAgente)m.responsavel='';});salvar();renderizar();}
    if(b.dataset.editar){const a=estado.equipe.find(x=>x.id===b.dataset.editar);if(!a)return;const nome=prompt('Nome do agente',a.nome);if(nome===null)return;const personalidade=prompt('Personalidade do agente',a.personalidade);if(personalidade===null)return;a.nome=nome.trim().slice(0,40)||a.nome;a.personalidade=personalidade.trim().slice(0,120)||a.personalidade;salvar();renderizar();}
  });
  painel.addEventListener('submit',e=>{
    e.preventDefault();const form=e.target;const d=new FormData(form);
    if(form.dataset.formEtapa){const m=estado.missoes.find(x=>x.id===form.dataset.formEtapa);const texto=String(d.get('etapa')||'').trim().slice(0,120);if(m&&texto){m.etapas=etapasDaMissao(m);m.etapas.push({id:gerarId(),texto,feita:false});registrarAtividade(m,'Etapa adicionada: '+texto);salvar();renderizar();}return;}
    if(form.id==='flow-onboarding'){estado.nome=String(d.get('nome')||'').trim().slice(0,40)||'Chefinho';estado.personalidade=String(d.get('personalidade')||'').trim().slice(0,160)||'Acolhedor e organizado';estado.configurado=true;}
    if(form.id==='flow-novo-agente'){const funcao=String(d.get('funcao'));const padrao=funcoes.find(f=>f[0]===funcao)?.[1]||'Ajudante';estado.equipe.push({id:gerarId(),funcao,nome:String(d.get('nome')||'').trim().slice(0,40)||padrao,personalidade:String(d.get('personalidade')||'').trim().slice(0,120)||'Prestativo'});}
    if(form.id==='flow-nova-missao'){estado.missoes.unshift({id:gerarId(),titulo:String(d.get('titulo')).trim().slice(0,100),responsavel:String(d.get('responsavel')||''),estado:'A fazer',prioridade:String(d.get('prioridade')||'Normal'),notas:'',etapas:[],atividade:[{acao:'Missão criada',em:new Date().toISOString()}]});}
    if(form.id==='flow-recado'){const agente=estado.equipe.find(a=>a.id===d.get('destino'));registrar(agente?.nome||estado.nome,String(d.get('mensagem')).trim().slice(0,300));}
    salvar();renderizar();
  });
  painel.addEventListener('change',e=>{const el=e.target;if(el.dataset.marcarEtapa){const m=estado.missoes.find(x=>x.id===el.dataset.marcarEtapa);const etapa=etapasDaMissao(m||{}).find(x=>x.id===el.dataset.etapa);if(etapa){etapa.feita=el.checked;registrarAtividade(m,(el.checked?'Concluiu':'Reabriu')+' etapa: '+etapa.texto);salvar();renderizar();}}if(el.dataset.prazo){const m=estado.missoes.find(x=>x.id===el.dataset.prazo);if(m){m.prazo=el.value;registrarAtividade(m,'Prazo alterado');salvar();renderizar();}}if(el.dataset.responsavel){const m=estado.missoes.find(x=>x.id===el.dataset.responsavel);if(m){m.responsavel=el.value;registrarAtividade(m,'Responsável alterado via orquestrador');salvar();renderizar();}}});
  painel.addEventListener('input',e=>{if(e.target.id==='flow-busca'){buscaMissoes=e.target.value;const inicio=e.target.selectionStart;renderizar();const novo=$('#flow-busca',painel);novo?.focus();novo?.setSelectionRange(inicio,inicio);}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')painel.classList.remove('aberto');});
  if(!estado.configurado)abrir('equipe');
  window.FlowCentralMissoes={abrir,obterEstado:()=>structuredClone(estado)};
})();
