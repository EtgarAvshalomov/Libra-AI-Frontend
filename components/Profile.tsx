"use client";
import { useState, useEffect } from "react";
import { User } from "../types/database";

type ProfileProps = {
    sidebarExpanded: boolean;
    setProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
    isLoggedIn: boolean
}

export default function Profile({ sidebarExpanded, setProfileMenu, isLoggedIn }: ProfileProps) {

    const [user, setUser] = useState<User | null>(null);

    const url = process.env.NEXT_PUBLIC_API_URL;

    // Fetch user
    useEffect(() => {
        async function fetchUser() {
            try {
                if (!isLoggedIn) return;
                const options: RequestInit = {
                    method: "GET",
                    credentials: 'include'
                }
                const response = await fetch(`${url}/auth/profile`, options);
                if(response.status === 200) {
                    const data = await response.json()
                    setUser(data);
                    return;
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchUser();
    }, [isLoggedIn]);

    return (
        <>
            {sidebarExpanded ? (
                <div 
                    className={`flex relative transition-all duration-400 ease-in-out w-[252px] ml-[10px] mb-[10px] py-[6px] pl-[8px] rounded-[12px] justify-self-left cursor-pointer hover:bg-[#313337]`}
                    onClick={() => setProfileMenu(true)}>
                    <div className="flex justify-center items-center bg-[#ff00ff] w-[32px] min-w-[32px] min-h-[32px] h-[32px] rounded-full">
                        <p className="my-[0px] text-[#ffffff] select-none">{user?.firstName?.charAt(0).toUpperCase()}</p>
                    </div>
                    <p className="text-[#ffffff] mt-[6px] mb-[0px] ml-[12px] max-h-[32px] overflow-hidden truncate">
                        {`${(user?.firstName.charAt(0).toUpperCase() || '') + user?.firstName.slice(1)} ${(user?.lastName.charAt(0).toUpperCase() || '') + user?.lastName.slice(1)}`}
                    </p>
                </div>
                ) : (
                <div 
                    className="flex justify-center items-center bg-[#ff00ff] w-[32px] min-h-[32px] h-[32px] ml-[18px] mb-[16px] rounded-full cursor-pointer"
                    onClick={() => setProfileMenu(true)}>
                    <p className="my-[0px] text-[#ffffff] select-none">{user?.firstName?.charAt(0).toUpperCase()}</p>
                </div>
            )}
        </>
    )
}