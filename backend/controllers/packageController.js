const Package = require('../models/packageModel');
const Residence = require('../models/residenceModel');

const createPackage = async (req, res) => {
	const { targetResidenceId, description, deliveredAt, status, courierInfo } = req.body;
	try {
		const residence = await Residence.exists({ _id: targetResidenceId });
		if (!residence) {
			return res.status(404).json({ error: 'residence_not_found' });
		}
		const packageEntry = await Package.create({ targetResidenceId, description, deliveredAt, status, courierInfo });
		return res.status(201).json({
			packageEntry,
			notification: { status: 'not_configured' },
		});
	} catch (error) {
		if (error.name === 'ValidationError' || error.name === 'CastError') {
			return res.status(400).json({ error: 'invalid_package' });
		}
		return res.status(500).json({ error: 'package_registration_failed' });
	}
};

module.exports = { createPackage };
