import React, { useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import api from "../../utils/axiosInstance";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

interface CodeTemplateMenuProps {
  cid: number;
  onDelete: () => void;
}

const CodeTemplateMenu: React.FC<CodeTemplateMenuProps> = ({ cid, onDelete }) => {
  const router = useRouter();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const openDeleteConfirm = () => setIsDeleteConfirmOpen(true);
  const closeDeleteConfirm = () => setIsDeleteConfirmOpen(false);

  const handleDeleteTemplate = async () => {
    try {
      // Get the access token from cookies
      const token = Cookies.get("accessToken");
      if (!token) {
        throw new Error("Access token is missing");
      }

      // Make API request to delete the code template
      await api.delete(`/api/CodeTemplates/${cid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Show a success toast
      toast.success("Code Template deleted successfully!", {
        duration: 3000,
        position: "top-center",
      });

      // Call the onDelete callback to update parent state
      onDelete();
      closeDeleteConfirm();
    } catch (err: any) {
      console.error("Error deleting code template:", err);
      toast.error(err.response?.data?.error || "Error deleting code template", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  const handleExecutionRedirect = () => {
    router.push(`/execution/${cid}`);
  };

  return (
    <div className="relative inline-block text-left">
      <Menu as="div" className="relative">
        <div>
          <Menu.Button className="inline-flex justify-center w-full text-sm font-medium text-gray-700 hover:text-white focus:outline-none">
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
                    onClick={handleExecutionRedirect}
                    className={`${
                      active ? "bg-blue-500 text-white" : "text-gray-900"
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    Execute Code
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={openDeleteConfirm}
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

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 text-white">
          <div className="bg-black p-6 rounded-lg shadow-md w-96 text-center">
            <h2 className="text-lg font-bold mb-4">Delete Code Template</h2>
            <p className="mb-6">Are you sure you want to delete this code template? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteTemplate}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Confirm Deletion
              </button>
              <button
                onClick={closeDeleteConfirm}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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

export default CodeTemplateMenu;
