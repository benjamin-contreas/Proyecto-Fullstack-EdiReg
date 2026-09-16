const express = require('express');
const { createPackage } = require('../controllers/packageController');
const { PERMISSIONS } = require('../middleware/permissions');

function createPackagesRouter(requirePermissions) {
	const router = express.Router();
	router.post('/createPackage', requirePermissions(PERMISSIONS.WRITE_OPERATIONS), createPackage);
	return router;
}

module.exports = createPackagesRouter;
