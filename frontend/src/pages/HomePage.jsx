import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import bg from '../assets/bg.jpg';

const HomePage = () => {
  // Check if the user is logged in
  const isLoggedIn = !!localStorage.getItem('userId');

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center px-8 md:px-24"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundColor: 'rgba(10, 26, 10, 0.7)',
        backgroundBlendMode: 'multiply'
      }}
    >
      <Navbar />
      <div className="container mx-auto px-6 md:px-12 flex items-center">

        {/* Left Side: Large Text and Button */}
        <div className="w-full md:w-2/3 text-left">
          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
            PLANT'D.
          </h1>
          <h2 className="text-3xl md:text-4xl font-light text-green-100/80 mb-8 max-w-xl leading-relaxed">
            Helping your plants thrive, <br />
            <span className="font-semibold text-white">Not just survive.</span>
          </h2>

          {/* Conditional Path and Text */}
          <Link
            to={isLoggedIn ? "/collection" : "/signin"}
            className="inline-block bg-white/10 backdrop-blur-lg border border-white/20 text-white text-xl font-bold py-4 px-10 rounded-full shadow-2xl transition duration-300 transform hover:scale-105 hover:bg-green-500/20 active:scale-95"
          >
            {isLoggedIn ? "View Your Collection" : "Start My Collection"}
          </Link>
        </div>

        {/* Right Side: Subtle Glass Ornament */}
        <div className="hidden lg:block w-1/3">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500 group">
            <div className="h-48 w-full overflow-hidden rounded-xl mb-4 border border-white/5 bg-gradient-to-br from-green-900/40 to-black/20 flex items-center justify-center">
              <img 
                src="https://static.vecteezy.com/system/resources/previews/046/984/913/non_2x/a-plant-with-a-large-leaf-that-is-in-a-black-pot-isolated-on-transparent-background-free-png.png" 
                alt="Featured Plant" 
                className="h-full w-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="h-4 w-3/4 bg-white/20 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-white/10 rounded"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;