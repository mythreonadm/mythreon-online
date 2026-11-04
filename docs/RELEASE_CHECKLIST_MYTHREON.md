# Mythreon Online — porta de lançamento

Atualizado em 04/11/2026. Este documento separa o que já é verificável localmente do que exige conta, provedor ou aparelho físico. A versão só deve ser marcada como pública quando todos os itens P0 estiverem comprovados.

## Estado desta rodada

- [x] Artes existentes catalogadas; o jogo mantém PNG/GIF/GIFF e fallback por emoji.
- [x] Mercado Negro online com custódia, lotes, moedas, histórico por unidade, taxa e paginação.
- [x] Entitlement Premium server-side com webhook HMAC e idempotência.
- [x] Jornal com catálogo editorial versionado em `docs/jornal/releases.json` e sincronização no build.
- [x] Launcher Windows com manifesto HTTPS, SHA-256, download, rollback e smoke test.
- [ ] Checkout financeiro real conectado e homologado.
- [ ] Assinatura Authenticode do Windows e publicação do manifesto em CDN/URL estável.
- [ ] APK/AAB Android assinado, com política de atualização e teste em aparelhos físicos.
- [ ] Concorrência real no Supabase, teste de latência móvel e sessões longas.

## P0 — antes do commit de congelamento

1. Rodar `npm run release:gate`.
2. Rodar `npm run build` e guardar o resultado; o build deve concluir sem aviso de runtime desatualizado.
3. Testar cadastro por e-mail, confirmação, login Google, recuperação de senha, logout e login em outro dispositivo.
4. Testar a jornada tutorial → Matriz → hunt → drop → Ferreiro → Shop → Mercado → retorno à cabana.
5. Com duas contas, comprar o mesmo anúncio simultaneamente e confirmar que apenas uma compra é aceita.
6. Fazer 20 encontros por faixa (1–10, 11–25, 26–45, 46–70, 71–100), anotando tempo, dano, mortes, XP, gold, poções e loot.
7. Testar PC em duas máquinas e celular físico em Wi‑Fi e rede móvel; registrar qualquer rollback visual, botão fora da tela ou animação ausente.
8. Confirmar que a mochila cheia, expiração do anúncio e reconexão não duplicam nem perdem itens.
9. Definir o provedor de checkout, configurar `MYTHREON_PREMIUM_WEBHOOK_SECRET` apenas na Vercel e homologar um pagamento de teste.
10. Publicar a URL HTTPS do manifesto Windows e conferir checksum em uma máquina limpa.

## P1 — lançamento comercial

- Política de privacidade, termos, contato e aviso de economia virtual.
- Limite de anúncios, denúncia, moderação e retenção de chat/trade.
- Assinatura do executável, ícone final, versionamento e backup/rollback do banco.
- Página pública com links Windows, Android e navegador; nenhum link pode apontar para placeholder.
- Relatório de suporte: conta, personagem, horário UTC, operação e `requestId`.

## P2 — depois da abertura

- App Android nativo (Capacitor ou casca WebView) com o mesmo Supabase e atualização pela loja.
- Migração administrativa de saves locais para contas online, nunca por importação livre do cliente.
- Boss cooperativo com carga real, defesa ativa e inscrição do próximo ciclo.
- Expansão de biomas, catálogo de skins e artes animadas por estado.
- Agregados persistidos para histórico do Mercado em grande volume.

## Datas de controle

| Marco | Data planejada | Evidência | Estado |
|---|---:|---|---|
| Fechamento de artes e nomes | 05/11/2026 | `npm run journal:check` + inspeção visual | Pendente |
| Build web de congelamento | 06/11/2026 | `npm run build` | Pendente |
| Playtest PC/móvel | 07–09/11/2026 | relatório de sessões | Pendente |
| Homologação Mercado/Premium | 10/11/2026 | duas contas + checkout sandbox | Pendente |
| Release Windows assinado | 11/11/2026 | checksum + instalação limpa | Pendente |
| Beta Android | Após APK/AAB | aparelho físico + política de atualização | Pendente |

O Jornal não transforma um item em concluído sozinho: ele anuncia apenas alterações registradas e verificadas pelo código ou pelo relatório de teste.
