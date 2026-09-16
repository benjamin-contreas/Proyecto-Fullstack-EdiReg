const FrequentVisitor = require('../models/frequentVisitorModel');
const Residence = require('../models/residenceModel');
const { normalizeRut, normalizeVehicleLicensePlate } = require('../domain/visitorIdentity');

/**
 * Get frequent visitor by RUT.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The frequent visitor object.
 */
const getFrequentVisitor = async (req, res) => {
	const { rut } = req.query;

	const frequentVisitor = await FrequentVisitor.findOne({ rut: normalizeRut(rut) });

	if (!frequentVisitor) {
		return res.status(404).json({ error: 'visitor_not_found', message: 'Frequent visitor not found' });
	}

	res.status(200).json(frequentVisitor);
};

/**
 * Get frequent visitor by vehicle license plate.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The frequent visitor object.
 */
const getFrequentVisitorByPlate = async (req, res) => {
	const { vehicleLicensePlate } = req.query;

	const frequentVisitor = await FrequentVisitor.findOne({
		vehicleLicensePlate: normalizeVehicleLicensePlate(vehicleLicensePlate),
	});

	if (!frequentVisitor) {
		return res.status(404).json({ error: 'visitor_not_found', message: 'Frequent visitor not found' });
	}

	res.status(200).json(frequentVisitor);
};

// CREATE a frequent visitor
/**
 * Create a new frequent visitor.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the frequent visitor is created.
 */
const createFrequentVisitor = async (req, res) => {
	const { rut, firstName, lastName, frequentApartment, vehicleLicensePlate } =
		req.body;

	// Add doc to db.
	try {
		const residenceNumber = Number(frequentApartment);
		if (!Number.isInteger(residenceNumber)
			|| !(await Residence.exists({ residenceNumber }))) {
			return res.status(400).json({ error: 'residence_not_found', message: 'Residence does not exist' });
		}
		const frequentVisitor = await FrequentVisitor.create({
			rut,
			firstName,
			lastName,
			frequentApartment,
			vehicleLicensePlate,
		});
		res.status(201).json(frequentVisitor);
	} catch (error) {
		const duplicate = error.code === 11000;
		res.status(duplicate ? 409 : 400).json({
			error: duplicate ? 'frequent_visitor_exists' : 'invalid_frequent_visitor',
			message: error.message,
		});
	}
};

// DELETE a frequent visitor
/**
 * Deletes a frequent visitor by their RUT.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The deleted frequent visitor object.
 */
const deleteFrequentVisitor = async (req, res) => {
	const { rut } = req.params;

	const frequentVisitor = await FrequentVisitor.findOneAndDelete({ rut: normalizeRut(rut) });

	if (!frequentVisitor) {
		return res.status(400).json({ error: 'No such visitor' });
	}

	res.status(200).json(frequentVisitor);
};

// UPDATE a frequent visitor
/**
 * Updates a frequent visitor by their RUT (Rol Único Tributario).
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters sent with the request.
 * @param {string} req.params.rut - The RUT of the frequent visitor to update.
 * @param {Object} req.body - The updated data for the frequent visitor.
 * @param {Object} res - The response object.
 * @returns {Object} - The updated frequent visitor object if successful, or an error object if not found.
 */
const updateFrequentVisitor = async (req, res) => {
	const { rut } = req.params;

	const frequentVisitor = await FrequentVisitor.findOneAndUpdate(
		{ rut: normalizeRut(rut) },
		{
			...req.body,
		},
		{ new: true, runValidators: true }
	);

	if (!frequentVisitor) {
		return res.status(400).json({ error: 'No such visitor' });
	}

	res.status(200).json(frequentVisitor);
};

module.exports = {
	createFrequentVisitor,
	getFrequentVisitor,
	getFrequentVisitorByPlate,
	deleteFrequentVisitor,
	updateFrequentVisitor,
};
