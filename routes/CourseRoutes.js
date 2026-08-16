const express = require('express');
const router = express.Router();
const { createCourse } = require('../controllers/courseController');
const verifyJWT = require('../middleware/verifyJWT');
const requireAdmin = require('../middleware/requireAdmin');

router.post('/', verifyJWT, requireAdmin, createCourse);

module.exports = router;