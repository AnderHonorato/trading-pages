const PERIODOS_MINUTOS = [1, 5, 15, 60, 360, 1440];

function minutosBloqueioPorInfracao(infracao) {
  const indice = Math.max(0, Math.min(PERIODOS_MINUTOS.length - 1, Number(infracao || 1) - 1));
  return PERIODOS_MINUTOS[indice];
}

function segundosAte(dataIso, agora = Date.now()) {
  const restante = Math.ceil((new Date(dataIso).getTime() - agora) / 1000);
  return Math.max(0, restante);
}

module.exports = { minutosBloqueioPorInfracao, segundosAte, PERIODOS_MINUTOS };
