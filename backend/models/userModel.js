const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	role: { type: String, enum: ['resident', 'admin', 'concierge'], required: true },
	userInfo: {
		firstName: String,
		lastName: String,
		RUT: { type: String, unique: true },
		email: { type: String, unique: true },
		phoneNumber: String,
		vehicleLicensePlate: String,
		residence: { type: mongoose.Schema.Types.ObjectId, ref: 'Residence' },
	},
});

module.exports = mongoose.model('User', UserSchema);
