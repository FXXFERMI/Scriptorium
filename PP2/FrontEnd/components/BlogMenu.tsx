import React, { useState, Fragment } from "react";
import CreateEditBlog from "./createEditBlog";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/axiosInstance";
import Cookies from "js-cookie";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";

interface BlogMenuProps {
  bid: number;
  onSuccess?: () => void; // To be called if delete or edit is successful to refresh the list
}

const BlogMenu: React.FC<BlogMenuProps> = ({ bid, onSuccess }) => {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const openEditPopup = () => setIsEditPopupOpen(true);
  const closeEditPopup = () => setIsEditPopupOpen(false);

  const handleEditSuccess = () => {
    toast.success("Blog edited successfully!", {
      duration: 3000, // Show the message for 3 seconds
      position: "top-center",
    });
    closeEditPopup();
    onSuccess && onSuccess();
  };

  const handleDelete = async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const response = await api.delete(`/api/Blogs/${bid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Blog deleted successfully!", {
          duration: 3000,
          position: "top-center",
        });
        onSuccess && onSuccess(); // Refresh the list of blogs after deletion
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to delete blog";
      toast.error(errorMessage, {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="relative inline-block text-left">
      <Menu as="div" className="relative">
        <div>
          <Menu.Button className="inline-flex justify-center w-full text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
            <DotsVerticalIcon className="w-5 h-5" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={openEditPopup}
                    className={`${
                      active ? "bg-blue-500 text-white" : "text-gray-900"
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    Edit
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleDelete}
                    className={`${
                      active ? "bg-red-500 text-white" : "text-gray-900"
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Edit Popup */}
      {isEditPopupOpen && (
        <CreateEditBlog
          edit={true}
          bid={bid}
          onClose={closeEditPopup}
          onSuccess={handleEditSuccess} // Pass the success callback
        />
      )}

      {/* Toast Notification for Feedback */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            margin: "0 auto",
            textAlign: "center",
          },
        }}
      />
    </div>
  );
};

export default BlogMenu;
