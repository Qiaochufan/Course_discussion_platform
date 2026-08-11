const express = require('express');
const router = express.Router();
const { registerUser, userLogin } = require('../controllers/userController');

router.post('/', registerUser);
router.post('/login', userLogin);

module.exports = router;