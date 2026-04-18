import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X } from 'lucide-react';

export default function LevelUpModal({ level, onClose }) {
  if (!level) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 260 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: '#0f1a14',
            border: '1px solid rgba(0,107,53,0.5)',
            borderRadius: 24,
            padding: '48px 40px',
            textAlign: 'center',
            maxWidth: 360,
            width: '100%',
            boxShadow: '0 0 60px rgba(0,107,53,0.25)',
          }}
        >
          {/* Rings */}
          <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 24px' }}>
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.5, 1.4, 1], opacity: [0, 0.6, 0] }}
                transition={{ delay: i * 0.15, duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
                style={{
                  position: 'absolute', inset: 0,
                  borderRadius: '50%',
                  border: '2px solid #006B35',
                }}
              />
            ))}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,107,53,0.15)',
              borderRadius: '50%',
              border: '2px solid #006B35',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={36} color="#006B35" />
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ color: '#006B35', fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 10 }}
          >
            Level Up!
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ color: '#fff', fontSize: 48, fontWeight: 800, lineHeight: 1, marginBottom: 8 }}
          >
            {level}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ color: '#9ca3af', fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}
          >
            You have reached <strong style={{ color: '#fff' }}>Level {level}</strong>.<br />
            Keep learning to unlock more rewards!
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={onClose}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: '#006B35', color: '#fff', border: 'none',
              borderRadius: 12, padding: '12px 32px',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%',
            }}
          >
            Keep Going 🚀
          </motion.button>

          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'none', border: 'none', color: '#6b7280',
              cursor: 'pointer', padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}