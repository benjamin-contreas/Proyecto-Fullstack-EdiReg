const test = require('node:test');
const assert = require('node:assert/strict');
const FrequentVisitor = require('../models/frequentVisitorModel');
const Package = require('../models/packageModel');
const Residence = require('../models/residenceModel');
const TimerConfig = require('../models/timerConfigModel');
const VisitorParking = require('../models/visitorParkingModel');
const User = require('../models/userModel');

test('FrequentVisitor requires a RUT', () => {
	const doc = new FrequentVisitor({ firstName: 'Ana', lastName: 'Pérez', frequentApartment: '101' });
	assert.ok(doc.validateSync()?.errors.rut);
});

test('Package rejects unsupported status values', () => {
	const doc = new Package({
		targetResidenceId: '507f1f77bcf86cd799439011',
		description: 'Caja', deliveredAt: new Date(), status: 'Unknown',
	});
	assert.ok(doc.validateSync()?.errors.status);
});

test('Residence requires residenceNumber', () => {
	assert.ok(new Residence({ residenceName: 'A-101' }).validateSync()?.errors.residenceNumber);
});

test('TimerConfig requires both time values', () => {
	const errors = new TimerConfig({}).validateSync()?.errors;
	assert.ok(errors.duration);
	assert.ok(errors.notificationTime);
});

test('VisitorParking defaults to available', () => {
	assert.equal(new VisitorParking({ parkingNumber: 1 }).isOnUse, false);
});

test('User model does not define a password field', () => {
	assert.equal(User.schema.path('password'), undefined);
});
