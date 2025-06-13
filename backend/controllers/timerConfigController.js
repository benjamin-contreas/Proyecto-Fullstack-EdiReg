const TimerConfig = require('../models/timerConfigModel');

const updateConfig = async (req, res) => {
	const { duration, notificationTime } = req.body;
	try {
		let config = await TimerConfig.findOne({});
		if (config) {
			config.duration = duration;
			config.notificationTime = notificationTime;
			await config.save();
		} else {
			config = await TimerConfig.create({ duration, notificationTime });
		}
		res.status(200).json(config);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const getTimerConfig = async (req, res) => {
	try {
		const config = await TimerConfig.findOne({});
		if (!config) {
			return res.status(404).json({ message: 'Timer configuration not found' });
		}
		res.status(200).json(config);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { updateConfig, getTimerConfig };
