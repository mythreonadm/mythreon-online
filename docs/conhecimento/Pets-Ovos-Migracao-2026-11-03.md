# Migração de Bestas Divinas para Pets e Ovos

## Decisão de produto

As Bestas Divinas continuam existindo na lore, mas a experiência pública do jogo passa a chamá-las de **Pets de Mythreon**. O jogador obtém Ovos de Besta Divina, usa a Incubadora e eclode um pet com raridade, bônus, nutrição e humor próprios.

## Compatibilidade técnica

- Os campos internos `divineBeasts` e `activeDivineBeastId` foram preservados para não invalidar saves existentes.
- Os métodos internos `hatchEgg`, `equipDivineBeast`, `unequipDivineBeast`, `feedDivineBeast` continuam sendo a camada de compatibilidade do estado salvo.
- Nenhuma migração de banco é necessária: uma besta já desbloqueada aparece automaticamente como pet.
- A Matriz e o pet podem atuar juntos; o pet realiza seu ataque próprio a cada 5 segundos e aplica seus bônus.

## Fluxo para o jogador

1. Encontrar ou receber um Ovo de Besta Divina.
2. Abrir **Pets e Ovos**.
3. Eclodir o ovo e revelar a raridade do pet.
4. Ativar o pet para acompanhar a Matriz.
5. Alimentar o pet para manter nutrição e humor, que modulam o poder do ataque.
6. Combinar quatro cópias iguais com ração para aprimorar a linhagem.

## UI e documentação

O cabeçalho, a aba principal, o tutorial, a ficha do personagem e a Wiki usam “Pets”, “Incubadora de Pets” e “Pets e Ovos”. “Besta Divina” permanece como nome de origem/lore e como identificador interno.

## Próximos passos

- Adicionar feedback visual do pet ao lado do personagem durante a caça.
- Exibir a raridade do ovo antes da eclosão e o resultado em uma animação curta.
- Criar métricas de nutrição, humor, dano do pet e taxa de eclosão para balanceamento.
