import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axiosInstance';

interface ModalLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalLogin: React.FC<ModalLoginProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post(
        '/api/users/login',
        { username, password },
        { withCredentials: true }
      );

      // Set the access token in cookies
      Cookies.set('accessToken', response.data.accessToken, { path: '/' });

      // Update the login state globally
      login();

      // Reset form and close the modal on successful login
      resetForm();
      onClose();

      // Redirect to the homepage after successful login
      router.push('/');
    } catch (error: any) {
      // Check the error response to handle specific error messages from the backend
      if (error.response) {
        if (error.response.status === 400) {
          // Check the error message to handle specific cases
          const errorMessage = error.response.data.message;
          if (errorMessage === 'User not found') {
            setError('The provided username does not exist.');
          } else if (errorMessage === 'Invalid password') {
            setError('The provided password is incorrect.');
          } else {
            setError('Invalid login credentials.');
          }
        } else if (error.response.status === 500) {
          setError('An internal server error occurred. Please try again later.');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        // Handle unexpected errors that do not have a response
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleClose = () => {
    resetForm(); // Reset the form whenever the modal is closed
    onClose();
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full z-50">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={handleClose}>
          ✖
        </button>
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalLogin;
