# Pack 66 — Cartas com arte dos monstros e Bolsa de Cards

Data: 05/11/2026  
Status: implementado e validado no typecheck

## Objetivo

Transformar a coleção de Duelos em um álbum legível e colecionável: a tela principal mostra apenas uma memória por criatura descoberta, usando a arte real do monstro. Cópias repetidas deixam de poluir a formação e passam a ser materiais de uma Bolsa de Cards.

## Regras implementadas

- `CardArt` resolve a sprite pela carta, pelo monstro da região ou pelo caminho `/assets/monsters/<monsterId>.png`, mantendo emoji apenas como fallback.
- A formação da Arena usa `uniqueCardCollection`, portanto uma mesma criatura não aparece várias vezes para seleção.
- `cardDuplicateBag` preserva como memória principal a carta equipada; se não houver carta equipada, preserva a de maior nível e depois a mais antiga. As demais instâncias ficam na Bolsa.
- Quatro cópias livres de nível 1 da mesma criatura podem ser consumidas pela roleta.
- A roleta devolve uma nova carta de raridade igual ou superior: 85% de chance de permanecer na raridade de origem e 15% de chance de subir, quando houver raridade acima disponível.
- A operação é validada no servidor e não pode consumir carta equipada, evoluída ou uma carta que não pertença à Bolsa.
- O comando online é tratado como server-only e deduplicado para evitar duplo consumo em reconexões.

## Arquivos alterados

- `src/engine/cardCollection.ts` — catálogo único, separação de duplicatas e roleta 4→1.
- `src/store/gameStore.ts` — ação persistente `recycleCards` e retorno da recompensa.
- `src/online/controller.ts` — comando da roleta como server-only/deduplicado.
- `server/game.ts` — validação e despacho autoritativo do comando.
- `src/ui/Duelos.tsx` — cartas com arte real, coleção única e Bolsa de Cards com retorno visual da roleta.
- `src/ui/ArenaDuelos.tsx` — formação com uma carta por criatura e arte real.
- `server/generated/online-runtime.cjs` — runtime regenerado.

## Próxima verificação manual

1. Obter pelo menos cinco cópias do mesmo monstro.
2. Confirmar que a formação oferece apenas uma carta.
3. Confirmar que quatro cópias nível 1 aparecem na Bolsa.
4. Girar a roleta e conferir remoção das quatro cópias, entrada da nova carta e atualização do servidor.
5. Equipar uma carta e tentar reciclá-la: a operação deve ser recusada.

## Dependências e riscos

- A sprite depende de o `monsterId` da carta coincidir com o inimigo cadastrado em `src/data/zones.ts` ou existir em `public/assets/monsters`.
- A roleta usa aleatoriedade apenas no servidor online; o cliente recebe o resultado confirmado.
- O próximo passo de balanceamento pode ajustar a taxa de 15% sem alterar a estrutura de persistência.
