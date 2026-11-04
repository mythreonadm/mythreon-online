# Pack 07 — Atualização real com backup e rollback

**Data:** 03/11/2026  
**Status:** implementado e validado localmente.

## O que mudou

- O botão do launcher agora inicia um processo helper separado no Windows.
- O helper espera o jogo antigo encerrar antes de tocar no executável.
- O pacote é verificado novamente por SHA-256, mesmo depois do download.
- A versão atual é preservada como `Mythreon Online.previous.exe`.
- A troca usa arquivo temporário e restaura o backup se qualquer etapa falhar.
- Em caso de sucesso, o novo executável é iniciado automaticamente.
- Em desenvolvimento (`npm run desktop:start`), o fluxo antigo de abrir o pacote permanece para não interromper o ciclo local.

## Arquivos

- `desktop/main.cjs` — inicia o helper e encerra o processo antigo.
- `desktop/update-helper.cjs` — espera, valida, troca, faz backup e inicia a nova versão.
- `src/ui/DesktopUpdateNotice.tsx` — botão **Reiniciar para atualizar**.

## Garantias e limites

- O helper não aceita destinos que não sejam `.exe`.
- O hash precisa ser SHA-256 em hexadecimal.
- O download permanece em `userData/updates` até a próxima limpeza planejada.
- O backup anterior fica disponível para diagnóstico e rollback manual.
- Ainda falta assinatura Authenticode do executável para distribuição pública; isso deve ser feito antes do lançamento comercial para reduzir alertas do Windows Defender/SmartScreen.

## Operação de release

1. Incrementar `version` em `package.json` e manter `package-lock.json` sincronizado.
2. Executar `npm run desktop:portable`.
3. Calcular `Get-FileHash release\\Mythreon-Online-VERSAO-Windows-x64.exe -Algorithm SHA256`.
4. Publicar o `.exe` em CDN/Release HTTPS.
5. Publicar `public/downloads/latest.json` com a nova versão, URL e hash.
6. Abrir uma versão anterior e confirmar: aviso → download → reinício → nova versão.
