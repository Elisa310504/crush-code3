"use client";

import { useCallback, useRef, useState } from "react";

/** Calls one of our own server-side API routes (never OpenAI directly). */
export async function postJSON<T>(url: string, body: unknown, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new Error("Can't reach the server. Check your connection and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || "Something went wrong. Please try again.");
  return data as T;
}

export function useAI<TBody, TResult>(url: string) {
  const [data, setData] = useState<TResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);

  const run = useCallback(
    async (body: TBody) => {
      if (busy.current) return null; // avoid duplicate (paid) API calls
      busy.current = true;
      setLoading(true);
      setError(null);
      try {
        const result = await postJSON<TResult>(url, body);
        setData(result);
        return result;
      } catch (e) {
        setError((e as Error).message);
        return null;
      } finally {
        busy.current = false;
        setLoading(false);
      }
    },
    [url],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, run, reset, setError };
}
