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
