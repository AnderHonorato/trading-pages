(function(raiz,fabrica){
  const api=fabrica();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(raiz)raiz.ConversaContextual=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';

  function normalizarPapel(papel){
    const p=String(papel||'').toLowerCase();
    if(/anal|sinal|quant/.test(p))return 'analista';
    if(/seg|risco|guard/.test(p))return 'seguranca';
    if(/busc|explor|spot/.test(p))return 'explorador';
    if(/exec|clos|taker|ordem/.test(p))return 'executor';
    return 'geral';
  }

  function criarFala({agente={},contexto='status',dados={}}={}){
    const papel=normalizarPapel(agente.papel||agente.funcao||agente.status);
    const alvo=dados.alvo?String(dados.alvo):'o cenário';
    const confianca=Number.isFinite(Number(dados.confianca))?Math.round(Number(dados.confianca)):null;
    if(contexto==='sinal_confirmado'){
      if(papel==='analista')return 'Sinal de '+alvo+' confirmado'+(confianca!=null?' em '+confianca+'%':'')+'. Vou acompanhar a consistência.';
      if(papel==='seguranca')return 'Sinal de '+alvo+' passou pela checagem de risco.';
      return 'Sinal de '+alvo+' confirmado. Mantendo observação.';
    }
    if(contexto==='recebeu_ordem')return papel==='executor'?'Ordem recebida. Validando condições antes de agir.':'Entendi a prioridade. Ajustando minha rota.';
    if(contexto==='passou_dado')return dados.para?'Enviei o contexto para '+dados.para+'.':'Contexto encaminhado para o próximo agente.';
    if(contexto==='recebeu_dado')return dados.de?'Recebi contexto de '+dados.de+'. Vou cruzar antes de seguir.':'Recebi o contexto. Vou validar antes de seguir.';
    if(contexto==='simulacao_mercado')return papel==='executor'?'Simulação enviada. Aguardando retorno do cenário.':'Simulação encaminhada para validação.';
    if(contexto==='reforco')return papel==='seguranca'?'Barreira reforçada. Continuo monitorando o risco.':'Reforço concluído. Mantendo suporte ao núcleo.';
    if(contexto==='impacto')return papel==='seguranca'?'Impacto detectado. Reforçando proteção.':'Fui atingido. Recalculando a rota.';
    if(contexto==='reciclagem')return 'Minha relevância caiu. Estou liberando espaço para um agente mais útil.';
    if(contexto==='entrada')return papel==='explorador'?'Entrei na órbita. Começando a varredura.':'Assumindo posição e sincronizando com o núcleo.';
    if(contexto==='status'){
      const estado=String(agente.status||'').trim();
      if(/ordem enviada/i.test(estado))return 'Simulação de execução em acompanhamento.';
      if(estado)return estado.charAt(0).toUpperCase()+estado.slice(1)+'.';
    }
    return papel==='analista'?'Cruzando sinais e procurando confirmação.':'Acompanhando o sistema.';
  }

  function criarFila({maxAtivas=2,cooldownMs=7000}={}){
    const ativas=new Map(),ultimo=new Map();
    function solicitar({agenteId,texto,prioridade=0,agora=Date.now(),duracaoMs=2200}){
      const id=String(agenteId);
      if(!texto||!id)return false;
      const ultima=ultimo.get(id);
      if(ultima!=null&&agora-ultima<cooldownMs)return false;
      if(ativas.size>=maxAtivas){
        const menor=[...ativas.entries()].sort((a,b)=>a[1].prioridade-b[1].prioridade)[0];
        if(!menor||prioridade<=menor[1].prioridade)return false;
        ativas.delete(menor[0]);
      }
      ativas.set(id,{texto,prioridade,inicio:agora,fim:agora+duracaoMs});
      ultimo.set(id,agora);
      return true;
    }
    function concluir(agenteId,agora=Date.now()){
      const id=String(agenteId);ativas.delete(id);
      if(!ultimo.has(id))ultimo.set(id,agora);
    }
    function obterAtiva(agenteId,agora=Date.now()){
      const id=String(agenteId),item=ativas.get(id);
      if(!item)return null;
      if(agora>=item.fim){ativas.delete(id);return null;}
      return item;
    }
    function limpar(agora=Date.now()){
      for(const [id,item] of ativas)if(agora>=item.fim)ativas.delete(id);
    }
    return {solicitar,concluir,obterAtiva,limpar,ativas};
  }

  return {criarFala,criarFila,normalizarPapel};
});
