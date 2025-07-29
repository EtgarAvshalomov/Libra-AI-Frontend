"use client";
import { useState, useEffect, Fragment } from "react";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";


type MessagesProps = {
    messages: any[]
    loadingMessage: boolean
}

export default function Messages({ messages, loadingMessage }: MessagesProps) {

    const [showLoading, setShowLoading] = useState(false);

    // Handle loading animation
    useEffect(() => {
        if (loadingMessage) {
            setShowLoading(true);
        } else {
            const timeout = setTimeout(() => setShowLoading(false), 300); // Matches transition duration
            return () => clearTimeout(timeout);
        }
    }, [loadingMessage]);

    return (
        <div className="w-[748px] m-auto">
            {messages.map((message: any, index: number) => (
                <Fragment key={index}>
                    {message.role === "assistant" ? (
                        <AssistantMessage content={message.content} />
                    ) : (
                        <UserMessage content={message.content} />
                    )}
                </Fragment>
            ))}
            {showLoading && (
                <img className={`w-[50px] h-[50px] transition-opacity duration-300 ease-in-out ${loadingMessage ? 'opacity-100' : 'opacity-0'}`} src="/loading.svg" alt="Loading"></img>
            )}
        </div>
    )
}