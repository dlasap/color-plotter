import { NextResponse } from "next/server";
import { AUTH_COOKIE, SESSION_MAX_AGE, getPin, pinMatches, sessionToken } from "@/lib/auth";

export async function POST(request) {
  if (!getPin()) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  let pin = "";
  try {
    const body = await request.json();
    pin = typeof body.pin === "string" ? body.pin.trim() : "";
  } catch {}

  if (!(await pinMatches(pin))) {
    // Slow down guessing a little.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json({ ok: false, error: "wrong_pin" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, await sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
