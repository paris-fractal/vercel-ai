import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { signIn } from "~/server/auth";

export const userRouter = createTRPCRouter({
    signIn: publicProcedure.input(z.object({
        email: z.string(),
        password: z.string(),
    }))
        .output(z.object({
            success: z.boolean(),
            error: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await signIn("credentials", {
                    email: input.email,
                    password: input.password,
                    redirect: false,
                });
                return { success: true }
            } catch (error) {
                throw error
            }
        }),
});