const ParkingSpace = require('../models/visitorParkingModel');
const TimerConfig = require('../models/timerConfigModel');

const getAllParkingSpaces = async (req, res) => {
	try {
		res.json(await ParkingSpace.find({}));
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const toggleParkingSpaceUse = async (req, res) => {
	try {
		const parkingSpace = await ParkingSpace.findById(req.params.id);
		if (!parkingSpace) return res.status(404).json({ message: 'Parking space not found' });
		parkingSpace.isOnUse = !parkingSpace.isOnUse;
		await parkingSpace.save();
		return res.json(parkingSpace);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

const assignParkingSpace = async (req, res) => {
	try {
		const config = await TimerConfig.findOne({});
		const timeAllowed = req.body.timeAllowed ?? config?.duration;
		const parkingSpace = await ParkingSpace.findOneAndUpdate(
			{ isOnUse: false },
			{ $set: { isOnUse: true, timeAllowed, timeStart: Date.now() } },
			{ new: true }
		);
		if (!parkingSpace) return res.status(404).json({ message: 'No available parking spaces' });
		return res.json({ id: parkingSpace._id, ...parkingSpace.toObject() });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

const createParkingSpace = async (req, res) => {
	const { parkingNumber, isOnUse = false } = req.body;
	if (!parkingNumber) return res.status(400).json({ message: 'Parking number is required' });

	try {
		if (await ParkingSpace.findOne({ parkingNumber })) {
			return res.status(409).json({ message: 'Parking space already exists' });
		}
		return res.status(201).json(await ParkingSpace.create({ parkingNumber, isOnUse }));
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

module.exports = { assignParkingSpace, createParkingSpace, getAllParkingSpaces, toggleParkingSpaceUse };
