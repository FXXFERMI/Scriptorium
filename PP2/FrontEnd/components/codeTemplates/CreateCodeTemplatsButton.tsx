import React from "react";
import { useRouter } from "next/router";

const CreateCodeTemplateButton = () => {
  const router = useRouter();

  const handleCreateButtonClick = () => {
    router.push("/execution");
  };

  return (
    <div>
      <button
        onClick={handleCreateButtonClick}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Create Code Template
      </button>
    </div>
  );
};

export default CreateCodeTemplateButton;
