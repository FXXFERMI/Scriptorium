import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../utils/axiosInstance";
import Header from "../../components/Header";
import Cookies from "js-cookie";
import axios from "axios";

interface TaskFormData {
  title: string;
  description: string;
  tags: string[];
  codeTemplateIds: string[];
}

interface Tag {
  tagId: string;
  name: string;
}

const TaskCreation = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    tags: [],
    codeTemplateIds: [],
  });

  const [showTagPicker, setShowTagPicker] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [expandedTags, setExpandedTags] = useState(false);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state
  const [codeTemplates, setCodeTemplates] = useState<any[]>([]); // For storing available code templates
  const [error, setError] = useState("");

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
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/CodeTemplates`
        );
        setCodeTemplates(response.data); // Set the fetched templates
      } catch (error) {
        setError("Failed to fetch code templates");
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Tags`
        );
        setExistingTags(response.data); // Set the fetched templates
      } catch (error) {
        setError("Failed to fetch tags");
      }
    };

    fetchCodeTemplates();
    fetchTags();
  }, [loading, isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error on new submission

    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        console.error("Access token is missing");
        return;
      }

      // Parse codeTemplateIds to a number array
      const codeTemplateIdsArray = formData.codeTemplateIds.map((id) =>
        Number(id)
      );

      console.log(codeTemplateIdsArray);

      const tagsArray = formData.tags.map((name) => name);

      console.log(tagsArray);

      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs`,
        {
          title: formData.title,
          description: formData.description,
          tags: JSON.stringify(formData.tags),
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

  const getSelectedTags = () =>
    formData.tags.map((name) => existingTags.find((tag) => tag.name === name)!);

  const visibleTags = getSelectedTags().slice(0, expandedTags ? undefined : 5);
  const hasMoreTags = getSelectedTags().length > 5;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full text-xl font-normal text-gray-400 mb-4 border-none focus:outline-none"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <textarea
          placeholder="Write a description..."
          className="w-full min-h-24 text-gray-400 mb-6 border-none resize-none focus:outline-none"
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
            >
              <span className="text-gray-500">Select Code Templates</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-2 text-gray-500 hover:bg-gray-50 rounded-md px-3 py-2"
              onClick={() => setShowTagPicker(!showTagPicker)}
            >
              <span className="text-gray-500">Tag</span>
            </button>

            {/* Tag Picker Dropdown */}
            {showTagPicker && (
              <div className="absolute left-0 top-16 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                {/* Create new Tag input */}
                <div className="flex items-center gap-2 p-2 border-b border-gray-100">
                  <input
                    type="text"
                    placeholder="Create new Tag"
                    className="flex-1 px-2 py-1 border border-gray-200 rounded"
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
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    +
                  </button>
                </div>

                {/* Existing Tags */}
                <div className="mt-2 max-h-48 overflow-y-auto">
                  {existingTags.map((tag) => (
                    <button
                      key={tag.tagId}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="w-full text-left px-2 py-1 hover:bg-gray-50 rounded flex items-center gap-2"
                    >
                      <span className="w-3 h-3 rounded-full" />
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskCreation;
