import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Wire Better Auth into Next.js App Router
// Handles all /api/auth/* routes (sign-in, sign-up, sign-out, session, jwks, token, etc.)
export const { GET, POST } = toNextJsHandler(auth);
