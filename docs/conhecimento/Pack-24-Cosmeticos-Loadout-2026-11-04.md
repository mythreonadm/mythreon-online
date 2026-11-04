# Pack 24 — Cosméticos e personalização persistente

## Entrega

- A personalização humana existente permanece intacta e ganhou a seção **Cosméticos da Essência**.
- Skins, luminescências e addons cosméticos são encontrados na mochila ou no depósito e podem ser equipados visualmente.
- O loadout visual é salvo em `character.cosmeticLoadout` com três canais independentes: skin, brilho da matriz e aura do pet.
- O servidor valida a posse do item e aceita somente IDs com prefixos cosméticos (`SKIN_`, `LUMINESCENCIA_` ou `ADDON_`).
- Cosméticos não entram no cálculo de dano, defesa, Gear Score, drops ou PvP.

## Arquivos

- `src/types/index.ts` — `CosmeticLoadout` e campo da personagem.
- `src/engine/save.ts` — defaults e migração.
- `src/store/gameStore.ts` — ação `equipCosmetic`.
- `src/ui/CharacterCustomization.tsx` — seleção visual na tela de personagem.
- `server/game.ts` — validação online do comando.

## Pendências comerciais

- Checkout real e ativação de Premium ainda precisam de provedor de pagamento e webhook server-side.
- O calendário continua entregando a skin do mês no fluxo local/online atual; a entitlement mensal definitiva deve ser consolidada em uma tabela do servidor.
- Próxima melhoria visual: aplicar o canal de skin/aura diretamente no sprite do mapa e nos cards sociais.
