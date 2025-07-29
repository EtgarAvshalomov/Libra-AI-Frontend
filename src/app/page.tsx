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

  const url = process.env.NEXT_PUBLIC_API_URL;

  // Check if user is logged in
  useEffect(() => {
    const verifyUser = async () => {
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

  if(isLoggedIn === false) return <Loading />;

  return (
    <>
      <Sidebar sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Intro sidebarExpanded={sidebarExpanded} />
    </>
  );
}
