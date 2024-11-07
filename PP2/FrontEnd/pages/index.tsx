import { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
      <h1 className="$1 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500">This is the Home Page and Hard Working Fermi</h1>
        <img 
          src="/cats-cat.gif" 
          alt="Animated GIF" 
          className="w-64 h-64 mx-auto rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};
export default Home;
