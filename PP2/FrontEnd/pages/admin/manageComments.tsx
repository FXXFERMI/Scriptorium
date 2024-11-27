import React, { useState, useEffect } from "react";
import api from "../../utils/axiosInstance";
import Cookies from "js-cookie";



const ManageComments: React.FC = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const token = Cookies.get("accessToken");
                if (!token) {
                    throw new Error("Access token is missing");
                }
                const commentResponse = await api.get("/api/comments/sortByReports", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Fetching comments...", token)

                setComments(commentResponse.data.comments);
            } catch (error: any) {
                console.error("Error fetching comments:", error);
                setError(error.response?.data?.message || "Error fetching comments");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, []);

    const handleHideContent = async (contentId: number) => {
        try {
            const token = Cookies.get("accessToken");
            if (!token) {
                throw new Error("Access token is missing");
            }

            await api.put(
                "/api/admin/hideContent",
                { contentId, type: "comment" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== contentId));
        } catch (error: any) {
            console.error("Error hiding comment:", error);
            alert(error.response?.data?.message || "Error hiding comment");
        }
    };

    if (loading) {
        return <p className="text-center text-white">Loading Comments...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 text-white">
            <h1 className="text-4xl font-bold text-center mb-12">Manage Comments</h1>
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-center text-gray-400">Comments not found</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.commentId} className="bg-gray-800 p-6 rounded-lg">
                            <p className="text-gray-300">
                                {comment.content ? `${comment.content.slice(0, 150)}...` : "No comment available"}
                            </p>
                            <div className="flex justify-end mt-4 items-center">
                                <h3 className="text-2xl font-bold mr-4">
                                    Reports: {comment.reports ? comment.reports.length : 0}
                                </h3>
                                <button
                                    onClick={() => handleHideContent(comment.commentId)}
                                    className="bg-red-500 py-2 px-4 rounded hover:bg-red-700"
                                >
                                    Hide Comment
                                </button>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageComments;
