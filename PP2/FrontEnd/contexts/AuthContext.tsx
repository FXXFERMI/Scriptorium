// contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

export interface AuthContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
    // refreshLoginStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        // Check if the user is logged in by verifying the presence of an access token
        const token = Cookies.get('accessToken');
        // console.log("login1",token);
        setIsLoggedIn(!!token);
    }, []);

    // useEffect(() => {
    //     // Run some code whenever isLoggedIn changes
    //     if (isLoggedIn) {
    //         console.log('User logged in');
    //     } else {
    //         console.log('User logged out');
    //     }
    //     const token = Cookies.get('accessToken');
    //     // console.log("login2",token);
    //     // setIsLoggedIn(!!token);
    // }, [isLoggedIn]);


    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = async () => {
        try {
            // Call the logout API to invalidate refresh token on the backend
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/logout`, {}, {
                withCredentials: true,
            });
        } catch (error) {
            //console.error("Error logging out:", error);
        } finally {
            // Remove cookies regardless of the API call success or failure
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            setIsLoggedIn(false);
        }
    };

    // // New function to refresh login status
    // const refreshLoginStatus = () => {
    //     const token = Cookies.get('accessToken');
    //     setIsLoggedIn(!!token);
    // };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};