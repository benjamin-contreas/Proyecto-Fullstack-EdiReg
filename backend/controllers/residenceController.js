const mongoose = require('mongoose');
const Residence = require('../models/residenceModel');

// Get a single residence
/**
 * Retrieves a residence by its residenceNumber and populates the residents' userInfo.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the retrieved residence or an error response.
 */
const getResidence = async (req, res) => {
	const { residenceNumber } = req.params;
	try {
		const residence = await Residence.findOne({ residenceNumber }).populate(
			'residents',
			'userInfo'
		);
		if (!residence) {
			return res.status(404).json({ error: 'No such residence' });
		}
		res.status(200).json(residence);
		return null;
	} catch (error) {
		res.status(500).json({ error: error.message });
		return null;
	}
};

/**
 * Create a new residence.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the residence is created.
 */
const createResidence = async (req, res) => {
	const { residenceNumber, residenceName, residents } = req.body;
	try {
		const user = await Residence.create({
			residenceNumber,
			residenceName,
			residents,
		});
		res.status(200).json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

module.exports = {
	createResidence,
	getResidence,
};
