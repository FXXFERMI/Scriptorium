import React from "react";
import api from "../../utils/axiosInstance";
import Cookies from "js-cookie";

interface DeleteCodeTemplateButtonProps {
  cid: number;
  onDelete: () => void;
}

const DeleteCodeTemplateButton: React.FC<DeleteCodeTemplateButtonProps> = ({ cid, onDelete }) => {
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

      // Call the onDelete callback to update parent state
      onDelete();
    } catch (err: any) {
      console.error("Error deleting code template:", err);
      alert(err.response?.data?.error || "Error deleting code template");
    }
  };

  return (
    <button
      onClick={handleDeleteTemplate}
      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 mt-4"
    >
      Delete Code Template
    </button>
  );
};

export default DeleteCodeTemplateButton;
