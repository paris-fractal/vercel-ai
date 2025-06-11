import { redirect } from 'next/navigation';
import { api } from '~/trpc/server';
export default async function Page() {
  const id = await api.chat.create();
  redirect(`/chat/${id}`); // redirect to chat page, see below
}