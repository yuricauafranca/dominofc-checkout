import { NextRequest, NextResponse } from "next/server";
import { sendUtmifyOrder } from "@/lib/utmify";
import { sendFbPurchase } from "@/lib/facebook";

const VEZION_API = "https://api.vezion.com.br";
const VEZION_SECRET = "sk_b5f93174912593b2873573803aa4ea7b15f4bf7f45e91970a315f619f19a23cc0816d4f8b54cea029e99ce911ec19af6ee7f4b232aefb49e38a9a0f2f882b49f";

/**
 * Vezion webhook payload:
 * {
 *   id: string,
 *   external_id: string,
 *   total_amount: number,
 *   total_value: number,
 *   status: "AUTHORIZED" | "PENDING" | "CHARGEBACK" | "FAILED" | "IN_DISPUTE",
 *   payment_method: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[Webhook] Vezion payload:", JSON.stringify(body));

    const { id, external_id, total_amount, total_value, amount, status } = body;
    const totalReais: number = amount ?? total_value ?? total_amount ?? 0;
    const transactionId: string = id || external_id;

    if (!transactionId) {
      return NextResponse.json({ ok: true }); // ignore malformed
    }

    const upperStatus: string = (status ?? "").toUpperCase();

    if (upperStatus === "AUTHORIZED") {
      // Fetch full transaction details from Vezion to get customer info
      let customer = {
        name: "Cliente",
        email: "cliente@dominofc.com",
        phone: "",
        document: "",
        country: "BR",
      };
      let products = [
        {
          id: transactionId,
          name: "Dominó FC",
          planId: transactionId,
          planName: "Dominó FC",
          quantity: 1,
          priceInCents: Math.round(totalReais * 100),
        },
      ];
      let clientIp: string | undefined;
      let clientUserAgent: string | undefined;

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
              phone: (tx.customer.phone || "").replace(/\D/g, ""),
              document: (tx.customer.document || "").replace(/\D/g, ""),
              country: "BR",
            };
          }
          if (tx?.items?.length) {
            products = tx.items.map(
              (item: { name?: string; quantity?: number; unit_amount?: number }) => ({
                id: transactionId,
                name: item.name || "Dominó FC",
                planId: transactionId,
                planName: item.name || "Dominó FC",
                quantity: item.quantity || 1,
                priceInCents: item.unit_amount || 0,
              })
            );
          }
          clientIp = tx?.ip || undefined;
          clientUserAgent = tx?.user_agent || undefined;
        }
      } catch (err) {
        console.error("[Webhook] Could not fetch transaction details:", err);
      }

      // ── 1. UTMify — venda aprovada ──────────────────────────────────────────
      await sendUtmifyOrder({
        orderId: transactionId,
        status: "paid",
        platform: "DominoFC",
        paymentMethod: "pix",
        createdAt: new Date().toISOString(),
        approvedDate: new Date().toISOString(),
        refundedAt: null,
        isTest: false,
        customer,
        products,
        commission: {
          totalPriceInCents: Math.round(totalReais * 100),
          gatewayFeeInCents: 0,
          userCommissionInCents: Math.round(totalReais * 100),
        },
      });
      console.log("[Webhook] UTMify Paid sent for:", transactionId);

      // ── 2. Facebook CAPI — Purchase (server-side, funciona sem o browser) ──
      await sendFbPurchase({
        orderId: transactionId,
        amountInReais: totalReais,
        customer,
        meta: { clientIp, clientUserAgent },
      });
      console.log("[Webhook] Facebook CAPI Purchase sent for:", transactionId);
    }

    // Always respond 200 quickly so Vezion doesn't retry
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Webhook] Error:", err);
    return NextResponse.json({ ok: true });
  }
}
