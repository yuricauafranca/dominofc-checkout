"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { OrderSummary } from "./OrderSummary";
import { StepIdentificacao } from "./StepIdentificacao";
import { StepEntrega } from "./StepEntrega";
import { StepPagamento } from "./StepPagamento";

interface CheckoutFormProps {
  product: Product;
}

type Step = 1 | 2 | 3;

export function CheckoutForm({ product }: CheckoutFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [quantity, setQuantity] = useState(1);

  const [identification, setIdentification] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [address, setAddress] = useState({
    zipcode: "",
    address: "",
    number: "",
    neighborhood: "",
    complement: "",
    city: "",
    state: "",
  });

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
        {/* ── Mobile order summary (hidden on desktop) ── */}
        <div className="h-auto lg:hidden flex flex-col px-3.5">
          <div className="sticky top-0 z-20 flex flex-col bg-white rounded-[0.5rem]">
            <OrderSummary
              mobile
              product={product}
              quantity={quantity}
              onQuantityChange={setQuantity}
            />
          </div>
        </div>

        {/* ── Col 1: Steps 1 + 2 ── */}
        <div className="px-3.5 lg:px-0">
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

        {/* ── Col 2: Step 3 (Pagamento) ── */}
        <div className="h-auto px-3.5 lg:px-0">
          <StepPagamento
            step={stepStateFor(3)}
            product={product}
            quantity={quantity}
            customerData={{ ...identification, ...address }}
            productId={product.productId}
          />
        </div>

        {/* ── Col 3: Order Summary (desktop only) ── */}
        <div className="h-auto hidden lg:block">
          <OrderSummary
            product={product}
            quantity={quantity}
            onQuantityChange={setQuantity}
          />
        </div>
      </form>
    </div>
  );
}
