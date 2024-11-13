// https://tailwindui.com/components/marketing/sections/blog-sections
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Navbar from "../../components/Navbar";

export default function Example() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string>(""); // Error state
  const router = useRouter();
  const [filter, setFilter] = useState({
    title: "",
    description: "",
    tags: "",
  }); // Filter state
  const [sort, setSort] = useState(""); // Sort state (by rating)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          console.error("Access token is missing");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs`,
          {
            params: filter, // Pass filter state as query parameters
          }
        );
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load the blog.");
        setLoading(false);
      }
    };

    const fetchSortedBlogs = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          console.error("Access token is missing");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs/sortByRatings`,
          {
            params: filter, // Pass filter state as query parameters
          }
        );
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load the blog.");
        setLoading(false);
      }
    };

    if (sort === "rating_desc") {
      fetchSortedBlogs();
    } else {
      fetchBlogs();
    }
  }, [filter, sort]);

  const handleClick = (bid) => {
    router.push({
      pathname: `/blogs/blog`,
      query: { id: bid, returnUrl: router.asPath },
    });
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // Handle sorting changes
  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  return (
    <>
      <Navbar />
      <div className="bg-white py-24 sm:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Blogs
            </h2>
          </div>
          {/* Filters Section */}
          <div className="mt-8">
            <div className="flex space-x-4">
              <input
                type="text"
                name="title"
                placeholder="Search by title"
                value={filter.title}
                onChange={handleFilterChange}
                className="border p-2"
              />
              <input
                type="text"
                name="description"
                placeholder="Search by description"
                value={filter.description}
                onChange={handleFilterChange}
                className="border p-2"
              />
              <input
                type="text"
                name="tags"
                placeholder="Search by tags"
                value={filter.tags}
                onChange={handleFilterChange}
                className="border p-2"
              />
              {/* Sort by ratings */}
              <select
                name="sortBy"
                value={sort}
                onChange={handleSortChange}
                className="border p-2"
              >
                <option value="default">Sort by default</option>
                <option value="rating_desc">Sort by rating (descending)</option>
              </select>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>{error}</div>
            ) : (
              posts.map((post) => (
                <article
                  key={post.bid}
                  className="flex max-w-xl flex-col items-start justify-between"
                >
                  <div className="flex items-center gap-x-4 text-xs">
                    {/* <time dateTime={post.datetime} className="text-gray-500">
                  {post.date}
                </time> */}
                    {post.tags && post.tags.length > 0 ? (
                      JSON.parse(post.tags).map(
                        (tag: string, index: number) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm ml-2 mr-2 mb-2"
                          >
                            {tag}
                          </span>
                        )
                      )
                    ) : (
                      <span className="text-gray-500"></span>
                    )}
                  </div>
                  <div className="group relative ">
                    <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                      <button
                        onClick={() => {
                          handleClick(post.bid);
                        }}
                        className="relative"
                      >
                        <span className="absolute inset-0" />
                        {post.title}
                      </button>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">
                      {post.description}
                    </p>
                  </div>
                  <div className="relative mt-8 flex items-center gap-x-4">
                    <img
                      alt=""
                      src={
                        post.user.profile.avatar.startsWith("/uploads/")
                          ? `${process.env.NEXT_PUBLIC_API_URL}${post.user.profile.avatar}`
                          : post.user.profile.avatar
                      }
                      className="h-10 w-10 rounded-full bg-gray-50"
                    />
                    <div className="text-sm/6">
                      <p className="font-semibold text-gray-900">
                        <a>
                          <span className="absolute inset-0" />
                          {post.user.profile.firstName}{" "}
                          {post.user.profile.lastName}
                        </a>
                      </p>
                      <p className="text-gray-600">{post.user.username}</p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
