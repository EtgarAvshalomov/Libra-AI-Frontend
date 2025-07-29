"use client";
import { useState, useRef } from "react";
import ModelSelect from "./ModelSelect";
import SendButton from "./SendButton";

type ChatInputProps = {
    chatIdParam: string;
    isLoggedIn: boolean;
    fetchMessages: () => void
    setLoadingMessage: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ChatInput({ chatIdParam, isLoggedIn, fetchMessages, setLoadingMessage }: ChatInputProps) {

    const chatRef = useRef<HTMLTextAreaElement>(null);
    const [selectedModelValue, setSelectedModelValue] = useState("");
    const [prompt, setPrompt] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const url = process.env.NEXT_PUBLIC_API_URL;

    // Handle prompt input
    function promptInput(e: React.FormEvent<HTMLTextAreaElement>) {

        const target = e.target as HTMLTextAreaElement;

        if(target.value.length > 10000) return;

        // Set prompt
        setPrompt(target.value);
        
        // Resize textarea
        const chat = chatRef.current;
        if (chat) {
            chat.style.height = "auto";
            chat.style.height = Math.min(chat.scrollHeight, 200) + "px";
        }
    }

    // Send the prompt to the model
    async function sendPrompt() {

        setErrorMessage("");

        // Add user message
        const options: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                prompt: prompt, 
                model: selectedModelValue
            })
        }

        let response = await fetch(`${url}/messages/user?chatId=${chatIdParam}`, options)
        let parsedResponse = await response.json();
        if(response.status === 201) {
            console.log(parsedResponse.data);
            fetchMessages();
        }
        else {
            console.log(parsedResponse);
        }
        
        // Send prompt to assistant and get his response
        setPrompt("");
        setLoadingMessage(true);

        console.log("Sending prompt...");

        response = await fetch(`${url}/messages/assistant?chatId=${chatIdParam}`, options)
        .finally(() => setLoadingMessage(false));
        
        console.log("Received response:");
        parsedResponse = await response.json();

        if(response.status === 201) {
            console.log(parsedResponse.data);
            const timeout = setTimeout(() => {
                fetchMessages();
            }, 300);
            return () => clearTimeout(timeout);
        }
        else {
            console.log(parsedResponse);
            setErrorMessage(parsedResponse.error);
        }
    }

    return (
        <div className="rounded-[24px] bg-[#404045] w-[748px] h-fit mx-auto mt-[16px] mb-[64px]">
            <textarea 
              className="border-none resize-none outline-none bg-[#404045] text-[16px] text-[white] font-mixed w-[95%] h-[44px] mt-[15px] placeholder-[#999aa5]"
              name="chat" 
              id="chat"
              dir="auto"
              placeholder="Message"
              ref={chatRef}
              value={prompt}
              onInput={promptInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendPrompt();
                }
              }}
            ></textarea>
            <div className="flex justify-between items-center pb-[10px]">
                <ModelSelect isLoggedIn={isLoggedIn} selectedModelValue={selectedModelValue} setSelectedModelValue={setSelectedModelValue} />
                <p id="error-message" className="text-[14px] my-[0px]">{errorMessage}</p>
                <SendButton sendPrompt={sendPrompt}/>
            </div>
        </div>
    )
}