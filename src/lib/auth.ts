import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, jwt } from "better-auth/plugins";
import mongoClient from "./mongo";

const db = mongoClient.db(); // uses the DB name from the MONGODB_URI

export const auth = betterAuth({
  // ── Database ──────────────────────────────────────────────
  database: mongodbAdapter(db),

  // ── Base URL ──────────────────────────────────────────────
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  // ── Email & Password ──────────────────────────────────────
  emailAndPassword: {
    enabled: true,
  },

  // ── Plugins ───────────────────────────────────────────────
  plugins: [
    admin(),  // adds role management + admin endpoints
    jwt(),    // issues JWT tokens for Express bridge (JWKS endpoint)
  ],
});

// Exported types for use across the app
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
