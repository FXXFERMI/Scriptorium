import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
// import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axiosInstance';
// import ModalLogin from './ModalLogin';

const Header: React.FC = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // const [loginModalOpen, setLoginModalOpen] = useState(false);
    // const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const { isLoggedIn, logout, login } = useAuth();

    // console.log("login", isLoggedIn);
    // useEffect(() => {
    //     // Check if the user is logged in by verifying the presence of an access token
    //     const token = Cookies.get('accessToken');
    //     console.log("check",token);
    //     setIsLoggedIn(!!token);
    // }, []);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    // useEffect(() => {
    //     setIsClient(true);
    //     const token = Cookies.get('accessToken');
    //     setIsLoggedIn(!!token);
    // }, []);

    // const handleLogout = async () => {
    //     Cookies.remove('accessToken');
    //     setIsLoggedIn(false);
    //     router.push('/');
    // };

    // const openLoginModal = () => {
    //     setLoginModalOpen(true);
    // };

    // const closeLoginModal = () => {
    //     setLoginModalOpen(false);
    // };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
        setLoginError(null);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <header className="fixed top-0 w-full clearNav z-50">
            <div className="max-w-5xl mx-auto flex flex-wrap p-5 flex-col md:flex-row">
                <div className="flex flex-row items-center justify-between p-3 md:p-1">
                    <Link href="/" className="flex text-3xl text-white font-medium mb-4 md:mb-0">
                        <img
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.png`}
                            alt="Logo"
                            className="w-16 h-8 mr-2" // Adjust size and spacing as needed
                        />
                        Scriptorium
                    </Link>
                    <button
                        className="text-white pb-4 cursor-pointer leading-none px-3 py-1 md:hidden outline-none focus:outline-none content-end ml-auto"
                        type="button"
                        aria-label="button"
                        onClick={() => setNavbarOpen(!navbarOpen)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-menu"
                        >
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className={`md:flex flex-grow items-center ${navbarOpen ? "flex" : "hidden"}`}>
                    <div className="md:ml-auto md:mr-auto font-4 pt-1 md:pl-14 pl-1 flex flex-wrap items-center md:text-base text-1xl md:justify-center justify-items-start">
                        <Link href="/about/about" className="mr-11 pr-2 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
                            {/* <a className="mr-11 pr-2 cursor-pointer text-gray-300 hover:text-white font-semibold tr04"> */}
                            About
                            {/* </a> */}
                        </Link>
                        <a className="mr-11 pr-2 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
                            Blogs
                        </a>
                        <a className="mr-11 pr-2 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
                            Code Templates
                        </a>
                        {/* <a className="mr-12 md:ml-11 ml-0 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
                            Blogs
                        </a> */}
                        {/* <a className="mr-5 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
                            About
                        </a> */}
                        <div className="space-x-4">
                            {isLoggedIn ? (
                                <>
                                    {/* <Link href="/" className="bg-rainbow-text text-transparent bg-clip-text">
                                        Home
                                    </Link> */}
                                    <Link href="/users/profile" className="mr-5 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
                                        Profile
                                    </Link>
                                    <button onClick={handleLogout} className="mr-5 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* <Link href="/" className="bg-rainbow-text text-transparent bg-clip-text">
                                        Home
                                    </Link> */}
                                    {/* <Link href="/users/login" className="mr-5 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
                                        Login
                                    </Link> */}
                                    {/* <Link href="/users/login" legacyBehavior>
                                        <a
                                            className="mr-5 cursor-pointer text-gray-300 hover:text-white font-semibold tr04"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Login
                                        </a>
                                    </Link> */}
                                    <button onClick={toggleDropdown} className="mr-5 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
                                        Login
                                    </button>
                                    {dropdownOpen && (
                                        <div ref={dropdownRef} className="absolute right-1/3 transform translate-x-1/2 mt-6 w-64 p-4 bg-white shadow-lg z-50">
                                            <form
                                                onSubmit={async (e) => {
                                                    e.preventDefault();
                                                    const form = e.target as HTMLFormElement;

                                                    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
                                                    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

                                                    try {
                                                        const response = await api.post(
                                                            `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
                                                            { username, password },
                                                            { withCredentials: true }
                                                        );
                                                        Cookies.set('accessToken', response.data.accessToken, { path: '/' });
                                                        login();
                                                        setDropdownOpen(false);
                                                        router.push('/');
                                                    } catch (error: any) {
                                                        // console.error("Login failed:", error);
                                                        setLoginError(error.response?.data?.message || "Login failed");
                                                    }
                                                }}
                                                className="flex flex-col items-center" // Ensure the form content is centered
                                            >
                                                {loginError && (
                                                    <div className="mb-4 w-full text-center text-red-500 font-semibold">
                                                        {loginError}
                                                    </div>
                                                )}
                                                <div className="mb-4 w-full">
                                                    <label className="block text-gray-700 font-semibold mb-2">Username:</label>
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        className="w-full p-2 border rounded-md"
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-4 w-full">
                                                    <label className="block text-gray-700 font-semibold mb-2">Password:</label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        className="w-full p-2 border rounded-md"
                                                        required
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center justify-center py-3 px-14 font-semibold tracking-tighter text-white transition duration-500 ease-in-out transform bg-gradient-to-r from-blue-500 to-blue-800 text-md focus:shadow-outline hover:from-blue-600 hover:to-blue-900 mt-4"
                                                >
                                                    Login
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                    <Link href="/users/register" className="mr-5 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* <ModalLogin isOpen={loginModalOpen} onClose={closeLoginModal} /> */}
        </header>
    );
};

export default Header;
