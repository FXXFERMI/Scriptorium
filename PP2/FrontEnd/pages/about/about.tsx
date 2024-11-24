import Head from "next/head";
import Header from "../../components/Header";
// import Footer from "../../components/Footer";
import { NextSeo } from "next-seo";
import { FC } from "react";

const About: FC = () => {
    return (
        <div className="text-black bg-black">
            <NextSeo
                title="About Us: SFJ Scriptorium"
                description="Learn more about SFJ Scriptorium: the new way of writing code."
                canonical={`${process.env.NEXT_PUBLIC_BASE_URL}/about/about`}
                openGraph={{
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/about/about`,
                }}
            />
            <Head>
                <title>About SFJ Scriptorium</title>
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Header />
            <section className="text-gray-600 body-font">
                <div className="max-w-5xl pt-52 pb-24 mx-auto">
                    <h1 className="text-80 text-center font-4 lh-6 ld-04 font-bold text-white mb-6">
                        About SFJ Scriptorium
                    </h1>
                    <h2 className="text-2xl font-4 font-semibold lh-6 ld-04 pb-11 text-gray-700 text-center">
                        Empowering developers with clean, efficient, and inspiring tools to write better code.
                    </h2>
                </div>

                <div className="container flex flex-col items-center justify-center mx-auto">
                    <img
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/team.jpg`}
                        alt="Our Team"
                        className="object-cover object-center w-3/4 mb-10 border shadow-md g327"
                    />
                </div>

                <p className="mx-auto text-xl text-center text-gray-300 font-normal leading-relaxed fs521 lg:w-2/3">
                    SFJ Scriptorium is dedicated to providing developers with the best tools to enhance their coding experience. From beautifully crafted code templates to insightful blogs, our goal is to make coding efficient, creative, and accessible for everyone.
                </p>

                <div className="pt-12 pb-24 max-w-4xl mx-auto fsac4 md:px-1 px-3">
                    <div className="ktq4">
                        <img
                            className="w-10"
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.PNG`}
                            alt="Mission Icon"
                        />
                        <h3 className="pt-3 font-semibold text-lg text-white">
                            Our Mission
                        </h3>
                        <p className="pt-2 value-text text-md text-gray-200 fkrr1">
                            To inspire developers with tools and resources that make writing code simpler and more enjoyable, fostering creativity and collaboration across the community.
                        </p>
                    </div>
                    <div className="ktq4">
                        <img
                            className="w-10"
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.PNG`}
                            alt="Vision Icon"
                        />
                        <h3 className="pt-3 font-semibold text-lg text-white">
                            Our Vision
                        </h3>
                        <p className="pt-2 value-text text-md text-gray-200 fkrr1">
                            A world where every developer, from beginners to experts, has access to a platform that simplifies coding and sparks innovative ideas.
                        </p>
                    </div>
                    <div className="ktq4">
                        <img
                            className="w-10"
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.png`}
                            alt="Community Icon"
                        />
                        <h3 className="pt-3 font-semibold text-lg text-white">
                            Our Community
                        </h3>
                        <p className="pt-2 value-text text-md text-gray-200 fkrr1">
                            Join our growing community of passionate developers, where ideas are shared, challenges are solved, and creativity is celebrated.
                        </p>
                    </div>
                </div>

                <div className="pt-32 pb-32 max-w-6xl mx-auto fsac4 md:px-1 px-3">
                    <div className="ktq4">
                        <img
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/cats-cat.gif`}
                            alt="Team Collaboration"
                            className="w-80 h-40 object-cover"
                        />

                        <h3 className="pt-3 font-semibold text-lg text-white">
                            Collaboration at Its Best
                        </h3>
                        <p className="pt-2 value-text text-md text-gray-200 fkrr1">
                            At SFJ Scriptorium, we believe great ideas come from collaboration. Our team is constantly working to provide resources that reflect the needs and creativity of our users.
                        </p>
                    </div>
                    <div className="ktq4">
                        <img
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/dog.gif`}
                            alt="Innovative Tools"
                            className="w-80 h-40 object-cover"
                        />
                        <h3 className="pt-3 font-semibold text-lg text-white">
                            Innovative Tools and Insights
                        </h3>
                        <p className="pt-2 value-text text-md text-gray-200 fkrr1">
                            From cutting-edge templates to expert advice, explore our resources designed to make your development process smoother and more innovative.
                        </p>
                    </div>
                </div>
            </section>
            {/* <Footer /> */}
        </div>
    );
};

export default About;
