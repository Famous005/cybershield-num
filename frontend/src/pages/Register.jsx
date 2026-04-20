import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, User, Hash, Building2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';

const FACULTIES = ['Computing & Information Technology', 'Management and Social Sciences', 'Law', 'Medicine & Health Sciences'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', matricNo: '', faculty: '', department: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const { register, isLoading } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    const { confirmPassword, ...data } = form;
    const res = await register(data);
    if (!res.success) toast.error(res.message);
    else toast.success('Welcome to CyberShield NUM! 🛡️');
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-[#080e0b] flex items-center justify-center p-4 py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-numa-green/5 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-numa-green/15 border border-numa-green/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={26} className="text-numa-green" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Join CyberShield NUM</h1>
          <p className="text-gray-400 text-sm mt-1">Create your student account</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', icon: User, placeholder: 'e.g. Amina Ibrahim' },
              { label: 'University Email', key: 'email', type: 'email', icon: Mail, placeholder: 'you@newgateuniversityminna.edu.ng' },
              { label: 'Matric Number', key: 'matricNo', type: 'text', icon: Hash, placeholder: 'e.g. NUM/CSC/2022/001' },
              { label: 'Department', key: 'department', type: 'text', icon: Building2, placeholder: 'e.g. Computer Science' },
            ].map(({ label, key, type, icon: Icon, placeholder }) => (
              <div key={key}>
                <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type={type} required placeholder={placeholder} value={form[key]} onChange={set(key)} className="input pl-10" />
                </div>
              </div>
            ))}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Faculty</label>
              <select value={form.faculty} onChange={set('faculty')} required className="input">
                <option value="">Select Faculty</option>
                {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPass ? 'text' : 'password'} required minLength={8} placeholder="At least 8 characters"
                  value={form.password} onChange={set('password')} className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPass ? 'text' : 'password'} required placeholder="Re-enter password"
                  value={form.confirmPassword} onChange={set('confirmPassword')} className="input pl-10" />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-5">
            Already registered? <Link to="/login" className="text-numa-green hover:underline font-medium">Log in</Link>
          </p>
        </div>
        <p className="text-center text-xs text-gray-600 mt-4">
          <Link to="/" className="hover:text-gray-400 transition-colors">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
}
