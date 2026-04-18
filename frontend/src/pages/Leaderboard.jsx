import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Flame, Award, Crown } from 'lucide-react';
import api from '../utils/api';
import useStore from '../store/useStore';
import { getInitials, getRankIcon } from '../utils/helpers';

export default function Leaderboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();

  useEffect(() => {
    api.get('/leaderboard').then(({ data }) => { setData(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const top3 = data?.leaderboard?.slice(0, 3) || [];
  const rest = data?.leaderboard?.slice(3) || [];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white">Leaderboard</h1>
        <p className="text-gray-400 text-sm mt-1">Top cybersecurity guardians at Newgate University Minna</p>
      </div>

      {/* Podium */}
      {!loading && top3.length >= 3 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-center gap-4 mb-10 px-4">
          {[top3[1], top3[0], top3[2]].map((student, podiumPos) => {
            const heights = ['h-24', 'h-32', 'h-20'];
            const crowns = ['🥈', '🥇', '🥉'];
            const colors = ['border-gray-400/40 bg-gray-400/5', 'border-numa-gold/50 bg-numa-gold/8 green-glow', 'border-orange-600/40 bg-orange-600/5'];
            const nameColors = ['text-gray-300', 'text-numa-gold', 'text-orange-400'];
            const isCurrentUser = student?.id === user?.id;

            return student ? (
              <div key={student.id} className="flex flex-col items-center flex-1">
                <div className="text-2xl mb-2">{crowns[podiumPos]}</div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold font-display mb-2 text-sm ${isCurrentUser ? 'ring-2 ring-numa-green' : ''}`}
                  style={{ backgroundColor: student.avatarColor }}>
                  {getInitials(student.name)}
                </div>
                <p className={`text-xs font-semibold text-center mb-1 ${nameColors[podiumPos]}`}>{student.name.split(' ')[0]}</p>
                <p className="text-xs text-gray-500">{student.xp.toLocaleString()} XP</p>
                <div className={`w-full ${heights[podiumPos]} rounded-t-xl border mt-3 flex items-center justify-center ${colors[podiumPos]}`}>
                  <span className="font-display font-bold text-2xl" style={{ color: podiumPos === 1 ? '#C9A84C' : podiumPos === 0 ? '#aaa' : '#cd7f32' }}>
                    {podiumPos === 1 ? '1' : podiumPos === 0 ? '2' : '3'}
                  </span>
                </div>
              </div>
            ) : null;
          })}
        </motion.div>
      )}

      {/* Current user rank if not in top list visible area */}
      {data?.currentUser && data.currentUser.rank > 10 && (
        <div className="mb-4 p-4 bg-numa-green/10 border border-numa-green/30 rounded-xl flex items-center gap-4">
          <span className="text-numa-green font-display font-bold text-lg">#{data.currentUser.rank}</span>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">Your Position</p>
            <p className="text-gray-400 text-xs">{data.currentUser.xp.toLocaleString()} XP • Level {data.currentUser.level}</p>
          </div>
          <span className="text-numa-green text-xs">You</span>
        </div>
      )}

      {/* Full list */}
      {loading ? (
        <div className="space-y-3">{Array(10).fill(0).map((_, i) => <div key={i} className="shimmer h-16 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-2">
          {data?.leaderboard?.map((student, i) => {
            const isCurrentUser = student.id === user?.id;
            return (
              <motion.div key={student.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isCurrentUser ? 'bg-numa-green/10 border-numa-green/40' : 'bg-[#0f1a14] border-[#1a3025]'}`}>
                {/* Rank */}
                <div className="w-8 text-center flex-shrink-0">
                  {student.rank <= 3
                    ? <span className="text-xl">{getRankIcon(student.rank)}</span>
                    : <span className="font-display font-bold text-gray-400 text-sm">#{student.rank}</span>}
                </div>

                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold font-display flex-shrink-0 ${isCurrentUser ? 'ring-2 ring-numa-green' : ''}`}
                  style={{ backgroundColor: student.avatarColor }}>
                  {getInitials(student.name)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-sm truncate ${isCurrentUser ? 'text-numa-green' : 'text-white'}`}>
                      {student.name} {isCurrentUser && <span className="text-xs font-normal">(You)</span>}
                    </p>
                  </div>
                  <p className="text-gray-500 text-xs truncate">{student.faculty}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-400 flex-shrink-0">
                  {student.streak > 0 && (
                    <span className="flex items-center gap-1 text-orange-400">
                      <Flame size={12} />{student.streak}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-purple-400">
                    <Award size={12} />{student.badgeCount}
                  </span>
                  <div className="text-right">
                    <p className="flex items-center gap-1 text-numa-green font-semibold">
                      <Zap size={11} />{student.xp.toLocaleString()}
                    </p>
                    <p className="text-gray-500">Lvl {student.level}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
