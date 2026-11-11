# CHANGELOG

## Não lançado — 2026-11-11 — Equipe Viva
- Primeiro acesso sem agentes auxiliares, com onboarding para nome/personalidade do orquestrador fixo (padrão Chefinho).
- Criação, personalização e remoção de agentes por função, com mascotes 2D e animações individuais.
- Nova interface Equipe e Conversas, com recados obrigatoriamente mediados pelo orquestrador e histórico local.
- Central de Missões conectada ao novo catálogo, removendo transferências diretas agente-agente.
- Teste no Chrome cobrindo cadastro vazio, personalização, persistência e fluxo das mensagens.
- Conversas demonstrativas e armazenamento local; ainda sem integração de IA remota.

## 12.0.0 — 2026-11-10
### Adicionado
- Gestão visual de sessões/dispositivos.
- Revogação individual e encerramento das outras sessões.
- Health check público mínimo em `/api/saude`.
- Diagnóstico autenticado em `/api/diagnostico`.
- Métricas de requisições, latência, memória e uptime.
- `X-Request-Id` e tratamento de erro estruturado.
- Testes de isolamento de sessão e observabilidade.
- Validação visual da página de configurações em desktop/mobile.
- Reciclagem automática por relevância portada de `main` para o motor v12.
- Substituição por afinidade de função, proteção do recém-chegado e cooldown do agente removido.
- Execução do sentenciado por sucção no Cosmo, sem reintroduzir projéteis dos planetas.

### Alterado
- Configurações reorganizadas em Conta, Saúde, Sessões e Integrações.
- Migração 003 adiciona `ultimo_acesso_em` às sessões.
- Pacote atualizado para 12.0.0.

## 11.0.0 — 2026-11-09
### Adicionado
- Cosmo vivo com buraco negro, órbitas elípticas, meteoros, sucção e humores.
- Login administrativo, 2FA e configurações criptografadas de APIs.
- CSP, CSRF, rate limit persistente e auditoria.
- Acesso LAN e suíte inicial de testes/segurança.

### Correções de infraestrutura da v12
- Servidor local impede segunda instância quando o PID registrado ainda está ativo.
- PID obsoleto é removido automaticamente.
- Encerramento remove somente o PID pertencente ao próprio processo.
- Plataformas de hospedagem podem fornecer `PORT`; nesse caso a porta é usada exatamente como atribuída e a trava local por PID não é aplicada.

### Deploy público seguro
- Bootstrap opcional de administrador por variáveis de ambiente somente quando o banco está vazio.
- O bootstrap não imprime senha em logs e nunca substitui usuários já existentes.

### CI/CD e releases
- Workflow GitHub Actions em `.github/workflows/ci-release.yml` para pushes no `main`, PRs e execução manual.
- Gates automáticos: sintaxe/estrutura, 42+ testes, auditoria interna, `npm audit`, smoke HTTP, 2FA e visual desktop/mobile.
- Release só é publicado quando todos os gates passam; falhas geram artefato de diagnóstico separado.
- Pacote de release usa `git archive`, sem `.env`, banco local ou arquivos ignorados.
- Teste visual tornou-se portátil entre Windows e Linux via descoberta de Chrome/Chromium.

### Demo pública visual
- Gerador isolado em `scripts/scripts-gerar-demo-publica.js` cria um site estático sem autenticação, banco, sessões, `.env` ou chaves.
- Endpoints privados são substituídos por JSONs locais explicitamente simulados.
- Teste visual dedicado valida 1440 px e 390 px com zero overflow e zero erros de console.
- Workflow `pages-demo.yml` publica somente `.site-publico` no GitHub Pages.
- URL canônica `https://anderhonorato.github.io/trading-pages/` validada após deploy com HTTP 200, Cosmo funcional e zero erros de console.
`n## 2026-11-11 - Aquario Vivo`nNovo modulo frontend/animacoes/aquario-vivo.js com cardume independente, plantas, raios e bolhas deterministas. Toque na arena cria alimento; peixes proximos reagem. Integrado ao Canvas apenas no tema aquario; Cosmos preserva orbitas. Demo publica copia o modulo. Teste E2E valida cardume e toque.`n

## 2026-11-11 - Oficina dos Inventos interativa
- Nova linha de montagem 2D com cinco maquinas, engrenagens, esteira, iluminacao, faiscas e pecas fabricadas por toque.
- Modulo independente em frontend/animacoes/oficina-viva.js, sem movimentacao orbital no cenario.

## 2026-11-11 - Deserto Vivo
- Caravana de cinco exploradores, dunas, ruinas, oases descobertos por toque e tempestade acionavel.
- Modulo de animacao independente e painel mobile de exploracao.


- 2026-11-11: Atelie de missoes, quadro touch com criacao e progresso manual de tarefas, personagens 2D por estado e persistencia local; demonstrativo sem IA executora.
