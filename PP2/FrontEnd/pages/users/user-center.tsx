import React, { useState } from 'react';

const UserCenter = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && !e.target.closest('#sidebar')) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex overflow-hidden" onClick={closeSidebar}>
      {/* Sidebar */}
      <div
        id="sidebar"
        className={`absolute bg-gray-800 text-white w-56 min-h-screen overflow-y-auto transition-transform transform ease-in-out duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <h1 className="text-2xl font-semibold">Sidebar</h1>
          <ul className="mt-4">
            <li className="mb-2">
              <a href="#" className="block hover:text-indigo-400">
                Home
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block hover:text-indigo-400">
                About
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block hover:text-indigo-400">
                Services
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block hover:text-indigo-400">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <div className="bg-white shadow">
          <div className="container mx-auto">
            <div className="flex justify-between items-center py-4 px-2">
              <h1 className="text-xl font-semibold">User Center</h1>
              <button
                className="text-gray-500 hover:text-gray-600"
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
        <div className="flex-1 overflow-auto p-4">
          <h1 className="text-2xl font-semibold">Welcome to the User Center</h1>
          <p>This is the user center page where you can manage your profile and explore features.</p>
        </div>
      </div>
    </div>
  );
};

export default UserCenter;
