import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../Components/LanguageSwitcher';
import {
  Sparkles, Mail, Lock, Eye, EyeOff,
  ArrowRight, Zap, ShieldCheck,
  Brain, BarChart3, Briefcase, UserCheck, ShieldAlert,
  CheckCircle2, Rocket,
} from 'lucide-react';
import AuthRobotModal from '../Components/AuthRobotModal';
import AnimatedBackground from '../Components/AnimatedBackground';

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const COLORS = ['#2DD4BF', '#4F7CFF', '#8B5CF6', '#22D3EE', '#a78bfa'];
    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: Math.random() * 0.45 + 0.1,
    }));
    const tick = () => {
      const W = canvas.width; const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c; ctx.globalAlpha = p.a;
        ctx.fill(); ctx.globalAlpha = 1;
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x; const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = '#4F7CFF'; ctx.globalAlpha = (1 - d / 120) * 0.1;
            ctx.lineWidth = 0.6; ctx.stroke(); ctx.globalAlpha = 1;
          }
        }
      }
      animId = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
}

function RobotMascot() {
  const [badgeIdx, setBadgeIdx] = useState(0);
  const BADGE_WORDS = [
    'Cocok Kerja',
    'Nyari Kerja',
    'Buat CV AI',
    'Raih Impian',
    'Siap Kerja'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBadgeIdx((prev) => (prev + 1) % BADGE_WORDS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 210 }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: -16, width: 140, height: 32, background: 'radial-gradient(ellipse, rgba(45,212,191,0.5) 0%, transparent 70%)', filter: 'blur(10px)', borderRadius: '50%' }}
      />
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', width: 200, height: 200, border: '1px dashed rgba(79,124,255,0.2)', borderRadius: '50%' }} />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', width: 250, height: 250, border: '1px dashed rgba(139,92,246,0.12)', borderRadius: '50%' }} />
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', width: 200, height: 200 }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, borderRadius: '50%', background: '#4F7CFF', boxShadow: '0 0 10px #4F7CFF' }} />
      </motion.div>
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', width: 250, height: 250 }}>
        <div style={{ position: 'absolute', bottom: 0, right: '10%', width: 7, height: 7, borderRadius: '50%', background: '#8B5CF6', boxShadow: '0 0 10px #8B5CF6' }} />
      </motion.div>
      <div style={{ width: 185, height: 185, position: 'relative', zIndex: 2 }}>
        <img src="/assets/robot/robot-welcome.webp" alt="AyoKerja Robot"
          style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 24px rgba(45,212,191,0.65)) drop-shadow(0 0 10px rgba(79,124,255,0.5))' }} />
      </div>

      {/* Badge Top Left */}
      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.4, type: 'spring' }}
        style={{ position: 'absolute', top: '5%', left: '-2%', background: 'rgba(7,11,26,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(45,212,191,0.3)', borderRadius: 10, padding: '6px 11px', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', zIndex: 3 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2DD4BF', boxShadow: '0 0 7px #2DD4BF', flexShrink: 0 }} />
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 700, color: '#2DD4BF' }}>CV Teranalisis</span>
      </motion.div>

      {/* Badge Bottom Right */}
      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, duration: 0.4, type: 'spring' }}
        style={{ position: 'absolute', bottom: '10%', right: '-2%', background: 'rgba(7,11,26,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(79,124,255,0.3)', borderRadius: 10, padding: '6px 11px', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', zIndex: 3 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4F7CFF', boxShadow: '0 0 7px #4F7CFF', flexShrink: 0 }} />
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 700, color: '#4F7CFF' }}>Skor: 98%</span>
      </motion.div>

      {/* Badge Middle Left (Held by Robot Hand) - Shifted left to -6% with Animated Text */}
      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 0.4, type: 'spring' }}
        style={{ position: 'absolute', top: '48%', left: '-6%', background: 'rgba(7,11,26,0.92)', backdropFilter: 'blur(12px)', border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 4px 16px rgba(139,92,246,0.25)', borderRadius: 10, padding: '6px 11px', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', zIndex: 3 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6', boxShadow: '0 0 8px #8B5CF6', flexShrink: 0 }} />
        <div style={{ height: 16, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={BADGE_WORDS[badgeIdx]}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 700, color: '#A78BFA', display: 'block' }}
            >
              {BADGE_WORDS[badgeIdx]}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LoginForm({ onSwitchToRegister }) {
  const { t } = useTranslation();
  const [showPwd, setShowPwd] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [robotModal, setRobotModal] = useState(null);
  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const { data, setData, post, processing, errors } = useForm({ email: '', password: '', remember: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    setRobotModal('loading');
    setLoginErrorMsg('');

    // Safety watchdog: In case of edge network hang, auto-check after 4.5s
    const safetyTimer = setTimeout(() => {
      if (document.cookie.includes('careerai_session') || document.cookie.includes('XSRF-TOKEN')) {
        window.location.href = '/dashboard';
      }
    }, 4500);

    post('/login', {
      onError: (errs) => {
        clearTimeout(safetyTimer);
        const msg = errs?.email || errs?.password || errs?.general || t('common.error', 'Email atau kata sandi yang Anda masukkan salah.');
        setLoginErrorMsg(msg);
        setRobotModal('error');
      },
      onSuccess: () => {
        clearTimeout(safetyTimer);
        setRobotModal('success');
      },
      onFinish: () => {
        clearTimeout(safetyTimer);
      },
    });
  };

  const handleDemo = () => {
    setDemoLoading(true);
    setRobotModal('loading');
    setLoginErrorMsg('');

    const safetyTimer = setTimeout(() => {
      window.location.href = '/dashboard';
    }, 4000);

    router.post('/auth/demo', {}, {
      onError: () => {
        clearTimeout(safetyTimer);
        setDemoLoading(false);
        setLoginErrorMsg('Gagal masuk ke mode demo. Silakan coba lagi.');
        setRobotModal('error');
      },
      onSuccess: () => {
        clearTimeout(safetyTimer);
        setDemoLoading(false);
        setRobotModal('success');
      },
      onFinish: () => {
        clearTimeout(safetyTimer);
        setDemoLoading(false);
      },
    });
  };

  return (
    <div>
      <AuthRobotModal
        show={robotModal !== null}
        type={robotModal || 'loading'}
        message={robotModal === 'error' ? (loginErrorMsg || errors.email || errors.password || errors.general) : ''}
        onClose={() => setRobotModal(null)}
      />

      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.1, type: 'spring' }}
          style={{ width: 44, height: 44, borderRadius: 14, margin: '0 auto 10px', background: 'linear-gradient(135deg,#14B8A6 0%,#4F7CFF 50%,#8B5CF6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(45,212,191,.4)' }}>
          <UserCheck size={20} color="#fff" />
        </motion.div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 19, fontWeight: 800, color: '#F1F5F9', marginBottom: 2, letterSpacing: '-0.3px' }}>{t('auth.login.title', 'Masuk ke AyoKerja')}</h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#64748B' }}>{t('auth.login.subtitle', 'Lanjutkan perjalanan karier AI-mu')}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.07)' }} />
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('auth.login.email', 'Alamat Email')}</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.07)' }} />
      </div>

      <AnimatePresence>
        {(errors.email || errors.password || errors.general) && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ padding: '9px 12px', borderRadius: 10, marginBottom: 12, background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.4)', color: '#FCA5A5', fontSize: 12, fontFamily: "'Inter',sans-serif", display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <ShieldAlert size={16} style={{ flexShrink: 0, color: '#EF4444', marginTop: 1 }} />
            <div><strong style={{ display: 'block', color: '#F87171', fontWeight: 700, marginBottom: 1 }}>{t('common.error', 'Gagal Masuk')}:</strong>{errors.email || errors.password || errors.general}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 11 }}>
          <label style={{ display: 'block', fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 700, color: '#64748B', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('auth.login.email', 'Alamat Email')}</label>
          <div style={{ position: 'relative' }}>
            <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
            <input id="login-email" type="email" required autoComplete="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="nama@email.com" className="auth-input" />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 700, color: '#64748B', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('auth.login.password', 'Kata Sandi')}</label>
          <div style={{ position: 'relative' }}>
            <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
            <input id="login-password" type={showPwd ? 'text' : 'password'} required autoComplete="current-password" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="••••••••" className="auth-input pr-12" />
            <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', padding: 0 }}>
              {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <button id="login-submit" type="submit" disabled={processing} className="btn-main-login">
          {processing ? <><span className="spin-ico" /> <span>{t('ai.thinking', 'Memeriksa...')}</span></> : <><span>{t('auth.login.loginBtn', 'Masuk')}</span> <ArrowRight size={15} /></>}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 14 }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#475569' }}>{t('auth.login.noAccount', 'Belum punya akun?')} </span>
        <button onClick={onSwitchToRegister} style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, color: '#2DD4BF', background: 'none', border: 'none', cursor: 'pointer', padding: 0, borderBottom: '1px solid rgba(45,212,191,.3)', paddingBottom: 1 }}>{t('auth.login.registerLink', 'Daftar Gratis')} &rarr;</button>
      </div>

      <div style={{ marginTop: 12, padding: '7px 11px', borderRadius: 9, background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', gap: 7 }}>
        <ShieldCheck size={13} style={{ color: '#2DD4BF', flexShrink: 0 }} />
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: '#475569' }}>{t('landing.cta.f2', 'Data terenkripsi')} &amp; SSL Protected.</span>
      </div>
    </div>
  );
}

function RegisterPreview({ onSwitchToLogin, onStartRegister }) {
  const BENEFITS = [
    { Icon: Brain,     color: '79,124,255',  label: 'Cek CV kamu, dapat saran langsung dari AI' },
    { Icon: BarChart3, color: '45,212,191',  label: 'Tahu seberapa bagus CV kamu secara instan' },
    { Icon: Briefcase, color: '139,92,246',  label: 'Cocokkan profil ke 10.000+ lowongan kerja' },
  ];

  const handleStartRegisterClick = (e) => {
    e.preventDefault();
    if (onStartRegister) {
      onStartRegister();
    } else {
      router.visit('/register');
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.1, type: 'spring' }}
          style={{ width: 44, height: 44, borderRadius: 14, margin: '0 auto 10px', background: 'linear-gradient(135deg,#8B5CF6 0%,#4F7CFF 50%,#14B8A6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(139,92,246,.4)' }}>
          <Sparkles size={20} color="#fff" />
        </motion.div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 19, fontWeight: 800, color: '#F1F5F9', marginBottom: 2, letterSpacing: '-0.3px' }}>Buat Akun Baru</h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#64748B' }}>Gratis selamanya &middot; Tidak butuh kartu kredit</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        {BENEFITS.map(({ Icon, color, label }, i) => (
          <motion.div key={label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 11px', borderRadius: 10, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: `rgba(${color},.15)`, border: `1px solid rgba(${color},.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={13} style={{ color: `rgb(${color})` }} />
            </div>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 500, color: '#CBD5E1' }}>{label}</span>
            <CheckCircle2 size={13} style={{ color: '#2DD4BF', marginLeft: 'auto', flexShrink: 0 }} />
          </motion.div>
        ))}
      </div>

      <div onClick={handleStartRegisterClick} style={{ display: 'block', textDecoration: 'none', cursor: 'pointer' }}>
        <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
          style={{ width: '100%', padding: '12px 20px', borderRadius: 11, background: 'linear-gradient(135deg,#8B5CF6 0%,#4F7CFF 50%,#14B8A6 100%)', color: '#fff', fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 0 24px rgba(139,92,246,.35)' }}>
          <span>Mulai Daftar Sekarang</span>
          <ArrowRight size={15} />
        </motion.div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(45,212,191,.07)', border: '1px solid rgba(45,212,191,.2)', borderRadius: 9, padding: '7px 11px' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#2DD4BF', boxShadow: '0 0 8px #2DD4BF', animation: 'loginPulse 2s ease-in-out infinite', flexShrink: 0 }} />
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 500, color: '#94A3B8' }}>
          <span style={{ color: '#2DD4BF', fontWeight: 700 }}>12.400+</span> Pengguna Aktif &amp; Terkoneksi
        </span>
      </div>

      <div style={{ textAlign: 'center', marginTop: 14 }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#475569' }}>Sudah punya akun? </span>
        <button onClick={onSwitchToLogin} style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, color: '#8B5CF6', background: 'none', border: 'none', cursor: 'pointer', padding: 0, borderBottom: '1px solid rgba(139,92,246,.3)', paddingBottom: 1 }}>&larr; Masuk Sekarang</button>
      </div>
    </div>
  );
}

export default function Login() {
  const [activePanel, setActivePanel] = useState('login');
  const [globalModal, setGlobalModal] = useState(null);

  const handleStartRegister = () => {
    setGlobalModal('loading');
    setTimeout(() => {
      router.visit('/register');
    }, 850);
  };

  const FEATURES = [
    { Icon: Brain,     color: '79,124,255',  label: 'Cek dan perbaiki CV kamu dengan bantuan AI' },
    { Icon: BarChart3, color: '45,212,191',  label: 'Tahu nilai CV kamu & apa yang harus ditingkatkan' },
    { Icon: Briefcase, color: '139,92,246',  label: 'Temukan lowongan yang sesuai profilmu' },
  ];
  const panelVariants = {
    enter: (dir) => ({ x: dir === 'register' ? 60 : -60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
    exit: (dir) => ({ x: dir === 'register' ? -60 : 60, opacity: 0, scale: 0.97, transition: { duration: 0.3, ease: 'easeIn' } }),
  };
  return (
    <>
      <Head title="Masuk Akun — AyoKerja" />
      <AuthRobotModal
        show={globalModal !== null}
        type={globalModal || 'loading'}
        title="Menyiapkan Halaman Pendaftaran..."
        message="Mohon tunggu sejenak, sedang mengaktifkan engine AI untuk kamu..."
        onClose={() => setGlobalModal(null)}
      />
      <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 100 }}>
          <LanguageSwitcher compact={true} />
        </div>
        <AnimatedBackground />
        <div className="login-wrap" style={{ position: 'relative', zIndex: 10, display: 'flex', width: '100%', maxWidth: 900, margin: '0 auto', padding: '24px 20px', gap: 32, minHeight: '100vh', alignItems: 'center' }}>
          <div className="login-left" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textContent: 'center' }}>
            <div style={{ maxWidth: 380, width: '100%' }}>
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src="/assets/ayokerja-logo.png" alt="AyoKerja Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(2.2)' }} />
                </div>
                <div>
                  <div className="logo-shimmer" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px' }}>AyoKerja</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 8.5, fontWeight: 700, color: '#2DD4BF', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Platform Karier Berbasis AI</div>
                </div>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
                style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 25, fontWeight: 900, lineHeight: 1.25, letterSpacing: '-0.8px', color: '#F1F5F9', marginBottom: 8 }}>
                Karier Lebih Cerah,<br /><span className="logo-shimmer">Dibantu oleh AI.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: '#64748B', lineHeight: 1.6, marginBottom: 16 }}>
                Masuk dan mulai tingkatkan peluang kerjamu — cek CV, dan temukan lowongan yang tepat untuk kamu.
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginBottom: 16, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <RobotMascot />
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxWidth: 380, width: '100%' }}>
              {FEATURES.map(({ Icon, color, label }, i) => (
                <motion.div key={label} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 11px', borderRadius: 9, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: `rgba(${color},.15)`, border: `1px solid rgba(${color},.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={12} style={{ color: `rgb(${color})` }} />
                  </div>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11.5, fontWeight: 500, color: '#CBD5E1' }}>{label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="login-right" style={{ width: 350, flexShrink: 0 }}>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ display: 'flex', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: 3, marginBottom: 10, backdropFilter: 'blur(12px)' }}>
              {[{ key: 'login', label: 'Masuk', Icon: UserCheck }, { key: 'register', label: 'Daftar', Icon: Sparkles }].map(({ key, label, Icon }) => (
                <button key={key} onClick={() => setActivePanel(key)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'all 0.25s ease',
                    ...(activePanel === key ? { background: key === 'login' ? 'linear-gradient(135deg,#14B8A6,#4F7CFF)' : 'linear-gradient(135deg,#8B5CF6,#4F7CFF)', color: '#fff', boxShadow: key === 'login' ? '0 4px 16px rgba(45,212,191,.35)' : '0 4px 16px rgba(139,92,246,.35)' } : { background: 'transparent', color: '#64748B' }) }}>
                  <Icon size={13} />{label}
                </button>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <div style={{ background: activePanel === 'login' ? 'linear-gradient(135deg,rgba(45,212,191,.3),rgba(79,124,255,.24),rgba(139,92,246,.28))' : 'linear-gradient(135deg,rgba(139,92,246,.32),rgba(79,124,255,.26),rgba(45,212,191,.22))', borderRadius: 22, padding: 1, boxShadow: '0 24px 70px rgba(0,0,0,.55)', transition: 'all 0.4s ease' }}>
                <div className="login-card-inner" style={{ background: 'rgba(6,9,22,.95)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', borderRadius: 21, padding: '20px 20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: activePanel === 'login' ? 'linear-gradient(90deg, transparent, rgba(45,212,191,.4), transparent)' : 'linear-gradient(90deg, transparent, rgba(139,92,246,.4), transparent)' }} />
                  <AnimatePresence mode="wait" custom={activePanel}>
                    <motion.div key={activePanel} custom={activePanel} variants={panelVariants} initial="enter" animate="center" exit="exit">
                      {activePanel === 'login'
                        ? <LoginForm onSwitchToRegister={() => setActivePanel('register')} />
                        : <RegisterPreview onSwitchToLogin={() => setActivePanel('login')} onStartRegister={handleStartRegister} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <Link href="/" style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#334155', textDecoration: 'none' }}>&larr; Kembali ke Beranda</Link>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 860px) {
            .login-wrap {
              flex-direction: column !important;
              padding: 16px 12px !important;
              gap: 20px !important;
              min-height: auto !important;
            }
            .login-left {
              width: 100% !important;
              order: 2 !important;
            }
            .login-right {
              width: 100% !important;
              max-width: 400px !important;
              order: 1 !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
