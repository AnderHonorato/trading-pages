# Jardim Vivo — entrega 2026-11-11

## Produto
O tema Jardim tem ambientacao Canvas 2D independente: solo, montanhas, flores com crescimento gradual, borboletas, chuva e sol. Ao tocar no terreno, uma flor nasce e amadurece; os botoes **Regar jardim** e **Abrir sol** aceleram o crescimento e alteram o ambiente. Limite de 24 flores evita crescimento ilimitado de memoria. Nao envia ordens financeiras.

## Organizacao
- `frontend/animacoes/jardim-vivo.js`: estado, crescimento, renderizacao, plantio e clima. Expõe `window.JardimVivo`.
- `frontend/componentes/jardim-controles.js`: painel sem HTML embutido no motor; acompanha o evento `flow:tema` e oferece comandos.
- `frontend/componentes/jardim-controles.css`: controles responsivos com botoes de 44 px.
- `frontend/paginas/painel/painel.js`: delega desenho e toque apenas quando tema === jardim.
- `scripts/scripts-gerar-demo-publica.js`: inclui arquivos na demonstracao publica.
- `scripts/scripts-testar-demo-publica.js`: verifica painel, plantio e clima no navegador.

## Integracao
A pagina `agentes-orbitais.html` importa o modulo e o painel antes de `painel.js`. Para criar outro cenario, usar modulo isolado com `desenhar(ctx,w,h,t,dt)` e `estado()`, conectar somente ao tema e copiar o recurso na geracao da demo.

## Limites
O jardim e uma experiencia demonstrativa e ainda convive com elementos legados dos agentes; a remocao de movimentos orbitais residuais nos demais temas permanece no backlog. A animacao usa delta de tempo limitado; respeitar reducao de movimento do motor global.
