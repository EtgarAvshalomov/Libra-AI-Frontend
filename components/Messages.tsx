"use client";
import { useState, useEffect, Fragment } from "react";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";
import { Message } from "../types/database";


type MessagesProps = {
    messages: Message[]
}

export default function Messages({ messages }: MessagesProps) {

    return (
        <div className="w-[748px] m-auto">
            {messages.map((message: Message, index: number) => (
                <Fragment key={index}>
                    {message.role === "assistant" ? (
                        <AssistantMessage content={message.content} />
                    ) : (
                        <UserMessage content={message.content} />
                    )}
                </Fragment>
            ))}
        </div>
    )
}
