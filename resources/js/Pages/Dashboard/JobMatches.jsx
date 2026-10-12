import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Search, MapPin, Briefcase, CheckCircle2, AlertCircle,
  ExternalLink, Sparkles, RefreshCw, Check, Filter,
  Building2, Globe, Clock, ShieldCheck, ArrowRight, X, ChevronDown, MessageSquare, Heart, DollarSign
} from 'lucide-react';
import JobDetailModal from '../../Components/JobDetailModal';
import { isJobSaved, toggleSaveJob, getSavedJobs } from '../../Utils/savedJobs';
import useBilingual from '../../i18n/useBilingual';

const COUNTRY_OPTIONS = [
  { code: 'id', label: 'Indonesia', labelEn: 'Indonesia', name: 'Indonesia' },
  { code: 'sg', label: 'Singapura', labelEn: 'Singapore', name: 'Singapura' },
  { code: 'my', label: 'Malaysia', labelEn: 'Malaysia', name: 'Malaysia' },
  { code: 'us', label: 'Amerika Serikat', labelEn: 'United States', name: 'USA' },
  { code: 'gb', label: 'Inggris (UK)', labelEn: 'United Kingdom', name: 'UK' },
  { code: 'au', label: 'Australia', labelEn: 'Australia', name: 'Australia' },
  { code: 'ca', label: 'Kanada', labelEn: 'Canada', name: 'Kanada' },
];

const JOB_TYPE_OPTIONS = [
  { id: 'all', label: 'Semua Jenis Pekerjaan', labelEn: 'All Job Types' },
  { id: 'full_time', label: 'Penuh Waktu (Full-Time)', labelEn: 'Full-Time' },
  { id: 'part_time', label: 'Paruh Waktu (Part-Time)', labelEn: 'Part-Time' },
  { id: 'remote', label: 'Kerja Remote (WFH)', labelEn: 'Remote (WFH)' },
  { id: 'internship', label: 'Magang (Internship)', labelEn: 'Internship' },
  { id: 'contract', label: 'Kontrak (Contract)', labelEn: 'Contract' },
];

export default function JobMatches({ jobs: initialJobs = [], user }) {
  const { isEn, L, T } = useBilingual();
  const userId = user?.id || null;
  const [keyword, setKeyword] = useState(user?.role || user?.target_role || 'Backend Developer');
  const [country, setCountry] = useState('id');
  const [location, setLocation] = useState(user?.location || '');
  const [jobType, setJobType] = useState('all');
  const [jobList, setJobList] = useState(initialJobs);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewTab, setViewTab] = useState('all');
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  // Sync keyword & location if user prop updates (e.g. from new registration)
  useEffect(() => {
    if (user?.role || user?.target_role) {
      setKeyword(user.role || user.target_role);
    }
    if (user?.location) {
      setLocation(user.location);
    }
  }, [user?.role, user?.target_role, user?.location]);

  // Sync initial jobs & user-scoped saved jobs count
  useEffect(() => {
    if (initialJobs && initialJobs.length > 0) {
      setJobList(initialJobs);
    }
    setSavedJobsCount(getSavedJobs(userId).length);
    const handleSavedChange = (e) => {
      // Only update if event is for this user or unscoped
      if (!e.detail?.userId || e.detail.userId === userId) {
        setSavedJobsCount(getSavedJobs(userId).length);
      }
    };
    window.addEventListener('saved-jobs-updated', handleSavedChange);
    return () => window.removeEventListener('saved-jobs-updated', handleSavedChange);
  }, [initialJobs, userId]);

  // Real-Time Job Search API
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setPage(1);

    try {
      const response = await axios.get('/api/dashboard/live-data', {
        params: {
          target_role: keyword,
          location: location,
          country: country,
          job_type: jobType,
          page: 1,
        },
      });

      if (response.data && response.data.jobs) {
        setJobList(response.data.jobs);
        setHasMore(response.data.jobs.length >= 4);
      }
    } catch (err) {
      console.warn('Realtime job search notice:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Load Next Batch of Jobs (Pagination / Infinite Scroll)
  const loadNextBatch = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const response = await axios.get('/api/dashboard/live-data', {
        params: {
          target_role: keyword,
          location: location,
          country: country,
          job_type: jobType,
          page: nextPage,
        },
      });

      if (response.data && response.data.jobs && response.data.jobs.length > 0) {
        setJobList((prev) => [...prev, ...response.data.jobs]);
        setPage(nextPage);
        setHasMore(response.data.jobs.length >= 4);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.warn('Load more jobs error:', err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Open external apply link safely
  const handleApplyRedirect = (job) => {
    if (!job) return;
    if (job.id && !appliedJobIds.includes(job.id)) {
      setAppliedJobIds((prev) => [...prev, job.id]);
    }
    const rawUrl = job.apply_url || job.redirect_url || job.url || job.link;
    let targetUrl = rawUrl;
    if (!targetUrl || targetUrl === '#' || targetUrl.includes('example.com') || targetUrl.includes('localhost')) {
      const query = encodeURIComponent(`${job.title || ''} ${job.company || ''} lowongan kerja`);
      targetUrl = `https://www.google.com/search?q=${query}`;
    }
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Automatically trigger AI Assistant Chat Bubble with specific job context
  const handleAskAIAboutJob = (job) => {
    setSelectedJob(null);
    const countryName = COUNTRY_OPTIONS.find(c => c.code === country)?.name || 'Indonesia';
    const prompt = isEn
      ? `Hi AI Assistant! I'm interested in the "${job.title}" position at "${job.company}" (${job.location || countryName}). Salary: ${job.salary || 'Competitive'}. Please provide an analysis of the key qualifications, technical/HR interview tips, and an application strategy for this role so I can pass the selection!`
      : `Halo AI Assistant! Saya tertarik dengan lowongan "${job.title}" di "${job.company}" (${job.location || countryName}). Gaji: ${job.salary || 'Kompetitif'}. Tolong berikan analisis kualifikasi utama, tips interview teknis/HR, dan strategi melamar untuk posisi ini agar lolos seleksi!`;
    
    // Dispatch event to ChatBubble.jsx
    window.dispatchEvent(new CustomEvent('ask-career-ai', { detail: { prompt, job } }));
  };

  return (
    <div className="space-y-6">

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── SEARCH & MULTI-FILTER HEADER (Negara, Kota, Jenis Pekerjaan) ── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#070B1D]/90 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
              <Globe className="text-teal-400" size={24} />
              <span>{L('Pencarian Lowongan Kerja Global', 'Global Job Search')}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Total <strong className="text-teal-300">{jobList.length} {L('Lowongan', 'Jobs')}</strong> {L('Terdeteksi', 'Detected')}
            </p>
          </div>
        </div>

        {/* Search & Filter Form */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            
            {/* Keyword / Posisi Input */}
            <div className="sm:col-span-4 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={L('Posisi / Keyword (contoh: Backend, React)...', 'Position / Keyword (e.g. Backend, React)...')}
                className="w-full bg-slate-900 border border-slate-800 focus:border-teal-400 rounded-2xl py-3 pl-11 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            {/* Negara Select Dropdown */}
            <div className="sm:col-span-3 relative">
              <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-teal-400 rounded-2xl py-3 pl-11 pr-8 text-xs text-slate-100 focus:outline-none transition-all appearance-none cursor-pointer"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-900 text-slate-100">
                    {isEn ? c.labelEn : c.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>

            {/* Kota / Lokasi Input */}
            <div className="sm:col-span-3 relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={L('Kota (contoh: Jakarta, Surabaya, Remote)...', 'City (e.g. Jakarta, Surabaya, Remote)...')}
                className="w-full bg-slate-900 border border-slate-800 focus:border-teal-400 rounded-2xl py-3 pl-11 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            {/* Search Action Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isSearching}
                className="shimmer-btn-primary w-full h-full py-3 text-xs font-extrabold justify-center cursor-pointer disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <RefreshCw size={14} className="animate-spin text-teal-300" />
                    <span>{L('Cari...', 'Searching...')}</span>
                  </>
                ) : (
                  <>
                    <Search size={14} />
                    <span>{L('Cari Live', 'Live Search')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Additional Filter Row (Jenis Pekerjaan & Quick Pill Location) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            {/* Jenis Pekerjaan Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Briefcase size={12} className="text-teal-400" /> {L('Jenis Kerja:', 'Job Type:')}
              </span>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="bg-slate-900/90 border border-slate-800 focus:border-teal-400 rounded-xl px-3 py-1.5 text-xs text-teal-300 font-semibold focus:outline-none cursor-pointer"
              >
                {JOB_TYPE_OPTIONS.map((jt) => (
                  <option key={jt.id} value={jt.id} className="bg-slate-900 text-slate-100">
                    {isEn ? jt.labelEn : jt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Location Pills & View Mode Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{L('Kota Populer:', 'Popular Cities:')}</span>
                {['Jakarta', 'Bandung', 'Surabaya', 'Remote', 'Singapore'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => { setLocation(city); setViewTab('all'); handleSearch(); }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      location.toLowerCase() === city.toLowerCase() && viewTab === 'all'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>

              {/* TAB SWITCHER: Semua vs Simpanan */}
              <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setViewTab('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      viewTab === 'all'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Briefcase size={12} className="text-teal-400" />
                    <span>{L('Semua Lowongan', 'All Jobs')} ({jobList.length})</span>
                  </button>
                <button
                  type="button"
                  onClick={() => setViewTab('saved')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    viewTab === 'saved'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart size={12} className={savedJobsCount > 0 ? 'fill-rose-500 text-rose-500' : ''} />
                  <span>{L('Simpanan Saya', 'My Saved')} ({savedJobsCount})</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── JOB CARDS GRID ── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {viewTab === 'saved' && savedJobsCount === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
            <Heart size={22} className="text-rose-400 fill-rose-500/30" />
          </div>
          <h4 className="font-extrabold text-base text-slate-200">{L('Belum Ada Pekerjaan Tersimpan', 'No Saved Jobs Yet')}</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {L('Klik icon Simpan pada kartu lowongan pekerjaan mana saja untuk menyimpannya di sini agar bisa dicek kembali kapan saja!', 'Click the Save icon on any job card to keep it here so you can check it again anytime!')}
          </p>
          <button
            type="button"
            onClick={() => setViewTab('all')}
            className="px-4 py-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold transition-all"
          >
            {L('Jelajahi Semua Lowongan', 'Explore All Jobs')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(viewTab === 'saved' ? getSavedJobs(userId) : jobList).map((job, idx) => {
            const saved = isJobSaved(job.id, userId);
            const matchPercentage = job.matchScore || job.match || 90;
            const matchedSkills = job.matched_skills || ['PHP', 'Laravel', 'MySQL'];
            const missingSkills = job.missing_skills || ['Docker'];

            return (
              <motion.div
                key={job.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between transition-all group hover:shadow-2xl hover:shadow-teal-500/10"
              >
                <div>
                  {/* Header Badge & Heart Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-black flex items-center gap-1">
                      <Sparkles size={11} className="text-teal-400" />
                      {matchPercentage}% Match AI
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-bold">
                        {T(job.source || 'Live API')}
                      </span>
                      {/* Heart / Bookmark Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job, userId);
                          setSavedJobsCount(getSavedJobs(userId).length);
                        }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          saved
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                            : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-rose-400'
                        }`}
                        title={saved ? L('Hapus dari Simpanan', 'Remove from Saved') : L('Simpan Pekerjaan', 'Save Job')}
                      >
                        <Heart size={14} className={saved ? 'fill-rose-500 text-rose-500' : ''} />
                      </button>
                    </div>
                  </div>

                  {/* Job Title & Company */}
                  <h4 className="font-extrabold text-base sm:text-lg text-slate-100 group-hover:text-teal-300 transition-colors line-clamp-2">
                    {job.title}
                  </h4>

                  <div className="space-y-1 my-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                      <Building2 size={13} className="text-teal-400" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-indigo-400" />
                      <span>{T(job.location)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-teal-400 font-bold">
                      <DollarSign size={13} className="text-teal-400" />
                      <span>{T(job.salary)}</span>
                    </div>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {T(job.description)}
                  </p>

                  {/* Matched Skills Chips */}
                  <div className="flex flex-wrap gap-1 mb-5">
                    {matchedSkills.slice(0, 3).map((sk) => (
                      <span key={sk} className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                        <Check size={10} /> {sk}
                      </span>
                    ))}
                    {missingSkills.slice(0, 1).map((sk) => (
                      <span key={sk} className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-semibold flex items-center gap-1">
                        <AlertCircle size={10} className="text-amber-400" /> {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-12 gap-2">
                  {/* Detail Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => setSelectedJob(job)}
                    className="col-span-4 shimmer-btn-outline justify-center py-2 text-[11px] font-bold"
                  >
                    {L('Detail', 'Details')}
                  </button>

                  {/* Ask AI Trigger Button */}
                  <button
                    type="button"
                    onClick={() => handleAskAIAboutJob(job)}
                    className="col-span-4 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 rounded-xl justify-center py-2 text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer"
                    title={L('Tanya AI Assistant tentang pekerjaan ini', 'Ask AI Assistant about this job')}
                  >
                    <Sparkles size={12} className="text-yellow-400 animate-pulse" />
                    <span>{L('Tanya AI', 'Ask AI')}</span>
                  </button>

                  {/* Apply Button - ALWAYS SAYS "Lamar" */}
                  <button
                    type="button"
                    onClick={() => handleApplyRedirect(job)}
                    className="col-span-4 shimmer-btn-primary justify-center py-2 text-[11px] font-extrabold cursor-pointer"
                  >
                    <span>{L('Lamar', 'Apply')}</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── SKELETON LOADER BATCH (10 BY 10 SCROLL TRIGGER) ── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {isLoadingMore && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 animate-pulse space-y-3">
              <div className="h-4 bg-slate-800 rounded w-1/3" />
              <div className="h-6 bg-slate-800 rounded w-3/4" />
              <div className="h-4 bg-slate-800 rounded w-1/2" />
              <div className="h-12 bg-slate-800 rounded-xl w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Load More Batch Button */}
      {hasMore && !isLoadingMore && (
        <div className="pt-6 text-center">
          <button
            type="button"
            onClick={loadNextBatch}
            className="shimmer-btn-outline px-8 py-3 text-xs font-extrabold justify-center cursor-pointer inline-flex items-center gap-2"
          >
            <span>{L('Muat 10 Lowongan Kerja Lagi...', 'Load 10 More Jobs...')}</span>
            <ChevronDown size={15} />
          </button>
        </div>
      )}

      {!hasMore && jobList.length > 0 && (
        <div className="py-6 text-center text-slate-500 text-xs font-bold">
          {L('✓ Seluruh lowongan real-time yang cocok telah ditampilkan.', '✓ All matching real-time jobs have been displayed.')}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── JOB DETAIL MODAL (WITH INDONESIAN SUMMARY & SAVE FEATURE) ── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onAskAI={handleAskAIAboutJob}
        />
      )}

    </div>
  );
}
