// pages/index.tsx
import { useState } from "react";
import CreateEditBlog from "./createEditBlog";

const CreateBlogButton = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div>
      <button
        onClick={openPopup}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Create Blog
      </button>

      {/* {isPopupOpen && <CreateBlog edit={true} bid={6} onClose={closePopup} />} */}
      {isPopupOpen && <CreateEditBlog onClose={closePopup} />}
    </div>
  );
};

export default CreateBlogButton;
