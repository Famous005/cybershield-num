import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, CheckCircle2, BookOpen, ChevronRight, Lightbulb } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';

export default function ModuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateXP, user } = useStore();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    api.get(`/modules/${id}`).then(({ data }) => { setModule(data); setLoading(false); }).catch(() => { setLoading(false); navigate('/modules'); });
  }, [id]);

  const content = module?.content ? JSON.parse(module.content) : null;
  const sections = content?.sections || [];
  const keyPoints = content?.keyPoints || [];

  const handleComplete = async () => {
    if (module?.completed) return navigate(`/quiz/${id}`);
    setCompleting(true);
    try {
      const { data } = await api.post(`/modules/${id}/complete`);
      if (data.xpEarned > 0) {
        toast.success(`+${data.xpEarned} XP earned! Module completed! 🎉`);
        updateXP(data.newXp, data.newLevel);
        setModule(m => ({ ...m, completed: true }));
      }
      setTimeout(() => navigate(`/quiz/${id}`), 800);
    } catch { toast.error('Failed to complete module'); }
    setCompleting(false);
  };

  if (loading) return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      {Array(3).fill(0).map((_, i) => <div key={i} className="shimmer rounded-xl h-24" />)}
    </div>
  );

  if (!module) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/modules" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 w-fit transition-colors">
        <ArrowLeft size={16} /> Back to Modules
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl mb-6 border" style={{ backgroundColor: module.color + '08', borderColor: module.color + '30' }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-white mb-2">{module.title}</h1>
            <p className="text-gray-400 text-sm leading-relaxed">{module.description}</p>
          </div>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: module.color + '15', border: `1px solid ${module.color}35` }}>
            {module.completed ? '✅' : '📖'}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <span className="flex items-center gap-1 text-sm" style={{ color: module.color }}>
            <Zap size={14} />{module.xpReward} XP reward
          </span>
          {module.completed && (
            <span className="flex items-center gap-1 text-sm text-numa-green">
              <CheckCircle2 size={14} />Completed
            </span>
          )}
        </div>
      </motion.div>

      {/* Key Points */}
      {keyPoints.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="card mb-6">
          <h3 className="font-display font-bold text-white mb-3 flex items-center gap-2">
            <BookOpen size={16} className="text-numa-green" /> Key Takeaways
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {keyPoints.map((kp, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 size={14} className="text-numa-green flex-shrink-0" />
                {kp}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Sections */}
      <div className="space-y-4 mb-8">
        {sections.map((section, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
            <button onClick={() => setActiveSection(activeSection === i ? -1 : i)}
              className={`w-full text-left p-5 rounded-xl border transition-all ${activeSection === i ? 'bg-[#132018] border-numa-green/40' : 'bg-[#0f1a14] border-[#1a3025] hover:border-[#2a4035]'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-numa-green/15 text-numa-green text-xs font-bold font-display flex items-center justify-center">
                    {i + 1}
                  </span>
                  <h3 className="font-display font-bold text-white">{section.title}</h3>
                </div>
                <ChevronRight size={16} className={`text-gray-500 transition-transform ${activeSection === i ? 'rotate-90' : ''}`} />
              </div>

              {activeSection === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-3">
                  <p className="text-gray-300 text-sm leading-relaxed">{section.body}</p>
                  {section.tip && (
                    <div className="flex items-start gap-2 p-3 bg-numa-green/8 border border-numa-green/20 rounded-lg">
                      <Lightbulb size={14} className="text-numa-green mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-300">{section.tip}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="card text-center">
        <h3 className="font-display font-bold text-white mb-2">
          {module.completed ? 'Ready to retake the quiz?' : 'Ready to test your knowledge?'}
        </h3>
        <p className="text-gray-400 text-sm mb-5">
          {module.completed ? 'Practice again to sharpen your skills.' : `Complete this module and take the quiz to earn ${module.xpReward} XP.`}
        </p>
        <button onClick={handleComplete} disabled={completing} className="btn-primary">
          {completing ? 'Saving progress...' : module.completed ? '📝 Retake Quiz' : '✅ Complete & Take Quiz'}
        </button>
      </motion.div>
    </div>
  );
}
