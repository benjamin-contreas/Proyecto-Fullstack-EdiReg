const mongoose = require('mongoose');
const Residence = require('../models/residenceModel');
const VisitorLog = require('../models/visitorLogModel');
const VisitorParking = require('../models/visitorParkingModel');
const TimerConfig = require('../models/timerConfigModel');
const { normalizeRut, normalizeVehicleLicensePlate } = require('../domain/visitorIdentity');

class VisitRegistrationError extends Error {
	constructor(status, code, message) {
		super(message);
		this.status = status;
		this.code = code;
	}
}

const createVisitorLog = async (req, res) => {
	const {
		firstName,
		lastName,
		rut,
		residenceVisited,
		vehicleLicensePlate,
	} = req.body;

	let session;
	let visitRecord;
	let assignedParkingSpace = null;

	try {
		session = await mongoose.startSession();
		await session.withTransaction(async () => {
			const residenceNumber = Number(residenceVisited);
			const residence = Number.isInteger(residenceNumber)
				? await Residence.findOne({ residenceNumber }).session(session)
				: null;
			if (!residence) {
				throw new VisitRegistrationError(400, 'residence_not_found', 'Residence does not exist');
			}

			const normalizedPlate = normalizeVehicleLicensePlate(vehicleLicensePlate);
			if (normalizedPlate) {
				const timerConfig = await TimerConfig.findOne({}).session(session);
				assignedParkingSpace = await VisitorParking.findOneAndUpdate(
					{ isOnUse: false },
					{ $set: { isOnUse: true, timeAllowed: timerConfig?.duration, timeStart: new Date() } },
					{ new: true, session }
				);
				if (!assignedParkingSpace) {
					throw new VisitRegistrationError(409, 'no_available_parking', 'No available parking spaces');
				}
			}

			[visitRecord] = await VisitorLog.create([{
				firstName,
				lastName,
				rut: normalizeRut(rut),
				residenceVisited: String(residence.residenceNumber),
				residenceVisitedId: residence._id,
				vehicleLicensePlate: normalizedPlate,
				visitParkingId: assignedParkingSpace?._id,
			}], { session });
		});

		res.status(201).json({
			visitRecord,
			assignedParkingSpace: assignedParkingSpace
				? { id: assignedParkingSpace._id, parkingNumber: assignedParkingSpace.parkingNumber }
				: null,
		});
	} catch (error) {
		const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
		res.status(status).json({
			error: status === 500
				? 'visit_registration_failed'
				: error.code || 'invalid_visit',
			message: status === 500 ? 'Unable to register visit' : error.message,
		});
	} finally {
		await session?.endSession();
	}
};

module.exports = { createVisitorLog };
