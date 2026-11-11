# Decisões técnicas — Trading Pages v11

1. **Evolução incremental do v10:** o motor Canvas foi preservado e a física v11 foi extraída para `frontend/compartilhado/orbital-fisica.js`.
2. **SQLite:** `better-sqlite3` instalou e funciona neste Windows; não foi necessário fallback para `node:sqlite`.
3. **Senha:** `crypto.scrypt` nativo com salt aleatório.
4. **Segredos de API:** AES-256-GCM com chave local do `.env`.
5. **CSP:** scripts e estilos inline do painel foram extraídos para arquivos externos para permitir política sem `unsafe-inline` e sem `unsafe-eval`.
6. **Cosmo:** buraco negro permanece como núcleo visual em todos os níveis; progressão continua em XP/poder sem trocar o núcleo por estrela.
7. **LAN:** servidor escuta em `0.0.0.0`; firewall deve permitir somente `LocalSubnet`. A conta atual não possui elevação para criar a regra automaticamente.
8. **Trading real:** o painel permanece demonstrativo; nenhuma corretora ou ordem financeira real é acionada.
9. **i18n legado:** a migração completa do canvas legado para PT-BR/EN permanece fora desta onda; não foi marcada como concluída.

10. **Sessões v12:** o usuário pode revogar apenas sessões pertencentes ao próprio ID; tokens e CSRF nunca são devolvidos na listagem.
11. **Observabilidade v12:** health público é deliberadamente mínimo; métricas detalhadas exigem autenticação.
12. **Request ID:** cada requisição recebe UUID para correlação de erros, sem registrar segredos.

13. **Reciclagem após rebase:** a seleção por relevância de `main` foi preservada, mas extraída parcialmente para `frontend/compartilhado/reciclagem-agentes.js` para reduzir acoplamento.
14. **Execução temática:** no Cosmo, reciclagem nunca usa projétil; o agente sentenciado é absorvido pelo buraco negro. Nos demais temas o núcleo usa a mesma mecânica de absorção com apresentação temática.
15. **Retorno futuro:** agentes removidos recebem cooldown e voltam ao pool de reserva após o período, evitando esgotar a população em sessões longas.

16. **Instância única local:** o PID é usado como trava apenas no modo local. Em plataformas que fornecem `PORT`, a plataforma controla processos/replicação e a trava por PID é desabilitada para não confundir namespaces de containers.
17. **Porta de plataforma:** `PORT` tem prioridade em hospedagem; `PORTA` continua sendo a preferência local e usa descoberta segura quando ocupada.

18. **Bootstrap de produção:** `ADMIN_INICIAL_USUARIO` e `ADMIN_INICIAL_SENHA` só são aceitos quando a tabela de usuários está vazia. Depois do primeiro boot, os valores devem ser zerados/removidos no provedor.


## Decisões v13 — Fluidez, Coreografia e Conversa

12. **Coreografia preventiva em vez de colisão reativa:** agentes da mesma órbita recebem fases-alvo distribuídas regularmente e chegam a esses slots com interpolação angular. A repulsão em tela passa a ser apenas correção suave, evitando o efeito de “um agente empurrando o outro” depois que a colisão já aconteceu.

13. **Separação dependente do tema:** o Cosmo recebe margem e rigidez maiores porque planetas visualmente se sobrepõem com mais facilidade, especialmente entre órbitas projetadas em 2D. Os demais estilos mantêm parâmetros mais leves para preservar naturalidade.

14. **Micro-movimento adaptativo:** a agitação individual diminui quando a população cresce. Isso mantém o sistema vivo sem transformar uma arena cheia em ruído visual.

15. **Conversa contextual com fila única visual:** o sistema limita a uma fala visível por vez, com prioridade e cooldown. O conteúdo depende de papel e evento. O Cosmo permanece sem balões, preservando a leitura dos planetas.

16. **Progresso integrado ao núcleo:** a antiga placa central grande foi removida. Nível/progresso passam a ocupar um anel discreto ao redor do núcleo para liberar o centro da composição.

17. **Gate anti-colisão:** a API visual expõe apenas nome, posição, raio e órbita dos agentes para QA. O teste visual mede a razão distância/(raioA+raioB) e falha abaixo do limite definido, sem expor sessão, tokens ou segredos.


## Decisões v14 — Identidade de movimento por tema

18. **Cosmo é o único sistema orbital:** `posOrbita`, anéis de trajetória e alternância de órbita só participam do layout quando `tema.id === 'cosmos'`.

19. **Movimento temático é domínio próprio:** os outros 19 temas usam `movimentos-tematicos.js`, módulo puro e testável que recebe índice, população, tempo e tamanho da arena e devolve posição contínua.

20. **Formação não é skin:** cada categoria tem uma assinatura geométrica própria; o QA exige pelo menos 15 assinaturas distintas e a implementação atual produz 19.

21. **Sem teletransporte:** continuidade é medida entre amostras temporais curtas. Comparar posições separadas por vários segundos não é um teste válido de teletransporte porque movimentos contínuos podem percorrer grande distância.

22. **Sem atropelo visual:** o gate do navegador exige distância centro-a-centro maior ou igual à soma dos raios dos agentes. O limite não é relaxado para fazer o teste passar.

23. **Guias ambientais seguem o tema:** anéis ambientais genéricos foram removidos dos temas não-Cosmo; cada formação possui guia visual correspondente.

24. **Controle de movimento comunica capacidade real:** temas comuns mostram sua formação como informação; somente o Cosmo habilita o botão de troca de trajetória orbital.
