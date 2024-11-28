import Head from "next/head";
import Header from "../components/Header";
// import Footer from "../components/Footer";
import { NextSeo } from "next-seo";
import { FC } from "react";
import { useTheme } from "../contexts/ThemeContext";

const Contact: FC = () => {
  const { theme } = useTheme();
  return (
    <div className="text-black bg-black">
      <NextSeo
        title="404: Scriptorium"
        description="404 page for all our missing pages"
        canonical="https://nine4-3.vercel.app/404"
        openGraph={{
          url: "https://nine4-3.vercel.app/404",
        }}
      />
      <Head>
        <title>SFJ Scriptorium</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex flex-col justify-center mx-auto mt-52 text-center max-w-2x1">
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
          404 – Unavailable
        </h1>
        <br />
        <a
          className="w-64 p-1 mx-auto font-bold text-center text-white border border-gray-500 rounded-lg sm:p-4"
          href="/"
        >
          Return Home
        </a>
      </div>
      <div className="mt-64"></div>
      {/* <Footer /> */}
    </div>
  );
};

export default Contact;
