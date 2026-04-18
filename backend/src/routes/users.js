const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { getUsers, toggleSuspendUser, getUserDetail } = require('../controllers/misc');
router.get('/', auth, admin, getUsers);
router.get('/:id', auth, admin, getUserDetail);
router.put('/:id/suspend', auth, admin, toggleSuspendUser);
module.exports = router;
