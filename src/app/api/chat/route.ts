import { openai } from '@ai-sdk/openai';
import { appendResponseMessages, streamText, type Message } from 'ai';
import { api } from '~/trpc/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, id } = await req.json();

    const result = streamText({
        model: openai('gpt-4o-mini'),
        messages,
        async onFinish({ response }) {
            await api.chat.save({
                id,
                messages: appendResponseMessages({
                    messages,
                    responseMessages: response.messages,
                }),
            });
        },
    });

    return result.toDataStreamResponse();
}