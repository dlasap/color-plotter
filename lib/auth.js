// Server-only helpers for the PIN gate. Used by middleware and the /api routes;
// never import this from a client component.

export const AUTH_COOKIE = "cp_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// The PIN comes from the APP_PIN environment variable so it never lands in the
// public repo or the browser bundle.
export function getPin() {
  return process.env.APP_PIN || "";
}

async function sha256(text) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

// The cookie holds a hash derived from the PIN, so changing APP_PIN signs everyone out.
export async function sessionToken() {
  const pin = getPin();
  return pin ? sha256(`color-plotter-session:${pin}`) : null;
}

export async function pinMatches(candidate) {
  const pin = getPin();
  if (!pin || typeof candidate !== "string") return false;
  const [a, b] = await Promise.all([sha256(candidate), sha256(pin)]);
  return a === b;
}
