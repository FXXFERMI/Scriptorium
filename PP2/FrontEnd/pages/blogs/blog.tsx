import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import axios, { AxiosRequestConfig } from "axios";
import Header from "../../components/Header"; // Assuming you have a Navbar component
import { blogType } from "../../interfaces/blog";
import { userProfileType } from "../../interfaces/user";
import Cookies from "js-cookie";
import api from "../../utils/axiosInstance";
import Pagination from "../../components/pagination";
import ReportButton from "../../components/reports/reportButton";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";

// https://tailwindui.com/components/application-ui/navigation/pagination

type ProfileType = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
};

const DisplayBlog = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = router.query; // Get the blog ID from the URL
  const [blog, setBlog] = useState<blogType>(null); // State for storing blog data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string>(""); // Error state
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [newComment, setNewComment] = useState<string>(""); // State for new comment input
  const [commentUpdate, setCommentUpdate] = useState<boolean>(false); // State for new comment input
  const [blogUpdate, setBlogUpdate] = useState<boolean>(false); // State for new comment input
  const [replyingTo, setReplyingTo] = useState<number | null>(null); // State for tracking comment being replied to
  const [replyingToName, setReplyingToName] = useState<string>("");
  const [replyingToCommentIndex, setReplyingToCommentIndex] = useState<
    number | null
  >(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortComment, setSortComment] = useState("default"); // Sort state (by rating)
  const [sortReply, setSortReply] = useState("default"); // Sort state (by rating)
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [commentsFetched, setCommentsFetched] = useState(false);
  const { isLoggedIn, logout, login } = useAuth();

  const lightMode = false;

  const textAreaRef = useRef<HTMLTextAreaElement>(null); // Reference to the textarea
  const blogRef = useRef(null);
  const templatesRef = useRef(null);

  useEffect(() => {
    if (blogRef.current && templatesRef.current) {
      const blogHeight = blogRef.current.offsetHeight;
      templatesRef.current.style.maxHeight = `${blogHeight}px`;
    }
  }, [blog]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("accessToken");

        if (token) {
          const response = await api.get("/api/users/showProfile", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
          setProfile(response.data);
        }
      } catch (error) {
        //console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const token = Cookies.get("accessToken");

        // Base configuration
        const config: AxiosRequestConfig = {
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs/${id}`,
          config
        );
        let blog = response.data;
        console.log(response.data);
        console.log(response);
        setBlog(blog);
        setLoading(false);
      } catch (err) {
        setError("Failed to load the blog.");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, blogUpdate]);

  // Fetch comments based on blog ID and page
  useEffect(() => {
    if (commentsFetched) return;
    const fetchComments = async () => {
      try {
        const token = Cookies.get("accessToken");

        // Base configuration
        const config: AxiosRequestConfig = {
          params: { bid: id, page, limit: 10 },
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments`,
          config
        );
        const { comments, totalComments, totalPages } = response.data;
        setComments(comments);
        setCommentsFetched(true); // Mark comments as fetched
        setTotalPages(totalPages);
        setTotalComments(totalComments);
        // console.log(blog);
      } catch (err) {
        setError("Failed to load comments.");
      }
    };

    const fetchSortedComments = async () => {
      try {
        const token = Cookies.get("accessToken");

        // Base configuration
        const config: AxiosRequestConfig = {
          params: { bid: id, page, limit: 10 },
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments/sortByRatings`,
          config
        );
        setComments(response.data);
        setCommentsFetched(true); // Mark comments as fetched
        setLoading(false);
      } catch (err) {
        setError("Failed to load the comments.");
        setLoading(false);
      }
    };

    const fetchReportSortedComments = async () => {
      try {
        const token = Cookies.get("accessToken");

        // Base configuration
        const config: AxiosRequestConfig = {
          params: { bid: id, page, limit: 10 },
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments/sortByReports`,
          config
        );
        setComments(response.data);
        setCommentsFetched(true); // Mark comments as fetched
        setLoading(false);
      } catch (err) {
        setError("Failed to load the comments.");
        setLoading(false);
      }
    };

    if (blog) {
      if (sortComment === "rating_desc") {
        fetchSortedComments();
      } else if (sortComment === "default") {
        fetchComments();
      } else {
        fetchReportSortedComments();
      }
    }
  }, [blog, page, commentUpdate, sortComment, sortReply]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // empty string

    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        //console.error("Access token is missing");
        return;
      }
      if (replyingTo) {
        const response = await api.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/replies`,
          { commentId: replyingTo, content: newComment },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const updatedComments = [...comments]; // Create a copy of the comments array
        if (
          comments[replyingToCommentIndex].replies &&
          updatedComments[replyingToCommentIndex]._count.replies <=
          comments[replyingToCommentIndex].replies.length
        ) {
          comments[replyingToCommentIndex].replies.push(response.data);
        } else if (
          !comments[replyingToCommentIndex].replies &&
          updatedComments[replyingToCommentIndex]._count.replies == 0
        ) {
          comments[replyingToCommentIndex].replies = [response.data];
        }
      } else {
        const response = await api.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments`,
          { bid: id, content: newComment },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setNewComment(""); // Clear the input after submission
        setCommentUpdate((prev) => !prev);
        setCommentsFetched(false); // Mark comments as not fetched
      }
      setReplyingTo(null);
      setReplyingToCommentIndex(null);
      setReplyingToName("");
      setNewComment(""); // Clear the input after submission
    } catch (err) {
      setError("Failed to add comment.");
    }
  };

  const handleLoadReplies = async (commentId: number, commentIndex: number) => {
    const displayedReplies = comments[commentIndex].replies;
    let numDisplay;
    if (comments[commentIndex].replies) {
      numDisplay = displayedReplies.length + 5;
    } else {
      numDisplay = 5;
    }
    let response;

    if (sortReply === "rating_desc") {
      try {
        const token = Cookies.get("accessToken");

        // Base configuration
        const config: AxiosRequestConfig = {
          params: {
            commentId,
            limit: numDisplay,
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

        response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/replies/sortByRatings`,
          config
        );

        const updatedComments = [...comments]; // Create a copy of the comments array
        updatedComments[commentIndex].replies = response.data;
        setComments(updatedComments);
      } catch (err) {
        setError("Failed to load more replies.");
      }
    } else if (sortReply === "default") {
      try {
        const token = Cookies.get("accessToken");

        // Base configuration
        const config: AxiosRequestConfig = {
          params: {
            commentId,
            limit: numDisplay,
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

        response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/replies`,
          config
        );

        const updatedComments = [...comments]; // Create a copy of the comments array
        updatedComments[commentIndex].replies = response.data.repliesWithVotes;
        setComments(updatedComments);
      } catch (err) {
        setError("Failed to load more replies.");
      }
    } else {
      try {
        const token = Cookies.get("accessToken");

        // Base configuration
        const config: AxiosRequestConfig = {
          params: {
            commentId,
            limit: numDisplay,
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

        response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/replies/sortByReports`,
          config
        );

        const updatedComments = [...comments]; // Create a copy of the comments array
        updatedComments[commentIndex].replies = response.data;
        console.log(updatedComments);
        setComments(updatedComments);
      } catch (err) {
        setError("Failed to load more replies.");
      }
    }
  };

  // Handle clicking on the reply button
  const handleReply = (
    commentIndex: number,
    commentId: number,
    username: string
  ) => {
    setReplyingTo(commentId); // Set the comment being replied to
    setReplyingToName(`@${username} `);
    setReplyingToCommentIndex(commentIndex);
    setNewComment(`@${username} `); // Set the reply format
    if (textAreaRef.current) {
      textAreaRef.current.focus(); // Focus the textarea
    }
  };

  // Upvote handler for blog
  const handleBlogUpvote = async (bid) => {
    try {
      let upvote;
      let downvote;
      if (blog.hasUpvoted) {
        upvote = false;
        downvote = false;
      } else {
        upvote = true;
        downvote = false;
      }
      const token = Cookies.get("accessToken");
      if (!token) {
        toast.error("Please login to upvote!");
        return;
      }

      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs/${bid}/rate`,
        { upvote, downvote },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setBlogUpdate((prev) => !prev); // Trigger re-fetch of blog
    } catch (err) {
      setError("Failed to upvote.");
    }
  };

  // Downvote handler for blog
  const handleBlogDownvote = async (bid) => {
    try {
      let upvote;
      let downvote;
      if (blog.hasDownvoted) {
        upvote = false;
        downvote = false;
      } else {
        upvote = false;
        downvote = true;
      }

      const token = Cookies.get("accessToken");
      if (!token) {
        toast.error("Please login to downvote!");
        return;
      }
      await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs/${bid}/rate`,
        { upvote, downvote },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setBlogUpdate((prev) => !prev); // Trigger re-fetch of blog
    } catch (err) {
      setError("Failed to downvote.");
    }
  };

  // Upvote handler for comments
  const handleCommentUpvote = async (commentId: number, index: number) => {
    try {
      let upvote;
      let downvote;
      if (comments[index].hasUpvoted) {
        upvote = false;
        downvote = false;
      } else {
        upvote = true;
        downvote = false;
      }
      const token = Cookies.get("accessToken");
      if (!token) {
        toast.error("Please login to upvote!");
        return;
      }
      await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}/rate`,
        { upvote, downvote },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const response = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (sortComment === "rating_desc") {
        const sortedResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments/sortByRatings`,
          {
            params: {
              bid: blog.bid,
              limit: 10,
            },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setComments(sortedResponse.data);
      } else {
        const updatedComments = [...comments]; // Create a copy of the comments array
        updatedComments[index].upvotes = response.data.upvotes;
        updatedComments[index].downvotes = response.data.downvotes;
        updatedComments[index].hasUpvoted = response.data.hasUpvoted;
        updatedComments[index].hasDownvoted = response.data.hasDownvoted;
        setComments(updatedComments);
      }
    } catch (err) {
      setError("Failed to upvote.");
    }
  };

  // Downvote handler for comments
  const handleCommentDownvote = async (commentId: number, index: number) => {
    try {
      let upvote;
      let downvote;
      if (comments[index].hasDownvoted) {
        upvote = false;
        downvote = false;
      } else {
        upvote = false;
        downvote = true;
      }
      const token = Cookies.get("accessToken");
      if (!token) {
        toast.error("Please login to downvote!");
        return;
      }
      await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}/rate`,
        { upvote, downvote },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const response = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (sortComment === "rating_desc") {
        const sortedResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments/sortByRatings`,
          {
            params: {
              bid: blog.bid,
              limit: 10,
            },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setComments(sortedResponse.data);
      } else {
        const updatedComments = [...comments]; // Create a copy of the comments array
        updatedComments[index].upvotes = response.data.upvotes;
        updatedComments[index].downvotes = response.data.downvotes;
        updatedComments[index].hasUpvoted = response.data.hasUpvoted;
        updatedComments[index].hasDownvoted = response.data.hasDownvoted;
        setComments(updatedComments);
      }
    } catch (err) {
      setError("Failed to downvote.");
    }
  };

  // Upvote handler for comments
  const handleReplyUpvote = async (
    replyId: number,
    replyIndex: number,
    commentId: number,
    commentIndex: number
  ) => {
    try {
      let upvote;
      let downvote;
      if (comments[commentIndex].replies[replyIndex].hasUpvoted) {
        upvote = false;
        downvote = false;
      } else {
        upvote = true;
        downvote = false;
      }

      const token = Cookies.get("accessToken");
      if (!token) {
        toast.error("Please login to upvote!");
        return;
      }
      await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/replies/${replyId}/rate`,
        { upvote, downvote },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const response = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/replies/${replyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const updatedComments = [...comments]; // Create a copy of the comments array
      const replyLength = updatedComments[commentIndex].replies.length;
      if (sortReply === "rating_desc") {
        const sortedResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/replies/sortByRatings`,
          {
            params: {
              commentId,
              limit: replyLength,
            },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const updatedComments = [...comments]; // Create a copy of the comments array
        updatedComments[commentIndex].replies = sortedResponse.data;
        console.log(updatedComments);
        setComments(updatedComments);
      } else {
        updatedComments[commentIndex].replies[replyIndex].upvotes =
          response.data.upvotes;
        updatedComments[commentIndex].replies[replyIndex].downvotes =
          response.data.downvotes;
        updatedComments[commentIndex].replies[replyIndex].hasUpvoted =
          response.data.hasUpvoted;
        updatedComments[commentIndex].replies[replyIndex].hasDownvoted =
          response.data.hasDownvoted;
        setComments(updatedComments);
      }
    } catch (err) {
      setError("Failed to upvote.");
    }
  };

  // Downvote handler for comments
  const handleReplyDownvote = async (
    replyId: number,
    replyIndex: number,
    commentId: number,
    commentIndex: number
  ) => {
    try {
      let upvote;
      let downvote;
      if (comments[commentIndex].replies[replyIndex].hasDownvoted) {
        upvote = false;
        downvote = false;
      } else {
        upvote = false;
        downvote = true;
      }

      const token = Cookies.get("accessToken");
      if (!token) {
        toast.error("Please login to downvote!");
        return;
      }
      await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/replies/${replyId}/rate`,
        { upvote, downvote },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const response = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/replies/${replyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const updatedComments = [...comments]; // Create a copy of the comments array
      const replyLength = updatedComments[commentIndex].replies.length;

      if (sortReply === "rating_desc") {
        const sortedResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/replies/sortByRatings`,
          {
            params: {
              commentId,
              limit: replyLength,
            },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const updatedComments = [...comments]; // Create a copy of the comments array
        updatedComments[commentIndex].replies = sortedResponse.data;
        console.log(updatedComments);
        setComments(updatedComments);
      } else {
        updatedComments[commentIndex].replies[replyIndex].upvotes =
          response.data.upvotes;
        updatedComments[commentIndex].replies[replyIndex].downvotes =
          response.data.downvotes;
        updatedComments[commentIndex].replies[replyIndex].hasUpvoted =
          response.data.hasUpvoted;
        updatedComments[commentIndex].replies[replyIndex].hasDownvoted =
          response.data.hasDownvoted;
        setComments(updatedComments);
      }
    } catch (err) {
      setError("Failed to upvote.");
    }
  };

  // Handle sorting changes
  const handleSortCommentChange = (e) => {
    setSortComment(e.target.value);
    setCommentsFetched(false); // Mark comments as not fetched
  };

  const handleSortReplyChange = (e) => {
    setSortReply(e.target.value);
    setCommentsFetched(false); // Mark comments as not fetched
  };

  const removeReplying = () => {
    setReplyingTo(null);
    setReplyingToCommentIndex(null);
    setNewComment("");
  };

  const hanglePageChange = (page: number) => {
    setPage(page);
    setCommentsFetched(false);
  };

  if (loading) return <div>Loading...</div>; // Show loading state

  if (error) return <div className="text-red-500">{error}</div>; // Show error message if failed to fetch

  return (
    <div className={`bg-${theme === 'dark' ? 'black' : 'white'}`}>
      <Header />
      <div
        className={`container mx-auto p-8 mt-20  ${lightMode && "bg-white"}`}
      >
        {blog ? (
          <>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className={`flex-1 bg-${theme === 'dark' ? 'gray-800' : 'gray-100'} p-6 rounded-lg shadow-md`}>
                <h1 className={`text-5xl font-bold text-${theme === 'dark' ? 'white' : 'black'} mb-6`}>
                  {blog.title}
                </h1>
                <div className={`text-${theme === 'dark' ? 'gray-300' : 'gray-700'} flex flex-wrap mb-6`}>
                  tags:
                  {blog.tags && blog.tags.length > 0 ? (
                    blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm ml-2 mr-2 mb-2"
                      >
                        {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                      </span>
                    ))
                  ) : (
                    <span className={`text-${theme === 'dark' ? 'gray-500' : 'gray-400'}`}>No tags available</span>
                  )}
                </div>
                {/* add author section*/}
                <h1 className={`text-${theme === 'dark' ? 'gray-200' : 'gray-800'} text-1.5xl font-bold mb-4`}>
                  {" "}
                  Written by:
                </h1>
                <div className={`text-${theme === 'dark' ? 'gray-200' : 'gray-800'} flex flex-row items-center mb-6`}>
                  <img
                    src={
                      blog.user.profile.avatar.startsWith("/uploads/")
                        ? `${process.env.NEXT_PUBLIC_API_URL}${blog.user.profile.avatar}`
                        : blog.user.profile.avatar
                    }
                    alt="Avatar"
                    className="w-14 h-14 rounded-full"
                  />
                  <div className="flex flex-col ml-4">
                    <h2>
                      {blog.user.profile.firstName} {blog.user.profile.lastName}
                    </h2>
                    <p className={`text-lg text-${theme === 'dark' ? 'gray-300' : 'gray-700'}`}>
                      @{blog.user.username}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-${theme === 'dark' ? 'gray-300' : 'gray-800'} text-lg font-normal`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {blog.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    {/* Upvote button */}
                    <button
                      onClick={() => handleBlogUpvote(blog.bid)}
                      className={`mr-2 ${blog.hasUpvoted
                        ? "text-blue-500 font-bold" // Highlighted when upvoted
                        : `text-${theme === 'dark' ? 'gray-500' : 'gray-400'} hover:text-blue-500` // Default state
                        }`}
                    >
                      ▲
                    </button>
                    <span className={`text-${theme === 'dark' ? 'gray-100' : 'gray-700'}`}>{blog.upvotes}</span>

                    {/* Downvote button */}
                    <button
                      onClick={() => handleBlogDownvote(blog.bid)}
                      className={`mr-2 ml-2 ${blog.hasDownvoted
                        ? "text-red-500 font-bold" // Highlighted when downvoted
                        : `text-${theme === 'dark' ? 'gray-500' : 'gray-400'} hover:text-red-500`
                        }`}
                    >
                      ▼
                    </button>
                    <span className={`text-${theme === 'dark' ? 'gray-100' : 'gray-700'}`}>{blog.downvotes}</span>
                  </div>

                  {/* Report button aligned to the right */}
                  {isLoggedIn && <ReportButton id={blog.bid} type="blog" />}
                </div>
              </div>

              <div className={`max-w-md mx-auto bg-${theme === 'dark' ? 'gray-800' : 'gray-100'} p-6 rounded-lg shadow-md`}>
                <h2 className={`text-2xl font-bold text-${theme === 'dark' ? 'white' : 'black'} mb-4`}>
                  Code Templates:{" "}
                </h2>
                <ul className="space-y-4">
                  {blog.codeTemplates.map((template) => (
                    <li
                      key={template.cid}
                      className={`flex items-center justify-between p-4 text-${theme === 'dark' ? 'white' : 'black'} hover:bg-${theme === 'dark' ? 'gray-700' : 'gray-300'} rounded-lg transition duration-300 ease-in-out`}                    >
                      <Link href={`/execution/${template.cid}`}>
                        {template.title}
                      </Link>
                      <div className="mt-2 text-sm">{template.explanation}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <hr className="mt-8" />
            {/* Add comments */}
            <div className="mt-8">
              <h2 className={`text-xl text-${theme === 'dark' ? 'gray-100' : 'black'} font-semibold mb-4`}>
                Comments
              </h2>
              {/* Sort by ratings */}
              <div className="flex flex-wrap sm:w-auto gap-x-4 gap-y-4 ">
                <select
                  name="sortBy"
                  value={sortComment}
                  onChange={handleSortCommentChange}
                  className={`border p-2 mb-4 bg-${theme === 'dark' ? 'gray-900' : 'gray-200'} text-${theme === 'dark' ? 'gray-300' : 'gray-700'} rounded-md`}
                >
                  <option value="default">Sort comments by default</option>
                  <option value="rating_desc">
                    Sort comments by rating (descending)
                  </option>
                </select>
                <select
                  name="sortBy"
                  value={sortReply}
                  onChange={handleSortReplyChange}
                  className={`border p-2 mb-4 bg-${theme === 'dark' ? 'gray-900' : 'gray-200'} text-${theme === 'dark' ? 'gray-300' : 'gray-700'} rounded-md`}
                >
                  <option value="default">Sort replies by default</option>
                  <option value="rating_desc">
                    Sort replies by rating (descending)
                  </option>
                </select>
              </div>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div
                    key={comment.commentId}
                    className={`border-b border-${theme === 'dark' ? 'gray-300' : 'gray-400'} mb-6 pb-4`}
                  >
                    <div className="flex flex-row justify-between items-center mb-4">
                      {/* Left Section: Avatar and Comment Content */}

                      <div className="flex flex-row items-center w-3/4">
                        <img
                          src={
                            comment.user.profile.avatar.startsWith("/uploads/")
                              ? `${process.env.NEXT_PUBLIC_API_URL}${comment.user.profile.avatar}`
                              : comment.user.profile.avatar
                          }
                          alt="Avatar"
                          width={100}
                          height={100}
                          className="w-14 h-14 rounded-full"
                        />
                        <div className="flex flex-col ml-4 w-full">
                          <p className={`text-m text-${theme === 'dark' ? 'gray-200' : 'black'}`}>
                            {comment.user.username}
                          </p>
                          <p className={`break-words text-${theme === 'dark' ? 'gray-200' : 'gray-800'}`}>
                            {comment.content}
                          </p>

                          {/* Align the button to the left */}
                          <button
                            onClick={() =>
                              handleReply(
                                index,
                                comment.commentId,
                                comment.user.username
                              )
                            }
                            className={`mt-2 px-0.5 py-0.5 w-12 text-${theme === 'dark' ? 'white' : 'black'} hover:text-blue-500 text-sm rounded`}
                          >
                            Reply
                          </button>
                        </div>
                      </div>

                      {/* Right Section: Upvote/Downvote and Counts */}
                      <div className="flex flex-col justify-start items-center ml-4">
                        <div className="flex flex-row items-center">
                          <button
                            onClick={() =>
                              handleCommentUpvote(comment.commentId, index)
                            }
                            className={`mr-2 ${comment.hasUpvoted
                              ? "text-blue-500 font-bold" // Highlighted when upvoted
                              : `text-${theme === 'dark' ? 'gray-500' : 'gray-400'} hover:text-blue-500`
                              }`}
                          >
                            ▲
                          </button>
                          <span className={`text-${theme === 'dark' ? 'gray-100' : 'gray-700'}`}>
                            {comment.upvotes}
                          </span>
                          <button
                            onClick={() =>
                              handleCommentDownvote(comment.commentId, index)
                            }
                            className={`mr-2 ml-2 ${comment.hasDownvoted
                              ? "text-red-500 font-bold" // Highlighted when downvoted
                              : `text-${theme === 'dark' ? 'gray-500' : 'gray-400'} hover:text-red-500`
                              }`}
                          >
                            ▼
                          </button>
                          <span className={`text-${theme === 'dark' ? 'gray-100' : 'gray-700'} mr-2`}>
                            {comment.downvotes}
                          </span>
                          {isLoggedIn && (
                            <ReportButton
                              id={comment.commentId}
                              type="comment"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="pl-10">
                      {comment.replies &&
                        comment.replies.length > 0 &&
                        comment.replies.map((reply, replyIndex) => (
                          <div
                            className="flex flex-row justify-between items-center"
                            key={reply.replyId}
                          >
                            {/* Left Section: Avatar and reply Content */}

                            <div className="flex flex-row items-center w-3/4">
                              <img
                                src={
                                  reply.replier.profile.avatar.startsWith(
                                    "/uploads/"
                                  )
                                    ? `${process.env.NEXT_PUBLIC_API_URL}${reply.replier.profile.avatar}`
                                    : reply.replier.profile.avatar
                                }
                                alt="Avatar"
                                width={100}
                                height={100}
                                className="w-12 h-12 rounded-full"
                              />
                              <div className="flex flex-col ml-4 w-full">
                                <p
                                  className={`text-m  ${
                                    lightMode
                                      ? "text-gray-900"
                                      : "text-gray-200"
                                  }`}
                                >
                                  {reply.replier.username}
                                </p>
                                <p
                                  className={`break-words ${
                                    lightMode
                                      ? "text-gray-700"
                                      : "text-gray-200"
                                  }`}
                                >
                                  {reply.content}
                                </p>

                                {/* Align the button to the left */}
                                <button
                                  onClick={() =>
                                    handleReply(
                                      index,
                                      comment.commentId,
                                      reply.replier.username
                                    )
                                  }
                                  className={`mt-2 px-0.5 py-0.5 w-12 text-white hover:text-blue-500 text-sm rounded ${
                                    lightMode ? "text-gray-900" : "text-white"
                                  }`}
                                >
                                  Reply
                                </button>
                              </div>
                            </div>

                            {/* Right Section: Upvote/Downvote and Counts */}
                            <div className="flex flex-col justify-start items-center ml-4">
                              <div className="flex flex-row items-center">
                                <button
                                  onClick={() =>
                                    handleReplyUpvote(
                                      reply.replyId,
                                      replyIndex,
                                      comment.commentId,
                                      index
                                    )
                                  }
                                  className={`mr-2 ${reply.hasUpvoted
                                    ? "text-blue-500 font-bold" // Highlighted when upvoted
                                    : "text-gray-500 hover:text-blue-500" // Default state
                                    }`}
                                >
                                  ▲
                                </button>
                                <span
                                  className={`${
                                    lightMode
                                      ? "text-gray-900"
                                      : "text-gray-100"
                                  }`}
                                >
                                  {reply.upvotes}
                                </span>
                                <button
                                  onClick={() =>
                                    handleReplyDownvote(
                                      reply.replyId,
                                      replyIndex,
                                      comment.commentId,
                                      index
                                    )
                                  }
                                  className={`mr-2 ml-2 ${reply.hasDownvoted
                                    ? "text-red-500 font-bold" // Highlighted when downvoted
                                    : "text-gray-500 hover:text-red-500" // Default state
                                    }`}
                                >
                                  ▼
                                </button>
                                <span
                                  className={`${
                                    lightMode
                                      ? "text-gray-900"
                                      : "text-gray-100"
                                  }`}
                                >
                                  {reply.downvotes}
                                </span>
                                {isLoggedIn && (
                                  <ReportButton
                                    id={reply.replyId}
                                    type="reply"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {comment.replies &&
                      comment._count.replies > comment.replies.length && (
                        <div>
                          <button
                            onClick={() =>
                              handleLoadReplies(comment.commentId, index)
                            }
                            className="text-gray-500 hover:text-blue-500 ml-10"
                          >
                            View more replies
                          </button>
                        </div>
                      )}

                    {!comment.replies && comment._count.replies > 0 && (
                      <div>
                        <button
                          onClick={() =>
                            handleLoadReplies(comment.commentId, index)
                          }
                          className="text-gray-500 hover:text-blue-500 ml-10"
                        >
                          View replies
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className={`text-${theme === 'dark' ? 'gray-500' : 'gray-400'} mb-6 pb-4`}>
                  No comments available
                </p>
              )}

              {/* Pagination Controls */}
              <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={totalComments}
                itemsPerPage={10}
                onPageChange={hanglePageChange}
              />

              {/* New Comment Input */}
              {replyingTo && isLoggedIn && (
                <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm ml-2 mr-2 mb-2">
                  replying to {replyingToName}
                  <button
                    onClick={() => removeReplying()}
                    className="ml-2 text-blue-800 hover:text-red-600 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              )}
              {isLoggedIn && profile && (
                <div className="flex items-start gap-4 rounded-lg p-4 shadow-sm">
                  {/* User Avatar */}
                  <img
                    src={profile.avatarUrl}
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full"
                  />

                  {/* Comment Input Area */}

                  <div className="flex-1">
                    <textarea
                      ref={textAreaRef}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add your comment..."
                      className={`w-full h-16 p-3 border border-gray-300 bg-${theme === 'dark' ? 'gray-900' : 'gray-200'} rounded-lg resize-none text-${theme === 'dark' ? 'white' : 'black'} focus:outline-none focus:ring focus:ring-blue-300`}
                    ></textarea>
                    <div className="mt-2 flex justify-between items-center">
                      {/* Icons */}
                      <div className="flex items-center gap-3"></div>

                      {/* Post Button */}
                      <button
                        onClick={handleAddComment}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={`text-center text-xl text-${theme === 'dark' ? 'gray-500' : 'gray-800'}`}>
            Blog not found
          </div>
        )}
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            margin: "0 auto",
            textAlign: "center",
          },
        }}
      />
    </div>
  );
};

export default DisplayBlog;
