import React, { useState, useEffect } from "react";
import api from "../../utils/axiosInstance";
import Cookies from "js-cookie";

const ManageReplies: React.FC = () => {
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const token = Cookies.get("accessToken");
                if (!token) {
                    throw new Error("Access token is missing");
                }

                const replyResponse = await api.get("/api/replies/sortByReports", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setReplies(replyResponse.data.replies);
            } catch (error: any) {
                console.error("Error fetching replies:", error);
                setError(error.response?.data?.message || "Error fetching replies");
            } finally {
                setLoading(false);
            }
        };

        fetchReplies();
    }, []);

    const handleHideContent = async (contentId: number) => {
        try {
            const token = Cookies.get("accessToken");
            if (!token) {
                throw new Error("Access token is missing");
            }

            await api.put(
                "/api/admin/hideContent",
                { contentId, type: "reply" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setReplies((prevReplies) => prevReplies.filter((reply) => reply.replyId !== contentId));
        } catch (error: any) {
            console.error("Error hiding reply:", error);
            alert(error.response?.data?.message || "Error hiding reply");
        }
    };

    if (loading) {
        return <p className="text-center text-white">Loading replies...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 text-white">
            <h1 className="text-4xl font-bold text-center mb-12">Manage replies</h1>

            <div className="space-y-4">
                {replies.length === 0 ? (
                    <p className="text-center text-gray-400">Replies not found</p>
                ) : (
                    replies.map((reply) => (
                        <div key={reply.replyId} className="bg-gray-800 p-6 rounded-lg">
                            <p className="text-gray-300">
                                {reply.content ? `${reply.content.slice(0, 150)}...` : "No reply available"}
                            </p>
                            <div className="flex justify-end mt-4 items-center">
                                <h3 className="text-2xl font-bold mr-4">
                                    Reports: {reply.reports ? reply.reports.length : 0}
                                </h3>
                                <button
                                    onClick={() => handleHideContent(reply.replyId)}
                                    className="bg-red-500 py-2 px-4 rounded hover:bg-red-700"
                                >
                                    Hide Reply
                                </button>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageReplies;
