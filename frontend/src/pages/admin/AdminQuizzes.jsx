import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, ChevronDown } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const emptyQ = { question: '', options: ['', '', '', ''], answer: 0, explanation: '' };

export default function AdminQuizzes() {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyQ);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/modules').then(({ data }) => {
      setModules(data);
      if (data.length > 0) setSelectedModule(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedModule) return;
    setLoading(true);
    api.get(`/quizzes/${selectedModule}/admin`)
      .then(({ data }) => { setQuestions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedModule]);

  const openCreate = () => { setEditing(null); setForm({ ...emptyQ, options: ['', '', '', ''] }); setModal(true); };
  const openEdit = (q) => { setEditing(q); setForm({ question: q.question, options: [...q.options], answer: q.answer, explanation: q.explanation || '' }); setModal(true); };

  const handleSave = async () => {
    if (!form.question.trim()) return toast.error('Question is required');
    if (form.options.some(o => !o.trim())) return toast.error('All 4 options are required');
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/quizzes/question/${editing.id}`, form);
        toast.success('Question updated');
      } else {
        await api.post('/quizzes/question', { ...form, moduleId: selectedModule });
        toast.success('Question created');
      }
      setModal(false);
      const { data } = await api.get(`/quizzes/${selectedModule}/admin`);
      setQuestions(data);
    } catch { toast.error('Failed to save question'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.delete(`/quizzes/question/${id}`);
      toast.success('Question deleted');
      setQuestions(q => q.filter(x => x.id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  const setOption = (idx, val) => setForm(f => { const opts = [...f.options]; opts[idx] = val; return { ...f, options: opts }; });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Quiz Questions</h1>
          <p className="text-gray-400 text-sm mt-1">Manage questions per module</p>
        </div>
        <button onClick={openCreate} disabled={!selectedModule} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Question
        </button>
      </div>

      {/* Module selector */}
      <div className="relative mb-6 w-full max-w-sm">
        <select value={selectedModule} onChange={e => setSelectedModule(e.target.value)} className="input appearance-none pr-10">
          {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>

      {loading ? (
        <div className="space-y-3">{Array(5).fill(0).map((_, i) => <div key={i} className="shimmer h-24 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {questions.length === 0 && <p className="text-gray-500 text-center py-8">No questions yet. Click "Add Question" to create one.</p>}
          {questions.map((q, i) => (
            <motion.div key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-4 bg-[#0f1a14] border border-[#1a3025] rounded-xl hover:border-[#2a4035] transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-2">
                    <span className="text-gray-500 mr-2">Q{i + 1}.</span>{q.question}
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {q.options.map((opt, idx) => (
                      <span key={idx} className={`text-xs px-2 py-1 rounded ${idx === q.answer ? 'bg-numa-green/15 text-numa-green' : 'text-gray-500'}`}>
                        {String.fromCharCode(65 + idx)}. {opt}
                      </span>
                    ))}
                  </div>
                  {q.explanation && <p className="text-gray-500 text-xs mt-2 italic">{q.explanation}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(q)} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(q.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                </div>
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
              <h2 className="font-display font-bold text-xl text-white">{editing ? 'Edit Question' : 'New Question'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Question</label>
                <textarea value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                  rows={3} className="input resize-none" placeholder="Enter the question..." />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Answer Options (select the correct one)</label>
                <div className="space-y-2">
                  {form.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <button type="button" onClick={() => setForm(f => ({ ...f, answer: idx }))}
                        className={`w-7 h-7 rounded-lg text-xs font-bold flex-shrink-0 transition-all ${form.answer === idx ? 'bg-numa-green text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                        {String.fromCharCode(65 + idx)}
                      </button>
                      <input value={opt} onChange={e => setOption(idx, e.target.value)}
                        className="input flex-1" placeholder={`Option ${String.fromCharCode(65 + idx)}`} />
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-2">Click A/B/C/D to set the correct answer (highlighted in green)</p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Explanation (optional)</label>
                <textarea value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
                  rows={2} className="input resize-none" placeholder="Explain why this is the correct answer..." />
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
