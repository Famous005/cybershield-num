const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getBadges } = require('../controllers/misc');
router.get('/', auth, getBadges);
module.exports = router;
