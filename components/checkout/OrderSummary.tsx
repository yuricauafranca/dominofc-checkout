"use client";

import Image from "next/image";
import { Minus, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";

interface OrderSummaryProps {
  product: Product;
  quantity: number;
  onQuantityChange: (q: number) => void;
  /** When true (mobile): show collapsible header with price+chevron */
  mobile?: boolean;
}

function SummaryBody({
  product,
  quantity,
  onQuantityChange,
}: Omit<OrderSummaryProps, "mobile">) {
  const total = product.price * quantity;

  return (
    <>
      {/* Coupon */}
      <div className="mx-4 my-4">
        <div className="flex justify-between gap-2">
          <input
            className="flex border border-[#dedede] bg-transparent px-3 py-1 text-[13px] h-10 w-full rounded-[0.5rem] outline-none focus:border-black transition-colors"
            placeholder="Digite um cupom"
            type="text"
          />
          <button type="button" className="whitespace-nowrap px-4 py-2 h-10 text-[13px] font-medium border-0 bg-transparent text-black rounded-[0.5rem]">
            Aplicar cupom
          </button>
        </div>
      </div>

      {/* Totals */}
      <dl className="px-4 pb-5 mb-4 border-b border-slate-200 space-y-1">
        <div className="flex items-center justify-between">
          <dt className="text-[13px] text-black">Produtos</dt>
          <dd className="text-black text-[13px]">R$&nbsp;{formatPrice(product.price * quantity)}</dd>
        </div>
        <div className="flex items-center justify-between mt-1">
          <dt className="text-black text-[13px]">Frete</dt>
          <dd className="text-[13px] text-green-600 font-normal">Grátis</dd>
        </div>
        <div className="flex items-center justify-between mt-2">
          <dt className="font-bold text-black text-[15px]">Total</dt>
          <dd className="font-bold text-black text-[15px]">R$&nbsp;{formatPrice(total)}</dd>
        </div>
      </dl>

      {/* Product item */}
      <ul className="px-4 pb-4 divide-y divide-slate-200">
        <li className="flex items-start gap-3 py-3">
          <div className="flex-shrink-0 bg-white rounded-lg border border-slate-200 shadow-sm p-[0.2rem]">
            <Image
              src={product.productImage || product.image}
              alt={product.fullName}
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 flex flex-col gap-1">
            <span className="text-[13px] font-normal text-black leading-tight block break-words">
              {product.fullName}
            </span>
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-1">
            <span className="text-[13px] font-normal text-black whitespace-nowrap">
              R$&nbsp;{formatPrice(product.price)}
            </span>
            {/* Quantity stepper */}
            <div className="inline-flex items-center h-8 rounded-md border border-slate-200 overflow-hidden">
              <button
                type="button"
                className="flex items-center justify-center w-8 h-full text-slate-600"
                aria-label="Diminuir quantidade"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              >
                <Minus className="size-[12px] text-gray-400" />
              </button>
              <input
                type="number"
                min={1}
                max={20}
                value={quantity}
                onChange={(e) => onQuantityChange(Math.max(1, Number(e.target.value)))}
                className="w-7 h-full text-center text-[12px] font-medium text-slate-700 bg-transparent border-0 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                className="flex items-center justify-center w-8 h-full text-slate-600"
                aria-label="Aumentar quantidade"
                onClick={() => onQuantityChange(Math.min(20, quantity + 1))}
              >
                <Plus className="size-[12px] text-gray-400" />
              </button>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}

/** Mobile version — collapsible with price + chevron in header */
function MobileSummary({ product, quantity, onQuantityChange }: Omit<OrderSummaryProps, "mobile">) {
  const [open, setOpen] = useState(true);
  const total = product.price * quantity;
  return (
    <div className="border border-[#E2E8F0] overflow-hidden flex-shrink-0 rounded-[0.5rem]">
      <button
        type="button"
        className="w-full flex justify-between items-center gap-2"
        style={{ padding: "13px 13px 13px 19px", background: "#F7F7F7" }}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-[12px] font-medium flex-1 min-w-0 text-left" style={{ color: "#111827" }}>
          Resumo do pedido
        </span>
        <div className="flex-shrink-0 flex items-center gap-1">
          <span className="font-semibold text-md" style={{ color: "#030712" }}>
            R$&nbsp;{formatPrice(total)}
          </span>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      {open && <SummaryBody product={product} quantity={quantity} onQuantityChange={onQuantityChange} />}
    </div>
  );
}

/** Desktop version — plain header, always expanded */
function DesktopSummary({ product, quantity, onQuantityChange }: Omit<OrderSummaryProps, "mobile">) {
  return (
    <div className="border border-[#E2E8F0] overflow-hidden flex-shrink-0 rounded-[0.5rem]">
      {/* Plain header — no toggle, no price */}
      <div
        className="flex justify-between items-center gap-2"
        style={{ padding: "13px 13px 13px 19px", background: "#F7F7F7" }}
      >
        <span className="text-[13px] font-medium" style={{ color: "#111827" }}>
          Resumo do pedido
        </span>
      </div>
      <SummaryBody product={product} quantity={quantity} onQuantityChange={onQuantityChange} />
    </div>
  );
}

export function OrderSummary({ product, quantity, onQuantityChange, mobile }: OrderSummaryProps) {
  if (mobile) {
    return <MobileSummary product={product} quantity={quantity} onQuantityChange={onQuantityChange} />;
  }
  return <DesktopSummary product={product} quantity={quantity} onQuantityChange={onQuantityChange} />;
}
