// THIS CODE IS BASED ON CHAT GPT AND NOT OUR ORIGINAL THOUGHTS 

import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/login', { username, password });
      
      // Set the refreshToken in cookies if the server has not set it as HttpOnly
      Cookies.set('accessToken', response.data.accessToken, { path: '/' });
      
      // Redirect to profile page after successful login
      router.push('/profile');
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
