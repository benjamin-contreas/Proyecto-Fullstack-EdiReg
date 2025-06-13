const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const frequentVisitorSchema = new Schema(
	{
		rut: {
			type: String,
			required: true,
			unique: true,
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
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Frequent Visitor', frequentVisitorSchema);
