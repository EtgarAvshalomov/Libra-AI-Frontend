"use client";

type IntroProps = {
    sidebarExpanded: boolean
    isDesktop: boolean
}

export default function Intro({ sidebarExpanded, isDesktop }: IntroProps) {

    return (
        <div className={`mt-[18.35%] lg:transition-[margin-left] lg:duration-300 lg:ease-in-out max-sm:ml-[14%] sm:ml-[30%] mr-[50px] md:ml-[35%] ${sidebarExpanded ? 'lg:ml-[49%]' : 'lg:ml-[42%]'}`}>
          <div className={`transition-[opacity] duration-300 ease-in-out`}>
              <div className={`${isDesktop ? 'flex justify-center items-center' : 'text-center'} mb-[4px]`}>
                  <img className={`${!isDesktop && 'mb-[20%]'} max-lg:ml-[35%] lg:w-[60px] lg:h-[60px] sm:w-[100px] sm:h-[100px] w-[80px] h-[80px] pb-[10px]`} src="/favicon.svg" alt="Logo"/>
                  <h1 className="text-[24px] text-[#ffffff] font-bold ml-[8px] mb-[0px] max-sm:text-[20px]">
                    Welcome to Libra.
                  </h1>
              </div>
              <p className="max-sm:text-[14px] text-[#ffffff] text-center max-sm:px-[8px]">Start a new chat or select an existing one</p>
          </div>
      </div>
    )
}