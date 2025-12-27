import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bg from '../assets/bg.jpg'; // Ensure this matches your Homepage import

const About = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col" // Added bg-fixed
      style={{
        backgroundImage: `url(${bg})`,
        backgroundColor: 'rgba(10, 26, 10, 0.7)',
        backgroundBlendMode: 'multiply'
      }}
    >
      {/* 1. Navbar at the top */}
      <Navbar />

      {/* 2. Main Content - flex-grow ensures the footer stays at the bottom */}
      <main className="flex-grow pt-32 pb-20 px-6 flex justify-center items-center">
        <div className="max-w-4xl w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 shadow-2xl">
          <h1 className="text-5xl font-bold text-white mb-8">About Plant'd</h1>

          <p className="text-xl text-gray-300 leading-loose mb-10">
            Plant’d brings all your plants into one organized digital space, making it easy to track your collection 
            and receive personalized reminders so every plant gets the care it needs, on time.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/20 p-8 rounded-3xl border border-white/5">
              <h3 className="text-green-400 font-bold text-xl mb-3">Muhammad Azeem</h3>
              <p className="text-gray-400">Passion for the niche hobbies, and will go to great lengths to see them thrive.</p>
            </div>

            <div className="bg-black/20 p-8 rounded-3xl border border-white/5">
              <h3 className="text-green-400 font-bold text-xl mb-3">Syed Hussain</h3>
              <p className="text-gray-400">Hard working individual who loves to create digital solutions for the hobbyists.</p>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default About;