// components/Dialog.tsx
import Cookies from "js-cookie";
import React, { useState } from "react";
import api from "../utils/axiosInstance";

interface DialogProps {
  id: number;
  type: string;
  onClose: () => void;
}

const HideContent: React.FC<DialogProps> = ({ id, type, onClose }) => {
  const [error, setError] = useState("");

  const handleHide = async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        console.error("Access token is missing");
        return;
      }

      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/hideContent`,
        { contentId: id, type: type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      onClose();
    } catch (error: any) {
      setError(
        error.response?.data?.error || `Failed to create report for ${type}`
      );
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-xl font-semibold text-center mb-4">
          Hide {type}?{" "}
        </h3>
        {/* Display error message if it exists */}
        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}
        <div className="flex justify-around">
          <button
            onClick={handleHide}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default HideContent;
