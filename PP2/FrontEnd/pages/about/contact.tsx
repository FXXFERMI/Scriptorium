import Head from "next/head";
import Header from "../../components/Header";
// import Footer from "../../components/Footer";
import { NextSeo } from "next-seo";
import { FC } from "react";

const Contact: FC = () => {
    return (
        <div className="text-black bg-black">
            <NextSeo
                title="Contact Us: SFJ Scriptorium"
                description="Get in touch with the team behind SFJ Scriptorium."
                canonical={`${process.env.NEXT_PUBLIC_BASE_URL}/about/contact`}
                openGraph={{
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/about/contact`,
                }}
            />
            <Head>
                <title>Contact Us</title>
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Header />
            <section className="text-gray-600 body-font">
                <div className="max-w-5xl pt-52 pb-24 mx-auto">
                    <h1 className="text-80 text-center font-4 lh-6 ld-04 font-bold text-white mb-6">
                        Contact Us
                    </h1>
                    <h2 className="text-2xl font-4 font-semibold lh-6 ld-04 pb-11 text-gray-700 text-center">
                        We're here to connect! Meet the team behind SFJ Scriptorium.
                    </h2>
                </div>


                <div className="container grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto pb-24">

                    {/* Suhani Patel */}
                    <div className="flex flex-col items-center text-center">
                        <img
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/suhani-photo.jpg`}
                            alt="Suhani Patel"
                            className="w-32 h-32 rounded-full mb-4 border shadow-md"
                        />
                        <h3 className="text-lg font-semibold text-white">Suhani Paul</h3>
                        <p className="text-gray-300 text-md mb-2">Founder & Developer & Designer</p>
                        <a
                            href="https://www.linkedin.com/in/suhanip/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-600"
                        >
                            LinkedIn Profile
                        </a>
                    </div>

                    {/* Siqi Fermi Fei */}
                    <div className="flex flex-col items-center text-center">
                        <img
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/siqi-photo.jpg`}
                            alt="Siqi Fermi Fei"
                            className="w-32 h-32 rounded-full mb-4 border shadow-md"
                        />
                        <h3 className="text-lg font-semibold text-white">Siqi (Fermi) Fei</h3>
                        <p className="text-gray-300 text-md mb-2">Founder & Developer & Designer</p>
                        <a
                            href="https://www.linkedin.com/in/siqi-fermi-fei/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-600"
                        >
                            LinkedIn Profile
                        </a>
                    </div>

                    {/* Joyce YY Ang */}
                    <div className="flex flex-col items-center text-center">
                        <img
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/joyce-photo.jpg`}
                            alt="Joyce YY Ang"
                            className="w-32 h-32 rounded-full mb-4 border shadow-md"
                        />
                        <h3 className="text-lg font-semibold text-white">Joyce Ang</h3>
                        <p className="text-gray-300 text-md mb-2">Founder & Developer & Designer</p>
                        <a
                            href="https://www.linkedin.com/in/joyce-yy-ang/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-600"
                        >
                            LinkedIn Profile
                        </a>
                    </div>
                </div>

                <p className="mx-auto text-xl text-center text-gray-300 font-normal leading-relaxed fs521 lg:w-2/3">
                    Have questions or suggestions? Reach out to us through our LinkedIn profiles or send us an email at{" "}
                    <a href="mailto:sxmauq@163.com" className="text-blue-400 hover:text-blue-600">
                        sxmauq@163.com
                    </a>.
                </p>
            </section>
            {/* <Footer /> */}
        </div>
    );
};

export default Contact;
