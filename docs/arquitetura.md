# Arquitetura incremental — Sala de Despacho Flow

A aplicação demonstrativa mantém a arena legada e acrescenta módulos independentes em `frontend/paginas/equipe/`. A página `equipe.html` importa `equipe.css`, `despacho-flow.css`, `equipe.js`, `missoes-flow.js` e `despacho-flow.js` nessa ordem. Não são necessárias dependências novas.

## Criar e manter arquivos
- `frontend/paginas/equipe/equipe.html`: estrutura semântica, navegação por abas e formulários.
- `frontend/paginas/equipe/equipe.js`: onboarding do Chefinho, CRUD de auxiliares e roteamento local de mensagens.
- `frontend/paginas/equipe/missoes-flow.js`: criação e quadro Kanban de missões.
- `frontend/paginas/equipe/despacho-flow.js`: painel operacional, quatro estações visuais, filtros, mudança de etapa/responsável e diário de evidências.
- `frontend/paginas/equipe/despacho-flow.css`: identidade 2D de oficina, mobile e reduced-motion.
- `scripts/scripts-gerar-demo-publica.js`: empacota os módulos para GitHub Pages.

## Contratos locais
- `ander-flow-equipe-v1`: objeto `{versao,chefe,agentes,mensagens}`; inicia sem agentes.
- `ander-flow-missoes-v1`: array de `{id,titulo,responsavel,etapa,criada,alterada?}`; etapas: `fila`, `fazendo`, `revisao`, `concluida`.
- `ander-flow-despacho-v1`: objeto indexado pelo ID da missão, com entradas `{texto,quando}` (máximo 30 por missão).
- Evento de mesmo documento `flow:missoes-atualizadas` após gravação. Evento `storage` para sincronização entre abas do navegador.
- Todos os campos exibidos são escritos com `textContent`, não `innerHTML`; não há chamada a IA ou corretora.

## Verificação
No checkout da branch: `node --check frontend/paginas/equipe/despacho-flow.js`, `node --check frontend/paginas/equipe/equipe.js`, `node --check frontend/paginas/equipe/missoes-flow.js`, `node scripts/scripts-gerar-demo-publica.js`, `npm test`. Validar 360 px, desktop, navegação por teclado, armazenamento, edição de missão e movimento reduzido antes de merge/publicação.

## Oficina viva Flow (evolucao de 12/11/2026)
- `frontend/paginas/equipe/oficina-viva.js`: renderiza postos de personagens da equipe real do navegador, filtra missoes por agente e altera etapa/responsavel no mesmo contrato `ander-flow-missoes-v1`.
- `frontend/paginas/equipe/oficina-viva.css`: cenografia 2D em postos de trabalho, expressoes animadas, layout 360 px e reducao de movimento. Nao utiliza orbitas.
- `equipe.html` importa os dois arquivos; `equipe.js` alterna a aba Oficina viva; `scripts/scripts-gerar-demo-publica.js` inclui os novos assets no build estatico.
- Aceite pendente: executar build, testes e validar navegacao/touch no navegador real antes de merge/deploy.

## Linha do Tempo Flow (13/11/2026)
- `frontend/paginas/equipe/memoria-flow.js`: compoe uma cronologia local de criacao, ultima alteracao e notas de cada missao, com filtros por tipo/periodo, resumo, exportacao JSON e navegacao para o Despacho. Nao fabrica historico anterior: apenas o ultimo estado e as notas existentes podem ser recuperados.
- `frontend/paginas/equipe/memoria-flow.css`: estacoes visuais 2D, trilha cronologica, responsividade e movimento reduzido.
- `equipe.html` e `equipe.js`: aba Linha do tempo e seus controles. `despacho-flow.js`: evento `flow:abrir-missao` seleciona a missao e `flow:diario-atualizado` sincroniza o diario. `scripts/scripts-gerar-demo-publica.js`: copia os novos arquivos para a demo.
- Aceite ainda exige build, navegador 360 px e desktop, clique de ida e volta, exportacao e atualizacao ao salvar notas.
