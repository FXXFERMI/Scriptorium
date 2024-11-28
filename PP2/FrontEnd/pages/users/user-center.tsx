import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Profile from './profile';
import MyBlogs from './myBlogs';
import MyCodeTemplates from './myCodeTemplates';
// import Footer from "../../components/Footer";
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from "../../contexts/ThemeContext";


// Dummy components for different pages
// const Home = () => <div><h2>Home Page</h2><p>Welcome to the home page!</p></div>;
// const MyBlogs = () => <div className="text-white text-2xl font-semibold"><h2>My Blogs Page</h2><p>Learn more Blogs on this page.</p></div>;
// const MyCodeTemplates = () => <div className="text-white text-2xl font-semibold"><h2>My Code Templates Page</h2><p>Here are the Code Templates we offer.</p></div>;
// const Settings = () => <div className="text-white text-2xl font-semibold"><h2>Settings Page</h2><p>Get in touch with us here.</p></div>;

const UserCenter: React.FC = () => {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Profile');
  const router = useRouter();
  const { isLoggedIn, logout, login } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && !e.target.closest('#sidebar')) {
      setIsSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (selectedOption) {
      // case 'Home':
      //   return <Home />;
      case 'MyBlogs':
        return <MyBlogs />;
      case 'MyCodeTemplates':
        return <MyCodeTemplates />;
      // case 'Settings':
      //   return <Settings />;
      case 'Profile':
        return <Profile />;
      default:
        return <Profile />;
    }
  };

  return (
    // <div className="bg-gray-100 h-screen flex overflow-hidden" onClick={closeSidebar}>
    <div
      className={`bg-${theme === "dark" ? "black" : "white"} h-screen flex overflow-hidden`}
      onClick={closeSidebar}
    >
      {/* Sidebar */}
      <div
        className={`absolute z-50 bg-${theme === "dark" ? "gray-800" : "gray-200"} text-${theme === "dark" ? "white" : "black"
          } w-56 min-h-screen overflow-y-auto transition-transform transform ease-in-out duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4">
          <h1 className="text-2xl font-semibold">User Center</h1>
          <ul className="mt-4">
            <li className="mb-2">
              <button
                onClick={() => setSelectedOption("Profile")}
                className="block hover:text-indigo-400 w-full text-left"
              >
                My Profile
              </button>
            </li>
            {/* <li className="mb-2">
              <button onClick={() => setSelectedOption('Home')} className="block hover:text-indigo-400 w-full text-left">
                Home
              </button>
            </li> */}
            <li className="mb-2">
              <button
                onClick={() => setSelectedOption("MyBlogs")}
                className="block hover:text-indigo-400 w-full text-left"
              >
                My Blogs
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setSelectedOption("MyCodeTemplates")}
                className="block hover:text-indigo-400 w-full text-left"
              >
                My Code Templates
              </button>
            </li>
            <li className="mb-2">
              <br />
            </li>
            {/* <li className="mb-2">
              <button onClick={() => setSelectedOption('Settings')} className="block hover:text-indigo-400 w-full text-left">
                Settings
              </button>
            </li> */}
            <li className="mb-2">
              <button
                onClick={() => handleLogout()}
                className="block hover:text-indigo-400 w-full text-left"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <div className={`bg-${theme === "dark" ? "black" : "white"} shadow`}>
          <div className="container mx-auto">
            <div className="flex justify-between items-center py-4 px-2">
              <Link
                href="/"
                className={`flex text-3xl text-${theme === "dark" ? "white" : "black"} font-medium mb-4 md:mb-0`}
              >
                <img
                  src={`${theme === "dark"
                      ? `${process.env.NEXT_PUBLIC_BASE_URL}/favicon.png`
                      : `${process.env.NEXT_PUBLIC_BASE_URL}/logo_light.PNG`
                    }`}
                  alt="Logo"
                  className="w-16 h-8 mr-2" // Adjust size and spacing as needed
                />
                Scriptorium
              </Link>
              {/* <h1 className="text-white text-xl font-semibold">User Center</h1> */}
              <button
                className={`text-${theme === "dark" ? "gray-500" : "gray-700"} hover:text-gray-600`}
                id="open-sidebar"
                onClick={toggleSidebar}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto">{renderContent()}</div>

      </div>
    </div>
  );
};

export default UserCenter;