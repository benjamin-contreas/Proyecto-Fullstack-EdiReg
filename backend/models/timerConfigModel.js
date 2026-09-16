const mongoose = require('mongoose');

const TimerConfigSchema = new mongoose.Schema({
	demoFixture: { type: Boolean, default: false },
	key: { type: String, required: true, unique: true, default: 'default' },
	duration: { type: Number, required: true },
	notificationTime: { type: Number, required: true },
});

const TimerConfig = mongoose.model('Timer Config', TimerConfigSchema);

module.exports = TimerConfig;
