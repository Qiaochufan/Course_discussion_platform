const express = require('express');
const router = express.Router();
const { registerUser, userLogin, getCurrentUser, updateUser, deleteUser } = require('../controllers/userController');
const verifyJWT = require('../middleware/verifyJWT');

router.post('/', registerUser);
router.post('/login', userLogin);

router.get('/', verifyJWT, getCurrentUser);
router.put('/', verifyJWT, updateUser);
router.delete('/', verifyJWT, deleteUser);

module.exports = router;