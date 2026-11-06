# Pet não é alvo — correção do indicador de dano

## Diagnóstico

O motor de combate já aplicava o dano recebido exclusivamente em `playerHp`; a Besta Divina não possui HP de combate nem participa da seleção de alvo. O problema era visual: `beastDamage` era exibido acima do sprite do Pet, com sinal negativo, parecendo que o Pet estava sendo atingido.

## Correção

- Removido o número de dano do bloco visual do Pet.
- O dano auxiliar do Pet agora aparece acima do inimigo, identificado como `PET`.
- A animação e o pulso do Pet continuam ativos para indicar que ele atacou.
- A barra de vida e o dano recebido permanecem vinculados ao personagem.

## Validação

- TypeScript aprovado.
- Bundle online sincronizado.
- Build de produção aprovada.

