const Package = require('../models/packageModel');
require('dotenv').config();
const mailgun = require('mailgun-js');

const createPackage = async (req, res) => {
	const { targetResidenceId, description, deliveredAt, status, courierInfo, residentMails = [] } = req.body;
	try {
		const packageEntry = await Package.create({ targetResidenceId, description, deliveredAt, status, courierInfo });

		if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
			const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
			await Promise.all(residentMails.map((to) => mg.messages().send({
				from: `EdiReg <postmaster@${process.env.MAILGUN_DOMAIN}>`,
				to,
				subject: `Package ${status}`,
				text: `Your package with the description "${description}" has been ${status}.`,
			})));
		}

		res.status(201).json(packageEntry);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

module.exports = { createPackage };
