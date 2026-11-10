# Backlog técnico vivo — Trading Pages

Atualizado na v12. A prioridade muda a cada ciclo com base em risco, valor e evidência.

## Produto
- [P1] Teste real de conectividade dos provedores de IA sem expor chave.
- [P1] Definir modelo de agentes reais vs. agentes puramente visuais.
- [P2] Histórico de eventos e execuções por agente.
- [P2] Preferências persistentes de painel por usuário.

## Frontend
- [P1] Quebrar o motor Canvas legado em módulos menores.
- [P1] Completar i18n PT-BR/EN.
- [P2] Estados loading/empty/error consistentes.
- [P2] Acessibilidade por teclado e leitores de tela nas áreas não-Canvas.

## Backend/API
- [P1] Validadores de schema por rota.
- [P1] Teste seguro de conectividade dos provedores.
- [P2] OpenAPI/contrato gerável.
- [P2] Paginação de auditoria/eventos.

## Banco/Dados
- [P1] Backup/restauração automatizados do SQLite.
- [P1] Política de retenção de sessões/auditoria.
- [P2] Estratégia de migração para PostgreSQL quando o deploy público exigir escala multi-instância.

## Python/Quant
- [P2] Serviço isolado de backtesting somente quando houver estratégia quantitativa definida.
- [P2] Pipeline de dados históricos com datasets versionados.
- [P3] Métricas de risco e simulação Monte Carlo, sem ordens reais.

## Segurança
- [P1] Recuperação de senha com provedor de e-mail confiável.
- [P1] Rotação da chave mestre de criptografia.
- [P1] Validação de input por schema.
- [P2] Política de retenção e exportação de auditoria.
- [P2] CSP report-only/reporting endpoint.

## Testes/QA
- [P1] E2E da revogação de sessão pelo navegador.
- [P1] Testes de API com matriz de autorização.
- [P2] Testes de carga leves.
- [P2] Regressão visual por snapshots aprovados.

## Performance
- [P1] Medir frame time do Canvas com 20+ agentes.
- [P2] Performance budgets de JS/CSS.
- [P2] Reduzir gravação de ultimo_acesso_em com debounce temporal.

## Observabilidade
- [P1] Histórico persistente de métricas.
- [P1] Alertas externos para 5xx e indisponibilidade.
- [P2] Endpoint de readiness separado do liveness.

## DevOps/CI-CD
- [P1] CI GitHub com testes, audit e gate visual.
- [P1] Deploy público persistente com secrets seguros e rollback.
- [P2] Release semântico e tags automatizadas.

## Acessibilidade/UX
- [P1] Auditoria WCAG AA das telas administrativas.
- [P2] Modo reduced-motion específico para Canvas.
- [P2] Foco visível e navegação por teclado no seletor de estilos.

## Documentação
- [P1] ADRs formais para banco/deploy.
- [P2] Diagrama de arquitetura e fluxo de autenticação.
- [P2] Runbook de incidentes e restauração.

## Escalabilidade
- [P1] Definir limite para permanecer em SQLite.
- [P2] Fila de jobs para processamento pesado futuro.
- [P2] Separar serviços de quant/IA do processo web quando necessário.

## Dívida Técnica
- [P1] Dividir `frontend/paginas/painel/painel.js`.
- [P1] Renomear arquivos `evolucao-v11.*` para versão neutra após estabilização.
- [P2] Remover compatibilidades antigas não utilizadas após cobertura de regressão.
