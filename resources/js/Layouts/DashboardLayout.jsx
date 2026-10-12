import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ChatBubble from '../Components/ChatBubble';
import Footer from '../Components/Footer';
import LanguageSwitcher from '../Components/LanguageSwitcher';
import useLanguageSync from '../Utils/useLanguageSync';
import useBilingual from '../i18n/useBilingual';
import {
  Sparkles,
  FileText,
  Briefcase,
  BarChart3,
  Zap,
  Map,
  Brain,
  Mic,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  ShieldCheck,
  Bell,
  Search,
  Settings,
  FileCheck2,
} from 'lucide-react';

export default function DashboardLayout({ children, user, activeTab, setActiveTab, totalJobs = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { isEn, L, T } = useBilingual();

  // 🌐 Sync bahasa dari DB ke i18n saat mount
  useLanguageSync();

  const tabs = [
    { id: 'overview', label: t('dashboard.tabs.overview'), icon: Brain, category: 'UTAMA' },
    { id: 'analysis', label: t('dashboard.tabs.analysis'), icon: BarChart3, category: 'UTAMA' },
    { id: 'jobs', label: `${t('dashboard.tabs.jobs')}${totalJobs > 0 ? ` (${totalJobs})` : ''}`, icon: Briefcase, category: 'KARIR' },
    { id: 'roadmap', label: t('dashboard.tabs.roadmap'), icon: Map, category: 'KARIR' },
    { id: 'cv-builder', label: t('dashboard.tabs.cvBuilder'), icon: FileText, category: 'ALAT' },
    { id: 'cover-letter', label: t('dashboard.tabs.coverLetter'), icon: FileCheck2, category: 'ALAT' },
  ];

  const handleTabClick = (tabId) => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
      if (tabId === 'analysis') {
        router.visit('/analyze-cv');
      } else {
        router.visit(`/dashboard?tab=${tabId}`);
      }
      return;
    }

    if (setActiveTab && typeof setActiveTab === 'function') {
      setActiveTab(tabId);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('careerai_auth_user_id');
      sessionStorage.removeItem('careerai_saved_jobs');
      sessionStorage.removeItem('careerai_just_registered');
    }
    router.post('/logout');
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 flex flex-col justify-between relative selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">
      
      {/* Ambient background blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[0%] left-[15%] w-[600px] h-[600px] bg-teal-500/10 rounded-full filter blur-[140px]" />
        <div className="absolute top-[40%] right-[5%] w-[550px] h-[550px] bg-indigo-500/10 rounded-full filter blur-[140px]" />
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── DESKTOP LEFT GLASS SIDEBAR (Fixed lg:flex) ── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-72 fixed inset-y-0 left-0 z-50 bg-[#070B1A]/85 backdrop-blur-2xl border-r border-slate-800/50 p-5 justify-between">
        {/* Animated Subtle Shimmer Border Line on Sidebar Right Edge */}
        <div className="shimmer-sidebar-border" />
        
        {/* Top Logo & Brand */}
        <div>
          <Link href="/" className="flex items-center gap-3 px-2 py-2 mb-8 group">
            <div className="relative w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-all">
              <img src="/assets/ayokerja-logo.png" alt="AyoKerja Logo" className="w-full h-full object-contain" style={{ transform: 'scale(2.2)' }} />
            </div>
            <div className="flex flex-col">
              <span className="shimmer-text font-black text-xl tracking-tight leading-none">
                AyoKerja
              </span>
              <span className="text-[9px] font-bold text-teal-400 tracking-widest uppercase mt-1">
                Workspace AI
              </span>
            </div>
          </Link>

          {/* Navigation Links with Category Headers */}
          <nav className="space-y-6">
            {['UTAMA', 'KARIR', 'ALAT'].map((cat) => {
              const catTabs = tabs.filter((tab) => tab.category === cat);
              if (catTabs.length === 0) return null;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 mb-2">
                    {t(`dashboard.categories.${cat}`)}
                  </div>
                  {catTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        id={`tour-tab-${tab.id}`}
                        onClick={() => handleTabClick(tab.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative group ${
                          isActive
                            ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-teal-300 border border-teal-500/40 shadow-lg shadow-teal-500/10'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={16} className={isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'} />
                          <span>{tab.label}</span>
                        </div>
                        {isActive && (
                          <motion.div
                            layoutId="activeSidebarGlow"
                            className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-md shadow-teal-400"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Card in Sidebar */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2.5 overflow-hidden">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center font-extrabold text-xs text-white shrink-0 shadow-md">
                {user?.avatar || 'RD'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-slate-100 truncate" title={user?.name || 'Rizki Dev'}>
                  {user?.name || 'Rizki Dev'}
                </div>
                <div className="text-[10px] text-teal-400 truncate" title={user?.role ? `${user.role}${user?.level ? ` / ${T(user.level)}` : ''}` : 'Junior Backend'}>
                  {user?.role ? `${user.role}${user?.level ? ` / ${T(user.level)}` : ''}` : 'Junior Backend'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title={t('nav.logout')}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-all cursor-pointer shrink-0"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

      </aside>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── TOP APP BAR (For Mobile & Desktop Content Offset) ── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <header className="lg:pl-72 fixed top-0 left-0 right-0 z-40 bg-[#050816]/90 backdrop-blur-2xl border-b border-slate-800/50">
        {/* Animated Subtle Shimmer Border Line on Header Bottom Edge */}
        <div className="shimmer-header-border" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Mobile Logo & Brand */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/assets/ayokerja-logo.png" alt="AyoKerja Logo" className="w-full h-full object-contain" style={{ transform: 'scale(2.2)' }} />
              </div>
              <span className="shimmer-text font-black text-lg">AyoKerja</span>
            </Link>
          </div>

          {/* Desktop Title & Status */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">{t('nav.workspace')} /</span>
            <span className="text-xs font-extrabold text-teal-300 uppercase tracking-wider">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </span>
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse ml-2" />
            <span className="text-[11px] text-slate-500">{t('dashboard.aiEngineActive')}</span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <ShieldCheck size={14} className="text-teal-400" />
              <span>{t('dashboard.encryptedSSL')}</span>
            </div>

            {/* 🌐 Language Switcher */}
            <LanguageSwitcher compact={true} />

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed top-16 inset-x-0 z-40 bg-[#070B1A]/98 backdrop-blur-3xl border-b border-slate-800 p-6 space-y-4"
          >
            <div className="space-y-2">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      handleTabClick(t.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold ${
                      isActive ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} />
                      <span>{t.label}</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-200">{user?.name}</div>
              <div className="flex items-center gap-2">
                <LanguageSwitcher compact={true} />
                <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-bold">
                  {t('nav.logout')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── MAIN CONTENT AREA (Offset lg:pl-72 for Sidebar) ── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <main className="lg:pl-72 flex-grow pt-20 pb-28 lg:pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Active Tab View Component */}
          {children}

        </div>
      </main>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── MOBILE BOTTOM FLOATING GLASS DOCK (Fixed lg:hidden) ── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-50">
        <div className="bg-[#070B1A]/95 border border-slate-700/80 backdrop-blur-3xl rounded-2xl p-2 shadow-2xl shadow-black/80 flex items-center justify-around">
          {[
            { id: 'overview', label: t('dashboard.tabs.overview'), icon: Brain },
            { id: 'jobs', label: t('dashboard.tabs.jobs'), icon: Briefcase },
            { id: 'roadmap', label: t('dashboard.tabs.roadmap'), icon: Map },
            { id: 'cv-builder', label: t('dashboard.tabs.cvBuilder'), icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer relative ${
                  isActive ? 'text-teal-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-teal-400' : 'text-slate-500'} />
                <span className="text-[10px]">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveDock"
                    className="absolute -bottom-1 w-4 h-1 rounded-full bg-teal-400 shadow-md shadow-teal-400"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating AI Assistant Chatbot */}
      <ChatBubble />

      {/* Footer */}
      <div className="lg:pl-72">
        <Footer compact={true} />
      </div>

    </div>
  );
}
