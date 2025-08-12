"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Loading from "../../components/Loading";
import Sidebar from "../../components/Sidebar";
import Intro from "../../components/Intro";

export default function Chat() {

  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const url = process.env.NEXT_PUBLIC_API_URL;

  // Check if user is logged in
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const options: RequestInit = {
          method: "GET",
          credentials: "include",
        };
        const verifyURL = process.env.NODE_ENV === 'development' ? `${url}/auth/verify` : '/api/auth/verify';
        const response = await fetch(verifyURL, options);
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

  // Check if window size is at least 1024
  useEffect(() => {
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 1024);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if(isLoggedIn === false) return <Loading />;

  return (
    <>
      {(sidebarExpanded || isDesktop) && <Sidebar chatIdParam={""} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} isDesktop={isDesktop} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      {(!sidebarExpanded && !isDesktop) && <img className="w-[24px] h-[24px] mt-[16px] ml-[14px] absolute top-0 left-0" src="/hamburger.svg" alt="Open Sidebar" onClick={() => setSidebarExpanded(true)}></img>}
      <Intro sidebarExpanded={sidebarExpanded} isDesktop={isDesktop} />
    </>
  );
}
