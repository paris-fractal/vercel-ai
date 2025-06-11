import { createAuthClient } from "better-auth/react";

// Create and export the auth client
export const authClient = createAuthClient({
    // The base URL is optional if you're using the same domain
    // baseURL: process.env.BETTER_AUTH_URL
});

// Export commonly used methods for convenience
export const { signIn, signUp, signOut, useSession } = authClient; 