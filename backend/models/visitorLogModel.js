const mongoose = require('mongoose');

const VisitorLogSchema = new mongoose.Schema(
	{
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
		},
		residenceVisited: {
			type: String,
			required: true,
		},
		// residenceVisitedId: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: 'Residence',
		// 	required: true,
		// },
		enteredAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
		vehicleLicensePlate: String,
		visitParkingId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'VisitParkingSpace',
		},
	},
	{ timestamps: true }
);

const VisitorLog = mongoose.model('Visitor Log', VisitorLogSchema);

module.exports = VisitorLog;
