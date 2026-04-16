import { NextRequest, NextResponse } from "next/server";
import { sendUtmifyOrder } from "@/lib/utmify";

const VEZION_API = "https://api.vezion.com.br";
const VEZION_SECRET = "sk_1a88c321449288d2d834e841b967e91c8331b0576a517ecbd181d76ab313a70c6b5839d649846e6801a686328b0cdedeede5e9402a5322ef6519791dc97c8414";

/**
 * Vezion webhook payload:
 * {
 *   id: string,
 *   external_id: string,
 *   total_amount: number,   // in cents
 *   status: "AUTHORIZED" | "PENDING" | "CHARGEBACK" | "FAILED" | "IN_DISPUTE",
 *   payment_method: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[Webhook] Vezion payload:", JSON.stringify(body));

    const { id, external_id, total_amount, status } = body;
    const transactionId: string = id || external_id;

    if (!transactionId) {
      return NextResponse.json({ ok: true }); // ignore malformed
    }

    const upperStatus: string = (status ?? "").toUpperCase();

    if (upperStatus === "AUTHORIZED") {
      // Fetch full transaction details from Vezion to get customer info
      let customer = { name: "Cliente", email: "cliente@dominofc.com", phone: "", document: "", country: "BR" };
      let products = [{ id: transactionId, name: "Dominó FC", planId: transactionId, planName: "Dominó FC", quantity: 1, priceInCents: total_amount ?? 0 }];

      try {
        const txResp = await fetch(`${VEZION_API}/v1/transactions/${id}`, {
          headers: { "api-secret": VEZION_SECRET },
          cache: "no-store",
        });
        if (txResp.ok) {
          const tx = await txResp.json();
          if (tx?.customer) {
            customer = {
              name: tx.customer.name || "Cliente",
              email: tx.customer.email || "",
              phone: tx.customer.phone || "",
              document: tx.customer.document || "",
              country: "BR",
            };
          }
          if (tx?.items?.length) {
            products = tx.items.map((item: { name?: string; quantity?: number; unit_amount?: number }) => ({
              id: transactionId,
              name: item.name || "Dominó FC",
              planId: transactionId,
              planName: item.name || "Dominó FC",
              quantity: item.quantity || 1,
              priceInCents: item.unit_amount || 0,
            }));
          }
        }
      } catch (err) {
        console.error("[Webhook] Could not fetch transaction details:", err);
      }

      await sendUtmifyOrder({
        orderId: transactionId,
        status: "Paid",
        platform: "DominoFC",
        paymentMethod: "pix",
        createdAt: new Date().toISOString(),
        approvedDate: new Date().toISOString(),
        refundedAt: null,
        isTest: false,
        customer,
        products,
        commission: {
          totalPriceInCents: total_amount ?? 0,
          gatewayFeeInCents: 0,
          userValueInCents: total_amount ?? 0,
        },
      });

      console.log("[Webhook] UTMify Paid sent for:", transactionId);
    }

    // Always respond 200 quickly so Vezion doesn't retry
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Webhook] Error:", err);
    // Still return 200 to avoid Vezion retries flooding us
    return NextResponse.json({ ok: true });
  }
}
