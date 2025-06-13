const express = require('express');
const { createPackage } = require('../controllers/packageController');

const router = express.Router();

// POST a single package
router.post('/createPackage', createPackage);

module.exports = router;
