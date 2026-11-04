---
title: "Pack 05 — Auth no PC e distribuição multiplataforma"
date: 2026-11-03
status: implementado parcialmente
tags:
  - mythreon
  - supabase
  - google-oauth
  - desktop
  - android
  - downloads
---

# Entregue no código

- O fluxo Google usa `mythreon://game/auth/callback` quando executado no Electron.
- A janela Electron trata esse deep-link como a página inicial da SPA, preservando o hash/query que contém a sessão do Supabase.
- No navegador, o redirect continua sendo `/auth/callback` no domínio atual.
- A página inicial ganhou uma seção clara com downloads para Windows, Android e navegador.
- Os endereços são configuráveis por `VITE_WINDOWS_DOWNLOAD_URL` e `VITE_ANDROID_DOWNLOAD_URL`.

# Configuração obrigatória no Supabase

Em **Authentication → URL Configuration → Redirect URLs**, adicionar:

```text
https://mythreon-online.vercel.app/auth/callback
mythreon://game/auth/callback
```

No provedor Google, o **Authorized redirect URI** continua sendo o callback do Supabase:

```text
https://SEU-PROJETO.supabase.co/auth/v1/callback
```

O `mythreon://...` é o destino final da aplicação, não deve ser colocado como callback do Google Cloud.

# Downloads

Os botões já existem na landing page, mas precisam apontar para artefatos publicados. O executável local não deve ser copiado para o bundle Vercel por padrão devido ao tamanho. Publicar o `.exe` e o `.apk` em Releases, Blob/CDN ou outro host e preencher as duas variáveis no Vercel.

# Estado e próximo passo

- Smoke test Windows: aprovado.
- Build web: aprovado.
- Google no navegador: mantém o fluxo existente.
- Google no Electron: código preparado; ainda depende da Redirect URL customizada no Supabase e de teste real com a conta Google.
- Android: a interface está preparada para o mesmo endpoint; ainda falta gerar e publicar o APK/AAB.
- Launcher automático: próximo pacote, com manifesto, SHA-256, download, rollback e assinatura.
