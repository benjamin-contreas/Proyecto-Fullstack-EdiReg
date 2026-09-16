const mongoose = require('mongoose');
const { normalizeRut, normalizeVehicleLicensePlate } = require('../domain/visitorIdentity');

const VisitorLogSchema = new mongoose.Schema(
	{
		demoFixture: { type: Boolean, default: false },
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		rut: {
			type: String,
			required: true,
			set: normalizeRut,
		},
		residenceVisited: {
			type: String,
			required: true,
		},
		residenceVisitedId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Residence',
			required: true,
		},
		enteredAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
		vehicleLicensePlate: { type: String, set: normalizeVehicleLicensePlate },
		visitParkingId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Visitor Parking',
		},
	},
	{ timestamps: true }
);

const VisitorLog = mongoose.model('Visitor Log', VisitorLogSchema);

module.exports = VisitorLog;
