import { z } from "zod";

import type { Message } from "ai";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { generateId } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const messageSchema = z.object({
    id: z.string().optional(),
    role: z.string(),
    content: z.string()
});

// This ensures our schema matches the Message type
type MessageSchema = z.infer<typeof messageSchema>;
type _typeCheck = Message extends MessageSchema ? true : false;

function getChatFile(id: string): string {
    const chatDir = path.join(process.cwd(), '.chats');
    if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });
    return path.join(chatDir, `${id}.json`);
}


export const chatRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.void())
        .output(z.string())
        .mutation(async ({ ctx, input }) => {
            const id = generateId(); // generate a unique chat ID
            await writeFile(getChatFile(id), '[]'); // create an empty chat file
            return id;
        }),
    get: publicProcedure
        .input(z.object({
            id: z.string(),
        }))
        .output(z.array(messageSchema))
        .query(async ({ ctx, input }) => {
            const chatFile = getChatFile(input.id);
            const chat = await readFile(chatFile, 'utf-8');
            return JSON.parse(chat);
        }),
    save: publicProcedure
        .input(z.object({
            id: z.string(),
            messages: z.array(messageSchema)
        }))
        .mutation(async ({ ctx, input }) => {
            console.log(input.messages);
            const chatFile = getChatFile(input.id);
            await writeFile(chatFile, JSON.stringify(input.messages, null, 2));
        })
})