"use client";

type TemperatureInputProps = {
    temperature: number;
    setTemperature: React.Dispatch<React.SetStateAction<number>>;
    temperatureInput: string;
    setTemperatureInput: React.Dispatch<React.SetStateAction<string>>
}

export default function TemperatureInput({temperature, setTemperature, temperatureInput, setTemperatureInput}: TemperatureInputProps) {

    // Update temperature
    function updateTemperature(tempInput: string) {
    
        // Check for 2 numbers after the dot
        let index = 0;
        while(tempInput[index] && tempInput[index] !== ".") index++;

        if(tempInput.length-(index+1) > 2) return;

        // Empty counts as 0
        if(tempInput === "") {
            setTemperatureInput(tempInput);
            setTemperature(0);
            return;
        }

        // Validate value
        const parsedValue = parseFloat(tempInput);

        if (parsedValue >= 0 && parsedValue <= 2) {
            setTemperature(parsedValue);
            setTemperatureInput(tempInput);
            return;
        }
    }

    return (
        <>
        <img className="w-[24px] h-[24px] ml-[60px]" src="/temperature.svg" alt="Temperature"></img>
        <input 
            id="temp-slider" 
            className="ml-[4px]" 
            type="range" 
            min="0" 
            max="2" 
            step="0.01"
            value={temperature}
            onChange={(e) => updateTemperature(e.target.value)}/>
        <input 
            id="temp-input" 
            className="bg-[#404045] text-[#ffffff] text-center ml-[6px] w-[25px] px-[10px] border-solid focus:outline-none rounded-[4px]" 
            type="number" 
            min="0" 
            max="2" 
            step="0.01" 
            value={temperatureInput}
            onChange={(e) => updateTemperature(e.target.value)}/>
        </>
    )
}