import React, { useState } from "react";
import CreateReport from "./CreateReport";

const ReportButton = ({ id, type }: { id: number; type: string }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const lightMode = false;

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div>
      <button
        onClick={openPopup}
        className={`flex items-center gap-2  px-2 py-1 rounded-md hover:bg-white-600 hover:text-red-600 focus:outline-none ${
          lightMode ? "text-black" : "text-white"
        }`}
      >
        <span className="text-lg font-bold">! </span>
      </button>

      {isPopupOpen && <CreateReport id={id} type={type} onClose={closePopup} />}
    </div>
  );
};

export default ReportButton;
