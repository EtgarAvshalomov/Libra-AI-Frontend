"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DeleteChat from "./DeleteChat";
import { Chat } from "../types/database";

type ChatsProps = {
    chatIdParam: string
    sidebarExpanded: boolean
}

export default function Chats({ chatIdParam, sidebarExpanded }: ChatsProps) {

    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [showChats, setShowChats] = useState(false);
    const [editingChat, setEditingChat] = useState<(boolean | null)[]>([]);
    const [chatToDelete, setChatToDelete] = useState<(boolean | null)[]>([]);

    const url = process.env.NEXT_PUBLIC_API_URL;

    // Fetch chats on mount
    useEffect(() => {
        fetchChats();
    }, [router]);

    // Handle showing chats
    useEffect(() => {
        if(sidebarExpanded) {
            setShowChats(true);
        }
        else {
            const timeout = setTimeout(() => setShowChats(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [sidebarExpanded]);

    // Switch focus to editing input and select it
    useEffect(() => {
        if (editingChat && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingChat]);

    async function fetchChats() {
      try {
          const options: RequestInit = {
              method: "GET",
              credentials: 'include'
          }
          const response = await fetch(`${url}/chats`, options);
          if(response.status !== 200) {
              const data = await response.json()
              console.log(data);
              return;
          }

          const parsedResponse = await response.json();
          const data = parsedResponse.data;
          setChats(data.chats);
          setEditingChat(new Array(data.chats.length).fill(false));
      } catch (error) {
          console.log(error);
      }
    }

    async function addChat() {
        const options: RequestInit = {
            method: "POST",
            credentials: 'include'
        }
        const response = await fetch(`${url}/chats`, options);
        if(response.status !== 201) {
            const data = await response.json()
            console.log(data);
            return;
        }
        fetchChats();
    }

    // Update the chat name in the database
    async function updateChatName(index: number) {
        const chat = chats[index];

        const options: RequestInit = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({name: chat.name})
        }

        const response = await fetch(`${url}/chats?chatId=${chat.id}`, options);
        if(response.status !== 200) {
            const data = await response.json()
            console.log(data);
            return;
        }
    }

    function openChat (chatId: string) {router.push(`/chat/${chatId}`);}

    // Enter edit mode
    function toggleEditingChat(index: number) {
        const newEditingChat = [...editingChat];
        newEditingChat[index] = !newEditingChat[index];
        setEditingChat(newEditingChat);
    }

    // Enter delete mode
    function toggleChatToDelete(index: number) {
        const newChatToDelete = [...chatToDelete];
        newChatToDelete[index] = !newChatToDelete[index];
        setChatToDelete(newChatToDelete);
    }

    // Set the chat name loally
    function setChatName(index: number, chatName: string) {

        if(chatName.length > 50) return;

        const newChats = [...chats];
        newChats[index].name = chatName;
        setChats(newChats);
    };

    return (
        <div className={`chat-list-container flex-grow overflow-auto`}>
            <div className={`transition-opacity duration-300 ease-in ${sidebarExpanded ? 'opacity-100' : 'opacity-0'} ${showChats ? '' : 'opacity-0 pointer-events-none'}`}>
                {sidebarExpanded && (
                    <div className="flex justify-center">
                        <div className="flex justify-center pl-[5%] w-[85%] h-[36px] mb-[4px] items-center rounded-[12px] hover:cursor-pointer hover:bg-[#313337]" title="Add new chat" onClick={addChat}>
                            <img className="w-[24px] h-[24px]" src="/new-chat.svg" alt="New chat"/>
                        </div>
                    </div>
                )}
                {chats.map((chat: Chat, index: number) => (
                    <div className="flex justify-center" key={chat.id}>
                        <div className={`flex items-center justify-between pl-[5%] w-[85%] h-[36px] text-[13px] rounded-[12px] relative cursor-pointer hover:will-change-transform hover:bg-[#313337] ${(editingChat[index] || chatIdParam == chats[index].id) ? "bg-[#313337]" : ""}`} id={chat.id} onClick={(event) => openChat(event.currentTarget.id)}>
                            {editingChat[index] ? (
                                <input 
                                className="border-none outline-none bg-[#313337] text-[13px] text-[#ffffff] w-[92%]" 
                                type="text"
                                dir="auto"
                                ref={inputRef}
                                value={chat.name} 
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) => setChatName(index, event.target.value)}
                                onBlur={async () => {
                                    toggleEditingChat(index);
                                    await updateChatName(index);
                                    fetchChats();
                                }}
                                />
                            ) : (
                                <>
                                <p className="text-[13px] truncate max-w-[160px]">{chat.name}</p>
                                <div className="flex justify-end w-[0px]">
                                    <img 
                                    className="w-[20px] h-[20px] p-[4px] rounded-[8px] mr-[8px] bg-[#212327] cursor-pointer hover:bg-[#404045]" 
                                    src="/edit-chat.svg"
                                    title="Edit chat name"
                                    alt="Edit chat name"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        toggleEditingChat(index);
                                    }}
                                    />
                                    <img 
                                    className="w-[20px] h-[20px] p-[4px] rounded-[8px] mr-[8px] bg-[#212327] cursor-pointer hover:bg-[#404045]" 
                                    src="/trash.svg"
                                    title="Delete chat"
                                    alt="Delete chat"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        toggleChatToDelete(index);
                                    }}
                                    />
                                </div>
                                </>
                            )}
                            <DeleteChat chat={chat} chatToDelete={chatToDelete} index={index} toggleChatToDelete={toggleChatToDelete} fetchChats={fetchChats} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}