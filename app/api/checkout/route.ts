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
      discount = 0,     // 0–1 fraction (e.g. 0.10 = 10% off)
      personName = "",  // name to be engraved on the domino
      customer,  // { name, email, phone, document }
      address,   // { zipcode, address, number, neighborhood, city, state }
      trackingParameters, // optional UTM params from frontend
    } = body;

    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const totalAmount = product.price * quantity * (1 - discount); // reais
    const externalId = `domino-${productId}-${Date.now()}`;

    // Deriva a URL base do próprio request para garantir que o webhook
    // aponta sempre para o servidor correto (Vercel, domínio customizado, etc.)
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const baseUrl = `${proto}://${host}`;

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
          description: personName ? `${product.fullName} - Nome: ${personName}` : product.fullName,
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

    console.log("[Checkout] webhook_url enviado à Vezion:", `${baseUrl}/api/webhook`);

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
      console.error("[Checkout] Vezion error:", JSON.stringify(data));
      return NextResponse.json(
        { error: data?.message || "Erro ao gerar PIX" },
        { status: resp.status }
      );
    }

    const transactionId: string = data.id || data.transaction_id || externalId;
    console.log("[Checkout] Transação criada:", transactionId);

    // Fire UTMify "WaitingPayment" (PIX gerado, aguardando pagamento)
    console.log("[Checkout] Enviando UTMify waiting_payment...");
    await sendUtmifyOrder({
      orderId: transactionId,
      status: "waiting_payment",
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
        totalPriceInCents: Math.round(totalAmount * 100),
        gatewayFeeInCents: 0,
        userCommissionInCents: Math.round(totalAmount * 100),
      },
      trackingParameters: trackingParameters || {},
    });

    const pixCode: string =
      data.pix?.payload || data.pix?.code || data.pix_code || data.qr_code || "";

    // Generate QR code URL from PIX payload using free public service
    const pixQrCodeUrl = pixCode
      ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`
      : undefined;

    return NextResponse.json({
      transactionId,
      pixCode,
      pixQrCodeUrl,
      amount: product.price * quantity,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
