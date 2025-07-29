"use client"
import { marked } from 'marked';

type AssistantMessageProps = {
    content: string
}

export default function AssistantMessage({ content }: AssistantMessageProps) {
    return (
        <div
            className="w-100% px-[0.8rem] py-[0.6rem] rounded-[24px] text-start"
            dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
            dir='auto'
        />
    )
}