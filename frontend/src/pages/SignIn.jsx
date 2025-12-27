import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bg from '../assets/bg.jpg';

const SignIn = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // State to toggle visibility
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

    if (!isSignIn && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const endpoint = isSignIn ? '/api/auth/signin' : '/api/auth/signup';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();

      if (response.ok) {
        if (isSignIn) {
          localStorage.setItem('userId', data.userId);
          navigate('/dashboard'); 
        } else {
          setSuccessMsg('Sign Up Successful! Please log in.');
          setIsSignIn(true); 
          setFormData({ fullName: '', email: '', password: '', confirmPassword: '' }); 
        }
      } else {
        alert(data.msg);
      }
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col" 
      style={{ backgroundImage: `url(${bg})`, backgroundColor: 'rgba(10, 26, 10, 0.7)', backgroundBlendMode: 'multiply' }}
    >
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-6 pt-32 pb-20">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] shadow-2xl">
          <h2 className="text-4xl font-bold text-white text-center mb-6 tracking-tighter">
            {isSignIn ? 'Welcome Back.' : 'Join the Garden.'}
          </h2>

          {successMsg && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-400 text-sm py-3 px-4 rounded-xl mb-6 text-center animate-pulse">
              {successMsg}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isSignIn && (
              <input 
                type="text" placeholder="Full Name" required
                value={formData.fullName}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            )}
            <input 
              type="email" placeholder="Email Address" required
              value={formData.email}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            
            {/* Password Field with Toggle */}
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" required
                value={formData.password}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors text-xs font-bold tracking-widest"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            {/* Confirm Password Field with Toggle */}
            {!isSignIn && (
              <div className="relative animate-in slide-in-from-top-2 duration-300">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Confirm Password" required
                  value={formData.confirmPassword}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors text-xs font-bold tracking-widest"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-400 text-white font-black py-4 rounded-2xl shadow-xl transition transform active:scale-95 mt-2"
            >
              {isSignIn ? 'LOG IN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-8 text-sm font-light">
            {isSignIn ? "Don't have an account? " : "Already a member? "}
            <button 
              onClick={() => { 
                setIsSignIn(!isSignIn); 
                setSuccessMsg('');
                setShowPassword(false);
                setFormData({ fullName: '', email: '', password: '', confirmPassword: '' }); 
              }} 
              className="text-green-400 font-semibold hover:text-white transition underline underline-offset-4"
            >
              {isSignIn ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;