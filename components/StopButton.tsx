"use client";

type StopButtonProps = {
    stopStream: () => void
}

export default function StopButton({ stopStream }: StopButtonProps) {
    return (
        <div className="flex mt-[10px] ml-[2%] mr-[2px]">
            <img  
                className="w-[32px] h-[32px] mr-[10px] cursor-pointer" 
                src="/stop.svg" 
                alt="Stop"
                onClick={stopStream}
            />
        </div>
    )
}