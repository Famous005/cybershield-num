const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getLevelFromXP = (xp) => {
  const levels = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i]) return i + 1;
  }
  return 1;
};

exports.getScenarios = async (req, res) => {
  try {
    const scenarios = await prisma.scenario.findMany({
      where: req.user.role === 'ADMIN' ? {} : { published: true },
      orderBy: { createdAt: 'asc' },
      include: {
        _count: { select: { attempts: true } },
        attempts: { where: { userId: req.user.id }, orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    res.json(scenarios.map(s => ({
      id: s.id, title: s.title, description: s.description,
      incident: s.incident, thumbnail: s.thumbnail, difficulty: s.difficulty,
      xpReward: s.xpReward, published: s.published, createdAt: s.createdAt,
      attemptCount: s._count.attempts,
      bestScore: s.attempts[0]?.score || null,
      maxScore: s.attempts[0]?.maxScore || null,
      completed: s.attempts.length > 0,
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getScenario = async (req, res) => {
  try {
    const scenario = await prisma.scenario.findUnique({ where: { id: req.params.id } });
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });
    res.json({ ...scenario, steps: JSON.parse(scenario.steps) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitScenario = async (req, res) => {
  try {
    const { scenarioId, choices, score, maxScore } = req.body;
    const xpEarned = Math.round((score / maxScore) * 100);

    await prisma.scenarioAttempt.create({
      data: { userId: req.user.id, scenarioId, score, maxScore, xpEarned, choices: JSON.stringify(choices) },
    });

    const newXp = req.user.xp + xpEarned;
    const newLevel = getLevelFromXP(newXp);
    await prisma.user.update({ where: { id: req.user.id }, data: { xp: newXp, level: newLevel } });

    // Scenario survivor badge
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: req.user.id, badgeId: 'badge-05' } },
      update: {},
      create: { userId: req.user.id, badgeId: 'badge-05' },
    }).catch(() => {});

    res.json({ message: 'Scenario submitted!', xpEarned, newXp, newLevel, score, maxScore });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin
exports.createScenario = async (req, res) => {
  try {
    const scenario = await prisma.scenario.create({ data: req.body });
    res.status(201).json(scenario);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateScenario = async (req, res) => {
  try {
    const scenario = await prisma.scenario.update({ where: { id: req.params.id }, data: req.body });
    res.json(scenario);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteScenario = async (req, res) => {
  try {
    await prisma.scenario.delete({ where: { id: req.params.id } });
    res.json({ message: 'Scenario deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
