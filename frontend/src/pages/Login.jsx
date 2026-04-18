import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (!res.success) toast.error(res.message);
  };

  return (
    <div className="min-h-screen bg-[#080e0b] flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-numa-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-numa-gold/3 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-numa-green/15 border border-numa-green/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={26} className="text-numa-green" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-1">Log in to CyberShield NUM</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" required placeholder="you@student.newgateuniversityminna.edu.ng"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPass ? 'text' : 'password'} required placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-5">
            New to CyberShield? <Link to="/register" className="text-numa-green hover:underline font-medium">Create account</Link>
          </p>
        </div>
        <p className="text-center text-xs text-gray-600 mt-4">
          <Link to="/" className="hover:text-gray-400 transition-colors">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
}
