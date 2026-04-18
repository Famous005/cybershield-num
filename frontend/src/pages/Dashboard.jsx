import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Gamepad2, Trophy, Zap, ChevronRight, Shield, TrendingUp, Award, Flame } from 'lucide-react';
import api from '../utils/api';
import useStore from '../store/useStore';
import { getLevelProgress, getXPForNextLevel, getXPForCurrentLevel } from '../utils/helpers';

const tips = [
  "🔒 Never share your student portal password with anyone, including classmates.",
  "🎣 NUM will never ask for payment through WhatsApp or social media DMs.",
  "🔑 Use a password manager like Bitwarden (free) to keep your accounts secure.",
  "📲 Enable two-factor authentication on your university email today.",
  "🛡️ Keep your phone and laptop software updated to patch security vulnerabilities.",
  "🌐 Avoid accessing your student portal on public WiFi without a VPN.",
  "📧 Check the sender's full email address before clicking any link in an email.",
  "💾 Back up your important academic files to Google Drive or external storage weekly.",
];

export default function Dashboard() {
  const { user, refreshUser } = useStore();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tip] = useState(tips[Math.floor(Math.random() * tips.length)]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/modules');
        setModules(data.slice(0, 3));
      } catch {}
      setLoading(false);
    };
    load();
    refreshUser();
  }, []);

  const completedCount = modules.filter(m => m.completed).length;
  const xpProgress = getLevelProgress(user?.xp || 0, user?.level || 1);
  const currentLevelXP = getXPForCurrentLevel(user?.level || 1);
  const nextLevelXP = getXPForNextLevel(user?.level || 1);

  const quickStats = [
    { icon: Zap, label: 'Total XP', value: (user?.xp || 0).toLocaleString(), color: 'text-numa-green', bg: 'bg-numa-green/10' },
    { icon: Shield, label: 'Level', value: user?.level || 1, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { icon: Flame, label: 'Day Streak', value: `${user?.streak || 0} days`, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { icon: BookOpen, label: 'Modules Done', value: `${completedCount}/5`, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl text-white">
          Welcome back, <span className="text-numa-green">{user?.name?.split(' ')[0]} 👋</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">{user?.faculty} • {user?.matricNo}</p>
      </motion.div>

      {/* Daily Tip */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-numa-green/10 to-transparent border border-numa-green/25 rounded-2xl p-4 flex gap-3">
        <div className="w-8 h-8 bg-numa-green/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <Shield size={16} className="text-numa-green" />
        </div>
        <div>
          <p className="text-xs font-semibold text-numa-green uppercase tracking-wider mb-1">Daily Security Tip</p>
          <p className="text-gray-300 text-sm">{tip}</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map(({ icon: Icon, label, value, color, bg }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
            className="card">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className={`font-display font-bold text-xl ${color}`}>{value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* XP Progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-white">Level {user?.level} Progress</h3>
            <p className="text-gray-400 text-sm">{(user?.xp || 0).toLocaleString()} / {nextLevelXP?.toLocaleString()} XP to Level {(user?.level || 1) + 1}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-display font-bold text-numa-green">{xpProgress}%</p>
          </div>
        </div>
        <div className="xp-bar h-3">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-numa-green to-numa-gold"
            initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Level {user?.level}</span>
          <span>Level {(user?.level || 1) + 1}</span>
        </div>
      </motion.div>

      {/* Two columns: modules + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continue Learning */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-white">Continue Learning</h2>
            <Link to="/modules" className="text-numa-green text-sm hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? Array(3).fill(0).map((_, i) => (
              <div key={i} className="shimmer h-16 rounded-xl" />
            )) : modules.map((m) => (
              <Link key={m.id} to={`/modules/${m.id}`}
                className="flex items-center gap-4 p-4 bg-[#0f1a14] border border-[#1a3025] rounded-xl hover:border-numa-green/40 transition-all group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: m.color + '20', border: `1px solid ${m.color}40` }}>
                  {m.completed ? '✅' : '📖'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{m.title}</p>
                  <p className="text-gray-500 text-xs">{m.xpReward} XP • {m.questionCount} questions</p>
                </div>
                {m.completed
                  ? <span className="badge-pill bg-numa-green/15 text-numa-green text-xs">Done ✓</span>
                  : <ChevronRight size={16} className="text-gray-500 group-hover:text-numa-green transition-colors" />}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="font-display font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { to: '/scenarios', icon: Gamepad2, title: 'Try a Simulation', desc: 'Practice real-world cyber scenarios', color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { to: '/leaderboard', icon: Trophy, title: 'View Leaderboard', desc: 'See how you rank among students', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
              { to: '/badges', icon: Award, title: 'Your Badges', desc: 'Check unlocked achievements', color: 'text-purple-400', bg: 'bg-purple-400/10' },
            ].map(({ to, icon: Icon, title, desc, color, bg }) => (
              <Link key={to} to={to} className="flex items-center gap-4 p-4 bg-[#0f1a14] border border-[#1a3025] rounded-xl hover:border-white/20 transition-all group">
                <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={color} />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
                <ChevronRight size={16} className="text-gray-500 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>

          {/* Research insight card */}
          <div className="mt-4 p-4 bg-[#0a1510] border border-[#1a3025] rounded-xl">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Did You Know?</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              A survey of NUM students found that <span className="text-numa-green font-semibold">49.7%</span> have only moderate cybersecurity knowledge.
              Students like you completing this platform are making NUM safer. 🛡️
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
