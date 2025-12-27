const Plant = require('../models/Plant');
const mongoose = require('mongoose');

// --- C: CREATE a new plant ---
const createPlant = async (req, res) => {
    try {
        // Log the incoming data to your terminal to debug
        console.log("Body received:", req.body);
        console.log("File received:", req.file);

        const { name, species, baseWateringDays, location, lastWateredDate, userId } = req.body;

        // 1. Strict Validation
        if (!name || !baseWateringDays || !lastWateredDate || !userId) {
            return res.status(400).json({ 
                error: `Missing required fields: ${!userId ? 'userId ' : ''}${!name ? 'name ' : ''}`.trim() 
            });
        }

        // 2. Handle Image URL (Multer puts file info in req.file)
        // If a file was uploaded, use its path; otherwise use a default
        const imageUrl = req.file ? req.file.path : '/images/default-plant.png';

        // 3. Create the document with explicit Type Casting
        const plant = await Plant.create({ 
            name, 
            species: species || 'Unknown', 
            baseWateringDays: Number(baseWateringDays), // Force to Number
            location: location || 'Indoor', 
            lastWateredDate: new Date(lastWateredDate), // Force to Date object
            userId, 
            imageUrl
        });

        res.status(201).json(plant); 
    } catch (error) {
        // Log the exact error to your backend terminal
        console.error("CRASH IN CREATEPLANT:", error.message);
        res.status(500).json({ error: "Server crashed during plant creation. Check terminal logs." });
    }
};

// --- R: READ (GET) plants for a specific user ---
const getPlants = async (req, res) => {
    const { userId } = req.params; // We pass userId in the URL params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid User ID.' });
    }

    try {
        // CRITICAL: Filter by userId so users only see THEIR collection
        const plants = await Plant.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(plants);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch your plants.' });
    }
};

// --- R: READ (GET) a single plant ---
const getPlant = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such plant found.' });
    }

    const plant = await Plant.findById(id);

    if (!plant) {
        return res.status(404).json({ error: 'No such plant found.' });
    }

    res.status(200).json(plant);
};

// --- U: UPDATE a plant ---
const updatePlant = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such plant found.' });
    }
    
    const plant = await Plant.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!plant) {
        return res.status(404).json({ error: 'No such plant found.' });
    }

    res.status(200).json(plant);
};

// --- D: DELETE a plant ---
const deletePlant = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such plant found.' });
    }

    const plant = await Plant.findByIdAndDelete(id);

    if (!plant) {
        return res.status(404).json({ error: 'No such plant found.' });
    }

    res.status(200).json(plant);
};

module.exports = {
    createPlant,
    getPlants,
    getPlant,
    updatePlant,
    deletePlant
};