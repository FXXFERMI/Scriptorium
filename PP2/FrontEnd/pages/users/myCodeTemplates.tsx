import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
// import Header from '../../components/Header';
// import Footer from '../../components/Footer';
import Link from "next/link";
import Cookies from "js-cookie";

interface CodeTemplate {
  cid: number;
  title: string;
  tags: Array<{ tagId: number; name: string }>;
  code: string;
  language: string;
}

const MyCodeTemplates: React.FC = () => {
  const [codeTemplates, setCodeTemplates] = useState<CodeTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const fetchCodeTemplates = async () => {
      try {
        setLoading(true);

        // Get the access token from cookies
        const token = Cookies.get("accessToken");
        if (!token) {
          throw new Error("Access token is missing");
        }

        // Make API request to fetch code templates for the logged-in user
        const response = await api.get(
          "/api/CodeTemplates/currUsersTemplates",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCodeTemplates(response.data);
      } catch (err: any) {
        console.error("Error fetching code templates:", err);
        setError(err.response?.data?.error || "Error fetching code templates");
      } finally {
        setLoading(false);
      }
    };

    fetchCodeTemplates();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-3xl font-bold">
          Please log in to view your code templates
        </h2>
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
        <h1 className="text-4xl font-bold mb-8">My Code Templates</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : codeTemplates.length > 0 ? (
          <div className="space-y-6">
            {codeTemplates.map((template) => (
              <div key={template.cid} className="bg-white p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-2">{template.title}</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Language: {template.language}
                </p>
                <p className="text-gray-700 mb-4">
                  Tags: {template.tags.map((tag) => tag.name).join(", ")}
                </p>
                {/* <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                  <code>{template.code}</code>
                </pre> */}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No code templates found.</p>
        )}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default MyCodeTemplates;
