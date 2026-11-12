# Palco Flow — integração de produção (12/11/2026)

## Entrega
Nova janela 2D de equipe na arena, com orquestrador fixo, criação e exclusão de auxiliares, seleção de atividade individual, expressões e animações específicas de planejamento, produção e revisão. Não existem auxiliares por padrão. Toda atribuição é registrada como ação do orquestrador; não há comunicação direta agente-agente nem chamada externa de IA. Os dados ficam no localStorage do navegador.

## Arquivos e responsabilidades
- `frontend/paginas/painel/palco-flow.js`: estado local, catálogo de funções, perfis, atividades, histórico, persistência e interação.
- `frontend/paginas/painel/palco-flow.css`: personagens 2D, cenário não orbital, layout responsivo, controles touch e prefers-reduced-motion.
- `agentes-orbitais.html`: botão sempre acessível e estrutura do diálogo.
- `scripts/scripts-gerar-demo-publica.js`: inclui os dois arquivos na exportação estática.

Para estender, crie um componente JS/CSS separado em `frontend/paginas/painel/`, importe ambos na página e inclua os arquivos na lista do gerador público. Evite dependências de API privada na demo.

## Limites e próximos gates
A equipe do palco ainda não sincroniza com o estado do backend nem com os agentes Canvas. O registro não é um histórico auditável do servidor. Testar com navegador real: primeira abertura sem auxiliares, criação/edição/exclusão, persistência, responsividade 360px, navegação por teclado, reduced motion e exportação estática. Não publicar como versão validada antes dos gates.
