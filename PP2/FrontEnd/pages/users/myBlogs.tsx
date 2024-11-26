import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
// import Header from '../../components/Header';
// import Footer from '../../components/Footer';
import Link from "next/link";
import Cookies from "js-cookie";
import CreateBlogButton from "../../components/CreateBlogButton";
import BlogMenu from "../../components/BlogMenu"; // Import the new combined component

interface Blog {
  bid: number;
  title: string;
  description: string;
  tags: Array<{ tagId: number; name: string }>;
  hidden: boolean;
}

const MyBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const fetchBlogs = async () => {
      try {
        setLoading(true);

        // Get the access token from cookies
        const token = Cookies.get("accessToken");
        if (!token) {
          throw new Error("Access token is missing");
        }

        // Make API request to fetch code templates for the logged-in user
        const response = await api.get("/api/Blogs/currUsersBlogs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBlogs(response.data);
      } catch (err: any) {
        console.error("Error fetching blogs:", err);
        setError(err.response?.data?.error || "Error fetching blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-3xl font-bold">Please log in to view your blogs</h2>
        <Link
          href="/users/login"
          className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* <Header /> */}
      <main className="max-w-4xl mx-auto mt-10 p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Blogs</h1>
          <CreateBlogButton />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-gray-700">No blogs found.</p>
        ) : blogs.length > 0 ? (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div key={blog.bid} className="bg-white p-6 shadow-md flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                  <p className="text-sm text-gray-500">
                    Tags: {blog.tags.map((tag) => tag.name).join(", ")}
                  </p>
                  {blog.hidden && (
                    <p className="text-red-500 font-bold mt-2">Hidden</p>
                  )}
                </div>
                <BlogMenu bid={blog.bid} onSuccess={() => setBlogs((prev) => prev.filter((b) => b.bid !== blog.bid))} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No blogs found.</p>
        )}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default MyBlogs;
