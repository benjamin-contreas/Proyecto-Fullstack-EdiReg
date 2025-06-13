const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		requiered: true,
		unique: true,
	},
	password: {
		type: String,
		requiered: true,
		unique: true,
	},
	role: {
		type: String,
		enum: ['resident', 'admin', 'concierge'],
		required: true,
	},
	userInfo: {
		firstName: String,
		lastName: String,
		RUT: {
			type: String,
			unique: true,
		},
		email: {
			type: String,
			unique: true,
		},
		phoneNumber: {
			type: Number,
			unique: true,
		},
		vehicleLicensePlate: String,
		residence: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Residence',
		},
	},
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
