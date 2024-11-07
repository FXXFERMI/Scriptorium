import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('accessToken');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/logout`);
            if (response.status === 200) {
                Cookies.remove('accessToken');  // Ensure accessToken is removed
                setIsLoggedIn(false);
                router.push('/');  // Redirect to home page
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    return (
        <nav className="bg-white shadow-md p-4">
            <div className="container mx-auto flex justify-between">
                <div className="text-xl font-bold bg-rainbow-text text-transparent bg-clip-text">My Website</div>
                <div className="space-x-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/" className="bg-rainbow-text text-transparent bg-clip-text">
                                Home
                            </Link>
                            <Link href="/users/profile" className="bg-rainbow-text text-transparent bg-clip-text">
                                Profile
                            </Link>
                            <button onClick={handleLogout} className="bg-rainbow-text text-transparent bg-clip-text cursor-pointer">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/users/login" className="bg-rainbow-text text-transparent bg-clip-text">
                                Login
                            </Link>
                            <Link href="/users/register" className="bg-rainbow-text text-transparent bg-clip-text">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
