# Tutorial cinematográfico — Storytelling de Mythreon

## Sequência ativa

Os quatro vídeos da pasta `imagens/storytelling videos` foram publicados em `public/assets/storytelling`. O jogo utiliza as versões `-story.mp4`: elas preservam a imagem, removem o áudio original e deixam somente uma ambiência discreta de mata. A história é apresentada em texto logo abaixo de cada cena, para o jogador ler no próprio ritmo e sem depender de uma narração. Os arquivos originais e as versões narradas continuam no mesmo diretório como backup.

1. `falconxarvore-story.mp4` — O primeiro encontro
2. `humanoxlobos-story.mp4` — A ameaça desperta
3. `humanoxfalcon-story.mp4` — A Matriz responde
4. `lupinoxfalcon-story.mp4` — A primeira ascensão

Após as cenas, o tutorial apresenta os três caminhos de evolução e abre a primeira missão (`TUT_WIKI`). O jogador pode usar os controles do vídeo ou escolher **Pular história**; nesse caso, a missão também é aberta imediatamente.

## Arquitetura

- Componente responsável: `src/ui/JourneyGuide.tsx`.
- Assets públicos: `public/assets/storytelling/*.mp4`.
- Script de geração da ambiência: `scripts/create-story-ambient.ps1`.
- O navegador usa `controls`, `playsInline` e `preload="metadata"` para funcionar em desktop e celular sem iniciar todos os vídeos ao mesmo tempo.
- Caso um vídeo não seja suportado, o navegador exibe a mensagem de fallback e o botão **Continuar** continua disponível.

## Manutenção

Para substituir uma cena, mantenha o nome do arquivo ou atualize o campo `src` no array `videos` de `JourneyGuide.tsx`. Preserve o formato MP4 (H.264/AAC recomendado) e mantenha cada arquivo dentro de `public/assets/storytelling` para ser servido pelo Vite/Vercel. Para recriar as versões sem narração, com ambiência de floresta, execute `powershell -ExecutionPolicy Bypass -File .\scripts\create-story-ambient.ps1`.
