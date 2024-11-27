import React from "react";
import Link from "next/link";
import AdminHeader from "../../components/admin/adminHeader";
const AdminDashboard: React.FC = () => {
    return (
        <div className="text-black bg-black">
            <AdminHeader />
            <section className="mx-auto p-6 text-white mt-[15rem] md:mt-[10rem] lg:mt-[10rem]">
                <h1 className="text-4xl font-bold text-center mb-12">Admin Dashboard</h1>
                <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
                    <a
                        className="bg-blue-600 p-8 text-center rounded-lg hover:bg-blue-700"
                        href="/admin/manageBlogs"
                    >
                        <h2 className="text-2xl font-bold">Manage Blogs</h2>
                    </a>

                    <a
                        className="bg-green-600 p-8 text-center rounded-lg hover:bg-green-700"
                        href="/admin/manageComments"
                    >
                        <h2 className="text-2xl font-bold">Manage Comments</h2>
                    </a>

                    <a
                        className="bg-purple-600 p-8 text-center rounded-lg hover:bg-purple-700"
                        href="/admin/manageReplies"
                    >
                        <h2 className="text-2xl font-bold">Manage Replies</h2>
                    </a>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;



// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import api from "../../utils/axiosInstance";
// import Link from "next/link";
// import Cookies from "js-cookie";


// const AdminDashboard: React.FC = () => {
//     const router = useRouter();
//     const [blogs, setBlogs] = useState([]);
//     const [comments, setComments] = useState([]);
//     const [replies, setReplies] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const token = Cookies.get("accessToken");
//                 if (!token) {
//                     throw new Error("Access token is missing");
//                 }

//                 const blogResponse = await api.get("/api/Blogs/sortByReports", {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 console.log("blog response", blogResponse.data);

//                 const commentResponse = await api.get("/api/comments/sortByReports", {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 console.log("comment response", commentResponse.data.comments);

//                 const replyResponse = await api.get("/api/replies/sortByReports", {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 console.log("reply response", replyResponse.data.replies);

//                 setBlogs(blogResponse.data);
//                 setComments(commentResponse.data.comments);
//                 setReplies(replyResponse.data.replies);
//             } catch (error: any) {
//                 //console.error("Error fetching admin data:", error);
//                 setError(error.response?.data?.message || "Error fetching admin data");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     const handleHideContent = async (contentId: number, type: "blog" | "comment" | "reply") => {
//         try {
//             const token = Cookies.get("accessToken");
//             if (!token) {
//                 throw new Error("Access token is missing");
//             }

//             await api.put(
//                 "/api/admin/hideContent",
//                 { contentId, type },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             // Refresh data after hiding content
//             setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.bid !== contentId));
//             setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== contentId));
//             setReplies((prevReplies) => prevReplies.filter((reply) => reply.replyId !== contentId));
//         } catch (error: any) {
//             //console.error("Error hiding content:", error);
//             alert(error.response?.data?.message || "Error hiding content");
//         }
//     };

//     if (loading) {
//         return <p className="text-center text-white">Loading Admin Dashboard...</p>;
//     }

//     if (error) {
//         return <p className="text-center text-red-500">{error}</p>;
//     }

//     return (
//         <div className="max-w-7xl mx-auto p-6 text-white">
//             <h1 className="text-4xl font-bold text-center mb-12">Admin Dashboard</h1>

//             {/* Manage Blogs Section */}
//             <section className="mb-12">
//                 <h2 className="text-3xl font-semibold mb-6">Manage Blogs</h2>
//                 <div className="space-y-4">
//                     {blogs.map((blog) => (
//                         <div key={blog.bid} className="bg-gray-800 p-6 rounded-lg">
//                             <h3 className="text-2xl font-bold">{blog.title}</h3>
//                             <p className="text-sm text-gray-400 mb-2">
//                                 By: {blog.user?.profile?.firstName} {blog.user?.profile?.lastName}
//                             </p>
//                             <p className="text-gray-300">
//                                 {blog.description ? `${blog.description.slice(0, 150)}...` : "No description available"}
//                             </p>
//                             <div className="flex justify-end mt-4">
//                                 <button
//                                     onClick={() => handleHideContent(blog.bid, "blog")}
//                                     className="bg-red-500 py-2 px-4 rounded hover:bg-red-700"
//                                 >
//                                     Hide Blog
//                                 </button>
//                             </div>
//                         </div>
//                     ))}

//                 </div>
//             </section>

//             {/* Manage Comments Section */}
//             <section className="mb-12">
//                 <h2 className="text-3xl font-semibold mb-6">Manage Comments</h2>
//                 <div className="space-y-4">
//                     {comments.map((comment) => (
//                         <div key={comment.commentId} className="bg-gray-800 p-6 rounded-lg">
//                             <p className="text-gray-300">
//                                 {comment.content ? `${comment.content.slice(0, 150)}...` : "No comment available"}
//                             </p>
//                             <div className="flex justify-end mt-4">
//                                 <button
//                                     onClick={() => handleHideContent(comment.commentId, "comment")}
//                                     className="bg-red-500 py-2 px-4 rounded hover:bg-red-700"
//                                 >
//                                     Hide Comment
//                                 </button>
//                             </div>
//                         </div>
//                     ))}

//                 </div>
//             </section>

//             {/* Manage Replies Section */}
//             <section>
//                 <h2 className="text-3xl font-semibold mb-6">Manage Replies</h2>
//                 <div className="space-y-4">
//                     {replies.map((reply) => (
//                         <div key={reply.replyId} className="bg-gray-800 p-6 rounded-lg">
//                             <p className="text-gray-300">
//                                 {reply.content ? `${reply.content.slice(0, 150)}...` : "No reply available"}
//                             </p>
//                             <div className="flex justify-end mt-4">
//                                 <button
//                                     onClick={() => handleHideContent(reply.replyId, "reply")}
//                                     className="bg-red-500 py-2 px-4 rounded hover:bg-red-700"
//                                 >
//                                     Hide Reply
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default AdminDashboard;
