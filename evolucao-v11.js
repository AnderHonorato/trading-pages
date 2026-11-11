/* Núcleo Vivo v11 — física orbital, perigos temáticos, humor e absorção do núcleo. Sem dependências externas.
   API de demonstração: NÃO executa ordens, NÃO se conecta a corretoras. */
(function (global) {
  'use strict';
  const PI = Math.PI, TAU = PI * 2;
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const FISICA = global.OrbitalFisica || null;
  const RECICLAGEM = global.ReciclagemAgentes || null;
  const ORBITAS = [
    { id: 'elipse', nome: 'Elipse 3D' },
    { id: 'oito', nome: 'Infinito ∞' },
    { id: 'helice', nome: 'Hélice' },
    { id: 'espiral', nome: 'Espiral' },
    { id: 'vertical', nome: 'Vertical' },
    { id: 'caos', nome: 'Coreografia livre' }
  ];
  const PODERES = {
    pixel: ['Fúria 8-bit', '#ffe469', 'critico'],
    dados: ['Crítico D20', '#ffe6a1', 'critico'],
    naves: ['Laser de plasma', '#85ddff', 'raio'],
    cartas: ['Curinga astral', '#fbb5f0', 'critico'],
    voxel: ['Meteoros de blocos', '#a9f389', 'onda'],
    criaturas: ['Estouro de carinho', '#ffa6bd', 'cura'],
    cosmos: ['Mini supernova', '#dabaff', 'onda'],
    cyber: ['Firewall quântico', '#41fce0', 'escudo'],
    bio: ['Pulso anticorpos', '#a8ef87', 'cura'],
    arcano: ['Selo rúnico', '#cba2ff', 'escudo'],
    oceano: ['Jato abissal', '#80e5fa', 'onda'],
    floresta: ['Raízes vivas', '#a5d88c', 'cura'],
    clima: ['Relâmpago espiral', '#fcf39d', 'raio'],
    deserto: ['Tempestade dourada', '#f5b870', 'onda'],
    artico: ['Estilhaços glaciais', '#b2ecff', 'escudo'],
    comida: ['Chuva de delícias', '#ffc2a5', 'cura'],
    musica: ['Acorde ressonante', '#edb0ff', 'onda'],
    esportes: ['Gol meteoro', '#f7e88c', 'critico'],
    origami: ['Asa de papel', '#b1d8fa', 'escudo'],
    brinquedos: ['Explosão de blocos', '#ffe681', 'critico']
  };
  let L, modo = 0, mortes = 0, evolucoes = 0, geracao = 1, contagem = 0, proximoAtaque = 7.2, pulsoEspecial = 3.8, proximoPerigo = 3.6;
  let proximaReciclagem = 58 + Math.random() * 24, alvoReciclagem = null, esperaReciclagem = 0, reciclagens = 0;
  let aviso = '', durAviso = 0, alvoAvisado = null, esperaAtaque = 0, backend = 'LOCAL / DEMO', sinalRemoto = '', alternarBackend = 0;
  const caidos = [], eventos = [], perigosExternos = [], succoes = [];
  let botaoModo, botaoDesafio, indicador, avisoEl;
  const evento = (texto) => {
    eventos.unshift({ texto, instante: Date.now() });
    if (eventos.length > 20) eventos.pop();
    aviso = texto; durAviso = 2.7;
    if (avisoEl) { avisoEl.textContent = texto; avisoEl.classList.add('on'); }
  };
  const tamanho = () => L.getSize();
  const tema = () => L.getTheme();
  const power = () => PODERES[tema()?.id] || PODERES.criaturas;
  const vivos = () => L.ativos().filter(a => a.vida > 0);
  const safe = fn => { try { fn(); } catch (e) { console.warn('[Núcleo Vivo]', e); } };
  const vitoria = a => (a.acertos || 0) * 4 + (a.contributo || 0) * 1.3 + (a.vida || 0) * .16;

  function initAgente(a) {
    if (typeof a.vida !== 'number' || a.vida <= 0) {
      a.vida = 95 + Math.floor(Math.random() * 26);
      a.vidaMax = a.vida;
      a.acertos = 0;
      a.contributo = 0;
      a.desvios = 0;
      a.escudoNovo = 0;
      a.xpNovo = 0;
      a.rankNovo = 1;
      a.saltoNovo = 0;
      a.passoNovo = Math.random() * TAU;
      a.disparoNovo = 0;
      a.morrendo = false;
      a.renascido = 1;
      a.sendoSugado = false;
      a.succaoEstado = null;
      a.humorNovo = 'neutro';
      a.rotacaoPropria = Math.random() * TAU;
      a.ultimaAcao = contagem;
      a.entradaEm = contagem;
      a.protegidoAte = contagem + 24;
      a.relevancia = 100;
      a.banidoAte = 0;
      a.contribJanela = 0;
      a.acertosJanela = 0;
      a.sentenciado = false;
      a.substituindo = null;
    }
  }

  const reservasDisponiveis = excluir => L.AG.filter(a =>
    !a.ativo && !a.morrendo && a.nome !== excluir && (a.banidoAte || 0) <= contagem
  );

  function scoreRelevancia(a) {
    const score = RECICLAGEM ? RECICLAGEM.calcularRelevancia(a,contagem) : Math.round(clamp(vitoria(a),0,100));
    a.relevancia = score;
    return score;
  }

  function podeSerReciclado(a) {
    if (!a || !a.ativo || a.morrendo || !a.p || a.sendoSugado) return false;
    if (vivos().length <= 4) return false;
    if (!reservasDisponiveis(a.nome).length) return false;
    if ((a.protegidoAte || 0) > contagem) return false;
    if (a === alvoAvisado || a === alvoReciclagem) return false;
    if ((a.carga || 0) > 0 || a.pend) return false;
    if ((a.disparoNovo || 0) > .25 || (a.escudoNovo || 0) > .45) return false;
    return true;
  }

  function iniciarReciclagem() {
    if (alvoReciclagem || alvoAvisado || L.ameaca.fase) return false;
    const candidatos = vivos().filter(podeSerReciclado);
    if (!candidatos.length) {
      proximaReciclagem = 12 + Math.random() * 10;
      return false;
    }
    candidatos.forEach(scoreRelevancia);
    const a = RECICLAGEM ? RECICLAGEM.escolherMenorRelevancia(candidatos) : candidatos.sort((x,y)=>x.relevancia-y.relevancia)[0];
    if(!a)return false;
    alvoReciclagem = a;
    esperaReciclagem = 2.45;
    a.sentenciado = true;
    a.humorNovo = 'panico';
    L.nuc.alvoX = clamp((a.p.x - tamanho().CX) / 90, -1, 1);
    L.nuc.alvoY = clamp((a.p.y - tamanho().CY) / 90, -1, 1);
    L.nuc.flash = 1;
    L.nuc.shake = .12;
    evento('NÚCLEO JULGA ' + a.nome + ' · relevância ' + a.relevancia + '% · substituição preparada');
    return true;
  }

  function executarReciclagem() {
    const a = alvoReciclagem;
    alvoReciclagem = null;
    if (!a || !a.ativo || !a.p) return;
    a.sentenciado = false;
    a.banidoAte = contagem + 150;
    iniciarSuccao(a,{reciclagem:true,motivo:'baixa relevância · '+Math.round(a.relevancia||0)+'%'});
    evento('SENTENÇA GRAVITACIONAL · ' + a.nome);
  }

  function escolherAlvo() {
    const todos = vivos();
    const elegiveis = todos.filter(a =>
      (a.protegidoAte || 0) <= contagem &&
      a !== alvoReciclagem &&
      !a.morrendo &&
      !a.sendoSugado
    );
    const lista = elegiveis.length ? elegiveis : todos.filter(a=>a!==alvoReciclagem&&!a.sendoSugado);
    if (!lista.length) return null;
    return lista.sort((a, b) => (vitoria(a) - vitoria(b)) + (Math.random() - .5) * 3)[0];
  }
  function iniciarAtaque() {
    const a = escolherAlvo(); if (!a || !a.p || a.sendoSugado) return false;
    alvoAvisado = a; esperaAtaque = 1.05;
    L.nuc.alvoX = clamp((a.p.x - tamanho().CX) / 90, -1, 1);
    L.nuc.alvoY = clamp((a.p.y - tamanho().CY) / 90, -1, 1);
    L.nuc.escudo.alvoOn = 1;
    L.nuc.medo = 0;
    a.humorNovo = 'assustado';
    evento('NÚCLEO FIXA ' + a.nome + ' · gravidade aumentando');
    return true;
  }
  function iniciarSuccao(a,{motivo='absorção do núcleo',reciclagem=false}={}) {
    if (!a || !a.ativo || !a.p || a.sendoSugado) return false;
    const {CX,CY}=tamanho();
    a.sendoSugado = true;
    a.humorNovo = 'panico';
    const estado={
      a,origem:{x:a.p.x,y:a.p.y},centro:{x:CX,y:CY},t:0,
      dur:1.9+Math.random()*.55,fase:a.seed||0,atual:{x:a.p.x,y:a.p.y,escala:1},
      motivo,reciclagem:Boolean(reciclagem)
    };
    a.succaoEstado=estado;
    succoes.push(estado);
    L.nuc.shake=.18;L.nuc.flash=1;L.nuc.happy=.18;
    evento((tema()?.id==='cosmos'?'BURACO NEGRO SUGA ':'NÚCLEO ABSORVE ')+a.nome);
    return true;
  }
  function executarAtaque() {
    const a = alvoAvisado; alvoAvisado = null;
    if (!a || !a.ativo || !a.p) return;
    iniciarSuccao(a);
    for (const v of vivos()) {
      if(v===a)continue;
      v.olhar={x:clamp((tamanho().CX-(v.p?.x||0))/150,-1,1),y:-.2,t:1.3};
      v.humorNovo='assustado';
    }
  }
  function matar(a, motivo, {reciclagem=false}={}) {
    if (!a || !a.ativo || a.morrendo) return;
    const p = a.p ? {...a.p} : {x:tamanho().CX,y:tamanho().CY,r:15};
    const registro={
      nome:a.nome,papel:a.slotPapel||a.papel,orbita:a.orbita,ang:a.ang,
      cor:a.corT||a.cor,x:p.x,y:p.y,r:p.r||15,t:0,dur:2.3,motivo,
      reciclagem:Boolean(reciclagem),relevancia:Math.round(a.relevancia||0)
    };
    a.morrendo = true;
    a.sentenciado = false;
    a.vida = 0;
    a.banidoAte=Math.max(a.banidoAte||0,contagem+180);
    caidos.push(registro);
    L.explosao(p.x, p.y, a.corT || a.cor, 42, tamanho().S * .39);
    L.aneis.push({x:p.x, y:p.y, t:0, cor: a.corT || a.cor});
    a.ativo = false; a.p = null;
    mortes++;
    if (L.atualizaChips) L.atualizaChips();
    evento(a.nome + ' FOI ELIMINADO · ' + motivo + ' · buscando substituto');
  }

  function repor(registro) {
    if(!registro)return;
    const reservas=reservasDisponiveis(registro.nome);
    if(!reservas.length){
      evento('VAGA DE '+registro.nome+' AGUARDA NOVO AGENTE');
      return;
    }
    const novo=RECICLAGEM
      ? RECICLAGEM.escolherSubstituto(reservas,registro.papel)
      : reservas[Math.floor(Math.random()*reservas.length)];
    if(!novo)return;
    novo.morrendo=false;
    novo.vida=0;
    novo.orbita=Number.isInteger(registro.orbita)?registro.orbita:novo.orbita;
    if(Number.isFinite(registro.ang)){
      const fase=(((registro.ang/TAU)%1)+1)%1;
      novo.fase=fase;
      novo.ang=registro.ang;
    }
    novo.substituindo=registro.nome;
    novo.slotPapel=registro.papel;
    L.ativar(novo.nome);
    initAgente(novo);
    novo.entradaEm=contagem;
    novo.ultimaAcao=contagem;
    novo.protegidoAte=contagem+38;
    novo.contribJanela=0;
    novo.acertosJanela=0;
    novo.relevancia=100;
    novo.renascido=1.6;
    geracao++;
    evolucoes++;
    if(registro.reciclagem)reciclagens++;
    L.explosao(novo.p?.x||tamanho().CX,novo.p?.y||tamanho().CY,novo.corT||novo.cor,34,tamanho().S*.29);
    evento(novo.nome+' SUBSTITUI '+registro.nome+' · '+registro.papel+' · G'+geracao);
  }
  function impacto(s) {
    const a = s.para;
    if (!a || !a.ativo || a.morrendo) return;
    initAgente(a);
    const p = a.p || {x:s.x,y:s.y,r:12};
    const v = power(), tipo = s.poderTipo || v[2];
    const chance = .24 + Math.min(.19, a.rankNovo * .03) + (a.nome === 'RUBI' ? .12 : 0);
    if (Math.random() < chance) {
      a.desvios++;
      a.saltoNovo = 1;
      a.escudoNovo = Math.max(a.escudoNovo, .36);
      L.explosao(p.x, p.y, '#ffffff', 10, tamanho().S * .14);
      L.fxTxt.push({x:p.x,y:p.y-p.r*2,t:0,txt:'ESQUIVA!',cor:'#8bffe2',bruto:true});
      evento(a.nome + ' DESVIOU DO GOLPE');
      return;
    }
    let dano = s.danoBase || 22;
    if (a.escudoNovo > 0) dano *= .35;
    if (tipo === 'raio') dano *= 1.25;
    if (tipo === 'cura') dano *= .75;
    if (tipo === 'critico' && Math.random() < .2) dano *= 1.6;
    a.vida = Math.max(0, a.vida - Math.round(dano));
    a.glow = 1; a.bounce = 1;
    a.recuoX = (p.x - tamanho().CX) * .12;
    a.recuoY = (p.y - tamanho().CY) * .12;
    L.explosao(p.x, p.y, v[1], 23, tamanho().S * .22);
    L.fxTxt.push({x:p.x,y:p.y-p.r*1.7,t:0,txt:'−'+Math.round(dano)+' VIDA',cor:'#ff7389',bruto:true});
    a.balao = {txt:'ai! ' + Math.round(a.vida) + ' HP',t:1.3,dur:1.3};
    if (a.vida <= 0) matar(a, v[0]);
    else if (a.vida < 38) { a.escudoNovo = 1.9; evento(a.nome + ' ATIVOU ESCUDO DE EMERGÊNCIA'); }
  }

  const PERIGOS_TEMA={
    pixel:['bloco corrompido','#ffe469'],dados:['dado errante','#ffe6a1'],naves:['destroço orbital','#85ddff'],
    cartas:['carta selvagem','#fbb5f0'],voxel:['bloco meteórico','#a9f389'],criaturas:['espinho viajante','#ffa6bd'],
    cosmos:['meteoro','#ffb36a'],cyber:['pacote corrompido','#41fce0'],bio:['vírus invasor','#a8ef87'],
    arcano:['fragmento rúnico','#cba2ff'],oceano:['detrito abissal','#80e5fa'],floresta:['galho lançado','#a5d88c'],
    clima:['granizo extremo','#fcf39d'],deserto:['rocha de areia','#f5b870'],artico:['bloco de gelo','#b2ecff'],
    comida:['ingrediente rebelde','#ffc2a5'],musica:['nota dissonante','#edb0ff'],esportes:['bola perdida','#f7e88c'],
    origami:['dobradura cortante','#b1d8fa'],brinquedos:['peça solta','#ffe681']
  };
  const PERIGOS_COSMO=['meteoro','cometa','planeta menor'];

  function criarPerigoExterno(){
    const candidatos=vivos().filter(a=>a.p&&!a.sendoSugado);
    if(!candidatos.length)return false;
    const alvo=candidatos[Math.floor(Math.random()*candidatos.length)],{W,H}=tamanho(),lado=Math.floor(Math.random()*4),m=26;
    let origem;
    if(lado===0)origem={x:-m,y:Math.random()*H};
    else if(lado===1)origem={x:W+m,y:Math.random()*H};
    else if(lado===2)origem={x:Math.random()*W,y:-m};
    else origem={x:Math.random()*W,y:H+m};
    const temaAtual=tema()?.id||'criaturas',par=PERIGOS_TEMA[temaAtual]||PERIGOS_TEMA.criaturas;
    const nome=temaAtual==='cosmos'?PERIGOS_COSMO[Math.floor(Math.random()*PERIGOS_COSMO.length)]:par[0];
    perigosExternos.push({alvo,origem,x:origem.x,y:origem.y,t:0,dur:1.45+Math.random()*.65,curva:(Math.random()-.5)*.22,nome,cor:par[1],seed:Math.random(),tema:temaAtual});
    alvo.humorNovo='assustado';
    return true;
  }

  function impactarPerigo(p){
    const a=p.alvo;
    if(!a||!a.ativo||a.sendoSugado)return;
    initAgente(a);
    const pos=a.p||{x:p.x,y:p.y,r:12};
    const dano=Math.round(13+Math.random()*18+(p.nome==='planeta menor'?9:0));
    a.vida=Math.max(0,a.vida-dano);
    a.glow=1;a.bounce=1;
    a.humorNovo=a.vida<=a.vidaMax*.3?'machucado':'assustado';
    L.explosao(pos.x,pos.y,p.cor,p.nome==='planeta menor'?34:22,tamanho().S*(p.nome==='planeta menor'?.28:.2));
    L.aneis.push({x:pos.x,y:pos.y,t:0,cor:p.cor});
    if(a.vida<=0)matar(a,p.nome);
    else evento(a.nome+' ATINGIDO POR '+p.nome.toUpperCase()+' · '+a.vida+' HP');
  }

  function atualizarPerigos(dt){
    for(let i=perigosExternos.length-1;i>=0;i--){
      const p=perigosExternos[i],a=p.alvo;
      if(!a||!a.ativo||!a.p){perigosExternos.splice(i,1);continue;}
      p.t+=dt;
      const k=Math.min(1,p.t/p.dur),kk=1-Math.pow(1-k,2),dx=a.p.x-p.origem.x,dy=a.p.y-p.origem.y,len=Math.hypot(dx,dy)||1;
      const nx=-dy/len,ny=dx/len,off=Math.sin(Math.PI*kk)*p.curva*len;
      p.x=p.origem.x+dx*kk+nx*off;
      p.y=p.origem.y+dy*kk+ny*off;
      if(k>=1){impactarPerigo(p);perigosExternos.splice(i,1);}
    }
  }

  function atualizarSuccoes(dt){
    for(let i=succoes.length-1;i>=0;i--){
      const s=succoes[i],a=s.a;
      if(!a||!a.ativo){succoes.splice(i,1);continue;}
      s.t+=dt;
      const progresso=Math.min(1,s.t/s.dur);
      s.atual=FISICA
        ?FISICA.calcularSuccao({origem:s.origem,centro:s.centro,progresso,fase:s.fase})
        :{x:s.centro.x+(s.origem.x-s.centro.x)*(1-progresso),y:s.centro.y+(s.origem.y-s.centro.y)*(1-progresso),escala:1-progresso};
      a.succaoEstado=s;
      if(progresso>=1){
        a.sendoSugado=false;
        a.succaoEstado=null;
        succoes.splice(i,1);
        matar(a,s.motivo||'absorção do núcleo',{reciclagem:Boolean(s.reciclagem)});
      }
    }
  }

  function desenharPerigosExternos(t){
    if(!L)return;
    const {ctx}=L,{S}=tamanho();
    for(const p of perigosExternos){
      const r=S*(p.nome==='planeta menor'?.022:p.nome==='cometa'?.014:.012);
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(t*(p.nome==='cometa'?2.1:5)+p.seed*6);
      if(p.tema==='cosmos'){
        if(p.nome==='cometa'){
          const g=ctx.createLinearGradient(-r*5,0,r,0);
          g.addColorStop(0,L.hexA('#9fdcff',0));
          g.addColorStop(1,L.hexA('#eaf7ff',.85));
          ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(-r*1.7,0,r*3.3,r*.45,0,0,TAU);ctx.fill();
        }
        ctx.fillStyle=p.nome==='planeta menor'?'#9b7964':'#6f5848';
        ctx.strokeStyle='#f3bf8c';ctx.lineWidth=1.1;ctx.beginPath();
        for(let k=0;k<9;k++){
          const ang=k/9*TAU,rr=r*(.72+.35*Math.sin(k*4.3+p.seed*8));
          ctx.lineTo(Math.cos(ang)*rr,Math.sin(ang)*rr);
        }
        ctx.closePath();ctx.fill();ctx.stroke();
        if(p.nome==='planeta menor'){
          ctx.fillStyle='rgba(255,255,255,.18)';
          ctx.beginPath();ctx.arc(-r*.23,-r*.28,r*.18,0,TAU);ctx.fill();
        }
      }else{
        ctx.fillStyle=p.cor;ctx.globalAlpha=.82;ctx.beginPath();
        for(let k=0;k<6;k++){
          const ang=k/6*TAU,rr=k%2?r*.55:r;
          ctx.lineTo(Math.cos(ang)*rr,Math.sin(ang)*rr);
        }
        ctx.closePath();ctx.fill();
      }
      ctx.restore();
    }
  }

  function desenharSuccoes(t){
    if(!L)return;
    const {ctx}=L,{CX,CY}=tamanho();
    for(const s of succoes){
      const a=s.a,p=s.atual;if(!p)continue;
      ctx.save();ctx.globalCompositeOperation='screen';
      const cor=a.corT||a.cor;
      ctx.strokeStyle=L.hexA(cor,.45);ctx.lineWidth=1.2;ctx.setLineDash([4,7]);ctx.lineDashOffset=-t*20;
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.quadraticCurveTo((p.x+CX)/2+Math.sin(t*4+s.fase)*20,(p.y+CY)/2,CX,CY);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle=L.hexA(cor,.12);ctx.beginPath();ctx.arc(CX,CY,10+Math.sin(t*5)*3,0,TAU);ctx.fill();
      ctx.restore();
    }
  }

  function desenharRostoCosmo(a,p,t){
    if(!FISICA||tema()?.id!=='cosmos'||!p)return;
    const {ctx}=L;
    const humor=FISICA.determinarHumor({vida:a.vida,vidaMax:a.vidaMax,ameacado:alvoAvisado===a||alvoReciclagem===a,absorvendo:a.sendoSugado,feliz:a.happy>0});
    a.humorNovo=humor;
    const rot=FISICA.calcularRotacaoPropria({tempo:t,velocidade:.22+(a.i%5)*.025,fase:a.rotacaoPropria||0});
    const desloc=Math.sin(rot)*p.r*.10,olhoY=p.y-p.r*.08,rOlho=Math.max(1.8,p.r*.12);
    ctx.save();
    ctx.lineCap='round';ctx.strokeStyle='rgba(10,15,28,.88)';ctx.fillStyle='rgba(248,251,255,.95)';
    ctx.lineWidth=Math.max(1.2,p.r*.055);
    for(const lado of[-1,1]){
      const x=p.x+lado*p.r*.30+desloc;
      if(humor==='machucado'&&lado===1){
        ctx.beginPath();ctx.moveTo(x-rOlho,olhoY);ctx.lineTo(x+rOlho,olhoY);ctx.stroke();continue;
      }
      const escalaY=humor==='assustado'||humor==='panico'?1.4:humor==='feliz'?.55:1;
      ctx.beginPath();ctx.ellipse(x,olhoY,rOlho,rOlho*escalaY,0,0,TAU);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.arc(x,olhoY,rOlho*.42,0,TAU);ctx.fillStyle='#111827';ctx.fill();
      ctx.fillStyle='rgba(248,251,255,.95)';
    }
    const bocaY=p.y+p.r*.30;
    ctx.beginPath();
    if(humor==='panico'){ctx.ellipse(p.x+desloc*.4,bocaY,p.r*.12,p.r*.18,0,0,TAU);ctx.stroke();}
    else if(humor==='feliz'){ctx.arc(p.x+desloc*.4,bocaY-p.r*.04,p.r*.17,.08*Math.PI,.92*Math.PI);ctx.stroke();}
    else if(humor==='machucado'||humor==='assustado'){ctx.arc(p.x+desloc*.4,bocaY+p.r*.10,p.r*.16,1.12*Math.PI,1.88*Math.PI);ctx.stroke();}
    else{ctx.moveTo(p.x-p.r*.10+desloc*.4,bocaY);ctx.quadraticCurveTo(p.x+desloc*.4,bocaY+p.r*.07,p.x+p.r*.10+desloc*.4,bocaY);ctx.stroke();}
    ctx.restore();
  }

  // Cada tema tem um poder próprio e um efeito real: crítico, escudo, regeneração ou onda.
  function powerHit(s) {
    if (!s.de || !s.de.nome || !s.poder) return;
    const a = s.de; initAgente(a);
    const tipo = s.poderTipo || power()[2];
    a.acertos++;
    a.acertosJanela = (a.acertosJanela||0) + 1;
    a.contribJanela = (a.contribJanela||0) + (tipo==='onda'?3:tipo==='cura'?2.6:2);
    a.ultimaAcao = contagem;
    a.xpNovo += tipo === 'critico' ? 4 : 2.3;
    a.contributo += tipo === 'onda' ? 3 : 2;
    scoreRelevancia(a);
    if (tipo === 'cura') {
      for (const b of vivos()) b.vida = Math.min(b.vidaMax, b.vida + 3.5);
    } else if (tipo === 'escudo') {
      for (const b of vivos()) b.escudoNovo = Math.max(b.escudoNovo, 1.6);
      L.nuc.escudo.alvoOn = 1;
      L.nuc.escudo.hp = Math.min(L.nuc.escudo.max, L.nuc.escudo.hp + 4);
    } else if (tipo === 'raio') {
      L.nuc.shake = .14;
      L.darXP(1.8);
    } else if (tipo === 'critico') L.darXP(2.2);
    else L.darXP(1.2);
    L.aneis.push({x:s.x,y:s.y,t:0,cor:power()[1]});
    if (a.xpNovo >= 14 + a.rankNovo * 6) {
      a.xpNovo = Math.max(0,a.xpNovo-(14+a.rankNovo*6)); a.rankNovo++; evolucoes++;
      a.vidaMax += 8; a.vida = Math.min(a.vidaMax, a.vida + 28);
      a.escudoNovo = 2;
      a.nasc = .35;
      L.explosao(s.x,s.y, a.corT, 30, tamanho().S*.28);
      evento(a.nome + ' EVOLUIU PARA RANK ' + a.rankNovo);
    }
  }

  function orbital(o, ang, t) {
    const atual=tema()?.id;
    if(atual==='cosmos'&&FISICA){
      const qtd=L?L.ativos().length:6,mult=FISICA.multiplicadorEspacamento(qtd);
      const idx=L?L.CONFIG.orbitas.indexOf(o):0;
      const e=.08+Math.max(0,idx)*.035;
      return FISICA.calcularOrbitaCosmo({
        raio:o.r*mult,
        excentricidade:e,
        inclinacao:(o.incl||0)*PI/180,
        no:(o.no||0)*PI/180,
        angulo:ang
      });
    }
    const ic = o.incl * PI/180, no = o.no * PI/180;
    let px = Math.cos(ang) * o.r, pz = Math.sin(ang) * o.r, py = pz * Math.sin(ic);
    const selected = ORBITAS[modo].id;
    if (selected === 'oito') { px = Math.sin(ang) * o.r; pz = Math.sin(ang * 2) * o.r * .52; py = Math.cos(ang * 2 + t * .3) * .10; }
    else if (selected === 'helice') {py = Math.sin(ang * 2.2 - t * .75) * .38; pz = Math.sin(ang) * o.r + Math.cos(ang * 3) * .07;}
    else if (selected === 'espiral') {const pulse = .78 + .24 * Math.sin(ang * 2.4 - t * .18);px *= pulse; pz *= pulse;py = Math.sin(ang * 2 - t*.5) * .22;}
    else if (selected === 'vertical') {px = Math.cos(ang) * o.r * .75;py = Math.sin(ang) * o.r * .68;pz = Math.sin(ang*2) * .20;}
    else if (selected === 'caos') {px += Math.sin(ang*3 + t*.9)*.13;pz += Math.cos(ang*4-t*.8)*.15;py = Math.sin(ang*5 + t)*.32;}
    else {pz *= Math.cos(ic);}
    const mult=1+Math.max(0,L.ativos().length-6)*.062;
    return {x:(px*Math.cos(no)-pz*Math.sin(no))*mult,y:py*mult,z:(px*Math.sin(no)+pz*Math.cos(no))*mult};
  }
  function move(a, p, t, dt) {
    initAgente(a);
    if(a.sendoSugado&&a.succaoEstado?.atual){
      p.x=a.succaoEstado.atual.x;
      p.y=a.succaoEstado.atual.y;
      p.f=Math.max(.15,a.succaoEstado.atual.escala||0);
      return;
    }
    const { S } = tamanho();
    const sh = a.saltoNovo || 0;
    const wave = Math.sin(t*2.7+a.passoNovo);
    // Manobras em tela e em profundidade: esquiva, salto, deslizamento e flutuação.
    const lv=Math.min(20,a.rankNovo||1),fase=a.passoNovo;
    p.x += Math.sin(t*3.1+a.seed*8) * S * .012 + Math.sin(t*1.4+a.seed*4) * S*.012
      + Math.cos(t*.7+fase*3)*S*(.002+lv*.00025);
    p.y += Math.cos(t*2.2+a.seed*5) * S * .014 - Math.sin(Math.max(0,1-sh)*PI)*S*.04
      + Math.sin(t*1.2+fase)*S*(.004+lv*.00025);
    // Coreografia: mergulhos, giros e mudanças de altitude sem teletransporte.
    p.y += Math.sin(t*.37+a.seed*5.2)*S*.007;
    if (Math.abs(wave)>.84) p.y -= S*.005 * (wave+.84);
  }
  function tick(dt, dtR, t) {
    contagem += dt;
    proximoAtaque -= dt;
    proximoPerigo -= dt;
    pulsoEspecial -= dt;
    proximaReciclagem -= dt;
    durAviso -= dtR;
    if (durAviso<=0 && avisoEl) avisoEl.classList.remove('on');
    if (alvoReciclagem) {
      esperaReciclagem -= dt;
      if (esperaReciclagem<=0) executarReciclagem();
    }
    if (proximaReciclagem<=0 && !alvoReciclagem) {
      const iniciou=iniciarReciclagem();
      if(iniciou)proximaReciclagem=62+Math.random()*34;
    }
    if (alvoAvisado) {esperaAtaque-=dt;if(esperaAtaque<=0) executarAtaque();}
    if (proximoAtaque<=0 && !alvoReciclagem) { iniciarAtaque(); proximoAtaque = 9.5 + Math.random()*4.5; }
    if (proximoPerigo<=0) { criarPerigoExterno(); proximoPerigo = 4.1 + Math.random()*3.4; }
    atualizarPerigos(dt);
    atualizarSuccoes(dt);
    if (pulsoEspecial<=0) {
      const agentes = vivos().filter(a => a.p && a.carga<=0);
      const a = agentes[Math.floor(Math.random()*agentes.length)];
      if (a) {
        const p = power();
        L.dispararDe(a,'sinal','nucleo',{cor:p[1],poder:p[0],poderTipo:p[2]});
        a.disparoNovo = 1;
        if (Math.random()<.4) evento(a.nome+' USOU '+p[0].toUpperCase());
      }
      pulsoEspecial = 3.3 + Math.random()*2.8;
    }
    for (const a of vivos()) {
      initAgente(a);
      a.saltoNovo = Math.max(0, a.saltoNovo - dt*1.5);
      a.disparoNovo = Math.max(0,a.disparoNovo-dt*1.8);
      a.escudoNovo = Math.max(0,a.escudoNovo-dt);
      a.renascido = Math.max(0,a.renascido-dt);
      a.contribJanela = (a.contribJanela||0) * Math.exp(-dt/58);
      a.acertosJanela = (a.acertosJanela||0) * Math.exp(-dt/72);
      scoreRelevancia(a);
      if (a.vida < a.vidaMax && contagem % 2 < dt) a.vida = Math.min(a.vidaMax,a.vida+1.1);
    }
    // A proteção básica nunca desaparece. Sob ameaça ou ataque, o escudo se reforça.
    if (!L.ameaca.fase && !alvoAvisado && L.nuc.paz <= 0) L.nuc.escudo.alvoOn = .22;
    if (L.nuc.escudo.hp <= 0 && L.ameaca.fase === 0) L.nuc.escudo.hp = Math.min(L.nuc.escudo.max, 18);
    for (let i=caidos.length-1;i>=0;i--) {
      caidos[i].t += dt;
      if (caidos[i].t >= caidos[i].dur) {const registro=caidos[i];caidos.splice(i,1);const antigo=L.AG.find(a=>a.nome===registro.nome);if(antigo)antigo.morrendo=false;repor(registro);}
    }
    if (indicador && Math.floor(t*4)%4===0) {
      const pp = power();
      const ativosAgora=vivos();
      const pior=ativosAgora.length?(RECICLAGEM?RECICLAGEM.escolherMenorRelevancia(ativosAgora):ativosAgora.slice().sort((a,b)=>(a.relevancia||100)-(b.relevancia||100))[0]):null;
      const rel=pior?pior.nome+' '+Math.round(pior.relevancia||0)+'%':'—';
      indicador.innerHTML='<strong>✦ '+pp[0].toUpperCase()+'</strong><span>✧ NÍVEL '+L.nuc.nivel+'/50 · G'+geracao+' · '+L.ativos().length+' seres · ♻ '+reciclagens+'</span><small>◎ '+ORBITAS[modo].nome+' · reciclagem em '+Math.max(0,Math.ceil(proximaReciclagem))+'s · menor relevância '+rel+' · '+backend+'</small>';
    }
  }
  function drawAura(a, p, t) {
    if (a.escudoNovo>0) {
      const {ctx} = L, alpha=clamp(a.escudoNovo,0,1);
      ctx.save();ctx.strokeStyle='rgba(121,242,248,'+alpha*.7+')';ctx.lineWidth=1.3;ctx.setLineDash([3,5]);ctx.lineDashOffset=-t*12;
      ctx.beginPath();ctx.arc(p.cx,p.cy,p.r*(1.46+Math.sin(t*4+a.seed)*.03),0,TAU);ctx.stroke();ctx.restore();
    }
    if (a.disparoNovo>0) {
      const {ctx} = L,alpha=clamp(a.disparoNovo,0,1);
      ctx.save();ctx.strokeStyle=L.hexA(a.corT,alpha*.5);ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.cx,p.cy,p.r*(1.5+2*(1-alpha)),0,TAU);ctx.stroke();ctx.restore();
    }
  }
  function drawDetails(a, p, t) {
    if (!a.vidaMax || !p) return;
    const {ctx}=L, rank=a.rankNovo||1, temaAtual=tema()?.id;
    if(temaAtual==='cosmos'){
      desenharRostoCosmo(a,p,t);
      const ratio=clamp(a.vida/a.vidaMax,0,1),ang0=-PI/2;
      ctx.save();
      ctx.lineWidth=Math.max(1.4,p.r*.07);
      ctx.strokeStyle='rgba(255,255,255,.13)';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r*1.14,0,TAU);ctx.stroke();
      ctx.strokeStyle=ratio>.5?'#69e7a2':ratio>.25?'#ffcc65':'#ff6e88';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r*1.14,ang0,ang0+TAU*ratio);ctx.stroke();
      ctx.restore();
      return;
    }
    const y = p.y-p.r*1.95, w=Math.max(22,p.r*2.2), ratio = clamp(a.vida/a.vidaMax,0,1);
    ctx.save();ctx.fillStyle='rgba(8,10,18,.7)';ctx.fillRect(p.x-w/2,y,w,3.6);
    ctx.fillStyle=ratio>.5?'#69e7a2':ratio>.25?'#ffcc65':'#ff6e88';ctx.fillRect(p.x-w/2,y,w*ratio,3.6);
    if (rank>=2 && L.ativos().length<=8) {
      ctx.fillStyle=L.hexA(a.corT,.7+.3*Math.sin(t*4));
      ctx.font='700 10px monospace';ctx.textAlign='center';ctx.fillText('✦'+rank,p.x,y-5);
    }
    ctx.restore();
  }
  function drawScene(t,dt) {
    const {ctx,proj}=L,{S,CX,CY}=tamanho(), powerNow=power();
    desenharPerigosExternos(t);
    desenharSuccoes(t);
    for (const s of proj) {
      if (!(s.tipo==='nucleo-agente' || s.poder)) continue;
      const col=s.cor || powerNow[1];
      ctx.save();ctx.translate(s.x,s.y);ctx.rotate(t*7+s.seed*5);ctx.strokeStyle=col;ctx.fillStyle=L.hexA(col,.25);ctx.lineWidth=2;
      const n=s.tipo==='nucleo-agente'?5:7, r=S*(s.tipo==='nucleo-agente'?.023:.014);
      ctx.beginPath();for(let i=0;i<n;i++){const ang=i/n*TAU, rr=(i%2?.66:1)*r;ctx.lineTo(Math.cos(ang)*rr,Math.sin(ang)*rr);}ctx.closePath();ctx.fill();ctx.stroke();
      if (s.poder) {ctx.rotate(-t*7-s.seed*5);ctx.fillStyle='#fff';ctx.font='700 '+Math.max(9,S*.015)+'px sans-serif';ctx.textAlign='center';ctx.fillText(s.tipo==='nucleo-agente'?'!':'✦',0,4);}
      ctx.restore();
    }
    const alvoVisual=alvoReciclagem?.p?alvoReciclagem:alvoAvisado;
    if (alvoVisual?.p) {
      const p=alvoVisual.p,reciclando=alvoVisual===alvoReciclagem;
      const rr=p.r*(reciclando?2.05:1.7)+Math.sin(t*10)*3;
      ctx.save();
      ctx.strokeStyle=reciclando?'#ff315e':'#ff667d';
      ctx.lineWidth=reciclando?3:2.3;
      ctx.setLineDash(reciclando?[3,4,10,4]:[7,5]);ctx.lineDashOffset=-t*(reciclando?38:25);
      ctx.beginPath();ctx.arc(p.x,p.y,rr,0,TAU);ctx.stroke();ctx.setLineDash([]);
      if(reciclando){
        for(let k=0;k<4;k++){
          const ang=t*1.7+k*TAU/4;
          ctx.beginPath();
          ctx.moveTo(p.x+Math.cos(ang)*rr*.74,p.y+Math.sin(ang)*rr*.74);
          ctx.lineTo(p.x+Math.cos(ang)*rr*1.18,p.y+Math.sin(ang)*rr*1.18);
          ctx.strokeStyle=k%2?'#ffffff':'#ff315e';ctx.lineWidth=1.6;ctx.stroke();
        }
      }
      if(!(reciclando&&tema()?.id==='cosmos')){
        ctx.font='700 '+Math.max(9,S*.017)+'px sans-serif';
        ctx.fillStyle=reciclando?'#ff315e':'#ff8698';ctx.textAlign='center';
        ctx.fillText(reciclando?'SENTENCIADO · '+Math.round(alvoVisual.relevancia||0)+'%':'ALVO',p.x,p.y-rr-9);
      }
      ctx.restore();
    }
    for(const f of caidos) {
      const k=clamp(f.t/f.dur,0,1), rr=f.r*(1+k*3.5), alpha=(1-k);
      ctx.save();ctx.translate(f.x,f.y-k*S*.075);ctx.globalAlpha=alpha;
      ctx.strokeStyle=f.cor;ctx.lineWidth=3*(1-k)+.5;
      ctx.beginPath();ctx.arc(0,0,rr,0,TAU);ctx.stroke();
      for(let j=0;j<12;j++){const a=j/12*TAU+t*2;ctx.fillStyle=f.cor;ctx.beginPath();ctx.arc(Math.cos(a)*rr*.85,Math.sin(a)*rr*.85,Math.max(.5,3*(1-k)),0,TAU);ctx.fill();}
      ctx.font='700 '+Math.max(11,S*.024)+'px sans-serif';ctx.fillStyle='#ff7897';ctx.textAlign='center';ctx.fillText(k<.44?'✕  '+f.nome+' ELIMINADO':'✦ RENASCENDO...',0,-rr-12);ctx.restore();
    }
  }

  function installForms(FORMAS, ctx) {
    const types={
      gato:{olhos:'#4b2c81',orelhas:'triangulo',coroa:0},
      raposa:{olhos:'#512713',orelhas:'grandes',cauda:true},
      axolote:{olhos:'#4f283c',guelras:true},
      dragao:{olhos:'#57220d',chifres:true,cauda:true},
      abelha:{olhos:'#42301b',asas:true,listras:true},
      polvo:{olhos:'#252457',tentaculos:true},
      panda:{olhos:'#191b22',orelhas:'redondas',manchas:true},
      vagalume:{olhos:'#394119',asas:true,antenas:true,luz:true}
    };
    Object.entries(types).forEach(([key, opt]) => {
      FORMAS[key] = (a,t,u,look,blink,feliz) => {
        const col=a.corT||a.cor;
        const line=(s=5)=>{ctx.lineWidth=s*u;ctx.strokeStyle='#252036';ctx.lineJoin='round';ctx.stroke();};
        ctx.save();
        if(opt.cauda){ctx.beginPath();ctx.moveTo(.4,.45);ctx.bezierCurveTo(2.1,-.45,2.1,.7,1.1,.85);ctx.lineWidth=.55;ctx.strokeStyle=col;ctx.stroke();}
        if(opt.tentaculos)for(let i=0;i<6;i++){const x=(i-2.5)*.22;ctx.beginPath();ctx.moveTo(x,.52);ctx.quadraticCurveTo(x+Math.sin(t*3+i)*.29,1.2,x+Math.sin(t*2+i)*.27,1.52);ctx.lineWidth=.18;ctx.strokeStyle=col;ctx.lineCap='round';ctx.stroke();}
        if(opt.asas)for(const dir of[-1,1]){ctx.beginPath();ctx.ellipse(dir*(1+.2*Math.sin(t*13)), -.27,.44,.75,dir*.32,0,TAU);ctx.fillStyle='#f7f5ffae';ctx.fill();line(3);}
        if(opt.orelhas){for(const dir of [-1,1]){
          ctx.beginPath();if(opt.orelhas==='redondas')ctx.arc(dir*.75,-.83,.31,0,TAU);else{ctx.moveTo(dir*.36,-.72);ctx.lineTo(dir*.8,-1.38);ctx.lineTo(dir*1.09,-.45);ctx.closePath();}
          ctx.fillStyle=col;ctx.fill();line(4);
        }}
        if(opt.guelras)for(const dir of[-1,1])for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(dir*(.85+i*.13),-.45+i*.38,.28,.14,dir*.3,0,TAU);ctx.fillStyle='#ea638c';ctx.fill();line(3);}
        if(opt.chifres)for(const dir of[-1,1]){ctx.beginPath();ctx.moveTo(dir*.4,-.7);ctx.lineTo(dir*.82,-1.5);ctx.lineTo(dir*.95,-.65);ctx.fillStyle='#ffe7bb';ctx.fill();line(3);}
        ctx.beginPath();ctx.ellipse(0,0,1,1+Math.sin(t*3+a.seed)*.025,0,0,TAU);ctx.fillStyle=col;ctx.fill();line(6);
        ctx.beginPath();ctx.ellipse(-.25,-.35,.48,.26,-.65,0,TAU);ctx.fillStyle='rgba(255,255,255,.26)';ctx.fill();
        if(opt.listras)for(const x of[-.25,.28]){ctx.beginPath();ctx.ellipse(x,.45,.15,.55,.32,0,TAU);ctx.fillStyle='#403424';ctx.fill();}
        if(opt.manchas)for(const d of[-1,1]){ctx.beginPath();ctx.ellipse(d*.37,-.12,.22,.32,0,0,TAU);ctx.fillStyle='#292634';ctx.fill();}
        for(const d of[-1,1]){
          const x=d*.34+(look?.x||0)*.04,y=-.09+(look?.y||0)*.05;
          ctx.beginPath();ctx.ellipse(x,y,.155,blink>.5?.035:.19,0,0,TAU);ctx.fillStyle=opt.olhos;ctx.fill();
          ctx.beginPath();ctx.arc(x-.05,y-.07,.055,0,TAU);ctx.fillStyle='#ffffff';ctx.fill();
          ctx.beginPath();ctx.arc(d*.66,.22,.12,0,TAU);ctx.fillStyle='rgba(255,160,171,.55)';ctx.fill();
        }
        ctx.strokeStyle='#382540';ctx.lineWidth=.055;ctx.beginPath();ctx.arc(0,.35,feliz?.22:.16,.05*PI,.95*PI);ctx.stroke();
        if(opt.antenas)for(const d of[-1,1]){ctx.strokeStyle=col;ctx.beginPath();ctx.moveTo(d*.3,-.75);ctx.lineTo(d*.48,-1.2);ctx.stroke();ctx.beginPath();ctx.arc(d*.48,-1.2,.11,0,TAU);ctx.fillStyle='#e9ff96';ctx.fill();}
        if(opt.luz){ctx.shadowColor='#bdff79';ctx.shadowBlur=12;ctx.fillStyle='#e9ff8b';ctx.beginPath();ctx.arc(0,.6,.3+.07*Math.sin(t*7),0,TAU);ctx.fill();ctx.shadowBlur=0;}
        ctx.restore();
      };
    });
  }
  function setMode(id){
    const n=typeof id==='number'?id:ORBITAS.findIndex(x=>x.id===id);
    modo=(n>=0?n:modo)%ORBITAS.length;
    if (botaoModo) botaoModo.textContent='◎ '+ORBITAS[modo].nome;
    evento('ÓRBITA: '+ORBITAS[modo].nome.toUpperCase());
    return ORBITAS[modo].id;
  }
  function challenge() {proximoAtaque=7;return iniciarAtaque();}
  function recycleNow() {proximaReciclagem=0;const iniciou=iniciarReciclagem();if(iniciou)proximaReciclagem=62+Math.random()*34;return iniciou;}
  function theme(T) {if (indicador) evento('PODER DESBLOQUEADO · '+(PODERES[T.id]?.[0]||T.nome));}
  function state(){return {
    modo:tema()?.id==='cosmos'?'orbita-cosmica':ORBITAS[modo].id,
    eliminacoes:mortes,reciclagens,evolucoes,geracao,nivelNucleo:L?.nuc.nivel||1,
    poder:power()[0],backend,zoomAutomatico:true,
    proximaReciclagemSeg:Math.max(0,Math.ceil(proximaReciclagem)),
    sentenciado:alvoReciclagem?.nome||null,
    perigosAtivos:perigosExternos.length,sucoesAtivas:succoes.length,
    agentes:L?L.AG.filter(a=>a.ativo).map(a=>({
      nome:a.nome,papel:a.papel,vida:Math.round(a.vida||0),rank:a.rankNovo||1,
      relevancia:Math.round(a.relevancia||0),protegido:(a.protegidoAte||0)>contagem
    })):[],
    eventos:eventos.slice(0,10)
  };}
  async function verificarBackend() {
    try {
      const res = await fetch('/api/status',{cache:'no-store',signal:AbortSignal.timeout(3800)});
      if(!res.ok) throw new Error('status '+res.status);
      const d=await res.json();
      if(d?.ok && d?.modo==='demonstracao')backend='SERVIDOR LOCAL / DEMO';
      else backend='SERVIDOR INDISPONÍVEL / DEMO';
    } catch (_e) {backend='LOCAL / DEMO';}
  }
  async function sinalBackend() {
    try {
      const res=await fetch('/api/sinais',{cache:'no-store',signal:AbortSignal.timeout(3800)});
      if(!res.ok)return;
      const d=await res.json();if(!d?.demonstracao||!Array.isArray(d.eventos))return;
      const item=d.eventos.find(x=>x.id!==sinalRemoto&&x.tipo==='observacao');
      if(item){sinalRemoto=item.id;const a=L.AG.find(x=>x.nome===item.agente&&x.ativo);if(a)L.agentesAPI.pulso(a.nome);}
    }catch(_e){/* permanece executando simulação local */}
  }
  function setup(obj) {
    L=obj;
    for(const a of L.AG)if(a.ativo)initAgente(a);
    const grupo=document.createElement('div');grupo.id='ao-controls';grupo.setAttribute('role','group');grupo.setAttribute('aria-label','Controles de batalha e trajetória');
    grupo.innerHTML='<span class="ao-control-label">MOVIMENTO</span><button type="button" id="ao-modo" aria-label="Alternar modo de órbita">◎ Elipse 3D</button><button type="button" id="ao-desafio" class="ao-kill" aria-label="Iniciar duelo com o núcleo">⚔ Duelo</button><button type="button" id="ao-habilidade" aria-label="Usar poder do tema">✦ Poder</button><button type="button" id="ao-progredir" aria-label="Evoluir o núcleo mais um nível">↑ Nível</button><button type="button" id="ao-convocar" aria-label="Adicionar um mascote em órbita">+ Mascote</button>';
    L.root.appendChild(grupo);
    botaoModo=grupo.querySelector('#ao-modo');botaoDesafio=grupo.querySelector('#ao-desafio');
    indicador=document.createElement('div');indicador.id='ao-combat-info';indicador.setAttribute('role','status');L.root.appendChild(indicador);
    avisoEl=document.createElement('div');avisoEl.id='ao-v9-notice';avisoEl.setAttribute('aria-live','polite');L.root.appendChild(avisoEl);
    botaoModo.addEventListener('click',()=>setMode((modo+1)%ORBITAS.length));
    botaoDesafio.addEventListener('click',()=>challenge());
    grupo.querySelector('#ao-progredir').addEventListener('click',()=>{
      if(L.nuc.nivel < L.CONFIG.xp.niveis.length) {
        L.agentesAPI.setNivel(L.nuc.nivel+1);
        evento('NÚCLEO · NÍVEL '+L.nuc.nivel+' / '+L.CONFIG.xp.niveis.length);
      } else evento('NÚCLEO ALCANÇOU O NÍVEL 50');
    });
    grupo.querySelector('#ao-convocar').addEventListener('click',()=>{
      const reserva=L.AG.filter(a=>!a.ativo&&!a.morrendo);
      if(!reserva.length){evento('TODOS OS MASCOTES JÁ ESTÃO NA ARENA');return;}
      const n=reserva[Math.floor(Math.random()*reserva.length)];
      L.ativar(n.nome);initAgente(n);evento(n.nome+' CONVOCADO · ZOOM AJUSTANDO');
    });
    grupo.querySelector('#ao-habilidade').addEventListener('click',()=>{
      const agentes=vivos().filter(a=>a.p&&a.carga<=0),a=agentes[Math.floor(Math.random()*agentes.length)];
      if(!a)return;
      const p=power();
      L.dispararDe(a,'sinal','nucleo',{cor:p[1],poder:p[0],poderTipo:p[2]});
      evento(a.nome+' LANÇOU '+p[0].toUpperCase());
    });
    // Sem registro de navegação ou envio de dados pessoais.
    safe(verificarBackend);safe(sinalBackend);
    global.setInterval(()=>{if(document.visibilityState==='visible')safe(verificarBackend);},30000);
    global.setInterval(()=>{if(document.visibilityState==='visible')safe(sinalBackend);},12000);
    evento('SISTEMA V12 · ÓRBITAS VIVAS + RECICLAGEM POR RELEVÂNCIA');
  }

  /* Arena anti-colisão: distância mínima em tela, e centro protegido dos rótulos. */
  function separate(lista,t,dt) {
    if(!lista.length)return;
    const {W,H,S,CX,CY}=tamanho(),n=lista.length;
    const encolher=Math.max(.52,1-Math.max(0,n-6)*.035);
    const r=e=>Math.max(9,S*L.CONFIG.tamanhoAgente*encolher*(tema().escalaAgente||1)*(e.p.f||1));
    const margin=Math.max(14,S*.055),top=W<650?65:57,bottom=W<650?95:69;
    const antes=lista.map(e=>({x:e.p.x,y:e.p.y}));
    // Resolve sempre a partir da órbita ideal: reaplicar o deslocamento anterior
    // a cada quadro acumula correções e provoca tremores entre agentes.
    for(let pass=0;pass<4;pass++){
      for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
        const A=lista[i].p,B=lista[j].p;
        let dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy);
        const sep=(r(lista[i])+r(lista[j]))*(n>13?1.32:1.52)+3;
        if(d>=sep)continue;
        if(d<.01){const ang=(i*2.39+j*.91);dx=Math.cos(ang);dy=Math.sin(ang);d=1;}
        const push=Math.min(15,(sep-d)*.52),ux=dx/d,uy=dy/d;
        A.x-=ux*push;A.y-=uy*push;B.x+=ux*push;B.y+=uy*push;
      }
      for(const {p} of lista){
        const dx=p.x-CX,dy=p.y-CY,d=Math.hypot(dx,dy)||1;
        const mi=Math.min(145,S*.16)+Math.min(52,(L.nuc.r||S*.06)*1.25);
        if(d<mi){p.x+=dx/d*(mi-d)*.5;p.y+=dy/d*(mi-d)*.5;}
        p.x=clamp(p.x,margin,W-margin);
        p.y=clamp(p.y,top,H-bottom);
      }
    }
    // Aplica transição gradual para não saltar quando outro mascote entra/sai.
    for(let i=0;i<n;i++){
      const e=lista[i],prevX=e.a.antiColX||0,prevY=e.a.antiColY||0;
      const x=clamp(e.p.x-antes[i].x,-S*.22,S*.22),y=clamp(e.p.y-antes[i].y,-S*.22,S*.22);
      // Amortece a correção espacial e limita a velocidade da mudança.
      // O alvo pode variar bruscamente quando dois agentes cruzam a órbita.
      const passo=Math.max(0,Math.min(dt,.05));
      const a=1-Math.exp(-passo*5);
      const limite=S*.26*passo;
      e.a.antiColX=prevX+clamp((x-prevX)*a,-limite,limite);
      e.a.antiColY=prevY+clamp((y-prevY)*a,-limite,limite);
      e.p.x=clamp(antes[i].x+e.a.antiColX,margin,W-margin);
      e.p.y=clamp(antes[i].y+e.a.antiColY,top,H-bottom);
    }
  }

  /* Evoluções depois da quinta forma: cada uma das 9 ascensões ganha uma nova corona. */
  function drawAscension(x,y,r,nivel,t){
    if(nivel<=5)return;
    const {ctx}=L, pal=tema().pal,cor=pal?.destaque||'#ffd57e';
    const tier=Math.min(9,Math.floor((nivel-1)/5));
    const etapa=(nivel-1)%5;
    ctx.save();ctx.translate(x,y);ctx.globalCompositeOperation='screen';
    for(let k=0;k<Math.min(5,tier);k++){
      const rr=r*(1.45+k*.22),offset=t*(k%2?-1:1)*(.48+k*.1)+k*1.3;
      ctx.lineWidth=1+Math.min(1.1,tier*.07);
      ctx.strokeStyle=L.hexA(k%2?'#ffffff':cor,.28+.028*tier);
      ctx.beginPath();ctx.arc(0,0,rr,offset,offset+Math.PI*(.40+.04*etapa));ctx.stroke();
      ctx.beginPath();ctx.arc(0,0,rr,offset+Math.PI,offset+Math.PI*(1.45+.03*etapa));ctx.stroke();
    }
    const satelites=Math.min(11,2+tier+Math.floor(etapa/2));
    for(let i=0;i<satelites;i++){
      const ang=t*(i%2?-.22:.22)+i*TAU/satelites,rr=r*(1.8+Math.sin(t*.7+i)*.12);
      const xx=Math.cos(ang)*rr,yy=Math.sin(ang)*rr*.72;
      const sz=Math.max(1.3,Math.min(4.8,1.7+tier*.22));
      ctx.save();ctx.translate(xx,yy);ctx.rotate(ang+t*.7);ctx.fillStyle=i%3===0?'#ffffff':cor;
      ctx.beginPath();ctx.moveTo(0,-sz*1.5);ctx.lineTo(sz,0);ctx.lineTo(0,sz*1.5);ctx.lineTo(-sz,0);ctx.closePath();ctx.fill();ctx.restore();
    }
    if(tier>=3){for(let s of[-1,1]){
      ctx.strokeStyle=L.hexA(cor,.25+.15*Math.sin(t*2));ctx.lineWidth=Math.max(1,r*.035);
      ctx.beginPath();ctx.moveTo(s*r*.8,r*.1);ctx.quadraticCurveTo(s*r*2.5,-r*1.6,s*r*(2.2+.14*Math.sin(t*2)),r*.55);ctx.stroke();
    }}
    if(etapa===4){ctx.beginPath();ctx.arc(0,0,r*(2.3+.06*Math.sin(t*3)),0,TAU);ctx.lineWidth=1.4;ctx.strokeStyle=L.hexA('#ffffff',.22);ctx.stroke();}
    ctx.restore();
  }
  function onLevel(n){
    const {CX,CY,S}=tamanho();
    if(n>5){L.explosao(CX,CY,tema().pal.destaque,24+Math.min(40,n),S*.25);
      L.aneis.push({x:CX,y:CY,t:0,cor:tema().pal.destaque});}
    if(n%5===1&&n>5)evento('ASCENSÃO '+Math.floor((n-1)/5)+' · CORONA DESBLOQUEADA');
  }

  /* Pano de fundo vivo: partículas temáticas, profundidade, vento e meteoros. */
  const POEIRA=Array.from({length:80},(_,i)=>{
    const s=i*78.4+.7;
    const f=x=>{const q=Math.sin(s*x+2.1)*43758.5453;return q-Math.floor(q);};
    return{x:f(4),y:f(9),z:f(6),phase:f(17)*TAU,vel:.025+f(7)*.07,sz:.6+f(13)*1.7};
  });
  function drawBackground(t,dt){
    if(!L)return;
    const {ctx}=L,{W,H,S,CX,CY}=tamanho(),T=tema();
    const id=T.id,col=T.cor||T.pal.destaque;
    const neve=['artico'],chuva=['clima'],mar=['oceano'],digital=['cyber','pixel'],folhas=['floresta','deserto','origami'],magico=['arcano','cosmos','naves','cartas','dados','voxel'];
    const qtd=W<480?40:62;
    ctx.save();
    for(let i=0;i<qtd;i++){
      const q=POEIRA[i],speed=q.vel*(.33+q.z*.6);
      const sobe=mar.includes(id)||['bio','criaturas','comida'].includes(id);
      const ry=sobe?((q.y-t*speed)%1+1)%1:((q.y+t*speed)%1+1)%1;
      const rx=((q.x+Math.sin(t*.29+q.phase)*(.024+.021*q.z)+((digital.includes(id)||chuva.includes(id))?0:t*.004*q.z))%1+1)%1;
      const x=rx*W,y=ry*H,sz=q.sz*(W<480?.72:1)*(1+.5*q.z);
      ctx.globalAlpha=(.11+.24*q.z)*(.82+.18*Math.sin(t*1.4+q.phase));
      ctx.fillStyle=col;ctx.strokeStyle=col;ctx.lineWidth=Math.max(.6,sz*.7);
      if(chuva.includes(id)){
        ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-6*sz,y+13*sz);ctx.stroke();
      }else if(neve.includes(id)){
        ctx.beginPath();ctx.arc(x,y,Math.max(1,sz),0,TAU);ctx.fill();
        if(i%8===0){ctx.beginPath();ctx.moveTo(x-4*sz,y);ctx.lineTo(x+4*sz,y);ctx.moveTo(x,y-4*sz);ctx.lineTo(x,y+4*sz);ctx.stroke();}
      }else if(mar.includes(id)){
        ctx.beginPath();ctx.arc(x,y,sz*2.2,0,TAU);ctx.stroke();if(i%4===0){ctx.beginPath();ctx.arc(x-sz*.5,y-sz*.6,sz*.45,0,TAU);ctx.fill();}
      }else if(digital.includes(id)){
        if(id==='pixel'){ctx.fillRect(Math.round(x/4)*4,Math.round(y/4)*4,Math.max(2,sz*2),Math.max(2,sz*2));}
        else {ctx.font='700 '+Math.max(8,Math.round(sz*6))+'px monospace';ctx.fillText(i%2?'0':'1',x,y);}
      }else if(folhas.includes(id)){
        ctx.save();ctx.translate(x,y);ctx.rotate(t*.65+q.phase);
        ctx.beginPath();ctx.moveTo(0,-sz*3);ctx.quadraticCurveTo(sz*3,0,0,sz*2);ctx.quadraticCurveTo(-sz*3,0,0,-sz*3);ctx.fill();ctx.restore();
      }else if(magico.includes(id)){
        if(i%6===0){ctx.beginPath();ctx.moveTo(x-13*sz,y+4*sz);ctx.lineTo(x+4*sz,y-3*sz);ctx.stroke();}
        else {ctx.save();ctx.translate(x,y);ctx.rotate(t*.35+q.phase);ctx.strokeRect(-sz,-sz,sz*2,sz*2);ctx.restore();}
      }else if(id==='musica'){
        ctx.font='700 '+Math.max(10,Math.round(sz*7))+'px serif';ctx.fillText(i%3===0?'♪':'·',x,y);
      }else{
        ctx.beginPath();ctx.arc(x,y,sz*1.2,0,TAU);ctx.fill();
      }
    }
    // Ondas atmosféricas quase transparentes no entorno do núcleo.
    ctx.globalAlpha=.075;
    for(let k=0;k<2;k++){
      const progress=((t*.065+k*.5)%1),rad=S*(.10+progress*.57);
      ctx.strokeStyle=col;ctx.lineWidth=1.5*(1-progress);
      ctx.beginPath();ctx.ellipse(CX,CY,rad,rad*.68,Math.sin(t*.11+k)*.18,0,TAU);ctx.stroke();
    }
    ctx.restore();
  }

  global.OrbitalV9={setup,installForms,orbital,move,tick,impact:impacto,powerHit,drawAura,drawDetails,drawScene,drawBackground,drawAscension,separate,onLevel,setMode,challenge,recycleNow,theme,state};
})(window);