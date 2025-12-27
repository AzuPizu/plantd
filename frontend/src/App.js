import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// Import Pages (Matching your exact names)
import HomePage from './pages/HomePage';
import About from './pages/About';
import MyCollection from './pages/MyCollection';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0a1a0a]">
        {/* Navbar appears on every page */}

        {/* The content that changes based on the URL */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/collection" element={<MyCollection />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </main>

        {/* Footer appears on every page */}
      </div>
    </Router>
  );
}

export default App;