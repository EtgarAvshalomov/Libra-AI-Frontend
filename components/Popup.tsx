"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type PopupProps = {
    profileMenu: boolean;
    setProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Popup({ profileMenu, setProfileMenu, setIsLoggedIn }: PopupProps) {

    const router = useRouter();
    const popupRef = useRef<HTMLInputElement>(null);

    const url = process.env.NEXT_PUBLIC_API_URL;

    // Focus on popup
    useEffect(() => {
        if (profileMenu && popupRef.current) {
            popupRef.current.focus();
        }
    }, [profileMenu]);
    
    // Logout a user
    async function logout() {
        const options: RequestInit = {
            method: "POST",
            credentials: 'include'
        }

        const logoutURL = process.env.NODE_ENV === 'development' ? `${url}/auth/logout` : '/api/auth/logout';
        const response = await fetch(logoutURL, options);
        if(response.status === 200) {
            setIsLoggedIn(false);
            router.push("/login");
            return;
        }
        const parsedResponse = await response.json();
        console.log(parsedResponse);
    }

    return (
        <div className={`absolute w-[136px] outline-none border-none p-[6px] top-[87%] left-[20px] bg-[#3a3a46] rounded-[10px] transition-all duration-200 ease-in-out ${profileMenu ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-95'}`}
            ref={popupRef}
            tabIndex={0}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                setProfileMenu(false);
                }
            }}>
            <div 
                className="flex select-none justify-left items-center pl-[12px] transition-[background-color] duration-200 ease-in-out hover:cursor-pointer hover:bg-[#555562] rounded-[10px]" 
                onClick={(e) => {
                e.stopPropagation();
                logout();
                }}>
                <img className="w-[24px] h-[24px]" src="/logout.svg"></img>
                <p className="text-[14px] text-[#ffffff] my-[10px] ml-[10px]">Log out</p>
            </div>
        </div>
    )
}