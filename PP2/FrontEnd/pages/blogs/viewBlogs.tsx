// https://tailwindui.com/components/marketing/sections/blog-sections
import axios, { AxiosRequestConfig } from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Header from "../../components/Header";
import Pagination from "../../components/pagination";
import CreateBlogButton from "../../components/blogs/CreateBlogButton";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";

export default function Example() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string>(""); // Error state
  const router = useRouter();
  const [filter, setFilter] = useState({
    title: null,
    description: "",
    tags: "",
  }); // Filter state
  const [sort, setSort] = useState("default"); // Sort state (by rating)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [blogsUpdate, setBlogsUpdate] = useState(false);
  const [codeTemplates, setCodeTemplates] = useState([]);
  const [selectedCodeTemplates, setSelectedCodeTemplates] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [templatesLimit, setTemplatesLimit] = useState(10);
  const { isLoggedIn, logout, login } = useAuth();
  const lightMode = false;

  useEffect(() => {
    if (router.isReady && filter.title === null) {
      let filter: {
        title: string;
        description: string;
        tags: string;
      } = { title: "", description: "", tags: "" };

      if (router.query.title) {
        filter.title = Array.isArray(router.query.title)
          ? router.query.title.join(", ") // Join array into a single string
          : router.query.title; // Directly assign if it's a string
      }
      if (router.query.description) {
        filter.description = Array.isArray(router.query.description)
          ? router.query.description.join(", ") // Join array elements if it's an array
          : router.query.description; // Assign directly if it's a string
      }
      if (router.query.tags) {
        filter.tags = Array.isArray(router.query.tags)
          ? router.query.tags.join(", ") // Combine array elements into a string
          : router.query.tags; // Assign directly if it's a string
      }
      if (router.query.page) {
        setPage(Number(router.query.page));
      } else {
        setPage(1);
      }
      if (router.query.codeTemplates) {
        if (Array.isArray(router.query.codeTemplates)) {
          setSelectedCodeTemplates(router.query.codeTemplates);
        } else {
          setSelectedCodeTemplates(JSON.parse(router.query.codeTemplates));
        }
      }
      if (router.query.sort) {
        setSort(
          Array.isArray(router.query.sort)
            ? router.query.sort.join(", ") // Join array into a single string
            : router.query.sort // Directly assign if it's a string
        );
      }

      setFilter(filter);
    }
  }, [router.isReady, router.query]);

  const fetchCodeTemplates = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/CodeTemplates/getUniqueTitles`,
        {
          params: {
            limit: templatesLimit,
            currentPage: 2,
          },
        }
      );

      const codeTemplateTitles = response.data.codeTemplates.map(
        (item) => item.title
      );

      setCodeTemplates(codeTemplateTitles); // Set the fetched templates
      setTotalTemplates(response.data.totalTemplates);
    } catch (error) {
      setError("Failed to fetch code templates");
    }
  };

  useEffect(() => {
    if (filter.title !== null) {
      const fetchBlogs = async () => {
        try {
          const codeTemplateNames = selectedCodeTemplates.map((name) => name);

          const token = Cookies.get("accessToken");

          // Base configuration
          const config: AxiosRequestConfig = {
            params: {
              title: filter.title,
              description: filter.description,
              tags: filter.tags && JSON.stringify(filter.tags.split(", ")),
              codeTemplateNames: JSON.stringify(codeTemplateNames),
              page: page,
            },
            headers: {
              "Content-Type": "application/json",
            },
          };

          // Add Authorization header and withCredentials only if token exists
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.withCredentials = true;
          }

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs`,
            config
          );

          setPosts(response.data.blogs);
          console.log(response.data);
          setTotalBlogs(response.data.totalBlogs);
          setTotalPages(response.data.totalPages);

          setLoading(false);
        } catch (err) {
          setError("Failed to load the blog.");
          setLoading(false);
        }
      };

      const fetchSortedBlogs = async () => {
        try {
          const codeTemplateNames = selectedCodeTemplates.map((name) => name);

          const token = Cookies.get("accessToken");

          // Base configuration
          const config: AxiosRequestConfig = {
            params: {
              title: filter.title,
              description: filter.description,
              tags: filter.tags && JSON.stringify(filter.tags.split(", ")),
              codeTemplateNames: JSON.stringify(codeTemplateNames),
            },
            headers: {
              "Content-Type": "application/json",
            },
          };

          // Add Authorization header and withCredentials only if token exists
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.withCredentials = true;
          }

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs/sortByRatings`,
            config
          );
          setPosts(response.data);
          setLoading(false);
        } catch (err) {
          setError("Failed to load the blog.");
          setLoading(false);
        }
      };

      const fetchSortByReports = async () => {
        try {
          const codeTemplateNames = selectedCodeTemplates.map((name) => name);

          const token = Cookies.get("accessToken");

          // Base configuration
          const config: AxiosRequestConfig = {
            params: {
              title: filter.title,
              description: filter.description,
              tags: filter.tags && JSON.stringify(filter.tags.split(", ")),
              codeTemplateNames: JSON.stringify(codeTemplateNames),
            },
            headers: {
              "Content-Type": "application/json",
            },
          };

          // Add Authorization header and withCredentials only if token exists
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.withCredentials = true;
          }

          const response = await api.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs/sortByReports`,
            config
          );
          setPosts(response.data);
          setLoading(false);
        } catch (err) {
          setError("Failed to load the blog.");
          setLoading(false);
        }
      };

      fetchCodeTemplates();

      if (sort === "rating_desc") {
        fetchSortedBlogs();
      } else if (sort === "default") {
        fetchBlogs();
      } else {
        fetchSortByReports();
      }
    }

    // Update URL parameters based on state
    if (router.isReady) {
      router.push({
        pathname: "/blogs/viewBlogs",
        query: {
          title: filter.title,
          description: filter.description,
          tags: filter.tags,
          codeTemplates: selectedCodeTemplates,
          page,
          sort,
        },
      });
    }
  }, [filter, sort, blogsUpdate, selectedCodeTemplates]);

  const handleClick = (bid) => {
    router.push({
      pathname: `/blogs/blog`,
      query: { id: bid, returnUrl: router.asPath },
    });
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedCodeTemplates((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((templateId) => templateId !== id); // Remove if already selected
      } else {
        return [...prevIds, id]; // Add if not selected
      }
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

  const hanglePageChange = (page: number) => {
    setPage(page);
    setBlogsUpdate((prev) => !prev);
  };

  const displayMoreTemplates = async () => {
    const numDisplay = codeTemplates.length + 10;
    setTemplatesLimit(numDisplay);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/CodeTemplates/getUniqueTitles`,
        {
          params: {
            limit: numDisplay,
          },
        }
      );
      const codeTemplateTitles = response.data.codeTemplates.map(
        (item) => item.title
      );

      setCodeTemplates(codeTemplateTitles);
    } catch (err) {
      setError("Failed to load more replies.");
    }
  };

  const displayLessTemplates = () => {
    setCodeTemplates(codeTemplates.slice(0, 10));
    setTemplatesLimit(10);
  };

  const hasMoreTemplates = totalTemplates > codeTemplates.length;

  return (
    <>
      <Header />
      <div className={` mt-20 py-24 sm:py-12 ${lightMode && "bg-white"}`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between mt-2">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2
                className={`text-pretty text-4xl font-semibold tracking-tight ${
                  lightMode ? "text-black" : "text-white"
                } `}
              >
                Blogs
              </h2>
            </div>
            {isLoggedIn && <CreateBlogButton />}
          </div>
          {/* Filters Section */}
          <div className="mt-8">
            <div className="flex flex-wrap gap-x-4 gap-y-4">
              <input
                type="text"
                name="title"
                placeholder="Search by title"
                value={filter.title === null ? "" : filter.title}
                onChange={handleFilterChange}
                className={`basis-64 p-2  rounded-md text-gray-300 border border-gray-600 text-gray-300 ${
                  !lightMode && "bg-gray-900"
                } `}
              />
              <input
                type="text"
                name="description"
                placeholder="Search by description"
                value={filter.description}
                onChange={handleFilterChange}
                className={`basis-64 p-2  rounded-md text-gray-300 border border-gray-600 text-gray-300 ${
                  !lightMode && "bg-gray-900"
                } `}
              />
              <input
                type="text"
                name="tags"
                placeholder="Search by tags"
                value={filter.tags}
                onChange={handleFilterChange}
                className={`basis-64 p-2  rounded-md text-gray-300 border border-gray-600 text-gray-300 ${
                  !lightMode && "bg-gray-900"
                } `}
              />
              <select
                name="sortBy"
                value={sort}
                onChange={handleSortChange}
                className={`basis-64 p-2  rounded-md text-gray-300 border border-gray-600 text-gray-300 ${
                  !lightMode && "bg-gray-900"
                } `}
              >
                <option value="default">Sort by default</option>
                <option value="rating_desc">Sort by rating (descending)</option>
              </select>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center justify-between w-full py-4 text-left ${
                lightMode ? "text-black" : "text-white"
              }`}
            >
              <span className={`text-lg font-medium `}>
                Filter By Code Templates
              </span>
              {filterOpen ? (
                <span className="text-lg font-medium "> - </span>
              ) : (
                <span className="text-lg font-medium "> + </span>
              )}
            </button>

            {filterOpen && (
              <div>
                <div className="mb-3">
                  {codeTemplates.map((template, index) => (
                    <div
                      key={index}
                      className={`flex items-center ${
                        lightMode ? "text-black" : "text-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`template-${template}`}
                        checked={selectedCodeTemplates.includes(template)}
                        onChange={() => handleCheckboxChange(template)}
                        className="mr-2"
                      />
                      <label htmlFor={`template-${template}`} className="">
                        {template}
                      </label>
                    </div>
                  ))}
                </div>
                {hasMoreTemplates ? (
                  <button
                    type="button"
                    onClick={displayMoreTemplates}
                    className="mt-2 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    Show More (
                    {Math.min(10, totalTemplates - codeTemplates.length)} more)
                    v
                  </button>
                ) : (
                  codeTemplates.length !== totalTemplates && (
                    <button
                      type="button"
                      onClick={displayLessTemplates}
                      className="mt-2 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      <>Show Less ^</>
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          <div className="mx-auto mt-3 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 pt-3 sm:mt-3 sm:pt-3 lg:mx-0 lg:max-w-none lg:grid-cols-3 mb-6 pb-4">
            {loading ? (
              <div className={`${lightMode ? "text-black" : "text-white"}`}>
                Loading...
              </div>
            ) : error ? (
              <div className={`${lightMode ? "text-black" : "text-white"}`}>
                {error}
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <article
                  key={post.bid}
                  className={`flex max-w-xl flex-col items-start justify-between  rounded-md p-5  ${
                    lightMode
                      ? "text-black"
                      : "border border-gray-600 bg-gray-900"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-x-4 text-xs ">
                    {post.tags && post.tags.length > 0 ? (
                      post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm ml-2 mr-2 mb-2"
                        >
                          {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500"></span>
                    )}
                  </div>
                  <div className="group relative ">
                    <h3
                      className={`mt-3 text-lg/6 font-semibold  group-hover:text-gray-600 ${
                        lightMode ? "text-black" : "text-gray-100"
                      }`}
                    >
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
                    <p
                      className={`mt-5 line-clamp-3 text-sm/6  ${
                        lightMode ? "text-gray-600" : "text-gray-200"
                      }`}
                    >
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
                      <p
                        className={`font-semibold  ${
                          lightMode ? "text-gray-900" : "text-gray-200"
                        }`}
                      >
                        <a>
                          <span className="absolute inset-0" />
                          {post.user.profile.firstName}{" "}
                          {post.user.profile.lastName}
                        </a>
                      </p>
                      <p
                        className={` ${
                          lightMode ? "text-gray-600" : "text-gray-200"
                        }`}
                      >
                        @{post.user.username}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-white mb-6 pb-4">No blogs available</div>
            )}
          </div>
          {/* Pagination Controls */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalBlogs}
            itemsPerPage={10}
            onPageChange={hanglePageChange}
          />
        </div>
      </div>
    </>
  );
}
