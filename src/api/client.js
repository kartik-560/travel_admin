// central API client that attaches Basic auth after login
import config from "../config";

const API_URL = config.API_BASE_URL;


let _basicToken = null; // "Basic xxxxx"

export function setBasicToken(basic) {
  _basicToken = basic;
  // persist for this tab; remove if you prefer purely in-memory
  sessionStorage.setItem("basicToken", basic);
}

export function hydrateBasicTokenFromSession() {
  const basic = sessionStorage.getItem("basicToken");
  if (basic) _basicToken = basic;
}

export function clearBasicToken() {
  _basicToken = null;
  sessionStorage.removeItem("basicToken");
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (_basicToken) headers.set("Authorization", _basicToken);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (res.status === 401) {
    const err = new Error("unauthorized");
    err.response = res;
    throw err;
  }
  return res;
}
