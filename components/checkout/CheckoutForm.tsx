"use client";

import { useState, useEffect, useRef } from "react";
import type { Product } from "@/lib/products";
import { trackInitiateCheckout } from "@/lib/fbPixel";
import { OrderSummary } from "./OrderSummary";
import { StepIdentificacao } from "./StepIdentificacao";
import { StepEntrega } from "./StepEntrega";
import { StepPagamento } from "./StepPagamento";

const VALID_COUPONS: Record<string, number> = {
  "CLUBE10": 0.10,
};

function applyCoupon(code: string): number {
  return VALID_COUPONS[code.toUpperCase().trim()] ?? 0;
}

interface CheckoutFormProps {
  product: Product;
  customName?: string;
}

type Step = 1 | 2 | 3;

export function CheckoutForm({ product, customName = "" }: CheckoutFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [quantity, setQuantity] = useState(1);
  const [personName, setPersonName] = useState(customName);
  const [couponInput, setCouponInput] = useState("");
  const [discount, setDiscount] = useState(0); // 0–1 fraction
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    trackInitiateCheckout({ productId: product.productId, amount: product.price });
  }, [product.productId, product.price]);

  const [identification, setIdentification] = useState({
    name: "", email: "", phone: "",
  });

  const [address, setAddress] = useState({
    zipcode: "", address: "", number: "",
    neighborhood: "", complement: "", city: "", state: "",
  });

  function handleApplyCoupon() {
    const pct = applyCoupon(couponInput);
    if (pct > 0) {
      setDiscount(pct);
      setCouponMsg({ text: `Cupom aplicado! ${pct * 100}% de desconto.`, ok: true });
    } else {
      setDiscount(0);
      setCouponMsg({ text: "Cupom inválido.", ok: false });
    }
  }

  function stepStateFor(s: Step): "active" | "completed" | "inactive" {
    if (step === s) return "active";
    if (step > s) return "completed";
    return "inactive";
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 mx-auto max-w-2xl relative px-0 w-full lg:max-w-[74rem] md:mb-10">
      <form
        className="lg:grid lg:grid-cols-3 lg:gap-x-4 lg:px-3 relative space-y-reverse px-0 md:px-3.5 lg:mt-6"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* ── Mobile order summary ── */}
        <div className="h-auto lg:hidden flex flex-col px-3.5">
          <div className="sticky top-0 z-20 flex flex-col bg-white rounded-[0.5rem]">
            <OrderSummary
              mobile
              product={product}
              quantity={quantity}
              onQuantityChange={setQuantity}
              discount={discount}
              couponInput={couponInput}
              onCouponChange={setCouponInput}
              onApplyCoupon={handleApplyCoupon}
              couponMsg={couponMsg}
            />
          </div>
        </div>

        {/* ── Col 1: Steps 1 + 2 ── */}
        <div className="px-3.5 lg:px-0">
          {/* Nome personalização */}
          <div className="border border-[#E2E8F0] p-[1rem] md:p-[1.65rem] rounded-[0.5rem] bg-white mb-3">
            <h2 className="font-semibold text-[18px] text-[#0F172A] mb-1">Nome no dominó</h2>
            <p className="text-[13px] text-[#6B7280] mb-3">
              Qual nome você quer gravado nas peças e na caixa?
            </p>
            <input
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Ex: João Silva"
              maxLength={30}
              className="input-base"
            />
          </div>

          <StepIdentificacao
            step={stepStateFor(1)}
            data={identification}
            onChange={(d) => setIdentification((prev) => ({ ...prev, ...d }))}
            onNext={() => setStep(2)}
            onEdit={() => setStep(1)}
          />

          <StepEntrega
            step={stepStateFor(2)}
            data={address}
            onChange={(d) => setAddress((prev) => ({ ...prev, ...d }))}
            onNext={() => setStep(3)}
            onEdit={() => setStep(2)}
          />
        </div>

        {/* ── Col 2: Pagamento ── */}
        <div className="h-auto px-3.5 lg:px-0">
          <StepPagamento
            step={stepStateFor(3)}
            product={product}
            quantity={quantity}
            discount={discount}
            customerData={{ ...identification, ...address }}
            productId={product.productId}
            personName={personName}
          />
        </div>

        {/* ── Col 3: Order Summary desktop ── */}
        <div className="h-auto hidden lg:block">
          <OrderSummary
            product={product}
            quantity={quantity}
            onQuantityChange={setQuantity}
            discount={discount}
            couponInput={couponInput}
            onCouponChange={setCouponInput}
            onApplyCoupon={handleApplyCoupon}
            couponMsg={couponMsg}
          />
        </div>
      </form>
    </div>
  );
}
