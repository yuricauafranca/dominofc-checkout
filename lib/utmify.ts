const UTMIFY_ENDPOINT = "https://api.utmify.com.br/api-credentials/orders";
const UTMIFY_TOKEN = "FW43Ui1XEvoh88gSU5edFjQltsbuNjclg00Y";

export type UtmifyStatus = "WaitingPayment" | "Paid" | "Refunded" | "Canceled";

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
    userValueInCents: number;
  };
  trackingParameters?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    sck?: string;
    src?: string;
  };
}

export async function sendUtmifyOrder(payload: UtmifyOrderPayload): Promise<void> {
  try {
    const res = await fetch(UTMIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": UTMIFY_TOKEN,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[UTMify] Error:", res.status, body);
    } else {
      console.log("[UTMify] Order sent:", payload.orderId, payload.status);
    }
  } catch (err) {
    console.error("[UTMify] Failed to send order:", err);
  }
}
