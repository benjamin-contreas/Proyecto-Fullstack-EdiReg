const express = require('express');
const {
	createFrequentVisitor,
	getFrequentVisitor,
	getFrequentVisitorByPlate,
	deleteFrequentVisitor,
	updateFrequentVisitor,
} = require('../controllers/frequentVisitorController');
const { createVisitorLog } = require('../controllers/vistorLogContoller');

const router = express.Router();

// GET a single frequent visitor
router.get('/searchRut', getFrequentVisitor);

// GET a single frequent visitor by the vehicle license plate
router.get('/searchPlate', getFrequentVisitorByPlate);

// POST a new frequent visitor
router.post('/newFrequentVisitor', createFrequentVisitor);
// POST the visit registry
router.post('/visitRegistry', createVisitorLog);

// DELETE frequent visitor
router.delete('/:rut', deleteFrequentVisitor);
// UPDATE frequent visitor
router.patch('/:rut', updateFrequentVisitor);

module.exports = router;
