# Planejamento de missões — evolução de 13/11/2026

## Implementação
A Central de Missões possui busca por título, notas e responsável; prioridade na ordenação; planejamento por etapas; progresso visual; prazo; troca de responsável; e histórico de alterações por missão. O estado é salvo localmente sob a chave `ander-flow-missoes-v1` com compatibilidade com missões anteriores sem `etapas`, `atividade` ou `prazo`.

## Fluxo de uso
1. Abra **Missões**, crie uma missão e selecione **Detalhes**.
2. Adicione etapas, marque como concluídas, ajuste prazo e responsável.
3. Observe a barra de progresso e o histórico; filtre e busque missões.
4. Reabra a página para conferir persistência. Nenhuma ação aciona IA externa nem corretora.

## Arquitetura
`frontend/paginas/painel/central-missoes.js` controla estado, persistência, renderização e eventos. `central-missoes.css` apresenta o planejamento responsivo. A ponte `ponte-equipe-arena.js` continua sincronizando perfis, sem alterar o mecanismo financeiro.

## Verificação obrigatória antes do merge
`npm run verificar`, `npm run testar`, `npm run testar:http`, `npm run testar:2fa`, `npm run auditar:seguranca`, `npm audit --omit=dev`, `npm run testar:visual`. Inspecionar no navegador desktop e 360 px: onboarding, etapas, busca, filtros, persistência, alterações de equipe e redução de movimento. Não marcar publicação sem evidência.

## Pendências
A versão pública do GitHub Pages não recebe automaticamente esta branch. O backend full-stack permanece separado da demonstração estática. A persistência atual é por navegador, sem sincronização entre dispositivos. O Canvas legado ainda exige revisão para eliminar toda criação automática de agentes.
