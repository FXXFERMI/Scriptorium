// import '../styles/globals.css';
// import '../styles/globals.css';
// import type { AppProps } from 'next/app';
// import { AuthProvider } from '../contexts/AuthContext';
// import { ThemeProvider } from '../contexts/ThemeContext';
// import Footer from '../components/Footer';

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <AuthProvider>
//       <ThemeProvider>
//       <>
//         <Component {...pageProps} />
//         <Footer />
//       </>
//       </ThemeProvider>
//     </AuthProvider>
//   );
// }

// export default MyApp;

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <>
          <Component {...pageProps} />
          <Footer />
        </>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
