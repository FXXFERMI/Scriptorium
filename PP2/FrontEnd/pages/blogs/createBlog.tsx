import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Cookies from "js-cookie";

const createBlog = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [codeTemplateIds, setCodeTemplateIds] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("accessToken");
      setIsLoggedIn(!!token);
      setLoading(false); // Set loading to false after check
    };

    checkAuth(); // Initial check on mount
  }, []);

  useEffect(() => {
    // Redirect to login if user is not logged in after auth check completes
    if (!loading && !isLoggedIn) {
      router.push({
        pathname: "/users/login",
        query: { returnUrl: router.asPath },
      });
    }
  }, [loading, isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error on new submission

    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        console.error("Access token is missing");
        return;
      }

      // Parse codeTemplateIds to a number array
      const codeTemplateIdsArray = codeTemplateIds
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter(Boolean);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs`,
        {
          title,
          description,
          tags: JSON.stringify(tags.split(",")),
          codeTemplateIds: codeTemplateIdsArray || [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        router.push(`/blogs/blog?id=${response.data.bid}`); // Redirect to blog listing
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to create blog");
    }
  };
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Create a New Blog Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">
              Code Template IDs (comma-separated)
            </label>
            <input
              type="text"
              value={codeTemplateIds}
              onChange={(e) => setCodeTemplateIds(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Create Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default createBlog;
