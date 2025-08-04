"use client";
import { useEffect, useRef, Fragment } from "react";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";
import { Message, Model } from "../types/database";


type MessagesProps = {
    messages: Message[]
    models: Model[]
}

export default function Messages({ messages, models }: MessagesProps) {

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="w-[748px] m-auto">
            {messages.map((message: Message, index: number) => (
                <Fragment key={index}>
                    {message.role === "assistant" ? (
                        <AssistantMessage message={message} models={models}  />
                    ) : (
                        <UserMessage content={message.content} />
                    )}
                </Fragment>
            ))}
            <div ref={bottomRef} />
        </div>
    )
}
