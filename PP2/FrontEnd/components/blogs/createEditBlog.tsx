import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../utils/axiosInstance";
import Cookies from "js-cookie";
import axios from "axios";

interface CreateBlogData {
  title: string;
  description: string;
  tags: string[];
  codeTemplateIds: string[];
}

interface Tag {
  tagId: string;
  name: string;
}

interface PopupProps {
  edit?: boolean;
  bid?: number;
  onClose: () => void;
  onSuccess?: () => void;
  disableRedirect?: boolean;
}

const CreateEditBlog: React.FC<PopupProps> = ({
  edit = false,
  bid,
  onClose,
  onSuccess,
  disableRedirect = false,
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateBlogData>({
    title: "",
    description: "",
    tags: [],
    codeTemplateIds: [],
  });

  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showCodeTemplates, setShowCodeTemplates] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [expandedTags, setExpandedTags] = useState(false);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [codeTemplates, setCodeTemplates] = useState<any[]>([]); // For storing available code templates
  const [error, setError] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingNextPage, setLoadingNextPage] = useState(false); // Check if the next page is loading
  const lightMode = false;

  useEffect(() => {
    const fetchBlog = async (bid: number) => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          console.error("Access token is missing");
          return;
        }

        const response = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs/${bid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const data: CreateBlogData = {
          title: response.data.title,
          description: response.data.description,
          tags: response.data.tags.map((tag) => tag.name),
          codeTemplateIds: [],
        };

        setExistingTags(response.data.tags);
        setSelectedTemplates(
          response.data.codeTemplates.map((template) => Number(template.cid))
        );
        setFormData(data);
      } catch (error) {
        setError("Failed to fetch tags");
      }
    };

    fetchCodeTemplates(1);
    if (edit && bid) {
      fetchBlog(bid);
    }

    setLoading(false);
  }, [loading, router]);

  const fetchCodeTemplates = async (page: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/CodeTemplates`,
        { params: { page, limit: 4 } }
      );

      if (page === 1) {
        setCodeTemplates(response.data.codeTemplates); // Set the first page data
      } else {
        setCodeTemplates((prevTemplates) => [
          ...prevTemplates,
          ...response.data.codeTemplates,
        ]); // Append new templates
        setLoadingNextPage(false);
      }

      setTotalPages(response.data.totalTemplates);
    } catch (error) {
      setError("Failed to fetch code templates");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error on new submission

    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        console.error("Access token is missing");
        return;
      }

      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs`,
        {
          title: formData.title,
          description: formData.description,
          tags: JSON.stringify(formData.tags),
          codeTemplateIds: selectedTemplates || [],
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

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error on new submission

    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        console.error("Access token is missing");
        return;
      }

      const response = await api.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs/${bid}`,
        {
          title: formData.title,
          description: formData.description,
          tags: formData.tags,
          codeTemplateIds: selectedTemplates || [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to edit blog");
    }
  };

  const handleTemplateChange = (id: number) => {
    setSelectedTemplates((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((templateId) => templateId !== id); // Remove if already selected
      } else {
        return [...prevIds, id]; // Add if not selected
      }
    });
  };

  const addTag = (tag: Tag) => {
    if (!formData.tags.includes(tag.name)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag.name],
      });
    }
  };

  const removeTag = (tagName: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((name) => name !== tagName),
    });
  };

  const createNewTag = () => {
    if (newTagInput.trim()) {
      const newTag = {
        tagId: Date.now().toString(),
        name: newTagInput.trim(),
      };
      setExistingTags([...existingTags, newTag]);
      addTag(newTag);
      setNewTagInput("");
    }
  };

  const handleNextPage = () => {
    if (loadingNextPage || currentPage >= totalPages) return;
    setLoadingNextPage(true);
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchCodeTemplates(nextPage);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight ===
      e.currentTarget.scrollTop + e.currentTarget.clientHeight;
    if (bottom) {
      handleNextPage();
    }
  };

  const getSelectedTags = () =>
    formData.tags.map((name) => existingTags.find((tag) => tag.name === name)!);

  const visibleTags = getSelectedTags().slice(0, expandedTags ? undefined : 5);
  const hasMoreTags = getSelectedTags().length > 5;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70"
      style={{ backdropFilter: "blur(5px)" }}
    >
      <div
        className={`max-w-2xl mx-auto p-6  rounded-lg shadow-xl relative z-60 border border-gray-700 ${
          lightMode ? "text-black bg-gray-100" : " bg-gray-800 text-white"
        }`}
      >
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-4">
          {edit ? "Edit Blog" : "Create Blog"}
        </h2>

        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-gray-300  focus:outline-none ${
            lightMode ? "hover:text-black" : " hover:text-white"
          }`}
        >
          <span className="material-icons">close</span>
        </button>
        {edit && loading ? (
          <div className="text-white"> loading... </div>
        ) : (
          <form
            onSubmit={edit ? handleEdit : handleSubmit}
            className={` rounded-lg shadow-sm border border-gray-700 p-4 ${
              lightMode ? "bg-gray-100" : " bg-gray-800"
            }`}
          >
            <input
              type="text"
              placeholder="Title"
              className={` w-full text-xl font-normal text-gray-400 mb-4 border-none focus:outline-none
                ${lightMode ? "bg-gray-100" : " bg-gray-800"}
                `}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <textarea
              placeholder="Write a description..."
              className={`w-full min-h-24 text-gray-400 mb-6 border-none resize-none focus:outline-none ${
                lightMode ? "bg-gray-100" : " bg-gray-800"
              }`}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {/* Selected Labels with Show More/Less */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {visibleTags.map((tag) => (
                  <span
                    key={tag.tagId}
                    className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm ml-2 mr-2 mb-2"
                  >
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => removeTag(tag.name)}
                      className="ml-1 hover:opacity-75"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
              {hasMoreTags && (
                <button
                  type="button"
                  onClick={() => setExpandedTags(!expandedTags)}
                  className="mt-2 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  {expandedTags ? (
                    <>Show Less ^</>
                  ) : (
                    <>Show More ({getSelectedTags().length - 5} more) v</>
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4 relative">
              <div className="flex gap-4">
                <button
                  type="button"
                  className="flex items-center gap-2 text-gray-500 hover:bg-gray-50 rounded-md px-3 py-2"
                  onClick={() => {
                    if (showTagPicker) {
                      setShowTagPicker(!showTagPicker);
                    }
                    setShowCodeTemplates(!showCodeTemplates);
                  }}
                >
                  <span className="text-gray-500">Select Code Templates</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 text-gray-500 hover:bg-gray-50 rounded-md px-3 py-2"
                  onClick={() => {
                    if (showCodeTemplates) {
                      setShowCodeTemplates(!showCodeTemplates);
                    }
                    setShowTagPicker(!showTagPicker);
                  }}
                >
                  <span className="text-gray-500">Tag</span>
                </button>

                {showCodeTemplates && (
                  <div
                    className={`absolute left-0 top-16 w-64 border border-gray-700 rounded-lg shadow-lg p-2 z-10 ${
                      lightMode ? "bg-gray-100" : " bg-gray-800"
                    }`}
                    onScroll={handleScroll}
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    <div className="space-y-2">
                      {codeTemplates.map((template, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            value={template.cid}
                            checked={selectedTemplates.includes(template.cid)}
                            onChange={() => handleTemplateChange(template.cid)}
                            className="w-4 h-4 text-blue-500 border-gray-600 rounded"
                          />
                          <label
                            className={`ml-2 ${
                              lightMode ? "text-gray-600" : " text-white"
                            }`}
                          >
                            <strong>{template.title}</strong>
                            <div className={`text-sm text-gray-400 `}>
                              tags:{" "}
                              {template.tags.map((tag) => tag.name).join(", ")}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tag Picker Dropdown */}
                {showTagPicker && (
                  <div
                    className={`absolute left-0 top-16 w-64 border border-gray-700 rounded-lg shadow-lg p-2 z-10 ${
                      lightMode ? "bg-gray-100" : " bg-gray-800"
                    }`}
                  >
                    {/* Add Tag input */}
                    <div className="flex items-center gap-2 p-2">
                      <input
                        type="text"
                        placeholder="Add Tag"
                        className={`flex-1 px-2 py-1 border border-gray-700 rounded  ${
                          lightMode
                            ? "bg-gray-100 text-black"
                            : " bg-gray-700 text-white"
                        }`}
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            createNewTag();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={createNewTag}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  {edit ? "Edit" : "Create"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateEditBlog;
