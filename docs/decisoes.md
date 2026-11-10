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
