import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../utils/axiosInstance";
import Cookies from "js-cookie";
import axios from "axios";

interface CreateReportData {
  bid?: number;
  replyId?: number;
  commentId?: number;
  explanation: string;
}

interface PopupProps {
  id: number;
  type: string;
  onClose: () => void;
}

const CreateReport: React.FC<PopupProps> = ({ id, type, onClose }) => {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateReportData>({
    bid: null,
    replyId: null,
    commentId: null,
    explanation: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        //console.error("Access token is missing");
        return;
      }

      let data: CreateReportData = { explanation: formData.explanation };
      if (type === "blog") {
        data.bid = id;
      } else if (type === "reply") {
        data.replyId = id;
      } else if (type === "comment") {
        data.commentId = id;
      } else {
        //console.error("Invalid report details");
        return;
      }

      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Reports`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      onClose();
    } catch (error: any) {
      setError(
        error.response?.data?.error || `Failed to create report for ${type}`
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70"
      style={{ backdropFilter: "blur(5px)" }}
    >
      <div className="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-xl relative z-60 border border-gray-700">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-4">Report {type}</h2>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white focus:outline-none"
        >
          <span className="material-icons">close</span>
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 mt-6"
        >
          <textarea
            placeholder="Write a description..."
            className="bg-gray-800 w-full min-h-24 text-gray-400 mb-6 border-none resize-none focus:outline-none placeholder-gray-500 "
            value={formData.explanation}
            onChange={(e) =>
              setFormData({ ...formData, explanation: e.target.value })
            }
          />

          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 focus:outline-none transition-colors"
            >
              Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReport;
