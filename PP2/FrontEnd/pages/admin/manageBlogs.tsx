import React, { useState, useEffect } from "react";
import api from "../../utils/axiosInstance";
import Cookies from "js-cookie";
import AdminHeader from "../../components/admin/adminHeader";
import Pagination from "../../components/pagination";
import toast, { Toaster } from "react-hot-toast";

const ManageBlogs: React.FC = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;
    const [expandedBlogs, setExpandedBlogs] = useState<{ [key: number]: boolean }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blogToHide, setBlogToHide] = useState<number | null>(null);

    useEffect(() => {
        const fetchBlogs = async (page: number) => {
            try {
                const token = Cookies.get("accessToken");
                if (!token) {
                    throw new Error("Access token is missing");
                }

                const blogResponse = await api.get("/api/Blogs/sortByReports", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        page,
                        limit: itemsPerPage,
                    },
                });

                //console.log("blogResponse", blogResponse.data);
                setBlogs(blogResponse.data.blogs);
                setTotalPages(Math.ceil(blogResponse.data.totalBlogs / itemsPerPage));
                setTotalItems(blogResponse.data.totalBlogs);
            } catch (error: any) {
                console.error("Error fetching blogs:", error);
                setError(error.response?.data?.message || "Error fetching blogs");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs(currentPage);
    }, [currentPage]);

    const openModal = (blogId: number) => {
        setBlogToHide(blogId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setBlogToHide(null);
    };

    const handleHideContent = async () => {
        if (!blogToHide) return;

        try {
            const token = Cookies.get("accessToken");
            if (!token) {
                throw new Error("Access token is missing");
            }

            await api.put(
                "/api/admin/hideContent",
                { contentId: blogToHide, type: "blog" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Remove the hidden blog from the state
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.bid !== blogToHide));
            toast.success("Blog hidden successfully!");
        } catch (error: any) {
            console.error("Error hiding blog:", error);
            toast.error(error.response?.data?.message || "Error hiding blog");
        } finally {
            closeModal();
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const toggleReportContent = (blogId: number) => {
        setExpandedBlogs((prev) => ({
            ...prev,
            [blogId]: !prev[blogId],
        }));
    };

    if (loading) {
        return <p className="text-center text-white">Loading Blogs...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 text-white">
            <AdminHeader />
            <Toaster position="top-center" reverseOrder={false} />
            <section className="mx-auto p-6 text-white mt-[15rem] md:mt-[10rem] lg:mt-[10rem]">
                <h1 className="text-4xl font-bold text-center mb-12">Manage Blogs</h1>
                <div className="space-y-4">
                    {blogs.length === 0 ? (
                        <p className="text-center text-gray-400">Blogs not found</p>
                    ) : (
                        blogs.map((blog) => (
                            <div key={blog.bid} className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-2xl font-bold">{blog.title}</h3>
                                <p className="text-sm text-gray-400 mb-2">
                                    By: {blog.user?.profile?.firstName} {blog.user?.profile?.lastName}
                                </p>
                                <p className="text-gray-300 mb-2">
                                    {blog.description ? `${blog.description.slice(0, 150)}...` : "No description available"}
                                </p>
                                <button
                                    onClick={() => toggleReportContent(blog.bid)}
                                    className="text-blue-400 mt-2"
                                >
                                    {expandedBlogs[blog.bid] ? "Hide Reports" : "View Reports"}
                                </button>
                                {expandedBlogs[blog.bid] && blog.reports && (
                                    <div className="bg-gray-700 mt-4 p-4 rounded">
                                        {blog.reports.length > 0 ? (
                                            blog.reports.map((report: any, index: number) => (
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
                                        Reports: {blog.reports ? blog.reports.length : 0}
                                    </h3>
                                    <button
                                        onClick={() => openModal(blog.bid)}
                                        className="bg-red-500 py-2 px-4 rounded hover:bg-red-700"
                                    >
                                        Hide Blog
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
                    <h2 className="text-2xl font-bold text-white mb-4">Confirm Hide Blog</h2>
                    <p className="text-gray-300 mb-6">Are you sure you want to hide this blog?</p>
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

export default ManageBlogs;
