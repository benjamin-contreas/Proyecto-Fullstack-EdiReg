const mongoose = require('mongoose');
const VisitorLog = require('../models/visitorLogModel');

const createVisitorLog = async (req, res) => {
	const {
		firstName,
		lastName,
		rut,
		residenceVisited,
		vehicleLicensePlate,
		visitParkingId,
	} = req.body;

	try {
		// Create a new visitor log entry
		const newVisitorLog = await VisitorLog.create({
			firstName,
			lastName,
			rut,
			residenceVisited,
			vehicleLicensePlate,
			visitParkingId,
		});

		// Respond with the created visitor log entry
		res.status(201).json(newVisitorLog);
	} catch (error) {
		// Respond with an error status code and message if something goes wrong
		res.status(400).json({ error: error.message });
	}
};

module.exports = { createVisitorLog };
