"use client";
import { useEffect, useRef } from "react";
import { Chat } from "../types/database";

type DeleteChatProps = {
    chat: Chat;
    chatToDelete: (boolean | null)[];
    index: number;
    toggleChatToDelete: (index: number) => void;
    fetchChats: () => void;
}

export default function DeleteChat({ chat, chatToDelete, index, toggleChatToDelete, fetchChats }: DeleteChatProps) {

    const deleteChatRef = useRef<HTMLDivElement>(null);

    const url = process.env.NEXT_PUBLIC_API_URL;

    // Switch focus to delete chat
    useEffect(() => {
        if (chatToDelete && deleteChatRef.current) {
            deleteChatRef.current.focus();
        }
    }, [chatToDelete]);

    // Delete a chat from the database
    const deleteChat = async (chatId: string) => {
        
        const options: RequestInit = {
            method: "DELETE",
            credentials: 'include'
        }
        const deleteChatURL = process.env.NODE_ENV === 'development' ? `${url}/chats?chatId=${chatId}` : `/api/chats?chatId=${chatId}`;
        const response = await fetch(deleteChatURL, options);
        if(response.status !== 200) {
            const data = await response.json()
            console.log(data);
            return;
        }
        fetchChats();
    }

    return (
        <>
        {chatToDelete[index] && (
            <div className="flex justify-between items-center absolute top-[0px] left-[0px] w-[240px] h-[36px] bg-[#313337] rounded-[12px] focus:outline-none"
                ref={deleteChatRef}
                tabIndex={-1}
                onBlur={() => toggleChatToDelete(index)}>
                <p className="text-[14px] ml-[14px] truncate max-w-[160px]">Delete Chat?</p>
                <div className="flex justify-end">
                    <img 
                    className="w-[28px] h-[28px] p-[4px] rounded-[8px] mr-[4px] bg-[#212327] cursor-pointer hover:bg-[#404045]" 
                    src="/confirm.svg"
                    title="Yes"
                    alt="Yes"
                    onClick={(event) => {event.stopPropagation(); deleteChat(chat.id); toggleChatToDelete(index); }}
                    />
                    <img 
                    className="w-[28px] h-[28px] p-[4px] rounded-[8px] mr-[4px] bg-[#212327] cursor-pointer hover:bg-[#404045]" 
                    src="/cancel.svg"
                    title="No"
                    alt="No"
                    onClick={(event) => {event.stopPropagation(); toggleChatToDelete(index);
                    }}
                    />
                </div>
            </div>
        )}
        </>
    )
}