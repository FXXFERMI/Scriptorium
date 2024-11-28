import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/router";
// import Header from '../../components/Header';
// import Footer from '../../components/Footer';
import Link from "next/link";
import Cookies from "js-cookie";
import CreateBlogButton from "../../components/blogs/CreateBlogButton";
import BlogMenu from "../../components/blogs/BlogMenu";
import Pagination from "../../components/pagination"
import { useTheme } from "../../contexts/ThemeContext";
import Head from "next/head";
import { NextSeo } from "next-seo";

interface Blog {
  bid: number;
  title: string;
  description: string;
  tags: Array<{ tagId: number; name: string }>;
  Hidden: boolean;
}

const MyBlogs: React.FC = () => {
  const { theme } = useTheme();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Pagination variables
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  // const itemsPerPage = 5;


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

        // Make API request to fetch blogs for the logged-in user with pagination
        const response = await api.get("/api/Blogs/currUsersBlogs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            // limit: itemsPerPage,
          },
        });
        // console.log(response.data);
        // const response = await api.get("/api/Blogs/currUsersBlogs", {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     page: currentPage,
        //   },
        // });

        // setBlogs(response.data);
        setBlogs(response.data.blogs);
        // console.log(response.data.blogs[0].Hidden);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalBlogs);
      } catch (err: any) {
        //console.error("Error fetching blogs:", err);
        setError(err.response?.data?.error || "Error fetching blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [isLoggedIn, currentPage]);

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleViewBlog = (bid: number) => {
    router.push(`/blogs/blog?id=${bid}`)
  };

  return (
    <div className={`text-${theme === "dark" ? "black" : "white"} bg-${theme === "dark" ? "black" : "white"}`}>
      <NextSeo
        title="My Blogs - SFJ Scriptorium"
        description="View and manage your blogs on SFJ Scriptorium."
        canonical={`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/myBlogs`}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/myBlogs`,
        }}
      />
      <Head>
        <title>My Blogs - SFJ Scriptorium</title>
        <link rel="icon" href={theme === "dark" ? "/favicon.png" : "/logo_light.PNG"} />
      </Head>
      <main className="container max-w-screen-lg mx-auto mt-10 p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-${theme === "dark" ? "white" : "black"} text-4xl font-bold`}>My Blogs</h1>
          <CreateBlogButton />
        </div>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : blogs.length > 0 ? (
          <div className={`space-y-6`}>
            {blogs.map((blog) => (
              <div
                key={blog.bid}
                className={`bg-${theme === "dark" ? "gray-800" : "gray-200"} p-6 shadow-md flex justify-between border border-gray-700 text-white rounded-lg hover:shadow-lg transition-transform transform hover:scale-105`}
              >
                <div>
                  <h2
                    className="text-2xl font-bold mb-2 cursor-pointer transition hover:text-blue-400"
                    onClick={() => handleViewBlog(blog.bid)}
                  >
                    {blog.title}
                  </h2>
                  <p className={`text-sm text-${theme === "dark" ? "gray-300" : "gray-600"}`}>
                    Tags: {blog.tags.map((tag) => tag.name).join(", ")}
                  </p>
                  {blog.Hidden && (
                    <p className="text-red-500 font-semibold mt-2 bg-gray-700 px-2 py-1 rounded-md w-max">
                      Hidden
                    </p>
                  )}
                </div>
                <BlogMenu
                  bid={blog.bid}
                  hidden={blog.Hidden}
                  onSuccess={() => setBlogs((prev) => prev.filter((b) => b.bid !== blog.bid))}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No blogs found.</p>
        )}
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={10}
        />
      </main>
    </div>
  );
};

export default MyBlogs;
