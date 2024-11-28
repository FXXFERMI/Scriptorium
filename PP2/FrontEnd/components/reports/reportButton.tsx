import React, { useState } from "react";
import CreateReport from "./CreateReport";
import { useTheme } from "../../contexts/ThemeContext";

const ReportButton = ({ id, type }: { id: number; type: string }) => {
  const { theme } = useTheme();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const lightMode = false;

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div>
      <button
        onClick={openPopup}
        className={`flex items-center gap-2 px-2 py-1 rounded-md text-${theme === "dark" ? "white" : "black"} hover:bg-${theme === "dark" ? "white-600" : "black-200"} hover:text-${theme === "dark" ? "red-600" : "blue-600"} focus:outline-none`}
      >
        <span className="text-lg font-bold">! </span>
      </button>

      {isPopupOpen && <CreateReport id={id} type={type} onClose={closePopup} />}
    </div>
  );
};

export default ReportButton;
