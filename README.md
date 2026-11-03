# Agentes Orbitais v9 — Ander Quant OS

Este projeto usa o HTML original **Agentes Orbitais v8** fornecido pelo autor e acrescenta melhorias em arquivos separados, sem remover os 20 estilos temáticos ou suas ilustrações.

## Novidades da v9
- +8 mascotes inéditos: Luna, Rubi, Axo, Brasa, Mel, Névoa, Pipo e Lume (20 agentes no total).
- 6 trajetórias orbitais: elipse 3D, infinito, hélice, espiral, vertical e coreografia livre; movimentos com profundidade, flutuação e esquiva.
- Núcleo vigilante que escolhe alvo de menor eficiência, o sinaliza, dispara, e mantém escudo ativo.
- Vida, escudos, esquiva, dano, morte com animação e substituição por reservas (gerações).
- Evolução individual de rank, vida extra, auras e partículas.
- Habilidades únicas para os 20 temas, com efeitos de crítico, raio, cura, proteção e onda.
- Controles de órbita, duelo e poder e indicadores de combate.
- Rotas `GET /api/status` e `GET /api/sinais` para demonstrar frontend + backend na Vercel.

## Execução

Abra `agentes-orbitais.html` num servidor estático. A interface opera localmente quando a API não está disponível. No Vercel, as rotas `api/` são funções Node.js e o frontend usa a API de demonstração. Teste `GET /api/status` para ver `conectadoCorretora:false`.

## Segurança e limites

**Não há negociação real, credenciais, ligação com corretora ou estratégia financeira operacional.** A API é um feed demonstrativo claramente identificado. O estado de combate permanece no navegador; funções serverless não guardam sessões em memória. Uma integração real exige definição de contrato e origem de dados, autenticação, banco de dados e controle de risco.

O arquivo HTML inicial foi enviado pelo usuário. Todos os créditos da base visual ficam preservados.
