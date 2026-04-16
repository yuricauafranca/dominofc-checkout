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

function ls(key: string): string | null {
  try {
    const val = localStorage.getItem(key);
    return val && val !== "null" && val !== "undefined" ? val : null;
  } catch {
    return null;
  }
}

/**
 * Lê os UTMs capturados pelo script UTMify.
 *
 * O script UTMify (latest.js) salva cada parâmetro individualmente
 * no localStorage: utm_source, utm_campaign, utm_medium, utm_content,
 * utm_term, xcod, src.
 *
 * Também expõe window.utmParams (URLSearchParams) após execução.
 */
export function readUtmParams(): UtmParams {
  if (typeof window === "undefined") {
    return {
      utm_source: null, utm_medium: null, utm_campaign: null,
      utm_content: null, utm_term: null, sck: null, src: null,
    };
  }

  // 1. window.utmParams — setado pelo script UTMify após execução
  const wp = (window as unknown as { utmParams?: URLSearchParams }).utmParams;
  if (wp instanceof URLSearchParams) {
    const get = (k: string) => {
      const v = wp.get(k);
      return v && v !== "null" && v !== "undefined" && v !== "" ? v : null;
    };
    return {
      utm_source:   get("utm_source"),
      utm_medium:   get("utm_medium"),
      utm_campaign: get("utm_campaign"),
      utm_content:  get("utm_content"),
      utm_term:     get("utm_term"),
      sck:          get("sck") || get("xcod"),
      src:          get("src"),
    };
  }

  // 2. localStorage — o script salva individualmente com expiração
  const fromLs: UtmParams = {
    utm_source:   ls("utm_source"),
    utm_medium:   ls("utm_medium"),
    utm_campaign: ls("utm_campaign"),
    utm_content:  ls("utm_content"),
    utm_term:     ls("utm_term"),
    sck:          ls("sck") || ls("xcod"),
    src:          ls("src"),
  };

  const hasAny = Object.values(fromLs).some(Boolean);
  if (hasAny) return fromLs;

  // 3. Fallback — URL atual
  const p = new URLSearchParams(window.location.search);
  const get = (k: string) => p.get(k) || null;
  return {
    utm_source:   get("utm_source"),
    utm_medium:   get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_content:  get("utm_content"),
    utm_term:     get("utm_term"),
    sck:          get("sck") || get("xcod"),
    src:          get("src"),
  };
}
