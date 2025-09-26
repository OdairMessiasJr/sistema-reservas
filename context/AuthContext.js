import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    const login = async (username, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                setIsAdmin(true);
                router.push('/'); 
                return true;
            } else {
                setIsAdmin(false);
                return false;
            }
        } catch (error) {
            console.error('Falha no login:', error);
            setIsAdmin(false);
            return false;
        }
    };

    const logout = () => {
        setIsAdmin(false);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook para facilitar o uso do contexto
export const useAuth = () => useContext(AuthContext);