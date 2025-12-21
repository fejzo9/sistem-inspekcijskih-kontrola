import React, { createContext, useState, useEffect, type ReactNode } from "react";
import AuthService from "../services/auth.service";
import type { IAuthUser } from "../types/auth.type";

interface AuthContextType {
    currentUser: IAuthUser | undefined;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<IAuthUser | undefined>(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const login = async (username: string, password: string) => {
        const user = await AuthService.login(username, password);
        setCurrentUser(user);
    };

    const logout = () => {
        AuthService.logout();
        setCurrentUser(undefined);
    };

    const register = async (username: string, email: string, password: string) => {
        await AuthService.register(username, email, password);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
