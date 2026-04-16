"use client";

/** Gera um ID único para deduplicação browser ↔ CAPI */
function genEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface FbEventOpts {
  productId: string;
  amount: number;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
  };
}

async function sendToCapiAsync(
  eventName: string,
  eventId: string,
  opts: FbEventOpts
): Promise<void> {
  try {
    await fetch("/api/fb-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventId,
        productId: opts.productId,
        amount: opts.amount,
        customer: opts.customer ?? {},
      }),
    });
  } catch {
    // silently fail — não bloqueia o fluxo do usuário
  }
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** InitiateCheckout — dispara pixel + CAPI */
export function trackInitiateCheckout(opts: FbEventOpts): void {
  const eventId = genEventId();

  // Browser pixel (imediato)
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      value: opts.amount,
      currency: "BRL",
      content_ids: [opts.productId],
      content_type: "product",
    }, { eventID: eventId });
  }

  // CAPI server-side (assíncrono, sem await para não bloquear navegação)
  sendToCapiAsync("InitiateCheckout", eventId, opts);
}

/** AddPaymentInfo — dispara pixel + CAPI (temos PII do cliente aqui) */
export function trackAddPaymentInfo(opts: FbEventOpts): void {
  const eventId = genEventId();

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "AddPaymentInfo", {
      value: opts.amount,
      currency: "BRL",
      content_ids: [opts.productId],
      content_type: "product",
    }, { eventID: eventId });
  }

  sendToCapiAsync("AddPaymentInfo", eventId, opts);
}
