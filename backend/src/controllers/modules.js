const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getModules = async (req, res) => {
  try {
    const modules = await prisma.module.findMany({
      where: req.user.role === 'ADMIN' ? {} : { published: true },
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { quizQuestions: true } },
        progress: { where: { userId: req.user.id } },
      },
    });

    const modulesWithProgress = modules.map(m => ({
      ...m,
      questionCount: m._count.quizQuestions,
      completed: m.progress[0]?.completed || false,
      completedAt: m.progress[0]?.completedAt || null,
      _count: undefined,
      progress: undefined,
    }));

    res.json(modulesWithProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getModule = async (req, res) => {
  try {
    const module = await prisma.module.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { quizQuestions: true } } },
    });
    if (!module) return res.status(404).json({ message: 'Module not found' });

    const progress = await prisma.progress.findUnique({
      where: { userId_moduleId: { userId: req.user.id, moduleId: module.id } },
    });

    res.json({ ...module, completed: progress?.completed || false, completedAt: progress?.completedAt });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.completeModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const module = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) return res.status(404).json({ message: 'Module not found' });

    const existing = await prisma.progress.findUnique({
      where: { userId_moduleId: { userId: req.user.id, moduleId } },
    });

    if (existing?.completed) {
      return res.json({ message: 'Already completed', xpEarned: 0 });
    }

    await prisma.progress.upsert({
      where: { userId_moduleId: { userId: req.user.id, moduleId } },
      update: { completed: true, completedAt: new Date() },
      create: { userId: req.user.id, moduleId, completed: true, completedAt: new Date() },
    });

    // Award XP
    const newXp = req.user.xp + module.xpReward;
    const newLevel = getLevelFromXP(newXp);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { xp: newXp, level: newLevel },
    });

    // Check module count badges
    const completedCount = await prisma.progress.count({
      where: { userId: req.user.id, completed: true },
    });

    const badgeMap = { 1: 'badge-01', 3: 'badge-02', 5: 'badge-03' };
    if (badgeMap[completedCount]) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: req.user.id, badgeId: badgeMap[completedCount] } },
        update: {},
        create: { userId: req.user.id, badgeId: badgeMap[completedCount] },
      }).catch(() => {});
    }

    // Phishing module badge
    if (moduleId === 'module-01') {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: req.user.id, badgeId: 'badge-09' } },
        update: {},
        create: { userId: req.user.id, badgeId: 'badge-09' },
      }).catch(() => {});
    }

    // XP threshold badges
    await checkXPBadges(req.user.id, newXp);

    res.json({ message: 'Module completed!', xpEarned: module.xpReward, newXp, newLevel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin
exports.createModule = async (req, res) => {
  try {
    const count = await prisma.module.count();
    const module = await prisma.module.create({
      data: { ...req.body, order: count + 1 },
    });
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const module = await prisma.module.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    await prisma.module.delete({ where: { id: req.params.id } });
    res.json({ message: 'Module deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getLevelFromXP = (xp) => {
  const levels = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i]) return i + 1;
  }
  return 1;
};

const checkXPBadges = async (userId, xp) => {
  const xpBadges = [
    { threshold: 500, badgeId: 'badge-06' },
    { threshold: 1000, badgeId: 'badge-07' },
    { threshold: 2500, badgeId: 'badge-08' },
  ];
  for (const { threshold, badgeId } of xpBadges) {
    if (xp >= threshold) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId, badgeId } },
        update: {},
        create: { userId, badgeId },
      }).catch(() => {});
    }
  }
};
