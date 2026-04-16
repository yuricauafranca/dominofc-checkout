import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.vezion.com.br/v1/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-secret": "sk_b5f93174912593b2873573803aa4ea7b15f4bf7f45e91970a315f619f19a23cc0816d4f8b54cea029e99ce911ec19af6ee7f4b232aefb49e38a9a0f2f882b49f",
    },
    body: JSON.stringify({
      external_id: `debug-${Date.now()}`,
      total_amount: 12990,
      payment_method: "PIX",
      webhook_url: "https://dominofc-checkout.vercel.app/api/webhook",
      ip: "1.2.3.4",
      items: [{
        id: "prod-001",
        title: "Dominó Flamengo",
        description: "Dominó Flamengo",
        price: 129.90,
        quantity: 1,
        is_physical: true,
      }],
      customer: {
        name: "João Teste",
        email: "joao@teste.com",
        document: "52998224725",
        document_type: "CPF",
        phone: "11999887766",
      },
    }),
  });
  const data = await res.json();
  return NextResponse.json({ status: res.status, data });
}
