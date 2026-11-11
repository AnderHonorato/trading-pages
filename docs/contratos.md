# Contratos — Trading Pages v11

## Autenticação
- `GET /api/autenticacao/iniciar` → entrega CSRF anônimo e cookie double-submit.
- `POST /api/autenticacao/entrar` → recebe `usuario`, `senha` e, quando ativo, `codigo2fa`.
- `GET /api/autenticacao/sessao` → nunca retorna token de sessão; retorna estado, papel, CSRF e 2FA.
- `POST /api/autenticacao/sair` → exige sessão + CSRF e revoga a sessão.
- `POST /api/autenticacao/trocar-senha` → exige sessão + CSRF; revoga todas as sessões após troca.
- `POST /api/autenticacao/2fa/preparar|ativar|desativar` → exige sessão + CSRF.

## Configurações de IA
- `GET /api/configuracoes/apis` → lista somente provedor/modelo/ativo/configurada.
- `PUT /api/configuracoes/apis/:provedor` → recebe chave; cifra AES-256-GCM; nunca a devolve.
- Provedores: OpenAI, Anthropic, DeepSeek, xAI, Gemini e OpenRouter.

## Sessão
- Cookie: `trading_sessao`, HttpOnly, SameSite=Lax e Secure quando `MODO_PRODUCAO=true`.
- Banco armazena apenas SHA-256 do token bruto.
- Expiração padrão: 8 horas, configurável.

## Canvas orbital
- Cosmo: sem disparos dos planetas.
- Eventos externos: meteoro, cometa e planeta menor.
- Eliminação do núcleo: absorção em espiral para dentro do buraco negro.
- Planetas: órbita elíptica, mesmo sentido orbital, rotação própria visual, vida e humor.
- Outros estilos: reutilizam a lógica de perigos/absorção com representação temática.

## Erros
A API retorna códigos como `credenciais_invalidas`, `csrf_invalido`, `2fa_necessario`, `muitas_tentativas`.

## Sessões v12
- `GET /api/autenticacao/sessoes` → lista somente sessões ativas do usuário autenticado, sem token/CSRF.
- `DELETE /api/autenticacao/sessoes/:id` → revoga apenas sessão pertencente ao usuário atual; exige CSRF.
- `POST /api/autenticacao/sessoes/encerrar-outras` → revoga outras sessões e preserva a atual; exige CSRF.

## Observabilidade v12
- `GET /api/saude` → health mínimo público: estado, versão, uptime, banco e horário.
- `GET /api/diagnostico` → exige autenticação e retorna métricas agregadas de requisições, processo e banco.
- Todas as respostas passam pelo middleware de `X-Request-Id`.
`nAquarioVivo.desenhar(ctx, largura, altura, tempo, delta): renderiza apenas cena visual; alimentar(x,y): adiciona alimento; estado(): retorna contagens, sem backend.

### Contrato publico do mural (2026-11-11)
`window.FlowMural.abrir()` abre o Atelie em modo mural. `window.FlowMural.listar()` retorna copias de tarefas locais. `window.FlowMural.mover(id,estado)` aceita `fila`, `andamento`, `revisao` e `concluida`, devolvendo booleano; cada transicao usa `FlowTarefas.avancar/voltar`, sem acesso a corretora ou IA. Nenhuma rota REST nova.
