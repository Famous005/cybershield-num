// quizzes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const c = require('../controllers/quizzes');

router.get('/:moduleId/questions', auth, c.getQuizQuestions);
router.post('/submit', auth, c.submitQuiz);
router.get('/:moduleId/admin', auth, admin, c.getQuestionsAdmin);
router.post('/question', auth, admin, c.createQuestion);
router.put('/question/:id', auth, admin, c.updateQuestion);
router.delete('/question/:id', auth, admin, c.deleteQuestion);

module.exports = router;
