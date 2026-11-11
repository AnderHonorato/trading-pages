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


## Revisão crítica — v13

### Crítico técnico
- [ALTA → corrigido] A separação anterior era majoritariamente reativa: agentes podiam se aproximar demais e só depois serem empurrados. A v13 introduziu slots orbitais preventivos com interpolação angular.
- [ALTA → corrigido] O primeiro gate automático encontrou no Cosmo SPOTTER/TAKER com razão mínima de 0,821 entre distância e raios combinados. A margem/rigidez específica do Cosmo foi elevada e o novo resultado ficou em 0,924, acima do gate mínimo de 0,86.
- [MÉDIA → monitorar] A separação é O(n²). Com a população atual isso é pequeno e previsível; antes de escalar para dezenas de agentes simultâneos, deve existir um budget de frame time e possível particionamento espacial.
- [MÉDIA → corrigido] O teste visual usando networkidle ficou sujeito a travamento por atividade contínua do app. Foi substituído por domcontentloaded onde apropriado, mantendo espera explícita pelos elementos reais.

### Crítico de produto
- [ALTA → corrigido] A primeira captura da v13 ainda tinha placa central grande OBSERVANDO e duas fontes de fala concorrendo. A placa foi removida e a conversa visual passou a ser única, priorizada e posicionada para fora do centro.
- [ALTA → corrigido] Falas como “pronto!” e “ordem enviada!” eram genéricas ou podiam sugerir execução real. Foram substituídas por mensagens contextuais e, quando necessário, explicitamente simuladas.
- [MÉDIA → corrigido] O ritmo de eventos era alto demais para leitura. O pulso base aumentou de 900 ms para 1450 ms e o encadeamento extra foi reduzido.
- [MÉDIA → evidência] A captura final mostrou o núcleo livre, agentes distribuídos e apenas uma fala visual ativa.

### Evidências
- Testes específicos v13: 10 aprovados antes da rodada completa.
- Gate visual final: Pixel 1,89× e Cosmo 1,03× a soma dos raios do par mais próximo.
- Desktop 1440 px e mobile 390 px sem overflow.
- Zero erros de console no teste visual.


## Revisão crítica — v14

### Crítico de produto
- [ALTA → corrigido] A V13 tinha 20 skins visuais, mas todos os agentes ainda eram posicionados pela mesma lógica orbital. Isso contrariava o requisito de identidade própria dos temas.
- [ALTA → corrigido] Mesmo após trocar o posicionamento, o HUD ainda mostrava “Elipse 3D” em Oceano/Música/Pixel, transmitindo uma capacidade que não existia mais.
- [ALTA → corrigido] O fundo ainda desenhava elipses ambientais genéricas em todos os temas, preservando visualmente a sensação de órbita.
- [MÉDIA → corrigido] Cartas, Criaturas, Cyber e Clima apresentaram sobreposição real na primeira rodada Playwright; a geometria desses layouts foi refeita e o gate elevado para 1,0×.
- [MÉDIA → evidência] Pixel, Naves, Oceano, Música e Cosmo foram capturados separadamente para inspeção visual; as composições são claramente distintas.

### Crítico técnico
- [ALTA → corrigido] O primeiro teste de continuidade comparava t=0 com t=4 e classificava deslocamento longo como teletransporte. O teste foi corrigido para medir deslocamento entre quadros de 100 ms.
- [ALTA → corrigido] Cyber/Oceano/Clima usavam wrap de fase em versões intermediárias, o que poderia causar salto da borda direita para a esquerda. Foram substituídos por trajetórias contínuas de ida e volta ou oscilações locais.
- [MÉDIA → monitorar] O motor temático hoje é determinístico e leve, mas o custo do Canvas com 20+ agentes deve ganhar budget formal de frame time/FPS em próxima onda.
- [MÉDIA → monitorar] `evolucao-v11.js` ainda contém responsabilidades visuais e de simulação demais; a V14 extraiu movimento, mas a modularização deve continuar.

### Evidências da rodada de desenvolvimento
- 9/9 testes específicos V14 aprovados.
- Playwright percorreu 20/20 temas no Chrome.
- 19 assinaturas geométricas não-Cosmo diferentes.
- Todos os temas apresentaram movimento mensurável.
- Todos passaram separação >= 1,0× na rodada final.
- Zero overflow horizontal.
- Zero erros de console/page.
