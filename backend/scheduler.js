const nodeCron = require('node-cron');
const ParkingSpace = require('./models/visitorParkingModel');
const TimerConfig = require('./models/timerConfigModel');

nodeCron.schedule('* * * * *', async () => {
	try {
		const config = await TimerConfig.findOne({});
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
			global.io?.emit('notifyConcierge', `Parking space ${space.parkingNumber} is nearing its time limit`);
		});
	} catch (error) {
		console.error('Error in parking scheduler:', error.message);
	}
});
