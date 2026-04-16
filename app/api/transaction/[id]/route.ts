import { NextRequest, NextResponse } from "next/server";

const VEZION_API = "https://api.vezion.com.br";
const VEZION_SECRET = "sk_b5f93174912593b2873573803aa4ea7b15f4bf7f45e91970a315f619f19a23cc0816d4f8b54cea029e99ce911ec19af6ee7f4b232aefb49e38a9a0f2f882b49f";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const resp = await fetch(`${VEZION_API}/v1/transactions/${id}`, {
    headers: { "api-secret": VEZION_SECRET },
    cache: "no-store",
  });
  const data = await resp.json();
  return NextResponse.json(data);
}
