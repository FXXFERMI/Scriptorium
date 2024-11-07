import { NextPage } from 'next';
import Navbar from '../components/Navbar'; // Make sure the path is correct based on your file structure

const Home: NextPage = () => {
  return (
    <div className="h-screen bg-gray-100">
      <Navbar /> {/* Using the Navbar component */}
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500">
            This is the Home Page and Hard Working Fermi
          </h1>
          <img 
            src="/cats-cat.gif" 
            alt="Animated GIF" 
            className="w-64 h-64 mx-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
