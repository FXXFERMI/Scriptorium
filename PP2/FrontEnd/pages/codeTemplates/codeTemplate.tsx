import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import axios, { AxiosRequestConfig } from "axios";
import Header from "../../components/Header";
import { codeTemplateType } from "../../interfaces/codeTemplate";
import Cookies from "js-cookie";
import api from "../../utils/axiosInstance";
import Link from "next/link";
import {useTheme} from "../../contexts/ThemeContext"

// https://tailwindui.com/components/application-ui/navigation/pagination

type ProfileType = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
};

const DisplayCodeTemplate = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = router.query; // Get the codeTemplate ID from the URL
  const [codeTemplate, setCodeTemplate] = useState<codeTemplateType>(null); // State for storing codeTemplate data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string>(""); // Error state

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  // // Fetch user profile
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const token = Cookies.get("accessToken");

  //       if (token) {
  //         const response = await api.get("/api/users/showProfile", {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //           withCredentials: true,
  //         });
  //         setIsLoggedIn(!!token);
  //         setProfile(response.data);
  //       }
  //     } catch (error) {
  //       //console.error("Error fetching profile:", error);
  //     }
  //   };
  //   fetchProfile();
  // }, []);


  // Fetch codeTemplate data
  useEffect(() => {
    if (!id) return;

    const fetchCodeTemplate = async () => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/CodeTemplates/${id}`,
          config
        );
        // const response = await axios.get(
        //   `${process.env.NEXT_PUBLIC_API_URL}/api/CodeTemplates/${id}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        //   params: {
        //     cid: id,
        //     // limit: itemsPerPage,
        //   },
        // });

        // const response = await axios.get(
        //   `${process.env.NEXT_PUBLIC_API_URL}/api/CodeTemplates/${id}`,
        //   config
        // );
        let codeTemplate = response.data;
        // console.log('Full response:', response);
        // console.log('Data:', response.data);
        // console.log('Code Template:', response.data.codeTemplate);
        setCodeTemplate(codeTemplate);
        setLoading(false);
      } catch (err) {
        setError("Failed to load the codeTemplate.");
        setLoading(false);
      }
    };

    fetchCodeTemplate();
  }, [id]);


  if (loading) return <div>Loading...</div>; // Show loading state

  if (error) return <div className={`text-${theme === "dark" ? "red-500" : "red-700"}`}>{error}</div>; // Show error message if failed to fetch

  return (
    <div className={`bg-${theme === "dark" ? "black" : "white"} text-${theme === "dark" ? "white" : "black"}`}>
      <Header />
      <div className="container mx-auto p-8 mt-20">
        {/* <h1 className="text-3xl font-bold mb-4 text-white">Code Template #{id}</h1> */}
        {codeTemplate ? (
          <>
            <div className="flex flex-col lg:flex-row gap-6">
            <div className={`flex-1 bg-${theme === "dark" ? "gray-800" : "gray-200"} p-6 rounded-lg shadow-md flex flex-col lg:flex-row justify-between items-start`}>
            <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-4 text-${theme === "dark" ? "white" : "black"}`}>
                    Code Template #{id} {codeTemplate.title}
                  </h1>
                  <div className={`text-${theme === "dark" ? "gray-300" : "gray-700"} flex flex-wrap font-bold mb-6`}>
                    Tags:
                    {codeTemplate.tags && codeTemplate.tags.length > 0 ? (
                      codeTemplate.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm ml-2 mr-2 mb-2"
                        >
                          {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                        </span>
                      ))
                    ) : (
                      <span className={`text-${theme === "dark" ? "gray-500" : "gray-600"}`}>No tags available</span>
                    )}
                  </div>
                  {/* add author section */}
                  <h1 className={`text-${theme === "dark" ? "gray-300" : "gray-700"} text-1.5xl font-bold mb-6`}>
                    Author:
                  </h1>
                  <div className={`text-${theme === "dark" ? "gray-200" : "gray-600"} flex flex-row items-center mb-6`}>
                    <img
                      src={
                        codeTemplate.user.profile.avatar.startsWith("/uploads/")
                          ? `${process.env.NEXT_PUBLIC_API_URL}${codeTemplate.user.profile.avatar}`
                          : codeTemplate.user.profile.avatar
                      }
                      alt="Avatar"
                      width={100}
                      height={100}
                      key={
                        codeTemplate.user.profile.avatar.startsWith("/uploads/")
                          ? `${process.env.NEXT_PUBLIC_API_URL}${codeTemplate.user.profile.avatar}`
                          : codeTemplate.user.profile.avatar
                      }
                      className="text-gray-200 w-14 h-14 rounded-full"
                    />
                    <div className="flex flex-col ml-4">
                      <h2>
                        {codeTemplate.user.profile.firstName} {codeTemplate.user.profile.lastName}
                      </h2>
                    </div>
                  </div>

                  <h1 className={`text-${theme === "dark" ? "gray-300" : "gray-700"} text-1.5xl font-bold mb-6`}>
                    Introduction:
                  </h1>
                  <p
                    className={`text-${theme === "dark" ? "gray-300" : "gray-700"} text-lg font-normal`}
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {codeTemplate.explanation}
                  </p>
                </div>


                {/* 
              {isLoggedIn && (
                <div className="flex items-start gap-4 rounded-lg p-4 shadow-sm">
                  <img
                    src={profile.avatarUrl}
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full"
                  />
                </div>
              )} */}

                {/* Button to navigate to the /execution/{id} page */}
                <div className="mt-8 lg:mt-0 lg:ml-8">
                  <button
                    onClick={() => router.push(`/execution/${id}`)}
                    className={`bg-${theme === "dark" ? "white" : "black"} text-${theme === "dark" ? "black" : "white"} border border-${theme === "dark" ? "black" : "white"} py-3 px-6 rounded-md hover:bg-${theme === "dark" ? "black" : "white"} hover:text-${theme === "dark" ? "white" : "black"} transition duration-300`}
                    >
                    Check Code Details
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={`text-center text-xl text-${theme === "dark" ? "gray-500" : "gray-600"}`}>
            Code Templates not found
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayCodeTemplate;
