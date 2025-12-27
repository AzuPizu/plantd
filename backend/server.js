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
const port = process.env.PORT || 5000; // Switch to 5000 to match your frontend fetch
const mongoURI = process.env.MONGO_URI;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        app.listen(port, () => {
            console.log(`✅ Server is ready on port ${port}!`);
            console.log(`📡 Auth Endpoint: http://localhost:${port}/api/auth`);
            console.log(`📡 Plant Endpoint: http://localhost:${port}/api/plants`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection failed:', error.message);
    });