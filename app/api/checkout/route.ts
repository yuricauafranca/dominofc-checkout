import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { sendUtmifyOrder } from "@/lib/utmify";

const VEZION_API = "https://api.vezion.com.br";
const VEZION_SECRET = "sk_b5f93174912593b2873573803aa4ea7b15f4bf7f45e91970a315f619f19a23cc0816d4f8b54cea029e99ce911ec19af6ee7f4b232aefb49e38a9a0f2f882b49f";
function stripCpf(cpf: string) {
  return cpf.replace(/\D/g, "");
}

function stripPhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      quantity = 1,
      customer,  // { name, email, phone, document }
      address,   // { zipcode, address, number, neighborhood, city, state }
      trackingParameters, // optional UTM params from frontend
    } = body;

    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const totalAmount = product.price * quantity; // reais
    const externalId = `domino-${productId}-${Date.now()}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dominofc.com";

    // Get client IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const payload = {
      external_id: externalId,
      total_amount: totalAmount,
      payment_method: "PIX",
      webhook_url: `${baseUrl}/api/webhook`,
      ip,
      items: [
        {
          id: productId,
          title: product.fullName,
          description: product.fullName,
          price: product.price,
          quantity,
          is_physical: true,
        },
      ],
      customer: {
        name: customer.name,
        email: customer.email,
        document: stripCpf(customer.document),
        document_type: "CPF",
        phone: stripPhone(customer.phone),
      },
    };

    const resp = await fetch(`${VEZION_API}/v1/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-secret": VEZION_SECRET,
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("Vezion error:", data);
      return NextResponse.json(
        { error: data?.message || "Erro ao gerar PIX" },
        { status: resp.status }
      );
    }

    const transactionId: string = data.id || data.transaction_id || externalId;

    // Fire UTMify "WaitingPayment" (PIX gerado, aguardando pagamento)
    await sendUtmifyOrder({
      orderId: transactionId,
      status: "WaitingPayment",
      platform: "DominoFC",
      paymentMethod: "pix",
      createdAt: new Date().toISOString(),
      approvedDate: null,
      refundedAt: null,
      isTest: false,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: stripPhone(customer.phone),
        document: stripCpf(customer.document),
        country: "BR",
      },
      products: [
        {
          id: productId,
          name: product.fullName,
          planId: productId,
          planName: product.name,
          quantity,
          priceInCents: Math.round(product.price * 100),
        },
      ],
      commission: {
        totalPriceInCents: totalAmount,
        gatewayFeeInCents: 0,
        userValueInCents: totalAmount,
      },
      trackingParameters: trackingParameters || {},
    });

    return NextResponse.json({
      transactionId,
      pixCode: data.pix?.code || data.pix_code || data.qr_code,
      pixQrCodeUrl: data.pix?.qr_code_url || data.qr_code_url || data.pix_qr_code_url,
      amount: product.price * quantity,
      raw: data,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
