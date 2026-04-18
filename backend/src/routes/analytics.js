const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { getAnalytics } = require('../controllers/misc');
router.get('/', auth, admin, getAnalytics);
module.exports = router;
