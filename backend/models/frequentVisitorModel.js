const mongoose = require('mongoose');
const { normalizeRut, normalizeVehicleLicensePlate } = require('../domain/visitorIdentity');
const Schema = mongoose.Schema;

const frequentVisitorSchema = new Schema(
	{
		demoFixture: { type: Boolean, default: false },
		rut: {
			type: String,
			required: true,
			unique: true,
			set: normalizeRut,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		frequentApartment: {
			type: String,
			required: true,
		},
		vehicleLicensePlate: {
			type: String,
			set: normalizeVehicleLicensePlate,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Frequent Visitor', frequentVisitorSchema);
