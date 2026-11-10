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
