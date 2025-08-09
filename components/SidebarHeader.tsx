"use client";

import Link from "next/link";

type SidebarHeaderProps = {
    sidebarExpanded: boolean;
    setSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SidebarHeader({ sidebarExpanded, setSidebarExpanded }: SidebarHeaderProps) {

    function toggleSidebar() {setSidebarExpanded(!sidebarExpanded)};

    return (
        <div className={`flex ${sidebarExpanded ? "justify-between" : "flex-wrap justify-center w-[68px]"}`}>
            <Link href="/">
                <img className={`w-[40px] h-[40px] my-[16px] ml-[14px] ${sidebarExpanded ? 'mr-[36px]' : 'mr-[14px]'}`}
                src="/favicon.svg" 
                alt="Logo"/>
            </Link>
            <img 
                className={"w-[38px] h-[38px] my-[16px] mx-[14px] p-[7px] rounded-[10px] transition-[background-color] duration-300 ease-in-out hover:cursor-pointer hover:bg-[#313337]"}
                src={sidebarExpanded ? '/sidebar-close.svg' : '/sidebar-open.svg'}
                alt="Sidebar"
                onClick={toggleSidebar}
            />
        </div>
    )
}