/* Ponte entre a equipe escolhida e a arena 2D. Nenhum auxiliar e criado automaticamente. */
(() => {
  'use strict';
  const api = window.AgentesOrbitais;
  const central = window.FlowCentralMissoes;
  if (!api || !central) return;
  const cores = ['#7fd0bd','#f0b24a','#ee7f98','#8fb0ee','#b99cf5','#ff9566'];
  const formas = ['nuvem','blob','fantasma','cristal','gato','raposa'];
  const agentes = api.config.agentes;
  const porId = new Map();
  function sincronizar() {
    const equipe = central.obterEstado().equipe;
    const ids = new Set(equipe.map(a => a.id));
    for (let i=agentes.length-1; i>=0; i--) {
      if (!ids.has(agentes[i].flowId)) agentes.splice(i,1);
    }
    equipe.forEach((perfil, indice) => {
      let a = agentes.find(item => item.flowId === perfil.id);
      if (!a) {
        a = {flowId:perfil.id, nome:perfil.nome, papel:perfil.funcao, forma:formas[indice%formas.length],
          cor:cores[indice%cores.length], corT:cores[indice%cores.length], orbita:indice%3,
          fase:(indice*.37)%1, status:'Aguardando missão', ativo:true, i:indice,
          seed:indice*.61+.2, bounce:0, happy:0, p:null, nasc:1, ang:indice*2.4,
          angVisual:indice*2.4, angAlvo:indice*2.4, carga:0, pend:null,
          recuoX:0, recuoY:0, glow:0, balao:null, olhar:null, olharT:3,
          trilhaTema:[]};
        agentes.push(a);
      }
      a.nome=perfil.nome; a.papel=perfil.funcao;
      porId.set(perfil.id,a);
    });
    // A equipe e a unica fonte de verdade: o Canvas nao repoe reservas legadas.
    const chips=document.getElementById('ao-chips');
    if(chips) {
      chips.replaceChildren();
      agentes.forEach(a=>{
        const botao=document.createElement('button');
        botao.type='button';botao.className='ao-chip';botao.dataset.n=a.nome;
        botao.style.setProperty('--c',a.corT);
        botao.textContent=a.nome;
        botao.setAttribute('aria-label','Selecionar '+a.nome);
        botao.addEventListener('click',()=>central.abrir('equipe'));
        chips.append(botao);
      });
    }
  }
  sincronizar();
  window.addEventListener('flow:equipe-alterada',sincronizar);
  window.FlowEquipeArena={sincronizar};
})();
