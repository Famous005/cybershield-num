export const getLevelFromXP = (xp) => {
  const thresholds = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000];
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) return i + 1;
  }
  return 1;
};

export const getXPForNextLevel = (level) => {
  const thresholds = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000];
  return thresholds[Math.min(level, thresholds.length - 1)] || 5000;
};

export const getXPForCurrentLevel = (level) => {
  const thresholds = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000];
  return thresholds[Math.max(level - 1, 0)] || 0;
};

export const getLevelProgress = (xp, level) => {
  const current = getXPForCurrentLevel(level);
  const next = getXPForNextLevel(level);
  if (next === current) return 100;
  return Math.round(((xp - current) / (next - current)) * 100);
};

export const getDifficultyColor = (difficulty) => {
  if (difficulty === 'Easy') return 'text-green-400 bg-green-400/10';
  if (difficulty === 'Medium') return 'text-yellow-400 bg-yellow-400/10';
  return 'text-red-400 bg-red-400/10';
};

export const getRankIcon = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

export const formatDate = (date) => {
  if (!date) return 'Never';
  return new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};
