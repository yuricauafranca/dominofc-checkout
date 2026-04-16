import { NextRequest, NextResponse } from "next/server";
import { sendFbInitiateCheckout, sendFbAddPaymentInfo } from "@/lib/facebook";

/**
 * Recebe eventos do browser e dispara CAPI server-side para deduplicação.
 * O browser envia o mesmo event_id para o pixel, garantindo que o FB
 * não conta duplicado.
 *
 * Body: { eventName, eventId, productId, amount, customer? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, eventId, productId, amount, customer } = body;

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      undefined;
    const clientUserAgent = req.headers.get("user-agent") || undefined;
    const fbp = req.cookies.get("_fbp")?.value;
    const fbc = req.cookies.get("_fbc")?.value;

    const meta = { clientIp, clientUserAgent, fbp, fbc };

    if (eventName === "InitiateCheckout") {
      await sendFbInitiateCheckout({
        eventId,
        productId,
        amountInReais: amount,
        customer: customer ?? {},
        meta,
      });
    } else if (eventName === "AddPaymentInfo") {
      await sendFbAddPaymentInfo({
        eventId,
        productId,
        amountInReais: amount,
        customer: customer ?? {},
        meta,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[fb-event] Error:", err);
    return NextResponse.json({ ok: true }); // sempre 200 para não bloquear o fluxo
  }
}
