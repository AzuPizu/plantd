import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto py-4 px-6 border-t border-white/10 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-500 text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} Plant'd Lab. By Azeem and Syed Hussain. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;