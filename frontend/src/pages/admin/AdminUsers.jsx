import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, ShieldOff, Eye, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatDate, getInitials } from '../../utils/helpers';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const load = async (p = 1, s = search) => {
    setLoading(true);
    try {
      const { data } = await api.get('/users', { params: { page: p, limit: 15, search: s } });
      setUsers(data.users);
      setMeta({ total: data.total, pages: data.pages });
    } catch { toast.error('Failed to load students'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => load(1, e.target.value), 500);
  };

  const handleSuspend = async (userId, suspended) => {
    try {
      await api.put(`/users/${userId}/suspend`);
      toast.success(suspended ? 'Student unsuspended' : 'Student suspended');
      setUsers(u => u.map(s => s.id === userId ? { ...s, suspended: !s.suspended } : s));
    } catch { toast.error('Failed to update user'); }
  };

  const loadDetail = async (user) => {
    try {
      const { data } = await api.get(`/users/${user.id}`);
      setSelected(data);
      setDetailOpen(true);
    } catch { toast.error('Failed to load user details'); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Student Management</h1>
          <p className="text-gray-400 text-sm mt-1">{meta.total} total students registered</p>
        </div>
        <div className="flex items-center gap-2 bg-numa-green/10 border border-numa-green/20 rounded-full px-4 py-2">
          <Users size={14} className="text-numa-green" />
          <span className="text-numa-green text-sm font-semibold">{meta.total} students</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={handleSearch} placeholder="Search by name, email or matric number..."
          className="input pl-11 w-full max-w-md" />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a3025]">
                {['Student', 'Matric No', 'Faculty', 'XP / Level', 'Modules', 'Last Login', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="shimmer h-8 rounded" /></td></tr>
              )) : users.map((student) => (
                <motion.tr key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="border-b border-[#1a3025]/50 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-numa-green/70">
                        {getInitials(student.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate max-w-[140px]">{student.name}</p>
                        <p className="text-gray-500 text-xs truncate max-w-[140px]">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{student.matricNo}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs max-w-[120px] truncate">{student.faculty?.split(' ')[0]}</td>
                  <td className="px-4 py-3">
                    <span className="text-numa-green font-semibold">{student.xp.toLocaleString()}</span>
                    <span className="text-gray-500 text-xs ml-1">Lvl {student.level}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{student.completedModules}/5</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(student.lastLoginAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge-pill text-xs ${student.suspended ? 'bg-red-500/15 text-red-400' : 'bg-numa-green/15 text-numa-green'}`}>
                      {student.suspended ? '🔴 Suspended' : '🟢 Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => loadDetail(student)}
                        className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all" title="View details">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => handleSuspend(student.id, student.suspended)}
                        className={`p-1.5 rounded-lg transition-all ${student.suspended ? 'text-gray-500 hover:text-numa-green hover:bg-numa-green/10' : 'text-gray-500 hover:text-red-400 hover:bg-red-400/10'}`}
                        title={student.suspended ? 'Unsuspend' : 'Suspend'}>
                        {student.suspended ? <Shield size={14} /> : <ShieldOff size={14} />}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#1a3025]">
            <p className="text-gray-500 text-xs">Page {page} of {meta.pages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => { setPage(p => p - 1); load(page - 1); }}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-30 hover:bg-white/5 rounded-lg transition-all">
                <ChevronLeft size={15} />
              </button>
              <button disabled={page === meta.pages} onClick={() => { setPage(p => p + 1); load(page + 1); }}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-30 hover:bg-white/5 rounded-lg transition-all">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detailOpen && selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setDetailOpen(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#0f1a14] border border-[#1a3025] rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-xl bg-numa-green/70 flex items-center justify-center text-white font-bold font-display text-lg">
                {getInitials(selected.name)}
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-white">{selected.name}</h2>
                <p className="text-gray-400 text-sm">{selected.email}</p>
                <p className="text-gray-500 text-xs mt-1">{selected.faculty} — {selected.department}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'XP', value: selected.xp?.toLocaleString() },
                { label: 'Level', value: selected.level },
                { label: 'Streak', value: `${selected.streak}d` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#0a1510] rounded-xl p-3 text-center">
                  <p className="text-numa-green font-bold text-xl">{value}</p>
                  <p className="text-gray-500 text-xs">{label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-5">
              <h3 className="text-white font-semibold text-sm">Module Progress</h3>
              {selected.progress?.map(p => (
                <div key={p.moduleId} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{p.module?.title}</span>
                  <span className={p.completed ? 'text-numa-green' : 'text-gray-500'}>{p.completed ? '✅ Done' : '⬜ Pending'}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setDetailOpen(false)} className="btn-outline flex-1">Close</button>
              <button onClick={() => { handleSuspend(selected.id, selected.suspended); setDetailOpen(false); }}
                className={`flex-1 font-semibold px-4 py-3 rounded-xl transition-all ${selected.suspended ? 'bg-numa-green text-white hover:bg-numa-green-light' : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'}`}>
                {selected.suspended ? 'Unsuspend' : 'Suspend'} Student
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
