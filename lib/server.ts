// Shared helpers for the API routes: rate limiting, input validation and error responses.
import { NextResponse } from "next/server";
import { AIError } from "./openai";

/* ---------------- Rate limiting ----------------
 * Simple in-memory, per-IP limiter. On Vercel each server instance keeps its own
 * memory, so this is a sensible first line of defence, not a hard global cap.
 * Also set a monthly budget in your OpenAI dashboard (Settings -> Limits).
 */
type Bucket = { count: number; reset: number };
const g = globalThis as unknown as { __crushRateLimit?: Map<string, Bucket> };
const store: Map<string, Bucket> = g.__crushRateLimit ?? (g.__crushRateLimit = new Map());

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const GLOBAL_LIMIT = 60; // all AI calls together, per IP, per window

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anonymous";
}

function take(key: string, limit: number, cost: number, now: number): number | null {
  let bucket = store.get(key);
  if (!bucket || bucket.reset < now) {
    bucket = { count: 0, reset: now + WINDOW_MS };
    store.set(key, bucket);
  }
  if (bucket.count + cost > limit) return bucket.reset - now;
  bucket.count += cost;
  return null;
}

export function rateLimit(req: Request, route: string, limit: number, cost = 1): NextResponse | null {
  const now = Date.now();
  if (store.size > 5000) {
    for (const [k, b] of store) if (b.reset < now) store.delete(k);
  }
  const ip = clientIp(req);
  const waitGlobal = take(`all:${ip}`, GLOBAL_LIMIT, cost, now);
  const wait = waitGlobal ?? take(`${route}:${ip}`, limit, cost, now);
  if (wait !== null) {
    const minutes = Math.max(1, Math.ceil(wait / 60000));
    return NextResponse.json(
      { error: `Slow down, Romeo ♡ You've reached the limit for now. Try again in ${minutes} min.` },
      { status: 429, headers: { "Retry-After": String(Math.ceil(wait / 1000)) } },
    );
  }
  return null;
}

/* ---------------- Validation ---------------- */
export class ValidationError extends Error {}

export async function readBody(req: Request): Promise<Record<string, unknown>> {
  const raw = await req.text();
  if (raw.length > 20_000) throw new ValidationError("That request is too long.");
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
  } catch {
    /* fall through */
  }
  throw new ValidationError("Invalid request.");
}

export function text(
  value: unknown,
  opts: { field: string; max: number; min?: number; optional?: boolean },
): string {
  const v = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
  if (!v) {
    if (opts.optional) return "";
    throw new ValidationError(`Please fill in: ${opts.field}.`);
  }
  if (opts.min && v.length < opts.min)
    throw new ValidationError(`${opts.field} needs a bit more detail (at least ${opts.min} characters).`);
  if (v.length > opts.max) throw new ValidationError(`${opts.field} is too long (max ${opts.max} characters).`);
  return v;
}

export function oneOf<T extends string>(value: unknown, allowed: readonly T[], field: string, optional = false): T | "" {
  if ((value === undefined || value === null || value === "") && optional) return "";
  if (typeof value === "string" && (allowed as readonly string[]).includes(value)) return value as T;
  throw new ValidationError(`Please choose a valid option for: ${field}.`);
}

/** Trim AI output to a safe length and make sure it's a string. */
export function clip(value: unknown, max: number): string {
  const s = typeof value === "string" ? value.trim() : "";
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}

export function handleError(e: unknown): NextResponse {
  if (e instanceof ValidationError) return NextResponse.json({ error: e.message }, { status: 400 });
  if (e instanceof AIError) return NextResponse.json({ error: e.message }, { status: e.status });
  console.error("[api] unexpected error", e);
  return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}
