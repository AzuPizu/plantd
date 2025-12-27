const express = require('express');
const {
    createPlant,
    getPlants, // Now expects a userId parameter
    getPlant,
    updatePlant,
    deletePlant
} = require('../controllers/plantController');
const upload = require('../middleware/upload'); 

const router = express.Router();

// 1. GET all plants for a specific user
// This matches the controller's new Plant.find({ userId }) logic
router.get('/user/:userId', getPlants);

// 2. GET a single plant by ID
router.get('/:id', getPlant);

// 3. POST a new plant (includes image upload and userId in body)
router.post('/', upload.single('image'), createPlant);

// 4. UPDATE a plant by ID (allows updating image)
router.patch('/:id', upload.single('image'), updatePlant);

// 5. DELETE a plant by ID
router.delete('/:id', deletePlant);

module.exports = router;