import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Gamepad2, Trophy, Award,
  User, LogOut, Shield, Menu, X, Zap, ChevronRight
} from 'lucide-react';
import useStore from '../store/useStore';
import { getLevelProgress, getXPForNextLevel } from '../utils/helpers';
import clsx from 'clsx';
import LevelUpModal from './LevelUpModal';
import FloatingXP from './FloatingXP';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/modules', icon: BookOpen, label: 'Learn' },
  { to: '/scenarios', icon: Gamepad2, label: 'Simulations' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/badges', icon: Award, label: 'Badges' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, levelUpData, clearLevelUp } = useStore();
  const navigate = useNavigate();

  const progress = getLevelProgress(user?.xp || 0, user?.level || 1);
  const nextLevelXP = getXPForNextLevel(user?.level || 1);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[#1a3025]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-numa-green/20 flex items-center justify-center border border-numa-green/40">
            <Shield size={20} className="text-numa-green" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-none">CyberShield</p>
            <p className="text-[10px] text-numa-green font-mono tracking-widest uppercase">NUM</p>
          </div>
        </div>
      </div>

      {/* User XP Card */}
      <div className="mx-4 my-4 p-4 bg-[#0a1510] rounded-xl border border-[#1a3025]">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold font-display"
            style={{ backgroundColor: user?.avatarColor || '#006B35' }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name?.split(' ')[0]}</p>
            <p className="text-xs text-gray-400 truncate">{user?.matricNo}</p>
          </div>
          <div className="text-right">
            <p className="text-numa-green text-xs font-mono font-bold">Lvl {user?.level}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><Zap size={10} className="text-numa-gold" />{user?.xp?.toLocaleString()} XP</span>
            <span>{nextLevelXP?.toLocaleString()} XP</span>
          </div>
          <div className="xp-bar">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-numa-green to-numa-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
        {user?.streak > 0 && (
          <p className="text-[10px] text-orange-400 mt-2 flex items-center gap-1">
            🔥 {user.streak}-day streak
          </p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
              isActive
                ? 'bg-numa-green/15 text-numa-green border border-numa-green/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            )}
          >
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

      {/* Logout */}
      <div className="p-4 border-t border-[#1a3025]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#080e0b] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0a1510] border-r border-[#1a3025] flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-[#0a1510] border-r border-[#1a3025] z-50 lg:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0a1510] border-b border-[#1a3025]">
          <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-400 hover:text-white">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-numa-green" />
            <span className="font-display font-bold text-white text-sm">CyberShield NUM</span>
          </div>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: user?.avatarColor || '#006B35' }}
          >
            {initials}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <LevelUpModal level={levelUpData} onClose={clearLevelUp} />
      <FloatingXP />
    </div>
  );
}
