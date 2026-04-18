import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Lock, Zap, ChevronRight } from 'lucide-react';
import api from '../utils/api';

export default function Modules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/modules').then(({ data }) => { setModules(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const completed = modules.filter(m => m.completed).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white">Learning Modules</h1>
        <p className="text-gray-400 text-sm mt-1">{completed} of {modules.length} modules completed</p>
        <div className="mt-3 xp-bar h-2">
          <div className="h-full rounded-full bg-gradient-to-r from-numa-green to-numa-gold transition-all duration-700"
            style={{ width: modules.length > 0 ? `${(completed / modules.length) * 100}%` : '0%' }} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{Array(5).fill(0).map((_, i) => <div key={i} className="shimmer h-32 rounded-2xl" />)}</div>
      ) : (
        <div className="space-y-4">
          {modules.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Link to={`/modules/${m.id}`}
                className="flex gap-5 p-5 bg-[#0f1a14] border border-[#1a3025] rounded-2xl hover:border-numa-green/40 hover:bg-[#132018] transition-all group">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: m.color + '15', border: `1px solid ${m.color}35` }}>
                  {m.completed ? '✅' : ['🎣', '🔐', '🎭', '🐛', '🛡️'][i] || '📖'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display font-bold text-white group-hover:text-numa-green transition-colors">{m.title}</h3>
                      <p className="text-gray-400 text-sm mt-1 leading-relaxed">{m.description}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-500 group-hover:text-numa-green transition-colors flex-shrink-0 mt-1" />
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Zap size={12} className="text-numa-gold" />{m.xpReward} XP
                    </span>
                    <span className="text-xs text-gray-500">{m.questionCount} quiz questions</span>
                    {m.completed && (
                      <span className="flex items-center gap-1 text-xs text-numa-green">
                        <CheckCircle2 size={12} />Completed
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
