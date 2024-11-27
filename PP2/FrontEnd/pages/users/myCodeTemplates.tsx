import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
// import Header from '../../components/Header';
// import Footer from '../../components/Footer';
import Link from "next/link";
import Cookies from "js-cookie";
import Pagination from "../../components/pagination";
import CodeTemplateMenu from "../../components/codeTemplates/CodeTemplatesMenu";
import CreateCodeTemplateButton from "../../components/codeTemplates/CreateCodeTemplatsButton";

interface CodeTemplate {
  cid: number;
  title: string;
  tags: Array<{ tagId: number; name: string }>;
  code: string;
  language: string;
  isForked: boolean;
}

const MyCodeTemplates: React.FC = () => {
  const [codeTemplates, setCodeTemplates] = useState<CodeTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalTemplates, setTotalTemplates] = useState<number>(0);
  const { isLoggedIn } = useAuth();
  const [filter, setFilter] = useState({
    title: "",
    language: "",
    tags: "",
    code: "",
  });

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
        // Make API request to fetch code templates for the logged-in user with pagination and filters
        const response = await api.get(
          "/api/CodeTemplates/currUsersTemplates",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: currentPage,
              limit: 10,
              title: filter.title,
              language: filter.language,
              tags: filter.tags && JSON.stringify(filter.tags.split(", ")),
              code: filter.code,
            },
          }
        );

        setCodeTemplates(response.data.codeTemplates);
        setTotalPages(response.data.totalPages);
        setTotalTemplates(response.data.totalTemplates);
      } catch (err: any) {
        //console.error("Error fetching code templates:", err);
        setError(err.response?.data?.error || "Error fetching code templates");
      } finally {
        setLoading(false);
      }
    };

    fetchCodeTemplates();
  }, [isLoggedIn, currentPage, filter]);

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      {/* <Header /> */}
      <main className="container max-w-screen-lg mx-auto mt-10 p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl text-white font-bold">My Code Templates</h1>
          <CreateCodeTemplateButton />
        </div>

        {/* Filter Inputs */}
        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            name="title"
            placeholder="Filter by title"
            value={filter.title}
            onChange={handleFilterChange}
            className="p-2 bg-gray-800 border border-gray-600 rounded-md text-white"
          />
          <input
            type="text"
            name="language"
            placeholder="Filter by language"
            value={filter.language}
            onChange={handleFilterChange}
            className="p-2 bg-gray-800 border border-gray-600 rounded-md text-white"
          />
          <input
            type="text"
            name="tags"
            placeholder="Filter by tags (comma separated)"
            value={filter.tags}
            onChange={handleFilterChange}
            className="p-2 bg-gray-800 border border-gray-600 rounded-md text-white"
          />
          <input
            type="text"
            name="code"
            placeholder="Filter by code content"
            value={filter.code}
            onChange={handleFilterChange}
            className="p-2 bg-gray-800 border border-gray-600 rounded-md text-white"
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : codeTemplates.length > 0 ? (
          <div className="space-y-6">
            {codeTemplates.map((template) => (
              <div
                key={template.cid}
                className="bg-black p-6 shadow-md flex justify-between border border-white text-white"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2 cursor-pointer transition hover:bg-gray-300 hover:shadow-lg hover:scale-105">
                    {template.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Tags: {template.tags.map((tag) => tag.name).join(", ")}
                  </p>
                  {template.isForked && (
                    <p className="text-blue-500 font-bold mt-2">Forked</p>
                  )}
                </div>
                <CodeTemplateMenu
                  cid={template.cid}
                  onDelete={() =>
                    setCodeTemplates((prev) =>
                      prev.filter((t) => t.cid !== template.cid)
                    )
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No code templates found.</p>
        )}

        {/* Pagination Controls */}
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalTemplates}
          itemsPerPage={10}
        />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default MyCodeTemplates;
