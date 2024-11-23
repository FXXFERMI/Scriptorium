import Head from "next/head";
import Header from "../../components/Header";
// import Footer from "../../components/Footer";
import { NextSeo } from "next-seo";
import { FC } from "react";

const CookiesPolicy: FC = () => {
  return (
    <div className="text-black bg-black">
      <NextSeo
        title="Cookies Policy: SFJ Scriptorium"
        description="Learn how SFJ Scriptorium uses cookies on our website."
        canonical={`${process.env.NEXT_PUBLIC_BASE_URL}/about/cookies-policy`}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/about/cookies-policy`,
        }}
      />
      <Head>
        <title>Cookies Policy</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <section className="text-gray-600 body-font">
        <div className="max-w-5xl pt-52 pb-24 mx-auto">
          <h1 className="text-80 text-center font-4 lh-6 ld-04 font-bold text-white mb-6">
            Cookies Policy
          </h1>
          <h2 className="text-2xl font-4 font-semibold lh-6 ld-04 pb-11 text-gray-700 text-center">
            How we use cookies to enhance your experience.
          </h2>
          <p className="mx-auto text-xl text-center text-gray-300 font-normal leading-relaxed fs521 lg:w-2/3">
            At SFJ Scriptorium, we use cookies to improve your browsing experience and to provide personalized content and services. This policy explains what cookies are, how we use them, and how you can manage them.
          </p>
        </div>
        <div className="pt-12 pb-24 max-w-4xl mx-auto fsac4 md:px-1 px-3">
          <div className="ktq4">
            <h3 className="pt-3 font-semibold text-lg text-white">What are Cookies?</h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Cookies are small data files stored on your device when you visit a website. They help us understand how you interact with our site and improve its functionality.
            </p>
          </div>
          <div className="ktq4">
            <h3 className="pt-3 font-semibold text-lg text-white">How We Use Cookies</h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              - To remember your preferences.<br />
              - To track site performance and analytics.<br />
              - To deliver personalized content and ads.
            </p>
          </div>
          <div className="ktq4">
            <h3 className="pt-3 font-semibold text-lg text-white">Managing Cookies</h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              You can manage cookies through your browser settings. However, disabling cookies may affect the functionality of certain features on our site.
            </p>
          </div>
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
};

export default CookiesPolicy;
