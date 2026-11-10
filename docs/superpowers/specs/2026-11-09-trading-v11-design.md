# Trading Pages v11 — Design

## Intenção
Transformar o painel orbital em uma interface viva, segura e utilizável pelo celular na mesma rede Wi-Fi, preservando os 20 estilos e elevando o Cosmo para uma simulação visual coerente.

## Objetivos
- Cosmo: órbitas elípticas coerentes, todos os corpos orbitando o núcleo no mesmo sentido, rotação própria dos planetas e espaçamento maior.
- Cosmo: impactos externos por meteoritos/asteroides/pequenos corpos; o núcleo não atira para eliminar, ele absorve o alvo em espiral.
- Planetas com olhos, boca e humor reativo a dano, perigo, recuperação, evolução e absorção.
- Outros estilos reutilizam a mesma lógica de eventos, com efeitos visuais adequados ao tema.
- Rótulos deixam de obstruir a arena: nome/status só aparecem de forma reduzida e contextual.
- Login real de administrador, sessão segura, CSRF, limitação progressiva e auditoria.
- Configuração de APIs no servidor, com segredos criptografados e nunca expostos ao navegador.
- Servidor acessível por localhost e IP LAN, sem abrir acesso público à Internet.

## Restrições
- PT-BR em código, arquivos, rotas e documentação.
- Node.js 22+, Express 5, helmet, compression e SQLite.
- Senhas com crypto.scrypt; nenhuma senha fixa no código.
- Cookie HttpOnly, SameSite=Lax e Secure em produção.
- HTML/CSS/JS separados nas novas telas.
- Porta configurável e nunca 3000.
- CSP sem unsafe-inline/unsafe-eval nas novas telas.
- Interface funcional em 1440px e 390px.

## Abordagem escolhida
Evolução incremental sobre o v10: preservar o grande motor Canvas existente, criar um módulo de física/eventos testável e uma versão v11 do controlador orbital; adicionar backend Express e páginas separadas para autenticação/configuração. Evita reescrever os 20 temas nesta etapa e reduz risco de regressão.

## Não objetivos
- Não executar ordens financeiras reais.
- Não armazenar chaves de API no frontend.
- Não expor o servidor diretamente à Internet.
