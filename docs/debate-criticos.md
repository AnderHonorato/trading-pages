# Revisão crítica — v11

> Não havia runner independente de subagentes Sonnet disponível nesta sessão. Em vez de simular agentes inexistentes, a revisão foi feita com verificadores automatizados e evidência executável.

## Crítico técnico
- [ALTA → corrigido] servidor estático antigo permaneceu como processo filho e ocupou a porta 4312. O processo foi identificado pelo comando antes de encerrar; a detecção de porta agora testa IPv4, IPv6 e bind wildcard.
- [ALTA → corrigido] CSP rígida quebraria o painel por CSS/JS inline. O conteúdo foi extraído para arquivos externos.
- [ALTA → corrigido] segredo de API não pode voltar ao navegador. A listagem retorna apenas `configurada: true`.
- [MÉDIA → corrigido] autenticação precisava de proteção persistente contra força bruta. A quinta falha bloqueia e a reincidência progride até 24h.
- [MÉDIA → pendente operacional] regra do Windows Firewall requer elevação. Foi criado `Liberar Trading Pages no WiFi.cmd` com escopo LocalSubnet.

## Crítico de produto
- [ALTA → corrigido] Cosmo ainda herdava tiros dos planetas. Disparos são bloqueados no tema.
- [ALTA → corrigido] núcleo podia começar como nébula/estrela. Cosmo agora mantém buraco negro.
- [MÉDIA → corrigido] nomes e placa central cobriam a arena. Placas dos agentes são ocultadas no Cosmo e a placa central não é desenhada.
- [MÉDIA → corrigido] navegação mobile estava apertada. Temas usam duas faixas roláveis e agentes usam uma faixa horizontal compacta.
- [MÉDIA → pendente] inglês completo do painel legado ainda não foi migrado nesta onda.
`n2026-11-11: aquario sem novas dependencias, limites de 11 peixes e 12 alimentos; riscos: sobreposicao de elementos em telas pequenas e FPS a medir em dispositivo real.
