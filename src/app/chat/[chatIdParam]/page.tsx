"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";
import Header from "../../../../components/Header";
import Messages from "../../../../components/Messages";
import ChatInput from "../../../../components/ChatInput";
import LoadingMessages from "../../../../components/LoadingMessages";
import { Message } from "../../../../types/database";

export default function Chat({ params }: { params: Promise<{ chatIdParam: string }> }) {

  const router = useRouter();
  const { chatIdParam } = use(params);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [models, setModels] = useState([]);
  const [selectedModelValue, setSelectedModelValue] = useState("");

  const url = process.env.NEXT_PUBLIC_API_URL;
  
  // Check if user is logged in
  useEffect(() => {
    async function verifyUser() {
      try {
        const options: RequestInit = {
          method: "GET",
          credentials: "include",
        };
        const response = await fetch(`${url}/auth/verify`, options);
        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          router.push("/login");
        }
    } catch (error) {
      console.log(error)
    }
    }
    verifyUser();
  }, [router]);

  // Fetch messages
    useEffect(() => {
        async function getMessages() {
            await fetchMessages();
            setLoading(false);
        }
        
        getMessages();
    }, [router]);

    // Fetch models
    useEffect(() => {
        async function fetchModels() {
          try {
              if (!isLoggedIn) return;
              const options: RequestInit = {
                  method: "GET",
                  credentials: 'include'
              }
              const response = await fetch(`${url}/models`, options);
              if(response.status !== 200) {
                  const data = await response.json()
                  console.log(data);
                  return;
              }

              const parsedResponse = await response.json();
              const data = parsedResponse.data;
              setModels(data.models);

              // Initialize local storage
              if(!localStorage.getItem("userData")) {
                  localStorage.setItem("userData", JSON.stringify({model: data.models[0].value}));
              }

              // Set model by user data
              const userData = JSON.parse(localStorage.getItem("userData") ?? "");
              setSelectedModelValue(userData.model);
          } catch (error) {
              console.log(error);
          }
        }

        fetchModels();
    }, [isLoggedIn]);

  // Fetch messages function
  async function fetchMessages () {
    try {

      // Add messages
      const options: RequestInit = {
          method: "GET",
          credentials: 'include'
      }
      const response = await fetch(`${url}/messages?chatId=${chatIdParam}`, options);
      const parsedResponse = await response.json();
      if(response.status !== 200) {
          const data = await response.json()
          console.log(data);
          return;
      }

      const data = parsedResponse.data;
      setMessages(data.messages);

    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <>
      <Sidebar chatIdParam={chatIdParam} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className={`container relative text-center mt-[14.25%] transition-[margin-left] duration-300 ease-in-out ${sidebarExpanded ? 'ml-[288px]' : 'ml-[68px]'}`}>
        {loading ? <LoadingMessages /> : (
          <>
          <Header messages={messages} />
          <Messages messages={messages} models={models} />
          <ChatInput chatIdParam={chatIdParam} models={models} selectedModelValue={selectedModelValue} setSelectedModelValue={setSelectedModelValue} fetchMessages={fetchMessages} messages={messages} setMessages={setMessages} setLoadingMessage={setLoadingMessage} loadingMessage={loadingMessage} />
          </>
        )}
      </div>
    </>
  );
}
