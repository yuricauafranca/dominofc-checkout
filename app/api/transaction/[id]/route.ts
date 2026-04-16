import { NextRequest, NextResponse } from "next/server";

const VEZION_API = "https://api.vezion.com.br";
const VEZION_SECRET = "sk_1a88c321449288d2d834e841b967e91c8331b0576a517ecbd181d76ab313a70c6b5839d649846e6801a686328b0cdedeede5e9402a5322ef6519791dc97c8414";

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
