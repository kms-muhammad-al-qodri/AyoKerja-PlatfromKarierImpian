import React, { useState, useEffect, useCallback } from 'react';
import { usePage, Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  RefreshCw, Sparkles, Settings, CheckCircle2,
  User, Briefcase, GraduationCap, MapPin, BookOpen, X
} from 'lucide-react';
import DashboardLayout from '../Layouts/DashboardLayout';
import Overview from './Dashboard/Overview';
import CvAnalysis from './Dashboard/CvAnalysis';
import JobMatches from './Dashboard/JobMatches';
import CareerRoadmap from './Dashboard/CareerRoadmap';
import CvBuilder from './Dashboard/CvBuilder';
import CoverLetterBuilder from './Dashboard/CoverLetterBuilder';
import SkeletonLoader from '../Components/SkeletonLoader';
import OnboardingModal from '../Components/OnboardingModal';
import FullscreenLoader from '../Components/FullscreenLoader';
import WelcomeTutorialModal from '../Components/WelcomeTutorialModal';

export default function Dashboard(props) {
  const { url, props: pageProps } = usePage();
  const authUser = pageProps.auth?.user || props?.user || null;
  const flash = pageProps.flash || props?.flash || {};
  const { t, i18n } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingSubmessage, setLoadingSubmessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  // Onboarding & Welcome Modal & Toast state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [welcomeToast, setWelcomeToast] = useState(null);

  // User state — ambil dari data register user
  const [userState, setUserState] = useState({
    id: authUser?.id || null,
    name: authUser?.name || t('common.loading', 'Loading...').replace('...',''),
    email: authUser?.email || '',
    role: authUser?.target_role || authUser?.role || 'Software Engineer',
    level: authUser?.experience_level || authUser?.level || 'Junior Level',
    education: authUser?.education || t('overview.notFilled', 'Not filled'),
    skills_list: authUser?.skills_list || authUser?.skills || '',
    location: authUser?.location || '',
    work_mode: authUser?.work_mode || '',
    avatar: authUser?.name ? authUser.name.substring(0, 2).toUpperCase() : 'AI',
    onboarding_completed: Boolean(authUser?.onboarding_completed),
  });

  // Track active authenticated user for scoped storage
  useEffect(() => {
    if (typeof window !== 'undefined' && authUser?.id) {
      sessionStorage.setItem('careerai_auth_user_id', String(authUser.id));
      if (sessionStorage.getItem('careerai_just_registered') === 'true') {
        localStorage.removeItem(`careerai_saved_jobs_user_${authUser.id}`);
        localStorage.removeItem('careerai_saved_jobs');
      }
    }
  }, [authUser?.id]);

  useEffect(() => {
    // If user has already agreed/closed the welcome guide, do NOT auto-open it!
    const hasAgreed = typeof window !== 'undefined' && (
      localStorage.getItem('careerai_welcome_agreed') === 'true' ||
      sessionStorage.getItem('careerai_welcome_agreed') === 'true'
    );
    if (hasAgreed) {
      return;
    }

    const justRegistered = typeof window !== 'undefined' && sessionStorage.getItem('careerai_just_registered');
    const isNewUser = flash?.is_new_user || Boolean(flash?.welcome);

    // Only show welcome modal for brand new registrations, not on tab switches or return visits
    if (justRegistered || isNewUser) {
      const isEn = (i18n.resolvedLanguage || i18n.language || 'id').startsWith('en');
      const msg = isEn
        ? `Welcome to AyoKerja, ${userState.name}! Your account has been registered. AI is ready to guide your career.`
        : (flash?.welcome || `Selamat datang di AyoKerja, ${userState.name}! Akun Anda berhasil terdaftar. AI siap membimbing karir Anda.`);
      setWelcomeToast({
        title: isEn ? `Welcome to AyoKerja, ${userState.name}!` : `Selamat Datang di AyoKerja, ${userState.name}!`,
        message: msg,
      });

      // Clear the one-time registration session flag so it won't fire again
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('careerai_just_registered');
      }

      const timer = setTimeout(() => {
        // Double check hasAgreed right before opening
        const alreadyDone = typeof window !== 'undefined' && (
          localStorage.getItem('careerai_welcome_agreed') === 'true' ||
          sessionStorage.getItem('careerai_welcome_agreed') === 'true'
        );
        if (!alreadyDone) {
          setIsWelcomeOpen(true);
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [flash, userState.name]);

  // Live job & stats data
  const [jobsData, setJobsData] = useState(props?.jobs || []);
  const [statsData, setStatsData] = useState(props?.stats || {
    cvScore: null,
    careerMatch: 0,
    skillProgress: 0,
    recommendedJobs: props?.jobs ? props.jobs.length : 0,
    hasCv: false,
  });

  const TAB_SUBMESSAGES = {
    overview: t('overview.loadingMsg', 'Preparing AI Career Overview...'),
    analysis: t('cvAnalysis.loadingMsg', 'Analyzing CV & ATS Score...'),
    jobs: t('jobs.loadingMsg', 'Finding Jobs Based on Your Profile...'),
    roadmap: t('roadmap.loadingMsg', 'Building AI Career Roadmap...'),
    'cv-builder': t('cvBuilder.loadingMsg', 'Loading Harvard ATS CV Builder...'),
    'cover-letter': t('coverLetter.loadingMsg', 'Loading AI Cover Letter Builder...'),
  };

  const determineInitialTab = () => {
    if (props?.initialTab) return props.initialTab;
    if (url.includes('/cv-builder')) return 'cv-builder';
    if (url.includes('/cover-letter') || url.includes('tab=cover-letter')) return 'cover-letter';
    if (url.includes('tab=jobs')) return 'jobs';
    if (url.includes('tab=roadmap')) return 'roadmap';
    if (url.includes('tab=analysis')) return 'analysis';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(() => determineInitialTab());

  const handleTabSwitch = (newTab) => {
    if (newTab === activeTab) return;
    const submsg = TAB_SUBMESSAGES[newTab] || t('common.loading', 'Loading...');
    setLoadingSubmessage(submsg);
    setIsLoading(true);
    setActiveTab(newTab);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Live refresh data dari API — bawa user profile sebagai parameter
  const fetchLiveData = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const response = await axios.get('/api/dashboard/live-data', {
        params: {
          target_role: userState.role,
          skills: userState.skills_list,
          level: userState.level,
          location: userState.location,
        }
      });
      if (response.data && response.data.success) {
        if (response.data.jobs) setJobsData(response.data.jobs);
        if (response.data.stats) setStatsData(response.data.stats);
      }
    } catch (err) {
      console.warn('Live API sync notice:', err);
    } finally {
      if (!silent) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, [userState.role, userState.skills_list, userState.level, userState.location]);

  // Auto-sync setiap 30 detik (silent)
  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(() => {
      fetchLiveData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [autoSync, fetchLiveData]);

  const handleOnboardingComplete = (data) => {
    if (data.user) {
      setUserState(prev => ({
        ...prev,
        role: data.user.role || prev.role,
        level: data.user.level || prev.level,
        education: data.user.education || prev.education,
        skills_list: data.user.skills_list || prev.skills_list,
        location: data.user.location || prev.location,
        work_mode: data.user.work_mode || prev.work_mode,
        career_goal: data.user.career_goal || prev.career_goal,
        onboarding_completed: true,
      }));
    }
    if (data.jobs) setJobsData(data.jobs);
    if (data.stats) setStatsData(data.stats);
    setIsOnboardingOpen(false);
  };

  // Profile summary pills — tampilkan info dari register
  const notFilledText = t('overview.notFilled', 'Not filled');
  const profilePills = [
    userState.role && { icon: Briefcase, label: userState.role },
    userState.level && { icon: CheckCircle2, label: userState.level },
    userState.education && userState.education !== 'Belum diisi' && userState.education !== notFilledText && { icon: GraduationCap, label: userState.education },
    userState.location && { icon: MapPin, label: userState.location },
  ].filter(Boolean);

  return (
    <DashboardLayout
      user={userState}
      activeTab={activeTab}
      setActiveTab={handleTabSwitch}
      totalJobs={jobsData.length}
    >
      <Head title="Dashboard AI" />

      {/* Fullscreen Loader on Tab Transitions */}
      <FullscreenLoader
        show={isLoading}
        message="Loading..."
        submessage={loadingSubmessage}
      />

      {/* Welcome & App Procedures Tutorial Modal */}
      <WelcomeTutorialModal
        isOpen={isWelcomeOpen}
        onClose={() => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('careerai_welcome_agreed', 'true');
            sessionStorage.setItem('careerai_welcome_agreed', 'true');
            sessionStorage.removeItem('careerai_just_registered');
          }
          setIsWelcomeOpen(false);
          setWelcomeToast(null);
        }}
        userName={userState.name}
      />

      {/* Onboarding / Settings Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        user={userState}
        onOnboardingComplete={handleOnboardingComplete}
      />

      {/* ── WELCOME TOAST NOTIFICATION BANNER FOR NEW USER / REGISTRATION ── */}
      <AnimatePresence>
        {welcomeToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-teal-500/20 via-indigo-500/20 to-purple-500/20 border border-teal-400/40 shadow-[0_0_35px_rgba(45,212,191,0.22)] flex items-center justify-between gap-4 backdrop-blur-xl relative overflow-hidden z-20"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 via-indigo-400 to-emerald-400 animate-[shimmer_2s_infinite]" />
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 flex-shrink-0">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-extrabold text-slate-100 flex items-center gap-2 flex-wrap">
                  <span>🎉 {welcomeToast.title}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-[10px] text-teal-300 font-extrabold uppercase tracking-wider">
                    {t('dashboard.registrationSuccess', 'Registration Successful')}
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {welcomeToast.message}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsWelcomeOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-teal-500/25 hover:bg-teal-500/40 border border-teal-400/50 text-teal-200 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-md shadow-teal-500/20"
              >
                <BookOpen size={13} className="text-teal-300" />
                <span>{t('dashboard.appGuide', 'App Guide')}</span>
              </button>
              <button
                onClick={() => setWelcomeToast(null)}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer border border-slate-700/60"
                title="Tutup Notifikasi"
              >
                <X size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PROFILE & ACTION BAR ── */}
      <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

        {/* Profil user dari register */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-white text-[10px] font-extrabold flex-shrink-0">
              {userState.avatar}
            </div>
            <span className="text-sm font-bold text-slate-200">{userState.name}</span>
          </div>
          {profilePills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {profilePills.map((pill, i) => {
                const PillIcon = pill.icon;
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/70 text-[10px] font-semibold text-slate-300"
                  >
                    <PillIcon size={10} className="text-teal-400 flex-shrink-0" />
                    {pill.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-end">
          <Link
            href="/analyze-cv"
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500/15 to-indigo-500/15 border border-teal-500/30 hover:border-teal-400/50 text-teal-300 text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <Sparkles size={13} className="text-teal-400" />
            <span>{t('cvAnalysis.title', 'CV Analysis')}</span>
          </Link>

          <button
            onClick={() => setIsWelcomeOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <BookOpen size={13} className="text-teal-400" />
            <span>{t('dashboard.appGuide', 'App Guide')}</span>
          </button>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500/20 to-indigo-500/20 border border-teal-500/40 hover:border-teal-400 text-teal-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-md shadow-teal-500/10"
          >
            <RefreshCw size={13} className={`text-teal-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{t('dashboard.refreshData', 'Refresh Data & AI Analysis')}</span>
          </button>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Settings size={13} className="text-slate-400" />
            <span>{t('settings.title', 'Settings')}</span>
          </button>
        </div>
      </div>

      {/* Skeleton Loading State or Active Tab Content */}
      {isLoading ? (
        <SkeletonLoader type={activeTab === 'jobs' ? 'jobs' : activeTab === 'analysis' ? 'analysis' : activeTab === 'roadmap' ? 'roadmap' : 'overview'} />
      ) : (
        <>
          {activeTab === 'overview' && (
            <Overview
              onNavigateTab={handleTabSwitch}
              jobs={jobsData}
              stats={statsData}
              user={userState}
              isRefreshing={isRefreshing}
            />
          )}
          {activeTab === 'analysis' && <CvAnalysis stats={statsData} user={userState} />}
          {activeTab === 'jobs' && <JobMatches jobs={jobsData} user={userState} />}
          {activeTab === 'roadmap' && <CareerRoadmap stats={statsData} user={userState} jobs={jobsData} />}
          {activeTab === 'cv-builder' && <CvBuilder user={userState} stats={statsData} />}
          {activeTab === 'cover-letter' && <CoverLetterBuilder user={userState} stats={statsData} />}
        </>
      )}
    </DashboardLayout>
  );
}
