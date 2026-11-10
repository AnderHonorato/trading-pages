(function (raiz, fabrica) {
  const api = fabrica();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (raiz) raiz.OrbitalFisica = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const TAU = Math.PI * 2;
  const limitar = (valor, minimo, maximo) => Math.min(maximo, Math.max(minimo, valor));

  function sentidoOrbitalCosmo() {
    return 1;
  }

  function calcularOrbitaCosmo({ raio, excentricidade = 0.12, inclinacao = 0, no = 0, angulo = 0 }) {
    const a = Math.max(0.01, Number(raio) || 0.01);
    const e = limitar(Number(excentricidade) || 0, 0, 0.35);
    const b = a * Math.sqrt(1 - e * e);
    const xBase = a * (Math.cos(angulo) - e);
    const zBase = b * Math.sin(angulo);
    const yBase = zBase * Math.sin(inclinacao);
    const zInclinado = zBase * Math.cos(inclinacao);
    const cosNo = Math.cos(no);
    const sinNo = Math.sin(no);
    return {
      x: xBase * cosNo - zInclinado * sinNo,
      y: yBase,
      z: xBase * sinNo + zInclinado * cosNo
    };
  }

  function calcularRotacaoPropria({ tempo = 0, velocidade = 0.2, fase = 0 }) {
    return Number(fase) + Number(tempo) * Number(velocidade);
  }

  function multiplicadorEspacamento(quantidade) {
    return 1 + Math.max(0, Number(quantidade) - 6) * 0.05;
  }

  function escalaVisualPorPopulacao(quantidade) {
    return limitar(1 - Math.max(0, Number(quantidade) - 6) * 0.025, 0.58, 1);
  }

  function calcularSuccao({ origem, centro, progresso, fase = 0 }) {
    const p = limitar(Number(progresso) || 0, 0, 1);
    if (p >= 1) return { x: centro.x, y: centro.y, escala: 0, rotacao: fase + TAU * 2.75 };
    const dx = origem.x - centro.x;
    const dy = origem.y - centro.y;
    const raioInicial = Math.hypot(dx, dy);
    const anguloInicial = Math.atan2(dy, dx);
    const suavizado = 1 - Math.pow(1 - p, 2);
    const raioAtual = raioInicial * Math.pow(1 - suavizado, 1.18);
    const angulo = anguloInicial + fase + suavizado * TAU * 2.75;
    return {
      x: centro.x + Math.cos(angulo) * raioAtual,
      y: centro.y + Math.sin(angulo) * raioAtual * 0.72,
      escala: Math.max(0, 1 - Math.pow(p, 1.7)),
      rotacao: angulo
    };
  }

  function determinarHumor({ vida = 100, vidaMax = 100, ameacado = false, absorvendo = false, feliz = false }) {
    if (absorvendo) return 'panico';
    const proporcao = vidaMax > 0 ? vida / vidaMax : 0;
    if (proporcao <= 0.3) return 'machucado';
    if (ameacado) return 'assustado';
    if (feliz) return 'feliz';
    return 'neutro';
  }

  return {
    sentidoOrbitalCosmo,
    calcularOrbitaCosmo,
    calcularRotacaoPropria,
    multiplicadorEspacamento,
    escalaVisualPorPopulacao,
    calcularSuccao,
    determinarHumor
  };
});
