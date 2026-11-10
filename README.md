# Trading Pages v12 — Ander Quant OS

Painel orbital visual para orquestração demonstrativa de agentes, com múltiplos estilos, progressão, eventos animados e área administrativa segura.
A base v11 adicionou o **Cosmo vivo**, autenticação real, 2FA, configuração criptografada de provedores de IA e acesso pela rede local. A v12 acrescenta gestão de sessões/dispositivos, health check, métricas de diagnóstico e request IDs.
O projeto permanece em **modo demonstrativo**: não envia ordens financeiras reais e não está conectado a corretora.

## Evoluções v10
- **50 níveis de núcleo** com XP progressivo e nove ascensões visuais depois das cinco formas básicas de cada tema. As formas originais continuam preservadas em níveis altos.
- Evolução individual dos mascotes com ranks e efeitos visuais extras: auras, satélites, anéis e asas energéticas.
- Zoom automático animado ao acrescentar mascotes, raios das órbitas ampliados e separação anticolisão em tela.
- 20 cenários com efeitos ambientais dinâmicos: chuva, neve, folhas, bolhas, estrelas, pixels, sinais digitais, luzes e ondas atmosféricas.
- Interface adaptada para celulares: arena vertical ampliada, rótulos reduzidos quando há mais de 12 mascotes.
- Botões **↑ Nível** e **+ Mascote**, além de Órbita, Duelo e Poder.
- Vida, defesa e eliminação com animação e renovação de agentes.
- **Seleção por relevância:** a cada ciclo o núcleo recalcula relevância usando contribuição recente, atividade, evolução e estabilidade; agentes ocupados ou recém-convocados ficam protegidos.
- O agente elegível com menor relevância é marcado como **SENTENCIADO**, recebe uma execução temática do núcleo, é eliminado e um reserva assume sua vaga orbital.
- O substituto recebe período de proteção, ocupa a órbita/função deixada pelo agente eliminado e inicia uma nova geração. Agentes antigos podem voltar apenas depois de um cooldown longo.
- O painel mostra contador de reciclagens, tempo para a próxima avaliação e o agente ativo com menor relevância.

## Requisitos

- Node.js 22 ou superior
- Git

Confira:

```bash
node -v
git --version
```

## Instalação

### Windows

```powershell
git clone https://github.com/AnderHonorato/trading-pages.git
cd trading-pages
npm.cmd install
Copy-Item .env.exemplo .env
```

### Linux/macOS

```bash
git clone https://github.com/AnderHonorato/trading-pages.git
cd trading-pages
npm install
cp .env.exemplo .env
```

Gere uma chave local de 32 bytes para `CHAVE_CRIPTOGRAFIA`:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Cole o resultado no `.env`. Nunca versione esse arquivo.

## Banco e primeiro administrador

```bash
npm run banco:migrar
npm run admin:criar -- ander
```

O script cria uma senha temporária aleatória e a mostra uma única vez no terminal. O primeiro login obriga a troca da senha.

Se perder o acesso local:

```bash
npm run admin:redefinir -- ander
```

Isso gera uma nova senha temporária, força nova troca e revoga as sessões existentes.

## Desenvolvimento

```bash
npm run desenvolver
```

A porta padrão é `4312`. Se estiver ocupada, o servidor procura a próxima porta livre em uma faixa de 20 portas, ignorando as portas proibidas.

A URL real é impressa no terminal e também registrada em:

- `.execucao/servidor.pid`
- `.execucao/servidor.porta`

## Primeiro boot em hospedagem

Quando o banco de produção estiver vazio, podem ser definidos temporariamente:

- `ADMIN_INICIAL_USUARIO`
- `ADMIN_INICIAL_SENHA`

O servidor cria o primeiro administrador somente se ainda não existir nenhum usuário. A senha não é escrita nos logs. Após confirmar o primeiro login, zere/remova essas duas variáveis no provedor.

## Produção local

```bash
npm run iniciar
```

## Links principais

- `/entrar` — login
- `/trocar-senha` — troca obrigatória do primeiro acesso
- `/painel` — painel orbital protegido
- `/configuracoes/apis` — provedores de IA + 2FA
- `/api/status` — estado protegido do sistema
- `/api/saude` — health check público mínimo, sem segredos
- `/api/diagnostico` — métricas protegidas de processo, requisições e banco

## Acesso pelo Wi-Fi

O servidor escuta em `0.0.0.0`, permitindo acesso por outro aparelho na mesma rede local.

No Windows, execute como administrador:

```text
Liberar Trading Pages no WiFi.cmd
```

O helper abre **somente a porta 4312 para LocalSubnet**. Ele não publica o painel na Internet.

Depois, no celular conectado à mesma rede, abra:

```text
http://IP-DO-PC:4312
```

Exemplo da rede usada no desenvolvimento: `http://192.168.1.3:4312`.

> Se o IP do PC mudar por DHCP, consulte novamente com `ipconfig`.

## Encerrar

```bash
npm run parar
```

Também é possível usar `Ctrl+C`. O script de parada usa o PID registrado pelo próprio projeto e não mata processos por porta.

## Testes e verificações

```bash
npm run verificar
npm run testar
npm run testar:http
npm run testar:2fa
npm run testar:visual
npm run auditar:seguranca
npm audit --omit=dev
```

O teste visual usa Chrome instalado localmente e valida desktop 1440px e celular 390px.

## Segurança

- senha com `crypto.scrypt` e salt aleatório;
- sessão com token aleatório; somente SHA-256 do token fica no banco;
- cookie HttpOnly + SameSite=Lax; Secure quando `MODO_PRODUCAO=true`;
- CSRF em rotas que alteram dados;
- 2FA TOTP com 8 códigos de recuperação de uso único;
- API keys cifradas com AES-256-GCM;
- CSP com Helmet, sem `unsafe-inline` e sem `unsafe-eval`;
- limite de corpo de 100 kB;
- timeouts HTTP e limite de cabeçalhos;
- bloqueio persistente de abuso com progressão de 1 minuto até 24 horas;
- logs de auditoria sem armazenar senhas ou API keys;
- permissões verificadas no servidor.

Para exposição pública na Internet, adicione proteção de borda como Cloudflare, HTTPS, domínio e política de produção. O bind LAN atual não substitui proteção contra DDoS.

## Sessões e observabilidade

Em **Configurações > Conta e integrações** é possível:

- ver sessões/dispositivos ativos;
- identificar a sessão atual;
- revogar uma sessão específica;
- encerrar todas as outras sessões preservando a atual;
- acompanhar versão, uptime, memória, total de requisições, sessões ativas e eventos de auditoria das últimas 24 horas.

Cada resposta HTTP recebe `X-Request-Id` para correlação de erros. Exceções inesperadas geram log estruturado no servidor e a API responde com erro genérico + request ID, sem expor stack trace ao navegador.

## Provedores de IA

A tela **Configurações > APIs** aceita:

- OpenAI
- Anthropic / Claude
- DeepSeek
- xAI / Grok
- Gemini
- OpenRouter

A chave é enviada ao backend, criptografada e não é devolvida ao navegador. A v11 salva/configura os provedores; teste real de conectividade de cada API ainda é etapa posterior.

## Cosmo v11

No estilo Cosmo:

- o núcleo permanece um buraco negro em todos os níveis;
- planetas não atiram;
- meteoros, cometas e planetas menores podem atingir os agentes;
- dano reduz a vida e pode destruir o planeta;
- quando o núcleo elimina um agente, ele é sugado em espiral;
- os planetas orbitam no mesmo sentido em trajetórias elípticas;
- há rotação própria visual;
- olhos e boca mudam conforme humor, dano, ameaça e absorção;
- nomes/status são removidos da arena para evitar poluição;
- o espaçamento aumenta conforme a população;
- o mobile usa navegação compacta e faixas horizontais.

Os demais estilos reutilizam a mesma lógica de perigos e absorção com representação visual adequada ao tema.

## Idioma e tema

As novas telas administrativas usam PT-BR e tema claro/escuro sem flash inicial. A migração completa do painel Canvas legado para PT-BR ↔ EN ainda está pendente e não é marcada como concluída.

## Variáveis do .env

- `PORT` — porta atribuída por plataformas de hospedagem; quando definida, tem prioridade.
- `PORTA` — porta inicial local, padrão 4312.
- `HOST` — bind do servidor; `0.0.0.0` permite LAN.
- `MODO_PRODUCAO` — ativa cookie Secure.
- `TRUST_PROXY` — habilite somente atrás de proxy confiável.
- `BANCO_CAMINHO` — arquivo SQLite local.
- `CHAVE_CRIPTOGRAFIA` — chave Base64 de 32 bytes usada para segredos.
- `SESSAO_HORAS` — duração máxima da sessão.

## Estrutura

- `frontend/paginas/` — telas e painel.
- `frontend/compartilhado/` — tema, interface e física orbital.
- `servidor/rotas/` — módulos HTTP.
- `servidor/seguranca/` — autenticação, CSRF, tráfego, 2FA e hardening.
- `banco/migracoes/` — migrações SQL ordenadas.
- `testes/` — unidade e integração.
- `scripts/` — inicialização, auditoria, smoke e recuperação local.
- `docs/` — contratos, decisões, debate e auditoria.

## Git

Nunca envie:

- `.env`
- `banco/dados/`
- `.execucao/`
- credenciais, tokens ou chaves privadas

Fluxo normal:

```bash
git add .
git commit -m "feat: descreve a mudança"
git push
```

## Pendências conhecidas

- tradução completa EN do painel Canvas legado;
- recuperação de senha por e-mail, dependente de um provedor de envio;
- teste de conectividade individual de cada provedor de IA;
- produção pública com HTTPS/Cloudflare, se for desejada.
