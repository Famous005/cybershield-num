import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, HelpCircle, Gamepad2, TrendingUp, UserCheck, Zap } from 'lucide-react';
import api from '../../utils/api';
import { getInitials } from '../../utils/helpers';

const COLORS = ['#006B35', '#3498db', '#9b59b6', '#e67e22', '#27ae60'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics').then(({ data }) => { setData(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const overview = data?.overview || {};
  const cards = [
    { label: 'Total Students', value: overview.totalStudents || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active This Week', value: overview.activeStudents || 0, icon: UserCheck, color: 'text-numa-green', bg: 'bg-numa-green/10' },
    { label: 'Modules', value: overview.totalModules || 0, icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Quiz Attempts', value: overview.quizAttempts || 0, icon: HelpCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Scenario Attempts', value: overview.scenarioAttempts || 0, icon: Gamepad2, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Modules Completed', value: overview.completedModulesTotal || 0, icon: TrendingUp, color: 'text-teal-400', bg: 'bg-teal-400/10' },
  ];

  const moduleChartData = data?.moduleStats?.map(m => ({
    name: m.title.split(' ')[0],
    completed: m.completedCount,
    started: m.totalProgress,
  })) || [];

  const researchData = [
    { name: 'Moderate', value: 49.7, color: '#006B35' },
    { name: 'High', value: 22.2, color: '#3498db' },
    { name: 'Low', value: 18.1, color: '#e67e22' },
    { name: 'None', value: 8.7, color: '#e74c3c' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Platform overview — CyberShield NUM</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">{label}</p>
                <p className={`font-display font-bold text-3xl ${color}`}>{loading ? '—' : value.toLocaleString()}</p>
              </div>
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module completion chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="card">
          <h3 className="font-display font-bold text-white mb-4">Module Engagement</h3>
          {loading ? <div className="shimmer h-48 rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={moduleChartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f1a14', border: '1px solid #1a3025', borderRadius: 8, color: '#e8f5e9' }} />
                <Bar dataKey="completed" fill="#006B35" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="started" fill="#1a3025" radius={[4, 4, 0, 0]} name="Started" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Research data pie chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="card">
          <h3 className="font-display font-bold text-white mb-1">Student Knowledge Levels</h3>
          <p className="text-gray-500 text-xs mb-4">From pre-application survey (N=463)</p>
          {loading ? <div className="shimmer h-48 rounded-xl" /> : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={160}>
                <PieChart>
                  <Pie data={researchData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                    {researchData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {researchData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-gray-300">{d.name}</span>
                    <span className="text-gray-500 ml-auto">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="card">
          <h3 className="font-display font-bold text-white mb-4">Top Students</h3>
          {loading ? <div className="shimmer h-40 rounded-xl" /> : (
            <div className="space-y-3">
              {data?.topStudents?.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm w-5 text-right">{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: s.avatarColor }}>
                    {getInitials(s.name)}
                  </div>
                  <p className="flex-1 text-white text-sm truncate">{s.name}</p>
                  <div className="flex items-center gap-1 text-xs text-numa-green font-semibold">
                    <Zap size={11} />{s.xp.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Registrations */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="card">
          <h3 className="font-display font-bold text-white mb-4">Recent Registrations</h3>
          {loading ? <div className="shimmer h-40 rounded-xl" /> : (
            <div className="space-y-3">
              {data?.recentRegistrations?.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-numa-green/15 flex items-center justify-center">
                    <Users size={14} className="text-numa-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{s.name}</p>
                    <p className="text-gray-500 text-xs truncate">{s.faculty}</p>
                  </div>
                  <p className="text-gray-500 text-xs">{new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
