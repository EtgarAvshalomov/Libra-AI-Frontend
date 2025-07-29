"use client";

type SendButtonProps = {
    sendPrompt: () => void;
}

export default function SendButton({ sendPrompt }: SendButtonProps) {
    return (
        <div className="flex mt-[10px] ml-[2%] mr-[2px]">
            <img  
                className="w-[28px] h-[28px] mr-[10px] cursor-pointer" 
                src="/send.svg" 
                alt="Send"
                onClick={sendPrompt}
            />
        </div>
    )
}