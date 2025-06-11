'use client';

import { useChat, type Message } from '@ai-sdk/react';
import { useRef, useState } from 'react';
import { Button } from '~/components/button';

export default function Chat({ id, initialMessages }: { id: string, initialMessages: Message[] }) {
    const { messages, input, handleSubmit, handleInputChange, status } =
        useChat({
            id: id,
            initialMessages: initialMessages,
        });

    const [files, setFiles] = useState<FileList | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pb-32">
                {messages.map(message => (
                    <div key={message.id ?? message.content} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${message.role === 'user'
                            ? 'bg-rose-100 text-rose-900 rounded-tr-none shadow-sm bg-gradient-to-b from-rose-100 to-rose-50'
                            : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                            }`}>
                            <div className="text-xs font-medium mb-1 text-rose-600">
                                {message.role === 'user' ? 'You' : 'AI Assistant'}
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm leading-relaxed">
                                    {message.content}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {message.experimental_attachments
                                        ?.filter(attachment =>
                                            attachment.contentType?.startsWith('image/'),
                                        )
                                        .map((attachment, index) => (
                                            <img
                                                key={`${message.id}-${index}`}
                                                src={attachment.url}
                                                alt={attachment.name}
                                                className="rounded-lg object-cover w-full h-32"
                                            />
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <form
                onSubmit={event => {
                    handleSubmit(event, {
                        experimental_attachments: files,
                    });

                    setFiles(undefined);

                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                }}
                className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-4 bg-rose-100 text-rose-900 rounded-xl shadow-sm bg-gradient-to-b from-rose-100 to-rose-50"
            >
                <div className="flex gap-2">
                    <input
                        value={input}
                        placeholder="Type your message..."
                        onChange={handleInputChange}
                        disabled={status !== 'ready'}
                        className="flex-1 px-4 overflow-y-scroll rounded-full border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <Button
                        type="submit"
                        disabled={status !== 'ready'}
                        className="px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </Button>
                </div>
            </form>
        </div>
    );
}