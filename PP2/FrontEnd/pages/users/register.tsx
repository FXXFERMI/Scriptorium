import { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import api from '../../utils/axiosInstance';
import { useTheme } from '../../contexts/ThemeContext';

const Register = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Password confirmation check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      });

      // On successful registration
      setSuccess("Registration successful! Redirecting...");
      setError(null);

      // Redirect to login page after a brief delay
      setTimeout(() => {
        router.push('/users/login');
      }, 2000);
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            const errorMessage = error.response.data.message;
            if (errorMessage === 'Username, email, phone number, and password are required') {
              setError('All fields are required. Please complete all fields.');
            } else if (errorMessage === 'Username already exists') {
              setError('The username you entered is already in use. Please choose a different username.');
            } else if (errorMessage === 'Email already exists') {
              setError('The email you entered is already in use. Please use a different email address.');
            } else {
              setError(errorMessage);
            }
            break;
          case 500:
            setError('Internal server error. Please try again later.');
            break;
          default:
            setError('An unexpected error occurred. Please try again.');
        }
      } else {
        setError('Network error. Please check your internet connection.');
      }
    }
  };

  return (
    <div className={`mx-auto mt-[10rem] p-8 bg-${theme === 'dark' ? 'black' : 'gray-100'} text-${theme === 'dark' ? 'white' : 'black'} rounded-lg shadow-md`}>
      <Header />
      <h1 className="text-4xl font-bold mb-8 text-center">Register</h1>
      {error && <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4 font-semibold">{success}</p>}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <div>
          <label className="block font-medium mb-1">First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md bg-${theme === 'dark' ? 'gray-800' : 'white'} text-${theme === 'dark' ? 'white' : 'black'}`}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md bg-${theme === 'dark' ? 'gray-800' : 'white'} text-${theme === 'dark' ? 'white' : 'black'}`}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md bg-${theme === 'dark' ? 'gray-800' : 'white'} text-${theme === 'dark' ? 'white' : 'black'}`}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md bg-${theme === 'dark' ? 'gray-800' : 'white'} text-${theme === 'dark' ? 'white' : 'black'}`}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Phone Number:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md bg-${theme === 'dark' ? 'gray-800' : 'white'} text-${theme === 'dark' ? 'white' : 'black'}`}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md bg-${theme === 'dark' ? 'gray-800' : 'white'} text-${theme === 'dark' ? 'white' : 'black'}`}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md bg-${theme === 'dark' ? 'gray-800' : 'white'} text-${theme === 'dark' ? 'white' : 'black'}`}
          />
        </div>
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="inline-flex items-center py-3 font-semibold tracking-tighter text-white transition duration-500 ease-in-out transform bg-transparent bg-gradient-to-r from-blue-500 to-blue-800 px-14 text-md focus:shadow-outline hover:bg-blue-600"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
