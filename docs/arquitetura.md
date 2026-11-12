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
