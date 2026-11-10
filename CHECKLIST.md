# CHECKLIST — Trading Pages v11

Legenda: [x] feito e testado · [~] em andamento · [ ] falta · [!] decisão/limitação

## Fundação
- [x] Branch v11 criada
- [x] Express 5 + Helmet + Compression
- [x] SQLite com migrações
- [x] Porta 4312 com faixa de fallback e portas proibidas
- [x] PID/porta em .execucao
- [x] .env e banco fora do Git

## Cosmo e animação
- [x] Buraco negro central fixo no Cosmo
- [x] Órbitas elípticas e mesmo sentido orbital
- [x] Rotação própria visual
- [x] Planetas menores e mais espaçados
- [x] Placas/nome/status removidos dos planetas no Cosmo
- [x] Olhos, boca e humores reativos
- [x] Meteoros, cometas e planetas menores atingem agentes
- [x] Planetas não disparam no Cosmo
- [x] Núcleo absorve em espiral em vez de atirar para eliminar
- [x] Outros temas herdam perigos e absorção com linguagem temática
- [x] Mobile reorganizado sem a placa central textual

## Segurança
- [x] Senha com crypto.scrypt + salt
- [x] Sessão com token aleatório e apenas hash no banco
- [x] Cookie HttpOnly / SameSite=Lax / Secure em produção
- [x] CSRF nas rotas de alteração
- [x] CSP sem unsafe-inline e sem unsafe-eval
- [x] Corpo limitado a 100 kB
- [x] Timeouts e limite de cabeçalho
- [x] Bloqueio progressivo persistente de 1 min a 24 h
- [x] Auditoria de login, senha, APIs e 2FA
- [x] 2FA TOTP + 8 códigos de recuperação
- [x] API keys criptografadas AES-256-GCM
- [x] npm audit sem vulnerabilidades conhecidas

## Conta/Admin
- [x] Admin `ander` criado
- [x] Senha temporária aleatória, não versionada
- [x] Troca obrigatória no primeiro acesso
- [x] Logout revoga sessão
- [x] Página privada de APIs
- [x] OpenAI, Anthropic, DeepSeek, xAI, Gemini e OpenRouter
- [ ] Recuperação por e-mail — depende de provedor de e-mail; não implementada nesta onda
- [ ] Gerenciamento visual de todas as sessões — serviço de sessão existe, tela dedicada ainda não

## Acesso
- [x] localhost: http://127.0.0.1:4312
- [x] bind LAN em 0.0.0.0
- [x] IP LAN detectado: http://192.168.1.3:4312
- [!] Windows Firewall: regra automática recusada por falta de elevação; helper LocalSubnet criado
- [!] Teste direto no A35 não executado porque o Bridge está offline

## Verificação
- [x] Testes unitários e integração
- [x] Smoke HTTP de login/CSP/sessão/logout
- [x] Smoke 2FA ponta a ponta
- [x] Screenshot desktop 1440
- [x] Screenshot mobile 390
- [~] PT-BR ↔ EN completo — legado ainda pendente
