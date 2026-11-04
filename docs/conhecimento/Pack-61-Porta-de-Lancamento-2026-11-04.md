# Pack 61 — Porta de lançamento, Jornal e artes finais

Data: 04/11/2026

## Entregue

- Corrigida a compilação do runtime online para usar `absWorkingDir` e entradas relativas explícitas, evitando a resolução quebrada do esbuild em caminhos OneDrive.
- Criado `docs/RELEASE_CHECKLIST_MYTHREON.md` com P0/P1/P2, datas de controle e critérios verificáveis para Windows, Android, Mercado e Premium.
- Criado o catálogo editorial `docs/jornal/releases.json`, sincronizado para `src/data/journal-releases.json` por `npm run journal:sync` e mesclado ao Jornal da Wiki.
- Adicionados `journal:check`, `market-ui-check`, `verify-windows` e `release:gate` aos scripts do projeto.
- Produzidas as duas artes finais que ainda tinham referência direta no código: `public/assets/players/skins/SKIN_MANTO_NEBULOSA.png` e `public/assets/items/LUMINESCENCIA_PET.png`. Ambas usam fundo transparente e seguem a identidade arcana pixel art.

## Limites explícitos

- Mercado Negro está funcional em ambiente local e possui custódia, histórico, taxa e filtros; moderação, concorrência em conexões independentes e homologação de produção continuam P0/P1.
- Premium tem entitlement e webhook HMAC, mas não é uma Loja real até escolher checkout, configurar segredo na Vercel e homologar pagamentos/cancelamentos.
- Windows tem updater com manifesto e SHA-256; ainda falta assinatura Authenticode e publicar o manifesto em URL estável.
- A landing page aceita link Android, mas não existe APK/AAB nativo neste repositório. O app mobile deve ser empacotado e testado em aparelho físico antes de ser anunciado como disponível.

## Evidências desta rodada

- `npm run journal:check` passou.
- `npm run brain:check` passou.
- `npm run online:check` passou.
- `npm run typecheck` passou.
- `npm run build` passou com permissão ampliada para o processo esbuild; no sandbox restrito o processo auxiliar do esbuild recebe `Acesso negado` ao navegar no OneDrive.
- O build ainda informa um chunk principal acima de 500 kB; isso é otimização P1, não erro funcional.

## Próxima ordem

1. Executar `npm run release:gate` e depois o playtest de vários dias.
2. Escolher e homologar o checkout real.
3. Assinar/publicar o Windows e gerar o APK/AAB.
4. Só então congelar a tag pública.
