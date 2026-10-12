import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);

  // Inertia Form Hook for Login
  const loginForm = useForm({
    email: 'demo@careerai.id',
    password: 'password123',
  });

  // Inertia Form Hook for Register
  const registerForm = useForm({
    name: '',
    email: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginForm.post('/login', {
      onSuccess: () => {
        onClose();
        router.visit('/dashboard');
      },
    });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    registerForm.post('/register', {
      onSuccess: () => {
        onClose();
        router.visit('/dashboard');
      },
    });
  };

  const handleDemoLogin = () => {
    router.post('/auth/demo', {}, {
      onSuccess: () => {
        onClose();
        router.visit('/dashboard');
      }
    });
  };


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#050816]/80 backdrop-blur-xl"
        />

        {/* Modal Glass Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md z-10 my-auto"
        >
          {/* Animated Shimmer Frame */}
          <div className="relative p-[1px] rounded-3xl bg-gradient-to-b from-teal-500/50 via-indigo-500/30 to-purple-500/40 shadow-2xl shadow-teal-500/20">
            <div className="bg-[#070B1A]/95 backdrop-blur-2xl rounded-[23px] p-6 sm:p-8 relative overflow-hidden">
              
              {/* Top ambient glow blob */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-teal-500/20 to-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all cursor-pointer z-10"
              >
                <X size={18} />
              </button>

              {/* Modal Brand Header */}
              <div className="text-center mb-6 relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 via-indigo-500 to-purple-600 shadow-lg shadow-teal-500/30 mb-3">
                  <Sparkles size={22} className="text-white" />
                </div>

                <h3 className="font-black text-2xl text-slate-100 tracking-tight">
                  {mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun AyoKerja'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {mode === 'login'
                    ? 'Masuk untuk mengakses intelligence dashboard kariermu.'
                    : 'Mulai perjalanan karier impianmu didukung AI.'}
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 mb-6 relative z-10">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-teal-300 border border-teal-500/30 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Masuk (Login)
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'register'
                      ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-teal-300 border border-teal-500/30 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Daftar Akun Baru
                </button>
              </div>

              {/* 1-Click Fast Demo Login for Judges */}
              <div className="mb-5 relative z-10">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-teal-500/10"
                >
                  <Zap size={15} className="text-teal-400" />
                  Instant Demo Login (Akses Juri 1-Click)
                </button>
              </div>

              <div className="relative flex items-center justify-center my-4 z-10">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-[#070B1A] px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                  atau
                </span>
                <div className="border-t border-slate-800 w-full" />
              </div>

              {/* LOGIN FORM */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
                  {loginForm.errors.email && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle size={15} />
                      {loginForm.errors.email}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={loginForm.data.email}
                        onChange={(e) => loginForm.setData('email', e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-teal-400 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Kata Sandi (Password)
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginForm.data.password}
                        onChange={(e) => loginForm.setData('password', e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-teal-400 rounded-xl py-2.5 pl-10 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loginForm.processing}
                    className="shimmer-btn-primary w-full justify-center py-3 text-xs font-bold mt-2 cursor-pointer"
                  >
                    {loginForm.processing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Memproses...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Masuk Sekarang <ArrowRight size={15} />
                      </span>
                    )}
                  </button>
                </form>
              )}

              {/* REGISTER FORM */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 relative z-10">
                  {registerForm.errors.email && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle size={15} />
                      {registerForm.errors.email}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={registerForm.data.name}
                        onChange={(e) => registerForm.setData('name', e.target.value)}
                        placeholder="Contoh: Muhammad Rizki"
                        className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-teal-400 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={registerForm.data.email}
                        onChange={(e) => registerForm.setData('email', e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-teal-400 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Kata Sandi (Minimal 8 Karakter)
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={registerForm.data.password}
                        onChange={(e) => registerForm.setData('password', e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-teal-400 rounded-xl py-2.5 pl-10 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={registerForm.processing}
                    className="shimmer-btn-primary w-full justify-center py-3 text-xs font-bold mt-2 cursor-pointer"
                  >
                    {registerForm.processing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Mendaftarkan...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Daftar Akun Sekarang <ArrowRight size={15} />
                      </span>
                    )}
                  </button>
                </form>
              )}

              {/* Footer guarantee */}
              <div className="mt-6 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck size={14} className="text-teal-400" />
                Dipelopori oleh Sistem Keamanan Terenkripsi SSL 256-bit
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
