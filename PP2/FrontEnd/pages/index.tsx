import Head from "next/head";
// import Header from "../components/Header";
// import Main from "../components/Main";
// import Footer from "../components/Footer";
import { NextSeo } from "next-seo";
import { FC, useEffect, useState } from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import api from "../utils/axiosInstance";
import { codeTemplateType } from "../interfaces/codeTemplate";
import { blogType } from "../interfaces/blog";
import dotenv from "dotenv";
import { useAuth } from "../contexts/AuthContext";

dotenv.config();

import { useTheme } from "../contexts/ThemeContext"; // Import useTheme


const Header = dynamic(() => import("../components/Header"), { ssr: false }); // Dynamic import for client-side rendering only

const Home: FC = () => {
  const { theme } = useTheme();
  const [newestTemplates, setNewestTemplates] = useState<codeTemplateType[]>([]);
  const [topRatedBlogs, setTopRatedBlogs] = useState<blogType[]>([]);
  const { isLoggedIn, logout, login } = useAuth();

  useEffect(() => {
    const fetchNewestCodeTemplates = async () => {
      try {
        const response = await api.get("/api/CodeTemplates", {
          params: {
            limit: 4,
            sort: "newest",
          },
        });
        setNewestTemplates(response.data.codeTemplates);
      } catch (error) {
        //console.error("Error fetching newest code templates:", error);
      }
    };

    const fetchTopRatedBlogs = async () => {
      try {
        const response = await api.get("/api/Blogs/sortByRatings", {
          params: {
            limit: 2,
          },
        });
        setTopRatedBlogs(response.data);
      } catch (error) {
        //console.error("Error fetching top-rated blogs:", error);
      }
    };

    fetchNewestCodeTemplates();
    fetchTopRatedBlogs();
  }, []);

  return (
    // <div className="text-black bg-black">
    <div className={`text-${theme === 'dark' ? 'white' : 'black'} bg-${theme === 'dark' ? 'black' : 'white'}`}>
      <NextSeo
        title="Home: SFJ Scriptorium "
        description="Welcome to SFJ Scriptorium homepage."
        canonical={`${process.env.NEXT_PUBLIC_BASE_URL}/`}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        }}
      />
      <Head>
        <title>SFJ Scriptorium</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <section className={`text-${theme === 'dark' ? 'gray-400' : 'gray-600'} body-font`}>
        <div className="max-w-5xl pt-52 pb-24 mx-auto">
          <h1 className={`text-80 text-center font-4 lh-6 ld-04 font-bold text-${theme === 'dark' ? 'white' : 'black'} mb-6`}>
            Welcome to SFJ: the new way of writing code!
          </h1>
          <h2 className={`text-2xl font-4 font-semibold lh-6 ld-04 pb-11 text-${theme === 'dark' ? 'gray-400' : 'gray-700'} text-center`}>
            Crafting Code, Inspiring Creativity, Empowering Innovation.
          </h2>
          {/* <div className="ml-6 text-center flex flex-col md:flex-row md:justify-center md:space-x-8 space-y-4 md:space-y-0"> */}
          <div className="ml-6 text-center">
            <a
              className={`inline-flex items-center py-3 font-semibold text-${theme === 'dark' ? 'black' : 'black'} transition duration-500 ease-in-out transform bg-transparent bg-${theme === 'dark' ? 'white' : 'black'} px-7 text-md md:mt-0 hover:text-${theme === 'dark' ? 'black' : 'white'} hover:bg-${theme === 'dark' ? 'white' : 'black'} focus:shadow-outline`}
              href="/codeTemplates/viewCodeTemplates"
            >
              <div className="flex text-lg">
                <span className="justify-center">View All Code Templates</span>
              </div>
            </a>
            <a
              className="ml-5 mr-5 inline-flex items-center py-3 font-semibold text-black transition duration-500 ease-in-out transform bg-transparent bg-white px-7 text-md hover:text-black hover:bg-white focus:shadow-outline"
              href="/blogs/viewBlogs"
            >
              <div className="flex text-lg">
                <span className="justify-center">View All Blogs</span>
              </div>
            </a>

            <a
              className={`inline-flex items-center py-3 font-semibold text-${theme === 'dark' ? 'black' : 'black'} transition duration-500 ease-in-out transform bg-transparent bg-${theme === 'dark' ? 'white' : 'black'} px-7 text-md hover:text-${theme === 'dark' ? 'black' : 'white'} hover:bg-${theme === 'dark' ? 'white' : 'black'} focus:shadow-outline`}
              href="/execution"
            >
              <div className="flex text-lg">
                <span className="justify-center">Start Coding Now</span>
              </div>
            </a>

            {!isLoggedIn && (
              <a
                className="inline-flex items-center py-3 font-semibold tracking-tighter text-white transition duration-500 ease-in-out transform bg-transparent mr-5 ml-5 bg-gradient-to-r from-blue-500 to-blue-800 px-14 text-md focus:shadow-outline "
                href="/users/register"
              >
                <div className="flex text-lg">
                  <span className="justify-center">Be a Member Today</span>
                </div>
              </a>
            )}
          </div>
        </div>
        {/* <div className="container flex flex-col items-center justify-center mx-auto">
                <img
                    className="object-cover object-center w-3/4 mb-10 border shadow-md g327"
                    alt="Placeholder Image"
                    src="./images/placeholder.png"
                />
            </div> */}

        {/* <div className="container flex flex-col items-center justify-center mx-auto">
          <video
            className="object-cover object-center w-3/4 mb-10 border shadow-md g327"
            src="https://youtu.be/QKVPOSb0D0Y"
            controls
            autoPlay
            loop
            muted
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        </div> */}

        <div className="container flex flex-col items-center justify-center mx-auto">
          <iframe
            className="object-cover object-center w-3/4 mb-10 border shadow-md g327"
            width="960"  // Set your desired width (adjust accordingly)
            height="540"
            src="https://www.youtube.com/embed/QKVPOSb0D0Y"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          >
            Your browser does not support iframes.
          </iframe>
        </div>


        {/* <h2 className="pt-40 mb-1 text-2xl font-semibold tracking-tighter text-center text-gray-200 lg:text-7xl md:text-6xl">
          Clean and tidy code.
        </h2>
        <br />
        <p className="mx-auto text-xl text-center text-gray-300 font-normal leading-relaxed fs521 lg:w-2/3">
          Discover beautifully crafted, ready-to-use code templates to kickstart
          your next project effortlessly.
        </p>
        <div className="pt-12 pb-24 max-w-4xl mx-auto fsac4 md:px-1 px-3">
          <div className="ktq4">
            <img
              className="w-10"
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.png`}
              alt="icon"
            />
            <h3 className="pt-3 font-semibold text-lg text-white">
              Lorem ipsum dolor sit amet
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
              tincidunt a libero in finibus. Maecenas a nisl vitae ante rutrum
              porttitor.
            </p>
          </div>
          <div className="ktq4">
            <img
              className="w-10"
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.png`}
              alt="icon"
            />
            <h3 className="pt-3 font-semibold text-lg text-white">
              Lorem ipsum dolor sit amet
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
              tincidunt a libero in finibus. Maecenas a nisl vitae ante rutrum
              porttitor.
            </p>
          </div>
          <div className="ktq4">
            <img
              className="w-10"
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.png`}
              alt="icon"
            />
            <h3 className="pt-3 font-semibold text-lg text-white">
              Lorem ipsum dolor sit amet
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
              tincidunt a libero in finibus. Maecenas a nisl vitae ante rutrum
              porttitor.
            </p>
          </div>
          <div className="ktq4">
            <img
              className="w-10"
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.png`}
              alt="icon"
            />
            <h3 className="pt-3 font-semibold text-lg text-white">
              Lorem ipsum dolor sit amet
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
              tincidunt a libero in finibus. Maecenas a nisl vitae ante rutrum
              porttitor.
            </p>
          </div>
        </div> */}
        {/* Clean and Tidy Code Section */}
        <h2 className="pt-40 mb-1 text-2xl font-semibold tracking-tighter text-center text-gray-200 lg:text-7xl md:text-6xl">
          Clean and tidy code.
        </h2>
        <br />
        <p className={`mx-auto text-xl text-center font-normal leading-relaxed fs521 lg:w-2/3 text-${theme === 'dark' ? 'gray-300' : 'gray-700'}`}>
          Discover beautifully crafted, ready-to-use code templates to kickstart your next project effortlessly.
        </p>
        <div className="pt-12 pb-24 max-w-4xl mx-auto fsac4 md:px-1 px-3 grid gap-8 grid-cols-1 md:grid-cols-2">
          {newestTemplates.map((template) => (
            <div
              key={template.cid}
              className={`ktq4 bg-${theme === 'dark' ? 'gray-800' : 'gray-100'} p-6 rounded-lg cursor-pointer`}
              onClick={() => window.location.href = `/execution/${template.cid}`}
            >
              <img
                className="w-10"
                src="/favicon.png"
                alt="icon"
              />
              <h3 className={`pt-3 font-semibold text-lg text-${theme === 'dark' ? 'white' : 'white'}`}>
                {template.title}
              </h3>
              <p className={`pt-2 value-text text-md text-${theme === 'dark' ? 'gray-200' : 'gray-100'} fkrr1`}>
                {/* {template.explanation} */}
                {template.explanation.length > 100
                  ? `${template.explanation.slice(0, 100)}...`
                  : template.explanation}
              </p>
            </div>
          ))}
        </div>

        {/* <h2 className="pt-40 mb-1 text-2xl font-semibold tracking-tighter text-center text-gray-200 lg:text-7xl md:text-6xl">
          Ideas that Inspire.
        </h2>
        <br />
        <p className="mx-auto text-xl text-center text-gray-300 font-normal leading-relaxed fs521 lg:w-2/3">
          Dive into expert-written blogs for insights, tips, and the latest
          trends in the world of coding and development.
        </p>
        <div className="pt-32 pb-32 max-w-6xl mx-auto fsac4 md:px-1 px-3">
          <div className="ktq4">
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.png`}
              alt="feature image"
            />
            <h3 className="pt-3 font-semibold text-lg text-white">
              Lorem ipsum dolor sit amet
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Fusce pharetra ligula mauris, quis faucibus lectus elementum vel.
              Nullam vehicula, libero at euismod tristique, neque ligula
              faucibus urna, quis ultricies massa enim in nunc. Vivamus
              ultricies, quam ut rutrum blandit, turpis massa ornare velit, in
              sodales tellus ex nec odio.
            </p>
          </div>
          <div className="ktq4">
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.png`}
              alt="feature image"
            />
            <h3 className="pt-3 font-semibold text-lg text-white">
              Lorem ipsum dolor sit amet
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Fusce pharetra ligula mauris, quis faucibus lectus elementum vel.
              Nullam vehicula, libero at euismod tristique, neque ligula
              faucibus urna, quis ultricies massa enim in nunc. Vivamus
              ultricies, quam ut rutrum blandit, turpis massa ornare velit, in
              sodales tellus ex nec odio.
            </p>
          </div>
        </div> */}
        {/* <section className="relative pb-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
                    <div className="py-24 md:py-36">
                        <h1 className="mb-5 text-6xl font-bold text-white">
                            Subscribe to our newsletter
                        </h1>
                        <h2 className="mb-9 text-2xl font-semibold text-gray-200">
                            Enter your email address and get our newsletters straight away.
                        </h2>
                        <input
                            type="email"
                            placeholder="jack@example.com"
                            name="email"
                            autoComplete="email"
                            className="border border-gray-600 w-1/4 pr-2 pl-2 py-3 mt-2 rounded-md text-gray-800 font-semibold hover:border-gray-700 bg-black"
                        />
                        <a
                            className="inline-flex items-center px-14 py-3 mt-2 ml-2 font-medium text-black transition duration-500 ease-in-out transform bg-transparent border rounded-lg bg-white"
                            href="/"
                        >
                            <span className="justify-center">Subscribe</span>
                        </a>
                    </div>
                </div>
            </section> */}
        {/* Ideas that Inspire Section */}
        <h2 className="pt-40 mb-1 text-2xl font-semibold tracking-tighter text-center text-gray-200 lg:text-7xl md:text-6xl">
          Ideas that Inspire.
        </h2>
        <br />
        <p className={`mx-auto text-xl text-center font-normal leading-relaxed fs521 lg:w-2/3 text-${theme === 'dark' ? 'gray-300' : 'gray-700'}`}>
          Dive into expert-written blogs for insights, tips, and the latest trends in the world of coding and development.
        </p>
        <div className="pt-32 pb-32 max-w-6xl mx-auto fsac4 md:px-1 px-3 grid gap-8 grid-cols-1 md:grid-cols-2">
          {topRatedBlogs.map((blog) => (
            <div
              key={blog.bid}
              className={`ktq4 bg-${theme === 'dark' ? 'gray-800' : 'gray-100'} p-6 rounded-lg cursor-pointer`}
              onClick={() => window.location.href = `/blogs/blog?id=${blog.bid}`}
            >
              <img
                src="/favicon.png"
                alt="feature image"
              />
              <h3 className={`pt-3 font-semibold text-lg text-${theme === 'dark' ? 'white' : 'white'}`}>
                {blog.title}
              </h3>
              <p className={`pt-2 value-text text-md text-${theme === 'dark' ? 'gray-200' : 'gray-100'} fkrr1`}>
                {blog.description.length > 100 ? `${blog.description.slice(0, 100)}...` : blog.description}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
};

export default Home;

// import { NextPage } from 'next';
// import Navbar from '../components/Navbar'; // Make sure the path is correct based on your file structure

// const Home: NextPage = () => {
//   return (
//     <div className="h-screen bg-gray-100">
//       <Navbar /> {/* Using the Navbar component */}
//       <div className="flex items-center justify-center h-full">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500">
//             This is the Home Page and Hard Working Fermi
//           </h1>
//           <img
//             src="/cats-cat.gif"
//             alt="Animated GIF"
//             className="w-64 h-64 mx-auto rounded-lg shadow-md"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
