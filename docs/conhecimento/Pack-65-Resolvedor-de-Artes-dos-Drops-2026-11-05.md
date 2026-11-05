# Pack 65 — Resolvedor de artes dos drops (2026-11-05)

## Diagnóstico

O emoji exibido na mochila não era um problema de inventário. Ele é o fallback deliberado de `ItemIcon`: quando não existe um arquivo individual em `public/assets/items/`, o jogo usa o emoji definido no item. A captura do jogador mostra principalmente componentes de Matriz (`A1..A20`, `S1..S18` e `P1..P14`), para os quais ainda não há PNG individual no projeto.

Também havia dois problemas de resolução:

- algumas telas (como a Wiki) procuravam somente `templateId.png`, sem considerar GIF/GIFF e aliases;
- os ovos foram salvos como `OVO_BESTA_T1.png.png` (e equivalentes), enquanto o código procura `OVO_BESTA_T1.png`.

## Alterações aplicadas

- criado `src/data/itemAssets.ts`, que centraliza candidatos PNG/GIF/GIFF e aliases conhecidos;
- `src/ui/ItemIcon.tsx` agora usa o mesmo resolvedor para mochila, equipamento, depósito, loja e ferreiro;
- `src/ui/Wiki.tsx` agora usa o mesmo resolvedor para itens e fragmentos;
- `src/ui/AssetImage.tsx` aceita uma lista de fallbacks, mantendo suporte a GIF/GIFF antes do PNG;
- criadas cópias com nomes corretos para `OVO_BESTA_T1.png` até `OVO_BESTA_T5.png` e `OVO_BESTA_MYTHREON.PNG`.
- adicionados aliases sem acentos para os componentes (`FRAGMENTO_TEMPESTADE`, `PASSIVA_VULCAO`, `NUCLEO_KAELOR`, etc.), permitindo que uma arte seja salva pelo nome legível ou pelo ID técnico `A13`, `P7`, `S9`.
- recortados para `public/assets/items/` os oito equipamentos do Pântano de Veyra (`CAPUZ_MIASMA_T3` até `COLAR_RAIZ_MEMORIA_T3`) e os doze componentes correspondentes (`A16..A20`, `S14..S18`, `P13..P14`) a partir das pranchas fornecidas;
- confirmados/recortados os cinco drops do Pântano de Veyra (`RESINA_MIASMA`, `ASA_LAMINA`, `NO_MEMORIA`, `DENTE_SILTE` e `COROA_LODO`) com fundo transparente.

## Pendência real de arte

O código agora encontra automaticamente qualquer arte que seja adicionada com o nome correto, mas não é possível carregar uma imagem que ainda não existe. Para eliminar os emojis da captura, ainda é necessário salvar PNGs individuais em `public/assets/items/` para:

- componentes de Matriz: `A1.png` a `A20.png`, `S1.png` a `S18.png`, `P1.png` a `P14.png`;
- materiais sem arte individual: `MINERIO_FERRO.png`, `MINERIO_COBRE.png`, `MINERIO_ECLIPSE.png`, `CRISTAL_ESSENCIA.png`, `CRISTAL_REFINADO.png`, `LINGOTE_FERRO.png`, `TRUTA_GELO.png`, `PEIXE_CORAL.png`, `PEIXE_ASTRAL.png`, `CALDO_MARCA_DAGUA.png`, `CENOURA_PET.png`, `FRUTA_MEL.png`, `MELANCIA_LUNAR.png`, `RACAO_DOMADOR.png`, `BAU_SUPRIMENTOS_MYTHREON.png`, `CHAVE_ROLETA_ARCANA.png` e `LUMINESCENCIA_MATRIZ.png`;
- os demais componentes de regiões anteriores ainda sem arte individual (`A1..A15`, `S1..S13`, `P1..P12`) e os materiais que ainda não estão em nenhuma prancha recortada (`MINERIO_FERRO`, `MINERIO_COBRE`, `MINERIO_ECLIPSE`, `CRISTAL_ESSENCIA`, `CRISTAL_REFINADO`, `LINGOTE_FERRO`, `TRUTA_GELO`, `PEIXE_CORAL`, `PEIXE_ASTRAL`, `CALDO_MARCA_DAGUA`, `CENOURA_PET`, `FRUTA_MEL`, `MELANCIA_LUNAR`, `RACAO_DOMADOR`, `BAU_SUPRIMENTOS_MYTHREON`, `CHAVE_ROLETA_ARCANA` e `LUMINESCENCIA_MATRIZ`).

`ISCA_CICATRIZ` já usa o alias `ISCA_RARA`, e `PEIXE_RIO` usa `PEIXE_RIO_LYSS`. Assim, esses dois itens não precisam de uma segunda cópia.

## Verificação

- `npm run typecheck` — aprovado;
- `npm run build` — aprovado;
- aviso existente de bundle principal acima de 500 kB permanece apenas como otimização futura, sem bloquear a aplicação.

## Regra para as próximas artes

Salvar cada arquivo individual exatamente em `public/assets/items/`, preferencialmente como PNG transparente quadrado. GIF e GIFF também são aceitos; o jogo tenta a animação antes do PNG e cai para o emoji somente quando todos os candidatos falham.

