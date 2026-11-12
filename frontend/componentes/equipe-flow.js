/* Equipe local demonstrativa — autoria Ander Flow. Sem chamadas externas. */
(() => {
  'use strict';
  const CHAVE = 'ander-flow-equipe-v1';
  const papeis = [
    { funcao:'Design', nome:'Pincelito', simbolo:'✿', cor:'#e9a7b9' },
    { funcao:'Programação', nome:'Codinho', simbolo:'⌘', cor:'#91c8b4' },
    { funcao:'Segurança', nome:'Escudinho', simbolo:'◆', cor:'#b6b0ec' },
    { funcao:'Pesquisa', nome:'Lupinha', simbolo:'◉', cor:'#f2c47f' },
    { funcao:'Testes', nome:'Testinho', simbolo:'✓', cor:'#9ac9e5' },
    { funcao:'Dados', nome:'Dadin', simbolo:'▦', cor:'#c6b4ed' }
  ];
  const novoEstado = () => ({ versao:1, iniciado:false, chefe:{ id:'chefe', nome:'Chefinho', personalidade:'Gentil, organizado e objetivo.' }, agentes:[], mensagens:[] });
  let estado;
  try {
    const lido = JSON.parse(localStorage.getItem(CHAVE) || 'null');
    estado = lido && lido.versao === 1 && Array.isArray(lido.agentes) && Array.isArray(lido.mensagens) ? lido : novoEstado();
  } catch { estado = novoEstado(); }
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch { aviso('Não foi possível salvar neste navegador.'); } };
  const escapar = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const raiz = document.createElement('section');
  raiz.id='equipe-flow';
  raiz.innerHTML = `<div class="ef-acoes"><button data-abrir="equipe">Equipe <span id="ef-contagem">0</span></button><button data-abrir="conversas">Conversas</button></div>
  <div class="ef-sombra" hidden><div class="ef-painel" role="dialog" aria-modal="true" aria-label="Equipe Flow">
  <header><div><small>ANDER FLOW · CENTRAL VIVA</small><h2 id="ef-titulo">Sua equipe</h2></div><button id="ef-fechar" aria-label="Fechar">×</button></header>
  <div class="ef-abas"><button data-aba="equipe">Equipe</button><button data-aba="conversas">Conversas</button></div>
  <div id="ef-corpo"></div><p class="ef-aviso" role="status" aria-live="polite"></p></div></div>`;
  document.body.append(raiz);
  const sombra=raiz.querySelector('.ef-sombra'), corpo=raiz.querySelector('#ef-corpo');
  let aba='equipe';
  function aviso(s){ raiz.querySelector('.ef-aviso').textContent=s; }
  function avatar(p, chefe=false){ return `<span class="ef-avatar ${chefe?'ef-chefe':''}" style="--tom:${chefe?'#f5c789':p.cor||'#a9c8e5'}"><span class="ef-orelhas"></span><span class="ef-olhos">● ●</span><span class="ef-boca">ᴗ</span><span class="ef-simbolo">${escapar(p.simbolo||'✦')}</span></span>`; }
  function abrir(destino){ aba=destino; sombra.hidden=false; desenhar(); raiz.querySelector('#ef-fechar').focus(); }
  function fechar(){ sombra.hidden=true; }
  function desenhar(){
    raiz.querySelector('#ef-contagem').textContent=estado.agentes.length;
    raiz.querySelector('#ef-titulo').textContent=estado.iniciado?'Central da equipe':'Conheça seu orquestrador';
    raiz.querySelectorAll('[data-aba]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.aba===aba)));
    if(!estado.iniciado){
      corpo.innerHTML=`<div class="ef-boasvindas">${avatar({simbolo:'★'},true)}<h3>Quem vai coordenar sua equipe?</h3><p>Comece sem agentes auxiliares. Você poderá criá-los depois.</p><form id="ef-inicio"><label>Nome do orquestrador<input name="nome" maxlength="40" placeholder="Chefinho"></label><label>Personalidade<textarea name="personalidade" maxlength="300" placeholder="Gentil, organizado e objetivo."></textarea></label><button type="submit">Começar minha equipe</button></form></div>`;
      return;
    }
    if(aba==='equipe'){
      corpo.innerHTML=`<div class="ef-lider">${avatar({simbolo:'★'},true)}<div><strong>${escapar(estado.chefe.nome)}</strong><small>Orquestrador fixo</small><p>${escapar(estado.chefe.personalidade)}</p></div><button data-editar="chefe">Editar</button></div>
      <div class="ef-subtitulo"><h3>Agentes auxiliares (${estado.agentes.length})</h3></div>
      <div class="ef-grade">${estado.agentes.map(a=>`<article class="ef-cartao">${avatar(a)}<strong>${escapar(a.nome)}</strong><small>${escapar(a.funcao)}</small><p>${escapar(a.personalidade)}</p><div><button data-editar="${a.id}">Editar</button><button data-excluir="${a.id}">Excluir</button></div></article>`).join('')||'<p class="ef-vazio">Ainda não há auxiliares. Escolha uma função abaixo para criar seu primeiro personagem.</p>'}</div>
      <h3>Convocar novo agente</h3><div class="ef-catalogo">${papeis.map((p,i)=>`<button data-criar="${i}">${avatar(p)}<span>${p.nome}<small>${p.funcao}</small></span><b>+</b></button>`).join('')}</div><div id="ef-editor"></div>`;
    } else {
      corpo.innerHTML=`<div class="ef-conversa-cabecalho">${avatar({simbolo:'★'},true)}<div><strong>Mensagens com ${escapar(estado.chefe.nome)}</strong><small>Canal local de demonstração · sem IA conectada</small></div></div>
      <div class="ef-historico" role="log" aria-label="Histórico de mensagens">${estado.mensagens.map(m=>`<article><small>${escapar(m.origem)} → ${escapar(m.destino)} · ${escapar(m.hora)} · demonstração</small><p>${escapar(m.texto)}</p></article>`).join('')||'<p class="ef-vazio">Sem mensagens. Toda comunicação passa pelo orquestrador.</p>'}</div>
      <form id="ef-enviar"><label>Destinatário<select name="destino"><option value="chefe">${escapar(estado.chefe.nome)}</option>${estado.agentes.map(a=>`<option value="${a.id}">${escapar(a.nome)} — via ${escapar(estado.chefe.nome)}</option>`).join('')}</select></label><label>Mensagem<textarea name="texto" required maxlength="1000" placeholder="Escreva uma missão ou recado..."></textarea></label><button type="submit">Enviar pelo orquestrador</button></form>`;
      corpo.querySelector('.ef-historico').scrollTop=99999;
    }
  }
  function editor(id, base){
    const alvo=corpo.querySelector('#ef-editor');
    alvo.innerHTML=`<form id="ef-perfil"><h3>${id?'Editar perfil':'Novo agente'}</h3><label>Nome<input name="nome" maxlength="40" required value="${escapar(base.nome)}"></label><label>Personalidade<textarea name="personalidade" maxlength="300">${escapar(base.personalidade||'Curioso, prestativo e criativo.')}</textarea></label><label>Animação<select name="animacao"><option value="flutuar">Flutuar</option><option value="pular">Pular</option><option value="respirar">Respirar</option></select></label><button type="submit">Salvar perfil</button><button type="button" id="ef-cancelar">Cancelar</button></form>`;
    alvo.querySelector('[name=animacao]').value=base.animacao||'flutuar';
    alvo.querySelector('#ef-cancelar').onclick=()=>alvo.replaceChildren();
    alvo.querySelector('form').onsubmit=e=>{
      e.preventDefault(); const dados=new FormData(e.currentTarget);
      const novo={...base,nome:String(dados.get('nome')).trim()||base.nome,personalidade:String(dados.get('personalidade')).trim(),animacao:String(dados.get('animacao'))};
      if(id==='chefe') estado.chefe=novo;
      else if(id) estado.agentes=estado.agentes.map(a=>a.id===id?novo:a);
      else estado.agentes.push({...novo,id:'ag-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)});
      salvar(); desenhar();
    };
    alvo.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  raiz.addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b)return;
    if(b.dataset.abrir) abrir(b.dataset.abrir);
    if(b.id==='ef-fechar') fechar();
    if(b.dataset.aba){aba=b.dataset.aba;desenhar();}
    if(b.dataset.criar!==undefined){const p=papeis[Number(b.dataset.criar)];editor(null,{...p,personalidade:'Curioso, prestativo e criativo.',animacao:'flutuar'});}
    if(b.dataset.editar){const id=b.dataset.editar;editor(id,id==='chefe'?estado.chefe:estado.agentes.find(a=>a.id===id));}
    if(b.dataset.excluir){estado.agentes=estado.agentes.filter(a=>a.id!==b.dataset.excluir);salvar();desenhar();}
  });
  raiz.addEventListener('submit',e=>{
    if(e.target.id==='ef-inicio'){e.preventDefault();const d=new FormData(e.target);estado.chefe.nome=String(d.get('nome')).trim()||'Chefinho';estado.chefe.personalidade=String(d.get('personalidade')).trim()||'Gentil, organizado e objetivo.';estado.iniciado=true;salvar();desenhar();}
    if(e.target.id==='ef-enviar'){e.preventDefault();const d=new FormData(e.target), destino=String(d.get('destino')),texto=String(d.get('texto')).trim();if(!texto)return;
      const nome=estado.agentes.find(a=>a.id===destino)?.nome||estado.chefe.nome;
      const agora=new Date(),hora=agora.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),quando=agora.toISOString();
      estado.mensagens.push({origem:'Você',destino:estado.chefe.nome,texto,hora,quando,via:'chefe'});
      if(destino!=='chefe')estado.mensagens.push({origem:estado.chefe.nome,destino:nome,texto:'Recado encaminhado: '+texto,hora,quando,via:'chefe'});
      estado.mensagens=estado.mensagens.slice(-150);salvar();desenhar();
    }
  });
  sombra.addEventListener('click',e=>{if(e.target===sombra)fechar();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!sombra.hidden)fechar();});
  if(!estado.iniciado) abrir('equipe');
})();
