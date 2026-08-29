const express = require('express');
const {
	createFrequentVisitor, getFrequentVisitor, getFrequentVisitorByPlate,
	deleteFrequentVisitor, updateFrequentVisitor,
} = require('../controllers/frequentVisitorController');
const { createVisitorLog } = require('../controllers/visitorLogController');

const router = express.Router();
router.get('/searchRut', getFrequentVisitor);
router.get('/searchPlate', getFrequentVisitorByPlate);
router.post('/newFrequentVisitor', createFrequentVisitor);
router.post('/visitRegistry', createVisitorLog);
router.delete('/:rut', deleteFrequentVisitor);
router.patch('/:rut', updateFrequentVisitor);

module.exports = router;
