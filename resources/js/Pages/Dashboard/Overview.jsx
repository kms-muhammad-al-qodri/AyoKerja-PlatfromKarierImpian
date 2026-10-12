import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import {
  Sparkles, BarChart3, Briefcase, TrendingUp, ArrowRight,
  CheckCircle2, ExternalLink, Check, Layers,
  Flame, RefreshCw, FileText, Plus, Trash2, Upload,
  Code2, Brain, GraduationCap, MapPin, Cpu, Heart,
  X, Zap, ShieldCheck, XCircle, FileUp, Calendar, AlertCircle,
  PieChart, Activity, Award, Target, Compass
} from 'lucide-react';
import useBilingual from '../../i18n/useBilingual';
import JobDetailModal, { cleanJobTitle } from '../../Components/JobDetailModal';
import { isJobSaved, toggleSaveJob } from '../../Utils/savedJobs';

export default function Overview({ onNavigateTab, jobs, stats: liveStats, user, isRefreshing }) {
  const { isEn, L, T } = useBilingual();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTab, setUploadTab] = useState('sample');
  const [uploadingFile, setUploadingFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobList = jobs && jobs.length > 0 ? jobs : [];
  const topJob = jobList[0] || {
    title: 'Laravel Senior Backend Developer',
    company: 'TechCorp Indonesia',
    location: 'Jakarta · Hybrid',
    salary: 'Rp 10M – 15M',
    matchScore: 95,
    source: 'Adzuna API',
    apply_url: 'https://www.adzuna.id',
    matched_skills: ['Laravel', 'PHP', 'MySQL', 'REST API'],
    missing_skills: ['Docker'],
  };

  const hasCv = liveStats?.hasCv ?? false;
  const cvScore = liveStats?.cvScore;
  const careerMatch = liveStats?.careerMatch ?? 0;
  const skillProgress = liveStats?.skillProgress ?? 0;
  const totalJobs = jobList.length || liveStats?.recommendedJobs || 0;
  const userCvs = liveStats?.userCvs || [];

  const handleSelectCv = (cvId) => {
    router.post(`/cv/${cvId}/select`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        if (typeof window !== 'undefined') window.location.reload();
      }
    });
  };

  const handleDeleteCv = (cvId, filename) => {
    if (confirm(L(`Apakah Anda yakin ingin menghapus CV "${filename}" dari koleksi?`, `Are you sure you want to delete CV "${filename}" from your collection?`))) {
      router.delete(`/cv/${cvId}`, {
        preserveScroll: true,
        onSuccess: () => {
          if (typeof window !== 'undefined') window.location.reload();
        }
      });
    }
  };

  const handleUploadSampleCv = (sampleType = 'backend') => {
    setIsSubmitting(true);
    router.post('/cv/sample', { sample_type: sampleType }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        setIsUploadModalOpen(false);
        if (typeof window !== 'undefined') window.location.reload();
      },
      onError: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!uploadingFile) return;

    const formData = new FormData();
    formData.append('cv', uploadingFile);

    setIsSubmitting(true);
    router.post('/upload-cv', formData, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        setIsUploadModalOpen(false);
        if (typeof window !== 'undefined') window.location.reload();
      },
      onError: () => {
        setIsSubmitting(false);
      }
    });
  };

  // Calculate dynamic signup profile initial score if user has no CV yet
  const userSkillCount = user?.skills_list ? String(user.skills_list).split(',').length : 0;
  const initialSignupScore = Math.min(80, Math.max(55, 45 + userSkillCount * 8));

  const statItems = [
    {
      key: 'ats',
      title: L('Skor Analisis CV / Profil', 'CV / Profile Score'),
      value: hasCv && cvScore !== null ? `${cvScore}` : `${initialSignupScore}`,
      unit: '/100',
      subtitle: hasCv 
        ? L('Terverifikasi Analisis ATS CV', 'Verified ATS CV Analysis') 
        : L('Estimasi Awal Data Pendaftaran', 'Initial Registration Profile Est.'),
      badge: hasCv 
        ? (cvScore >= 80 ? L('ATS Verified', 'ATS Verified') : L('Cukup Baik', 'Good')) 
        : L('Profil Pendaftaran', 'Signup Profile'),
      icon: BarChart3,
      color: hasCv ? 'text-teal-400' : 'text-cyan-400',
      borderColor: hasCv ? 'border-teal-500/30' : 'border-cyan-500/30',
      bgGlow: 'from-teal-500/15 via-teal-500/5 to-transparent',
      progress: hasCv && cvScore !== null ? cvScore : initialSignupScore,
      barColor: hasCv ? 'bg-teal-400' : 'bg-cyan-400',
      slideDirection: 'left',
    },
    {
      key: 'match',
      title: L('Kecocokan Karir AI', 'AI Career Match'),
      value: `${careerMatch || 70}`,
      unit: '%',
      subtitle: user?.role ? `${L('Posisi', 'Position')} ${user.role}` : L('Target Role Belum Diatur', 'Target Role Not Set'),
      badge: careerMatch > 0 ? 'Live API Match' : L('Perlu Profiling', 'Profiling Needed'),
      icon: Sparkles,
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/30',
      bgGlow: 'from-indigo-500/15 via-indigo-500/5 to-transparent',
      progress: careerMatch || 70,
      barColor: 'bg-indigo-400',
      slideDirection: 'left',
    },
    {
      key: 'skill',
      title: L('Penguasaan Skill Target', 'Target Skill Mastery'),
      value: `${skillProgress || (userSkillCount ? 50 : 0)}`,
      unit: '%',
      subtitle: L(`${liveStats?.matchedSkillsCount || userSkillCount || 0} dari ${liveStats?.totalRequiredSkills || 6} Skill Terpenuhi`, `${liveStats?.matchedSkillsCount || userSkillCount || 0} of ${liveStats?.totalRequiredSkills || 6} Skills Met`),
      badge: (skillProgress > 0 || userSkillCount > 0) ? L('Profil Skill Aktif', 'Skill Profile Active') : L('Pilih Skill', 'Choose Skills'),
      icon: TrendingUp,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      bgGlow: 'from-purple-500/15 via-purple-500/5 to-transparent',
      progress: skillProgress || (userSkillCount ? 50 : 0),
      barColor: 'bg-purple-400',
      slideDirection: 'right',
    },
    {
      key: 'cvs',
      title: L('Koleksi CV Tersimpan', 'Saved CV Collection'),
      value: `${userCvs.length}`,
      unit: L(' Dokumen', ' Documents'),
      subtitle: userCvs.length > 0 ? L('1 Akun Banyak CV Aktif', 'One Account, Multiple CVs') : L('Belum Ada CV Uploaded', 'No CV Uploaded Yet'),
      badge: userCvs.length > 0 ? 'Multi-CV Ready' : L('Upload Sekarang', 'Upload Now'),
      icon: Layers,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      bgGlow: 'from-cyan-500/15 via-cyan-500/5 to-transparent',
      progress: userCvs.length * 25,
      barColor: 'bg-cyan-400',
      slideDirection: 'right',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return L('Selamat Pagi', 'Good Morning');
    if (hour < 15) return L('Selamat Siang', 'Good Afternoon');
    if (hour < 18) return L('Selamat Sore', 'Good Afternoon');
    return L('Selamat Malam', 'Good Evening');
  };

  return (
    <div className="space-y-7">

      {/* ── HERO BANNER: Welcome & AI Career Passport ── */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800/80 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl group"
      >
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/15 rounded-full filter blur-3xl pointer-events-none group-hover:bg-teal-500/25 transition-all duration-700" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-indigo-500/15 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles size={12} className="text-teal-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>AI EXECUTIVE DASHBOARD</span>
              </span>

            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
              {getGreeting()}, <span className="shimmer-text">{user?.name || L('Kandidat', 'Candidate')}</span>!
            </h1>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {L('Analisis profil, grafik pertumbuhan karir real-time, dan rekomendasi lowongan pekerjaan yang disesuaikan secara personal oleh engine AI kami.', 'Profile analysis, real-time career growth presentation charts, and job recommendations tailored personally by our AI engine.')}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="shimmer-btn-primary w-full sm:w-auto px-5 py-3 text-xs font-bold justify-center cursor-pointer shadow-xl shadow-teal-500/20"
            >
              <Upload size={15} />
              <span>{L('Upload / Analisis CV', 'Upload / Analyze CV')}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── 4 REAL-TIME METRIC CARDS (Slide in from Left & Right) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statItems.map((st, idx) => {
          const Icon = st.icon;
          const isFromLeft = st.slideDirection === 'left';
          return (
            <motion.div
              key={st.key}
              initial={{ opacity: 0, x: isFromLeft ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden bg-slate-900/85 border ${st.borderColor} rounded-3xl p-5 backdrop-blur-xl hover:border-teal-400/50 transition-all duration-300 shadow-xl group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${st.bgGlow} opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none`} />

              <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{st.title}</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/80 text-[10px] font-extrabold text-slate-300">
                    {st.badge}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-slate-100 tracking-tight">{st.value}</span>
                  <span className="text-sm font-bold text-slate-400">{st.unit}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${st.progress}%` }}
                      transition={{ duration: 0.9, delay: 0.3 + idx * 0.1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${st.barColor}`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>{st.subtitle}</span>
                    <Icon size={14} className={st.color} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── REAL-TIME SHIMMER GLASS PRESENTATION CHART SECTION ── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <OverviewGlassPresentationChart 
        liveStats={liveStats} 
        user={user} 
        jobs={jobList} 
        onNavigateTab={onNavigateTab} 
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── MULTI-CV COLLECTION MANAGEMENT SECTION (Slide in from Left) ── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-gradient-to-br from-slate-900/90 via-slate-900/85 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-2xl relative"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm">
                <Layers size={18} />
              </div>
              <h3 className="font-extrabold text-xl text-slate-100 tracking-tight">
                {L('Riwayat & Koleksi CV Saya', 'My CV History & Collection')}
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {isEn ? (
                <>Manage all the CV documents you have uploaded. You can switch between <strong className="text-emerald-300 font-bold">Active CV</strong> and <strong className="text-slate-300 font-semibold">Inactive</strong> anytime to update job matching & real-time ATS analysis.</>
              ) : (
                <>Kelola seluruh dokumen CV yang telah Anda unggah. Anda dapat beralih antara <strong className="text-emerald-300 font-bold">CV Aktif</strong> dan <strong className="text-slate-300 font-semibold">Tidak Aktif</strong> kapan saja untuk memperbarui pencocokan pekerjaan & analisis ATS real-time.</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="shimmer-btn-primary w-full sm:w-auto px-4 py-2.5 text-xs font-extrabold justify-center cursor-pointer shadow-lg shadow-teal-500/20 flex items-center gap-2"
            >
              <Plus size={15} />
              <span>{L('Upload / Tambah CV Baru', 'Upload / Add New CV')}</span>
            </button>
          </div>
        </div>

        {userCvs && userCvs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {userCvs.map((cv) => {
              const isCvActive = cv.is_active;
              const atsScore = cv.ats_score ?? 85;
              const scoreBadgeColor = atsScore >= 80 
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                : atsScore >= 65 
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30';

              return (
                <div
                  key={cv.id}
                  className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isCvActive
                      ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/70 border-emerald-500/60 shadow-xl shadow-emerald-950/20 ring-1 ring-emerald-500/40'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Status Ribbon */}
                  <div className="flex items-center justify-between">
                    {isCvActive ? (
                      <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[11px] font-black tracking-wide flex items-center gap-1.5 shadow-sm shadow-emerald-500/20">
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span>{L('CV AKTIF', 'ACTIVE CV')}</span>
                      </div>
                    ) : (
                      <div className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                        <XCircle size={12} className="text-slate-500" />
                        <span>{L('TIDAK AKTIF', 'INACTIVE')}</span>
                      </div>
                    )}

                    <span className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-extrabold ${scoreBadgeColor}`}>
                      {atsScore}/100 ATS
                    </span>
                  </div>

                  {/* File Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isCvActive 
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                          : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                      }`}>
                        <FileText size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-sm text-slate-100 truncate" title={cv.filename}>
                          {cv.filename}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-medium">
                          <span>{cv.file_size}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar size={11} className="text-slate-500" />
                            {T(cv.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-xs">
                      <span className="text-slate-400 text-[11px] font-medium">{L('Role Terdeteksi:', 'Detected Role:')}</span>
                      <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-cyan-300 font-bold text-[11px]">
                        {cv.detected_role}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Status Switch & Actions */}
                  <div className="space-y-2.5 pt-2.5 border-t border-slate-800/60">
                    {/* Toggle Switch */}
                    {isCvActive ? (
                      <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 font-bold shadow-inner">
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <ShieldCheck size={14} className="text-emerald-400" /> 
                          {L('Sedang Digunakan (Aktif)', 'Currently In Use (Active)')}
                        </span>
                        <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-emerald-500 transition-colors shadow-sm cursor-default">
                          <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform translate-x-4.5" />
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSelectCv(cv.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-xs transition-all cursor-pointer group"
                      >
                        <span className="text-slate-300 group-hover:text-cyan-300 font-bold flex items-center gap-1.5 text-[11px]">
                          <RefreshCw size={13} className="text-slate-400 group-hover:text-cyan-400 group-hover:rotate-180 transition-transform duration-500" /> 
                          {L('Set Sebagai CV Aktif', 'Set as Active CV')}
                        </span>
                        <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-slate-700 group-hover:bg-cyan-600 transition-colors">
                          <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-slate-300 group-hover:bg-white transition-transform translate-x-1" />
                        </span>
                      </button>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigateTab('analysis')}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <BarChart3 size={14} className="text-cyan-400" />
                        <span>{L('Lihat Analisis', 'View Analysis')}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCv(cv.id, cv.filename)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-all cursor-pointer"
                        title={L('Hapus CV dari Koleksi', 'Delete CV from Collection')}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 px-4 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
              <Upload size={32} />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h4 className="text-base font-extrabold text-slate-200">{L('Belum Ada Dokumen CV Tersimpan', 'No Saved CV Documents Yet')}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {L('Unggah file CV pertama Anda untuk melihat riwayat analisis ATS, atau coba simulasikan dengan Sample CV AI Instant.', 'Upload your first CV to see ATS analysis history, or try a simulation with an Instant AI Sample CV.')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <Upload size={14} />
                <span>Upload File CV (PDF / DOCX)</span>
              </button>

              <button
                onClick={() => handleUploadSampleCv('backend')}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap size={14} className="text-yellow-400" />
                <span>{isSubmitting ? L('Memuat Sample...', 'Loading Sample...') : L('Gunakan Sample CV AI Demo', 'Use AI Demo Sample CV')}</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── MAIN AI INSIGHT & HIGHEST MATCH JOB ROW (Left & Right Animations) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* AI Career Executive Summary (2 Cols - Slide from Left) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-indigo-950/40 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl flex flex-col justify-between shadow-2xl group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-teal-400" />
                <span className="text-xs font-bold text-teal-400 tracking-wider uppercase">AI Career Summary</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-[10px] font-bold text-teal-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                {L('Terverifikasi System', 'Verified System')}
              </span>
            </div>

            <h3 className="font-bold text-lg sm:text-xl text-slate-100 mb-3 leading-snug">
              {L('Profil Karir untuk Posisi', 'Career Profile for')}{' '}
              <span className="text-teal-300">{user?.role || 'Software Engineer'}</span>
            </h3>

            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              {L('Rekomendasi lowongan dan roadmap karir disesuaikan berdasarkan profil pendidikan, skill, serta target peran yang telah kamu isi saat mendaftar.', 'Job recommendations and career roadmap are tailored based on the education, skills, and target role you provided at registration.')}
              {user?.skills_list && (
                <span className="block mt-1.5 text-slate-300">
                  {L('Skill terdeteksi:', 'Detected skills:')}{' '}
                  <strong className="text-teal-300">
                    {String(user.skills_list).split(',').slice(0, 4).map(s => s.trim()).filter(Boolean).join(', ')}
                    {String(user.skills_list).split(',').length > 4 ? '...' : ''}
                  </strong>
                </span>
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3 hover:border-teal-500/40 transition-colors">
                <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/25 text-teal-400">
                  <Code2 size={15} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">{user?.role || 'Software Engineer'}</div>
                  <div className="text-[10px] text-slate-400">{L('Target Peran', 'Target Role')}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3 hover:border-indigo-500/40 transition-colors">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
                  <Brain size={15} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">{T(user?.level || 'Junior Level')}</div>
                  <div className="text-[10px] text-slate-400">{L('Level Karir', 'Career Level')}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3 hover:border-purple-500/40 transition-colors">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-400">
                  <GraduationCap size={15} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200 truncate max-w-[120px]" title={user?.education}>
                    {user?.education && !['Belum diisi', 'Not filled'].includes(user.education) ? user.education : L('Belum diisi', 'Not filled')}
                  </div>
                  <div className="text-[10px] text-slate-400">{L('Pendidikan', 'Education')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button onClick={() => onNavigateTab('roadmap')} className="shimmer-btn-primary px-5 py-2.5 text-xs font-bold cursor-pointer shadow-lg shadow-teal-500/20">
              <span>{L('Lihat Roadmap Karir AI', 'View AI Career Roadmap')}</span>
              <ArrowRight size={14} />
            </button>
            <button onClick={() => onNavigateTab('jobs')} className="shimmer-btn-outline px-5 py-2.5 text-xs font-semibold cursor-pointer">
              <span>{L('Cari Rekomendasi Kerja', 'Find Job Recommendations')}</span>
            </button>
          </div>
        </motion.div>

        {/* Top Matching Job Spotlight Card (Slide from Right) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-slate-900/90 border border-teal-500/35 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full filter blur-2xl pointer-events-none group-hover:bg-teal-500/20 transition-all duration-700" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-xs font-extrabold text-teal-400 tracking-wider uppercase">{L('JOB SPOTLIGHT HARI INI', "TODAY'S JOB SPOTLIGHT")}</span>
              </div>
              <span className="text-[10px] font-bold text-cyan-300 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                {T(topJob.source || 'Adzuna API')}
              </span>
            </div>

            <h4 className="font-extrabold text-lg text-slate-100 mb-1 leading-snug">{topJob.title}</h4>
            <div className="text-xs text-slate-400 mb-4 font-medium">
              {topJob.company} • {T(topJob.location)} • <strong className="text-teal-300">{T(topJob.salary || L('Gaji Kompetitif', 'Competitive Salary'))}</strong>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-500/15 via-teal-500/10 to-indigo-500/10 rounded-2xl border border-teal-500/30 mb-4">
              <div>
                <div className="text-[11px] font-bold text-slate-400">Match CV Score</div>
                <div className="text-[10px] text-teal-400 font-semibold">{L('Tingkat Kecocokan Tinggi', 'High Match Level')}</div>
              </div>
              <span className="text-3xl font-black text-teal-400">{topJob.matchScore || topJob.match || 95}%</span>
            </div>

            <div className="space-y-2 mb-6">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{L('SKILL YANG COCOK:', 'MATCHED SKILLS:')}</div>
              <div className="flex flex-wrap gap-1.5">
                {(topJob.matched_skills || ['Laravel', 'PHP', 'MySQL', 'REST API']).map((sk) => (
                  <span key={sk} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                    <Check size={12} /> {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('jobs')}
            className="shimmer-btn-primary w-full justify-center py-3 text-xs font-extrabold cursor-pointer shadow-lg shadow-teal-500/20"
          >
            <span>{L('Lamar / Lihat Lowongan Live', 'Apply / View Live Jobs')} ({totalJobs})</span>
            <ArrowRight size={14} />
          </button>
        </motion.div>

      </div>

      {/* ── ANIMATED JOB CAROUSEL SECTION ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-5 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase size={16} className="text-teal-400" />
              <h3 className="font-bold text-base text-slate-100">{L('Lowongan Sesuai Profilmu', 'Jobs Matching Your Profile')}</h3>
            </div>
            <p className="text-xs text-slate-500">
              {L('Dicocokkan berdasarkan role', 'Matched based on role')}{' '}
              <span className="text-slate-300 font-medium">{user?.role || 'Software Engineer'}</span>
              {user?.level ? (
                <> &middot; <span className="text-slate-300 font-medium">{T(user.level)}</span></>
              ) : null}
              {' '}&middot; via <span className="text-teal-400 font-medium">Adzuna &amp; Jooble</span>
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('jobs')}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-teal-300 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>{L('Lihat Semua', 'View All')} ({totalJobs})</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {jobList.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <Briefcase size={32} className="mx-auto text-slate-600" />
            <p className="text-sm text-slate-400 font-medium">{L('Belum ada lowongan yang dimuat', 'No jobs loaded yet')}</p>
            <p className="text-xs text-slate-500">{L('Klik "Perbarui Data" untuk memuat lowongan terbaru', 'Click "Refresh Data" to load the latest jobs')}</p>
          </div>
        ) : (
          <JobCarousel jobs={jobList} user={user} onNavigateTab={onNavigateTab} />
        )}
      </motion.div>

      {/* ── UPLOAD / TAMBAH CV MODAL ── */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <FileUp size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-100">{L('Upload & Analisis CV Baru', 'Upload & Analyze New CV')}</h3>
                    <p className="text-xs text-slate-400">{L('Pilih metode pengunggahan CV ke koleksi Anda', 'Choose how to add a CV to your collection')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setUploadTab('sample')}
                  className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    uploadTab === 'sample' 
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap size={14} className={uploadTab === 'sample' ? 'text-yellow-300' : ''} />
                  <span>{L('Sample CV AI (Instan)', 'AI Sample CV (Instant)')}</span>
                </button>
                <button
                  onClick={() => setUploadTab('file')}
                  className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    uploadTab === 'file' 
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Upload size={14} />
                  <span>Upload File PDF / DOCX</span>
                </button>
              </div>

              {/* Tab Content: Sample CV AI */}
              {uploadTab === 'sample' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {L('Pilih salah satu profil CV demo berstandar ATS untuk langsung dicoba pada akun Anda:', 'Choose one of the ATS-standard demo CV profiles to try instantly on your account:')}
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleUploadSampleCv('backend')}
                      disabled={isSubmitting}
                      className="w-full p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs text-slate-100 group-hover:text-cyan-300">
                          Senior Backend Developer
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold">
                          92/100 ATS
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Laravel, PHP 8.3, MySQL, Redis, Docker, Microservices REST API
                      </p>
                    </button>

                    <button
                      onClick={() => handleUploadSampleCv('frontend')}
                      disabled={isSubmitting}
                      className="w-full p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs text-slate-100 group-hover:text-cyan-300">
                          Fullstack React Engineer
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold">
                          88/100 ATS
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        React.js, Next.js, TypeScript, TailwindCSS, Node.js, GraphQL
                      </p>
                    </button>

                    <button
                      onClick={() => handleUploadSampleCv('data')}
                      disabled={isSubmitting}
                      className="w-full p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs text-slate-100 group-hover:text-cyan-300">
                          AI & Data Scientist
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold">
                          95/100 ATS
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Python, TensorFlow, PyTorch, SQL, Machine Learning, Pandas
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab Content: Real File Upload */}
              {uploadTab === 'file' && (
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div className="p-6 rounded-2xl bg-slate-950/80 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 text-center space-y-3 transition-all">
                    <input
                      type="file"
                      id="cvFileInput"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={(e) => setUploadingFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label htmlFor="cvFileInput" className="cursor-pointer block space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                        <Upload size={24} />
                      </div>
                      <div className="text-xs font-bold text-slate-200">
                        {uploadingFile ? uploadingFile.name : L('Klik untuk Pilih File CV (PDF / DOCX)', 'Click to Choose CV File (PDF / DOCX)')}
                      </div>
                      <p className="text-[11px] text-slate-500">{L('Maksimal ukuran file 10MB', 'Maximum file size 10MB')}</p>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!uploadingFile || isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Upload size={14} />
                    <span>{isSubmitting ? L('Mengunggah & Menganalisis...', 'Uploading & Analyzing...') : L('Unggah & Analisis CV Sekarang', 'Upload & Analyze CV Now')}</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ── REAL-TIME SHIMMER GLASS PRESENTATION CHART COMPONENT ── */
/* ═══════════════════════════════════════════════════════════════════════════ */
function OverviewGlassPresentationChart({ liveStats, user, jobs, onNavigateTab, onOpenUploadModal }) {
  const { isEn, L, T } = useBilingual();
  const [activeTab, setActiveTab] = useState('trajectory'); // 'trajectory' | 'skills' | 'market'
  const [hoveredNode, setHoveredNode] = useState(null);

  // Realtime values from liveStats and user
  const hasCv = liveStats?.hasCv ?? false;
  const rawCvScore = liveStats?.cvScore;
  
  // Calculate dynamic signup profile initial score if user has no CV yet
  const userSkillCount = user?.skills_list ? String(user.skills_list).split(',').map(s=>s.trim()).filter(Boolean).length : 0;
  const initialRegistrationScore = liveStats?.registrationScore || Math.min(78, Math.max(55, 45 + userSkillCount * 7));

  const currentScore = hasCv && rawCvScore !== null && rawCvScore !== undefined
    ? rawCvScore
    : initialRegistrationScore;

  const cvScore = rawCvScore !== null && rawCvScore !== undefined ? rawCvScore : (hasCv ? 85 : initialRegistrationScore);

  const careerMatch = hasCv
    ? (liveStats?.careerMatch ?? 85)
    : Math.min(85, initialRegistrationScore + 8);

  const totalLiveJobs = jobs && jobs.length > 0 ? jobs.length : (liveStats?.recommendedJobs || 20);

  // Smooth SVG Cubic Bezier helper
  const getSmoothPath = (points) => {
    if (!points || points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2.2;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) / 2.2;
      const cp2y = next.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  // Trajectory points: Real-Time Human Stages (backed by active CV analysis or signup data)
  const trajectoryPoints = (liveStats?.trajectory && Array.isArray(liveStats.trajectory) && liveStats.trajectory.length > 0)
    ? liveStats.trajectory.map(p => ({
        month: isEn ? (p.month_en || p.month) : (p.month || p.month_en),
        ats: p.ats,
        match: p.match,
        note: isEn ? (p.note_en || p.note) : (p.note || p.note_en),
        isCurrent: Boolean(p.is_current),
      }))
    : (hasCv ? [
        { 
          month: L('Format CV', 'CV Format'), 
          ats: Math.max(50, Math.round(cvScore * 0.92)), 
          match: Math.max(45, Math.round(careerMatch * 0.85)), 
          note: L('Struktur & tata letak dasar dokumen CV', 'Basic CV document layout & structure') 
        },
        { 
          month: L('Kata Kunci', 'Keywords'), 
          ats: Math.max(58, Math.round(cvScore * 0.95)), 
          match: Math.max(56, Math.round(careerMatch * 0.92)), 
          note: L('Kesesuaian kata kunci teknis & industri', 'Technical & industry keyword match') 
        },
        { 
          month: L('Standar ATS', 'ATS Standard'), 
          ats: Math.max(70, Math.round(cvScore * 0.97)), 
          match: Math.max(70, Math.round(careerMatch * 0.96)), 
          note: L('Tingkat kelolosan sistem parsing perusahaan', 'Company parsing system pass rate') 
        },
        { 
          month: L('CV Live Real-Time', 'Live Active CV'), 
          ats: cvScore, 
          match: careerMatch, 
          isCurrent: true, 
          note: L('Dokumen CV aktif terverifikasi 100% oleh AI', 'Active CV document 100% verified by AI') 
        },
        { 
          month: L('Target Panggilan HR', 'HR Call Target'), 
          ats: Math.min(99, Math.round(cvScore * 1.08)), 
          match: Math.min(99, Math.round(careerMatch * 1.06)), 
          note: L('Proyeksi tertinggi peluang dipanggil wawancara', 'Top projected odds of interview callbacks') 
        },
      ] : [
        { 
          month: L('Profil Awal', 'Initial Profile'), 
          ats: Math.max(40, Math.round(currentScore * 0.85)), 
          match: Math.max(38, Math.round(careerMatch * 0.82)), 
          note: L('Kesesuaian dasar dari formulir pendaftaran akun', 'Base match from account signup form') 
        },
        { 
          month: L('Kelengkapan Skill', 'Skill Readiness'), 
          ats: Math.max(50, Math.round(currentScore * 0.92)), 
          match: Math.max(48, Math.round(careerMatch * 0.90)), 
          note: L('Evaluasi kecocokan skill teknis & target role', 'Technical skill & target role evaluation') 
        },
        { 
          month: L('Standar Industri', 'Industry Match'), 
          ats: Math.max(58, Math.round(currentScore * 0.96)), 
          match: Math.max(58, Math.round(careerMatch * 0.95)), 
          note: L('Kesesuaian dengan kualifikasi lowongan kerja live', 'Match with live job qualifications') 
        },
        { 
          month: L('Profil Pendaftaran', 'Signup Profile'), 
          ats: currentScore, 
          match: careerMatch, 
          isCurrent: true, 
          note: L(`Skor ${currentScore}% dihitung dari data pendaftaran (Upload CV untuk naikkan ke 88%+)`, `Score ${currentScore}% estimated from signup (Upload CV to boost to 88%+)`) 
        },
        { 
          month: L('Target Lolos ATS', 'ATS Pass Target'), 
          ats: Math.min(96, currentScore + 18), 
          match: Math.min(98, careerMatch + 14), 
          note: L('Proyeksi skor maksimal setelah upload file CV ATS', 'Max score projection after ATS CV file upload') 
        },
      ]);

  // Dynamic Skill Extraction from user.skills_list and real-time skillsAnalysis
  const skillItems = (liveStats?.skillsAnalysis && Array.isArray(liveStats.skillsAnalysis) && liveStats.skillsAnalysis.length > 0)
    ? liveStats.skillsAnalysis.map((sk) => {
        const score = sk.score;
        return {
          name: sk.name,
          score: score,
          status: isEn ? sk.status_en : sk.status,
          inCv: sk.in_cv,
          inProfile: sk.in_profile,
          demandPct: sk.demand_pct,
          color: score >= 80 ? 'from-teal-400 to-emerald-400' : score >= 65 ? 'from-cyan-400 to-blue-500' : 'from-indigo-400 to-purple-500',
          icon: sk.in_cv ? ShieldCheck : (sk.in_profile ? Code2 : Zap),
        };
      })
    : (user?.skills_list ? String(user.skills_list).split(',').map(s => s.trim()).filter(Boolean) : ['Laravel & PHP', 'MySQL & Database', 'RESTful API', 'Docker & CI/CD', 'React Frontend']).slice(0, 5).map((skName, idx) => {
        const calculatedScore = Math.min(95, Math.max(55, currentScore + (idx === 0 ? 5 : (idx === 1 ? 2 : -3 * idx))));
        return {
          name: skName,
          score: calculatedScore,
          status: calculatedScore >= 80 ? L('Kualifikasi Industri Tinggi', 'High Industry Level') : L('Penguasaan Menengah', 'Intermediate Level'),
          color: idx % 3 === 0 ? 'from-teal-400 to-emerald-400' : idx % 3 === 1 ? 'from-cyan-400 to-blue-500' : 'from-indigo-400 to-purple-500',
          icon: idx % 3 === 0 ? Code2 : idx % 3 === 1 ? Cpu : Layers,
        };
      });

  // Dynamic Market Metrics (backed by backend matrix)
  const matchedSkillsCount = liveStats?.matchedSkillsCount || (userSkillCount || 4);
  const totalRequiredSkills = liveStats?.totalRequiredSkills || 6;
  const marketMetrics = (liveStats?.marketMetrics && Array.isArray(liveStats.marketMetrics) && liveStats.marketMetrics.length > 0)
    ? liveStats.marketMetrics.map(m => ({
        title: isEn ? (m.title_en || m.title) : m.title,
        score: m.score,
        target: m.target,
        badge: isEn ? (m.badge_en || m.badge) : m.badge,
        detail: isEn ? (m.detail_en || m.detail) : m.detail,
        isCount: Boolean(m.is_count),
        color: m.color || 'text-teal-400',
        icon: m.title.includes('ATS') ? ShieldCheck : (m.title.includes('Skill') ? Zap : (m.title.includes('HR') ? TrendingUp : Briefcase)),
      }))
    : [
        {
          title: L('Kesesuaian ATS Real-Time', 'Real-Time ATS Alignment'),
          score: currentScore,
          target: 80,
          badge: hasCv ? (currentScore >= 80 ? L('Sangat Optimal', 'Highly Optimal') : L('Perlu Tingkatkan', 'Needs Boost')) : L('Profil Pendaftaran', 'Signup Profile'),
          detail: L(`Tingkat kesesuaian profil untuk ${user?.role || 'Backend Dev'}`, `Profile match rate for ${user?.role || 'Backend Dev'}`),
          color: 'text-teal-400',
          icon: ShieldCheck,
        },
        {
          title: L('Penguasaan Skill Target', 'Target Skill Mastery'),
          score: Math.round((matchedSkillsCount / totalRequiredSkills) * 100),
          target: 75,
          badge: `${matchedSkillsCount}/${totalRequiredSkills} ${L('Skill Terpenuhi', 'Skills Met')}`,
          detail: L('Kesesuaian dengan syarat lowongan live', 'Match with live job requirements'),
          color: 'text-indigo-400',
          icon: Zap,
        },
        {
          title: L('Peluang Panggilan HR', 'HR Call Odds'),
          score: Math.min(98, Math.round(careerMatch * 1.04)),
          target: 70,
          badge: careerMatch >= 80 ? L('Sangat Tinggi', 'Very High') : L('Kompetitif', 'Competitive'),
          detail: L('Proyeksi AI dari kelengkapan profil', 'AI projection from profile completeness'),
          color: 'text-cyan-400',
          icon: TrendingUp,
        },
        {
          title: L('Lowongan Live Terdeteksi', 'Live Jobs Detected'),
          score: totalLiveJobs,
          target: 15,
          isCount: true,
          badge: L('Adzuna API Real-Time', 'Adzuna API Real-Time'),
          detail: L('Total rekomendasi aktif yang cocok', 'Total matching active recommendations'),
          color: 'text-emerald-400',
          icon: Briefcase,
        },
      ];

  // SVG Dimension & Coordinate Math (ViewBox 650 x 240)
  const svgWidth = 650;
  const svgHeight = 240;
  const paddingX = 50;
  const paddingY = 40;
  const stepX = (svgWidth - paddingX * 2) / (trajectoryPoints.length - 1);

  const pointsATS = trajectoryPoints.map((p, idx) => ({
    x: paddingX + idx * stepX,
    y: svgHeight - paddingY - (p.ats / 100) * (svgHeight - paddingY * 2),
    val: p.ats,
    month: p.month,
    note: p.note,
    isCurrent: p.isCurrent,
  }));

  const pointsMatch = trajectoryPoints.map((p, idx) => ({
    x: paddingX + idx * stepX,
    y: svgHeight - paddingY - (p.match / 100) * (svgHeight - paddingY * 2),
    val: p.match,
    month: p.month,
    note: p.note,
    isCurrent: p.isCurrent,
  }));

  // Create Smooth Curved SVG Paths
  const smoothATS = getSmoothPath(pointsATS);
  const areaATS = `${smoothATS} L ${pointsATS[pointsATS.length - 1].x} ${svgHeight - paddingY} L ${pointsATS[0].x} ${svgHeight - paddingY} Z`;
  const smoothMatch = getSmoothPath(pointsMatch);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-indigo-950/60 border border-teal-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6 group"
    >
      {/* Background Glowing Orb & Grid Overlay */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none group-hover:bg-teal-500/15 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Header & Tab Selector (Slide in from Left & Right) */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        
        {/* Left Badge & Title (Slide from Left) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-1.5"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
              <Activity size={18} className="animate-pulse" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-100 tracking-tight">
              {L('Grafik Presentasi & Analytics Real-Time AI', 'Real-Time AI Presentation & Analytics Chart')}
            </h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {hasCv ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-black tracking-wide flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI ATS CV VERIFIED</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-[10px] font-black tracking-wide flex items-center gap-1.5 shadow-sm">
                <Sparkles size={12} className="text-cyan-400 animate-pulse" />
                <span>ESTIMASI PROFIL PENDAFTARAN</span>
              </span>
            )}
            <p className="text-xs text-slate-400 leading-relaxed">
              {hasCv
                ? L('Grafik pertumbuhan skor ATS & daya saing karir terverifikasi dari CV Aktif.', 'Verified ATS score growth & career competitiveness chart from Active CV.')
                : L('Skor dihitung dari data role & skill pendaftaran Anda. Upload CV untuk Verifikasi ATS & Tingkatkan Skor!', 'Score calculated from your signup role & skills. Upload CV for ATS Verification & Boost Score!')}
            </p>
          </div>
        </motion.div>

        {/* Right Tab Switcher (Slide from Right) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-bold w-full md:w-auto overflow-x-auto"
        >
          <button
            onClick={() => setActiveTab('trajectory')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'trajectory'
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg shadow-teal-500/20 font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp size={14} />
            <span>{L('Trajektori Karir', 'Career Trajectory')}</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'skills'
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg shadow-teal-500/20 font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieChart size={14} />
            <span>{L('Penguasaan Skill', 'Skill Mastery')}</span>
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'market'
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg shadow-teal-500/20 font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target size={14} />
            <span>{L('Daya Saing Pasar', 'Market Index')}</span>
          </button>
        </motion.div>
      </div>

      {/* ── HINT PROMPT FOR NON-CV USERS TO BOOST SCORE ── */}
      {!hasCv && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-indigo-500/10 to-teal-500/15 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 flex-shrink-0">
              <Zap size={16} className="text-yellow-400 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-slate-100 block">
                {L('Tingkatkan Skor dari ' + currentScore + '% ke 90%+ dengan CV Terverifikasi!', 'Boost Score from ' + currentScore + '% to 90%+ with Verified CV!')}
              </span>
              <p className="text-[11px] text-slate-400">
                {L('Skor saat ini dihitung dari data pendaftaran Anda. Upload CV untuk membuka analisis ATS & optimasi AI penuh.', 'Current score is estimated from signup data. Upload CV to unlock full ATS analysis & AI optimization.')}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenUploadModal}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Upload size={13} />
            <span>{L('Upload CV (Makin Mantap!)', 'Upload CV (Boost Now!)')}</span>
          </button>
        </motion.div>
      )}

      {/* ── TAB CONTENT 1: TRAJECTORY CURVED SVG GRAPH + SIDE DIAGNOSTICS PANEL ── */}
      {activeTab === 'trajectory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: SVG Curved Presentation Graph (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-400 px-1">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-teal-400 shadow-sm shadow-teal-400/50" />
                  <span className="text-slate-200 font-bold">{hasCv ? L('Skor ATS CV', 'CV ATS Score') : L('Skor Profil Daftar', 'Signup Profile Score')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
                  <span className="text-slate-200 font-bold">{L('Match Role AI', 'AI Role Match')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-teal-300 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full font-bold">
                <Sparkles size={13} className="text-teal-400" />
                <span>
                  {hasCv 
                    ? L(`CV Aktif: ${cvScore}/100 ATS Score`, `Active CV: ${cvScore}/100 ATS Score`)
                    : L(`Data Pendaftaran: ${currentScore}% Match`, `Signup Data: ${currentScore}% Match`)}
                </span>
              </div>
            </div>

            {/* SVG Smooth Curved Chart Container */}
            <div className="relative p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-slate-800 backdrop-blur-xl overflow-hidden shadow-inner">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-56 sm:h-64 overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Glowing area gradient */}
                  <linearGradient id="glassGlowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.45" />
                    <stop offset="60%" stopColor="#6366f1" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                  </linearGradient>

                  {/* Line glow filter */}
                  <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Grid Horizontal Lines */}
                {[25, 50, 75, 100].map((val) => {
                  const y = svgHeight - paddingY - (val / 100) * (svgHeight - paddingY * 2);
                  return (
                    <g key={val}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="#1e293b"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 12}
                        y={y + 4}
                        fill="#64748b"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="end"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* Area Under Smooth ATS Curve */}
                <motion.path
                  d={areaATS}
                  fill="url(#glassGlowGrad)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />

                {/* Smooth Line 1: Match Score (Indigo Dashed Curve) */}
                <motion.path
                  d={smoothMatch}
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="3"
                  strokeDasharray="6 3"
                  filter="url(#glowEffect)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />

                {/* Smooth Line 2: ATS Score (Teal Solid Glow Curve) */}
                <motion.path
                  d={smoothATS}
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="3.5"
                  filter="url(#glowEffect)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                />

                {/* Floating Node Value Badges & Point Circles */}
                {pointsATS.map((p, idx) => {
                  const isHovered = hoveredNode === idx;
                  const isCur = p.isCurrent;
                  return (
                    <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredNode(idx)} onMouseLeave={() => setHoveredNode(null)}>
                      {/* Floating Node Value Tag */}
                      <rect
                        x={p.x - 18}
                        y={p.y - 28}
                        width="36"
                        height="18"
                        rx="6"
                        fill={isCur ? '#0d9488' : isHovered ? '#14b8a6' : '#0f172a'}
                        stroke={isCur ? '#5eead4' : '#2dd4bf'}
                        strokeWidth="1.5"
                      />
                      <text
                        x={p.x}
                        y={p.y - 15}
                        fill={isCur || isHovered ? '#ffffff' : '#5eead4'}
                        fontSize="9"
                        fontWeight="900"
                        textAnchor="middle"
                      >
                        {p.val}%
                      </text>

                      {/* Outer pulse ring for points */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isCur ? 14 : isHovered ? 11 : 7}
                        fill={isCur ? '#14b8a6' : '#2dd4bf'}
                        fillOpacity={isCur ? '0.45' : isHovered ? '0.35' : '0.18'}
                        className="transition-all duration-300"
                      />
                      {/* Inner core */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isCur ? 6 : isHovered ? 5 : 4}
                        fill="#ffffff"
                        stroke={isCur ? '#0d9488' : '#2dd4bf'}
                        strokeWidth="3"
                        className="transition-all duration-300"
                      />

                      {/* X-Axis Month Labels */}
                      <text
                        x={p.x}
                        y={svgHeight - 10}
                        fill={isCur ? '#5eead4' : isHovered ? '#2dd4bf' : '#94a3b8'}
                        fontSize={isCur ? '11' : '10'}
                        fontWeight={isCur ? '900' : 'bold'}
                        textAnchor="middle"
                      >
                        {p.month}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredNode !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 right-4 p-3.5 rounded-2xl bg-slate-900/95 border border-teal-500/40 text-xs shadow-2xl backdrop-blur-md space-y-1.5 max-w-xs pointer-events-none z-20"
                >
                  <div className="font-extrabold text-teal-300 flex items-center gap-1.5">
                    <Sparkles size={13} />
                    <span>{pointsATS[hoveredNode].month} - {L('Detail Analisis Real-Time', 'Real-Time Analysis Detail')}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-slate-200">
                    <span>{hasCv ? L('Skor ATS CV:', 'CV ATS Score:') : L('Skor Profil Daftar:', 'Signup Profile Score:')}</span>
                    <strong className="text-teal-400 font-black">{pointsATS[hoveredNode].val}%</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-slate-200">
                    <span>{L('Kecocokan Role:', 'Role Match:')}</span>
                    <strong className="text-indigo-400 font-black">{pointsMatch[hoveredNode].val}%</strong>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1.5 border-t border-slate-800 leading-relaxed">
                    {pointsATS[hoveredNode].note}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right: Live Diagnostics & Action Card (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between space-y-4 shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain size={14} className="text-teal-400" />
                  <span>{L('DIAGNOSTIK AI REAL-TIME', 'REAL-TIME AI DIAGNOSTICS')}</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${hasCv ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'}`}>
                  {hasCv ? L('ATS Verified', 'ATS Verified') : L('Profil Signup', 'Signup Profile')}
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400">{L('Target Peran Kandidat:', 'Candidate Target Role:')}</div>
                  <div className="text-xs font-extrabold text-teal-300">{user?.role || 'Software Engineer / Backend Dev'}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>{L('Status Evaluasi Saat Ini:', 'Current Evaluation Status:')}</span>
                    <strong className={hasCv ? 'text-emerald-400' : 'text-cyan-400'}>
                      {hasCv ? (cvScore >= 80 ? L('Lolos Screening ATS', 'ATS Passed') : L('Perlu Optimasi', 'Needs Opt')) : L('Profil Pendaftaran Aktif', 'Signup Profile Active')}
                    </strong>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    {hasCv 
                      ? L(`Format dokumen & struktur keyword memenuhi ${cvScore}% standar parsing ATS perusahaan IT.`, `Document format & keyword structure meets ${cvScore}% of IT ATS parsing standards.`)
                      : L(`Skor ${currentScore}% dihitung dari data skill & role saat pendaftaran. Upload file CV untuk Verifikasi ATS penuh!`, `Score ${currentScore}% calculated from signup skill & role data. Upload CV file for full ATS Verification!`)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400">{L('Rekomendasi Karir AI:', 'AI Career Recommendation:')}</div>
                  <div className="text-[11px] text-slate-300 leading-relaxed">
                    {hasCv 
                      ? L('Pertahankan konsistensi kata kunci teknis pada bagian Riwayat Pengalaman untuk memaksimalkan peluang panggilan interview.', 'Maintain technical keyword consistency in Experience section to maximize interview callback odds.')
                      : L('Upload CV file Anda untuk meningkatkan skor dari ' + currentScore + '% ke 90%+ dan membuka analisis ATS penuh!', 'Upload your CV file to boost score from ' + currentScore + '% to 90%+ and unlock full ATS analysis!')}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              {hasCv ? (
                <button
                  onClick={() => onNavigateTab('analysis')}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <BarChart3 size={14} />
                  <span>{L('Buka Analisis CV Lengkap', 'Open Full CV Analysis')}</span>
                </button>
              ) : (
                <button
                  onClick={onOpenUploadModal}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload size={14} />
                  <span>{L('Upload CV (Tingkatkan ke 90%+)', 'Upload CV (Boost to 90%+)')}</span>
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ── TAB CONTENT 2: REAL-TIME SKILLS MASTERY METERS ── */}
      {activeTab === 'skills' && (
        <div>
          {skillItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillItems.map((sk, idx) => {
                const Icon = sk.icon;
                const isFromLeft = idx % 2 === 0;
                return (
                  <motion.div
                    key={sk.name}
                    initial={{ opacity: 0, x: isFromLeft ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-teal-500/40 transition-all space-y-3 shadow-md group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-teal-400 group-hover:scale-110 transition-transform">
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-slate-100">{sk.name}</h4>
                            {sk.inCv && (
                              <span className="px-1.5 py-0.5 rounded bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[9px] font-black">
                                CV ATS
                              </span>
                            )}
                            {!sk.inCv && sk.inProfile && (
                              <span className="px-1.5 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[9px] font-black">
                                PROFIL
                              </span>
                            )}
                            {!sk.inCv && !sk.inProfile && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[9px] font-black">
                                GAP
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-medium">{sk.status}</span>
                            {sk.demandPct > 0 && (
                              <span className="text-[10px] text-teal-400 font-bold">• {sk.demandPct}% {L('Loker', 'Jobs')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-base font-black text-teal-300">{sk.score}%</span>
                    </div>

                    <div className="space-y-1">
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sk.score}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
                          className={`h-full rounded-full bg-gradient-to-r ${sk.color}`}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 px-4 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 space-y-3">
              <Code2 size={28} className="mx-auto text-slate-600" />
              <div className="text-xs font-bold text-slate-300">{L('Skill belum terdeteksi dari CV', 'Skills not detected from CV yet')}</div>
              <p className="text-[11px] text-slate-500">{L('Unggah CV untuk mengekstrak dan mengukur penguasaan skill Anda secara otomatis.', 'Upload a CV to automatically extract and measure your skill mastery.')}</p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB CONTENT 3: REAL-TIME MARKET COMPETITIVENESS MATRIX ── */}
      {activeTab === 'market' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketMetrics.map((m, idx) => {
            const Icon = m.icon;
            const isFromLeft = idx < 2;
            return (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, x: isFromLeft ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-4 shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{m.title}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-extrabold text-teal-300">
                    {m.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-100">{m.score}</span>
                    <span className="text-xs font-bold text-slate-500">{m.isCount ? L(' Lowongan', ' Jobs') : '/ 100'}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {L('Standar Industri:', 'Industry Standard:')} <strong className="text-slate-300">{m.target}{m.isCount ? '+' : '%'}</strong>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-teal-400">
                  <span className="truncate max-w-[150px] text-slate-400 text-[10px]">{m.detail}</span>
                  <Icon size={14} className={m.color} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* ── ANIMATED HORIZONTAL JOB CAROUSEL ── */
/* ═══════════════════════════════════════════════════════ */
function JobCarousel({ jobs, user, onNavigateTab }) {
  const { isEn, L, T } = useBilingual();
  const [selectedJob, setSelectedJob] = React.useState(null);
  const scrollRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [jobs]);

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 310, behavior: 'smooth' });
  };

  const sanitizeUrl = (url) => {
    if (!url || url.includes('rafatech.id') || url.includes('careers.rafatech')) return null;
    return url;
  };

  const handleAskAI = (job) => {
    setSelectedJob(null);
    const prompt = isEn
      ? `I'm interested in the "${job.title}" position at "${job.company}" (${job.location || 'Indonesia'}). Salary: ${job.salary || 'Competitive'}. Please provide: 1) Analysis of the key qualifications required, 2) Technical interview tips for this role, 3) Application strategy to pass ATS and HR screening!`
      : `Saya tertarik dengan lowongan "${job.title}" di "${job.company}" (${job.location || 'Indonesia'}). Gaji: ${job.salary || 'Kompetitif'}. Tolong berikan: 1) Analisis kualifikasi utama yang dibutuhkan, 2) Tips interview teknis untuk posisi ini, 3) Strategi melamar agar lolos seleksi ATS dan HR!`;
    window.dispatchEvent(new CustomEvent('ask-career-ai', { detail: { prompt, job } }));
  };

  return (
    <>
      <div className="relative group/carousel">
        {/* Left Arrow */}
        <button
          onClick={() => scrollBy(-1)}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-teal-300 flex items-center justify-center hover:bg-slate-700 transition-all shadow-lg cursor-pointer ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <ArrowRight size={14} className="rotate-180" />
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-3.5 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {jobs.map((job, i) => {
            const applyUrl = sanitizeUrl(job.apply_url);
            const source = job.source || 'Adzuna API Live';
            const matchScore = job.matchScore || job.match || 80;

            return (
              <motion.div
                key={job.id || i}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.5) }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="flex-shrink-0 w-[268px] bg-slate-950/85 border border-slate-800 hover:border-teal-500/45 rounded-2xl p-4 flex flex-col justify-between shadow-md group cursor-pointer transition-colors"
                onClick={() => setSelectedJob(job)}
              >
                {/* Match + location */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${matchScore >= 85
                      ? 'bg-teal-500/15 border-teal-500/30 text-teal-300'
                      : matchScore >= 70
                        ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                    {matchScore}% Match
                  </span>
                  <span className="text-[10px] text-slate-500 truncate max-w-[110px] text-right">
                    {T(job.location || 'Indonesia')}
                  </span>
                </div>

                {/* Title & company */}
                <h4 className="font-semibold text-sm text-slate-100 mb-0.5 group-hover:text-teal-300 transition-colors leading-snug line-clamp-2">
                  {job.title}
                </h4>
                <p className="text-[11px] text-slate-400 mb-2 truncate">{job.company}</p>

                {/* Salary */}
                <p className="text-[11px] font-semibold text-teal-300 mb-3">
                  {T(job.salary || L('Gaji Kompetitif', 'Competitive Salary'))}
                </p>

                {/* Matched skills pills */}
                {job.matched_skills && job.matched_skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {job.matched_skills.slice(0, 3).map((sk) => (
                      <span key={sk} className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-0.5">
                        <Check size={8} /> {sk}
                      </span>
                    ))}
                    {job.matched_skills.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 border border-slate-700 text-slate-400">
                        +{job.matched_skills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer: source + buttons */}
                <div
                  className="pt-2.5 border-t border-slate-800/60 flex items-center justify-between gap-2"
                  onClick={e => e.stopPropagation()}
                >
                  <span className="text-[9px] text-slate-600 font-semibold uppercase tracking-wide truncate">
                    via {T(source)}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-semibold transition-all cursor-pointer"
                    >
                      {L('Detail', 'Details')}
                    </button>
                    {applyUrl ? (
                      <a
                        href={applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 text-[10px] font-bold transition-all flex items-center gap-1"
                        onClick={e => e.stopPropagation()}
                      >
                        {L('Lamar', 'Apply')} <ExternalLink size={9} />
                      </a>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); onNavigateTab('jobs'); }}
                        className="px-2 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        {L('Cari', 'Search')}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scrollBy(1)}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-teal-300 flex items-center justify-center hover:bg-slate-700 transition-all shadow-lg cursor-pointer ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onAskAI={handleAskAI}
          sanitizeUrl={sanitizeUrl}
        />
      )}
    </>
  );
}
