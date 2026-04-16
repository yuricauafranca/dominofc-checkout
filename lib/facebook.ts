import crypto from "crypto";

const PIXEL_ID = "1443726713443951";
const ACCESS_TOKEN =
  "EAALE38JfZC8gBRMrZCF43HD4lzV9J3tT1i1pWAESnsuO2QpPEa7UgKKLgVzym2xG2i9hhdFpc68QAXofR6tvsPKZB9QZAyYfYe5ydPOnQrzgIGwy1BLoPllrtiHqqlhUPAIMTv6n69NePzup0pf7KmwM6eIlBDBWiaFn8XtZBZAcgD9wUXu1cnF6uJmZBG2IQZDZD";
const API_VERSION = "v19.0";
const ENDPOINT = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hash(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function hashRaw(value: string): string {
  return crypto.createHash("sha256").update(value.trim()).digest("hex");
}

function buildUserData(opts: {
  email?: string;
  phone?: string;
  name?: string;
  document?: string;
  country?: string;
  clientIp?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
}): Record<string, string> {
  const ud: Record<string, string> = {};

  if (opts.email) ud.em = hash(opts.email);
  if (opts.phone) ud.ph = hashRaw(opts.phone.replace(/\D/g, ""));
  if (opts.document) ud.external_id = hashRaw(opts.document.replace(/\D/g, ""));
  if (opts.country) ud.country = hash(opts.country);

  if (opts.name) {
    const parts = opts.name.trim().split(/\s+/);
    ud.fn = hash(parts[0] ?? "");
    ud.ln = hash(parts.slice(1).join(" ") || (parts[0] ?? ""));
  }

  if (opts.clientIp) ud.client_ip_address = opts.clientIp;
  if (opts.clientUserAgent) ud.client_user_agent = opts.clientUserAgent;
  if (opts.fbp) ud.fbp = opts.fbp;
  if (opts.fbc) ud.fbc = opts.fbc;

  return ud;
}

async function sendCapi(events: object[]): Promise<void> {
  try {
    const res = await fetch(`${ENDPOINT}?access_token=${ACCESS_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: events }),
    });
    const json = await res.json();
    if (!res.ok) {
      console.error("[Facebook CAPI] Error:", JSON.stringify(json));
    } else {
      console.log(
        "[Facebook CAPI]",
        (events[0] as { event_name: string }).event_name,
        "sent — events_received:",
        json.events_received
      );
    }
  } catch (err) {
    console.error("[Facebook CAPI] Fetch failed:", err);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface FbCustomerData {
  name?: string;
  email?: string;
  phone?: string;
  document?: string;
  country?: string;
}

export interface FbRequestMeta {
  clientIp?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
}

/** Fired server-side when user clicks "COMPRAR AGORA" → vai ao checkout */
export async function sendFbInitiateCheckout(opts: {
  eventId: string;
  productId: string;
  amountInReais: number;
  customer?: FbCustomerData;
  meta?: FbRequestMeta;
}): Promise<void> {
  await sendCapi([
    {
      event_name: "InitiateCheckout",
      event_time: Math.floor(Date.now() / 1000),
      event_id: opts.eventId,
      action_source: "website",
      user_data: buildUserData({
        ...opts.customer,
        ...opts.meta,
      }),
      custom_data: {
        value: opts.amountInReais,
        currency: "BRL",
        content_ids: [opts.productId],
        content_type: "product",
      },
    },
  ]);
}

/** Fired server-side when user submits CPF + clica "Finalizar Compra" (gera PIX) */
export async function sendFbAddPaymentInfo(opts: {
  eventId: string;
  productId: string;
  amountInReais: number;
  customer: FbCustomerData;
  meta?: FbRequestMeta;
}): Promise<void> {
  await sendCapi([
    {
      event_name: "AddPaymentInfo",
      event_time: Math.floor(Date.now() / 1000),
      event_id: opts.eventId,
      action_source: "website",
      user_data: buildUserData({
        ...opts.customer,
        country: opts.customer.country ?? "br",
        ...opts.meta,
      }),
      custom_data: {
        value: opts.amountInReais,
        currency: "BRL",
        content_ids: [opts.productId],
        content_type: "product",
      },
    },
  ]);
}

/** Fired server-side via webhook quando PIX é pago (AUTHORIZED) */
export async function sendFbPurchase(opts: {
  orderId: string;
  amountInReais: number;
  customer: FbCustomerData;
  meta?: FbRequestMeta;
}): Promise<void> {
  await sendCapi([
    {
      event_name: "Purchase",
      event_time: Math.floor(Date.now() / 1000),
      event_id: opts.orderId,
      action_source: "website",
      user_data: buildUserData({
        ...opts.customer,
        country: opts.customer.country ?? "br",
        ...opts.meta,
      }),
      custom_data: {
        value: opts.amountInReais,
        currency: "BRL",
        order_id: opts.orderId,
      },
    },
  ]);
}
