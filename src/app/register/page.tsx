"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "../../../components/Loading";

export default function Register() {

    const router = useRouter();

    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [message, setMessage] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [lowerError, setLowerError] = useState(false);
    const [upperError, setUpperError] = useState(false);
    const [numberError, setNumberError] = useState(false);
    const [specialError, setSpecialError] = useState(false);
    const [lengthError, setLengthError] = useState(false);

    const url = process.env.NEXT_PUBLIC_API_URL;

    // Check if user is logged in
    useEffect(() => {
        async function verifyUser() {
            try {
                const options: RequestInit = {
                method: "GET",
                credentials: "include",
                };
                const response = await fetch(`${url}/auth/verify`, options);
                if (response.status === 200) {
                    setIsVerified(true);
                    router.push("/");
                    return;
                }
                setIsVerified(false);
            } catch (error) {
                console.log(error)
            }
        }
        verifyUser();
    }, [router]);
    
    // Register a new user
    async function register() {
        try {

            setShowMessage(false);
            setLowerError(false);
            setUpperError(false);
            setNumberError(false);
            setSpecialError(false);
            setLengthError(false);

            const firstNameFail = !firstName.trim();
            const lastNameFail = !lastName.trim();
            const emailFail = !email.trim();
            const passwordFail = !password.trim();

            if (firstNameFail || lastNameFail || emailFail || passwordFail) return;

            const hasLowercase = /[a-z]/;
            const hasUppercase = /[A-Z]/;
            const hasNumber = /\d/;
            const hasSpecialChar = /[^A-Za-z0-9]/;
            const hasMinLength = /^.{8,}$/;

            const lowerFail = !hasLowercase.test(password);
            const upperFail = !hasUppercase.test(password);
            const numberFail = !hasNumber.test(password);
            const specialFail = !hasSpecialChar.test(password);
            const lengthFail = !hasMinLength.test(password);

            if (lowerFail) setLowerError(true);
            if (upperFail) setUpperError(true);
            if (numberFail) setNumberError(true);
            if (specialFail) setSpecialError(true);
            if (lengthFail) setLengthError(true);

            if (lowerFail || upperFail || numberFail || specialFail || lengthFail) return;

            if (password !== confirmedPassword) {
                setMessage("Passwords do not match");
                setShowMessage(true);
                return;
            }
            const data = JSON.stringify({firstName, lastName, email, password});
            const options: RequestInit = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: data
            }
            const response = await fetch(`${url}/auth/register`, options);
            if(response.status === 201) {
                setMessage("Registered successfully");
                setShowMessage(true);
                router.push("/");
                return;
            }
            const parsedResponse = await response.json();
            setMessage(parsedResponse.message);
            setShowMessage(true);
        } catch (error) {
            console.log(error);
        }
        
    }

    // Validate first name
    function firstNameValidation(e: any) {
        if(e.target.value.length > 50) return;
        setFirstName(e.target.value);
    }

    // Validate last name
    function lastNameValidation(e: any) {
        if(e.target.value.length > 50) return;
        setLastName(e.target.value);
    }

    // Validate email
    function emailValidation(e: any) {
        if(e.target.value.length > 320) return;
        setEmail(e.target.value);
    }

    // Validate password
    function passwordValidation(e: any) {
        const byteLength = new TextEncoder().encode(e.target.value).length;
        if(byteLength > 72) return;
        setPassword(e.target.value);
    }

    // Validate confirmed password
    function confirmedPasswordValidation(e: any) {
        const byteLength = new TextEncoder().encode(e.target.value).length;
        if(byteLength > 72) return;
        setConfirmedPassword(e.target.value);
    }

    if(isVerified == null) return <Loading />;

    return (
        <div className="container h-[98vh] flex justify-center items-center">
            <div className="text-center bg-[#3a3b3e] border-solid border-1 border-[#444444] rounded-[24px] p-[24px] shadow-[0_0_16px_rgba(255,255,255,0.2)]">
                <h2>Create an account</h2>
                <form className="w-[320px]" onSubmit={(e) => {e.preventDefault(); register();}}>
                    <p className="my-[8px] text-[14px] text-left">First Name</p>
                    <input 
                        className="mb-[8px] text-[14px] w-[300px] bg-[#2a2b2e] border-solid border-[1px] outline-none rounded-[8px] p-[8px] text-[#ffffff] placeholder:text-[14px]" 
                        value={firstName} 
                        onChange={(e) => firstNameValidation(e)} 
                        type="text"  
                        placeholder="David"
                        required/>
                    <br/>
                    <p className="my-[8px] text-[14px] text-left">Last Name</p>
                    <input 
                        className="mb-[8px] text-[14px] w-[300px] bg-[#2a2b2e] border-solid border-[1px] outline-none rounded-[8px] p-[8px] text-[#ffffff] placeholder:text-[14px]" 
                        value={lastName} 
                        onChange={(e) => lastNameValidation(e)} 
                        type="text"  
                        placeholder="Cohen"
                        required/>
                    <br/>
                    <p className="my-[8px] text-[14px] text-left">E-mail</p>
                    <input 
                        className="mb-[8px] text-[14px] w-[300px] bg-[#2a2b2e] border-solid border-[1px] outline-none rounded-[8px] p-[8px] text-[#ffffff] placeholder:text-[14px]" 
                        value={email} 
                        onChange={(e) => emailValidation(e)} 
                        type="email"  
                        placeholder="example@mail.com"
                        required/>
                    <br/>
                    <p className="my-[8px] text-[14px] text-left">Password</p>
                    <input 
                        className="mb-[8px] text-[15px] w-[300px] bg-[#2a2b2e] border-solid border-[1px] outline-none rounded-[8px] p-[8px] font-sans text-[#ffffff] placeholder:text-[14px]" 
                        value={password} 
                        onChange={(e) => passwordValidation(e)} 
                        type="password" 
                        placeholder="●●●●●●●●"
                        required/>
                    <br/>
                    <p className="my-[8px] text-[14px] text-left">Confirm Password</p>
                    <input 
                        className="mb-[8px] text-[15px] w-[300px] bg-[#2a2b2e] border-solid border-[1px] outline-none rounded-[8px] p-[8px] font-sans text-[#ffffff] placeholder:text-[14px]" 
                        value={confirmedPassword} 
                        onChange={(e) => confirmedPasswordValidation(e)} 
                        type="password" 
                        placeholder="●●●●●●●●"
                        required/>
                    <br/>
                    {showMessage && <p className="w-[320px]">{message}</p>}
                    <ul className="text-left w-[300px]">
                        {lowerError && <li>Password must contain at least 1 lowercase letter</li>}
                        {upperError && <li>Password must contain at least 1 uppercase letter</li>}
                        {numberError && <li>Password must contain at least 1 number</li>}
                        {specialError && <li>Password must contain at least 1 special character</li>}
                        {lengthError && <li>Password must contain at least 8 characters long</li>}
                    </ul>
                    <button type="submit" className="mt-[0px] w-[320px] text-[#ffffff] text-[16px] font-[inter] bg-[#ae25e2] mx-auto border-none rounded-[8px] py-[8px] cursor-pointer">Sign Up</button>
                </form>
                <div className="flex justify-center">
                    <p className="w-fit text-[14px] cursor-pointer" onClick={() => router.push("/login")}>Already have an account?</p>
                </div>
            </div>
        </div>
    )
}