const { generateKeyPairSync, sign } = require('node:crypto');
const http = require('node:http');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { expect, test } = require('@playwright/test');
const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryReplSet } = require('mongodb-memory-server');

const audience = 'https://api.edireg.test';
const keyId = 'edireg-e2e-key';
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), alg: 'RS256', kid: keyId, use: 'sig' };
const backendDirectory = path.resolve(__dirname, '../../backend');

let accessToken;
let apiProcess;
let issuer;
let issuerServer;
let mongo;
let mongoClient;
let mongoDatabase;

function encodeJson(value) {
	return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function createToken(overrides = {}) {
	const now = Math.floor(Date.now() / 1000);
	const header = encodeJson({ alg: 'RS256', kid: keyId, typ: 'JWT' });
	const payload = encodeJson({
		aud: audience,
		exp: now + 600,
		iat: now,
		iss: issuer,
		permissions: ['read:operations', 'write:operations'],
		sub: 'auth0|concierge-e2e',
		...overrides,
	});
	const input = `${header}.${payload}`;
	const signature = sign('RSA-SHA256', Buffer.from(input), privateKey).toString('base64url');
	return `${input}.${signature}`;
}

async function listen(server) {
	await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
	return server.address().port;
}

async function runNode(script, args, environment) {
	await new Promise((resolve, reject) => {
		const child = spawn(process.execPath, [script, ...args], {
			cwd: backendDirectory,
			env: { ...process.env, ...environment },
			stdio: ['ignore', 'pipe', 'pipe'],
		});
		let output = '';
		child.stdout.on('data', (chunk) => { output += chunk; });
		child.stderr.on('data', (chunk) => { output += chunk; });
		child.once('error', reject);
		child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(output)));
	});
}

async function waitForApi() {
	for (let attempt = 0; attempt < 60; attempt += 1) {
		try {
			const response = await fetch('http://127.0.0.1:4100/');
			if (response.ok) return;
		} catch (error) {
			// The API is still starting.
		}
		await new Promise((resolve) => setTimeout(resolve, 250));
	}
	throw new Error('The EdiReg API did not start in time');
}

test.beforeAll(async () => {
	mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
	const mongoUri = mongo.getUri('edireg-e2e');
	mongoClient = new MongoClient(mongoUri);
	await mongoClient.connect();
	mongoDatabase = mongoClient.db('edireg-e2e');

	issuerServer = http.createServer((request, response) => {
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
	const issuerPort = await listen(issuerServer);
	issuer = `http://127.0.0.1:${issuerPort}/`;
	accessToken = createToken();

	const environment = {
		AUTH0_AUDIENCE: audience,
		AUTH0_ISSUER_BASE_URL: issuer,
		FRONTEND_URL: 'http://127.0.0.1:3100',
		MONG_URI: mongoUri,
		PORT: '4100',
	};
	await runNode('scripts/demoDataCli.js', ['seed'], environment);
	apiProcess = spawn(process.execPath, ['server.js'], {
		cwd: backendDirectory,
		env: { ...process.env, ...environment },
		stdio: ['ignore', 'pipe', 'pipe'],
	});
	await waitForApi();
});

test.afterAll(async () => {
	apiProcess?.kill();
	if (issuerServer) await new Promise((resolve) => issuerServer.close(resolve));
	if (mongoClient) await mongoClient.close();
	if (mongo) await mongo.stop();
});

test.beforeEach(async ({ page }) => {
	await page.addInitScript((token) => {
		window.__EDIREG_E2E_ACCESS_TOKEN__ = token;
	}, accessToken);
});

test('el Conserje crea y busca un Visitante Frecuente y registra su visita', async ({ mount }) => {
	const frequentVisitor = await mount('App/Concierge', { path: '/frequentVisitor' });
	await frequentVisitor.getByLabel('Rut').fill('11111111-1');
	await frequentVisitor.getByLabel('visitor name').fill('Valentina');
	await frequentVisitor.getByLabel('visitor surname').fill('Prueba');
	await frequentVisitor.getByLabel('Frequent Apartment').fill('101');
	await frequentVisitor.getByLabel('vehicle license').fill('TEST11');
	await frequentVisitor.getByRole('button', { name: 'Register visit' }).click();
	await expect(frequentVisitor.getByRole('status')).toContainText('Frequent visitor created');

	await frequentVisitor.unmount();
	const visits = await mount('App/Concierge', { path: '/visits' });
	await visits.getByPlaceholder('Enter RUT').fill('11.111.111-1');
	await visits.getByRole('button', { name: 'Search', exact: true }).click();
	await expect(visits.getByLabel('Visitor names')).toHaveValue('Valentina');
	await expect(visits.getByLabel('Residence Visited')).toHaveValue('101');

	await visits.getByRole('button', { name: 'Register visit' }).click();
	await expect(visits.getByRole('status')).toContainText('Visit registered');
	await expect(visits.locator('.alert-info')).toContainText('Assigned Parking Space:');

	const visitRecord = await mongoDatabase.collection('visitor logs').findOne({ rut: '11111111-1' });
	expect(visitRecord).toMatchObject({
		firstName: 'Valentina',
		lastName: 'Prueba',
		residenceVisited: '101',
		vehicleLicensePlate: 'TEST11',
	});
	expect(visitRecord.residenceVisitedId).toBeTruthy();
	expect(visitRecord.visitParkingId).toBeTruthy();
	const parkingSpace = await mongoDatabase.collection('visitor parkings')
		.findOne({ _id: visitRecord.visitParkingId });
	expect(parkingSpace.isOnUse).toBe(true);
	await expect(visits.locator('.alert-info')).toContainText(String(parkingSpace.parkingNumber));
});

test('la API rechaza el registro anónimo aunque se eluda la interfaz', async ({ request }) => {
	const response = await request.post('http://127.0.0.1:4100/api/visits/visitRegistry', {
		data: { firstName: 'Intruso', lastName: 'Anónimo', rut: '22222222-2', residenceVisited: '101' },
	});
	expect(response.status()).toBe(401);
});

test('la API registra un Package y comunica que el correo no está configurado', async ({ request }) => {
	const residence = await mongoDatabase.collection('residences').findOne({ residenceNumber: 101 });
	const response = await request.post('http://127.0.0.1:4100/api/packages/createPackage', {
		headers: { Authorization: `Bearer ${accessToken}` },
		data: {
			targetResidenceId: residence._id.toString(),
			description: 'Sobre de prueba',
			deliveredAt: '2026-09-16T12:00:00.000Z',
			status: 'At Reception',
			courierInfo: { firstName: 'Paula', lastName: 'Courier' },
		},
	});

	expect(response.status()).toBe(201);
	expect(await response.json()).toMatchObject({
		notification: { status: 'not_configured' },
		packageEntry: { description: 'Sobre de prueba', targetResidenceId: residence._id.toString() },
	});
});

test('el Conserje registra un Package y recibe un estado honesto de notificación', async ({ mount }) => {
	const delivery = await mount('App/Concierge', { path: '/delivery' });
	await delivery.getByLabel('Residence number').fill('101');
	await delivery.getByRole('button', { name: 'Find residence' }).click();
	await expect(delivery.getByText('Ana Demo')).toBeVisible();

	await delivery.getByLabel('Package description').fill('Sobre de contrato');
	await delivery.getByLabel('First name').fill('Paula');
	await delivery.getByLabel('Last name').fill('Courier');
	await delivery.getByRole('button', { name: 'Register package' }).click();

	await expect(delivery.getByRole('status')).toHaveText(
		'Package registered. Email notifications are not configured.'
	);
	await delivery.unmount();
});

test('un Package para una Residence inexistente no se persiste', async ({ request }) => {
	const packagesBefore = await mongoDatabase.collection('packages').countDocuments({ description: 'Paquete inválido' });
	const response = await request.post('http://127.0.0.1:4100/api/packages/createPackage', {
		headers: { Authorization: `Bearer ${accessToken}` },
		data: {
			targetResidenceId: new ObjectId().toString(),
			description: 'Paquete inválido',
			deliveredAt: '2026-09-16T12:00:00.000Z',
			status: 'At Reception',
			courierInfo: { firstName: 'Paula', lastName: 'Courier' },
		},
	});

	expect(response.status()).toBe(404);
	expect(await response.json()).toEqual({ error: 'residence_not_found' });
	expect(await mongoDatabase.collection('packages').countDocuments({ description: 'Paquete inválido' }))
		.toBe(packagesBefore);
});

test('un Package inválido se rechaza como error de validación', async ({ request }) => {
	const residence = await mongoDatabase.collection('residences').findOne({ residenceNumber: 101 });
	const response = await request.post('http://127.0.0.1:4100/api/packages/createPackage', {
		headers: { Authorization: `Bearer ${accessToken}` },
		data: { targetResidenceId: residence._id.toString() },
	});

	expect(response.status()).toBe(400);
	expect(await response.json()).toEqual({ error: 'invalid_package' });
});

test('la API de Packages rechaza solicitudes anónimas', async ({ request }) => {
	const response = await request.post('http://127.0.0.1:4100/api/packages/createPackage', {
		data: { description: 'Solicitud anónima' },
	});

	expect(response.status()).toBe(401);
});

test('un registro inválido no deja un estacionamiento asignado', async ({ request }) => {
	const headers = { Authorization: `Bearer ${accessToken}` };
	const visitRecordsBefore = await mongoDatabase.collection('visitor logs')
		.countDocuments({ rut: '33333333-3' });
	const beforeResponse = await request.get('http://127.0.0.1:4100/api/parkingSpace/allSpaces', { headers });
	const spacesInUseBefore = (await beforeResponse.json())
		.filter((space) => space.isOnUse)
		.map((space) => space.id || space._id)
		.sort();
	const response = await request.post('http://127.0.0.1:4100/api/visits/visitRegistry', {
		headers,
		data: { lastName: 'Incompleto', rut: '33333333-3', residenceVisited: '101', vehicleLicensePlate: 'FAIL11' },
	});
	expect(response.status()).toBe(400);

	const parkingResponse = await request.get('http://127.0.0.1:4100/api/parkingSpace/allSpaces', { headers });
	expect(parkingResponse.status()).toBe(200);
	const parkingSpaces = await parkingResponse.json();
	expect(parkingSpaces).toHaveLength(5);
	const spacesInUseAfter = parkingSpaces
		.filter((space) => space.isOnUse)
		.map((space) => space.id || space._id)
		.sort();
	expect(spacesInUseAfter).toEqual(spacesInUseBefore);
	const visitRecordsAfter = await mongoDatabase.collection('visitor logs')
		.countDocuments({ rut: '33333333-3' });
	expect(visitRecordsAfter).toBe(visitRecordsBefore);
});
