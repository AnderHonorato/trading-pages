(function(raiz,fabrica){
  const api=fabrica();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(raiz)raiz.ReciclagemAgentes=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';

  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));

  function normalizar(texto){
    return String(texto||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  }

  function calcularRelevancia(a,contagem){
    const idade=Math.max(1,Number(contagem||0)-Number(a?.entradaEm||0));
    const ociosidade=Math.max(0,Number(contagem||0)-Number(a?.ultimaAcao||0));
    const recente=clamp(1-ociosidade/42,0,1);
    const producao=clamp((Number(a?.contribJanela||0)/13)+(Number(a?.acertosJanela||0)/9),0,1);
    const evolucao=clamp((Number(a?.rankNovo||1)-1)/8,0,1);
    const consistencia=clamp(Number(a?.contributo||0)/18,0,1);
    const vidaMax=Math.max(1,Number(a?.vidaMax||1));
    const saude=clamp(Number(a?.vida||0)/vidaMax,0,1);
    const maturidade=clamp(idade/30,0,1);
    return Math.round(100*(
      recente*.30+
      producao*.30+
      evolucao*.16+
      consistencia*.10+
      saude*.08+
      maturidade*.06
    ));
  }

  function escolherMenorRelevancia(agentes){
    const lista=Array.from(agentes||[]).filter(Boolean);
    if(!lista.length)return null;
    return lista.slice().sort((a,b)=>Number(a.relevancia??100)-Number(b.relevancia??100))[0];
  }

  function afinidadePapel(candidato,papel){
    const base=normalizar(papel).split(/[^a-z0-9]+/).filter(x=>x.length>2);
    const alvo=normalizar(candidato?.papel).split(/[^a-z0-9]+/).filter(x=>x.length>2);
    return base.reduce((n,token)=>n+(alvo.includes(token)?1:0),0);
  }

  function escolherSubstituto(reservas,papel,aleatorio=Math.random){
    const lista=Array.from(reservas||[]).filter(Boolean);
    if(!lista.length)return null;
    // Sorteie uma vez por candidato: aleatoriedade dentro do comparador
    // torna a ordenação inconsistente e pode selecionar a reserva errada.
    const pontuados=lista.map((agente,indice)=>({
      agente,indice,
      pontos:afinidadePapel(agente,papel)*30+Math.max(0,Math.min(1,Number(aleatorio())||0))*8
    }));
    pontuados.sort((a,b)=>b.pontos-a.pontos||a.indice-b.indice);
    return pontuados[0].agente;
  }

  return {calcularRelevancia,escolherMenorRelevancia,afinidadePapel,escolherSubstituto};
});