// import Head from "next/head";
// import Header from "../../components/Header";
// // import Footer from "../../components/Footer";
// import { NextSeo } from "next-seo";
// import { FC } from "react";

// const About: FC = () => {
//     return (
//         <div className="text-black bg-black">
//             <NextSeo
//                 title="About Us: SFJ Scriptorium"
//                 description="Learn more about SFJ Scriptorium: the new way of writing code."
//                 canonical={`${process.env.NEXT_PUBLIC_BASE_URL}/about/about`}
//                 openGraph={{
//                     url: `${process.env.NEXT_PUBLIC_BASE_URL}/about/about`,
//                 }}
//             />
//             <Head>
//                 <title>About SFJ Scriptorium</title>
//                 <link rel="icon" href="/favicon.png" />
//             </Head>
//             <Header />
//             <section className="text-gray-600 body-font">
//                 <div className="max-w-5xl pt-24 md:pt-40 pb-16 md:pb-24 mx-auto px-4 sm:px-6">
//                     <h1 className="text-4xl sm:text-5xl lg:text-6xl text-center font-extrabold leading-tight text-white mb-6">
//                         About SFJ Scriptorium
//                     </h1>
//                     <h2 className="text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed text-gray-400 text-center px-4 sm:px-12">
//                         Empowering developers with clean, efficient, and inspiring tools to write better code.
//                     </h2>
//                 </div>

//                 <div className="container flex flex-col items-center justify-center mx-auto">
//                     <img
//                         src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/team.jpg`}
//                         alt="Our Team"
//                         className="object-cover object-center w-3/4 mb-10 border shadow-md g327"
//                     />
//                 </div>

//                 <p className="mx-auto text-xl text-center text-gray-300 font-normal leading-relaxed fs521 lg:w-2/3">
//                     SFJ Scriptorium is dedicated to providing developers with the best tools to enhance their coding experience. From beautifully crafted code templates to insightful blogs, our goal is to make coding efficient, creative, and accessible for everyone.
//                 </p>

//                 <div className="pt-12 pb-24 max-w-4xl mx-auto fsac4 md:px-1 px-3">
//                     <div className="ktq4">
//                         <img
//                             className="w-10"
//                             src={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.PNG`}
//                             alt="Mission Icon"
//                         />
//                         <h3 className="pt-3 font-semibold text-lg text-white">
//                             Our Mission
//                         </h3>
//                         <p className="pt-2 value-text text-md text-gray-200 fkrr1">
//                             To inspire developers with tools and resources that make writing code simpler and more enjoyable, fostering creativity and collaboration across the community.
//                         </p>
//                     </div>
//                     <div className="ktq4">
//                         <img
//                             className="w-10"
//                             src={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.PNG`}
//                             alt="Vision Icon"
//                         />
//                         <h3 className="pt-3 font-semibold text-lg text-white">
//                             Our Vision
//                         </h3>
//                         <p className="pt-2 value-text text-md text-gray-200 fkrr1">
//                             A world where every developer, from beginners to experts, has access to a platform that simplifies coding and sparks innovative ideas.
//                         </p>
//                     </div>
//                     <div className="ktq4">
//                         <img
//                             className="w-10"
//                             src={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.png`}
//                             alt="Community Icon"
//                         />
//                         <h3 className="pt-3 font-semibold text-lg text-white">
//                             Our Community
//                         </h3>
//                         <p className="pt-2 value-text text-md text-gray-200 fkrr1">
//                             Join our growing community of passionate developers, where ideas are shared, challenges are solved, and creativity is celebrated.
//                         </p>
//                     </div>
//                 </div>

//                 <div className="pt-32 pb-32 max-w-6xl mx-auto fsac4 md:px-1 px-3">
//                     <div className="ktq4">
//                         <img
//                             src={`${process.env.NEXT_PUBLIC_BASE_URL}/cats-cat.gif`}
//                             alt="Team Collaboration"
//                             className="w-80 h-40 object-cover"
//                         />

//                         <h3 className="pt-3 font-semibold text-lg text-white">
//                             Collaboration at Its Best
//                         </h3>
//                         <p className="pt-2 value-text text-md text-gray-200 fkrr1">
//                             At SFJ Scriptorium, we believe great ideas come from collaboration. Our team is constantly working to provide resources that reflect the needs and creativity of our users.
//                         </p>
//                     </div>
//                     <div className="ktq4">
//                         <img
//                             src={`${process.env.NEXT_PUBLIC_BASE_URL}/dog.gif`}
//                             alt="Innovative Tools"
//                             className="w-80 h-40 object-cover"
//                         />
//                         <h3 className="pt-3 font-semibold text-lg text-white">
//                             Innovative Tools and Insights
//                         </h3>
//                         <p className="pt-2 value-text text-md text-gray-200 fkrr1">
//                             From cutting-edge templates to expert advice, explore our resources designed to make your development process smoother and more innovative.
//                         </p>
//                     </div>
//                 </div>
//             </section>
//             {/* <Footer /> */}
//         </div>
//     );
// };

// export default About;



import Head from "next/head";
import Header from "../../components/Header";
import { NextSeo } from "next-seo";
import { FC } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const About: FC = () => {
    const { theme } = useTheme(); // Use the theme context

    return (
        <div className={`text-${theme === 'dark' ? 'white' : 'black'} bg-${theme === 'dark' ? 'black' : 'white'}`}>
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
            <section className={`text-${theme === 'dark' ? 'gray-400' : 'gray-600'} body-font`}>
                <div className="max-w-5xl pt-24 md:pt-40 pb-16 md:pb-24 mx-auto px-4 sm:px-6">
                    <h1 className={`text-4xl sm:text-5xl lg:text-6xl text-center font-extrabold leading-tight text-${theme === 'dark' ? 'white' : 'black'} mb-6`}>
                        About SFJ Scriptorium
                    </h1>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed text-center px-4 sm:px-12">
                        Empowering developers with clean, efficient, and inspiring tools to write better code.
                    </h2>
                </div>

                <div className="container flex flex-col items-center justify-center mx-auto">
                    <img
                        // src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/team.jpg`}
                        src="/images/team.jpg"
                        alt="Our Team"
                        className="object-cover object-center w-3/4 mb-10 border shadow-md g327"
                    />
                </div>

                <p className={`mx-auto text-xl text-center font-normal leading-relaxed fs521 lg:w-2/3 text-${theme === 'dark' ? 'gray-300' : 'gray-700'}`}>
                    SFJ Scriptorium is dedicated to providing developers with the best tools to enhance their coding experience. From beautifully crafted code templates to insightful blogs, our goal is to make coding efficient, creative, and accessible for everyone.
                </p>

                <div className="pt-12 pb-24 max-w-4xl mx-auto fsac4 md:px-1 px-3">
                    {[
                        {
                            title: "Our Mission",
                            text: "To inspire developers with tools and resources that make writing code simpler and more enjoyable, fostering creativity and collaboration across the community.",
                            imgSrc: "/favicon.PNG",
                        },
                        {
                            title: "Our Vision",
                            text: "A world where every developer, from beginners to experts, has access to a platform that simplifies coding and sparks innovative ideas.",
                            imgSrc: "/favicon.PNG",
                        },
                        {
                            title: "Our Community",
                            text: "Join our growing community of passionate developers, where ideas are shared, challenges are solved, and creativity is celebrated.",
                            imgSrc: "/favicon.png",
                        },
                    ].map((item, index) => (
                        <div key={index} className="ktq4">
                            <img
                                className={"w-10"}
                                src={`${item.imgSrc}`}
                                alt={`${item.title} Icon`}
                            />
                            <h3 className={`pt-3 font-semibold text-lg text-${theme === 'dark' ? 'white' : 'white'}`}>
                                {item.title}
                            </h3>
                            <p className={`pt-2 value-text text-md text-${theme === 'dark' ? 'gray-200' : 'gray-600'} fkrr1`}>
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="pt-32 pb-32 max-w-6xl mx-auto fsac4 md:px-1 px-3">
                    {[
                        {
                            title: "Collaboration at Its Best",
                            text: "At SFJ Scriptorium, we believe great ideas come from collaboration. Our team is constantly working to provide resources that reflect the needs and creativity of our users.",
                            imgSrc: "/cats-cat.gif",
                        },
                        {
                            title: "Innovative Tools and Insights",
                            text: "From cutting-edge templates to expert advice, explore our resources designed to make your development process smoother and more innovative.",
                            imgSrc: "/dog.gif",
                        },
                    ].map((item, index) => (
                        <div key={index} className="ktq4">
                            <img
                                src={`${item.imgSrc}`}
                                alt={item.title}
                                className="w-80 h-40 object-cover"
                            />
                            <h3 className={`pt-3 font-semibold text-lg text-${theme === 'dark' ? 'white' : 'black'}`}>
                                {item.title}
                            </h3>
                            <p className={`pt-2 value-text text-md text-${theme === 'dark' ? 'gray-200' : 'gray-600'} fkrr1`}>
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;