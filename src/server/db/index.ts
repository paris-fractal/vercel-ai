import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";
import { and, eq } from "drizzle-orm";
import type { ChatSchema, MessageSchema } from "../api/routers/chat";
/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });

export class Database {
  static async getChats(userId: string): Promise<string[]> {
    const chats = await db.query.chats.findMany({
      where: eq(schema.chats.userId, userId),
    });
    return chats.map(chat => chat.id);
  }

  static async createChat(chat: ChatSchema) {
    const result = await db.insert(schema.chats)
      .values({
        id: chat.id,
        userId: chat.userId,
        data: chat.messages
      })
      .returning();
    return result;
  }

  static async getChat(userId: string, id: string): Promise<ChatSchema> {
    const chat = await db.query.chats.findFirst({
      where: and(eq(schema.chats.id, id), eq(schema.chats.userId, userId))
    });

    if (!chat) throw new Error("Chat not found");
    return {
      id: chat.id,
      userId: chat.userId,
      messages: chat.data as MessageSchema[]
    }
  }

  static async updateChat(chat: ChatSchema) {
    const result = await db.update(schema.chats)
      .set({ data: chat.messages })
      .where(and(eq(schema.chats.id, chat.id), eq(schema.chats.userId, chat.userId)));
    return result;
  }

  static async getUser(id: string) {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, id)
    });
    return user;
  }

  static async createUser(user: { id: string, name: string, email: string }) {
    const result = await db.insert(schema.users)
      .values({
        id: user.id,
        name: user.name,
        email: user.email
      })
  }
}
// Export a singleton instance for convenience
export const database = Database