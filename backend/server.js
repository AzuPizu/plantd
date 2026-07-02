require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Make sure the DB is connected (or wait on the connection already in
// progress) BEFORE any route handler runs. On a warm serverless instance
// this resolves instantly. On a cold start it waits for the real
// connection instead of letting a query fire too early and fail.
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(503).json({ msg: 'Database temporarily unavailable, please try again.' });
    }
});

// --- ROUTE IMPORTS ---
const plantRoutes = require('./routes/plantRoutes');
const authRoutes = require('./routes/auth');

// --- ROUTE USAGE ---
app.use('/api/plants', plantRoutes);
app.use('/api/auth', authRoutes);

// --- LOCAL DEV SERVER ---
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    connectDB().then(() => {
        app.listen(port, () => {
            console.log(`✅ Server running locally on port ${port}`);
        });
    });
}

// Crucial for Vercel to handle serverless invocation
module.exports = app;
