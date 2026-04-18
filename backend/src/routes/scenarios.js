const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const c = require('../controllers/scenarios');

router.get('/', auth, c.getScenarios);
router.get('/:id', auth, c.getScenario);
router.post('/submit', auth, c.submitScenario);
router.post('/', auth, admin, c.createScenario);
router.put('/:id', auth, admin, c.updateScenario);
router.delete('/:id', auth, admin, c.deleteScenario);

module.exports = router;
