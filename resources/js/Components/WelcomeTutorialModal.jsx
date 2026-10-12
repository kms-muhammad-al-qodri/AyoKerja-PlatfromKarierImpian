import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ShieldCheck, ArrowRight, ArrowLeft,
  FileText, Briefcase, Bot, Rocket, BookOpen, Check, Zap, CheckCircle2, Layers, Eye, Target, X
} from 'lucide-react';

/**
 * Robot Image Renderer with clean, controlled dimensions to prevent overflow
 */
function StepRobotMascot({ src, alt, glowColor = 'teal', size = 'md' }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setIsLoaded(false);
  }, [src]);

  const glowStyles = {
    teal: 'from-teal-500/30 via-cyan-500/20 to-indigo-500/30 shadow-[0_0_30px_rgba(45,212,191,0.3)]',
    indigo: 'from-indigo-500/30 via-purple-500/20 to-teal-500/30 shadow-[0_0_30px_rgba(99,102,241,0.3)]',
    emerald: 'from-emerald-500/30 via-teal-500/20 to-cyan-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]',
  };

  const sizeClasses = {
    sm: 'w-16 h-16 sm:w-20 sm:h-20',
    md: 'w-20 h-20 sm:w-28 sm:h-28',
    lg: 'w-24 h-24 sm:w-32 sm:h-32',
  };

  return (
    <div className={`relative ${sizeClasses[size] || sizeClasses.md} flex items-center justify-center mx-auto my-1 flex-shrink-0 overflow-hidden`}>
      {/* Background Rotating Aura Glow */}
      <motion.div
        animate={{ rotate: 360, scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className={`absolute inset-1 rounded-2xl bg-gradient-to-tr ${glowStyles[glowColor] || glowStyles.teal} border border-teal-400/30 opacity-80 filter blur-[1px] pointer-events-none`}
      />

      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <motion.div
            animate={{ rotate: 360, scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-6 h-6 text-teal-400" />
          </motion.div>
        </div>
      )}

      {/* Mascot Image - Strictly contained */}
      <motion.img
        key={src}
        src={imgSrc}
        alt={alt}
        loading="eager"
        decoding="sync"
        onLoad={() => setIsLoaded(true)}
        onError={() => setImgSrc('/assets/robot/robot-welcome.webp')}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: isLoaded ? 1 : 0, y: [0, -4, 0] }}
        transition={{
          y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 0.25 },
          opacity: { duration: 0.25 }
        }}
        className="w-full h-full object-contain object-center relative z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
}

export default function WelcomeTutorialModal({ isOpen, onClose, userName }) {
  const [step, setStep] = useState(1);
  const [activeFeature, setActiveFeature] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [isLiveTour, setIsLiveTour] = useState(false);
  const [targetRect, setTargetRect] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setActiveFeature(0);
      setAgreed(false);
      setIsLiveTour(false);
    }
  }, [isOpen]);

  const FEATURES = [
    {
      id: 'cv-analysis',
      targetId: 'tour-tab-analysis',
      badge: 'Analisis CV ATS',
      shortName: 'Analisis CV',
      title: '1. Evaluasi & Skor ATS CV Pintar',
      Icon: FileText,
      color: 'text-teal-400',
      glow: 'shadow-[0_0_25px_rgba(45,212,191,0.35)] border-teal-400/60',
      accentBg: 'bg-teal-500/15 border-teal-500/40',
      desc: 'Unggah berkas CV (PDF/DOCX) untuk dianalisis AI. Sistem menghitung skor ATS 0–100, mendeteksi gap kata kunci HRD, dan memberikan rekomendasi perbaikan konkret.',
      steps: ['Unggah berkas PDF/DOCX CV kamu', 'AI menganalisis struktur & skor ATS', 'Terapkan rekomendasi kata kunci HRD'],
      previewText: '✓ Skor ATS 92% • Kata kunci PHP, Laravel, React terverifikasi',
      tourTip: 'Lokasi menu Analisis CV di sidebar utama. Klik di sini untuk menguji skor ATS CV kamu!',
    },
    {
      id: 'job-matching',
      badge: 'Lowongan Kerja',
      targetId: 'tour-tab-jobs',
      shortName: 'Lowongan',
      title: '2. Smart Job Matcher Real-Time',
      Icon: Briefcase,
      color: 'text-indigo-400',
      glow: 'shadow-[0_0_25px_rgba(99,102,241,0.35)] border-indigo-400/60',
      accentBg: 'bg-indigo-500/15 border-indigo-500/40',
      desc: 'Sistem mencocokkan profil keahlianmu ke 10.000+ loker terupdate dengan kalkulasi Match Percentage real-time dari API Adzuna & Jooble.',
      steps: ['AI membaca profil & keahlianmu', 'Kalkulasi persentase kecocokan loker', 'Lamar pekerjaan resmi secara instan'],
      previewText: '✓ 12 Lowongan Cocok (Akurasi 98%) • Lamaran Instan',
      tourTip: 'Lokasi menu Lowongan Kerja di sidebar. Temukan 10.000+ loker nyata real-time!',
    },
    {
      id: 'career-roadmap',
      badge: 'Career Roadmap',
      targetId: 'tour-tab-roadmap',
      shortName: 'Roadmap',
      title: '3. AI Career Roadmap Personalisasi',
      Icon: Rocket,
      color: 'text-purple-400',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.35)] border-purple-400/60',
      accentBg: 'bg-purple-500/15 border-purple-500/40',
      desc: 'AI membuatkan peta jalan karir yang dipersonalisasi khusus untukmu — dari skill gap, sertifikasi yang direkomendasikan, hingga target waktu pencapaian.',
      steps: ['AI menganalisis profil & target rolemu', 'Generate roadmap skill yang harus dikuasai', 'Pantau progress & update sesuai perkembangan'],
      previewText: '✓ Roadmap Software Engineer 6 bulan • 8 milestone teridentifikasi',
      tourTip: 'Lokasi menu Career Roadmap di sidebar. Lihat jalur karirmu step-by-step!',
    },
    {
      id: 'cv-builder',
      badge: 'ATS CV Builder',
      targetId: 'tour-tab-cv-builder',
      shortName: 'CV Builder',
      title: '4. Harvard ATS CV Builder',
      Icon: Layers,
      color: 'text-cyan-400',
      glow: 'shadow-[0_0_25px_rgba(34,211,238,0.35)] border-cyan-400/60',
      accentBg: 'bg-cyan-500/15 border-cyan-500/40',
      desc: 'Buat CV profesional berstandar Harvard ATS yang terbukti lolos sistem seleksi perusahaan Fortune 500 & Enterprise. Ekspor ke PDF langsung dari browser.',
      steps: ['Isi data profil, pengalaman & pendidikan', 'AI menyusun CV format Harvard ATS', 'Export PDF siap kirim ke HRD'],
      previewText: '✓ Format Harvard ATS • Lolos 95% sistem seleksi perusahaan Fortune 500',
      tourTip: 'Lokasi menu ATS CV Builder di sidebar. Buat CV profesional dalam menit!',
    },
    {
      id: 'cover-letter',
      badge: 'Surat Lamaran AI',
      targetId: 'tour-tab-cover-letter',
      shortName: 'Cover Letter',
      title: '5. AI Cover Letter Pro Generator',
      Icon: FileText,
      color: 'text-pink-400',
      glow: 'shadow-[0_0_25px_rgba(244,114,182,0.35)] border-pink-400/60',
      accentBg: 'bg-pink-500/15 border-pink-500/40',
      desc: 'Generate surat lamaran kerja formal berstandar HRD dalam hitungan detik. Mendukung 35+ bahasa & negara dengan adaptasi pembuka, isi STAR, dan tanda tangan digital.',
      steps: ['Input nama posisi & perusahaan target', 'AI menulis surat lamaran persuasif STAR', 'Terjemahkan ke 35+ bahasa & download PDF'],
      previewText: '✓ Surat Lamaran 35+ Bahasa • Format STAR Method • TTD Digital',
      tourTip: 'Lokasi menu Surat Lamaran AI di sidebar. Buat surat lamaran dalam detik!',
    },
    {
      id: 'ai-assistant',
      targetId: 'tour-ai-chat',
      badge: 'Career AI Chat',
      shortName: 'Career AI',
      title: '6. Asisten Chat Karir 24/7',
      Icon: Bot,
      color: 'text-emerald-400',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.35)] border-emerald-400/60',
      accentBg: 'bg-emerald-500/15 border-emerald-500/40',
      desc: 'Tanyakan apa saja soal karir — simulasi interview teknis, negosiasi gaji, pembuatan roadmap skill, tips CV, hingga analisis posisi impian dengan bot AI interaktif.',
      steps: ['Buka widget chat di pojok kanan bawah', 'Tanyakan pertanyaan karir atau simulasi interview', 'Dapatkan saran konkret, solutif & personal'],
      previewText: '✓ Bot AI Aktif 24/7 • Simulasi Interview • Tips Negosiasi Gaji',
      tourTip: 'Tombol Chat Assistant di pojok kanan bawah. Siap konsultasi karir kapan saja!',
    },
  ];

  const currentFeature = FEATURES[activeFeature];

  // Calculate bounding rect of active element for live spotlight target ring
  useEffect(() => {
    if (isLiveTour && step === 2) {
      const updateRect = () => {
        const targetId = FEATURES[activeFeature]?.targetId;
        if (targetId) {
          const el = document.getElementById(targetId);
          if (el) {
            const rect = el.getBoundingClientRect();
            // Ensure element is actually visible on screen and not zero-sized/hidden
            const isVisible =
              rect.width > 0 &&
              rect.height > 0 &&
              (rect.top >= 0 || rect.bottom >= 0) &&
              (rect.left >= 0 || rect.right >= 0);

            if (isVisible) {
              setTargetRect({
                top: rect.top - 6,
                left: rect.left - 6,
                width: rect.width + 12,
                height: rect.height + 12,
              });
              return;
            }
          }
        }
        setTargetRect(null);
      };

      updateRect();
      window.addEventListener('resize', updateRect);
      window.addEventListener('scroll', updateRect);
      return () => {
        window.removeEventListener('resize', updateRect);
        window.removeEventListener('scroll', updateRect);
      };
    } else {
      setTargetRect(null);
    }
  }, [isLiveTour, activeFeature, step]);

  if (!isOpen || typeof window === 'undefined') return null;

  const handleDismissModal = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('careerai_welcome_agreed', 'true');
      sessionStorage.setItem('careerai_welcome_agreed', 'true');
      sessionStorage.removeItem('careerai_just_registered');
    }
    if (onClose) onClose();
  };

  const handleAgreeAndFinish = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('careerai_welcome_agreed', 'true');
      sessionStorage.setItem('careerai_welcome_agreed', 'true');
      sessionStorage.removeItem('careerai_just_registered');
    }
    if (onClose) onClose();
  };

  const STEP_INFO = [
    { num: 1, title: 'Selamat Datang', robotImg: '/assets/robot/robot-welcome.webp', robotGlow: 'teal' },
    { num: 2, title: 'Prosedur Fitur', robotImg: '/assets/robot/robot-tahap-2.png', robotGlow: 'indigo' },
    { num: 3, title: 'Aktivasi Dashboard', robotImg: '/assets/robot/robot-tahap-3.png', robotGlow: 'emerald' },
  ];

  // ════════════════════════════════════════════════════════════════
  // LIVE SPOTLIGHT PRODUCT TOUR OVERLAY (ON-SCREEN FEATURE HIGHLIGHT)
  // ════════════════════════════════════════════════════════════════
  if (isLiveTour && step === 2) {
    const liveTourContent = (
      <AnimatePresence>
        <div className="fixed inset-0 z-[999999] pointer-events-auto">
          {/* Dimmed Background Overlay */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-all duration-300" />

          {/* Pulsing Neon Target Box Highlight around element */}
          {targetRect && targetRect.width > 20 && targetRect.height > 20 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              style={{
                position: 'fixed',
                top: `${targetRect.top}px`,
                left: `${targetRect.left}px`,
                width: `${targetRect.width}px`,
                height: `${targetRect.height}px`,
              }}
              className="z-[9999991] rounded-2xl border-2 border-teal-400 shadow-[0_0_35px_#2dd4bf,inset_0_0_15px_rgba(45,212,191,0.3)] pointer-events-none animate-pulse flex items-center justify-center"
            >
              {/* Corner Beam Accents */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-300" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-300" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-300" />
              <div className="px-2 py-0.5 rounded-full bg-teal-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-md">
                {currentFeature.shortName}
              </div>
            </motion.div>
          )}

          {/* Floating Robot Tour Guide Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed z-[9999992] bottom-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:max-w-lg bg-slate-900/98 border border-teal-400/50 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-2xl backdrop-blur-3xl text-slate-100 flex flex-col gap-2 sm:gap-3"
          >
            {/* Top Bar inside Floating Card */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-teal-400 animate-pulse" />
                <span className="text-xs font-black text-teal-300 uppercase tracking-wider">
                  Spotlight Tour Interaktif ({activeFeature + 1} / {FEATURES.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLiveTour(false)}
                className="text-[10px] font-bold text-slate-400 hover:text-white px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
              >
                Kembali ke Modal
              </button>
            </div>

            {/* Content Row with Robot Mascot */}
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0">
                <StepRobotMascot
                  src="/assets/robot/robot-tahap-2.png"
                  alt="Robot Mascot Spotlight"
                  glowColor="indigo"
                  size="sm"
                />
              </div>

              <div className="space-y-1 text-left flex-1 min-w-0">
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-100 flex items-center gap-2">
                  <span>{currentFeature.title}</span>
                </h4>
                <p className="text-[10px] sm:text-[11px] text-teal-300 font-semibold leading-snug">
                  👉 {currentFeature.tourTip}
                </p>
                <p className="text-[9.5px] sm:text-[10.5px] text-slate-400 leading-relaxed line-clamp-2">
                  {currentFeature.desc}
                </p>
              </div>
            </div>

            {/* Navigation Bar inside Floating Card */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1">
                {FEATURES.map((f, idx) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFeature(idx)}
                    title={f.shortName}
                    className={`transition-all cursor-pointer rounded-full ${
                      idx === activeFeature
                        ? 'w-4 h-2 bg-teal-400 shadow-[0_0_8px_#2dd4bf]'
                        : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {activeFeature > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveFeature(prev => prev - 1)}
                    className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Prev
                  </button>
                )}

                {activeFeature < FEATURES.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveFeature(prev => prev + 1)}
                    className="py-1.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 transition-all cursor-pointer flex items-center gap-1 shadow-md"
                  >
                    <span>Fitur Berikutnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLiveTour(false);
                      setStep(3);
                    }}
                    className="py-1.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all cursor-pointer flex items-center gap-1 shadow-md"
                  >
                    <span>Selesai & Ke Tahap 3</span>
                    <Rocket className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );

    return ReactDOM.createPortal(liveTourContent, document.body);
  }

  // ════════════════════════════════════════════════════════════════
  // STANDARD STEP MODAL
  // ════════════════════════════════════════════════════════════════
  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-2xl">
        {/* Ambient Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-teal-500/15 rounded-full blur-[90px] pointer-events-none z-0" />

        {/* Modal Main Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md bg-slate-900/98 border border-teal-500/40 rounded-[22px] sm:rounded-[28px] p-3 sm:p-6 flex flex-col gap-0 shadow-2xl backdrop-blur-3xl text-slate-100 my-auto max-h-[88vh] overflow-y-auto scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-teal-500/40"
        >
          {/* Top Shimmer Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-indigo-500 to-emerald-400 animate-[shimmer_2s_infinite]" />

          {/* Header Bar with Step Indicator Pills */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-xs text-slate-100 tracking-tight">Panduan Aplikasi AyoKerja</h4>
                <p className="text-[10px] text-slate-400">Halo, {userName || 'Pengguna'}!</p>
              </div>
            </div>

            {/* Step Progress Bullets & Close Button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                {STEP_INFO.map((s) => (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => setStep(s.num)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                      s.num === step
                        ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md shadow-teal-500/30'
                        : s.num < step
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500 border border-slate-700/50'
                    }`}
                  >
                    {s.num < step ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <span>Step {s.num}</span>
                    )}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleDismissModal}
                title="Tutup Panduan"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* TAHAP 1: WELCOME & ROBOT 1 MASCOT (robot-welcome.webp) */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="flex flex-col items-center text-center gap-2 sm:gap-3 mt-1">
              {/* Robot Mascot - smaller on mobile */}
              <StepRobotMascot
                src="/assets/robot/robot-welcome.webp"
                alt="Robot Mascot Step 1 Welcome"
                glowColor="teal"
                size="md"
              />

              <div className="space-y-0.5 sm:space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[10px] font-bold uppercase tracking-wider">
                  Tahap 1 • Selamat Datang
                </span>
                <h3 className="font-extrabold text-base sm:text-xl text-slate-100 tracking-tight">
                  Selamat Datang di AyoKerja!
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Platform AI lengkap untuk evaluasi CV, pencarian kerja, CV Builder, Roadmap Karir & konsultasi AI 24/7.
                </p>
              </div>

              {/* Feature Cards Grid — 3 columns compact for mobile */}
              <div className="w-full grid grid-cols-3 gap-1 sm:grid-cols-2 sm:gap-1.5 text-left">
                {FEATURES.map((f) => {
                  const FIcon = f.Icon;
                  return (
                    <div key={f.id} className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <div className={`p-1 rounded-md ${f.accentBg} flex-shrink-0`}>
                          <FIcon className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${f.color}`} />
                        </div>
                        <span className="text-[9px] sm:text-[10.5px] font-bold text-slate-100 leading-tight line-clamp-1">{f.shortName}</span>
                      </div>
                      <span className={`text-[8px] font-semibold px-1 py-0.5 rounded-md self-start ${f.accentBg} ${f.color}`}>
                        ✓ Aktif
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="w-full">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-2 sm:py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                >
                  <span>Lanjut ke Tahap 2: Prosedur Fitur</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* TAHAP 2: PROSEDUR FITUR & ROBOT TAHAP STEP 2 (robot-tahap-2.png) */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="space-y-2 my-1 text-left">
              {/* Step 2 Header — robot inline on mobile to save space */}
              <div className="flex items-center gap-2 sm:flex-col sm:text-center">
                <div className="w-12 h-12 sm:w-auto sm:h-auto sm:mx-auto flex-shrink-0">
                  <StepRobotMascot
                    src="/assets/robot/robot-tahap-2.png"
                    alt="Robot Mascot Step 2 Prosedur"
                    glowColor="indigo"
                    size="sm"
                  />
                </div>
                <div className="sm:text-center">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[9px] font-bold uppercase tracking-wider">
                    Tahap 2 • Prosedur Fitur Utama
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-100 mt-0.5">
                    Panduan Prosedur Fitur App
                  </h3>
                </div>
              </div>

              {/* Button to Trigger On-Screen Live Spotlight Tour */}
              <button
                type="button"
                onClick={() => setIsLiveTour(true)}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-teal-500/20 via-indigo-500/20 to-purple-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold hover:border-teal-400 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-teal-500/10"
              >
                <Eye className="w-4 h-4 text-teal-400 animate-pulse" />
                <span>Nunjukkan Fitur Langsung di Layar (Live Tour)</span>
              </button>

              {/* Explicit Feature Sub-Tabs Selector - 3 col grid for 6 features */}
              <div className="grid grid-cols-3 gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                {FEATURES.map((f, idx) => {
                  const FIcon = f.Icon;
                  const isActive = activeFeature === idx;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveFeature(idx)}
                      className={`py-1.5 px-1 rounded-lg text-[9.5px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer min-w-0 ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      <FIcon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate w-full text-center leading-tight">{f.shortName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Feature Tutorial Box */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature.id}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                  className={`relative p-3.5 rounded-2xl border ${currentFeature.glow} bg-slate-900/90 overflow-hidden transition-all duration-300 space-y-2.5`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`p-2 rounded-xl border ${currentFeature.accentBg} flex-shrink-0 mt-0.5`}>
                      <currentFeature.Icon className={`w-4 h-4 ${currentFeature.color}`} />
                    </div>

                    <div className="space-y-0.5">
                      <h5 className="font-extrabold text-xs text-slate-100">{currentFeature.title}</h5>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{currentFeature.desc}</p>
                    </div>
                  </div>

                  {/* Step-by-Step Procedure Checklist */}
                  <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[10.5px]">
                    <div className="font-bold text-teal-400 uppercase tracking-wider text-[9px] mb-1 flex items-center gap-1">
                      <Layers className="w-3 h-3" /> Prosedur Langkah:
                    </div>
                    {currentFeature.steps.map((st, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-300">
                        <span className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-300 font-bold text-[9px] flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>

                  {/* Simulation Badge */}
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] font-semibold text-teal-300 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                    <span className="truncate">{currentFeature.previewText}</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-2 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-teal-500/20 whitespace-nowrap"
                >
                  <span>Lanjut ke Tahap 3</span>
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* TAHAP 3: PERSETUJUAN & ROBOT TAHAP 3 MASCOT (robot-tahap-3.png) */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="space-y-3 my-1 text-center">
              {/* Robot Mascot Step 3 */}
              <StepRobotMascot
                src="/assets/robot/robot-tahap-3.png"
                alt="Robot Mascot Step 3 Finish"
                glowColor="emerald"
                size="md"
              />

              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  Tahap 3 • Persetujuan & Aktivasi
                </span>
                <h3 className="font-extrabold text-lg text-slate-100">
                  Persetujuan Syarat & Ketentuan
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Data kamu dilindungi enkripsi SSL 256-bit dan hanya digunakan untuk analisis rekomendasi karir AI.
                </p>
              </div>

              {/* Agreement Box */}
              <div
                onClick={() => setAgreed(!agreed)}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 cursor-pointer transition-all ${
                  agreed
                    ? 'bg-emerald-500/15 border-emerald-500 text-slate-200 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  agreed ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-900 border-slate-700'
                }`}>
                  {agreed && <Check className="w-3 h-3" />}
                </div>
                <div className="text-xs space-y-0.5">
                  <div className="font-bold text-slate-100">Saya Pahami Prosedur & Setujui Syarat Layanan</div>
                  <div className="text-[10.5px] text-slate-400">
                    Menyimpan persetujuan di sesi akun pengguna secara otomatis.
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                </button>

                <button
                  type="button"
                  onClick={handleAgreeAndFinish}
                  disabled={!agreed}
                  className={`py-2.5 px-4 rounded-xl font-extrabold text-xs text-white transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    agreed
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 shadow-lg shadow-emerald-500/25'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                  }`}
                >
                  <span>Setuju & Masuk Dashboard</span>
                  <Rocket className="w-3.5 h-3.5 flex-shrink-0" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
