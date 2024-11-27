import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();  // Use the login function from AuthContext

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
        { username, password },
        { withCredentials: true }
      );

      // Set the access token and refresh token in cookies
      Cookies.set('accessToken', response.data.accessToken, { path: '/' });
      // console.log(Cookies.get('accessToken'))
      // Cookies.set('refreshToken', response.data.refreshToken, { path: '/' });

      // Call the login function from AuthContext to set the global login state
      login();

      // console.log("Login successful:", response.data);

      // Set the success message
      setSuccessMessage("Login successful! Redirecting in 3 seconds...");
      setError(null);

      // Delay the redirect by 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error: any) {
      // //console.error("Login failed:", error);
      setError(error.response?.data?.message || "Login failed");
      setSuccessMessage(null);
    }
  };

  return (
    <div className="mx-auto mt-[10rem] p-8 bg-black text-white rounded-lg shadow-md">
      <Header />
      <h1 className="text-4xl font-bold mb-8 text-center">Please Login</h1>
      {error && <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4 font-semibold">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <div>
          <label className="block font-medium mb-1">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded-md bg-white text-black"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md bg-white text-black"
          />
        </div>
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="inline-flex items-center py-3 font-semibold tracking-tighter text-white transition duration-500 ease-in-out transform bg-transparent bg-gradient-to-r from-blue-500 to-blue-800 px-14 text-md focus:shadow-outline hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
