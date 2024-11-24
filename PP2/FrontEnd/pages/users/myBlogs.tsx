import React, { useEffect, useState } from 'react';
import api from '../../utils/axiosInstance';
import { useAuth } from '../../contexts/AuthContext';
// import Header from '../../components/Header';
// import Footer from '../../components/Footer';
import Link from 'next/link';
import Cookies from 'js-cookie';

interface Blog {
  bid: number;
  title: string;
  description: string;
  tags: string;
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
        const token = Cookies.get('accessToken');
        if (!token) {
          throw new Error('Access token is missing');
        }

        // Make API request to fetch blogs for the logged-in user
        const response = await api.get('/api/Blogs', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token to the backend
          },
        });

        setBlogs(response.data);
      } catch (err: any) {
        console.error('Error fetching blogs:', err);
        setError(err.response?.data?.error || 'Error fetching blogs');
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
        <Link href="/users/login" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* <Header /> */}
      <main className="max-w-4xl mx-auto mt-10 p-4">
        <h1 className="text-4xl font-bold mb-8">My Blogs</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : blogs.length > 0 ? (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div key={blog.bid} className="bg-white p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                <p className="text-gray-700 mb-4">{blog.description}</p>
                <p className="text-sm text-gray-500">Tags: {blog.tags}</p>
                {blog.hidden && <p className="text-red-500 font-bold mt-2">Hidden</p>}
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
