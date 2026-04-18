import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BookOpen, Users, Gamepad2, HelpCircle, Shield, LogOut, Menu, ChevronRight } from 'lucide-react';
import useStore from '../../store/useStore';
import clsx from 'clsx';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/modules', icon: BookOpen, label: 'Modules' },
  { to: '/admin/quizzes', icon: HelpCircle, label: 'Quiz Questions' },
  { to: '/admin/scenarios', icon: Gamepad2, label: 'Scenarios' },
  { to: '/admin/users', icon: Users, label: 'Students' },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { logout, user } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-[#1a3025]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-numa-green/20 border border-numa-green/40 flex items-center justify-center">
            <Shield size={20} className="text-numa-green" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm">CyberShield</p>
            <p className="text-[10px] text-red-400 font-mono tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>
      </div>

      <div className="mx-4 my-4 p-3 bg-red-500/8 border border-red-500/20 rounded-xl">
        <p className="text-xs font-semibold text-red-400">Administrator</p>
        <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
        <p className="text-gray-500 text-xs truncate">{user?.email}</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
              isActive ? 'bg-numa-green/15 text-numa-green border border-numa-green/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
            )}>
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-numa-green' : 'text-gray-500 group-hover:text-gray-300'} />
                <span>{label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-numa-green" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1a3025] space-y-2">
        <NavLink to="/dashboard" className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <Shield size={16} /> Student View
        </NavLink>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#080e0b] overflow-hidden">
      <aside className="hidden lg:flex w-64 bg-[#0a1510] border-r border-[#1a3025] flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-[#0a1510] border-r border-[#1a3025] z-50 flex flex-col">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0a1510] border-b border-[#1a3025]">
          <button onClick={() => setOpen(true)} className="p-2 text-gray-400 hover:text-white"><Menu size={20} /></button>
          <span className="font-display font-bold text-white text-sm">Admin Panel</span>
          <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <Shield size={14} className="text-red-400" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
