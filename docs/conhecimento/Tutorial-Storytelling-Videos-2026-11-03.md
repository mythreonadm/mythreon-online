# Tutorial cinematográfico — Storytelling de Mythreon

## Sequência ativa

Os quatro vídeos da pasta `imagens/storytelling videos` foram publicados em `public/assets/storytelling`. O jogo utiliza as versões `-narrado.mp4`, que preservam a imagem, removem o áudio original e adicionam uma narração masculina em português, com ritmo solene de prólogo arcano. Os arquivos originais continuam no mesmo diretório como backup.

1. `falconxarvore-narrado.mp4` — O primeiro encontro
2. `humanoxlobos-narrado.mp4` — A ameaça desperta
3. `humanoxfalcon-narrado.mp4` — A Matriz responde
4. `lupinoxfalcon-narrado.mp4` — O poder de um companheiro

Após as cenas, o tutorial apresenta os três caminhos de evolução e abre a primeira missão (`TUT_WIKI`). O jogador pode usar os controles do vídeo ou escolher **Pular história**; nesse caso, a missão também é aberta imediatamente.

## Arquitetura

- Componente responsável: `src/ui/JourneyGuide.tsx`.
- Assets públicos: `public/assets/storytelling/*.mp4`.
- Script de regeneração da voz: `scripts/create-story-narration.ps1`.
- O navegador usa `controls`, `playsInline` e `preload="metadata"` para funcionar em desktop e celular sem iniciar todos os vídeos ao mesmo tempo.
- Caso um vídeo não seja suportado, o navegador exibe a mensagem de fallback e o botão **Continuar** continua disponível.

## Manutenção

Para substituir uma cena, mantenha o nome do arquivo ou atualize o campo `src` no array `videos` de `JourneyGuide.tsx`. Preserve o formato MP4 (H.264/AAC recomendado) e mantenha cada arquivo dentro de `public/assets/storytelling` para ser servido pelo Vite/Vercel. Para refazer as narrações locais, execute `powershell -ExecutionPolicy Bypass -File .\scripts\create-story-narration.ps1`.
