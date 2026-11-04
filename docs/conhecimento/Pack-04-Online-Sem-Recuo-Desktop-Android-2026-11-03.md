---
title: "Pack 04 — Online sem recuo e preparação multiplataforma"
date: 2026-11-03
status: concluído
tags:
  - mythreon
  - online
  - performance
  - mobile
  - desktop
---

# Problema observado

Ao clicar em ações online (plantar, equipar, vender, entrar em mapa), a interface aplicava a mudança otimista e, antes da confirmação, uma leitura social/polling podia aplicar um snapshot anterior. O efeito visual era de “sem internet” ou de retorno ao estado antigo.

# Correção

- Leituras sociais continuam atualizando chat, amigos, correio e trocas, mas não sobrescrevem o estado de gameplay.
- Polling e sincronização completa aguardam a fila de comandos terminar.
- A revisão do servidor continua protegendo contra snapshots antigos.
- A fila de comandos mantém a ordem das ações sem bloquear a interface.

Resultado esperado: a ação permanece visível localmente até a resposta autoritativa, sem rollback causado por uma leitura social concorrente.

# Incubação

A incubadora já usa `startedAt`/`completesAt` persistidos. O Pack mantém o tempo mesmo ao sair da tela ou recarregar; os tiers usam uma curva de beta progressiva (60s, 180s, 480s, 1200s e 2400s).

# Desktop, Android e Launcher

## O que o código atual permite

- A mesma aplicação web pode ser empacotada em Electron para Windows sem alterar o modo navegador.
- Android pode usar uma casca Capacitor/WebView ou PWA instalável, preservando a mesma conta e o mesmo servidor.
- Assets e atualizações podem continuar vindo do deploy web, evitando duplicar a lógica do jogo.

## O que ainda precisa de uma etapa própria

- Assinar o instalador Windows.
- Definir canal de release e manifesto de versão.
- Criar o atualizador seguro (download, verificação SHA-256, rollback e só então substituição).
- Gerar APK/AAB Android e configurar ícone, splash, permissões e política de atualização.
- Testar Supabase/Auth, áudio, notificações e armazenamento em cada plataforma.

Não existe ainda um `.exe` ou APK final neste Pack; a arquitetura fica preparada sem desligar o acesso pelo navegador.

# Arquivos principais

- `src/online/controller.ts`
- `src/store/gameStore.ts`
- `src/ui/OnlineCommunity.tsx`
- `src/ui/DivineBeasts.tsx`

# Validação

- TypeScript, jornada e integração online aprovados.
- Teste visual Electron aprovado.
- Build de produção e runtime online aprovados.
- Cérebro/Obsidian sincronizados.
- Smoke test nativo do Electron aprovado: interface renderizada, asset local, WebCrypto, renderer isolado e Worker do Laboratório.

# Próxima etapa

1. Playtest de ações rápidas em produção com duas abas/dispositivos.
2. Medir latência e registrar falhas de confirmação.
3. Criar o shell Electron e o manifesto do launcher em uma etapa isolada.
4. Só depois empacotar Android e definir distribuição.
