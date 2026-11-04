# Pack 06 — Launcher atualizador seguro

**Data:** 03/11/2026  
**Status:** base implementada; a troca automática e o rollback foram concluídos no Pack 07.

## O que foi entregue

- O executável desktop consulta `https://mythreon-online.vercel.app/downloads/latest.json` ao iniciar.
- A comparação usa a versão do `package.json` e só sinaliza versões maiores.
- O pacote precisa ser HTTPS, Windows x64, ter SHA-256 de 64 caracteres e limite de 300 MB.
- O download é gravado em uma pasta temporária do usuário e validado antes de ser aceito.
- O jogo nunca congela nem deixa de abrir se o manifesto ainda não existir.
- A interface mostra a versão, notas e os botões **Baixar atualização** / **Abrir atualizador** somente no executável desktop.
- O navegador continua sem dependência do launcher.

## Arquivos

- `desktop/main.cjs` — IPC, consulta no início e abertura do pacote validado.
- `desktop/preload.cjs` — ponte segura, sem `nodeIntegration`.
- `desktop/updater.cjs` — validação de manifesto, comparação de versões, download e SHA-256.
- `src/ui/DesktopUpdateNotice.tsx` — aviso visual no jogo.
- `src/types/desktop.d.ts` — contrato TypeScript da ponte desktop.

## Manifesto de produção

Publicar em `public/downloads/latest.json` (ou em um CDN HTTPS):

```json
{
  "version": "0.1.1",
  "url": "https://cdn.exemplo.com/Mythreon-Online-0.1.1-Windows-x64.exe",
  "sha256": "HASH_SHA256_DO_EXE_EM_LETRAS_HEX",
  "notes": "Pack 6: launcher e melhorias de estabilidade.",
  "mandatory": false,
  "platform": "win32",
  "arch": "x64"
}
```

O `url` deve apontar para o `.exe` final gerado pelo `npm run desktop:portable`. O hash precisa ser calculado depois do build e nunca deve ser colocado no Git antes de conferir o arquivo publicado.

## Limite histórico

O Pack 06 inicialmente baixava e abria explicitamente o novo executável. O helper separado, a troca atômica e o rollback agora estão documentados e implementados no Pack 07.
