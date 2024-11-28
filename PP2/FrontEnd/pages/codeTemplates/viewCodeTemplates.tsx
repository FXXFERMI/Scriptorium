// https://tailwindui.com/components/marketing/sections/blog-sections
import axios, { AxiosRequestConfig } from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Header from "../../components/Header";
import Pagination from "../../components/pagination";
import api from "../../utils/axiosInstance";
import CreateCodeTemplateButton from "../../components/codeTemplates/CreateCodeTemplatsButton"; // Import the button component
import { useTheme } from "../../contexts/ThemeContext";

export default function ViewCodeTemplates() {
    const { theme } = useTheme();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string>(""); // Error state
    const router = useRouter();
    const [filter, setFilter] = useState({
        title: "",
        language: "",
        tags: "",
        code: "",
    }); // Filter state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTemplates, setTotalTemplates] = useState(0);


    useEffect(() => {
        const fetchCodeTemplates = async () => {
            try {
                const token = Cookies.get("accessToken");

                // Base configuration
                const config: AxiosRequestConfig = {
                    params: {
                        title: filter.title,
                        language: filter.language,
                        tags: filter.tags && JSON.stringify(filter.tags.split(", ")),
                        page: page,
                        code: filter.code,
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
                    `${process.env.NEXT_PUBLIC_API_URL}/api/CodeTemplates`,
                    config
                );

                setTemplates(response.data.codeTemplates);
                // console.log(response.data);
                setTotalTemplates(response.data.totalTemplates);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            } catch (err) {
                setError("Failed to load the code templates.");
                setLoading(false);
            }
        };

        if (filter.title !== null) {
            fetchCodeTemplates();
        }

        // Update URL parameters based on state
        if (router.isReady) {
            router.push({
                pathname: "/codeTemplates/viewCodeTemplates",
                query: {
                    title: filter.title,
                    language: filter.language,
                    tags: filter.tags,
                    page,
                    code: filter.code,
                },
            });
        }
    }, [filter, page]);

    const handleClick = (cid) => {
        router.push({
            pathname: `/execution/`,
            query: { id: cid, returnUrl: router.asPath },
        });
    };

    // Handle filter changes
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilter((prev) => ({ ...prev, [name]: value }));
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    return (
        <>
            <Header />
            <div className={`bg-${theme === "dark" ? "black" : "white"} mt-20 py-24 sm:py-12`}>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-2 space-y-4 sm:space-y-0">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h2 className={`text-pretty text-4xl font-semibold tracking-tight text-${theme === "dark" ? "white" : "black"}`}>
                                Code Templates
                            </h2>
                        </div>
                        {/* Added Create Code Template Button here */}
                        <div className="flex-shrink-0">
                            <CreateCodeTemplateButton />
                        </div>
                    </div>
                    {/* Filters Section */}
                    <div className="mt-8">
                        <div className="flex flex-wrap gap-x-4 gap-y-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Search by title"
                                value={filter.title}
                                onChange={handleFilterChange}
                                className={`basis-64 p-2 bg-${theme === "dark" ? "gray-900" : "gray-200"} border border-gray-600 rounded-md text-${theme === "dark" ? "gray-300" : "gray-700"}`}
                            />
                            <input
                                type="text"
                                name="language"
                                placeholder="Search by language"
                                value={filter.language}
                                onChange={handleFilterChange}
                                className={`basis-64 p-2 bg-${theme === "dark" ? "gray-900" : "gray-200"} border border-gray-600 rounded-md text-${theme === "dark" ? "gray-300" : "gray-700"}`}
                            />
                            <input
                                type="text"
                                name="tags"
                                placeholder="Search by tags"
                                value={filter.tags}
                                onChange={handleFilterChange}
                                className={`basis-64 p-2 bg-${theme === "dark" ? "gray-900" : "gray-200"} border border-gray-600 rounded-md text-${theme === "dark" ? "gray-300" : "gray-700"}`}
                            />

                            <input
                                type="text"
                                name="code"
                                placeholder="Search by code content"
                                value={filter.code}
                                onChange={handleFilterChange}
                                className={`basis-64 p-2 bg-${theme === "dark" ? "gray-900" : "gray-200"} border border-gray-600 rounded-md text-${theme === "dark" ? "gray-300" : "gray-700"}`}
                            />
                        </div>
                    </div>

                    <div className="mx-auto mt-3 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 pt-3 sm:mt-3 sm:pt-3 lg:mx-0 lg:max-w-none lg:grid-cols-3 mb-6 pb-4">
                        {loading ? (
                            <div className={`text-${theme === "dark" ? "white" : "black"}`}>Loading...</div>
                        ) : error ? (
                            <div className={`text-${theme === "dark" ? "white" : "black"}`}>{error}</div>
                        ) : templates.length > 0 ? (
                            templates.map((template) => (
                                <article
                                    key={template.cid}
                                    className={`flex max-w-xl flex-col items-start justify-between border border-gray-600 rounded-md p-5 bg-${theme === "dark" ? "gray-900" : "gray-100"}`}
                                >
                                    <div className="flex flex-wrap items-center gap-x-4 text-xs ">
                                        {template.tags && template.tags.length > 0 ? (
                                            template.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm ml-2 mr-2 mb-2"
                                                >
                                                    {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                                                </span>
                                            ))
                                        ) : (
                                            <span className={`text-${theme === "dark" ? "gray-500" : "gray-700"}`}></span>
                                        )}
                                    </div>
                                    <div className="group relative ">
                                    <h3 className={`mt-3 text-lg/6 font-semibold text-${theme === "dark" ? "gray-100" : "gray-800"} group-hover:text-gray-600`}>
                                    <button
                                                onClick={() => {
                                                    handleClick(template.cid);
                                                }}
                                                className="relative"
                                            >
                                                <span className="absolute inset-0" />
                                                {template.title}
                                            </button>
                                        </h3>
                                        {template.isForked && (
                                            <p className="bg-blue-300 text-blue-800 py-1 px-2 rounded-full max-w-[60px] text-xs ml-2 mr-2 mb-2 mt-2">
                                                Forked
                                            </p>
                                        )}
                                        <p className={`mt-5 line-clamp-3 text-sm/6 text-${theme === "dark" ? "gray-200" : "gray-700"}`}>
                                        {template.explanation}
                                        </p>
                                    </div>
                                    <div className="relative mt-8 flex items-center gap-x-4">
                                        <img
                                            alt=""
                                            src={
                                                template.user.profile.avatar.startsWith("/uploads/")
                                                    ? `${process.env.NEXT_PUBLIC_API_URL}${template.user.profile.avatar}`
                                                    : template.user.profile.avatar
                                            }
                                            className="h-10 w-10 rounded-full bg-gray-50"
                                        />
                                        <div className="text-sm/6">
                                        <p className={`font-semibold text-${theme === "dark" ? "gray-200" : "gray-800"}`}>
                                        <a>
                                                    <span className="absolute inset-0" />
                                                    {template.user.profile.firstName} {template.user.profile.lastName}
                                                </a>
                                            </p>
                                            <p className={`text-${theme === "dark" ? "gray-200" : "gray-700"}`}>@{template.user.username}</p>
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className={`text-${theme === "dark" ? "white" : "black"} mb-6 pb-4`}>No code templates available</div>
                        )}
                    </div>
                    {/* Pagination Controls */}
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        totalItems={totalTemplates}
                        itemsPerPage={10}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </>
    );
}
