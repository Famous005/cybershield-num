import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Zap, Shield, Award, BookOpen, Flame, Mail, Hash, Building2 } from 'lucide-react';
import api from '../utils/api';
import useStore from '../store/useStore';
import { getLevelProgress, getXPForNextLevel, formatDate, getInitials } from '../utils/helpers';

export default function Profile() {
  const { user, refreshUser } = useStore();
  const [badges, setBadges] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/badges'), api.get('/modules')]).then(([b, m]) => {
      setBadges(b.data.filter(b => b.earned).slice(0, 6));
      setProgress(m.data);
      setLoading(false);
    }).catch(() => setLoading(false));
    refreshUser();
  }, []);

  const xpPct = getLevelProgress(user?.xp || 0, user?.level || 1);
  const nextXP = getXPForNextLevel(user?.level || 1);
  const completedModules = progress.filter(m => m.completed).length;

  const stats = [
    { icon: Zap, label: 'Total XP', value: (user?.xp || 0).toLocaleString(), color: 'text-numa-green' },
    { icon: Shield, label: 'Level', value: user?.level || 1, color: 'text-blue-400' },
    { icon: BookOpen, label: 'Modules', value: `${completedModules}/5`, color: 'text-purple-400' },
    { icon: Flame, label: 'Streak', value: `${user?.streak || 0}d`, color: 'text-orange-400' },
    { icon: Award, label: 'Badges', value: badges.length, color: 'text-yellow-400' },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="font-display font-bold text-2xl text-white mb-6">My Profile</h1>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card mb-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-display flex-shrink-0 green-glow"
            style={{ backgroundColor: user?.avatarColor || '#006B35' }}>
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-2xl text-white">{user?.name}</h2>
            <p className="text-numa-green text-sm font-semibold">Level {user?.level} • Cyber Guardian</p>
            <div className="mt-3 space-y-1">
              {[
                { icon: Mail, value: user?.email },
                { icon: Hash, value: user?.matricNo },
                { icon: Building2, value: `${user?.department} — ${user?.faculty}` },
              ].map(({ icon: Icon, value }) => (
                <div key={value} className="flex items-center gap-2 text-gray-400 text-sm">
                  <Icon size={13} className="text-gray-500" />{value}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-5 p-4 bg-[#0a1510] rounded-xl">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Level {user?.level} Progress</span>
            <span className="text-numa-green font-semibold">{(user?.xp || 0).toLocaleString()} / {nextXP?.toLocaleString()} XP</span>
          </div>
          <div className="xp-bar h-3">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-numa-green to-numa-gold"
              initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} />
          </div>
          <p className="text-xs text-gray-500 mt-1.5">{100 - xpPct}% more to Level {(user?.level || 1) + 1}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="card text-center py-4">
            <Icon size={18} className={`${color} mx-auto mb-2`} />
            <p className={`font-display font-bold text-xl ${color}`}>{value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Module progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="card mb-6">
        <h3 className="font-display font-bold text-white mb-4">Module Progress</h3>
        {loading ? Array(5).fill(0).map((_, i) => <div key={i} className="shimmer h-8 rounded-lg mb-2" />) : (
          <div className="space-y-3">
            {progress.map(m => (
              <div key={m.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded flex items-center justify-center text-sm flex-shrink-0">
                  {m.completed ? '✅' : '⬜'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={m.completed ? 'text-white' : 'text-gray-400'}>{m.title}</span>
                    <span className="text-xs text-gray-500">{m.completed ? `+${m.xpReward} XP` : `${m.xpReward} XP`}</span>
                  </div>
                  <div className="xp-bar h-1">
                    <div className="h-full rounded-full bg-numa-green transition-all" style={{ width: m.completed ? '100%' : '0%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent badges */}
      {badges.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="card">
          <h3 className="font-display font-bold text-white mb-4">Recent Badges</h3>
          <div className="flex flex-wrap gap-3">
            {badges.map(b => (
              <div key={b.id} className="flex items-center gap-2 bg-[#0a1510] border border-[#1a3025] rounded-xl px-3 py-2">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className="text-white text-xs font-semibold">{b.name}</p>
                  <p className="text-gray-500 text-[10px]">{formatDate(b.earnedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
