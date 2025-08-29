"use client";
import { useState, useEffect, useRef } from "react";
import ModelSelect from "./ModelSelect";
import SendButton from "./SendButton";
import { Message, Model } from "../types/database";
import StopButton from "./StopButton";
import { parse } from "path";
import TemperatureInput from "./TemperatureInput";

type ChatInputProps = {
    chatIdParam: string;
    isDesktop: boolean;
    bottomRef: React.RefObject<HTMLDivElement | null>;
    models: Model[];
    selectedModelValue: string;
    setSelectedModelValue: React.Dispatch<React.SetStateAction<string>>;
    fetchMessages: () => void;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setLoadingMessage: React.Dispatch<React.SetStateAction<boolean>>;
    loadingMessage: boolean;
}

export default function ChatInput({ chatIdParam, isDesktop, bottomRef, models, selectedModelValue, setSelectedModelValue, fetchMessages, messages, setMessages, setLoadingMessage, loadingMessage }: ChatInputProps) {

    const chatRef = useRef<HTMLTextAreaElement>(null);
    const messagesRef = useRef<Message[]>([]);
    const [prompt, setPrompt] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [temperature, setTemperature] = useState(1);
    const [temperatureInput, setTemperatureInput] = useState("1");

    const url = process.env.NEXT_PUBLIC_API_URL;

    // Refresh newest messages
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    // Handle loading animation
    useEffect(() => {
        if (loadingMessage) {
            setShowLoading(true);
        } else {
            const timeout = setTimeout(() => setShowLoading(false), 300); // Matches transition duration
            return () => clearTimeout(timeout);
        }
    }, [loadingMessage]);

    // Update new message
    function updateMessage(chunk: string) {
        const currentMessages = [...messagesRef.current];
        currentMessages[currentMessages.length - 1].content += chunk;
        setMessages(currentMessages);
        messagesRef.current = currentMessages;
    }

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

        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    // Send the prompt to the model
    async function sendPrompt() {
        try {
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
            const userMessageURL = process.env.NODE_ENV === 'development' ? `${url}/messages/user?chatId=${chatIdParam}` : `/api/messages/user?chatId=${chatIdParam}`;
            let response = await fetch(userMessageURL, options)
            const parsedResponse = await response.json();
            if(response.status === 201) {
                console.log(parsedResponse.data);
                await fetchMessages();
            }
            else {
                console.log(parsedResponse);
            }
            
            // Send prompt to assistant and get his response
            setPrompt("");

            setLoadingMessage(true);
            console.log("Sending prompt...");

            const selectedModel = models.find((model) => model.value === selectedModelValue);

            // Add new message locally
            const newMessage: Message = { id: -1, role: "assistant", content: "", createdAt: "", model_id: selectedModel?.id || -1, chatId: "", temperature };
            setMessages((prev) => [...prev, newMessage]);

            const controller = new AbortController();
            setAbortController(controller);

            const assistantMessageURL = process.env.NODE_ENV === 'development' ? `${url}/messages/assistant-stream?chatId=${chatIdParam}` : `/api/messages/assistant-stream?chatId=${chatIdParam}`;
            response = await fetch(assistantMessageURL, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ model: selectedModelValue, temperature }),
                signal: controller.signal
            });

            if (!response.ok || !response.body) {
                setLoadingMessage(false);
                setErrorMessage("Try again later or select another model");
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let buffer = '';

            // Parse chunks display content
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const parsed = JSON.parse(line.slice(6));
                        if (parsed.type === 'content') {
                            updateMessage(parsed.data);
                        } else if (parsed.type === 'done') {
                            setLoadingMessage(false);
                            return;
                        }
                    }
                }
            }

        } catch (error: unknown) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('Stream was aborted');
                setLoadingMessage(false);
            } else {
                console.error('Error in sendPrompt:', error);
            }
        } finally {
            setAbortController(null);
        }
    }

    // Stop the LLMs response
    function stopStream() {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
            setLoadingMessage(false);
        }
    };

    return (
        <div className="rounded-[24px] bg-[#404045] max-sm:w-[340px] sm:w-[470px] lg:w-[728px] h-fit mx-auto mt-[16px] mb-[64px]">
            <textarea 
              className="border-none resize-none outline-none bg-[#404045] max-lg:text-[12px] lg:text-[16px] text-[white] font-mixed w-[95%] lg:h-[48px] mt-[15px] placeholder-[#999aa5] max-sm:ml-[8px]"
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
                <div className={`${isDesktop ? 'flex items-center' : ''} ml-[8px]`}>
                    <ModelSelect models={models} selectedModelValue={selectedModelValue} setSelectedModelValue={setSelectedModelValue} />
                    <TemperatureInput temperature={temperature} setTemperature={setTemperature} temperatureInput={temperatureInput} setTemperatureInput={setTemperatureInput} isDesktop={isDesktop} />
                </div>
                <p id="error-message" className="max-lg:text-[10px] max-lg:mb-[32px] text-[14px] my-[0px] max-lg:max-w-[72px] max-w-[150px]">{errorMessage}</p>
                {showLoading ? <StopButton stopStream={stopStream} /> : <SendButton sendPrompt={sendPrompt}/>}
            </div>
        </div>
    )
}