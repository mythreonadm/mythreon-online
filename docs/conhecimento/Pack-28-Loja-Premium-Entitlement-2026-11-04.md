# Pack 28 — Loja Premium com entitlement seguro

Data: 2026-11-04  
Estado: base server-side implementada; checkout externo ainda pendente

## O que entrou

- Migration `010_premium_entitlements.sql` cria entitlement por conta e eventos idempotentes de webhook.
- O servidor sincroniza `premium`, `premiumPlanId` e `premiumUntil` durante a leitura/comando do mundo. Status vencido, cancelado ou reembolsado desativa o benefício.
- A Loja e o painel de benefícios exibem plano e validade quando o entitlement está ativo.
- Auto-venda por raridade e por item agora só é aplicada quando o entitlement Premium está ativo; configurações antigas não concedem o benefício a uma conta sem entitlement.
- `/api/premium` recebe eventos assinados com HMAC SHA-256 em `x-mythreon-signature`.
- Eventos repetidos pelo mesmo `eventId` não reaplicam o entitlement.
- O endpoint aceita os planos `PREMIUM_30D`, `PREMIUM_90D` e `PREMIUM_365D`; o navegador nunca grava Premium.

## Configuração necessária fora do código

- Aplicar a migration 010 no banco de produção.
- Configurar `MYTHREON_PREMIUM_WEBHOOK_SECRET` na Vercel.
- Configurar o checkout escolhido para enviar JSON assinado para `/api/premium` com `accountId`, `planId`, `status`, `startsAt`, `expiresAt` e `eventId`.
- Validar o webhook em ambiente de homologação antes de aceitar pagamentos reais.

## Arquivos principais

- `supabase/migrations/010_premium_entitlements.sql`
- `server/premium.ts`
- `server/world.ts`
- `api/premium.js`
- `scripts/build-online-runtime.mjs`
- `src/types/index.ts`
- `src/engine/save.ts`
- `src/ui/CommerceBenefits.tsx`
- `scripts/online-check.ts`

## Segurança

- Assinatura comparada com `timingSafeEqual`.
- Valores de plano e status têm lista fechada.
- Período precisa ser válido e futuro no encerramento.
- A tabela de eventos impede duplicação por idempotência.
- RLS permite apenas leitura do próprio entitlement; escrita fica no webhook/server.

## Pendências

- Escolher provedor de checkout e implementar o adaptador que assina os eventos.
- Cobrança recorrente, cancelamento automático e conciliação financeira.
- Teste de homologação com pagamento real/sandbox.
