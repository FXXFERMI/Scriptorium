import Head from "next/head";
import Header from "../../components/Header";
import { NextSeo } from "next-seo";
import { FC } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const TermsOfService: FC = () => {
  const { theme } = useTheme(); // Use the theme context

  return (
    <div className={`text-${theme === 'dark' ? 'white' : 'black'} bg-${theme === 'dark' ? 'black' : 'white'}`}>
      <NextSeo
        title="Terms of Service: SFJ Scriptorium"
        description="Review the terms and conditions for using SFJ Scriptorium."
        canonical={`${process.env.NEXT_PUBLIC_BASE_URL}/about/terms-of-service`}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/about/terms-of-service`,
        }}
      />
      <Head>
        <title>Terms of Service</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <section className={`text-${theme === 'dark' ? 'gray-400' : 'gray-600'} body-font`}>
        <div className="max-w-5xl pt-52 pb-24 mx-auto">
          <h1 className={`text-80 text-center font-4 lh-6 ld-04 font-bold text-${theme === 'dark' ? 'white' : 'black'} mb-6`}>
            Terms of Service
          </h1>
          <h2 className={`text-2xl font-4 font-semibold lh-6 ld-04 pb-11 text-${theme === 'dark' ? 'gray-400' : 'gray-700'} text-center`}>
            Please read these terms carefully before using our website.
          </h2>
          <p className={`mx-auto text-xl text-center font-normal leading-relaxed fs521 lg:w-2/3 text-${theme === 'dark' ? 'gray-300' : 'gray-700'}`}>
            These Terms of Service ("Terms") govern your use of the SFJ Scriptorium website. By accessing or using our services, you agree to these Terms.
          </p>
        </div>
        <div className="pt-12 pb-24 max-w-4xl mx-auto fsac4 md:px-1 px-3">
          <div className="ktq4">
            <h3 className={`pt-3 font-semibold text-lg text-${theme === 'dark' ? 'white' : 'white'}`}>1. Use of Services</h3>
            <p className={`pt-2 value-text text-md text-${theme === 'dark' ? 'gray-200' : 'gray-100'} fkrr1`}>
              You agree to use our website for lawful purposes only and to respect the intellectual property rights of SFJ Scriptorium.
            </p>
          </div>
          <div className="ktq4">
            <h3 className={`pt-3 font-semibold text-lg text-${theme === 'dark' ? 'white' : 'white'}`}>2. User Accounts</h3>
            <p className={`pt-2 value-text text-md text-${theme === 'dark' ? 'gray-200' : 'gray-100'} fkrr1`}>
              You are responsible for maintaining the confidentiality of your account and password and for all activities under your account.
            </p>
          </div>
          <div className="ktq4">
            <h3 className={`pt-3 font-semibold text-lg text-${theme === 'dark' ? 'white' : 'white'}`}>3. Limitation of Liability</h3>
            <p className={`pt-2 value-text text-md text-${theme === 'dark' ? 'gray-200' : 'gray-100'} fkrr1`}>
              SFJ Scriptorium is not liable for any damages resulting from the use or inability to use our website or services.
            </p>
          </div>
          <div className="ktq4">
            <h3 className={`pt-3 font-semibold text-lg text-${theme === 'dark' ? 'white' : 'white'}`}>4. Changes to Terms</h3>
            <p className={`pt-2 value-text text-md text-${theme === 'dark' ? 'gray-200' : 'gray-100'} fkrr1`}>
              We reserve the right to modify these Terms at any time. Continued use of our services constitutes your acceptance of the changes.
            </p>
          </div>
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
};

export default TermsOfService;


// import Head from "next/head";
// import Header from "../../components/Header";
// // import Footer from "../../components/Footer";
// import { NextSeo } from "next-seo";
// import { FC } from "react";

// const TermsOfService: FC = () => {
//   return (
//     <div className="text-black bg-black">
//       <NextSeo
//         title="Terms of Service: SFJ Scriptorium"
//         description="Review the terms and conditions for using SFJ Scriptorium."
//         canonical={`${process.env.NEXT_PUBLIC_BASE_URL}/about/terms-of-service`}
//         openGraph={{
//           url: `${process.env.NEXT_PUBLIC_BASE_URL}/about/terms-of-service`,
//         }}
//       />
//       <Head>
//         <title>Terms of Service</title>
//         <link rel="icon" href="/favicon.png" />
//       </Head>
//       <Header />
//       <section className="text-gray-600 body-font">
//         <div className="max-w-5xl pt-52 pb-24 mx-auto">
//           <h1 className="text-80 text-center font-4 lh-6 ld-04 font-bold text-white mb-6">
//             Terms of Service
//           </h1>
//           <h2 className="text-2xl font-4 font-semibold lh-6 ld-04 pb-11 text-gray-700 text-center">
//             Please read these terms carefully before using our website.
//           </h2>
//           <p className="mx-auto text-xl text-center text-gray-300 font-normal leading-relaxed fs521 lg:w-2/3">
//             These Terms of Service ("Terms") govern your use of the SFJ Scriptorium website. By accessing or using our services, you agree to these Terms.
//           </p>
//         </div>
//         <div className="pt-12 pb-24 max-w-4xl mx-auto fsac4 md:px-1 px-3">
//           <div className="ktq4">
//             <h3 className="pt-3 font-semibold text-lg text-white">1. Use of Services</h3>
//             <p className="pt-2 value-text text-md text-gray-200 fkrr1">
//               You agree to use our website for lawful purposes only and to respect the intellectual property rights of SFJ Scriptorium.
//             </p>
//           </div>
//           <div className="ktq4">
//             <h3 className="pt-3 font-semibold text-lg text-white">2. User Accounts</h3>
//             <p className="pt-2 value-text text-md text-gray-200 fkrr1">
//               You are responsible for maintaining the confidentiality of your account and password and for all activities under your account.
//             </p>
//           </div>
//           <div className="ktq4">
//             <h3 className="pt-3 font-semibold text-lg text-white">3. Limitation of Liability</h3>
//             <p className="pt-2 value-text text-md text-gray-200 fkrr1">
//               SFJ Scriptorium is not liable for any damages resulting from the use or inability to use our website or services.
//             </p>
//           </div>
//           <div className="ktq4">
//             <h3 className="pt-3 font-semibold text-lg text-white">4. Changes to Terms</h3>
//             <p className="pt-2 value-text text-md text-gray-200 fkrr1">
//               We reserve the right to modify these Terms at any time. Continued use of our services constitutes your acceptance of the changes.
//             </p>
//           </div>
//         </div>
//       </section>
//       {/* <Footer /> */}
//     </div>
//   );
// };

// export default TermsOfService;
