import React, { useState, useEffect } from "react";
import api from "../../utils/axiosInstance";
import Cookies from "js-cookie";
import AdminHeader from "../../components/admin/adminHeader";
import Pagination from "../../components/pagination";
import toast, { Toaster } from "react-hot-toast";

const ManageReplies: React.FC = () => {
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;
    const [expandedReplyId, setExpandedReplyId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [replyToHide, setReplyToHide] = useState<number | null>(null);

    useEffect(() => {
        const fetchReplies = async (page: number) => {
            try {
                const token = Cookies.get("accessToken");
                if (!token) {
                    throw new Error("Access token is missing");
                }

                const replyResponse = await api.get("/api/replies/sortByReports", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        page,
                        limit: itemsPerPage,
                    },
                });
                //console.log("replyResponse", replyResponse.data);
                setReplies(replyResponse.data.replies);
                setTotalPages(Math.ceil(replyResponse.data.totalReplies / itemsPerPage));
                setTotalItems(replyResponse.data.totalReplies);
            } catch (error: any) {
                //console.error("Error fetching replies:", error);
                setError(error.response?.data?.message || "Error fetching replies");
            } finally {
                setLoading(false);
            }
        };

        fetchReplies(currentPage);
    }, [currentPage]);

    const openModal = (replyId: number) => {
        setReplyToHide(replyId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setReplyToHide(null);
    };

    const handleHideContent = async () => {
        if (!replyToHide) return;

        try {
            const token = Cookies.get("accessToken");
            if (!token) {
                throw new Error("Access token is missing");
            }

            await api.put(
                "/api/admin/hideContent",
                { contentId: replyToHide, type: "reply" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setReplies((prevReplies) => prevReplies.filter((reply) => reply.replyId !== replyToHide));
            toast.success("Reply hidden successfully!");
        } catch (error: any) {
            //console.error("Error hiding reply:", error);
            toast.error(error.response?.data?.message || "Error hiding reply");
        } finally {
            closeModal();
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const toggleExpandReply = (replyId: number) => {
        setExpandedReplyId((prevId) => (prevId === replyId ? null : replyId));
    };

    if (loading) {
        return <p className="text-center text-white">Loading replies...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 text-white">
            <AdminHeader />
            <Toaster position="top-center" reverseOrder={false} />
            <section className="mx-auto p-6 text-white mt-[15rem] md:mt-[10rem] lg:mt-[10rem]">
                <h1 className="text-4xl font-bold text-center mb-12">Manage Replies</h1>
                <div className="space-y-4">
                    {replies.length === 0 ? (
                        <p className="text-center text-gray-400">Replies not found</p>
                    ) : (
                        replies.map((reply) => (
                            <div key={reply.replyId} className="bg-gray-800 p-6 rounded-lg">
                                <p className="text-gray-300">
                                    {reply.content ? `${reply.content.slice(0, 150)}...` : "No reply available"}
                                </p>
                                <button
                                    onClick={() => toggleExpandReply(reply.replyId)}
                                    className="text-blue-500 hover:underline mt-2"
                                >
                                    {expandedReplyId === reply.replyId ? "Hide Report Details" : "View Report Details"}
                                </button>
                                {expandedReplyId === reply.replyId && reply.reports && (
                                    <div className="mt-4 bg-gray-700 p-4 rounded">
                                        <h4 className="text-xl font-bold mb-2">Report Details:</h4>
                                        {reply.reports.length === 0 ? (
                                            <p className="text-gray-300">No reports available.</p>
                                        ) : (
                                            reply.reports.map((report: any, index: number) => (
                                                <div key={index} className="mb-2">
                                                    <p className="text-gray-300">{report.explanation}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                                <div className="flex justify-end mt-4 items-center">
                                    <h3 className="text-2xl font-bold mr-4">
                                        Reports: {reply.reports ? reply.reports.length : 0}
                                    </h3>
                                    <button
                                        onClick={() => openModal(reply.replyId)}
                                        className="bg-red-500 py-2 px-4 rounded hover:bg-red-700"
                                    >
                                        Hide Reply
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
                    <h2 className="text-2xl font-bold text-white mb-4">Confirm Hide Reply</h2>
                    <p className="text-gray-300 mb-6">Are you sure you want to hide this reply?</p>
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

export default ManageReplies;
