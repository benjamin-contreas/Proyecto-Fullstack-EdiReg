const express = require('express');
const { createUser, getUser } = require('../controllers/userController');

const router = express.Router();

// GET a single User by id
router.get('/:id', getUser);
// POST a single User
router.post('/', createUser);

module.exports = router;
