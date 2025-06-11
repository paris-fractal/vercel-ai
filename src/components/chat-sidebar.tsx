'use client'

import { Button } from "./button";
import { PinkBubble } from "./pink-bubble";
import { useRouter } from "next/navigation";
import { useSession } from "~/lib/auth-client";


export default function ChatSidebar({ chats }: { chats: string[] }) {
    const session = useSession()
    const router = useRouter()
    return (
        <PinkBubble className="h-full flex flex-col gap-2">
            <div className="flex flex-col gap-2 h-9/10">
                <h1 className="text-2xl font-bold">Chats</h1>
                <ul className="flex flex-col gap-2">
                    {chats.map(chat => (
                        <Button onClick={() => router.push(`/chat/${chat}`)} key={chat}>{chat}</Button>
                    ))}
                </ul>
            </div>
            <div className="h-1/10 flex flex-row gap-2 justify-between items-center">
                <div className="text-sm">{session.data?.user?.name}</div>
                <Button>Logout</Button>
            </div>
        </PinkBubble>
    )
}