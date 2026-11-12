# Arquitetura — Trading Pages / Ander Flow

## Módulos de produto
- `agentes-orbitais.html`: ponto de entrada e importações CSS/JS do painel.
- `frontend/componentes/equipe-flow.js`: onboarding, perfis e mensagens locais roteadas pelo Chefinho.
- `frontend/componentes/mural-missoes.js`: missões manuais.
- `frontend/componentes/quadro-despachos.js`: tarefas com prioridade e responsável.
- `frontend/componentes/radar-flow.js`: fila de prioridades.
- `frontend/componentes/linha-tempo-flow.js`: consolidação somente leitura de registros reais do navegador.
- `frontend/componentes/linha-tempo-flow.css`: painel, trilho temporal, filtros, responsividade e redução de movimento.
- `scripts/scripts-gerar-demo-publica.js`: cópia explícita de recursos para a demo estática.

## Como acrescentar um componente
1. Crie `frontend/componentes/nome-flow.js` com IIFE e `'use strict'`, sem dependências globais desnecessárias.
2. Crie `frontend/componentes/nome-flow.css` com prefixo de classe/ID exclusivo.
3. Referencie ambos em `agentes-orbitais.html`.
4. Adicione ambos à lista `copiar(...)` em `scripts/scripts-gerar-demo-publica.js`.
5. Execute `npm run gerar:demo-publica`, `npm run testar:demo-publica` e gates de segurança/CI.
6. Não exponha chaves, sessões ou dados reais na demo. Registre limitações e testes antes de publicar.

## Linha do Tempo Flow
O componente lê as chaves `ander-flow-equipe-v1`, `ander-flow-missoes-v1`, `ander-flow-despachos-v1`, `ander-flow-diario-v1` e `ander-flow-agenda-v1`. Não escreve nessas chaves. Os eventos são derivados de datas existentes; dados legados sem data não recebem data inventada. Os registros de conversa novos recebem `quando` ISO 8601; mensagens antigas permanecem preservadas.

Os filtros (tipo, período, texto) são locais. Exportação gera JSON com apenas eventos filtrados. O evento `storage` atualiza abas diferentes; o evento interno `ander-flow:radar-atualizado` atualiza a mesma aba. Fonte: https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event (consultada em 2026-11-12).

## Limitações
A linha do tempo não é um log imutável/auditável: alterações antigas podem ser substituídas pelos estados atuais. Não há execução real de agentes de IA ou negociação financeira. Persistência sincronizada entre dispositivos requer backend, autenticação e migração separados.

## Sala Flow — quadro operacional interativo (12/11/2026)
- `frontend/componentes/sala-flow.js`: painel, criação de despachos, personagens representativos, filtros, passagem manual entre estados e persistência.
- `frontend/componentes/sala-flow.css`: palco 2D, quadro Kanban, responsividade, redução de movimento e alvos de toque.
- Ambos são importados por `agentes-orbitais.html` e copiados pela rotina `scripts/scripts-gerar-demo-publica.js`.
- Os dados são os mesmos do Quadro de Despachos (`ander-flow-despachos-v1`) e da Equipe (`ander-flow-equipe-v1`). Alterações disparam `ander-flow-despachos-alterados` para atualização na mesma aba.
- A conclusão exige descrição manual do resultado, sem alegar execução real por agentes. Não há conexão com corretoras.
- Critérios de validação pendentes: executar build/CI da branch, testar criação, movimentação, resultado obrigatório, persistência e viewport de 360px em navegador real antes de publicar.

## Estação de Revisão Flow (12/11/2026)
- `frontend/componentes/revisao-flow.js`: revisão manual de despachos concluídos, com três critérios obrigatórios para aprovação, observações, histórico de decisão e devolução que reabre o despacho.
- `frontend/componentes/revisao-flow.css`: painel editorial 2D com Chefinho expressivo, cartões de avaliação, estados vazios, viewport móvel e movimento reduzido.
- Os arquivos são importados em `agentes-orbitais.html` e copiados pelo gerador da demonstração.
- Leitura de `ander-flow-despachos-v1` e `ander-flow-equipe-v1`; gravação em `ander-flow-revisoes-v1`. Uma devolução reabre o despacho em `ander-flow-despachos-v1`.
- A aprovação exige resultado descrito, três confirmações humanas e evidência textual. Não afirma teste automático nem execução de IA.
- Gates pendentes: testes E2E de aprovação, devolução, persistência, mobile e deploy público.

## Fluxo Vivo — mapa operacional
- `frontend/componentes/fluxo-vivo.js`: leitura local dos despachos, equipe e revisões, classificação por estado, filtros e detalhes; sem alterar registros.
- `frontend/componentes/fluxo-vivo.css`: palco 2D, Chefinho expressivo, mapa responsivo e `prefers-reduced-motion`.
- Importações em `agentes-orbitais.html` e cópias em `scripts/scripts-gerar-demo-publica.js`.
- Fluxo: pendente → andamento → revisão → aprovado; revisão rejeitada reabre a tarefa e aparece em ajustes.
- Para validar: gerar demo, executar Chrome em 360px/1440px, conferir filtros, reabertura, persistência, console e CI antes de merge/publicação.

## Jardim Flow — cenário de tarefas (12/11/2026)
- Crie `frontend/componentes/jardim-flow.js` para o estado interativo, leitura/gravação de `ander-flow-despachos-v1`, criação de tarefas, avanço e conclusão manual.
- Crie `frontend/componentes/jardim-flow.css` para cenário 2D com sol, nuvem, plantas em três estágios e responsividade.
- Importe ambos em `agentes-orbitais.html` e copie no gerador `scripts/scripts-gerar-demo-publica.js`.
- Ao plantar, um despacho pendente é criado. Regar inicia; florescer exige resultado escrito; replantar reabre. Alterações emitem `ander-flow-despachos-alterados` e `ander-flow:radar-atualizado`.
- O cenário não é orbital; respeita `prefers-reduced-motion` e não executa IA ou ordens financeiras.
- Validação pendente: CI, Playwright em 360px/1440px, persistência e integração com Sala/Quadro/Fluxo.

## Oficina Flow — bancada de projetos (12/11/2026)
- `frontend/componentes/oficina-flow.js`: projetos locais com etapas sequenciais, vínculos opcionais a despachos, conclusão e reabertura manuais, persistidos em `ander-flow-oficina-v1`.
- `frontend/componentes/oficina-flow.css`: bancada 2D, personagem-máquina expressivo, esteira de etapas, layout mobile e movimento reduzido.
- Importar CSS/JS em `agentes-orbitais.html` e copiar ambos no gerador da demo. Nenhuma integração de IA ou corretora; vincular despacho não altera status.
- Validação pendente: CI, testes de dependências, persistência, viewport 360px e publicação.
