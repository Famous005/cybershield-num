import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Trophy, Zap, RotateCcw } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import clsx from 'clsx';
import { showXPGain } from '../components/FloatingXP';

export default function Quiz() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { updateXP } = useStore();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/quizzes/${moduleId}/questions`)
      .then(({ data }) => { setQuestions(data); setLoading(false); })
      .catch(() => { toast.error('Failed to load quiz'); navigate('/modules'); });
  }, [moduleId]);

  const question = questions[current];
  const isLast = current === questions.length - 1;

  const handleSelect = (idx) => {
    if (confirmed) return;
    setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, { questionId: question.id, selectedAnswer: selected }];
    setAnswers(newAnswers);
    if (isLast) {
      handleSubmit(newAnswers);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const handleSubmit = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const { data } = await api.post('/quizzes/submit', { moduleId, answers: finalAnswers });
      setResults(data);
      updateXP(data.newXp, data.newLevel);
      if (data.percentage >= 80) toast.success(`${data.percentage}%! Excellent work! 🏆`);
      else if (data.percentage >= 60) toast.success(`${data.percentage}%! Good job! 🎯`);
      else toast(`${data.percentage}%! Keep practicing! 💪`);

      if (data.xpEarned > 0) showXPGain(data.xpEarned);
    } catch { toast.error('Failed to submit quiz'); }
    setSubmitting(false);
  };

  const getScoreColor = (pct) => {
    if (pct >= 80) return 'text-numa-green';
    if (pct >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      {Array(3).fill(0).map((_, i) => <div key={i} className="shimmer rounded-xl h-20" />)}
    </div>
  );

  if (results) return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        {/* Score card */}
        <div className="card text-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-numa-green/15 border border-numa-green/30 flex items-center justify-center mx-auto mb-4">
            <Trophy size={36} className="text-numa-green" />
          </div>
          <h2 className="font-display font-bold text-2xl text-white mb-1">Quiz Complete!</h2>
          <p className={`font-display font-bold text-5xl my-4 ${getScoreColor(results.percentage)}`}>{results.percentage}%</p>
          <p className="text-gray-400 mb-2">{results.score} out of {results.total} correct</p>
          <div className="inline-flex items-center gap-2 bg-numa-green/10 border border-numa-green/25 rounded-full px-4 py-2">
            <Zap size={14} className="text-numa-green" />
            <span className="text-numa-green text-sm font-semibold">+{results.xpEarned} XP earned</span>
          </div>
        </div>

        {/* Detailed results */}
        <div className="space-y-3 mb-6">
          <h3 className="font-display font-bold text-white">Detailed Results</h3>
          {results.results.map((r, i) => (
            <div key={i} className={`p-4 rounded-xl border ${r.isCorrect ? 'border-numa-green/30 bg-numa-green/5' : 'border-red-500/30 bg-red-500/5'}`}>
              <div className="flex items-start gap-3">
                {r.isCorrect ? <CheckCircle2 size={18} className="text-numa-green mt-0.5 flex-shrink-0" /> : <XCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />}
                <div>
                  <p className="text-white text-sm font-medium mb-2">{r.question}</p>
                  <p className="text-xs text-gray-400 mb-1">Your answer: <span className={r.isCorrect ? 'text-numa-green' : 'text-red-400'}>{r.options[r.selectedAnswer]}</span></p>
                  {!r.isCorrect && <p className="text-xs text-gray-400 mb-1">Correct: <span className="text-numa-green">{r.options[r.correctAnswer]}</span></p>}
                  {r.explanation && <p className="text-xs text-gray-500 mt-2 italic">{r.explanation}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => window.location.reload()} className="btn-outline flex items-center gap-2 flex-1 justify-center">
            <RotateCcw size={16} /> Retake Quiz
          </button>
          <Link to="/modules" className="btn-primary flex items-center gap-2 flex-1 justify-center">
            Continue <ChevronRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );

  if (!question) return null;

  const progress = ((current) / questions.length) * 100;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link to={`/modules/${moduleId}`} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 w-fit transition-colors">
        <ArrowLeft size={16} /> Exit Quiz
      </Link>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Question {current + 1} of {questions.length}</span>
          <span className="text-numa-green font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="xp-bar h-2">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-numa-green to-numa-gold"
            animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          {/* Question */}
          <div className="card mb-6">
            <p className="text-white font-medium text-lg leading-relaxed">{question.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, idx) => {
              let style = 'bg-[#0f1a14] border-[#1a3025] text-gray-300 hover:border-[#2a4035]';
              if (confirmed) {
                if (idx === question.answer) style = 'bg-numa-green/10 border-numa-green text-white';
                else if (idx === selected && idx !== question.answer) style = 'bg-red-500/10 border-red-500 text-white';
                else style = 'bg-[#0f1a14] border-[#1a3025] text-gray-500 opacity-60';
              } else if (selected === idx) {
                style = 'bg-numa-green/10 border-numa-green/60 text-white';
              }

              return (
                <button key={idx} onClick={() => handleSelect(idx)}
                  className={clsx('w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3', style, !confirmed && 'cursor-pointer')}>
                  <span className={clsx('w-7 h-7 rounded-lg text-xs font-bold font-display flex items-center justify-center flex-shrink-0',
                    selected === idx || (confirmed && idx === question.answer) ? 'bg-numa-green text-white' : 'bg-white/5 text-gray-400')}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm">{option}</span>
                  {confirmed && idx === question.answer && <CheckCircle2 size={16} className="text-numa-green ml-auto" />}
                  {confirmed && idx === selected && idx !== question.answer && <XCircle size={16} className="text-red-400 ml-auto" />}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          {!confirmed ? (
            <button onClick={handleConfirm} disabled={selected === null} className="btn-primary w-full">
              Confirm Answer
            </button>
          ) : (
            <button onClick={handleNext} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {submitting ? 'Submitting...' : isLast ? '🏆 See Results' : <>Next Question <ChevronRight size={16} /></>}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
