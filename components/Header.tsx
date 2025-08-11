"use client";

import { Message } from "../types/database";

type HeaderProps = {
    messages: Message[]
}

export default function Header({ messages }: HeaderProps) {
    return (
        <div className={`transition-[opacity] duration-300 ease-in-out max-sm:mb-[190px] ${messages && messages.length > 0 ? 'opacity-0' : 'opacity-100'}`}>
            <header className="flex justify-center items-center">
                <img className="w-[60px] h-[60px] pb-[10px]" src="/favicon.svg" alt="Logo"/>
                <h1 className="text-[24px] text-[#ffffff] font-bold ml-[8px] mb-[0px]">
                Welcome to Libra.
                </h1>
            </header>
            <p className="text-[14px] text-[#ffffff] mb-[16px] mt-[8px]">
            How can we help you today?
            </p>
        </div>
    )
}