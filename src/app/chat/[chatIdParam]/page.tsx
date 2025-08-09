"use client";
import { useState, useEffect, use, useRef } from "react";
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [models, setModels] = useState([]);
  const [selectedModelValue, setSelectedModelValue] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);

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

  // Auto scroll down
  useEffect(() => {
    setTimeout(() => { // Slight delay to allow full render
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, [messages]);

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

  // Check if window size is at least 1024
  useEffect(() => {
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 1024);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  
  return (
    <>
      {(sidebarExpanded || isDesktop) && <Sidebar chatIdParam={chatIdParam} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} isDesktop={isDesktop} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      {(!sidebarExpanded && !isDesktop) && <img className="w-[24px] h-[24px] fixed top-5 left-5" src="/hamburger.svg" alt="Open Sidebar" onClick={() => setSidebarExpanded(true)}></img>}
      <div className={`container text-center mt-[14.6%] transition-[all] duration-300 ease-in-out lg:ml-[210px] md:ml-[10%] sm:ml-[10%] max-sm:ml-[0px] ${sidebarExpanded && 'xl:ml-[310px]'}`}>
        {loading ? <LoadingMessages /> : (
          <>
            <Header messages={messages} />
            <Messages messages={messages} models={models} />
            <ChatInput chatIdParam={chatIdParam} isDesktop={isDesktop} bottomRef={bottomRef} models={models} selectedModelValue={selectedModelValue} setSelectedModelValue={setSelectedModelValue} fetchMessages={fetchMessages} messages={messages} setMessages={setMessages} setLoadingMessage={setLoadingMessage} loadingMessage={loadingMessage} />
            <div ref={bottomRef} />
          </>
        )}
      </div>
    </>
  );
}
