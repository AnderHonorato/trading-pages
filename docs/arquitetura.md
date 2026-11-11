# Equipe Viva — arquitetura de agentes (Ander Flow)

## Primeira abertura
A aplicação inicializa sem agentes auxiliares ativos. O diálogo `#flow-inicio` solicita um nome e uma personalidade para o orquestrador central, cujo nome padrão é **Chefinho**. O núcleo/orquestrador não é removível. Os agentes só surgem na simulação quando o usuário seleciona **Criar agente**.

## Como os módulos são organizados
- `frontend/componentes/equipe-viva.js`: catálogo por função, cadastro, edição de nomes, personalidade, animação, exclusão, persistência e mensagens mediadas.
- `frontend/componentes/equipe-viva.css`: interface 2D, mascotes vivos, estados vazios, controles por toque e modo de movimento reduzido.
- `frontend/paginas/painel/painel.js`: motor da arena, métodos `desligarTodos` e `configurarAgente`, entrada visual e remoção de transferências diretas.
- `frontend/componentes/central-missoes.js`: painel que usa a mesma equipe e encaminha transferências pelo orquestrador.
- `scripts/scripts-gerar-demo-publica.js`: inclui os novos arquivos na demo pública.
- `scripts/scripts-testar-demo-publica.js`: percorre onboarding vazio, cadastro, recados, edição de líder, persistência, cenários e controles.

## Fluxo de mensagens
Usuário → Chefinho → agente(s) → Chefinho → usuário. A interface registra cada trecho do encaminhamento com remetente e destinatário. Nem os formulários nem a API de missões devem permitir uma conversa direta agente-agente.

Exemplo de uso: crie Lupinha para análise e Escudinho para segurança, personalize seus nomes e personalidades, abra **Conversas**, escolha “Todos” e envie um pedido. O histórico exibirá o encaminhamento do Chefinho para cada destinatário e o retorno individual a ele.

**Limitação intencional:** o fluxo atual é uma simulação local, sem conexão com modelo de IA ou execução real de tarefas. As respostas são definidas por função. Mensagens e personalidades ficam em `localStorage` do navegador (`anderflow.equipe.v1`): não devem conter segredos ou credenciais. Não se sincronizam automaticamente entre aparelhos.

## Evolução futura
1. Contratos de mensagens com IDs de agentes, timestamps e destinatários autorizados.
2. Persistência de equipes e conversas no servidor com autenticação, migração e exclusão pelo usuário.
3. Fila de trabalhos comandada pelo Chefinho, ligando atividades reais ao motor visual.
4. Streaming de eventos e animações associados ao estado efetivo de cada ferramenta.
5. Visualizações e comportamentos próprios por função em cada cenário sem reutilizar órbitas fora do Cosmos.

## Testes
Na raiz do repositório: `npm run testar:demo-publica`, `npm run testar`, `npm run verificar`. Capturas de desktop/mobile são gravadas apenas em `.execucao/`.

## Modulo de acompanhamento de missoes

`frontend/componentes/acompanhamento-missoes.js` depende de `window.FlowTarefas` e `window.FlowEquipe`, sendo carregado apos `atelie-missoes.js`. Renderiza indicadores, filtros, busca e exportacao JSON no painel existente. `frontend/componentes/acompanhamento-missoes.css` isola o estilo responsivo. O Atelie identifica cada cartao pelo atributo `data-tarefa-id`; um MutationObserver acompanha apenas alteracoes na lista. Para criar extensoes, use as APIs publicas e eventos, sem alterar o armazenamento diretamente. Dados exportados permanecem locais, sem envio ao servidor. Teste com `npm run testar:demo-publica`.

## Diario de missoes (11/11/2026)
O Atelie agora registra acoes manuais de criacao, avancos, retornos e exclusoes em `anderflow.historico-missoes.v1`, separado das tarefas. O Chefinho aparece como mediador nos registros; isso NAO representa comunicacao com IA externa. O historico fica no navegador (maximo 120 eventos) e pode ser exportado como JSON. O painel oferece retorno de etapa, sem automatizar tarefas. Codigo: `frontend/componentes/atelie-missoes.js` e estilos em `frontend/componentes/atelie-missoes.css`. Validar no teste `npm run testar:demo-publica`.

## Mural de missoes
Criar `frontend/componentes/mural-missoes.js` e `mural-missoes.css` na pasta existente. Importar CSS apos `acompanhamento-missoes.css` e JS apos `acompanhamento-missoes.js` no `agentes-orbitais.html`; copiar ambos no gerador de demo. O modulo consome `window.FlowTarefas` e `window.FlowEquipe`, sem duplicar persistencia, autenticar ou chamar provedores. `FlowMural.mover(id,estado)` utiliza `avancar/voltar` e gera eventos de historico. Testar com `npm run testar:demo-publica` e `npm run testar`. O arrastar HTML nativo atende mouse; botoes atendem toque e teclado. Sem dados de corretora.


## Sala de Comando — 11/11/2026
Arquivos novos: `frontend/componentes/sala-comando.js` e `frontend/componentes/sala-comando.css`, carregados apos o mural no HTML e copiados pelo gerador da demo. O modulo consome apenas `window.FlowTarefas` e `window.FlowEquipe`; nao cria nova persistencia. Para criar os arquivos, coloque JS/CSS em `frontend/componentes/`, importe CSS no `<head>` e JS apos `mural-missoes.js`. Exemplo: `window.FlowSala.abrir()` abre painel; `window.FlowTarefas.avancar(id)` atualiza etapa e diario. Inclui busca, filtro por responsavel, indicadores, progresso, retorno/avanco, historico por missao e exportacao JSON. Nao realiza execucao real de IA nem trading. Validar em navegador, desktop e 360px; observar reduced-motion.