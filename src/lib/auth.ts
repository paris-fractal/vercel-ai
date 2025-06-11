import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "~/server/db";

// Create and export the auth instance
export const auth = betterAuth({
    // Basic configuration
    secret: process.env.BETTER_AUTH_SECRET!,
    baseUrl: process.env.BETTER_AUTH_URL!,

    // Database configuration - we'll need to set this up
    // For now using SQLite as an example, we can change this based on your needs
    database: drizzleAdapter(db,
        {
            provider: "pg"
        }),

    // Authentication methods
    emailAndPassword: {
        enabled: true
    },

    // Session configuration
    session: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // Cache duration in seconds
        }
    },
    plugins: [nextCookies()]
}); 