# Pack de Caçada em Ondas — Mythreon Online

## O que foi implementado

- Cada criatura comum passa a ter uma sequência persistente de cinco encontros:
  - Onda 1: capanga fácil, 62% da vida/ataque base.
  - Onda 2: capanga forte, 82% da vida/ataque base.
  - Onda 3: primeiro integrante da dupla.
  - Onda 3: segundo integrante da dupla.
  - Onda 4: chefe da linhagem, 175% de vida e 148% de ataque base.
- Capangas entregam XP e ouro normalmente, mas só possuem 1% de chance de soltar um componente da região.
- O chefe da sequência mantém o ciclo de itens especiais da criatura-base.
- O progresso fica salvo por zona + criatura e continua depois de sair e voltar ao mapa.
- Bestiário e quests contabilizam o ID da criatura-base, evitando separar a mesma criatura em cinco registros.
- A interface mostra `Onda 1/4`, `Onda 3/4 · Dupla 1/2` e `Onda 4/4 · Chefe`.
- O loop offline avança no máximo uma etapa por ciclo, evitando pular todas as ondas em uma única reconciliação.

## Arquivos do pacote

Copiar para a pasta correspondente do projeto:

- `src/engine/huntWaves.ts` — regras, nomes e multiplicadores das ondas.
- `src/engine/combat.ts` — integração de dano, XP, ouro, drops e avanço da onda.
- `src/store/gameStore.ts` — inicialização e persistência da etapa atual.
- `src/types/index.ts` — campos opcionais de onda no inimigo e no personagem.
- `src/ui/Zone.tsx` — sprite/nome da variante e indicador visual da onda.

O pacote foi verificado com o TypeScript do projeto (`tsc --noEmit`). O repositório original está em `D:\MYTHREON ONLINE`; nesta máquina a pasta possui bloqueio de escrita, portanto os arquivos estão em:

`C:\Users\dreey\Documents\Codex\2026-10-31\referenced-chatgpt-conversation-this-is-an\work\wave-hunt-pack\`

## Ordem de aplicação

1. Faça backup de `src/engine/combat.ts`, `src/store/gameStore.ts`, `src/types/index.ts` e `src/ui/Zone.tsx`.
2. Copie os quatro arquivos existentes e o novo `huntWaves.ts` para o projeto.
3. Coloque os PNGs da lista de artes em `public/assets/monsters/`.
4. Rode o build e teste uma criatura no Bosque de Lyss até chegar ao chefe da onda.

## Regras de design

O chefe da zona continua existindo como alvo próprio. A sequência é a progressão da criatura selecionada. Assim o jogador pode escolher entre farmar a linhagem em ondas ou entrar diretamente no boss da região quando a história permitir.
