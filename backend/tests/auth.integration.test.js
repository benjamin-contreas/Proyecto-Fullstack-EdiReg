const { generateKeyPairSync, sign } = require('node:crypto');
const http = require('node:http');
const { after, before, describe, test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { Server: SocketServer } = require('socket.io');
const { io: createSocketClient } = require('socket.io-client');
const { createApp } = require('../app');
const { createAccessControl, createSocketAuthorization, handleAuthError } = require('../middleware/auth');
const { PERMISSIONS } = require('../middleware/permissions');

const audience = 'https://api.edireg.test';
const keyId = 'edireg-test-key';
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), alg: 'RS256', kid: keyId, use: 'sig' };

let apiServer;
let apiUrl;
let issuer;
let jwksServer;
let ediregServer;
let ediregUrl;
let socketServer;

function encodeJson(value) {
	return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function createToken(overrides = {}, signingKey = privateKey) {
	const now = Math.floor(Date.now() / 1000);
	const header = encodeJson({ alg: 'RS256', kid: keyId, typ: 'JWT' });
	const payload = encodeJson({
		aud: audience,
		exp: now + 300,
		iat: now,
		iss: issuer,
		permissions: ['read:operations'],
		sub: 'auth0|concierge-demo',
		...overrides,
	});
	const signingInput = `${header}.${payload}`;
	const signature = sign('RSA-SHA256', Buffer.from(signingInput), signingKey).toString('base64url');
	return `${signingInput}.${signature}`;
}

async function listen(server) {
	await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
	return server.address().port;
}

describe('autorización HTTP con JWT de Auth0', () => {
	before(async () => {
		jwksServer = http.createServer((request, response) => {
			if (request.url === '/.well-known/openid-configuration'
				|| request.url === '/.well-known/oauth-authorization-server') {
				response.setHeader('Content-Type', 'application/json');
				response.end(JSON.stringify({ issuer, jwks_uri: `${issuer}.well-known/jwks.json` }));
				return;
			}
			if (request.url === '/.well-known/jwks.json') {
				response.setHeader('Content-Type', 'application/json');
				response.end(JSON.stringify({ keys: [jwk] }));
				return;
			}
			response.writeHead(404).end();
		});
		const jwksPort = await listen(jwksServer);
		issuer = `http://127.0.0.1:${jwksPort}/`;

		const accessControl = createAccessControl({
			audience,
			issuerBaseURL: issuer,
			jwksUri: `${issuer}.well-known/jwks.json`,
		});
		const { validateAccessToken, requirePermissions } = accessControl;
		const app = express();
		app.get('/operations', validateAccessToken, requirePermissions('read:operations'), (request, response) => {
			response.json({ subject: request.auth.payload.sub });
		});
		app.use(handleAuthError);
		apiServer = http.createServer(app);
		const apiPort = await listen(apiServer);
		apiUrl = `http://127.0.0.1:${apiPort}`;

		ediregServer = http.createServer(createApp({ accessControl }));
		socketServer = new SocketServer(ediregServer);
		socketServer.use(createSocketAuthorization(accessControl, PERMISSIONS.READ_OPERATIONS));
		const ediregPort = await listen(ediregServer);
		ediregUrl = `http://127.0.0.1:${ediregPort}`;
	});

	after(async () => {
		await Promise.all([
			new Promise((resolve) => apiServer.close(resolve)),
			new Promise((resolve) => socketServer.close(resolve)),
			new Promise((resolve) => jwksServer.close(resolve)),
		]);
	});

	test('permite una operación con firma, issuer, audience y permiso válidos', async () => {
		const response = await fetch(`${apiUrl}/operations`, {
			headers: { Authorization: `Bearer ${createToken()}` },
		});

		assert.equal(response.status, 200, response.headers.get('www-authenticate'));
		assert.deepEqual(await response.json(), { subject: 'auth0|concierge-demo' });
	});

	test('rechaza una solicitud sin token', async () => {
		const response = await fetch(`${apiUrl}/operations`);

		assert.equal(response.status, 401);
		assert.equal((await response.json()).error, 'unauthorized');
	});

	test('rechaza tokens con issuer, audience o firma incorrectos', async (context) => {
		await context.test('issuer incorrecto', async () => {
			const response = await fetch(`${apiUrl}/operations`, {
				headers: { Authorization: `Bearer ${createToken({ iss: 'https://issuer-invalido.example/' })}` },
			});
			assert.equal(response.status, 401);
		});

		await context.test('audience incorrecta', async () => {
			const response = await fetch(`${apiUrl}/operations`, {
				headers: { Authorization: `Bearer ${createToken({ aud: 'https://otra-api.example' })}` },
			});
			assert.equal(response.status, 401);
		});

		await context.test('firma incorrecta', async () => {
			const otherKey = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey;
			const response = await fetch(`${apiUrl}/operations`, {
				headers: { Authorization: `Bearer ${createToken({}, otherKey)}` },
			});
			assert.equal(response.status, 401);
		});
	});

	test('rechaza un token válido sin el permiso requerido', async () => {
		const response = await fetch(`${apiUrl}/operations`, {
			headers: { Authorization: `Bearer ${createToken({ permissions: ['write:operations'] })}` },
		});

		assert.equal(response.status, 403);
		assert.equal((await response.json()).error, 'insufficient_permissions');
	});

	test('protege las operaciones reales de la API', async () => {
		const response = await fetch(`${ediregUrl}/api/visits/searchRut?rut=00.000.201-1`);

		assert.equal(response.status, 401);
	});

	test('reserva la configuración para manage:configuration', async () => {
		const response = await fetch(`${ediregUrl}/api/timerConfig/updateConfig`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${createToken({ permissions: ['read:operations', 'write:operations'] })}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ duration: 120, notificationTime: 15 }),
		});

		assert.equal(response.status, 403);
		assert.equal((await response.json()).error, 'insufficient_permissions');
	});

	test('impide al Administrator ejecutar flujos diarios sin write:operations', async () => {
		const response = await fetch(`${ediregUrl}/api/packages/createPackage`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${createToken({ permissions: ['read:operations', 'manage:configuration'] })}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({}),
		});

		assert.equal(response.status, 403);
		assert.equal((await response.json()).error, 'insufficient_permissions');
	});

	test('protege el canal de alertas con el mismo JWT y permiso operacional', async (context) => {
		await context.test('rechaza una conexión anónima', async () => {
			const client = createSocketClient(ediregUrl, { reconnection: false });
			await new Promise((resolve, reject) => {
				client.on('connect', () => reject(new Error('Anonymous socket connected')));
				client.on('connect_error', (error) => {
					try {
						assert.equal(error.message, 'unauthorized');
						resolve();
					} catch (assertionError) {
						reject(assertionError);
					} finally {
						client.close();
					}
				});
			});
		});

		await context.test('acepta una conexión con read:operations', async () => {
			const client = createSocketClient(ediregUrl, {
				auth: { accessToken: createToken() },
				reconnection: false,
			});
			await new Promise((resolve, reject) => {
				client.on('connect', resolve);
				client.on('connect_error', reject);
			});
			client.close();
		});

		await context.test('rechaza una conexión sin read:operations', async () => {
			const client = createSocketClient(ediregUrl, {
				auth: { accessToken: createToken({ permissions: ['write:operations'] }) },
				reconnection: false,
			});
			await new Promise((resolve, reject) => {
				client.on('connect', () => reject(new Error('Socket connected without read permission')));
				client.on('connect_error', (error) => {
					try {
						assert.equal(error.message, 'forbidden');
						resolve();
					} catch (assertionError) {
						reject(assertionError);
					} finally {
						client.close();
					}
				});
			});
		});
	});
});
