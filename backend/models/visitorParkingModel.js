const mongoose = require('mongoose');

const VisitorParkingSchema = new mongoose.Schema(
	{
		parkingNumber: {
			type: Number,
			required: true,
			unique: true,
		},
		isOnUse: {
			type: Boolean,
			required: true,
			default: false,
		},
		timeAllowed: {
			type: Number, // in minutes
			required: false,
		},
		timeStart: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

const VisitorParking = mongoose.model('Visitor Parking', VisitorParkingSchema);

module.exports = VisitorParking;
