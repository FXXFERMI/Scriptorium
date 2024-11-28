import Head from "next/head";
import Header from "../../components/Header";
import { NextSeo } from "next-seo";
import { FC } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const PrivacyPolicy: FC = () => {
  const { theme } = useTheme(); // Use the theme context

  return (
    <div className={`text-${theme === 'dark' ? 'white' : 'black'} bg-${theme === 'dark' ? 'black' : 'white'}`}>
      <NextSeo
        title="Privacy Policy: SFJ Scriptorium"
        description="Learn how SFJ Scriptorium handles your data responsibly."
        canonical={`${process.env.NEXT_PUBLIC_BASE_URL}/about/privacy-policy`}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/about/privacy-policy`,
        }}
      />
      <Head>
        <title>Privacy Policy</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <section className={`text-${theme === 'dark' ? 'gray-400' : 'gray-600'} body-font`}>
        <div className="max-w-5xl pt-52 pb-24 mx-auto">
          <h1 className={`text-80 text-center font-4 lh-6 ld-04 font-bold text-${theme === 'dark' ? 'white' : 'black'} mb-6`}>
            Privacy Policy
          </h1>
          <h2 className={`text-2xl font-4 font-semibold lh-6 ld-04 pb-11 text-${theme === 'dark' ? 'gray-400' : 'gray-700'} text-center`}>
            Your privacy is important to us.
          </h2>
          <p className={`mx-auto text-xl text-center font-normal leading-relaxed fs521 lg:w-2/3 text-${theme === 'dark' ? 'gray-300' : 'gray-700'}`}>
            At SFJ Scriptorium, we are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you interact with our website.
          </p>
        </div>
        <div className="pt-12 pb-24 max-w-4xl mx-auto fsac4 md:px-1 px-3">
          <div className="ktq4">
            <h3 className={`pt-3 font-semibold text-lg text-${theme === 'dark' ? 'white' : 'white'}`}>1. Information We Collect</h3>
            <p className={`pt-2 value-text text-md text-${theme === 'dark' ? 'gray-200' : 'gray-100'} fkrr1`}>
              - **Personal Information**: When you register, we collect your name, email, and other relevant details.<br />
              - **Usage Data**: We track how you interact with our website to improve our services.<br />
              - **Cookies**: We use cookies to enhance your browsing experience. See our Cookies Policy for details.
            </p>
          </div>
          <div className="ktq4">
            <h3 className={`pt-3 font-semibold text-lg text-${theme === 'dark' ? 'white' : 'white'}`}>2. How We Use Your Information</h3>
            <p className={`pt-2 value-text text-md text-${theme === 'dark' ? 'gray-200' : 'gray-100'} fkrr1`}>
              - To provide and maintain our services.<br />
              - To personalize your experience.<br />
              - To send important updates and promotional material (you can opt-out anytime).
            </p>
          </div>
          <div className="ktq4">
            <h3 className={`pt-3 font-semibold text-lg text-${theme === 'dark' ? 'white' : 'white'}`}>3. How We Share Your Information</h3>
            <p className={`pt-2 value-text text-md text-${theme === 'dark' ? 'gray-200' : 'gray-100'} fkrr1`}>
              We do not sell or rent your personal information. However, we may share data with trusted third parties to enhance our services, such as analytics providers or payment processors, with your consent.
            </p>
          </div>
          <div className="ktq4">
            <h3 className={`pt-3 font-semibold text-lg text-${theme === 'dark' ? 'white' : 'white'}`}>4. Security of Your Information</h3>
            <p className={`pt-2 value-text text-md text-${theme === 'dark' ? 'gray-200' : 'gray-100'} fkrr1`}>
              We implement robust security measures to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </div>
          <div className="ktq4">
            <h3 className={`pt-3 font-semibold text-lg text-${theme === 'dark' ? 'white' : 'white'}`}>5. Your Data Rights</h3>
            <p className={`pt-2 value-text text-md text-${theme === 'dark' ? 'gray-200' : 'gray-100'} fkrr1`}>
              - Access: You can request access to your personal data.<br />
              - Correction: You can request corrections to any inaccurate information.<br />
              - Deletion: You can request deletion of your personal data, subject to legal obligations.
            </p>
          </div>
          <div className="ktq4">
            <h3 className={`pt-3 font-semibold text-lg text-${theme === 'dark' ? 'white' : 'black'}`}>6. Changes to This Policy</h3>
            <p className={`pt-2 value-text text-md text-${theme === 'dark' ? 'gray-200' : 'gray-100'} fkrr1`}>
              We may update this Privacy Policy from time to time. We encourage you to review this page periodically for any changes.
            </p>
          </div>
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
};

export default PrivacyPolicy;


// import Head from "next/head";
// import Header from "../../components/Header";
// // import Footer from "../../components/Footer";
// import { NextSeo } from "next-seo";
// import { FC } from "react";

// const PrivacyPolicy: FC = () => {
//   return (
//     <div className="text-black bg-black">
//       <NextSeo
//         title="Privacy Policy: SFJ Scriptorium"
//         description="Learn how SFJ Scriptorium handles your data responsibly."
//         canonical={`${process.env.NEXT_PUBLIC_BASE_URL}/about/privacy-policy`}
//         openGraph={{
//           url: `${process.env.NEXT_PUBLIC_BASE_URL}/about/privacy-policy`,
//         }}
//       />
//       <Head>
//         <title>Privacy Policy</title>
//         <link rel="icon" href="/favicon.png" />
//       </Head>
//       <Header />
//       <section className="text-gray-600 body-font">
//         <div className="max-w-5xl pt-52 pb-24 mx-auto">
//           <h1 className="text-80 text-center font-4 lh-6 ld-04 font-bold text-white mb-6">
//             Privacy Policy
//           </h1>
//           <h2 className="text-2xl font-4 font-semibold lh-6 ld-04 pb-11 text-gray-700 text-center">
//             Your privacy is important to us.
//           </h2>
//           <p className="mx-auto text-xl text-center text-gray-300 font-normal leading-relaxed fs521 lg:w-2/3">
//             At SFJ Scriptorium, we are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you interact with our website.
//           </p>
//         </div>
//         <div className="pt-12 pb-24 max-w-4xl mx-auto fsac4 md:px-1 px-3">
//           <div className="ktq4">
//             <h3 className="pt-3 font-semibold text-lg text-white">1. Information We Collect</h3>
//             <p className="pt-2 value-text text-md text-gray-200 fkrr1">
//               - **Personal Information**: When you register, we collect your name, email, and other relevant details.<br />
//               - **Usage Data**: We track how you interact with our website to improve our services.<br />
//               - **Cookies**: We use cookies to enhance your browsing experience. See our Cookies Policy for details.
//             </p>
//           </div>
//           <div className="ktq4">
//             <h3 className="pt-3 font-semibold text-lg text-white">2. How We Use Your Information</h3>
//             <p className="pt-2 value-text text-md text-gray-200 fkrr1">
//               - To provide and maintain our services.<br />
//               - To personalize your experience.<br />
//               - To send important updates and promotional material (you can opt-out anytime).
//             </p>
//           </div>
//           <div className="ktq4">
//             <h3 className="pt-3 font-semibold text-lg text-white">3. How We Share Your Information</h3>
//             <p className="pt-2 value-text text-md text-gray-200 fkrr1">
//               We do not sell or rent your personal information. However, we may share data with trusted third parties to enhance our services, such as analytics providers or payment processors, with your consent.
//             </p>
//           </div>
//           <div className="ktq4">
//             <h3 className="pt-3 font-semibold text-lg text-white">4. Security of Your Information</h3>
//             <p className="pt-2 value-text text-md text-gray-200 fkrr1">
//               We implement robust security measures to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure.
//             </p>
//           </div>
//           <div className="ktq4">
//             <h3 className="pt-3 font-semibold text-lg text-white">5. Your Data Rights</h3>
//             <p className="pt-2 value-text text-md text-gray-200 fkrr1">
//               - Access: You can request access to your personal data.<br />
//               - Correction: You can request corrections to any inaccurate information.<br />
//               - Deletion: You can request deletion of your personal data, subject to legal obligations.
//             </p>
//           </div>
//           <div className="ktq4">
//             <h3 className="pt-3 font-semibold text-lg text-white">6. Changes to This Policy</h3>
//             <p className="pt-2 value-text text-md text-gray-200 fkrr1">
//               We may update this Privacy Policy from time to time. We encourage you to review this page periodically for any changes.
//             </p>
//           </div>
//         </div>
//       </section>
//       {/* <Footer /> */}
//     </div>
//   );
// };

// export default PrivacyPolicy;
