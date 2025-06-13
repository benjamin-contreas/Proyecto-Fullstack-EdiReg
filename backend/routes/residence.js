const express = require('express');
const {
	createResidence,
	getResidence,
} = require('../controllers/residenceController');

const router = express.Router();

// GET a single Residence
router.get('/:residenceNumber', getResidence);

// POST a single Residence
router.post('/', createResidence);

module.exports = router;
