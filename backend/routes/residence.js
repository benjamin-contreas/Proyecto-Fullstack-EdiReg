const express = require('express');
const { getResidence } = require('../controllers/residenceController');
const { PERMISSIONS } = require('../middleware/permissions');

function createResidenceRouter(requirePermissions) {
	const router = express.Router();
	router.get('/:residenceNumber', requirePermissions(PERMISSIONS.READ_OPERATIONS), getResidence);
	return router;
}

module.exports = createResidenceRouter;
