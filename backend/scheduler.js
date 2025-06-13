const nodeCron = require('node-cron');
const ParkingSpace = require('./models/visitorParkingModel');
const TimerConfig = require('./models/timerConfigModel');

nodeCron.schedule('* * * * *', async () => {
	try {
		console.log('Executing scheduled task');
		const config = await TimerConfig.findOne({});
		const notificationTime = config.notificationTime;

		const nearingTimeLimitSpaces = await ParkingSpace.find({
			isOnUse: true,
			$expr: {
				$lt: [
					{
						$subtract: [
							'$timeAllowed',
							{ $divide: [{ $subtract: [new Date(), '$timeStart'] }, 60000] },
						],
					},
					notificationTime,
				],
			},
		});
		nearingTimeLimitSpaces.forEach((space) => {
			// skipcq: JS-0002
			console.log(
				`Parking space ${space.parkingNumber} is nearing its time limit`
			);
			// Example notification logic (already partially implemented)
			global.io.emit(
				'notifyConcierge',
				`Parking space ${space.parkingNumber} is nearing its time limit`
			);
		});
	} catch (error) {
		console.error('Error in scheduler:', error);
	}
});
