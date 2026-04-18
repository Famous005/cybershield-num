import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Save } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { getDifficultyColor } from '../../utils/helpers';

const emptyScenario = {
  title: '', description: '', incident: '', thumbnail: '🎭',
  difficulty: 'Medium', xpReward: 150, published: true,
  steps: JSON.stringify([{ id: 1, text: '', choices: [{ text: '', points: 100, feedback: '' }, { text: '', points: 50, feedback: '' }, { text: '', points: 0, feedback: '' }] }])
};

export default function AdminScenarios() {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyScenario);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/scenarios').then(({ data }) => { setScenarios(data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyScenario); setModal(true); };
  const openEdit = (s) => {
    setEditing(s);
    setForm({ title: s.title, description: s.description, incident: s.incident, thumbnail: s.thumbnail, difficulty: s.difficulty, xpReward: s.xpReward, published: s.published, steps: typeof s.steps === 'string' ? s.steps : JSON.stringify(s.steps) });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description) return toast.error('Title and description required');
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/scenarios/${editing.id}`, form);
        toast.success('Scenario updated');
      } else {
        await api.post('/scenarios', form);
        toast.success('Scenario created');
      }
      setModal(false);
      load();
    } catch { toast.error('Failed to save scenario'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this scenario?')) return;
    try { await api.delete(`/scenarios/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const handleToggle = async (s) => {
    try {
      await api.put(`/scenarios/${s.id}`, { published: !s.published });
      toast.success(s.published ? 'Unpublished' : 'Published');
      load();
    } catch { toast.error('Failed'); }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Scenario Simulations</h1>
          <p className="text-gray-400 text-sm mt-1">Manage real-life cybersecurity scenarios</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Scenario
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array(4).fill(0).map((_, i) => <div key={i} className="shimmer h-24 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {scenarios.map((s) => (
            <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-4 p-4 bg-[#0f1a14] border border-[#1a3025] rounded-xl hover:border-[#2a4035] transition-all">
              <div className="text-3xl flex-shrink-0">{s.thumbnail}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-white">{s.title}</h3>
                  <span className={`badge-pill text-xs ${getDifficultyColor(s.difficulty)}`}>{s.difficulty}</span>
                  <span className={`badge-pill text-xs ${s.published ? 'bg-numa-green/15 text-numa-green' : 'bg-gray-500/15 text-gray-400'}`}>
                    {s.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-gray-500 text-xs truncate mt-0.5">{s.description}</p>
                <p className="text-gray-600 text-xs mt-0.5">{s.attemptCount} attempts • {s.xpReward} XP</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleToggle(s)} className="p-2 text-gray-400 hover:text-numa-green hover:bg-numa-green/10 rounded-lg transition-all">
                  {s.published ? <ToggleRight size={18} className="text-numa-green" /> : <ToggleLeft size={18} />}
                </button>
                <button onClick={() => openEdit(s)} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={15} /></button>
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
              <h2 className="font-display font-bold text-xl text-white">{editing ? 'Edit Scenario' : 'New Scenario'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Title', key: 'title', placeholder: 'e.g. The Fake Admissions Officer' },
                { label: 'Description', key: 'description', placeholder: 'Brief scenario description' },
                { label: 'Based on Real Incident', key: 'incident', placeholder: 'What real incident inspired this?' },
                { label: 'Thumbnail Emoji', key: 'thumbnail', placeholder: '🎭' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
                  <input value={form[key]} onChange={set(key)} className="input" placeholder={placeholder} />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Difficulty</label>
                  <select value={form.difficulty} onChange={set('difficulty')} className="input">
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">XP Reward</label>
                  <input type="number" value={form.xpReward} onChange={set('xpReward')} className="input" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Steps (JSON)</label>
                <textarea value={form.steps} onChange={set('steps')} rows={8}
                  className="input font-mono text-xs resize-none"
                  placeholder='[{"id":1,"text":"Scenario text...","choices":[{"text":"Choice...","points":100,"feedback":"Feedback..."}]}]' />
                <p className="text-gray-600 text-xs mt-1">JSON array of steps with text and choices (points: 0-100)</p>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="pub2" checked={form.published}
                  onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 accent-[#006B35]" />
                <label htmlFor="pub2" className="text-sm text-gray-300">Published (visible to students)</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Save size={15} /> {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
