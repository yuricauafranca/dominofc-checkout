"use client";

import { SquarePen, Check } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface Props {
  step: "active" | "completed" | "inactive";
  data: FormData;
  onChange: (d: Partial<FormData>) => void;
  onNext: () => void;
  onEdit: () => void;
}

function formatPhone(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function StepIdentificacao({ step, data, onChange, onNext, onEdit }: Props) {
  const isActive = step === "active";
  const isCompleted = step === "completed";
  const isInactive = step === "inactive";

  const borderColor = isCompleted ? "#1B9562" : isActive ? "rgb(226, 232, 240)" : "#F9FAFB";
  const bgColor = isCompleted ? "#F8FDF7" : "#ffffff";
  const cardBg = isActive ? "bg-white" : isCompleted ? "" : "bg-[#F9FAFB]";

  return (
    <div
      className={`border p-[1rem] md:p-[1.65rem] shadow-none rounded-[0.5rem] ${cardBg}`}
      style={{ borderColor }}
    >
      <div id="account" className={isCompleted ? "cursor-pointer" : ""}>
        {/* Header */}
        <h2
          className="flex justify-between items-center font-semibold text-[18px]"
          style={{ color: isInactive ? "#6B7280" : "#0F172A" }}
        >
          <span className="flex items-center">Identificação</span>
          {isCompleted ? (
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1 text-[12px] font-normal text-slate-500"
            >
              Editar <SquarePen className="w-4 h-4" />
            </button>
          ) : (
            <span
              className="text-[12px] font-medium"
              style={{ color: isInactive ? "#6B7280" : "#0F172A" }}
            >
              1 de 3
            </span>
          )}
        </h2>

        {/* Completed summary */}
        {isCompleted && (
          <div className="text-[13px] mt-2 space-y-0.5" style={{ color: "#0F172A" }}>
            <p className="font-semibold">{data.name}</p>
            <p className="font-normal">{data.email}</p>
            <p className="font-normal">{data.phone}</p>
          </div>
        )}

        {/* Inactive subtitle */}
        {isInactive && (
          <p className="text-[13px] font-normal" style={{ color: "#6B7280" }}>
            Preencha seus dados para envio do pedido.
          </p>
        )}

        {/* Active form */}
        {isActive && (
          <div>
            <p className="text-[13px] font-normal" style={{ paddingBottom: 20, color: "#0F172A" }}>
              Preencha seus dados para envio do pedido.
            </p>

            {/* Nome */}
            <div className="mt-3">
              <label className="text-[13px] font-medium leading-none" htmlFor="name">
                Nome completo
              </label>
              <div className="mt-1 relative">
                <input
                  id="name"
                  className="input-base"
                  placeholder="Digite seu nome completo"
                  autoComplete="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => onChange({ name: e.target.value })}
                />
                {data.name && (
                  <Check className="size-5 absolute right-3 top-3 text-green-500" />
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mt-3">
              <label className="text-[13px] font-medium leading-none" htmlFor="email">
                E-mail
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  className="input-base"
                  placeholder="Digite seu e-mail"
                  autoComplete="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => onChange({ email: e.target.value })}
                />
                {data.email && (
                  <Check className="size-5 absolute right-3 top-3 text-green-500" />
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="mt-3">
              <label className="text-[13px] font-medium leading-none" htmlFor="phone">
                Celular/Whatsapp
              </label>
              <div className="relative mt-2 w-[75%] rounded-md">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                  <span className="h-full flex items-center rounded-md border-0 bg-transparent py-3 pl-3 pr-7 text-slate-500 sm:text-sm">
                    +55
                  </span>
                </div>
                <input
                  id="phone"
                  className="input-base"
                  style={{ paddingLeft: "3rem" }}
                  inputMode="numeric"
                  placeholder="(00) 00000-0000"
                  autoComplete="tel"
                  type="tel"
                  value={data.phone}
                  onChange={(e) => onChange({ phone: formatPhone(e.target.value) })}
                />
                {data.phone && (
                  <Check className="size-5 absolute right-3 top-3 text-green-500" />
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onNext}
              className="w-full h-14 mt-5 flex justify-center items-center gap-2 font-bold text-base text-white rounded-[0.5rem] capitalize transition-colors hover:brightness-110 hover:shadow-md"
              style={{ background: "#E5AE35" }}
            >
              Ir Para Entrega
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
