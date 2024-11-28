import React, { useState } from "react";
import CreateEditBlog from "./createEditBlog";
import toast, { Toaster } from "react-hot-toast";

interface EditBlogButtonProps {
  bid: number;
}

const EditBlogButton: React.FC<EditBlogButtonProps> = ({ bid }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleSuccess = () => {
    toast.success("Blog edited successfully!", {
      duration: 3000, // Show the message for 3 seconds
    });
    closePopup(); // Close the popup after success
  };

  return (
    <div>
      <button
        onClick={openPopup}
        className="bg-blue-800 transition duration-500 text-white py-2 px-4 rounded-lg hover:bg-blue-500"
      >
        Edit
      </button>
      {isPopupOpen && (
        <CreateEditBlog
          edit={true}
          bid={bid}
          onClose={closePopup}
          onSuccess={handleSuccess} // Pass the success callback
        />
      )}
      {/* Add Toaster component to show popups at the center of the screen */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            margin: '0 auto',
            textAlign: 'center',
          },
        }}
      />
    </div>
  );
};

export default EditBlogButton;
