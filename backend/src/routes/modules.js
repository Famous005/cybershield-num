const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const c = require('../controllers/modules');

router.get('/', auth, c.getModules);
router.get('/:id', auth, c.getModule);
router.post('/:moduleId/complete', auth, c.completeModule);
router.post('/', auth, admin, c.createModule);
router.put('/:id', auth, admin, c.updateModule);
router.delete('/:id', auth, admin, c.deleteModule);

module.exports = router;
