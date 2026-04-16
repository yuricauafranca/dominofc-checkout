"use client";

import Image from "next/image";
import { Check, SquarePen } from "lucide-react";

interface AddressData {
  zipcode: string;
  address: string;
  number: string;
  neighborhood: string;
  complement: string;
  city: string;
  state: string;
}

interface Props {
  step: "active" | "completed" | "inactive";
  data: AddressData;
  onChange: (d: Partial<AddressData>) => void;
  onNext: () => void;
  onEdit: () => void;
}

function formatCep(value: string) {
  return value.replace(/\D/g, "").replace(/(\d{5})(\d{1,3})/, "$1-$2").slice(0, 9);
}

export function StepEntrega({ step, data, onChange, onNext, onEdit }: Props) {
  const isActive = step === "active";
  const isCompleted = step === "completed";
  const isInactive = step === "inactive";

  const addressFilled = data.address.length > 0;
  const cepFilled = data.zipcode.replace(/\D/g, "").length === 8;

  const borderColor = isCompleted ? "#1B9562" : isActive ? "rgb(226, 232, 240)" : "#F9FAFB";
  const bgColor = isActive ? "bg-white" : isCompleted ? "" : "bg-[#F9FAFB]";

  async function handleCepBlur() {
    const cep = data.zipcode.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const json = await res.json();
      if (!json.erro) {
        onChange({
          address: json.logradouro || "",
          neighborhood: json.bairro || "",
          city: json.localidade || "",
          state: json.uf || "",
        });
      }
    } catch {}
  }

  return (
    <div
      id="address"
      className={`mt-5 border p-[1rem] md:p-[1.65rem] rounded-[0.5rem] ${bgColor}`}
      style={{ borderColor }}
    >
      {/* Header */}
      <h2
        className="flex justify-between items-center gap-2 font-semibold text-lg"
        style={{ color: isInactive ? "#6B7280" : "#0F172A" }}
      >
        <span className="flex gap-1 items-center">Entrega</span>
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
            2 de 3
          </span>
        )}
      </h2>

      {/* Completed summary */}
      {isCompleted && (
        <div className="text-[13px] mt-2 space-y-0.5" style={{ color: "#0F172A" }}>
          <p className="font-normal">{data.address}{data.number ? `, ${data.number}` : ""}</p>
          <p className="font-normal">{data.neighborhood} — {data.city}/{data.state}</p>
          <p className="font-normal">CEP: {data.zipcode}</p>
        </div>
      )}

      {/* Inactive subtitle */}
      {isInactive && (
        <p className="text-[13px] font-normal" style={{ color: "#6B7280" }}>
          Preencha seus dados para continuar
        </p>
      )}

      {/* Active form */}
      {isActive && (
        <div className="grid grid-cols-1 sm:gap-x-4">
          <p className="text-[13px] font-normal text-slate-500" style={{ color: "#0F172A" }}>
            Informe o endereço de entrega
          </p>

          {/* CEP */}
          <div className="block mt-4">
            <label className="text-[13px] font-medium leading-none" htmlFor="zipcode">CEP</label>
            <div className="mt-1 flex items-center gap-4">
              <span className="relative">
                <input
                  id="zipcode"
                  className="input-base w-[180px]"
                  inputMode="numeric"
                  placeholder="00000-000"
                  maxLength={9}
                  type="text"
                  value={data.zipcode}
                  onChange={(e) => onChange({ zipcode: formatCep(e.target.value) })}
                  onBlur={handleCepBlur}
                />
                {cepFilled && <Check className="size-5 absolute right-3 top-3 text-green-500" />}
              </span>
              {cepFilled && data.city && (
                <span className="text-[13px] text-slate-500 self-center">
                  {data.state}/{data.city}
                </span>
              )}
            </div>
          </div>

          {/* Address fields — only shown after CEP is valid */}
          {cepFilled && (
            <div className="gap-y-6">
              {/* Endereço */}
              <div className="sm:col-span-4 mb-4 mt-3">
                <label className="text-[13px] font-medium leading-none" htmlFor="address-field">
                  Endereço
                </label>
                <div className="mt-1 relative">
                  <input
                    id="address-field"
                    className={`input-base ${data.address ? "input-valid" : ""}`}
                    placeholder="Digite rua, avenida, travessa..."
                    autoComplete="street-address"
                    type="text"
                    value={data.address}
                    onChange={(e) => onChange({ address: e.target.value })}
                  />
                  {data.address && <Check className="size-5 absolute right-3 top-3 text-green-500" />}
                </div>
              </div>

              {/* Número + Bairro */}
              <div className="col-span-2 grid grid-cols-4 gap-2 mb-3">
                <div className="col-span-1">
                  <label className="text-[13px] font-medium leading-none" htmlFor="number">N°</label>
                  <div className="mt-1 relative">
                    <input
                      id="number"
                      className="input-base"
                      placeholder="Número"
                      type="text"
                      value={data.number}
                      onChange={(e) => onChange({ number: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="text-[13px] font-medium leading-none" htmlFor="neighborhood">
                    Bairro
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="neighborhood"
                      className={`input-base ${data.neighborhood ? "input-valid" : ""}`}
                      placeholder="Digite o bairro"
                      type="text"
                      value={data.neighborhood}
                      onChange={(e) => onChange({ neighborhood: e.target.value })}
                    />
                    {data.neighborhood && (
                      <Check className="size-5 absolute right-3 top-3 text-green-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Complemento */}
              <div className="col-span-4 mt-0">
                <label className="text-[13px] font-medium leading-none" htmlFor="complement">
                  Complemento{" "}
                  <span className="text-[11px] font-medium text-[#8F8F8F]">(Opcional)</span>
                </label>
                <div className="mt-1 relative">
                  <input
                    id="complement"
                    className="input-base"
                    maxLength={100}
                    type="text"
                    value={data.complement}
                    onChange={(e) => onChange({ complement: e.target.value })}
                  />
                </div>
              </div>

              {/* Shipping method — Correios */}
              <div className="mt-6 z-10">
                <fieldset id="shipping-method" className="mb-5">
                  <legend className="text-base font-semibold text-slate-900">Escolha o frete:</legend>
                  <div className="mt-4 grid grid-cols-1 gap-y-5">
                    <div
                      className="border-[1px] bg-slate-100 relative flex cursor-pointer p-4 focus:outline-none w-full rounded-[0.5rem]"
                      style={{ borderColor: "#E5AE35" }}
                    >
                      <div className="flex w-full items-center">
                        {/* Custom radio SVG */}
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-5 flex-shrink-0">
                          <rect x="0.5" y="0.5" width="21" height="21" rx="10.5" stroke="#e5ae35" />
                          <circle cx="11" cy="11" r="5" fill="#e5ae35" />
                        </svg>
                        <div className="flex justify-between w-full items-center">
                          <div>
                            <span className="text-[13px] font-semibold text-slate-900 flex gap-2 leading-none">
                              Correios
                            </span>
                            <span className="flex gap-2 items-center">
                              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                                3 a 7 dias
                              </span>
                              <span className="mt-[7px]">
                                <Image
                                  src="/images/correios.png"
                                  alt="Correios"
                                  width={60}
                                  height={20}
                                  className="h-[20px] w-auto max-w-[60px] object-contain"
                                />
                              </span>
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-[13px]">Grátis</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="next-button-frete"
                    onClick={onNext}
                    className="w-full h-14 mt-5 flex justify-center items-center gap-2 font-bold text-base text-white rounded-[0.5rem] capitalize transition-colors hover:brightness-110 hover:shadow-md"
                    style={{ background: "#E5AE35" }}
                  >
                    Ir Para Pagamento
                  </button>
                </fieldset>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
