import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Navbar from "../../components/Navbar"; // Assuming you have a Navbar component
import { blogType } from "../../interfaces/blog";
import { userProfileType } from "../../interfaces/user";
import Cookies from "js-cookie";

const DisplayBlog = () => {
  const router = useRouter();
  const { id } = router.query; // Get the blog ID from the URL
  const [blog, setBlog] = useState<blogType>(null); // State for storing blog data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string>(""); // Error state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState<string>(""); // State for new comment input
  const [commentUpdate, setCommentUpdate] = useState<boolean>(false); // State for new comment input
  const [blogUpdate, setBlogUpdate] = useState<boolean>(false); // State for new comment input
  const [replyingTo, setReplyingTo] = useState<number | null>(null); // State for tracking comment being replied to
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState(""); // Sort state (by rating)
  const [curUser, setCurUser] = useState(null);

  const textAreaRef = useRef<HTMLTextAreaElement>(null); // Reference to the textarea

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      console.error("Access token is missing");
      return;
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs/${id}`
        );
        let blog = response.data;
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
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments`,
          {
            params: { bid: id, page, limit: 10 },
          }
        );
        const { comments, totalPages } = response.data;
        setComments(comments);
        setTotalPages(totalPages);
      } catch (err) {
        setError("Failed to load comments.");
      }
    };

    const fetchSortedComments = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          console.error("Access token is missing");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments/sortByRatings`,
          {
            params: { bid: id },
          }
        );
        setComments(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load the blog.");
        setLoading(false);
      }
    };

    if (blog) {
      if (sort === "rating_desc") {
        fetchSortedComments();
      } else {
        fetchComments();
      }
    }
  }, [blog, page, commentUpdate, sort]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // empty string

    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        console.error("Access token is missing");
        return;
      }
      if (replyingTo) {
        const response = await axios.post(
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
      } else {
        const response = await axios.post(
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
      }
      setReplyingTo(null);
      setCommentUpdate((prev) => !prev);
      setNewComment(""); // Clear the input after submission
    } catch (err) {
      setError("Failed to add comment.");
    }
  };

  // Handle clicking on the reply button
  const handleReply = (commentId: number, username: string) => {
    setReplyingTo(commentId); // Set the comment being replied to
    setNewComment(`@${username} `); // Set the reply format
    if (textAreaRef.current) {
      textAreaRef.current.focus(); // Focus the textarea
    }
  };

  // Upvote handler for blog
  const handleBlogUpvote = async (bid) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        console.error("Access token is missing");
        return;
      }
      console.log(token);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs/${bid}/rate`,
        { upvote: true, downvote: false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setBlogUpdate((prev) => !prev); // Trigger re-fetch of comments
    } catch (err) {
      setError("Failed to upvote.");
    }
  };

  // Downvote handler for blog
  const handleBlogDownvote = async (bid) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        console.error("Access token is missing");
        return;
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Blogs/${bid}/rate`,
        { upvote: false, downvote: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setBlogUpdate((prev) => !prev); // Trigger re-fetch of comments
    } catch (err) {
      setError("Failed to downvote.");
    }
  };

  // Upvote handler for comments
  const handleCommentUpvote = async (commentId) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        console.error("Access token is missing");
        return;
      }
      console.log(token);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}/rate`,
        { upvote: true, downvote: false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setCommentUpdate((prev) => !prev); // Trigger re-fetch of comments
    } catch (err) {
      setError("Failed to upvote.");
    }
  };

  // Downvote handler for comments
  const handleCommentDownvote = async (commentId) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        console.error("Access token is missing");
        return;
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}/rate`,
        { upvote: false, downvote: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setCommentUpdate((prev) => !prev); // Trigger re-fetch of comments
    } catch (err) {
      setError("Failed to downvote.");
    }
  };
  // Handle sorting changes
  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  if (loading) return <div>Loading...</div>; // Show loading state

  if (error) return <div className="text-red-500">{error}</div>; // Show error message if failed to fetch

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8">
        {blog ? (
          <>
            <h1 className="text-3xl font-bold mb-6">{blog.title}</h1>
            <div className="flex flex-wrap mb-6">
              tags:
              {blog.tags && blog.tags.length > 0 ? (
                JSON.parse(blog.tags).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm ml-2 mr-2 mb-2"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No tags available</span>
              )}
            </div>
            {/* add author section*/}
            <h1 className="text-1.5xl font-bold mb-4"> Written by:</h1>
            <div className="flex flex-row items-center mb-6">
              <img
                src={
                  blog.user.profile.avatar.startsWith("/uploads/")
                    ? `${process.env.NEXT_PUBLIC_API_URL}${blog.user.profile.avatar}`
                    : blog.user.profile.avatar
                }
                alt="Avatar"
                width={100}
                height={100}
                key={
                  blog.user.profile.avatar.startsWith("/uploads/")
                    ? `${process.env.NEXT_PUBLIC_API_URL}${blog.user.profile.avatar}`
                    : blog.user.profile.avatar
                }
                className="w-14 h-14 rounded-full"
              />
              <div className="flex flex-col ml-4">
                <h2>
                  {" "}
                  {blog.user.profile.firstName} {blog.user.profile.lastName}{" "}
                </h2>
                <p className="text-lg"> {blog.user.username} </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl text-black font-semibold mb-4">
                Blog Description
              </h2>
              <p className="text-gray-700">{blog.description}</p>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              {/* Upvote button */}
              <button
                onClick={() => handleBlogUpvote(blog.bid)}
                className="text-gray-500 hover:text-blue-500"
              >
                ▲
              </button>
              <span>{blog.upvotes}</span>
              {/* Downvote button */}
              <button
                onClick={() => handleBlogDownvote(blog.bid)}
                className="text-gray-500 hover:text-red-500"
              >
                ▼
              </button>
              <span>{blog.downvotes}</span>
            </div>
            {/* Add code Template links */}
            {/* Add comments */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Comments</h2>
              {/* Sort by ratings */}
              <select
                name="sortBy"
                value={sort}
                onChange={handleSortChange}
                className="border p-2 mb-4"
              >
                <option value="default">Sort by default</option>
                <option value="rating_desc">Sort by rating (descending)</option>
              </select>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.commentId}
                    className="border-b border-gray-300 mb-6 pb-4"
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
                          <p className="text-m">{comment.user.username}</p>
                          <p className="break-words">{comment.content}</p>

                          {/* Align the button to the left */}
                          <button
                            onClick={() =>
                              handleReply(
                                comment.commentId,
                                comment.user.username
                              )
                            }
                            className="mt-2 px-0.5 py-0.5 w-12 text-white hover:text-blue-500 text-sm rounded"
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
                              handleCommentUpvote(comment.commentId)
                            }
                            className="text-gray-500 hover:text-blue-500 mr-2"
                          >
                            ▲
                          </button>
                          <span>{comment.upvotes}</span>
                          <button
                            onClick={() =>
                              handleCommentDownvote(comment.commentId)
                            }
                            className="text-gray-500 hover:text-red-500 mr-2 ml-2"
                          >
                            ▼
                          </button>
                          <span>{comment.downvotes}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pl-10">
                      {comment.replies.length > 0 &&
                        comment.replies.map((reply) => (
                          <div className="flex flex-row justify-between items-center">
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
                                <p className="text-m">
                                  {reply.replier.username}
                                </p>
                                <p className="break-words">{reply.content}</p>

                                {/* Align the button to the left */}
                                <button
                                  onClick={() =>
                                    handleReply(
                                      comment.commentId,
                                      reply.replier.username
                                    )
                                  }
                                  className="mt-2 px-0.5 py-0.5 w-12 text-white hover:text-blue-500 text-sm rounded"
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
                                    handleCommentUpvote(reply.commentId)
                                  }
                                  className="text-gray-500 hover:text-blue-500 mr-2"
                                >
                                  ▲
                                </button>
                                <span>{reply.upvotes}</span>
                                <button
                                  onClick={() =>
                                    handleCommentDownvote(reply.commentId)
                                  }
                                  className="text-gray-500 hover:text-red-500 mr-2 ml-2"
                                >
                                  ▼
                                </button>
                                <span>{reply.downvotes}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {comment.replies.length > 0 && (
                      <div>
                        <button
                          // onClick={() => handleLoadReplies(comment.commentId)}
                          className="text-gray-500 hover:text-blue-500 ml-10"
                        >
                          View more replies
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments available</p>
              )}

              {/* Pagination Controls */}
              <div className="flex justify-center mt-4 mb-4">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded ml-2 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              {/* New Comment Input */}

              <div className="mb-6">
                <textarea
                  ref={textAreaRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={handleAddComment}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Submit Comment
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-xl text-gray-500">
            Blog not found
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayBlog;
