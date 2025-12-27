const express = require('express');
const router = express.Router();
const User = require('../models/User');

// SIGN UP ROUTE
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ fullName, email, password });
        await user.save();
        
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// SIGN IN ROUTE
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || user.password !== password) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // In a real app, you'd send a JWT token here
        res.json({ msg: 'Logged in', userId: user._id });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        // Send back the full name for the dashboard greeting
        res.json({ fullName: user.fullName,
            deathCount: user.deathCount || 0
         });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.patch('/increment-death/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { $inc: { deathCount: 1 } }, 
            { new: true }
        );
        res.json({ msg: "Death recorded", deathCount: user.deathCount });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;