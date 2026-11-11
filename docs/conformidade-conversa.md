# Conformidade — conversa compartilhada e requisitos do Trading Pages

Atualização: V14.

Este arquivo existe para impedir regressões de produto: pedidos antigos continuam sendo critérios de aceite das próximas ondas.

## Requisitos obrigatórios

- [x] **Entrega executada, não apenas código escrito:** toda onda relevante deve abrir o sistema real, testar animações/comportamento e corrigir falhas encontradas antes de publicar.
- [x] **Temas alteram o sistema inteiro:** não podem ser apenas troca de cor ou skin.
- [x] **Somente o Cosmo usa órbitas/rotação orbital contínua.**
- [x] **Os outros 19 temas possuem formação e deslocamento próprios**, coerentes com a categoria.
- [x] **Mais de cinco níveis:** o núcleo possui 50 níveis e ascensões visuais.
- [x] **Agentes menores e organizados**, com escala por densidade e separação anti-colisão.
- [x] **Movimentos fluidos e sem atropelo:** gate visual exige distância mínima >= 1,0x a soma dos raios.
- [x] **Projéteis/efeitos variados por tema** permanecem suportados.
- [x] **Núcleo avalia relevância e elimina/substitui o agente menos relevante** em ciclos.
- [x] **Substituição tem função/afinidade, proteção inicial e cooldown do removido.**
- [x] **A ação visual acompanha o estado real da simulação:** demo é explicitamente marcada como simulada; não há corretora real conectada.
- [x] **Mobile e desktop** entram nos gates de QA.
- [x] **Publicação condicionada a testes**, CI e validação pós-deploy.
- [x] **Documentação visual no Figma:** Trading Pages V14 — Movimentos por Tema.
- [x] **Segurança e conta** da base V12/V13 permanecem protegidas por testes.

## Matriz de movimentos V14

| Tema | Formação/movimento |
| --- | --- |
| Pixel | Grade arcade |
| Dados | Mesa tática |
| Naves | Esquadrão em V |
| Cartas | Leque de cartas |
| Voxel | Degraus isométricos |
| Criaturas | Matilha viva |
| Cosmo | Órbitas elípticas — único orbital |
| Cyber | Circuito de nós |
| Bio | Colônia celular |
| Arcano | Pontos de sigilo |
| Oceano | Cardume em ondas |
| Floresta | Galhos e clareiras |
| Clima | Camadas atmosféricas |
| Deserto | Caravana |
| Ártico | Placas de gelo |
| Comida | Esteira de cozinha |
| Música | Palco/equalizador |
| Esportes | Formação de campo |
| Origami | Dobras e voo |
| Brinquedos | Pista de brincar |

## Gates automáticos V14

1. Todos os 19 temas não-Cosmo precisam existir no motor temático.
2. Nenhum deles pode depender de cálculo orbital para posicionamento.
3. Pelo menos 15 assinaturas geométricas diferentes; implementação atual produz 19.
4. Movimento contínuo sem teletransporte.
5. Chrome real percorre todos os 20 temas.
6. Separação visual mínima de 1,0x o raio combinado.
7. Sem overflow horizontal em desktop/mobile.
8. Sem erros de console/page.
9. Cosmo continua sendo o único modo `orbita-cosmica`.
10. Os demais reportam `tematico:<tema>`.

## Observação sobre a conversa compartilhada

O conteúdo publicamente acessível do link reforçou especialmente o critério de **não considerar uma tarefa concluída apenas por ter alterado arquivos/feito commit**: a animação e o sistema precisam ser executados, revisados no navegador, corrigidos e só então publicados. Os demais requisitos acima também consolidam os pedidos já feitos nesta conversa/projeto.
