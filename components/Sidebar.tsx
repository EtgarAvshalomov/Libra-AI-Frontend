"use client";
import { useState } from "react";
import SidebarHeader from "./SidebarHeader";
import Profile from "./Profile";
import Popup from "./Popup";
import Chats from "./Chats";

type SidebarProps = {
    chatIdParam: string;
    sidebarExpanded: boolean;
    setSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    isDesktop: boolean;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ chatIdParam, sidebarExpanded, setSidebarExpanded, isDesktop, isLoggedIn, setIsLoggedIn }: SidebarProps) {

    const [profileMenu, setProfileMenu] = useState(false);

    return (
        <>
            <aside className={`fixed flex flex-col ml-[8px] mt-[8px] bg-[#212327] h-[98.4%] rounded-[12px] transition-[width] duration-300 ease-in-out ${sidebarExpanded ? 'w-[280px] text-center' : 'w-[68px]'}`}>
                <SidebarHeader sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />
                <Chats chatIdParam={chatIdParam} sidebarExpanded={sidebarExpanded} />
                <Profile sidebarExpanded={sidebarExpanded} setProfileMenu={setProfileMenu} isLoggedIn={isLoggedIn} />
                <Popup profileMenu={profileMenu} setProfileMenu={setProfileMenu} setIsLoggedIn={setIsLoggedIn} />
            </aside>
        </>
    )
}