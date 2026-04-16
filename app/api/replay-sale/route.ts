import { NextRequest, NextResponse } from "next/server";
import { sendUtmifyOrder } from "@/lib/utmify";
import { sendFbPurchase } from "@/lib/facebook";

const VEZION_API = "https://api.vezion.com.br";
const VEZION_SECRET = "sk_b5f93174912593b2873573803aa4ea7b15f4bf7f45e91970a315f619f19a23cc0816d4f8b54cea029e99ce911ec19af6ee7f4b232aefb49e38a9a0f2f882b49f";
const REPLAY_SECRET = "replay_dominofc_2026";

export async function POST(req: NextRequest) {
  const { secret, transactionId } = await req.json();

  if (secret !== REPLAY_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Busca dados completos na Vezion
  const txResp = await fetch(`${VEZION_API}/v1/transactions/${transactionId}`, {
    headers: { "api-secret": VEZION_SECRET },
    cache: "no-store",
  });

  if (!txResp.ok) {
    const err = await txResp.json();
    return NextResponse.json({ error: "Vezion fetch failed", detail: err }, { status: 502 });
  }

  const tx = await txResp.json();
  console.log("[Replay] TX:", JSON.stringify(tx));

  const totalReais: number = tx.total_value ?? tx.total_amount ?? 0;

  const customer = {
    name: tx.customer?.name || "Cliente",
    email: tx.customer?.email || "",
    phone: (tx.customer?.phone || "").replace(/\D/g, ""),
    document: (tx.customer?.document || "").replace(/\D/g, ""),
    country: "BR",
  };

  const products = tx.items?.length
    ? tx.items.map((item: { name?: string; quantity?: number; unit_amount?: number }) => ({
        id: transactionId,
        name: item.name || "Dominó FC",
        planId: transactionId,
        planName: item.name || "Dominó FC",
        quantity: item.quantity || 1,
        priceInCents: item.unit_amount || Math.round(totalReais * 100),
      }))
    : [{ id: transactionId, name: "Dominó FC", planId: transactionId, planName: "Dominó FC", quantity: 1, priceInCents: Math.round(totalReais * 100) }];

  // UTMify — paid
  await sendUtmifyOrder({
    orderId: transactionId,
    status: "paid",
    platform: "DominoFC",
    paymentMethod: "pix",
    createdAt: tx.created_at || new Date().toISOString(),
    approvedDate: tx.approved_at || new Date().toISOString(),
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

  // Facebook — Purchase
  await sendFbPurchase({
    orderId: transactionId,
    amountInReais: totalReais,
    customer,
  });

  return NextResponse.json({ ok: true, transactionId, totalReais, customer: customer.name });
}
