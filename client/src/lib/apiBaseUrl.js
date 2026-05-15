function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

function getConfiguredApiBaseUrl() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!configuredBaseUrl) {
    return null;
  }

  return normalizeBaseUrl(configuredBaseUrl);
}

function getBrowserDerivedApiBaseUrl() {
  if (typeof window === "undefined") {
    return null;
  }

  const { protocol, hostname } = window.location;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:4000/api";
  }

  const normalizedHostname = hostname.startsWith("www.") ? hostname.slice(4) : hostname;
  return `${protocol}//api.${normalizedHostname}/api`;
}

export function getApiBaseUrl() {
  return getConfiguredApiBaseUrl() || getBrowserDerivedApiBaseUrl() || "http://localhost:4000/api";
}