import crypto from "crypto";

const PIXEL_ID = "1443726713443951";
const ACCESS_TOKEN =
  "EAALE38JfZC8gBRMrZCF43HD4lzV9J3tT1i1pWAESnsuO2QpPEa7UgKKLgVzym2xG2i9hhdFpc68QAXofR6tvsPKZB9QZAyYfYe5ydPOnQrzgIGwy1BLoPllrtiHqqlhUPAIMTv6n69NePzup0pf7KmwM6eIlBDBWiaFn8XtZBZAcgD9wUXu1cnF6uJmZBG2IQZDZD";
const API_VERSION = "v19.0";
const ENDPOINT = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;

function hash(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function hashRaw(value: string): string {
  // For values already normalized (phone digits only, CPF digits only)
  return crypto.createHash("sha256").update(value.trim()).digest("hex");
}

export interface FbPurchasePayload {
  orderId: string;
  amountInReais: number;
  currency?: string;
  customer: {
    name: string;
    email: string;
    phone: string;       // digits only
    document: string;    // CPF digits only
    country?: string;
  };
  clientIp?: string;
  clientUserAgent?: string;
  fbp?: string;          // _fbp cookie value
  fbc?: string;          // _fbc cookie value
}

export async function sendFbPurchase(payload: FbPurchasePayload): Promise<void> {
  const {
    orderId,
    amountInReais,
    currency = "BRL",
    customer,
    clientIp,
    clientUserAgent,
    fbp,
    fbc,
  } = payload;

  // Build user_data — hash all PII
  const nameParts = customer.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || firstName;

  const userData: Record<string, string | string[]> = {
    em: hash(customer.email),
    ph: hashRaw(customer.phone.replace(/\D/g, "")),
    fn: hash(firstName),
    ln: hash(lastName),
    country: hash(customer.country ?? "br"),
  };

  if (customer.document) {
    userData["external_id"] = hashRaw(customer.document.replace(/\D/g, ""));
  }
  if (clientIp) userData["client_ip_address"] = clientIp;
  if (clientUserAgent) userData["client_user_agent"] = clientUserAgent;
  if (fbp) userData["fbp"] = fbp;
  if (fbc) userData["fbc"] = fbc;

  const event = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: orderId, // deduplication key
    action_source: "website",
    user_data: userData,
    custom_data: {
      value: amountInReais,
      currency,
      order_id: orderId,
    },
  };

  const body = {
    data: [event],
    // test_event_code: "TEST12345", // uncomment to test in Events Manager
  };

  try {
    const res = await fetch(`${ENDPOINT}?access_token=${ACCESS_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      console.error("[Facebook CAPI] Error:", JSON.stringify(json));
    } else {
      console.log("[Facebook CAPI] Purchase sent:", orderId, "events_received:", json.events_received);
    }
  } catch (err) {
    console.error("[Facebook CAPI] Fetch failed:", err);
  }
}
