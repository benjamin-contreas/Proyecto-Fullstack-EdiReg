const express = require('express');
const { getResidence } = require('../controllers/residenceController');

const router = express.Router();

// GET a single Residence
router.get('/:residenceNumber', getResidence);

module.exports = router;
