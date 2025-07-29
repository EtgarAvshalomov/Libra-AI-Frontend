"use client";

type IntroProps = {
    sidebarExpanded: boolean
}

export default function Intro({ sidebarExpanded }: IntroProps) {
    return (
        <div className={`container text-center mt-[18%] transition-[margin-left] duration-300 ease-in-out ${sidebarExpanded ? 'ml-[288px]' : 'ml-[68px]'}`}>
          <div className={`transition-[opacity] duration-300 ease-in-out`}>
              <div className="flex justify-center">
                  <img className="w-[50px] h-[50px]" src="/favicon.svg" alt="Logo"/>
                  <h1 className="text-[24px] ml-[14px] mb-[0px]">
                    Welcome to Libra.
                  </h1>
              </div>
              <p>Start a new chat or select an existing one</p>
          </div>
      </div>
    )
}