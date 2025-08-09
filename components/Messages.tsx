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

    return (
        <div className="lg:w-[748px] max-lg:w-[470px] m-auto max-lg:text-[12px] lg:text-[16px]">
            {messages.map((message: Message, index: number) => (
                <Fragment key={index}>
                    {message.role === "assistant" ? (
                        <AssistantMessage message={message} models={models}  />
                    ) : (
                        <UserMessage content={message.content} />
                    )}
                </Fragment>
            ))}
        </div>
    )
}
