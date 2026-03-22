import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "devblog_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("Missing AUTH_SECRET environment variable.");
  }

  return secret;
}

function getAdminEmail() {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    throw new Error("Missing ADMIN_EMAIL environment variable.");
  }

  return adminEmail.toLowerCase();
}

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("Missing ADMIN_PASSWORD environment variable.");
  }

  return password;
}

function sign(value: string) {
  return crypto
    .createHmac("sha256", getAuthSecret())
    .update(value)
    .digest("hex");
}

export function createSessionToken(email: string) {
  const normalizedEmail = email.toLowerCase();
  const payload = `${normalizedEmail}.${Date.now()}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token?: string | null) {
  if (!token) {
    return null;
  }

  const [email, issuedAt, signature] = token.split(".");

  if (!email || !issuedAt || !signature) {
    return null;
  }

  const payload = `${email}.${issuedAt}`;
  let expectedSignature = "";
  let adminEmail = "";

  try {
    expectedSignature = sign(payload);
    adminEmail = getAdminEmail();
  } catch {
    return null;
  }

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  if (email !== adminEmail) {
    return null;
  }

  return { email };
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  return session;
}

export async function setAdminSession(email: string) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, createSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function requestIsAuthorized(request: NextRequest) {
  return Boolean(verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value));
}

export function adminCredentialsMatch(email: string, password: string) {
  return email.toLowerCase() === getAdminEmail() && password === getAdminPassword();
}
