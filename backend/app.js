const cors = require('cors');
const express = require('express');
const { createAccessControl, handleAuthError } = require('./middleware/auth');
const createPackagesRouter = require('./routes/packages');
const createParkingSpaceRouter = require('./routes/parkingSpace');
const createResidenceRouter = require('./routes/residence');
const createTimerConfigRouter = require('./routes/timerConfig');
const createVisitsRouter = require('./routes/visits');

function unavailableAccessControl() {
	const unavailable = (request, response) => response.status(503).json({
		error: 'authentication_not_configured',
		message: 'Auth0 API authentication is not configured',
	});

	return {
		configured: false,
		requirePermissions: () => unavailable,
		validateAccessToken: unavailable,
	};
}

function accessControlFromEnvironment(environment) {
	if (!environment.AUTH0_AUDIENCE || !environment.AUTH0_ISSUER_BASE_URL) {
		return unavailableAccessControl();
	}

	return createAccessControl({
		audience: environment.AUTH0_AUDIENCE,
		issuerBaseURL: environment.AUTH0_ISSUER_BASE_URL,
	});
}

function createApp({ accessControl = accessControlFromEnvironment(process.env) } = {}) {
	const app = express();
	const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
	const { requirePermissions, validateAccessToken } = accessControl;

	app.use(express.json());
	app.use(cors({
		allowedHeaders: ['Authorization', 'Content-Type'],
		exposedHeaders: ['WWW-Authenticate'],
		origin: frontendUrl,
	}));
	app.get('/', (request, response) => response.json({ message: 'EdiReg API' }));

	app.use('/api/visits', validateAccessToken, createVisitsRouter(requirePermissions));
	app.use('/api/parkingSpace', validateAccessToken, createParkingSpaceRouter(requirePermissions));
	app.use('/api/packages', validateAccessToken, createPackagesRouter(requirePermissions));
	app.use('/api/timerConfig', validateAccessToken, createTimerConfigRouter(requirePermissions));
	app.use('/api/residence', validateAccessToken, createResidenceRouter(requirePermissions));

	app.use(handleAuthError);
	return app;
}

module.exports = { accessControlFromEnvironment, createApp };
