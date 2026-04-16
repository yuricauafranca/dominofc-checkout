"use client";

import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/products";

interface Props {
  transactionId: string;
  pixCode: string;
  pixQrCodeUrl?: string;
  amount: number;
}

const THIRTY_MINUTES = 30 * 60;

export function PixPending({ transactionId, pixCode, pixQrCodeUrl, amount }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(THIRTY_MINUTES);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"pending" | "paid" | "expired">("pending");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          setStatus("expired");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  // Poll payment status
  useEffect(() => {
    if (!transactionId) return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/transaction/${transactionId}`);
        const data = await res.json();
        const s = data?.status?.toLowerCase() ?? "";
        if (s === "paid" || s === "approved" || s === "completed") {
          setStatus("paid");
          clearInterval(pollRef.current!);
          clearInterval(intervalRef.current!);
        }
      } catch {
        // ignore polling errors
      }
    }, 5000);
    return () => clearInterval(pollRef.current!);
  }, [transactionId]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = pixCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  if (status === "paid") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento confirmado!</h2>
        <p className="text-gray-500 text-sm">Seu pedido foi recebido. Você receberá um e-mail de confirmação em breve.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[480px] mx-auto px-4 py-6 flex flex-col gap-5">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-[22px] font-bold text-gray-900 leading-tight">
          Já é quase seu...
        </h1>
        <p className="text-[13px] text-gray-500 mt-1">
          Pague seu pix dentro de{" "}
          <span className="font-semibold text-gray-700">
            {minutes}:{seconds}
          </span>{" "}
          para garantir sua compra.
        </p>
      </div>

      {/* Phone illustration */}
      <div className="flex justify-center">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="18" y="6" width="36" height="60" rx="5" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1.5" />
          <rect x="24" y="14" width="24" height="30" rx="2" fill="#E5AE35" opacity="0.15" />
          {/* Clock icon on screen */}
          <circle cx="36" cy="29" r="9" fill="white" stroke="#E5AE35" strokeWidth="1.5" />
          <path d="M36 24v5l3 2" stroke="#E5AE35" strokeWidth="1.5" strokeLinecap="round" />
          {/* Home button */}
          <circle cx="36" cy="56" r="3" fill="#D1D5DB" />
        </svg>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center gap-3">
        <div className="border border-gray-200 rounded-[0.5rem] p-3 bg-white shadow-sm">
          {pixQrCodeUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pixQrCodeUrl}
              alt="QR Code PIX"
              width={200}
              height={200}
              className="block"
            />
          ) : (
            <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center rounded">
              <span className="text-xs text-gray-400">QR Code</span>
            </div>
          )}
        </div>

        {/* Status pill */}
        <div
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-semibold"
          style={{ background: "#FFF8E1", color: "#E5AE35", border: "1px solid #E5AE35" }}
        >
          <span className="inline-block w-2 h-2 rounded-full bg-[#E5AE35] animate-pulse" />
          Aguardando pagamento •••
        </div>
      </div>

      {/* PIX code field + copy button */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <input
            readOnly
            value={pixCode}
            className="w-full h-11 text-[12px] text-gray-500 border border-gray-200 rounded-[0.5rem] px-3 pr-10 bg-gray-50 truncate"
          />
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="w-full h-12 rounded-[0.5rem] text-white font-bold text-[14px] transition-all hover:brightness-110 active:scale-[0.98]"
          style={{ background: "#1B9562" }}
        >
          {copied ? "Código copiado!" : "Copiar código pix"}
        </button>
      </div>

      {/* Amount */}
      <p className="text-center text-[14px] text-gray-500">
        Valor do Pix:{" "}
        <span className="font-semibold" style={{ color: "#E5AE35" }}>
          R$&nbsp;{formatPrice(amount)}
        </span>
      </p>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-[0.5rem] p-4 border border-gray-100">
        <p className="text-[13px] font-semibold text-gray-700 mb-3">Como pagar o pix:</p>
        <ol className="flex flex-col gap-2.5">
          {[
            "Clique em copiar o código PIX, logo acima",
            "Acesse o app do seu banco",
            "Vá até a opção PIX",
            "Escolha a opção 'COPIA E COLA'",
            "Insira o código copiado e finalize seu pagamento",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                style={{ background: "#1B9562" }}
              >
                {i + 1}
              </span>
              <span className="text-[13px] text-gray-600 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
