# Central de Missões — versão experimental

A rota autenticada `/central-missoes` apresenta a equipe local do navegador. No primeiro acesso, solicita nome e personalidade do orquestrador fixo (padrão Chefinho), sem criar auxiliares automaticamente. A arena oferece acesso por **Equipe e Missões**.

Arquivos: `frontend/paginas/missoes/missoes.html` (estrutura sem scripts inline), `missoes.css` (responsividade e movimento reduzido), `missoes.js` (estado, formulários e roteamento). O servidor registra a rota em `servidor/servidor.js`. Para ampliar, adicionar módulos nesta pasta e importá-los no HTML, preservando a CSP.

O histórico guarda `origem`, `destino`, `texto`, `data`; cada encaminhamento é **Você → Orquestrador → Auxiliar**, nunca Auxiliar → Auxiliar. A opção Todos distribui individualmente. Sem auxiliares, a missão permanece como registro local. Não há execução de tarefas por IA, API remota ou corretora. Os dados ficam em `localStorage` por navegador, com limite de 120 eventos; não são sincronizados com o banco. Exclusão de agente não apaga histórico antigo. O módulo não modifica a lista de agentes do motor visual legado: integração unificada com API e migração ainda são pendências.

Critérios de QA pendentes: executar navegador autenticado em 360/390/1440 px, persistência após recarga, fluxo de criação/edição/exclusão, foco no diálogo, CSP, redução de movimento, teclado e isolamento de sessão. Não publicar até validação.

## Acompanhamento individual — 12/11/2026

O Quadro Vivo agora mostra uma barra de progresso por missão, uma linha por auxiliar atribuído e botões para concluir/reabrir cada tarefa individual. Quando todos concluem, a missão passa automaticamente a concluída; a reabertura geral limpa os marcadores para um novo ciclo. A exclusão de um agente remove sua atribuição das missões abertas e move missões sem destinatário para aguardando equipe. Cada alteração registra evento local com origem no orquestrador. Não há processamento automático de IA: a conclusão é manual e demonstrativa.

**Pendente de validação:** CI da branch, teste visual mobile/desktop autenticado e deploy. A atualização do código não equivale à publicação.
