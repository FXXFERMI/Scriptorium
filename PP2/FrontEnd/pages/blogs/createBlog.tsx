import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../utils/axiosInstance";
import Header from "../../components/Header";
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
  const [codeTemplates, setCodeTemplates] = useState<any[]>([]); // For storing available code templates

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

    const fetchCodeTemplates = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/CodeTemplates`
        );
        setCodeTemplates(response.data); // Set the fetched templates
      } catch (error) {
        setError("Failed to fetch code templates");
      }
    };

    fetchCodeTemplates();
  }, [loading, isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error on new submission

    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        //console.error("Access token is missing");
        return;
      }

      // Parse codeTemplateIds to a number array
      const codeTemplateIdsArray = codeTemplateIds
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter(Boolean);

      const response = await api.post(
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
      <Header />
      <div className="container mx-auto p-8 mt-20">
        <h1 className="text-gray-100 text-3xl font-bold mb-6">
          Create a New Blog Post
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-200">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md text-gray-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-200">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md text-gray-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-200">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md text-gray-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-200">
              Code Template (select from available)
            </label>
            <select
              value={codeTemplateIds}
              onChange={(e) => setCodeTemplateIds(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md text-gray-300"
            >
              <option value="">Select a Template</option>
              {codeTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.title}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default createBlog;
