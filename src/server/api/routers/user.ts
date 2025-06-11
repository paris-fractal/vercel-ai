import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
                return { success: true }
            } catch (error) {
                throw error
            }
        }),
});