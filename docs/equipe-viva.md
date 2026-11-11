# Equipe Viva — Ander Flow

## Experiencia

No primeiro acesso, o painel apresenta o cadastro do orquestrador fixo. O nome padrao e **Chefinho**. Nenhum auxiliar e criado automaticamente. Em **Equipe**, o usuario escolhe funcao, nome, personalidade e animacao de cada ajudante. Os mascotes 2D possuem olhos que piscam, acessorios por funcao e animacoes leves; a preferencia de movimento reduzido do sistema e respeitada.

Em **Conversas**, todas as mensagens passam pelo orquestrador. Os auxiliares nao conversam diretamente entre si. As respostas atuais sao **simuladas localmente** e nao devem ser anunciadas como integracao real com modelos de IA. O estado e armazenado no localStorage do navegador, nao em banco remoto; nao usar para dados sigilosos.

## Arquivos

- `frontend/componentes/equipe-viva.js`: onboarding, perfis, orquestracao demonstrativa e historico.
- `frontend/componentes/equipe-viva.css`: aparencia 2D, modal responsivo e animacoes.
- `frontend/paginas/painel/painel.js`: API de desligamento e configuracao dos agentes do motor.
- `frontend/componentes/central-missoes.js`: encaminhamento pelo orquestrador.
- `scripts/scripts-gerar-demo-publica.js`: inclusao no pacote estatico.
- `scripts/scripts-testar-demo-publica.js`: smoke de cadastro, recado e cenarios existentes.

## Pendencias

A equipe ainda nao tem motor de IA conectado; faltam controles de autorizacao por agente, persistencia sincronizada, testes visuais com capturas e verificacao de publicacao. Nao integrar corretoras nem enviar ordens reais.
