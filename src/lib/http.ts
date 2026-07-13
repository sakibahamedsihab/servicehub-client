/**
 * http.ts — Fetch wrapper for the Express API.
 * - Automatically attaches the Better Auth JWT (via authClient.token())
 * - Exposes typed GET / POST / PUT / PATCH / DELETE helpers
 *
 * NOTE: This file uses "use client" indirectly because it imports authClient
 * (which has "use client"). Only import this from client components or
 * lib functions called from client components — never from page.tsx or
 * server components.
 */

import { authClient } from "./auth-client";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";

// ── Token helper ──────────────────────────────────────────────
async function getJwt(): Promise<string | null> {
  try {
    const result = await authClient.token();
    // Better Auth jwtClient returns { data: { token: string } }
    const token = (result as { data?: { token?: string } })?.data?.token;
    return token ?? null;
  } catch {
    return null;
  }
}

// ── Core request ──────────────────────────────────────────────
export interface RequestOptions extends Omit<RequestInit, "headers"> {
  /** Attach JWT? Default: true */
  auth?: boolean;
  headers?: Record<string, string>;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = true, headers = {}, ...rest } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = await getJwt();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: requestHeaders,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      (body as { error?: string }).error ?? `Request failed: ${res.status}`
    );
  }

  // 204 No Content — return empty object
  if (res.status === 204) return {} as T;

  return res.json() as Promise<T>;
}

// ── Convenience helpers ───────────────────────────────────────
export const http = {
  get: <T>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { method: "GET", ...options }),

  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),

  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),

  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <T>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { method: "DELETE", ...options }),
};
