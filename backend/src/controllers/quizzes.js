const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getLevelFromXP = (xp) => {
  const levels = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i]) return i + 1;
  }
  return 1;
};

exports.getQuizQuestions = async (req, res) => {
  try {
    const questions = await prisma.quizQuestion.findMany({
      where: { moduleId: req.params.moduleId },
      orderBy: { order: 'asc' },
      select: { id: true, question: true, options: true, order: true },
    });

    const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, 10);
    res.json(shuffled.map(q => ({ ...q, options: JSON.parse(q.options) })));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { moduleId, answers } = req.body;

    const questions = await prisma.quizQuestion.findMany({
      where: { moduleId },
    });

    let score = 0;
    const results = answers.map(({ questionId, selectedAnswer }) => {
      const q = questions.find(q => q.id === questionId);
      if (!q) return null;
      const isCorrect = q.answer === selectedAnswer;
      if (isCorrect) score++;
      return {
        questionId,
        question: q.question,
        selectedAnswer,
        correctAnswer: q.answer,
        isCorrect,
        explanation: q.explanation,
        options: JSON.parse(q.options),
      };
    }).filter(Boolean);

    const total = results.length;
    const percentage = Math.round((score / total) * 100);
    const xpEarned = Math.round((score / total) * 80) + (score === total ? 20 : 0);

    await prisma.quizAttempt.create({
      data: {
        userId: req.user.id,
        moduleId,
        score,
        total,
        xpEarned,
        answers: JSON.stringify(answers),
      },
    });

    const newXp = req.user.xp + xpEarned;
    const newLevel = getLevelFromXP(newXp);
    await prisma.user.update({ where: { id: req.user.id }, data: { xp: newXp, level: newLevel } });

    // Perfect score badge
    if (score === total) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: req.user.id, badgeId: 'badge-04' } },
        update: {},
        create: { userId: req.user.id, badgeId: 'badge-04' },
      }).catch(() => {});
    }

    res.json({ score, total, percentage, xpEarned, newXp, newLevel, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin CRUD
exports.getQuestionsAdmin = async (req, res) => {
  try {
    const questions = await prisma.quizQuestion.findMany({
      where: { moduleId: req.params.moduleId },
      orderBy: { order: 'asc' },
    });
    res.json(questions.map(q => ({ ...q, options: JSON.parse(q.options) })));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const { moduleId, question, options, answer, explanation } = req.body;
    const count = await prisma.quizQuestion.count({ where: { moduleId } });
    const q = await prisma.quizQuestion.create({
      data: { moduleId, question, options: JSON.stringify(options), answer, explanation, order: count + 1 },
    });
    res.status(201).json({ ...q, options });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { question, options, answer, explanation } = req.body;
    const q = await prisma.quizQuestion.update({
      where: { id: req.params.id },
      data: { question, options: JSON.stringify(options), answer, explanation },
    });
    res.json({ ...q, options });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await prisma.quizQuestion.delete({ where: { id: req.params.id } });
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
