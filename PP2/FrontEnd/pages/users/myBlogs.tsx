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
        // console.log(response.data);
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
    <div>
      {/* <Header /> */}
      <main className="container max-w-screen-lg mx-auto mt-10 p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl text-white font-bold">My Blogs</h1>
          <CreateBlogButton />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-gray-700">No blogs found.</p>
        ) : blogs.length > 0 ? (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div key={blog.bid}
                className="bg-black p-6 shadow-md flex justify-between border border-white text-white"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2 cursor-pointer transition hover:bg-gray-300 hover:shadow-lg hover:scale-105"
                    onClick={() => handleViewBlog(blog.bid)}>
                    {blog.title}
                  </h2>
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
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={10}
        />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default MyBlogs;
