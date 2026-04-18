import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Gamepad2, Trophy, ChevronRight, AlertTriangle, Zap, Users } from 'lucide-react';

const stats = [
  { value: '49.7%', label: 'Students with only moderate cyber knowledge', icon: '📊' },
  { value: '83.2%', label: 'Believe awareness tools will improve behaviour', icon: '✅' },
  { value: '18.1%', label: 'Students have low or no awareness', icon: '⚠️' },
  { value: '4', label: 'Real NUM incidents powering our simulations', icon: '🔒' },
];

const incidents = [
  { icon: '📱', title: 'Fake Admissions Scam', desc: 'A NUM student defrauded via WhatsApp & Instagram by someone impersonating an admissions officer.', color: 'border-red-500/30 bg-red-500/5' },
  { icon: '🎣', title: 'Phishing Account Breach', desc: 'Students had their portals compromised after clicking phishing links sent to their emails.', color: 'border-yellow-500/30 bg-yellow-500/5' },
  { icon: '💻', title: 'Exam Portal DDoS', desc: 'The NUM exam portal went down during active examinations due to a deliberate attack.', color: 'border-blue-500/30 bg-blue-500/5' },
  { icon: '🔒', title: 'Ransomware Attack', desc: 'The university\'s data was encrypted by hackers who then demanded a ransom payment.', color: 'border-purple-500/30 bg-purple-500/5' },
];

const features = [
  { icon: BookOpen, title: '5 Learning Modules', desc: 'Phishing, passwords, social engineering, malware & safe browsing — all with interactive content.', color: 'text-numa-green' },
  { icon: Gamepad2, title: 'Real-Life Simulations', desc: 'Four branching scenarios based on actual NUM incidents. Choose wisely and learn.', color: 'text-blue-400' },
  { icon: Zap, title: 'XP & Level System', desc: 'Earn experience points, level up, unlock badges and track your progress.', color: 'text-yellow-400' },
  { icon: Trophy, title: 'Public Leaderboard', desc: 'Compete with fellow students and earn recognition as a top cyber guardian.', color: 'text-orange-400' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#080e0b]">
      {/* Nav */}
      <nav className="border-b border-[#1a3025] sticky top-0 z-50 bg-[#080e0b]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-numa-green/20 border border-numa-green/40 flex items-center justify-center">
              <Shield size={18} className="text-numa-green" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-sm">CyberShield</span>
              <span className="text-numa-green font-mono text-[10px] tracking-widest uppercase ml-1.5">NUM</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-gray-400 hover:text-white text-sm font-medium px-4 py-2 transition-colors hidden sm:block">Login</Link>
            <Link to="/register" className="bg-numa-green hover:bg-numa-green-light text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-numa-green/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-numa-gold/4 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(#006B35 1px, transparent 1px), linear-gradient(90deg, #006B35 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        <div className="max-w-6xl mx-auto px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-numa-green/10 border border-numa-green/25 rounded-full px-4 py-2 mb-8">
              <AlertTriangle size={14} className="text-numa-gold" />
              <span className="text-sm text-gray-300">Built on real cybersecurity incidents at NUM</span>
            </div>
            <h1 className="font-display font-extrabold text-5xl md:text-7xl text-white leading-[1.05] mb-6">
              Your Digital Shield<br /><span className="text-numa-green">Starts Here.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              The official cybersecurity awareness platform for Newgate University Minna. Learn through interactive modules, real-life simulations, and earn recognition for staying safe online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-base py-4 px-8">
                Start Learning Free <ChevronRight size={18} />
              </Link>
              <Link to="/login" className="btn-outline flex items-center justify-center gap-2 text-base py-4 px-8">
                I Already Have an Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#1a3025] bg-[#0a1510]">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="font-display font-bold text-3xl text-numa-green mb-1">{s.value}</div>
              <div className="text-gray-400 text-sm leading-snug">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Incidents */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mb-3">Real Incidents. Real Learning.</h2>
          <p className="text-gray-400 max-w-xl mx-auto">These cybersecurity incidents actually happened at or near NUM. Our simulations are based on them so you can learn to respond correctly.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incidents.map((inc, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className={`p-5 rounded-xl border ${inc.color} flex gap-4`}>
              <div className="text-3xl flex-shrink-0">{inc.icon}</div>
              <div>
                <h3 className="font-display font-bold text-white mb-1">{inc.title}</h3>
                <p className="text-gray-400 text-sm">{inc.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#0a1510] border-y border-[#1a3025]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mb-3">Everything You Need to Stay Safe</h2>
            <p className="text-gray-400">Survey data shows NUM students prefer interactive, visual, and simulation-based learning. We built exactly that.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="card-hover group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={22} className={color} />
                </div>
                <h3 className="font-display font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="bg-gradient-to-br from-[#0a1510] to-[#0f1f17] border border-numa-green/30 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-numa-green/5 to-transparent pointer-events-none" />
          <Shield size={48} className="text-numa-green mx-auto mb-6 opacity-80" />
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mb-4">
            Join NUM Students<br />Building Cyber Awareness
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Over 83% of surveyed NUM students believe a platform like this will improve their cybersecurity behaviour. Be part of the change.
          </p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base py-4 px-8">
            Create Your Free Account <ChevronRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a3025] py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield size={16} className="text-numa-green" />
          <span className="font-display font-bold text-white text-sm">CyberShield NUM</span>
        </div>
        <p className="text-gray-500 text-xs">© {new Date().getFullYear()} Newgate University Minna. All rights reserved.</p>
        <p className="text-gray-600 text-xs mt-1">Km 8, Off Bida-Minna Road, Niger State, Minna</p>
      </footer>
    </div>
  );
}
