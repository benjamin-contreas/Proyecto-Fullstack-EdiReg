const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema(
	{
		targetResidenceId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Residence',
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		deliveredAt: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
			enum: ['At Reception', 'Collected'],
			default: 'At Reception',
		},
		courierInfo: {
			firstName: String,
			lastName: String,
			rut: String,
			vehicleLicensePlate: String,
		},
	},
	{ timestamps: true }
);

const Package = mongoose.model('Package', PackageSchema);

module.exports = Package;
