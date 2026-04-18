import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

let listeners = [];
export const showXPGain = (amount) => {
  listeners.forEach(fn => fn(amount));
};

export default function FloatingXP() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const handler = (amount) => {
      const id = Date.now();
      setItems(prev => [...prev, { id, amount }]);
      setTimeout(() => {
        setItems(prev => prev.filter(i => i.id !== id));
      }, 2000);
    };
    listeners.push(handler);
    return () => { listeners = listeners.filter(l => l !== handler); };
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 80, right: 24, zIndex: 100, pointerEvents: 'none' }}>
      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -60, scale: 1 }}
            exit={{ opacity: 0, y: -90, scale: 0.9 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(0,107,53,0.9)',
              color: '#fff', borderRadius: 999,
              padding: '8px 16px', fontSize: 14, fontWeight: 700,
              border: '1px solid rgba(0,107,53,0.6)',
              marginBottom: 8,
              boxShadow: '0 4px 20px rgba(0,107,53,0.4)',
            }}
          >
            ⚡ +{item.amount} XP
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}