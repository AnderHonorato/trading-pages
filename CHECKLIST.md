# CHECKLIST — Trading Pages v12

Legenda: [x] feito e testado · [~] em andamento · [ ] falta · [!] decisão/limitação

## Fundação
- [x] Express 5 + Helmet + Compression
- [x] SQLite com migrações incrementais
- [x] Porta 4312 com faixa de fallback e portas proibidas
- [x] PID/porta em .execucao
- [x] Trava contra segunda instância local + limpeza de PID obsoleto
- [x] Compatibilidade com PORT de plataforma
- [x] .env e banco fora do Git
- [x] Versionamento 12.0.0

## Cosmo e animação
- [x] Buraco negro central fixo no Cosmo
- [x] Órbitas elípticas e mesmo sentido orbital
- [x] Rotação própria visual
- [x] Planetas menores e mais espaçados
- [x] Placas/nome/status/balões removidos dos planetas no Cosmo
- [x] Olhos, boca e humores reativos
- [x] Meteoros, cometas e planetas menores atingem agentes
- [x] Planetas não disparam no Cosmo
- [x] Núcleo absorve em espiral em vez de atirar
- [x] Outros temas herdam perigos e absorção com linguagem temática
- [x] Reciclagem automática do agente menos relevante
- [x] Sentenciado usa sucção no Cosmo em vez de disparo
- [x] Substituto herda órbita/função e recebe período de proteção
- [x] Agente removido entra em cooldown e pode voltar futuramente
- [x] Mobile sem overflow

## Segurança
- [x] Senha com crypto.scrypt + salt
- [x] Sessão com token aleatório e apenas hash no banco
- [x] Cookie HttpOnly / SameSite=Lax / Secure em produção
- [x] CSRF nas rotas de alteração
- [x] CSP sem unsafe-inline e sem unsafe-eval
- [x] Corpo limitado a 100 kB
- [x] Timeouts e limite de cabeçalho
- [x] Bloqueio progressivo persistente de 1 min a 24 h
- [x] Auditoria de login, senha, APIs, 2FA e revogação de sessões
- [x] 2FA TOTP + 8 códigos de recuperação
- [x] API keys criptografadas AES-256-GCM
- [x] Isolamento de sessões por usuário
- [x] npm audit sem vulnerabilidades conhecidas

## Conta/Admin
- [x] Admin local com senha temporária e troca obrigatória
- [x] Logout revoga sessão
- [x] Gestão visual de sessões/dispositivos
- [x] Encerrar sessão individual
- [x] Encerrar todas as outras sessões
- [x] Página privada de APIs
- [x] OpenAI, Anthropic, DeepSeek, xAI, Gemini e OpenRouter
- [ ] Recuperação por e-mail — depende de provedor de envio
- [ ] Teste real de conectividade de cada provedor

## Observabilidade
- [x] GET /api/saude mínimo e público
- [x] GET /api/diagnostico protegido
- [x] X-Request-Id em requisições
- [x] Métricas de total/status/latência/memória/uptime
- [x] Métricas de sessões ativas e auditoria 24h
- [x] Handler de erro com log estruturado sem stack para cliente
- [ ] Persistência/histórico de métricas
- [ ] Alertas externos

## Acesso e entrega
- [x] localhost
- [x] bind LAN em 0.0.0.0
- [x] helper de firewall LocalSubnet
- [!] Link público full-stack — Railway bloqueado por trial expirado; não foi criado deploy efêmero inseguro
- [x] Demo pública visual GitHub Pages — online, HTTP 200 e validada em 1440 px/390 px sem overflow ou erros de console
- [x] Release Google Drive — artefato validado do main enviado e conferido
- [x] CI GitHub com testes, segurança, smoke, visual e release condicionado ao sucesso

## Verificação
- [x] 47 testes unitários/integrados
- [x] Smoke HTTP com health, login, sessão e diagnóstico
- [x] Smoke 2FA
- [x] Auditoria de segurança em 6 frentes
- [x] Screenshot Cosmo desktop/mobile
- [x] Screenshot Configurações desktop/mobile
- [x] Zero overflow nos viewports testados
- [x] Zero erros de console no teste visual
- [~] PT-BR ↔ EN completo — legado ainda pendente

- [x] Central de missoes visual e funcional integrada aos agentes; fluxo browser E2E.

\n- [x] Aquario Vivo com cardume, bolhas, plantas e alimentacao por toque

- [x] Oficina dos Inventos: fabrica interativa em Canvas com cinco maquinas e fabricacao por toque (branch de evolucao; deploy pendente).

- [x] Deserto Vivo: caravana e oases interativos (branch de desenvolvimento)
- [ ] Publicar e validar no dominio canonico


## Mural vivo (11/11/2026)
- [x] Quatro colunas interativas e animacao 2D de personagem por missao
- [x] Movimento desktop por arrastar e toque mobile por botoes de 44px
- [x] Persistencia de etapa e registro no Diario do Chefinho
- [x] Teste Playwright do fluxo e capturas desktop/mobile
- [ ] Arrastar por gesto de toque nativo; controles acessiveis substituem gesto por enquanto


## Sala de Comando — 11/11/2026
- [x] Sala de Comando: nova interface de acompanhamento, filtros, indicadores, progresso e exportacao integrados ao codigo de producao da branch.
- [ ] Validar interacoes desktop/mobile, teste E2E e publicacao canonica (PC offline nesta execucao).
- [ ] Entrega versionada no Drive apos gates verdes.