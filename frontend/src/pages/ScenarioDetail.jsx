import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Zap, Trophy, RotateCcw, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import { getDifficultyColor } from '../utils/helpers';
import clsx from 'clsx';
import { showXPGain } from '../components/FloatingXP';

export default function ScenarioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateXP } = useStore();

  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/scenarios/${id}`)
      .then(({ data }) => { setScenario(data); setLoading(false); })
      .catch(() => { toast.error('Scenario not found'); navigate('/scenarios'); });
  }, [id]);

  const steps = scenario?.steps || [];
  const step = steps[currentStep];
  const maxScore = steps.reduce((acc, s) => acc + Math.max(...s.choices.map(c => c.points)), 0);

  const handleConfirm = () => {
    if (selectedChoice === null) return;
    const choice = step.choices[selectedChoice];
    setTotalScore(s => s + choice.points);
    setChoices(c => [...c, { stepId: step.id, choiceIndex: selectedChoice, points: choice.points }]);
    setConfirmed(true);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
      setSelectedChoice(null);
      setConfirmed(false);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setSubmitting(true);
    const finalScore = totalScore + (confirmed ? 0 : 0);
    try {
      const { data } = await api.post('/scenarios/submit', {
        scenarioId: id,
        choices,
        score: finalScore,
        maxScore,
      });
      updateXP(data.newXp, data.newLevel);
      toast.success(`+${data.xpEarned} XP earned! 🎭`);
      if (data.xpEarned > 0) showXPGain(data.xpEarned);
    } catch { toast.error('Failed to save progress'); }
    setFinished(true);
    setSubmitting(false);
  };

  const restart = () => {
    setCurrentStep(0);
    setChoices([]);
    setSelectedChoice(null);
    setConfirmed(false);
    setTotalScore(0);
    setFinished(false);
  };

  const pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const getScoreLabel = (p) => {
    if (p >= 85) return { label: 'Outstanding Response!', color: 'text-numa-green', emoji: '🏆' };
    if (p >= 60) return { label: 'Good Decisions!', color: 'text-yellow-400', emoji: '✅' };
    return { label: 'Keep Practicing!', color: 'text-orange-400', emoji: '💪' };
  };

  if (loading) return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      {Array(3).fill(0).map((_, i) => <div key={i} className="shimmer rounded-xl h-24" />)}
    </div>
  );

  if (!scenario) return null;

  // Finished screen
  if (finished) {
    const { label, color, emoji } = getScoreLabel(pct);
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="card text-center mb-6">
            <div className="text-6xl mb-4">{emoji}</div>
            <h2 className="font-display font-bold text-2xl text-white mb-1">Scenario Complete!</h2>
            <p className={`font-display font-bold text-4xl my-3 ${color}`}>{pct}%</p>
            <p className={`font-semibold mb-1 ${color}`}>{label}</p>
            <p className="text-gray-400 text-sm mb-4">{totalScore} out of {maxScore} points</p>
            <div className="inline-flex items-center gap-2 bg-numa-green/10 border border-numa-green/25 rounded-full px-4 py-2">
              <Zap size={14} className="text-numa-green" />
              <span className="text-numa-green text-sm font-semibold">XP earned based on your score</span>
            </div>
          </div>

          {/* Step recap */}
          <div className="space-y-3 mb-6">
            <h3 className="font-display font-bold text-white">Your Choices Recap</h3>
            {steps.map((s, i) => {
              const choiceData = choices[i];
              const chosen = choiceData ? s.choices[choiceData.choiceIndex] : null;
              const maxPts = Math.max(...s.choices.map(c => c.points));
              const isGood = choiceData?.points === maxPts;
              return (
                <div key={i} className={`p-4 rounded-xl border ${isGood ? 'border-numa-green/30 bg-numa-green/5' : 'border-orange-500/30 bg-orange-500/5'}`}>
                  <p className="text-gray-400 text-xs mb-2">Step {i + 1}</p>
                  <p className="text-white text-sm font-medium mb-2">{chosen?.text}</p>
                  <p className="text-xs text-gray-400 italic">{chosen?.feedback}</p>
                  <p className={`text-xs mt-1 font-semibold ${isGood ? 'text-numa-green' : 'text-orange-400'}`}>
                    {choiceData?.points}/{maxPts} points
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={restart} className="btn-outline flex-1 flex items-center justify-center gap-2">
              <RotateCcw size={15} /> Try Again
            </button>
            <Link to="/scenarios" className="btn-primary flex-1 flex items-center justify-center gap-2">
              More Scenarios <ChevronRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const progress = ((currentStep) / steps.length) * 100;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link to="/scenarios" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 w-fit transition-colors">
        <ArrowLeft size={16} /> Back to Simulations
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="text-4xl">{scenario.thumbnail}</div>
        <div className="flex-1">
          <h1 className="font-display font-bold text-xl text-white">{scenario.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={`badge-pill text-xs ${getDifficultyColor(scenario.difficulty)}`}>{scenario.difficulty}</span>
            <span className="flex items-center gap-1 text-xs text-gray-400"><Zap size={10} className="text-numa-gold" />{scenario.xpReward} XP</span>
          </div>
        </div>
      </div>

      {/* Real incident badge */}
      <div className="flex items-start gap-2 p-3 bg-orange-500/8 border border-orange-500/20 rounded-xl mb-6">
        <span className="text-base flex-shrink-0">⚠️</span>
        <p className="text-sm text-gray-300"><span className="font-semibold text-orange-400">Based on real incident:</span> {scenario.incident}</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span className="text-numa-green font-medium">{totalScore} pts</span>
        </div>
        <div className="xp-bar h-2">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-numa-green"
            animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          {/* Scenario text */}
          <div className="card mb-5">
            <p className="text-gray-200 text-sm leading-relaxed">{step?.text}</p>
          </div>

          {/* Choices */}
          <div className="space-y-3 mb-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">What do you do?</p>
            {step?.choices.map((choice, idx) => {
              let style = 'bg-[#0f1a14] border-[#1a3025] text-gray-300 hover:border-[#2a4035] cursor-pointer';
              if (confirmed) {
                const maxPts = Math.max(...step.choices.map(c => c.points));
                if (choice.points === maxPts) style = 'bg-numa-green/10 border-numa-green text-white';
                else if (idx === selectedChoice) style = 'bg-orange-500/10 border-orange-500 text-white';
                else style = 'bg-[#0f1a14] border-[#1a3025] text-gray-500 opacity-50';
              } else if (selectedChoice === idx) {
                style = 'bg-blue-500/10 border-blue-500/60 text-white cursor-pointer';
              }

              return (
                <button key={idx} onClick={() => !confirmed && setSelectedChoice(idx)}
                  className={clsx('w-full text-left p-4 rounded-xl border transition-all', style)}>
                  <div className="flex items-start gap-3">
                    <span className={clsx('w-7 h-7 rounded-lg text-xs font-bold font-display flex items-center justify-center flex-shrink-0 mt-0.5',
                      selectedChoice === idx ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400')}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm leading-relaxed">{choice.text}</span>
                  </div>

                  {confirmed && idx === selectedChoice && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-3 ml-10 text-xs text-gray-300 italic border-l-2 border-numa-green/40 pl-3">
                      {choice.feedback}
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          {!confirmed ? (
            <button onClick={handleConfirm} disabled={selectedChoice === null} className="btn-primary w-full">
              Make This Decision
            </button>
          ) : (
            <button onClick={handleNext} disabled={submitting}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {submitting ? 'Saving...' : currentStep < steps.length - 1
                ? <><ChevronRight size={16} /> Next Step</>
                : <><Trophy size={16} /> See My Results</>}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
