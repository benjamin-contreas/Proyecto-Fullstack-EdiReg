const mongoose = require('mongoose');
const User = require('../models/userModel');

/**
 * Get a user by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The user object or an error message.
 */
const getUser = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

/**
 * Create a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the created user object or an error message.
 */
const createUser = async (req, res) => {
	const { username, password, role, userInfo } = req.body;
	try {
		const user = await User.create({
			username,
			password,
			role,
			userInfo,
		});
		res.status(200).json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

module.exports = {
	createUser,
	getUser,
};
