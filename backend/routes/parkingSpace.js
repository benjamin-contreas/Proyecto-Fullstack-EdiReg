const express = require('express');
const {
	assignParkingSpace,
	createParkingSpace,
	getAllParkingSpaces,
	toggleParkingSpaceUse,
} = require('../controllers/parkingSpaceController');
const { PERMISSIONS } = require('../middleware/permissions');

function createParkingSpaceRouter(requirePermissions) {
	const router = express.Router();
	router.post('/assignSpace', requirePermissions(PERMISSIONS.WRITE_OPERATIONS), assignParkingSpace);
	router.post('/createSpace', requirePermissions(PERMISSIONS.MANAGE_CONFIGURATION), createParkingSpace);
	router.get('/allSpaces', requirePermissions(PERMISSIONS.READ_OPERATIONS), getAllParkingSpaces);
	router.patch('/toggleUse/:id', requirePermissions(PERMISSIONS.WRITE_OPERATIONS), toggleParkingSpaceUse);
	return router;
}

module.exports = createParkingSpaceRouter;
