const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// LEADERBOARD
exports.getLeaderboard = async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    
    const users = await prisma.user.findMany({
      where: { role: 'STUDENT', suspended: false },
      orderBy: { xp: 'desc' },
      take: 50,
      select: {
        id: true, name: true, faculty: true, department: true,
        xp: true, level: true, streak: true, avatarColor: true,
        _count: { select: { userBadges: true } },
      },
    });

    const ranked = users.map((u, i) => ({
      ...u,
      rank: i + 1,
      badgeCount: u._count.userBadges,
      isCurrentUser: u.id === req.user.id,
      _count: undefined,
    }));

    const currentUserRank = ranked.find(u => u.id === req.user.id);
    res.json({ leaderboard: ranked, currentUser: currentUserRank || null });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// BADGES
exports.getBadges = async (req, res) => {
  try {
    const allBadges = await prisma.badge.findMany();
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: req.user.id },
      select: { badgeId: true, earnedAt: true },
    });

    const earnedIds = new Map(userBadges.map(ub => [ub.badgeId, ub.earnedAt]));
    
    res.json(allBadges.map(b => ({
      ...b,
      earned: earnedIds.has(b.id),
      earnedAt: earnedIds.get(b.id) || null,
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// USERS (Admin)
exports.getUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      role: 'STUDENT',
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { matricNo: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where, skip, take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, matricNo: true,
          faculty: true, department: true, xp: true, level: true,
          streak: true, suspended: true, createdAt: true, lastLoginAt: true,
          _count: { select: { progress: true, userBadges: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users: users.map(u => ({
        ...u,
        completedModules: u._count.progress,
        badgeCount: u._count.userBadges,
        _count: undefined,
      })),
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleSuspendUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'ADMIN') return res.status(403).json({ message: 'Cannot suspend admin' });

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { suspended: !user.suspended },
    });
    res.json({ message: `User ${updated.suspended ? 'suspended' : 'unsuspended'}`, suspended: updated.suspended });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserDetail = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        progress: { include: { module: true } },
        quizAttempts: { orderBy: { createdAt: 'desc' }, take: 10 },
        scenarioAttempts: { orderBy: { createdAt: 'desc' }, take: 10 },
        userBadges: { include: { badge: true } },
      },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password: _, ...u } = user;
    res.json(u);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ANALYTICS (Admin)
exports.getAnalytics = async (req, res) => {
  try {
    const [
      totalStudents,
      activeStudents,
      totalModules,
      completedModulesTotal,
      quizAttempts,
      scenarioAttempts,
      topStudents,
      recentRegistrations,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'STUDENT', suspended: false, lastLoginAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
      prisma.module.count(),
      prisma.progress.count({ where: { completed: true } }),
      prisma.quizAttempt.count(),
      prisma.scenarioAttempt.count(),
      prisma.user.findMany({
        where: { role: 'STUDENT' }, orderBy: { xp: 'desc' }, take: 5,
        select: { id: true, name: true, xp: true, level: true, avatarColor: true },
      }),
      prisma.user.findMany({
        where: { role: 'STUDENT' }, orderBy: { createdAt: 'desc' }, take: 5,
        select: { id: true, name: true, createdAt: true, faculty: true },
      }),
    ]);

    const moduleStats = await prisma.module.findMany({
      include: {
        _count: { select: { progress: true } },
        progress: { where: { completed: true }, select: { id: true } },
      },
      orderBy: { order: 'asc' },
    });

    res.json({
      overview: { totalStudents, activeStudents, totalModules, completedModulesTotal, quizAttempts, scenarioAttempts },
      moduleStats: moduleStats.map(m => ({
        id: m.id, title: m.title,
        totalProgress: m._count.progress,
        completedCount: m.progress.length,
      })),
      topStudents,
      recentRegistrations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
