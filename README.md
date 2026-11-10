# Agentes Orbitais v10 — Ander Quant OS

Projeto baseado no HTML **Agentes Orbitais v8** fornecido pelo autor, mantendo 20 temas e a evolução do motor de combate v9.

## Evoluções v10
- **50 níveis de núcleo** com XP progressivo e nove ascensões visuais depois das cinco formas básicas de cada tema. As formas originais continuam preservadas em níveis altos.
- Evolução individual dos mascotes com ranks e efeitos visuais extras: auras, satélites, anéis e asas energéticas.
- Zoom automático animado ao acrescentar mascotes, raios das órbitas ampliados e separação anticolisão em tela.
- 20 cenários com efeitos ambientais dinâmicos: chuva, neve, folhas, bolhas, estrelas, pixels, sinais digitais, luzes e ondas atmosféricas.
- Interface adaptada para celulares: arena vertical ampliada, rótulos reduzidos quando há mais de 12 mascotes.
- Botões **↑ Nível** e **+ Mascote**, além de Órbita, Duelo e Poder.
- Vida, defesa e eliminação com animação e renovação de agentes.
- **Seleção por relevância:** a cada ciclo o núcleo recalcula relevância usando contribuição recente, atividade, evolução e estabilidade; agentes ocupados ou recém-convocados ficam protegidos.
- O agente elegível com menor relevância é marcado como **SENTENCIADO**, recebe um disparo exclusivo do núcleo, é eliminado e um reserva assume sua vaga orbital.
- O substituto recebe período de proteção, ocupa a órbita/função deixada pelo agente eliminado e inicia uma nova geração. Agentes antigos podem voltar apenas depois de um cooldown longo.
- O painel mostra contador de reciclagens, tempo para a próxima avaliação e o agente ativo com menor relevância.

## Uso
Abra `agentes-orbitais.html` em um servidor HTTP, ou visite a implantação na Vercel. O frontend utiliza `evolucao-v10.js` e `evolucao-v10.css`. A versão anterior (`evolucao-v9.js`) continua no repositório para referência.

A API `/api/status` e `/api/sinais` está em **modo de demonstração**. Não executa ordens financeiras reais, não possui integração com corretoras e não solicita credenciais.

## Testes
O conjunto de renderização foi validado com até 20 mascotes simultâneos e núcleo no nível 45, incluindo viewport de celular, sem erros de JavaScript.