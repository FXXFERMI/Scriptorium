import React, { useState } from "react";
import CreateReport from "../reports/CreateReport";
import HideContent from "./hideContent";

const ReportButton = ({ id, type }: { id: number; type: string }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div>
      <button
        onClick={openPopup}
        className="flex items-center gap-2 text-white px-2 py-1 rounded-md hover:bg-white-600 hover:text-red-600 focus:outline-none"
      >
        <span className="text-lg font-bold">Hide Content </span>
      </button>

      {isPopupOpen && <HideContent id={id} type={type} onClose={closePopup} />}
    </div>
  );
};

export default ReportButton;
