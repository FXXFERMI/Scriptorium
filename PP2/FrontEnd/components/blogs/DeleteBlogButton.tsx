import React, { useState } from "react";
import DeleteBlog from "./DeleteBlog";

interface DeleteBlogButtonProps {
  bid: number;
}

const DeleteBlogButton: React.FC<DeleteBlogButtonProps> = ({ bid }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  const handleSuccess = () => {
    setIsDeleting(false);
    // Optionally add any additional success behavior, like refreshing the page or removing the item from the UI
  };

  const handleError = (error: string) => {
    console.error("Error deleting blog:", error);
    setIsDeleting(false);
  };

  return (
    <div>
      <button
        onClick={handleDeleteClick}
        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
      >
        Delete Blog
      </button>
      {isDeleting && (
        <DeleteBlog bid={bid} onSuccess={handleSuccess} onError={handleError} />
      )}
    </div>
  );
};

export default DeleteBlogButton;
