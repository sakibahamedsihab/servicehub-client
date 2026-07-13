import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, jwt } from "better-auth/plugins";
import mongoClient from "./mongo";

const db = mongoClient.db(); // uses the DB name from the MONGODB_URI

export const auth = betterAuth({
  // ── Database ──────────────────────────────────────────────
  database: mongodbAdapter(db),

  user: {
    additionalFields: {
      accountType: {
        type: "string",
        required: false,
      },
    },
  },

  // ── Base URL ──────────────────────────────────────────────
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  // ── Email & Password ──────────────────────────────────────
  emailAndPassword: {
    enabled: true,
  },

  // ── Plugins ───────────────────────────────────────────────
  plugins: [
    admin({ defaultRole: "customer" }),  // adds role management + admin endpoints, default to customer
    jwt(),    // issues JWT tokens for Express bridge (JWKS endpoint)
  ],

  // ── Hooks ─────────────────────────────────────────────────
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requestedRole = (user as any).accountType || (user as any).role;
          const role = (requestedRole === "vendor" || requestedRole === "customer") ? requestedRole : "customer";
          return {
            data: {
              ...user,
              role,
            }
          };
        }
      }
    }
  },
});

// Exported types for use across the app
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
