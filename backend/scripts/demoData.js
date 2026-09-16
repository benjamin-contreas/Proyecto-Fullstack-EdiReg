const mongoose = require('mongoose');
const FrequentVisitor = require('../models/frequentVisitorModel');
const Package = require('../models/packageModel');
const Residence = require('../models/residenceModel');
const TimerConfig = require('../models/timerConfigModel');
const User = require('../models/userModel');
const VisitorLog = require('../models/visitorLogModel');
const VisitorParking = require('../models/visitorParkingModel');

const residences = [
	{ residenceNumber: 101, residenceName: 'A-101 Demo' },
	{ residenceNumber: 202, residenceName: 'B-202 Demo' },
	{ residenceNumber: 303, residenceName: 'C-303 Demo' },
];

const residents = [
	{ username: 'ana.demo', residenceNumber: 101, userInfo: { firstName: 'Ana', lastName: 'Demo', RUT: '00.000.001-1', email: 'ana.demo@example.test', phoneNumber: '+56 9 0000 0001', vehicleLicensePlate: 'DEMO01' } },
	{ username: 'bruno.demo', residenceNumber: 202, userInfo: { firstName: 'Bruno', lastName: 'Demo', RUT: '00.000.002-2', email: 'bruno.demo@example.test', phoneNumber: '+56 9 0000 0002', vehicleLicensePlate: 'DEMO02' } },
	{ username: 'carla.demo', residenceNumber: 303, userInfo: { firstName: 'Carla', lastName: 'Demo', RUT: '00.000.003-3', email: 'carla.demo@example.test', phoneNumber: '+56 9 0000 0003', vehicleLicensePlate: 'DEMO03' } },
];

const packages = [
	{ residenceNumber: 101, description: 'Libro de demostración', status: 'At Reception', courierInfo: { firstName: 'Paula', lastName: 'Courier', rut: '00.000.101-1', vehicleLicensePlate: 'COURIER1' } },
	{ residenceNumber: 202, description: 'Caja de demostración', status: 'At Reception', courierInfo: { firstName: 'Diego', lastName: 'Courier', rut: '00.000.102-2', vehicleLicensePlate: 'COURIER2' } },
];

const frequentVisitors = [
	{ rut: '00000201-1', firstName: 'Elena', lastName: 'Visitante', frequentApartment: '101', vehicleLicensePlate: 'VISITA1' },
];

const parkingSpaces = [1, 2, 3, 4, 5].map((parkingNumber) => ({ parkingNumber, isOnUse: false }));
const timerConfig = { duration: 120, notificationTime: 15 };

async function connect() {
	if (!process.env.MONG_URI) throw new Error('MONG_URI is required to load demo data');
	await mongoose.connect(process.env.MONG_URI);
}

async function assertNoFixtureConflicts() {
	const [conflictingResidences, conflictingUsers, conflictingVisitors, conflictingParkingSpaces, conflictingTimerConfigs] = await Promise.all([
		Residence.find({
			demoFixture: { $ne: true },
			$or: [
				{ residenceNumber: { $in: residences.map((item) => item.residenceNumber) } },
				{ residenceName: { $in: residences.map((item) => item.residenceName) } },
			],
		}).select('residenceNumber residenceName'),
		User.find({
			demoFixture: { $ne: true },
			$or: [
				{ username: { $in: residents.map((item) => item.username) } },
				{ 'userInfo.RUT': { $in: residents.map((item) => item.userInfo.RUT) } },
				{ 'userInfo.email': { $in: residents.map((item) => item.userInfo.email) } },
			],
		}).select('username userInfo.RUT userInfo.email'),
		FrequentVisitor.find({ rut: { $in: frequentVisitors.map((item) => item.rut) }, demoFixture: { $ne: true } }).select('rut'),
		VisitorParking.find({ parkingNumber: { $in: parkingSpaces.map((item) => item.parkingNumber) }, demoFixture: { $ne: true } }).select('parkingNumber'),
		TimerConfig.find({ demoFixture: { $ne: true } }).select('key'),
	]);

	const conflicts = [
		...conflictingResidences.map((item) => `residence ${item.residenceNumber ?? item.residenceName}`),
		...conflictingUsers.map((item) => `resident ${item.username}`),
		...conflictingVisitors.map((item) => `frequent visitor ${item.rut}`),
		...conflictingParkingSpaces.map((item) => `parking space ${item.parkingNumber}`),
		...conflictingTimerConfigs.map(() => 'timer configuration'),
	];
	if (conflicts.length) {
		throw new Error(`Demo fixtures conflict with non-demo data: ${conflicts.join(', ')}`);
	}
}

async function seedDemoData() {
	await assertNoFixtureConflicts();
	await Promise.all(residences.map((residence) => Residence.updateOne(
		{ residenceNumber: residence.residenceNumber, demoFixture: true },
		{ $set: { ...residence, demoFixture: true }, $setOnInsert: { residents: [] } },
		{ upsert: true }
	)));

	const residenceDocuments = await Residence.find({ residenceNumber: { $in: residences.map((item) => item.residenceNumber) } });
	const residenceByNumber = new Map(residenceDocuments.map((residence) => [residence.residenceNumber, residence]));

	await Promise.all(residents.map(({ residenceNumber, username, userInfo }) => User.updateOne(
		{ username, demoFixture: true },
		{ $set: { username, role: 'resident', demoFixture: true, userInfo: { ...userInfo, residence: residenceByNumber.get(residenceNumber)._id } } },
		{ upsert: true }
	)));

	const residentDocuments = await User.find({ username: { $in: residents.map((resident) => resident.username) } });
	const residentsByResidence = new Map(residences.map((residence) => [residence.residenceNumber, []]));
	for (const resident of residentDocuments) {
		const residenceNumber = residents.find((item) => item.username === resident.username).residenceNumber;
		residentsByResidence.get(residenceNumber).push(resident._id);
	}

	await Promise.all(residences.map((residence) => Residence.updateOne(
		{ residenceNumber: residence.residenceNumber },
		{ $set: { residents: residentsByResidence.get(residence.residenceNumber) } }
	)));

	await Promise.all(packages.map((packageFixture) => {
		const { residenceNumber, ...packageData } = packageFixture;
		const targetResidenceId = residenceByNumber.get(residenceNumber)._id;
		return Package.updateOne(
		{ targetResidenceId, description: packageData.description, demoFixture: true },
			{ $set: { ...packageData, demoFixture: true, targetResidenceId, deliveredAt: new Date('2026-01-15T09:00:00.000Z') } },
			{ upsert: true }
		);
	}));

	await Promise.all(frequentVisitors.map((visitor) => FrequentVisitor.updateOne(
		{ rut: visitor.rut, demoFixture: true }, { $set: { ...visitor, demoFixture: true } }, { upsert: true }
	)));
	await Promise.all(parkingSpaces.map((space) => VisitorParking.updateOne(
		{ parkingNumber: space.parkingNumber, demoFixture: true }, { $set: { ...space, demoFixture: true } }, { upsert: true }
	)));
	await TimerConfig.deleteMany({ demoFixture: true, key: { $ne: 'default' } });
	await TimerConfig.findOneAndUpdate(
		{ key: 'default', demoFixture: true },
		{ $set: { ...timerConfig, demoFixture: true, key: 'default' } },
		{ new: true, upsert: true }
	);
}

async function resetDemoData() {
	if (process.env.DEMO_RESET_CONFIRM !== 'reset') {
		throw new Error('Set DEMO_RESET_CONFIRM=reset to reset demo fixtures');
	}
	await Promise.all([
		VisitorLog.deleteMany({ demoFixture: true }), FrequentVisitor.deleteMany({ demoFixture: true }),
		Package.deleteMany({ demoFixture: true }), VisitorParking.deleteMany({ demoFixture: true }),
		TimerConfig.deleteMany({ demoFixture: true }), User.deleteMany({ demoFixture: true }),
		Residence.deleteMany({ demoFixture: true }),
	]);
	await seedDemoData();
}

async function run(mode) {
	try {
		await connect();
		if (mode === 'reset') await resetDemoData();
		else await seedDemoData();
		console.log(`Demo data ${mode === 'reset' ? 'reset' : 'seeded'} successfully.`);
	} finally {
		await mongoose.disconnect();
	}
}

module.exports = { resetDemoData, run, seedDemoData };
