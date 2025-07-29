"use client";

import { Message } from "../types/database";

type HeaderProps = {
    messages: Message[]
}

export default function Header({ messages }: HeaderProps) {
    return (
        <div className={`transition-[opacity] duration-300 ease-in-out ${messages && messages.length > 0 ? 'opacity-0' : 'opacity-100'}`}>
            <header className="flex justify-center">
                <img className="w-[50px] h-[50px]" src="/favicon.svg" alt="Logo"/>
                <h1 className="text-[24px] ml-[14px] mb-[0px]">
                Welcome to Libra.
                </h1>
            </header>
            <p className="text-[14px] my-[20px]">
            How can we help you today?
            </p>
        </div>
    )
}