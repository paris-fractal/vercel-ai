import { auth } from "~/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Export the handler for all auth-related routes
export const { GET, POST } = toNextJsHandler(auth); 