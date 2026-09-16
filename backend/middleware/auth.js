const { auth } = require('express-oauth2-jwt-bearer');
const { createRemoteJWKSet, jwtVerify } = require('jose');

function hasPermissions(payload, requiredPermissions) {
	const grantedPermissions = Array.isArray(payload?.permissions) ? payload.permissions : [];
	return requiredPermissions.every((permission) => grantedPermissions.includes(permission));
}

function createAccessControl({ audience, issuerBaseURL, jwksUri } = {}) {
	if (!audience || !issuerBaseURL) {
		throw new Error('AUTH0_AUDIENCE and AUTH0_ISSUER_BASE_URL are required');
	}

	const validateAccessToken = auth({
		audience,
		issuerBaseURL,
		jwksUri,
		tokenSigningAlg: 'RS256',
	});
	const remoteJwks = createRemoteJWKSet(new URL(
		jwksUri || '.well-known/jwks.json',
		issuerBaseURL.endsWith('/') ? issuerBaseURL : `${issuerBaseURL}/`
	));
	const verifyAccessToken = async (accessToken) => {
		const { payload } = await jwtVerify(accessToken, remoteJwks, {
			algorithms: ['RS256'],
			audience,
			issuer: issuerBaseURL,
		});
		return payload;
	};

	const requirePermissions = (...requiredPermissions) => (request, response, next) => {
		if (!hasPermissions(request.auth?.payload, requiredPermissions)) {
			return response.status(403).json({
				error: 'insufficient_permissions',
				message: 'The access token does not include the required permissions',
				requiredPermissions,
			});
		}

		return next();
	};

	return { configured: true, requirePermissions, validateAccessToken, verifyAccessToken };
}

function createSocketAuthorization(accessControl, requiredPermission) {
	return async (socket, next) => {
		const accessToken = socket.handshake.auth?.accessToken;
		if (!accessControl.configured || !accessToken) return next(new Error('unauthorized'));

		try {
			const payload = await accessControl.verifyAccessToken(accessToken);
			if (!hasPermissions(payload, [requiredPermission])) {
				return next(new Error('forbidden'));
			}
			socket.data.auth = { payload, token: accessToken };
			return next();
		} catch (error) {
			return next(new Error('unauthorized'));
		}
	};
}

function handleAuthError(error, request, response, next) {
	if (error.status === 401) {
		if (error.headers) response.set(error.headers);
		return response.status(401).json({
			error: 'unauthorized',
			message: 'A valid access token is required',
		});
	}

	return next(error);
}

module.exports = { createAccessControl, createSocketAuthorization, handleAuthError, hasPermissions };
