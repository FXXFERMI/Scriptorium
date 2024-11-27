import React, { useState, useEffect } from "react";
import api from "../../utils/axiosInstance";
import Cookies from "js-cookie";


const ManageBlogs: React.FC = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const token = Cookies.get("accessToken");
                if (!token) {
                    throw new Error("Access token is missing");
                }

                const blogResponse = await api.get("/api/Blogs/sortByReports", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBlogs(blogResponse.data);
            } catch (error: any) {
                console.error("Error fetching blogs:", error);
                setError(error.response?.data?.message || "Error fetching blogs");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleHideContent = async (contentId: number) => {
        try {
            const token = Cookies.get("accessToken");
            if (!token) {
                throw new Error("Access token is missing");
            }

            await api.put(
                "/api/admin/hideContent",
                { contentId, type: "blog" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Remove the hidden blog from the state
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.bid !== contentId));
        } catch (error: any) {
            console.error("Error hiding blog:", error);
            alert(error.response?.data?.message || "Error hiding blog");
        }
    };

    if (loading) {
        return <p className="text-center text-white">Loading Blogs...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 text-white">
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
                            <div className="flex justify-end mt-4 items-center">
                                <h3 className="text-2xl font-bold mr-4">
                                    Reports: {blog.reports ? blog.reports.length : 0}
                                </h3>
                                <button
                                    onClick={() => handleHideContent(blog.bid)}
                                    className="bg-red-500 py-2 px-4 rounded hover:bg-red-700"
                                >
                                    Hide Blog
                                </button>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageBlogs;
