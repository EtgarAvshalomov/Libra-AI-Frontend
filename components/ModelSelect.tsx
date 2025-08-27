"use client";
import { useState, useEffect } from "react";
import { Model } from "../types/database";

type ModelSelectProps = {
    models: Model[];
    selectedModelValue: string;
    setSelectedModelValue: React.Dispatch<React.SetStateAction<string>>
}

export default function ModelSelect({ models, selectedModelValue, setSelectedModelValue }: ModelSelectProps) {

    // Update user data in local storage
    function updateUserData(model: string) {
        setSelectedModelValue(model);
        const userData = JSON.parse(localStorage.getItem("userData") ?? "");
        userData.model = model; // Update the selected model
        localStorage.setItem("userData", JSON.stringify(userData));
    }

    return (
        <div className="flex mt-[3px] ml-[2%] w-[30%]">
            <img className="w-[28px] h-[28px] mr-[10px] mb-[5px]" src="/model.svg" alt="Model" title="Model"/>
            <select 
                className="bg-transparent max-lg:text-[12px] appearance-none cursor-pointer text-[#cfcfcf] border-1 border-[grey] rounded-[6px] w-[10rem] px-[6px] text-[14px] font-[inter] truncate focus:outline-none focus:bg-[#404045]" 
                id="model-select" 
                value={selectedModelValue}
                onChange={(event) => updateUserData(event.target.value)} name="model">
                {models.map((model: Model) => (
                <option key={model.id} value={model.value}>{model.name}</option>
                ))}
            </select>
        </div>
    )
}