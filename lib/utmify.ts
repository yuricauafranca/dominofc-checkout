const UTMIFY_ENDPOINT = "https://api.utmify.com.br/api-credentials/orders";
const UTMIFY_TOKEN = "FW43Ui1XEvoh88gSU5edFjQltsbuNjclg00Y";

export type UtmifyStatus = "waiting_payment" | "paid" | "refused" | "refunded" | "chargedback";

export interface UtmifyOrderPayload {
  orderId: string;
  status: UtmifyStatus;
  platform: string;
  paymentMethod: string;
  createdAt: string;   // ISO string
  approvedDate?: string | null;
  refundedAt?: string | null;
  isTest: boolean;
  customer: {
    name: string;
    email: string;
    phone: string;
    document: string;
    country: string;
  };
  products: Array<{
    id: string;
    name: string;
    planId: string;
    planName: string;
    quantity: number;
    priceInCents: number;
  }>;
  commission: {
    totalPriceInCents: number;
    gatewayFeeInCents: number;
    userCommissionInCents: number;
  };
  trackingParameters?: {
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    utm_term: string | null;
    sck?: string | null;
    src?: string | null;
  };
}

export async function sendUtmifyOrder(payload: UtmifyOrderPayload): Promise<void> {
  // Ensure all trackingParameters are present (required by UTMify even if null)
  const tracking = {
    utm_source: payload.trackingParameters?.utm_source ?? null,
    utm_medium: payload.trackingParameters?.utm_medium ?? null,
    utm_campaign: payload.trackingParameters?.utm_campaign ?? null,
    utm_content: payload.trackingParameters?.utm_content ?? null,
    utm_term: payload.trackingParameters?.utm_term ?? null,
    sck: payload.trackingParameters?.sck ?? null,
    src: payload.trackingParameters?.src ?? null,
  };

  const body = { ...payload, trackingParameters: tracking };

  try {
    const res = await fetch(UTMIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": UTMIFY_TOKEN,
      },
      body: JSON.stringify(body),
    });
    const responseText = await res.text();
    if (!res.ok) {
      console.error("[UTMify] Error:", res.status, responseText);
    } else {
      console.log("[UTMify] Order sent:", payload.orderId, payload.status);
    }
  } catch (err) {
    console.error("[UTMify] Failed to send order:", err);
  }
}
