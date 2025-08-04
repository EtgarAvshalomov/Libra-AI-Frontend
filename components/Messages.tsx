"use client";
import { useState, useEffect, Fragment } from "react";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";
import { Message, Model } from "../types/database";


type MessagesProps = {
    messages: Message[]
    models: Model[]
}

export default function Messages({ messages, models }: MessagesProps) {

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
        </div>
    )
}
