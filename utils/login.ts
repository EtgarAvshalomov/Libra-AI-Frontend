export async function login(email: string, password: string): Promise<{ loginMessage: string }> {
    
    const data = JSON.stringify({ email, password });
    const options: RequestInit = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: data,
    };

    const url = process.env.NEXT_PUBLIC_API_URL;
    const loginURL = process.env.NODE_ENV === 'development' ? `${url}/auth/login` : '/api/auth/login';

    const response = await fetch(loginURL, options);

    if (response.status === 200) {
        return { loginMessage: 'Login successful' };
    }

    const parsedResponse = await response.json();
    return { loginMessage: parsedResponse.message };
};