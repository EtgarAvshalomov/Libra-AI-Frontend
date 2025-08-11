"use client"
import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { Message, Model } from '../types/database';

type AssistantMessageProps = {
    message: Message
    models: Model[]
}

export default function AssistantMessage({ message, models }: AssistantMessageProps) {

    const [currentModel, setCurrentModel] = useState<Model | null>(null);

    // Find message model
    useEffect(() => {
        const model = models.find((model) => model.id === message.model_id);
        setCurrentModel(model || null);
    }, [message, models]);

    return (
        <>
            <div
                className="w-100% px-[0.8rem] pt-[0.6rem] pb-[0rem] rounded-[24px] text-start text-[#ffffff]"
                dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}
                dir='auto'
            />
            <div className='flex'>
                <img className="w-[15px] h-[15px] ml-[12px]" src="/model.svg" alt="Model"/>
                <p className='max-lg:text-[11px] lg:text-[13px] mt-[0px] ml-[6px] text-[#9a9ba6] justify-self-start'>{currentModel?.name}</p>
                <img className="w-[15px] h-[15px] ml-[10px]" src="/temperature.svg" alt="Temperature" />
                <p className='max-lg:text-[11px] lg:text-[13px] mt-[0px] ml-[4px] text-[#9a9ba6]'>{message.temperature}</p>
            </div>
        </>
    )
}