const nodeCron = require('node-cron');
const ParkingSpace = require('./models/visitorParkingModel');
const TimerConfig = require('./models/timerConfigModel');

nodeCron.schedule('* * * * *', async () => {
	try {
		const config = await TimerConfig.findOne({ key: 'default' });
		if (!config) return;

		const nearingTimeLimitSpaces = await ParkingSpace.find({
			isOnUse: true,
			timeAllowed: { $ne: null },
			$expr: {
				$lt: [
					{ $subtract: ['$timeAllowed', { $divide: [{ $subtract: [new Date(), '$timeStart'] }, 60000] }] },
					config.notificationTime,
				],
			},
		});

		nearingTimeLimitSpaces.forEach((space) => {
			global.io?.emit('notifyConcierge', { parkingNumber: space.parkingNumber });
		});
	} catch (error) {
		console.error('Error in parking scheduler:', error.message);
	}
});
