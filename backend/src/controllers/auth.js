const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const getLevelFromXP = (xp) => {
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 500) return 3;
  if (xp < 800) return 4;
  if (xp < 1200) return 5;
  if (xp < 1800) return 6;
  if (xp < 2500) return 7;
  if (xp < 3500) return 8;
  if (xp < 5000) return 9;
  return 10;
};

exports.register = async (req, res) => {
  try {
    const { name, email, matricNo, faculty, department, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { matricNo }] },
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or Matric Number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarColors = ['#006B35', '#1a5276', '#7D3C98', '#E74C3C', '#E67E22', '#1ABC9C'];
    const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const user = await prisma.user.create({
      data: { name, email, matricNo, faculty, department, password: hashedPassword, avatarColor },
    });

    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (user.suspended) {
      return res.status(403).json({ message: 'Account suspended. Please contact admin.' });
    }

    // Update streak
    const now = new Date();
    const lastLogin = user.lastLoginAt;
    let newStreak = user.streak;

    if (lastLogin) {
      const diffMs = now - lastLogin;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) newStreak += 1;
      else if (diffDays > 1) newStreak = 1;
    } else {
      newStreak = 1;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: now, streak: newStreak },
    });

    // Check for streak badge
    if (newStreak >= 7) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: user.id, badgeId: 'badge-10' } },
        update: {},
        create: { userId: user.id, badgeId: 'badge-10' },
      }).catch(() => {});
    }

    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        userBadges: { include: { badge: true } },
        progress: { include: { module: true } },
      },
    });
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
