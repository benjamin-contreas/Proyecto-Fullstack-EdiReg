const mongoose = require('mongoose');
const Package = require('../models/packageModel');
require('dotenv').config();
const mailgun = require('mailgun-js');

const DOMAIN = 'sandbox5165c42b65544c7a907eafa6b8135686.mailgun.org';
const mg = mailgun({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: DOMAIN,
});

/**
 * Create a new package entry.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the package is created.
 */
const createPackage = async (req, res) => {
	const {
		targetResidenceId,
		description,
		deliveredAt,
		status,
		courierInfo,
		residentMails,
	} = req.body;

	try {
		const package = await Package.create({
			targetResidenceId,
			description,
			deliveredAt,
			status,
			courierInfo,
		});

		for (let residentMail of residentMails) {
			const data = {
				from:
					'Excited User <postmaster@sandbox5165c42b65544c7a907eafa6b8135686.mailgun.org>',
				to: residentMail,
				subject: `Package ${status}`,
				text: `Your package with the description "${description}" has been ${status}.`,
			};

			mg.messages().send(data, function (error, body) {
				if (error) {
					console.log('Error in sending email: ', error);
					return;
				}
				console.log('Response from Mailgun: ', body);
			});
		}
		res.status(200).json(package);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

module.exports = {
	createPackage,
};
