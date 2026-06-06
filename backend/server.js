require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); // Parses incoming JSON requests

// --- ROUTE IMPORTS ---
const plantRoutes = require('./routes/plantRoutes');
const authRoutes = require('./routes/auth'); // <--- MISSING IMPORT

// --- ROUTE USAGE ---
app.use('/api/plants', plantRoutes);
app.use('/api/auth', authRoutes); // <--- MISSING LINK: Now /api/auth/signin will work

// --- DATABASE CONNECTION ---
const port = process.env.PORT || 5000;

// Connect to MongoDB without trapping the Express app boot cycle
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((error) => console.error('❌ MongoDB connection failed:', error.message));

// Only run app.listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`✅ Server running locally on port ${port}`);
    });
}

// Crucial for Vercel to handle serverless invocation
module.exports = app;