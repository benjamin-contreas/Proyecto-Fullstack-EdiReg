const mongoose = require('mongoose');
const ParkingSpace = require('../models/visitorParkingModel');

const findAvailableSpace = async () => {
	return await ParkingSpace.findOne({ isOnUse: false });
};
const getAllParkingSpaces = async (req, res) => {
	try {
		const parkingSpaces = await ParkingSpace.find({});
		res.json(parkingSpaces);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const toggleParkingSpaceUse = async (req, res) => {
	const { id } = req.params;
	try {
		const parkingSpace = await ParkingSpace.findById(id);
		parkingSpace.isOnUse = !parkingSpace.isOnUse;
		await parkingSpace.save();
		// skipcq: JS-0125
		res.json(parkingSpace);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const assignParkingSpace = async (req, res) => {
	const { timeAllowed } = req.body;
	try {
		const parkingSpace = await ParkingSpace.findOneAndUpdate(
			{ isOnUse: false },
			{ $set: { isOnUse: true, timeAllowed, timeStart: Date.now() } },
			{ new: true }
		);
		if (!parkingSpace) {
			return res.status(404).json({ messsage: 'No available parking spaces' });
		}
		// Return the parking space ID along with other details
		res.json({ id: parkingSpace._id, ...parkingSpace.toObject() });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const createParkingSpace = async (req, res) => {
	const { parkingNumber, isOnUse } = req.body;

	// Check if the parkingNumber is provided
	if (!parkingNumber) {
		return res.status(400).json({ message: 'Parking number is required' });
	}

	try {
		// Check if the parking space already exists
		// const existingSpace = await ParkingSpace.findOne({ parkingNumber });
		// if (existingSpace) {
		// 	return res.status(400).json({ message: 'Parking space already exists' });
		// }

		// Create a new parking space
		const parkingSpace = await ParkingSpace.create({
			parkingNumber,
			isOnUse,
		});
		res.status(200).json(parkingSpace);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
module.exports = {
	findAvailableSpace,
	assignParkingSpace,
	createParkingSpace,
	getAllParkingSpaces,
	toggleParkingSpaceUse,
};
