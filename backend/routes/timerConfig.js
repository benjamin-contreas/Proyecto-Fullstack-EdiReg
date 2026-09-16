const express = require('express');
const {
	updateConfig,
	getTimerConfig,
} = require('../controllers/timerConfigController');
const { PERMISSIONS } = require('../middleware/permissions');

function createTimerConfigRouter(requirePermissions) {
	const router = express.Router();
	router.post('/updateConfig', requirePermissions(PERMISSIONS.MANAGE_CONFIGURATION), updateConfig);
	router.get('/getConfig', requirePermissions(PERMISSIONS.READ_OPERATIONS), getTimerConfig);
	return router;
}

module.exports = createTimerConfigRouter;
