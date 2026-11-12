# CHECKLIST — Trading Pages v14

Legenda: [x] feito e testado · [~] em andamento · [ ] falta · [!] decisão/limitação

## Fundação
- [x] Express 5 + Helmet + Compression
- [x] SQLite com migrações incrementais
- [x] Porta 4312 com faixa de fallback e portas proibidas
- [x] PID/porta em .execucao
- [x] Trava contra segunda instância local + limpeza de PID obsoleto
- [x] Compatibilidade com PORT de plataforma
- [x] .env e banco fora do Git
- [x] Versionamento 14.0.0

## Movimentos temáticos v14
- [x] Somente Cosmo usa órbita contínua
- [x] 19 temas não-Cosmo com formação e deslocamento próprios
- [x] Guias visuais por categoria sem anéis orbitais genéricos
- [x] Rastros seguem deslocamento temático real
- [x] HUD mostra movimento correto do tema
- [x] Botão de trajetória orbital fica disponível somente no Cosmo
- [x] QA Chrome percorre todos os 20 temas
- [x] 19 assinaturas geométricas distintas fora do Cosmo
- [x] Separação mínima >= 1,0x a soma dos raios
- [x] Continuidade de movimento sem teletransporte
- [x] Desktop/mobile sem overflow nos temas representativos

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
- [x] Slots orbitais dinâmicos por anel
- [x] Repulsão suave com mola/amortecimento
- [x] Separação reforçada específica no Cosmo
- [x] Micro-movimento reduzido conforme densidade de agentes
- [x] Rastros alinhados com a posição visual coreografada
- [x] Fila contextual com apenas uma fala visual ativa
- [x] Falas por papel/evento com cooldown e prioridade
- [x] Placa central removida; progresso integrado ao núcleo
- [x] Gate visual mede distância mínima entre agentes em Pixel e Cosmo

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
- [x] 68 testes unitários/integrados
- [x] Smoke HTTP com health, login, sessão e diagnóstico
- [x] Smoke 2FA
- [x] Auditoria de segurança em 6 frentes
- [x] Screenshot Cosmo desktop/mobile
- [x] Screenshot Configurações desktop/mobile
- [x] Zero overflow nos viewports testados
- [x] Zero erros de console no teste visual
- [~] PT-BR ↔ EN completo — legado ainda pendente

## Onda 2026-11-11 — Agenda semanal (branch de evolução)
- [~] Agenda semanal de missões com seleção de dia, navegação entre semanas, horários, filtros, conclusão manual e exclusão.
- [~] Persistência local e integração no painel e gerador da demonstração; commits enviados, mas sem validação visual/CI nesta onda.
- [ ] Executar CI, teste visual 360px/desktop, smoke e auditoria antes de merge.
- [ ] Publicar em URL canônica e arquivar release no Drive após validação.
- [!] Agenda é planejamento manual; não aciona IA nem ordens financeiras.
\n## Integração Foco + Diário (branch, pendente de QA)\n- [~] Sessão manual de foco vinculada a missão e agenda\n- [~] Registrar resultado de sessão no Diário, com origem e identificador rastreável\n- [ ] Testar fluxo completo desktop/mobile, persistência e recarga\n- [ ] Publicar demo canônica após gates verdes\n- [ ] Enviar release versionada ao Google Drive correto\n
## Onda 2026-11-12 — Linha do Tempo Flow (branch)
- [x] Implementação de painel visual, filtros de tipo/período/busca, agrupamento diário e exportação JSON.
- [x] Integração HTML/CSS/JS com gerador de demo estática.
- [x] Conversas novas registram data ISO real, sem fabricar datas para histórico legado.
- [ ] Gate CI/Chrome desktop e mobile da nova onda — ainda não comprovado.
- [ ] Publicação canônica — Vercel bloqueada por limite diário HTTP 402.
- [ ] Release Drive versionada — aguardando validação dos gates.
- [!] Histórico derivado de estado local; não é auditoria imutável.

## Onda 2026-11-12 — Estação de Revisão Flow
- [~] Painel visual 2D de revisão humana de despachos, integrado à Equipe e Sala Flow na branch.
- [~] Aprovação com três critérios e evidência textual; devolução reabre despacho; persistência local.
- [ ] Validar fluxo E2E, mobile e CI da branch.
- [ ] Publicar URL canônica e enviar release versionada ao Drive.
- [!] A revisão é manual e não comprova execução de IA ou testes automatizados.
