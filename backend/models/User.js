const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    // NEW FIELD
    deathCount: { type: Number, default: 0 } 
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);