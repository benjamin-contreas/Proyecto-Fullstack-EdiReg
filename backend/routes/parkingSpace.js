const express = require('express');
const {
	assignParkingSpace,
	createParkingSpace,
	getAllParkingSpaces,
	toggleParkingSpaceUse,
} = require('../controllers/parkingSpaceController');

const router = express.Router();

// Assign a parking space
router.post('/assignSpace', assignParkingSpace);

// Create a new parking space
router.post('/createSpace', createParkingSpace);

router.get('/allSpaces', getAllParkingSpaces);

router.patch('/toggleUse/:id', toggleParkingSpaceUse);

module.exports = router;
