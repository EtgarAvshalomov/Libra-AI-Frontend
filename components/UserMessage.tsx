"use client"

type UserMessageProps = {
    content: string
}

export default function UserMessage({ content }: UserMessageProps) {
    return (
        <p 
            className="w-fit px-[0.8rem] py-[0.6rem] rounded-[24px] text-start justify-self-end bg-[#404045]"
            dir="auto">
            {content}
        </p>
    )
}