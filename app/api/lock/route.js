import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST(request) {
  const response = NextResponse.redirect(new URL("/unlock", request.url), 303);
  response.cookies.delete(AUTH_COOKIE);
  return response;
}
