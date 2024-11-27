import React from "react";
import api from "../../utils/axiosInstance";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

interface DeleteBlogProps {
  bid: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const DeleteBlog: React.FC<DeleteBlogProps> = ({ bid, onSuccess, onError }) => {
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
        onSuccess && onSuccess();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to delete blog";
      toast.error(errorMessage, {
        duration: 3000,
        position: "top-center",
      });
      onError && onError(errorMessage);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
      >
        Delete
      </button>
      <Toaster />
    </div>
  );
};

export default DeleteBlog;
