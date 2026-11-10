# CHANGELOG

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
