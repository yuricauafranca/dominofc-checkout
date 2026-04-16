"use client";

export interface UtmParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  sck: string | null;
  src: string | null;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Lê os parâmetros UTM salvos pelo script UTMify.
 * O script salva no cookie "__utmify" como JSON.
 * Fallback: lê direto da URL atual.
 */
export function readUtmParams(): UtmParams {
  const empty: UtmParams = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    sck: null,
    src: null,
  };

  if (typeof window === "undefined") return empty;

  // 1. Tenta ler do cookie que o script UTMify seta
  const cookieRaw = getCookie("__utmify") || getCookie("utmify");
  if (cookieRaw) {
    try {
      const parsed = JSON.parse(cookieRaw);
      return {
        utm_source: parsed.utm_source ?? null,
        utm_medium: parsed.utm_medium ?? null,
        utm_campaign: parsed.utm_campaign ?? null,
        utm_content: parsed.utm_content ?? null,
        utm_term: parsed.utm_term ?? null,
        sck: parsed.sck ?? parsed.xcod ?? null,
        src: parsed.src ?? null,
      };
    } catch {
      // fallthrough
    }
  }

  // 2. Tenta ler do localStorage (alguns scripts UTMify usam isso)
  try {
    const lsRaw = localStorage.getItem("__utmify") || localStorage.getItem("utmify_params");
    if (lsRaw) {
      const parsed = JSON.parse(lsRaw);
      return {
        utm_source: parsed.utm_source ?? null,
        utm_medium: parsed.utm_medium ?? null,
        utm_campaign: parsed.utm_campaign ?? null,
        utm_content: parsed.utm_content ?? null,
        utm_term: parsed.utm_term ?? null,
        sck: parsed.sck ?? parsed.xcod ?? null,
        src: parsed.src ?? null,
      };
    }
  } catch {
    // fallthrough
  }

  // 3. Fallback: lê direto da URL atual
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
    sck: params.get("sck") || params.get("xcod"),
    src: params.get("src"),
  };
}
