"use client";

import { createAuthClient } from "better-auth/client";
import { adminClient, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // The Next.js app URL — Better Auth handler lives at /api/auth/[...all]
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

  plugins: [
    adminClient(), // exposes authClient.admin.* methods
    jwtClient(),   // exposes authClient.token() for Express JWT bridge
  ],
});

// ── Convenience re-exports ────────────────────────────────────
// Use these hooks directly in "use client" components
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
