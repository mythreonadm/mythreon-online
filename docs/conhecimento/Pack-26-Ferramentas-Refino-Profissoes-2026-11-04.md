# Pack 26 — Ferramentas, progressão e refino de profissões

Data: 2026-11-04
Estado: implementado e validado em desenvolvimento

## O que entrou

- Picaretas T1–T5 e varas de pesca T1–T5 como itens próprios, com raridade, tier, skill mínima e identidade visual separadas do equipamento de combate.
- Um slot lógico de ferramenta de mineração e um slot lógico de vara de pesca no personagem. Eles permanecem equipados em paralelo à Matriz, Pet e set.
- Personagens novos recebem Picareta T1 e Vara T1; saves antigos recebem o kit apenas uma vez durante a migração, sem sobrescrever ferramentas existentes.
- Veios e pontos agora exigem simultaneamente skill mínima e ferramenta do tier correto. O cooldown e a precisão manual do Pack 25 permanecem ativos.
- Receitas de profissão: Lingote de Ferro, Cristal de Essência Refinado, Isca da Cicatriz e Caldo da Marca-d'Água.
- A tela de Mineração & Pesca ganhou inventário de ferramentas, indicação de ferramenta equipada, requisito de tier e painel de receitas com materiais disponíveis.
- O álbum de Cards agora mostra a formação equipada, os bônus agregados de HP/ATK/DEF/SPD e o impacto direto no Gear Score.

## Arquivos principais

- `src/types/index.ts`
- `src/data/items.ts`
- `src/data/professions.ts`
- `src/engine/save.ts`
- `src/store/gameStore.ts`
- `src/ui/Professions.tsx`
- `src/ui/CardAlbum.tsx`
- `server/game.ts`

## Regras de balanceamento

- Ferramentas não entram no cálculo de dano e não ocupam os slots de combate.
- Um tier superior pode acessar nós inferiores, mas nunca contorna a skill mínima.
- O rendimento manual continua moderado: precisão perfeita concede 1,25x e +2 de skill; as demais mantêm o ganho incremental.
- Refino consome materiais da mochila e respeita o limite de slots antes de concluir a operação.

## Próxima fatia

- Loja/receita de ferramentas T2–T5 com custos e fontes de obtenção.
- Exibir ferramentas no tooltip do personagem e na wiki.
- Transformar receitas em dados server-side com auditoria de consumo e testes concorrentes.
- Definir ferramentas especiais de evento e bônus cosméticos, sem bônus direto de dano.
