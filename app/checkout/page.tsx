import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { Header } from "@/components/checkout/Header";
import { Banner } from "@/components/checkout/Banner";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Footer } from "@/components/checkout/Footer";

interface CheckoutPageProps {
  searchParams: Promise<{ product?: string; nome?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { product: productId, nome } = await searchParams;

  if (!productId) notFound();

  const product = getProduct(productId);
  if (!product) notFound();

  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <Banner />
      <CheckoutForm product={product} customName={nome ?? ""} />
      <Footer />
    </div>
  );
}
