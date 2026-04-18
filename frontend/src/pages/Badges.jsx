import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { formatDate } from '../utils/helpers';

export default function Badges() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/badges').then(({ data }) => { setBadges(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const earned = badges.filter(b => b.earned);
  const locked = badges.filter(b => !b.earned);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white">Your Badges</h1>
        <p className="text-gray-400 text-sm mt-1">{earned.length} of {badges.length} badges unlocked</p>
        <div className="mt-3 xp-bar h-2">
          <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-numa-gold transition-all duration-700"
            style={{ width: badges.length > 0 ? `${(earned.length / badges.length) * 100}%` : '0%' }} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(10).fill(0).map((_, i) => <div key={i} className="shimmer rounded-2xl h-40" />)}
        </div>
      ) : (
        <>
          {earned.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                <span>✨</span> Earned ({earned.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {earned.map((badge, i) => (
                  <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                    className="card text-center hover:border-numa-gold/40 transition-all group gold-glow">
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{badge.icon}</div>
                    <h3 className="font-display font-bold text-white text-sm mb-1">{badge.name}</h3>
                    <p className="text-gray-400 text-xs leading-snug mb-3">{badge.description}</p>
                    <p className="text-[10px] text-numa-gold">Earned {formatDate(badge.earnedAt)}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {locked.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-gray-500 mb-4 flex items-center gap-2">
                <span>🔒</span> Locked ({locked.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {locked.map((badge, i) => (
                  <motion.div key={badge.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="relative overflow-hidden text-center p-6 bg-[#0a1208] border border-[#1a3025]/50 rounded-2xl opacity-60">
                    <div className="text-5xl mb-3 grayscale opacity-40">{badge.icon}</div>
                    <h3 className="font-display font-bold text-gray-500 text-sm mb-1">{badge.name}</h3>
                    <p className="text-gray-600 text-xs leading-snug mb-3">{badge.description}</p>
                    <p className="text-[10px] text-gray-600 italic">{badge.condition}</p>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl opacity-20">🔒</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
