# CHANGELOG

## 13.0.0 — 2026-11-10
### Adicionado
- Módulo `orbital-coreografia.js` com distribuição regular de fases, interpolação angular e separação suave.
- Módulo `conversa-contextual.js` com falas por papel/evento, prioridade e cooldown.
- API visual segura `layout()` para QA de colisão sem expor sessão, token ou dados sensíveis.
- Gate visual que mede distância mínima entre agentes em Pixel e Cosmo.

### Alterado
- Agentes da mesma órbita agora ocupam slots dinâmicos e preservam ordem durante o movimento.
- Micro-movimento foi desacelerado e reduzido conforme a densidade para evitar sensação de tremor/caos.
- Separação do Cosmo foi reforçada para impedir aproximação excessiva entre planetas de órbitas diferentes.
- Rastros usam o ângulo visual coreografado em vez do ângulo bruto.
- Comunicação visual limitada a uma fala ativa, posicionada para fora do centro da arena.
- Falas genéricas foram substituídas por mensagens contextuais e claramente simuladas.
- Placa central `OBSERVANDO` foi removida; nível/progresso agora aparecem de forma integrada ao núcleo.
- Ritmo de eventos foi reduzido para melhorar legibilidade e sensação de coordenação.
- Pacote, health/status, demo pública e CI foram atualizados para 13.0.0.

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
