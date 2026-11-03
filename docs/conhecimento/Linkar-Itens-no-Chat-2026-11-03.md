# Linkar itens no chat

## Comportamento

Toda janela de detalhes de item agora possui o botão **🔗 Linkar no chat**. Ele funciona para itens da mochila, depósito e equipamentos porque esses locais reutilizam `ItemModal`.

Ao clicar, o item é inserido no campo do Chat Mundial como um marcador seguro. O marcador contém apenas `templateId`, nome, raridade, tier, upgrade e até oito atributos resumidos. Nenhum dado de conta, personagem ou preço interno é exposto.

## Exibição

O chat converte o marcador em uma leitura amigável:

`🔗 Nome do item +2 · RARO · T3`

Texto escrito antes ou depois do link é preservado. O marcador continua seguro mesmo quando enviado ao servidor, pois a mensagem permanece limitada ao tamanho normal do chat.

## Compatibilidade

- Não altera inventário, equipamento, depósito ou economia.
- Não exige migração no Supabase.
- O link é uma ação visual/local e usa o canal mundial por padrão; o jogador pode trocar para Trade ou Help antes de enviar.
