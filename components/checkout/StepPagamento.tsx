"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { PixPending } from "./PixPending";

type PayMethod = "pix" | "credit";

interface Props {
  step: "active" | "completed" | "inactive";
  product: Product;
  quantity: number;
  customerData: {
    name: string;
    email: string;
    phone: string;
    zipcode: string;
    address: string;
    number: string;
    neighborhood: string;
    complement: string;
    city: string;
    state: string;
  };
  productId: string;
  personName?: string;
}

function formatCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function validateCpf(cpf: string) {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(d[i]) * (10 - i);
  let r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(d[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(d[i]) * (11 - i);
  r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  return r === parseInt(d[10]);
}

export function StepPagamento({ step, product, quantity, customerData, productId, personName = "" }: Props) {
  const isActive = step === "active";
  const isInactive = step === "inactive";
  const total = product.price * quantity;

  const [method, setMethod] = useState<PayMethod>("pix");
  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    transactionId: string;
    pixCode: string;
    pixQrCodeUrl?: string;
    amount: number;
  } | null>(null);

  const borderColor = isActive ? "rgb(226, 232, 240)" : "#F9FAFB";

  async function handleFinalize() {
    if (method === "pix") {
      if (!validateCpf(cpf)) {
        setCpfError("Digite um CPF válido");
        return;
      }
      setCpfError("");
      setLoading(true);
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            quantity,
            personName,
            customer: {
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone,
              document: cpf,
            },
            address: customerData,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao gerar PIX");
        setPixData({
          transactionId: data.transactionId,
          pixCode: data.pixCode,
          pixQrCodeUrl: data.pixQrCodeUrl,
          amount: data.amount,
        });
      } catch (err: any) {
        setCpfError(err.message || "Erro ao processar pagamento");
      } finally {
        setLoading(false);
      }
    }
    // Credit card: implement separately
  }

  // Show PIX pending screen after successful submission
  if (pixData) {
    return (
      <PixPending
        transactionId={pixData.transactionId}
        pixCode={pixData.pixCode}
        pixQrCodeUrl={pixData.pixQrCodeUrl}
        amount={pixData.amount}
      />
    );
  }

  return (
    <div
      id="payment"
      className={`mb-12 border p-[1rem] md:p-[1.65rem] h-auto rounded-[0.5rem] mt-6 lg:mt-0 ${
        isActive ? "bg-white cursor-pointer" : "bg-[#F9FAFB]"
      }`}
      style={{ borderColor }}
    >
      <h2
        className="text-[18px] flex justify-between items-center font-semibold"
        style={{ color: isInactive ? "#6B7280" : "#0F172A" }}
      >
        <span className="flex gap-1 items-center">Pagamento</span>
        <span className="text-[12px] font-medium" style={{ color: isInactive ? "#6B7280" : "#0F172A" }}>
          3 de 3
        </span>
      </h2>
      <p className="text-[13px] mt-1 font-normal" style={{ color: isInactive ? "#6B7280" : "#0F172A" }}>
        {isActive ? "Todas as transações são seguras e criptografadas." : "Preencha os dados de entrega para continuar"}
      </p>

      {isActive && (
        <fieldset className="mt-4 block">
          <legend className="sr-only">Tipo de Pagamento</legend>
          <div className="mt-4 grid grid-cols-1 w-full gap-6 bg-white">

            {/* ── PIX ── */}
            <div
              id="payment-method-pix"
              tabIndex={-1}
              className="relative flex cursor-pointer border p-3 w-full bg-[#F8F8F8] rounded-[0.5rem]"
              style={{ borderColor: method === "pix" ? "#E5AE35" : "transparent" }}
              onClick={() => setMethod("pix")}
            >
              <div className="grid grid-cols-1 w-full">
                {/* Radio + label */}
                <div className="flex items-center">
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none" className="mr-3 flex-shrink-0">
                    <rect x="0.5" y="0.5" width="21" height="21" rx="10.5" stroke="#e5ae35" />
                    {method === "pix" && <circle cx="11" cy="11" r="5" fill="#e5ae35" />}
                  </svg>
                  <span className="flex flex-1 items-center">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100">
                        {/* PIX logo */}
                        <svg className="size-5" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                          <g fill="#4BB8A9" fillRule="evenodd">
                            <path d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.404 14.765-5.384 20.15 0l76.989 76.989c14.191 14.172 33.045 21.98 53.12 21.98h15.098l-97.138 97.139c-30.326 30.344-79.505 30.344-109.85 0l-97.415-97.416h9.232zm280.068-271.294c-20.056 0-38.929 7.809-53.12 22l-76.97 76.99c-5.551 5.53-14.6 5.568-20.15-.02l-76.711-76.693c-14.192-14.191-33.046-21.999-53.12-21.999h-9.234l97.416-97.416c30.344-30.344 79.523-30.344 109.867 0l97.138 97.138h-15.116z"/>
                            <path d="M22.758 200.753l58.024-58.024h31.787c13.84 0 27.384 5.605 37.172 15.394l76.694 76.693c7.178 7.179 16.596 10.768 26.033 10.768 9.417 0 18.854-3.59 26.014-10.75l76.989-76.99c9.787-9.787 23.331-15.393 37.171-15.393h37.654l58.3 58.302c30.343 30.344 30.343 79.523 0 109.867l-58.3 58.303H392.64c-13.84 0-27.384-5.605-37.171-15.394l-76.97-76.99c-13.914-13.894-38.172-13.894-52.066.02l-76.694 76.674c-9.788 9.788-23.332 15.413-37.172 15.413H80.782L22.758 310.62c-30.344-30.345-30.344-79.524 0-109.868"/>
                          </g>
                        </svg>
                      </span>
                      <span className="text-sm font-medium text-black">PIX</span>
                    </span>
                  </span>
                </div>

                {/* PIX form */}
                {method === "pix" && (
                  <div className="mt-5 grid grid-cols-1">
                    <div className="gap-y-4 flex flex-col p-4 rounded-[0.5rem]">
                      <p className="text-slate-500 font-normal text-[14px]">
                        O código Pix expira em 30 minutos após finalizar a compra.
                      </p>

                      {/* CPF field */}
                      <div className="col-span-4 -mt-2">
                        <label className="font-medium text-[12px]" htmlFor="document">
                          <span className="flex gap-1 items-center md:mt-2">
                            CPF <Info className="w-4 h-4 ml-1 text-slate-400" />
                          </span>
                        </label>
                        <div className="mt-1 relative">
                          <input
                            id="document"
                            className={`input-base ${cpf ? "bg-[#E8F0FE]" : ""}`}
                            autoComplete="off"
                            placeholder="000.000.000-00"
                            type="text"
                            inputMode="numeric"
                            value={cpf}
                            onChange={(e) => {
                              setCpf(formatCpf(e.target.value));
                              setCpfError("");
                            }}
                          />
                          {cpfError && (
                            <p className="text-red-500 text-[12px] mt-1">{cpfError}</p>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-500 text-[14px]">
                        Valor no Pix:{" "}
                        <span className="font-semibold" style={{ color: "#E5AE35" }}>
                          R$&nbsp;{formatPrice(total)}
                        </span>
                      </p>
                    </div>

                    {/* Submit button */}
                    <div className="col-span-4 z-20 relative">
                      <button
                        type="button"
                        onClick={handleFinalize}
                        disabled={loading}
                        className="w-full h-14 flex justify-center items-center font-bold text-base text-white rounded-[0.5rem] capitalize transition-colors hover:brightness-110 hover:shadow-md disabled:opacity-70"
                        style={{ background: "#E5AE35" }}
                      >
                        {loading ? "Gerando PIX..." : "Finalizar Compra"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Cartão de crédito ── */}
            <div
              id="payment-method-credit-card"
              tabIndex={-1}
              className="relative flex cursor-pointer border p-3 w-full ring-1 ring-slate-200 bg-white rounded-[0.5rem]"
              style={{ borderColor: method === "credit" ? "#E5AE35" : "transparent" }}
              onClick={() => setMethod("credit")}
            >
              <div className="grid grid-cols-1 w-full">
                <div className="flex items-center">
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none" className="mr-3 flex-shrink-0">
                    <rect x="0.5" y="0.5" width="21" height="21" rx="10.5" stroke="#2D3748" />
                    {method === "credit" && <circle cx="11" cy="11" r="5" fill="#2D3748" />}
                  </svg>
                  <span className="flex flex-1 items-center">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100">
                        <svg className="size-5" width="18" height="18" viewBox="0 0 20 20" fill="none">
                          <path d="M2.5 7.5026H17.5" stroke="#374151" strokeWidth="1.5" />
                          <path d="M7.97492 10.8346H5.83325" stroke="#374151" strokeWidth="1.5" />
                          <path d="M15 15.8346H5C3.61917 15.8346 2.5 14.7155 2.5 13.3346V6.66797C2.5 5.28714 3.61917 4.16797 5 4.16797H15C16.3808 4.16797 17.5 5.28714 17.5 6.66797V13.3346C17.5 14.7155 16.3808 15.8346 15 15.8346Z" stroke="#374151" strokeWidth="1.5" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium text-black">Cartão de crédito</span>
                    </span>
                  </span>
                </div>
                {method === "credit" && (
                  <div className="mt-4 p-4 text-[13px] text-slate-500">
                    {/* Implementar integração de cartão aqui */}
                    Em breve — configure seu gateway de cartão.
                  </div>
                )}
              </div>
            </div>

          </div>
        </fieldset>
      )}
    </div>
  );
}
