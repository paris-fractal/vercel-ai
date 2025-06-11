import { api } from '~/trpc/server';
import Chat from '~/components/chat';
import type { Message } from 'ai';
import type { DefaultSession } from 'next-auth';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params; // get the chat ID from the URL
    const messages = await api.chat.get({ id }); // load the chat messages
    return <Chat id={id} initialMessages={messages as Message[]} />; // display the chat
}