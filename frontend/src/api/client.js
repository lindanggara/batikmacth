const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function getAuthHeaders() {
  try {
    const sesi = JSON.parse(localStorage.getItem("batikmatch_auth_v1") || "null");
    if (sesi?.token) {
      return { Authorization: `Bearer ${sesi.token}` };
    }
  } catch {}
  return {};
}

export async function cekStatusBackend() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1800);
  try {
    const res = await fetch(`${API_BASE}/health`, {
      signal: controller.signal,
      headers: getAuthHeaders(),
    });
    clearTimeout(timer);
    return res.ok ? "online" : "simulasi";
  } catch {
    clearTimeout(timer);
    return "simulasi";
  }
}

export { API_BASE };