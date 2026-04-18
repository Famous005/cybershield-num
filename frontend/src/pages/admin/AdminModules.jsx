import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Save } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const emptyModule = { title: '', description: '', content: '{"sections":[],"keyPoints":[]}', icon: 'Shield', color: '#006B35', order: 1, xpReward: 100, published: true };

export default function AdminModules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyModule);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/modules').then(({ data }) => { setModules(data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyModule); setModal(true); };
  const openEdit = (m) => { setEditing(m); setForm({ title: m.title, description: m.description, content: m.content, icon: m.icon, color: m.color, order: m.order, xpReward: m.xpReward, published: m.published }); setModal(true); };

  const handleSave = async () => {
    if (!form.title || !form.description) return toast.error('Title and description required');
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/modules/${editing.id}`, form);
        toast.success('Module updated');
      } else {
        await api.post('/modules', form);
        toast.success('Module created');
      }
      setModal(false);
      load();
    } catch { toast.error('Failed to save module'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this module and all its quiz questions?')) return;
    try {
      await api.delete(`/modules/${id}`);
      toast.success('Module deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggle = async (m) => {
    try {
      await api.put(`/modules/${m.id}`, { published: !m.published });
      toast.success(m.published ? 'Module unpublished' : 'Module published');
      load();
    } catch { toast.error('Failed to update'); }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Learning Modules</h1>
          <p className="text-gray-400 text-sm mt-1">Manage course content for students</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Module
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array(5).fill(0).map((_, i) => <div key={i} className="shimmer h-20 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {modules.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-4 p-4 bg-[#0f1a14] border border-[#1a3025] rounded-xl hover:border-[#2a4035] transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: m.color + '20', border: `1px solid ${m.color}40` }}>
                <span className="text-lg">📖</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{m.title}</h3>
                  <span className={`badge-pill text-xs ${m.published ? 'bg-numa-green/15 text-numa-green' : 'bg-gray-500/15 text-gray-400'}`}>
                    {m.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-gray-500 text-xs truncate">{m.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-500">{m.xpReward} XP</span>
                <button onClick={() => handleToggle(m)} className="p-2 text-gray-400 hover:text-numa-green hover:bg-numa-green/10 rounded-lg transition-all" title="Toggle publish">
                  {m.published ? <ToggleRight size={18} className="text-numa-green" /> : <ToggleLeft size={18} />}
                </button>
                <button onClick={() => openEdit(m)} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(m.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#0f1a14] border border-[#1a3025] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-xl text-white">{editing ? 'Edit Module' : 'New Module'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Module Title', key: 'title', type: 'text', placeholder: 'e.g. Phishing Awareness' },
                { label: 'Description', key: 'description', type: 'text', placeholder: 'Brief module description' },
                { label: 'XP Reward', key: 'xpReward', type: 'number', placeholder: '100' },
                { label: 'Order', key: 'order', type: 'number', placeholder: '1' },
                { label: 'Accent Color', key: 'color', type: 'color' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
                  {type === 'color' ? (
                    <div className="flex items-center gap-3">
                      <input type="color" value={form[key]} onChange={set(key)} className="w-10 h-10 rounded-lg border border-[#1a3025] cursor-pointer" />
                      <span className="text-gray-400 text-sm font-mono">{form[key]}</span>
                    </div>
                  ) : (
                    <input type={type} value={form[key]} onChange={set(key)} placeholder={placeholder} className="input" />
                  )}
                </div>
              ))}

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Content (JSON)</label>
                <textarea value={form.content} onChange={set('content')} rows={6}
                  className="input font-mono text-xs resize-none"
                  placeholder='{"sections":[{"title":"...","body":"...","tip":"..."}],"keyPoints":[]}' />
                <p className="text-gray-600 text-xs mt-1">JSON with sections array and keyPoints array</p>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="published" checked={form.published}
                  onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                  className="w-4 h-4 accent-[#006B35]" />
                <label htmlFor="published" className="text-sm text-gray-300">Published (visible to students)</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Save size={15} /> {saving ? 'Saving...' : editing ? 'Update Module' : 'Create Module'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
