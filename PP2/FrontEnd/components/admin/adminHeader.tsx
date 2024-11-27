import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/axiosInstance";

const AdminHeader: React.FC = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setLoginError(null);
    setLoginSuccess(null);
    router.push("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setLoginError(null);
    setLoginSuccess(null);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="fixed top-0 w-full clearNav z-50">
      <div className="mx-auto flex flex-wrap p-5 flex-col md:flex-row">
        <div className="flex flex-row items-center justify-between p-3 md:p-1">
          <Link href="/admin/dashboard" className="flex text-3xl text-white font-medium mb-4 md:mb-0">
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.png`}
              alt="Logo"
              className="w-16 h-8 mr-2" // Adjust size and spacing as needed
            />
            Admin Dashboard
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
            <Link href="/admin/manageBlogs" className="mr-11 pr-2 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
              Manage Blogs
            </Link>
            <Link href="/admin/manageComments" className="mr-11 pr-2 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
              Manage Comments
            </Link>
            <Link href="/admin/manageReplies" className="mr-11 pr-2 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
              Manage Replies
            </Link>
            {/* <Link href="/admin/manageUsers" className="mr-11 pr-2 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
              Manage Users
            </Link> */}
            <div className="space-x-4">
              {isLoggedIn ? (
                <>
                  <button onClick={handleLogout} className="mr-5 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
                    Logout
                  </button>
                </>
              ) : (
                  <>
                    <button onClick={handleLogout} className="mr-5 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
                      Logout
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
