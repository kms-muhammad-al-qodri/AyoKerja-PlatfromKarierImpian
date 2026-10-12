import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import { Sparkles, ShieldCheck, RefreshCw, ArrowRight, Lock, Zap, Rocket, Bot, ExternalLink } from 'lucide-react';

/**
 * RobotImageWithFallback — Direct 3D Mascot loader with official AyoKerja assets
 */
function RobotImageWithFallback({ src, fallbackSrc, alt, type = 'loading' }) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const handleError = () => {
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else if (currentSrc !== '/assets/robot/robot-loading.webp') {
      setCurrentSrc('/assets/robot/robot-loading.webp');
    }
  };

  const isSuccess = type === 'success';
  const isError = type === 'error';
  const glowDrop = isError
    ? 'drop-shadow-[0_0_24px_rgba(244,63,94,0.5)]'
    : isSuccess
    ? 'drop-shadow-[0_0_24px_rgba(52,211,153,0.5)]'
    : 'drop-shadow-[0_0_24px_rgba(45,212,191,0.55)]';

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none">
      {/* Ambient Radial Mascot Glow */}
      <div
        className={`absolute inset-0 bg-radial ${
          isError ? 'from-rose-500/25' : isSuccess ? 'from-emerald-500/25' : 'from-teal-500/25'
        } via-transparent to-transparent blur-xl pointer-events-none`}
      />
      <motion.img
        key={currentSrc}
        src={currentSrc}
        alt={alt}
        loading="eager"
        decoding="sync"
        onError={handleError}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        className={`w-[115%] h-[115%] object-contain object-center relative z-10 ${glowDrop}`}
      />
    </div>
  );
}

/**
 * AuthRobotModal — Fullscreen centered popup modal overlay with Watchdog Auto-Recovery
 */
export default function AuthRobotModal({
  show = false,
  type = 'loading',
  title = '',
  message = '',
  onClose,
  onSuccessRedirect,
}) {
  const [progress, setProgress] = useState(25);
  const [stepIndex, setStepIndex] = useState(0);
  const [secondsWaiting, setSecondsWaiting] = useState(0);

  const STEPS = [
    { Icon: Lock, title: 'Memverifikasi Keamanan', sub: 'Otentikasi data dan enkripsi sesi akun...' },
    { Icon: Zap, title: 'Menghubungkan AI Engine', sub: 'Memuat profil dan neural matcher...' },
    { Icon: Rocket, title: 'Membuka Platform', sub: 'Menyiapkan Dashboard AyoKerja...' },
  ];

  // Super fast & responsive progress counter animation (Completes in ~850ms)
  useEffect(() => {
    if (show && type === 'loading') {
      setProgress(35);
      setStepIndex(0);
      setSecondsWaiting(0);

      const t1 = setTimeout(() => {
        setProgress(72);
        setStepIndex(1);
      }, 250);

      const t2 = setTimeout(() => {
        setProgress(95);
        setStepIndex(2);
      }, 550);

      const t3 = setTimeout(() => {
        setProgress(100);
      }, 850);

      // Watchdog counter to monitor long requests and offer auto-recovery
      const watchdogInterval = setInterval(() => {
        setSecondsWaiting((prev) => prev + 1);
      }, 1000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearInterval(watchdogInterval);
      };
    }
  }, [show, type]);

  // Fail-safe watchdog: If stuck in loading for > 5 seconds, automatically open dashboard
  useEffect(() => {
    if (show && type === 'loading' && secondsWaiting >= 6) {
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
    }
  }, [show, type, secondsWaiting]);

  // Auto-redirect for success state
  useEffect(() => {
    if (show && type === 'success') {
      setProgress(100);
      const timer = setTimeout(() => {
        if (onSuccessRedirect) {
          onSuccessRedirect();
        } else {
          window.location.href = '/dashboard';
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [show, type, onSuccessRedirect]);

  if (!show || typeof window === 'undefined') return null;

  const CONFIG = {
    loading: {
      image: '/assets/robot/robot-loading.webp',
      fallbackImage: '/assets/robot/robot-loading.webp',
      accentColor: 'text-teal-400',
      borderColor: 'border-teal-500/40',
      bgGlow: 'from-teal-500/20 via-slate-950/95 to-slate-950',
      barGradient: 'from-indigo-500 to-teal-400',
      badgeBg: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
      dotBg: 'bg-teal-400 shadow-[0_0_10px_#2dd4bf]',
      defaultTitle: 'Sedang Memproses AI...',
      defaultMessage: 'Mohon tunggu sejenak, sistem sedang menyiapkannya.',
    },
    success: {
      image: '/assets/robot/robot-berhasil.webp',
      fallbackImage: '/assets/robot/robot-berhasil.webp',
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgGlow: 'from-emerald-500/20 via-slate-950/95 to-slate-950',
      barGradient: 'from-emerald-500 to-teal-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      dotBg: 'bg-emerald-400 shadow-[0_0_10px_#34d399]',
      defaultTitle: 'Berhasil Masuk!',
      defaultMessage: 'Selamat datang kembali! Mengalihkan ke dashboard...',
    },
    error: {
      image: '/assets/robot/robot-eror.webp',
      fallbackImage: '/assets/robot/robot-eror.webp',
      accentColor: 'text-rose-400',
      borderColor: 'border-rose-500/40',
      bgGlow: 'from-rose-500/20 via-slate-950/95 to-slate-950',
      barGradient: 'from-rose-500 to-red-600',
      badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      dotBg: 'bg-rose-400 shadow-[0_0_10px_#f87171]',
      defaultTitle: 'Gagal Masuk',
      defaultMessage: 'Email atau kata sandi yang Anda masukkan tidak cocok dengan data kami.',
    },
  };

  const c = CONFIG[type] || CONFIG.loading;
  const currentStep = STEPS[stepIndex] || STEPS[0];
  const StepIcon = currentStep.Icon;

  const handleForceRedirect = () => {
    window.location.href = '/dashboard';
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-2xl">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-teal-500/15 rounded-full blur-[100px] pointer-events-none z-0" />

        {/* Modal Glass Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`relative z-10 w-full max-w-md bg-gradient-to-b ${c.bgGlow} border ${c.borderColor} rounded-[32px] p-7 sm:p-9 flex flex-col items-center text-center overflow-hidden shadow-2xl backdrop-blur-3xl`}
        >
          {/* Top Shimmer Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent" />

          {/* Top Status Header Bar */}
          <div className="absolute top-4 left-5 right-5 flex items-center justify-between z-20">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-[11px] font-medium text-slate-400">
              <ShieldCheck className={`w-3.5 h-3.5 ${c.accentColor}`} />
              <span>AyoKerja Guard</span>
            </div>

            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${c.badgeBg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${c.dotBg}`} />
              <span>{type === 'loading' ? 'Processing' : type === 'success' ? 'Connected' : 'Error'}</span>
            </div>
          </div>

          {/* Hologram Mascot Showcase Box */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className={`relative z-10 w-44 h-44 rounded-3xl mt-5 mb-5 border ${c.borderColor} bg-slate-900/90 shadow-2xl flex items-center justify-center overflow-hidden`}
          >
            {/* Outer Rotating Sci-Fi Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: type === 'loading' ? 3.5 : 10, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-2 rounded-[32px] border-2 border-transparent border-t-teal-400 border-r-slate-700/40 pointer-events-none"
            />

            {/* Inner Counter-Rotating Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-4 rounded-[40px] border border-dashed border-slate-700/50 pointer-events-none"
            />

            {/* Laser scanning beam for loading state */}
            {type === 'loading' && (
              <motion.div
                animate={{ top: ['-5%', '105%', '-5%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_12px_#2dd4bf] z-30 pointer-events-none"
              />
            )}

            {/* Robot Image with Guaranteed Inline SVG Mascot */}
            <RobotImageWithFallback
              src={c.image}
              fallbackSrc={c.fallbackImage}
              alt={`Robot Mascot ${type}`}
              type={type}
            />
          </motion.div>

          {/* Title */}
          <h3 className="relative z-10 font-sans text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight mb-1.5 leading-tight">
            {title || c.defaultTitle}
          </h3>

          {/* Message Subtitle */}
          <p className="relative z-10 font-sans text-xs sm:text-sm text-slate-400 leading-relaxed mb-5 max-w-xs">
            {message || c.defaultMessage}
          </p>

          {/* Dynamic Progress & Step Dashboard for Loading State */}
          {type === 'loading' && (
            <div className="relative z-10 w-full flex flex-col gap-2.5 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-left">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-200">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                    <RefreshCw className={`w-3.5 h-3.5 ${c.accentColor}`} />
                  </motion.div>
                  <span>{currentStep.title}</span>
                </div>

                <span className={`font-mono text-xs font-bold ${c.accentColor}`}>
                  {progress}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden relative">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${c.barGradient} shadow-[0_0_10px_#2dd4bf]`}
                />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <StepIcon className="w-3 h-3 text-slate-500" />
                <span>{currentStep.sub}</span>
              </div>

              {/* Watchdog Emergency Action: Appears if request takes > 3.5 seconds */}
              {secondsWaiting >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 pt-2 border-t border-slate-800/80 flex flex-col gap-2"
                >
                  <p className="text-[11px] text-amber-400/90 leading-tight">
                    Sistem sudah siap. Jika proses memuat terasa lama, silakan langsung buka dashboard:
                  </p>
                  <button
                    type="button"
                    onClick={handleForceRedirect}
                    className="w-full py-2 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-teal-500/20 cursor-pointer"
                  >
                    <span>Buka Dashboard Langsung</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* Animated Progress Bar for Success State */}
          {type === 'success' && (
            <div className="relative z-10 w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_#34d399]"
              />
            </div>
          )}

          {/* Action Button for Error State */}
          {type === 'error' && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="relative z-10 w-full py-3 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30"
            >
              <span>Coba Lagi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
