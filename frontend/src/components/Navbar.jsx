import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  
  // 1. Check if user is logged in based on localStorage
  const isLoggedIn = !!localStorage.getItem('userId');

  // 2. The Sign Out function
  const handleSignOut = () => {
    // Remove the user ID (the "key" to their collection)
    localStorage.removeItem('userId'); 
    
    // Redirect the user to the Home page after signing out
    navigate('/'); 
    
    // Optional: Refresh to ensure all states are reset
    window.location.reload(); 
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
          
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Plant'd Logo" className="h-10 w-auto" />
            <span className="text-white font-bold text-xl tracking-tighter">PLANT'D</span>
          </Link>

          {/* Middle: Conditional Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white/80 hover:text-white transition-colors font-medium">Home</Link>
            <Link to="/about" className="text-white/80 hover:text-white transition-colors font-medium">About</Link>
            
            {/* Show these links only if logged in */}
            {isLoggedIn && (
              <>
                <Link to="/collection" className="text-white/80 hover:text-white transition-colors font-medium">My Collection</Link>
                <Link to="/dashboard" className="text-white/80 hover:text-white transition-colors font-medium">Dashboard</Link>
              </>
            )}
          </div>

          {/* Right: Toggle Button */}
          <div>
            {isLoggedIn ? (
              // If logged in, show SIGN OUT button with the logout logic
              <button 
                onClick={handleSignOut}
                className="bg-red-500/20 hover:bg-red-500/40 text-white border border-red-500/30 px-6 py-2 rounded-xl transition-all active:scale-95 font-semibold"
              >
                Sign Out
              </button>
            ) : (
              // If NOT logged in, show SIGN IN link
              <Link to="/signin">
                <button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2 rounded-xl transition-all active:scale-95 font-semibold">
                  Sign In
                </button>
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;