// GERADO por scripts/build-online-runtime.mjs. Edite server/*.ts e src/engine, nunca este arquivo.
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/premium.ts
var premium_exports = {};
__export(premium_exports, {
  PREMIUM_PLAN_IDS: () => PREMIUM_PLAN_IDS,
  PREMIUM_STATUSES: () => PREMIUM_STATUSES,
  config: () => config,
  default: () => handler,
  parsePremiumPayload: () => parsePremiumPayload,
  premiumSignature: () => premiumSignature,
  verifyPremiumSignature: () => verifyPremiumSignature
});
module.exports = __toCommonJS(premium_exports);
var import_node_crypto = require("node:crypto");
var import_pg = require("pg");
var PREMIUM_PLAN_IDS = ["PREMIUM_30D", "PREMIUM_90D", "PREMIUM_365D"];
var PREMIUM_STATUSES = ["active", "cancelled", "refunded"];
var pool;
function premiumSignature(rawBody2, secret) {
  return (0, import_node_crypto.createHmac)("sha256", secret).update(rawBody2, "utf8").digest("hex");
}
function verifyPremiumSignature(rawBody2, signature, secret) {
  const supplied = String(signature ?? "").replace(/^sha256=/i, "").trim().toLowerCase(), expected = premiumSignature(rawBody2, secret);
  if (!/^[a-f0-9]{64}$/.test(supplied)) return false;
  return (0, import_node_crypto.timingSafeEqual)(Buffer.from(supplied, "hex"), Buffer.from(expected, "hex"));
}
function text(value, max) {
  if (typeof value !== "string" || !value || value.length > max || value.includes("\0")) throw Error("Payload Premium inv\xE1lido.");
  return value;
}
function uuid(value) {
  const id = text(value, 64);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) throw Error("accountId inv\xE1lido.");
  return id;
}
function parsePremiumPayload(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw Error("Payload Premium inv\xE1lido.");
  const raw = value, planId = text(raw.planId, 32), status = text(raw.status, 16);
  if (!PREMIUM_PLAN_IDS.includes(planId)) throw Error("Plano Premium inv\xE1lido.");
  if (!PREMIUM_STATUSES.includes(status)) throw Error("Status Premium inv\xE1lido.");
  const startsAt = text(raw.startsAt, 80), expiresAt = text(raw.expiresAt, 80), starts = new Date(startsAt).getTime(), expires = new Date(expiresAt).getTime();
  if (!Number.isFinite(starts) || !Number.isFinite(expires) || expires <= starts) throw Error("Per\xEDodo Premium inv\xE1lido.");
  return { eventId: text(raw.eventId, 160), accountId: uuid(raw.accountId), planId, status, startsAt: new Date(starts).toISOString(), expiresAt: new Date(expires).toISOString(), provider: typeof raw.provider === "string" ? raw.provider.slice(0, 64) : "webhook", providerCustomerId: typeof raw.providerCustomerId === "string" ? raw.providerCustomerId.slice(0, 256) : void 0 };
}
function rawBody(req) {
  if (typeof req.rawBody === "string") return req.rawBody;
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody.toString("utf8");
  if (typeof req.body === "string") return req.body;
  return JSON.stringify(req.body ?? {});
}
var config = { maxDuration: 30 };
async function handler(req, res) {
  res.setHeader?.("Cache-Control", "no-store");
  res.setHeader?.("Content-Type", "application/json");
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: "M\xE9todo n\xE3o permitido." }));
  }
  const secret = process.env.MYTHREON_PREMIUM_WEBHOOK_SECRET, databaseUrl = process.env.DATABASE_URL;
  if (!secret || !databaseUrl) {
    res.statusCode = 503;
    return res.end(JSON.stringify({ error: "Webhook Premium ainda n\xE3o configurado." }));
  }
  const raw = rawBody(req);
  if (!verifyPremiumSignature(raw, String(req.headers?.["x-mythreon-signature"] ?? ""), secret)) {
    res.statusCode = 401;
    return res.end(JSON.stringify({ error: "Assinatura Premium inv\xE1lida." }));
  }
  let payload;
  try {
    payload = parsePremiumPayload(JSON.parse(raw));
  } catch (error) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: error instanceof Error ? error.message : "Payload Premium inv\xE1lido." }));
  }
  const sslCa = process.env.DATABASE_SSL_CA?.replace(/\\n/g, "\n").trim();
  pool ??= new import_pg.Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: true, ...sslCa ? { ca: sslCa } : {} }, max: 2, idleTimeoutMillis: 1e4, connectionTimeoutMillis: 8e3 });
  const client = await pool.connect();
  try {
    await client.query("begin");
    await client.query("set local statement_timeout='10s'");
    await client.query("insert into public.world_accounts(id) values($1) on conflict do nothing", [payload.accountId]);
    const inserted = await client.query("insert into public.world_premium_events(event_id,account_id,plan_id,status,payload) values($1,$2,$3,$4,$5) on conflict(event_id) do nothing returning event_id", [payload.eventId, payload.accountId, payload.planId, payload.status, JSON.stringify(payload)]);
    if (inserted.rows.length) await client.query("insert into public.world_premium_entitlements(account_id,plan_id,status,starts_at,expires_at,provider,provider_customer_id) values($1,$2,$3,$4,$5,$6,$7) on conflict(account_id) do update set plan_id=excluded.plan_id,status=excluded.status,starts_at=excluded.starts_at,expires_at=excluded.expires_at,provider=excluded.provider,provider_customer_id=excluded.provider_customer_id,updated_at=now()", [payload.accountId, payload.planId, payload.status, payload.startsAt, payload.expiresAt, payload.provider, payload.providerCustomerId ?? null]);
    await client.query("commit");
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true, idempotent: !inserted.rows.length, eventId: payload.eventId }));
  } catch (error) {
    await client.query("rollback").catch(() => {
    });
    console.error("premium webhook failed", { code: error?.code });
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: "N\xE3o foi poss\xEDvel atualizar o entitlement Premium." }));
  } finally {
    client.release();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PREMIUM_PLAN_IDS,
  PREMIUM_STATUSES,
  config,
  parsePremiumPayload,
  premiumSignature,
  verifyPremiumSignature
});
