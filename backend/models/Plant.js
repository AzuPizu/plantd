const mongoose = require('mongoose');

// Define the structure for a single Care Log entry
const CareLogSchema = new mongoose.Schema({
    actionType: {
        type: String,
        required: true,
        enum: ['Watered', 'Fertilized', 'Repotted', 'Pruned', 'TreatedPest', 'Other'],
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    notes: {
        type: String,
        trim: true,
    },
});

// Define the main Plant Schema
const PlantSchema = new mongoose.Schema({
    // --- Basic Identification & Ownership ---
    name: {
        type: String,
        required: [true, 'A plant name is required.'],
        trim: true,
    },
    species: {
        type: String,
        trim: true,
        default: 'Unknown',
    },

    // UPDATED: Now strictly linked to the User collection
    // This userId is the Foreign Key that connects to the User's Primary Key
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',      // Links to the 'User' model
        required: true,   // Ensures every plant must belong to a user
    },

    // --- Care Parameters ---
    baseWateringDays: {
        type: Number,
        required: [true, 'The base watering interval (in days) is required.'],
        min: 1, 
    },
    
    lastWateredDate: {
        type: Date,
        required: [true, 'The last watered date is required to start the schedule.'],
    },
    
    // --- Status, Location, & Image ---
    location: {
        type: String,
        trim: true,
        enum: ['Indoor', 'Outdoor', 'Balcony', 'Office', 'Other'],
        default: 'Indoor',
    },
    imageUrl: {
        type: String,
        default: '/images/default-plant.png', 
    },

    // --- History and Logs ---
    careHistory: [CareLogSchema], 
    
    // --- Timestamps ---
    createdAt: {
        type: Date,
        default: Date.now,
    },
    acquiredDate: {
        type: Date,
    },
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Plant', PlantSchema);