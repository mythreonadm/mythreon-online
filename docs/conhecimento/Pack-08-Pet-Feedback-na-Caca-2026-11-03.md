# Pack 08 — Pet visível e feedback de combate

**Data:** 03/11/2026  
**Status:** implementado localmente; falta playtest em celular e com todas as artes finais.

## Objetivo

Fechar a primeira camada de jogabilidade Matriz + Pet: o companheiro precisa ser percebido ao lado do herói, continuar visível quando uma arte falhar e comunicar claramente quando desfere o ataque próprio.

## Alterações

- `src/ui/Zone.tsx` agora mantém um estado de erro exclusivo para o sprite do Pet.
- Se PNG/GIF/GIFF falhar, o Pet aparece com o emoji da própria linhagem; a falha não afeta o personagem nem o inimigo.
- O companheiro mostra nome, elemento e intervalo de ataque de 5 segundos.
- A posição recebeu ajuste específico para telas estreitas, evitando que o Pet desapareça fora da cena.
- O som de Besta é disparado também quando o resultado do tick traz `beastDamage`, mesmo que a linha textual do combate tenha sido reduzida.
- O brilho e o marcador de impacto continuam respeitando as preferências de animação/efeitos do jogador.

## Evidências

- Typecheck, build Vite, runtime online, smoke test Electron e jornada visual passaram após a alteração.
- O smoke confirmou `updaterBridge: true`, renderização, isolamento e worker do Laboratório.

## Próximo playtest

1. Ativar um Pet com Matriz em Bosque de Lyss e Pico de Dhor.
2. Desativar animações no painel e confirmar emoji + número de dano do Pet.
3. Testar uma arte inexistente apenas em ambiente local e confirmar que o herói permanece visível.
4. Repetir em viewport estreita/celular; depois validar o áudio com volume mutado e ativado.

## Próxima camada de jogabilidade

Após este playtest, seguir para a Fazenda completa (skill de Plantio/Colheita e receitas) ou para a rodada de balanceamento de 20 hunts por faixa de nível. Não adicionar novos sistemas de monetização antes dessas medições.
