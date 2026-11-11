# Deserto Vivo — 2026-11-11

O cenário Deserto passa a ter ambientação 2D própria: céu crepuscular, dunas em camadas, ruínas, cinco exploradores em caravana, oásis descobertos por toque e tempestade de areia acionável. Os exploradores caminham em direção ao último oásis, sem movimento orbital. Partículas são determinísticas por tempo e índice, evitando tremores por sorteio a cada quadro. Os oásis são limitados a cinco para evitar crescimento de memória.

## Arquitetura e importações

- `frontend/animacoes/deserto-vivo.js`: desenho Canvas e estado de caravana, oásis e tempestade; expõe `window.DesertoVivo` com `desenhar(ctx,w,h,t,dt)`, `explorar(x,y,w,h)`, `ventania()` e `estado()`.
- `frontend/componentes/deserto-controles.js` e `.css`: botões touch e indicadores, escutam `flow:tema` e `flow:deserto`.
- `frontend/paginas/painel/painel.js`: encaminha desenho e toque somente para `deserto`.
- `agentes-orbitais.html`: importa módulos antes do motor; `scripts/scripts-gerar-demo-publica.js` copia recursos para a demonstração.

## Teste e limitações

Executar `npm run testar:demo-publica`, `npm run verificar` e `npm audit`. A experiência é demonstrativa e não envia ordens financeiras. O motor legado de agentes ainda pode produzir sobreposições visuais no deserto; migração completa dos movimentos não orbitais permanece pendente.
