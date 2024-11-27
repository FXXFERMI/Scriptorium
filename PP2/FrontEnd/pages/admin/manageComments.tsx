import React, { useState, useEffect } from "react";
import api from "../../utils/axiosInstance";
import Cookies from "js-cookie";
import AdminHeader from "../../components/admin/adminHeader";
import Pagination from "../../components/pagination";
import toast, { Toaster } from "react-hot-toast";

const ManageComments: React.FC = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;
    const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [commentToHide, setCommentToHide] = useState<number | null>(null);

    useEffect(() => {
        const fetchComments = async (page: number) => {
            try {
                const token = Cookies.get("accessToken");
                if (!token) {
                    throw new Error("Access token is missing");
                }
                const commentResponse = await api.get("/api/comments/sortByReports", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        page,
                        limit: itemsPerPage,
                    },
                });
                //console.log("commentResponse", commentResponse.data);
                setComments(commentResponse.data.comments);
                setTotalPages(Math.ceil(commentResponse.data.totalComments / itemsPerPage));
                setTotalItems(commentResponse.data.totalComments);
            } catch (error: any) {
                console.error("Error fetching comments:", error);
                setError(error.response?.data?.message || "Error fetching comments");
            } finally {
                setLoading(false);
            }
        };

        fetchComments(currentPage);
    }, [currentPage]);

    const openModal = (commentId: number) => {
        setCommentToHide(commentId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCommentToHide(null);
    };

    const handleHideContent = async () => {
        if (!commentToHide) return;

        try {
            const token = Cookies.get("accessToken");
            if (!token) {
                throw new Error("Access token is missing");
            }

            await api.put(
                "/api/admin/hideContent",
                { contentId: commentToHide, type: "comment" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentToHide));
            toast.success("Comment hidden successfully!");
        } catch (error: any) {
            console.error("Error hiding comment:", error);
            toast.error(error.response?.data?.message || "Error hiding comment");
        } finally {
            closeModal();
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const toggleReportContent = (commentId: number) => {
        setExpandedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    if (loading) {
        return <p className="text-center text-white">Loading Comments...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 text-white">
            <AdminHeader />
            <Toaster position="top-center" reverseOrder={false} />
            <section className="mx-auto p-6 text-white mt-[15rem] md:mt-[10rem] lg:mt-[10rem]">
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
                                <button
                                    onClick={() => toggleReportContent(comment.commentId)}
                                    className="text-blue-400 mt-2"
                                >
                                    {expandedComments[comment.commentId] ? "Hide Reports" : "View Reports"}
                                </button>
                                {expandedComments[comment.commentId] && comment.reports && (
                                    <div className="bg-gray-700 mt-4 p-4 rounded">
                                        {comment.reports.length > 0 ? (
                                            comment.reports.map((report: any, index: number) => (
                                                <div key={index} className="text-gray-300 mb-2">
                                                    <p><strong>Report {index + 1}:</strong> {report.explanation}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400">No reports available</p>
                                        )}
                                    </div>
                                )}
                                <div className="flex justify-end mt-4 items-center">
                                    <h3 className="text-2xl font-bold mr-4">
                                        Reports: {comment.reports ? comment.reports.length : 0}
                                    </h3>
                                    <button
                                        onClick={() => openModal(comment.commentId)}
                                        className="bg-red-500 py-2 px-4 rounded hover:bg-red-700"
                                    >
                                        Hide Comment
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination Controls */}
                <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                />
            </section>

            {/* Modal for Confirming Hide Action */}
            <div className={`fixed inset-0 flex items-center justify-center p-4 ${isModalOpen ? "" : "hidden"}`}>
                <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold text-white mb-4">Confirm Hide Comment</h2>
                    <p className="text-gray-300 mb-6">Are you sure you want to hide this comment?</p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={closeModal}
                            className="bg-gray-500 py-2 px-4 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleHideContent}
                            className="bg-red-500 py-2 px-4 rounded hover:bg-red-700"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageComments;
