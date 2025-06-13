const express = require('express');
const {
	updateConfig,
	getTimerConfig,
} = require('../controllers/timerConfigController');

const router = express.Router();

// Update timer configuration
router.post('/updateConfig', updateConfig);

router.get('/getConfig', getTimerConfig);

module.exports = router;
