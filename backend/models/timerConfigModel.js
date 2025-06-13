const mongoose = require('mongoose');

const TimerConfigSchema = new mongoose.Schema({
	duration: { type: Number, required: true },
	notificationTime: { type: Number, required: true },
});

const TimerConfig = mongoose.model('Timer Config', TimerConfigSchema);

module.exports = TimerConfig;
