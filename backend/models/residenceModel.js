const mongoose = require('mongoose');

require('./userModel');

const ResidenceSchema = new mongoose.Schema({
	demoFixture: { type: Boolean, default: false },
	residenceNumber: {
		type: Number,
		required: true,
		unique: true,
	},
	residenceName: {
		type: String,
		unique: true,
	},
	residents: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
});

const Residence = mongoose.model('Residence', ResidenceSchema);

module.exports = Residence;
