"use client";
import { useState, useEffect } from "react";

type ModelSelectProps = {
    isLoggedIn: boolean;
    selectedModelValue: string;
    setSelectedModelValue: React.Dispatch<React.SetStateAction<string>>
}

export default function ModelSelect({ isLoggedIn, selectedModelValue, setSelectedModelValue }: ModelSelectProps) {

    const [models, setModels] = useState([]);

    const url = process.env.NEXT_PUBLIC_API_URL;

    // Fetch models
    useEffect(() => {
        async function fetchModels() {
        try {
            if (!isLoggedIn) return;
            const options: RequestInit = {
                method: "GET",
                credentials: 'include'
            }
            const response = await fetch(`${url}/models`, options);
            if(response.status !== 200) {
                const data = await response.json()
                console.log(data);
                return;
            }

            const parsedResponse = await response.json();
            const data = parsedResponse.data;
            setModels(data.models);

            // Initialize local storage
            if(!localStorage.getItem("userData")) {
                localStorage.setItem("userData", JSON.stringify({model: data.models[0].value}));
            }

            // Set model by user data
            const userData = JSON.parse(localStorage.getItem("userData") ?? "");
            setSelectedModelValue(userData.model);
        } catch (error) {
            console.log(error);
        }
        }

        fetchModels();
    }, [isLoggedIn]);

    // Update user data in local storage
    function updateUserData(model: string) {
        setSelectedModelValue(model);
        let userData = JSON.parse(localStorage.getItem("userData") ?? "");
        userData.model = model; // Update the selected model
        localStorage.setItem("userData", JSON.stringify(userData));
    }

    return (
        <div className="flex mt-[3px] ml-[2%] w-[30%]">
            <img className="w-[28px] h-[28px] mr-[10px] mb-[5px]" src="/model.svg" alt="Model"/>
            <select 
                className="bg-transparent appearance-none cursor-pointer text-[#cfcfcf] rounded-[6px] w-[10rem] pl-[6px] text-[14px] font-[inter] truncate focus:outline-none focus:bg-[#404045]" 
                id="model-select" 
                value={selectedModelValue}
                onChange={(event) => updateUserData(event.target.value)} name="model">
                {models.map((model: any) => (
                <option key={model.id} value={model.value}>{model.name}</option>
                ))}
            </select>
        </div>
    )
}