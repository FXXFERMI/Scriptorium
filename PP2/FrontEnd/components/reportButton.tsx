import React from "react";

const ReportButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
    >
      <span className="text-lg font-bold">!</span>
      <span>Report</span>
    </button>
  );
};

export default ReportButton;
