import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, ChevronRight, Zap, AlertTriangle } from 'lucide-react';
import api from '../utils/api';
import { getDifficultyColor } from '../utils/helpers';

export default function Scenarios() {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/scenarios').then(({ data }) => { setScenarios(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white">Real-Life Simulations</h1>
        <p className="text-gray-400 text-sm mt-1">Practice your response to actual cybersecurity incidents that happened at or near NUM. Make decisions and learn from the outcomes.</p>
      </div>

      {/* Research insight banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-500/8 border border-blue-500/20 rounded-xl mb-6">
        <AlertTriangle size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-gray-300 text-sm">
          <span className="font-semibold text-blue-400">Survey finding:</span> A majority of NUM students expressed strong interest in learning through real-life simulations. These scenarios are based on confirmed incidents.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">{Array(4).fill(0).map((_, i) => <div key={i} className="shimmer rounded-2xl h-40" />)}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={`/scenarios/${s.id}`}
                className="flex flex-col p-5 bg-[#0f1a14] border border-[#1a3025] rounded-2xl hover:border-numa-green/40 hover:bg-[#132018] transition-all group h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{s.thumbnail}</div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`badge-pill ${getDifficultyColor(s.difficulty)}`}>{s.difficulty}</span>
                    {s.completed && <span className="badge-pill bg-numa-green/15 text-numa-green">Completed ✓</span>}
                  </div>
                </div>
                <h3 className="font-display font-bold text-white mb-2 group-hover:text-numa-green transition-colors">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">{s.description}</p>
                <div className="border-t border-[#1a3025] pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Zap size={11} className="text-numa-gold" />{s.xpReward} XP</span>
                    <span>{s.attemptCount} attempts</span>
                    {s.bestScore !== null && <span className="text-numa-green">Best: {s.bestScore}/{s.maxScore}</span>}
                  </div>
                  <ChevronRight size={16} className="text-gray-500 group-hover:text-numa-green transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
