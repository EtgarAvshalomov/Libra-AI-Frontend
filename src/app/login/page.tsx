"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "../../../components/Loading";
import { login } from "../../../utils/login";

export default function Login() {

    const router = useRouter();

    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showMessage, setShowMessage] = useState(false);

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
    
    // Login a user
    async function handleLogin() {
        try {
            const { loginMessage } = await login(email, password);
            setMessage(loginMessage);
            setShowMessage(true);
            if (loginMessage === 'Login successful') router.push('/');
        } catch (error) {
            console.error(error);
            setMessage('An error occurred. Please try again.');
            setShowMessage(true);
        }
    };

    if(isVerified == null) return <Loading />;

    return (
        <div className="h-[98vh] mx-auto flex justify-center items-center">
            <div className="text-center bg-[#3a3b3e] border-solid border-1 border-[#444444] rounded-[24px] p-[24px] shadow-[0_0_16px_rgba(255,255,255,0.2)]">
                <h2 className="text-[#ffffff]">Login</h2>
                <form onSubmit={(e) => {e.preventDefault(); handleLogin();}}>
                    <p className="my-[8px] text-[14px] text-[#ffffff] text-left">E-mail</p>
                    <input 
                        className="mb-[8px] text-[14px] w-[300px] bg-[#2a2b2e] border-solid border-[1px] outline-none rounded-[8px] p-[8px] text-[#ffffff] placeholder:text-[14px]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        type="email" id="email" 
                        placeholder="example@mail.com"
                        required/>
                    <br/>
                    <p className="my-[8px] text-[14px] text-[#ffffff] text-left">Password</p>
                    <input 
                        className="mb-[8px] text-[15px] w-[300px] bg-[#2a2b2e] border-solid border-[1px] outline-none rounded-[8px] p-[8px] font-sans text-[#ffffff] placeholder:text-[14px]"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        type="password" 
                        placeholder="●●●●●●●●"
                        required/>
                    <br/>
                    {showMessage && <p className="w-[320px] text-[#ffffff] mb-[0px] pb-[0px]">{message}</p>}
                    <button type="submit" className="mt-[16px] w-[320px] text-[#ffffff] text-[16px] font-[inter] bg-[#ae25e2] mx-auto border-none rounded-[8px] py-[8px] cursor-pointer">Log In</button>
                </form>
                <div className="flex justify-center">
                    <p className="w-fit text-[16px] text-[#ffffff] cursor-pointer" onClick={() => router.push("/register")}>Create Account</p>
                </div>
            </div>
        </div>
    )
}