/* Sessao de foco local: cronometro persistente, sem servicos externos. */
(() => {
  'use strict';
  const CHAVE = 'ander-flow-foco-v1';
  const HIST = 'ander-flow-rotinas-historico-v1';
  const TAREFAS = 'ander-flow-rotinas-v1';
  const raiz = document.querySelector('#foco-guiado');
  if (!raiz) return;
  const ler = (chave, padrao) => { try { return JSON.parse(localStorage.getItem(chave) || 'null') ?? padrao; } catch { return padrao; } };
  const salvar = estado => { try { localStorage.setItem(CHAVE, JSON.stringify(estado)); return true; } catch { avisar('Armazenamento indisponível.'); return false; } };
  const agora = () => Date.now();
  const novo = () => ({ tarefa: '', duracao: 25, restante: 1500, ativo: false, inicio: null, ciclos: 0 });
  let estado = { ...novo(), ...ler(CHAVE, {}) };
  const elemento = (tag, classe, texto) => { const el = document.createElement(tag); if (classe) el.className = classe; if (texto !== undefined) el.textContent = texto; return el; };
  const cab = elemento('div', 'foco-cabecalho');
  const tit = elemento('div');
  tit.append(elemento('p', 'sobretitulo', 'ANDER FLOW / CONCENTRAÇÃO'), elemento('h2', '', 'Estúdio de Foco'));
  cab.append(tit, elemento('p', '', 'Escolha uma atividade, trabalhe em blocos e acompanhe seu progresso. Tudo permanece neste navegador.'));
  const corpo = elemento('div', 'foco-corpo');
  const controle = elemento('div', 'foco-controle');
  const rotulo = elemento('label', '', 'Atividade para focar');
  const escolha = elemento('select');
  escolha.id = 'foco-tarefa';
  rotulo.append(escolha);
  const duracaoLabel = elemento('label', '', 'Duração do bloco');
  const duracao = elemento('select');
  [[15,'15 minutos'],[25,'25 minutos'],[45,'45 minutos'],[60,'60 minutos']].forEach(([n,t]) => { const op = new Option(t,String(n)); duracao.add(op); });
  duracaoLabel.append(duracao);
  const relogio = elemento('div', 'foco-relogio', '25:00');
  relogio.setAttribute('role','timer');
  relogio.setAttribute('aria-label','Tempo restante da sessão');
  const barra = elemento('progress', 'foco-progresso');
  barra.max = 100;
  barra.value = 0;
  const status = elemento('p','foco-status');
  status.setAttribute('role','status');
  const acoes = elemento('div','foco-acoes');
  const iniciar = elemento('button','principal','Começar');
  const pausar = elemento('button','','Pausar');
  const zerar = elemento('button','','Reiniciar');
  [iniciar,pausar,zerar].forEach(b => { b.type='button'; acoes.append(b); });
  controle.append(rotulo,duracaoLabel,relogio,barra,status,acoes);
  const painel = elemento('div','foco-personagem');
  const rosto = elemento('div','foco-rosto');
  rosto.setAttribute('aria-hidden','true');
  rosto.append(elemento('span','foco-olho'),elemento('span','foco-olho'),elemento('span','foco-boca'));
  const fala = elemento('p','foco-fala');
  const ciclos = elemento('strong','foco-ciclos');
  painel.append(rosto,fala,ciclos);
  corpo.append(controle,painel);
  raiz.append(cab,corpo);
  function avisar(texto) { status.textContent = texto; }
  function tarefas() { return ler(TAREFAS,[]).filter(t => t && t.estado !== 'concluida'); }
  function atualizarOpcoes() {
    const anteriores = estado.tarefa;
    escolha.replaceChildren(new Option('Foco livre',''));
    tarefas().forEach(t => escolha.add(new Option(t.titulo, String(t.id))));
    escolha.value = [...escolha.options].some(o => o.value === String(anteriores)) ? String(anteriores) : '';
  }
  function segundos() {
    if (!estado.ativo || !estado.inicio) return estado.restante;
    return Math.max(0, estado.restante - Math.floor((agora()-estado.inicio)/1000));
  }
  function registrar() {
    const nome = tarefas().find(t => String(t.id) === String(estado.tarefa))?.titulo || 'foco livre';
    const hist = ler(HIST,[]);
    hist.push(new Date().toLocaleString('pt-BR') + ' · Chefinho: bloco de foco de ' + estado.duracao + ' min finalizado em ' + nome + ' (ação local).');
    try { localStorage.setItem(HIST,JSON.stringify(hist.slice(-60))); } catch { avisar('Bloco concluído; histórico não pôde ser salvo.'); }
    window.dispatchEvent(new Event('storage'));
  }
  function concluir() {
    estado.ciclos += 1;
    estado.ativo = false;
    estado.inicio = null;
    estado.restante = estado.duracao*60;
    salvar(estado);
    registrar();
    avisar('Bloco concluído! Faça uma pausa antes de começar outro.');
    desenhar();
  }
  function desenhar() {
    const s = segundos();
    if (estado.ativo && s === 0) { concluir(); return; }
    relogio.textContent = String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
    barra.value = Math.round(100*(1-s/(estado.duracao*60)));
    ciclos.textContent = estado.ciclos + (estado.ciclos===1?' bloco concluído':' blocos concluídos');
    painel.classList.toggle('em-foco',estado.ativo);
    fala.textContent = estado.ativo ? 'Chefinho está concentrado com você!' : 'Chefinho está pronto para a próxima missão.';
    iniciar.textContent = estado.ativo?'Em andamento':s<estado.duracao*60?'Retomar':'Começar';
    iniciar.disabled = estado.ativo;
    pausar.disabled = !estado.ativo;
    escolha.disabled = estado.ativo || s<estado.duracao*60;
    duracao.disabled = estado.ativo || s<estado.duracao*60;
  }
  iniciar.addEventListener('click', () => {
    if (estado.ativo) return;
    if (segundos() === estado.duracao*60) { estado.tarefa=escolha.value; estado.duracao=Number(duracao.value); estado.restante=estado.duracao*60; }
    estado.ativo=true; estado.inicio=agora();
    if (salvar(estado)) { avisar('Bloco iniciado.'); desenhar(); }
  });
  pausar.addEventListener('click', () => {
    estado.restante=segundos(); estado.ativo=false; estado.inicio=null;
    if(salvar(estado)){ avisar('Pausado. Você pode retomar depois.'); desenhar(); }
  });
  zerar.addEventListener('click', () => {
    estado.ativo=false; estado.inicio=null; estado.duracao=Number(duracao.value); estado.restante=estado.duracao*60;
    if(salvar(estado)){ avisar('Cronômetro reiniciado.'); desenhar(); }
  });
  duracao.addEventListener('change', () => { if(!estado.ativo){estado.duracao=Number(duracao.value);estado.restante=estado.duracao*60;salvar(estado);desenhar();} });
  window.addEventListener('storage', () => { estado={...novo(),...ler(CHAVE,{})}; atualizarOpcoes(); desenhar(); });
  atualizarOpcoes();
  duracao.value=String(estado.duracao);
  desenhar();
  setInterval(desenhar,1000);
})();
