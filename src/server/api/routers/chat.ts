import { z } from "zod";

import type { Message } from "ai";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { generateId } from 'ai';
import { existsSync, mkdirSync, readdir } from 'fs';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { promisify } from "util";
import { database } from "~/server/db";

const messageSchema = z.object({
    id: z.string().optional(),
    role: z.string(),
    content: z.string()
});

const chatSchema = z.object({
    id: z.string(),
    userId: z.string(),
    messages: z.array(messageSchema)
});

// This ensures our schema matches the Message type
export type MessageSchema = z.infer<typeof messageSchema>;
export type ChatSchema = z.infer<typeof chatSchema>;
type _typeCheck = Message extends MessageSchema ? true : false;


export const chatRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.void())
        .output(z.string())
        .mutation(async ({ ctx, input }) => {
            const id = generateId(); // generate a unique chat ID
            await database.createChat({
                id: id,
                userId: ctx.session.user.id,
                messages: []
            })
            return id;
        }),
    get: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .output(z.array(messageSchema))
        .query(async ({ ctx, input }) => {
            const chat = await database.getChat(ctx.session.user.id, input.id);
            return chat.messages;
        }),
    save: protectedProcedure
        .input(z.object({
            id: z.string(),
            messages: z.array(messageSchema)
        }))
        .mutation(async ({ ctx, input }) => {
            await database.updateChat({
                id: input.id,
                userId: ctx.session.user.id,
                messages: input.messages
            })
        }),
    list: protectedProcedure
        .input(z.void())
        .output(z.array(z.string()))
        .query(async ({ ctx, input }) => {
            const chats = await database.getChats(ctx.session.user.id);
            return chats;
        })
})