const express = require('express');
const {
	createFrequentVisitor, getFrequentVisitor, getFrequentVisitorByPlate,
	deleteFrequentVisitor, updateFrequentVisitor,
} = require('../controllers/frequentVisitorController');
const { createVisitorLog } = require('../controllers/visitorLogController');
const { PERMISSIONS } = require('../middleware/permissions');

function createVisitsRouter(requirePermissions) {
	const router = express.Router();
	router.get('/searchRut', requirePermissions(PERMISSIONS.READ_OPERATIONS), getFrequentVisitor);
	router.get('/searchPlate', requirePermissions(PERMISSIONS.READ_OPERATIONS), getFrequentVisitorByPlate);
	router.post('/newFrequentVisitor', requirePermissions(PERMISSIONS.WRITE_OPERATIONS), createFrequentVisitor);
	router.post('/visitRegistry', requirePermissions(PERMISSIONS.WRITE_OPERATIONS), createVisitorLog);
	router.delete('/:rut', requirePermissions(PERMISSIONS.WRITE_OPERATIONS), deleteFrequentVisitor);
	router.patch('/:rut', requirePermissions(PERMISSIONS.WRITE_OPERATIONS), updateFrequentVisitor);
	return router;
}

module.exports = createVisitsRouter;
