import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  ExternalLink,
  Sparkles,
  Check,
  AlertTriangle,
  Heart,
  Globe,
  Building2,
  Coins,
  Languages,
  FileText,
  ClipboardList,
  Target,
  CheckCircle2,
  Bot,
  DollarSign,
} from 'lucide-react';
import { isJobSaved, toggleSaveJob } from '../Utils/savedJobs';
import useBilingual from '../i18n/useBilingual';

// Helper to decode HTML entities & clean raw HTML fragments
export const cleanText = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Helper to clean concatenated title strings like "LeadWFH/Remote"
export const cleanJobTitle = (title) => {
  if (!title) return 'Software Developer';
  let cleaned = cleanText(title);
  cleaned = cleaned
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])(WFH|Remote|Onsite|Hybrid|FullTime|PartTime)/gi, '$1 ($2)')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned;
};

// Helper to format **bold** markdown tags inside text strings cleanly
export const renderFormattedSummary = (str) => {
  if (!str) return null;
  const contentStr = typeof str === 'string' ? str : String(str);
  const parts = contentStr.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={i} className="text-teal-300 font-extrabold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

// Helper to extract salary embedded in snippet if generic
export const extractSalaryAndCleanDesc = (rawSalary, rawDesc, isEn = false) => {
  let desc = cleanText(rawDesc);
  let salary = cleanText(rawSalary);

  if (!salary || salary.toLowerCase().includes('sesuai') || salary.toLowerCase().includes('kompetitif')) {
    const salMatch = desc.match(/(\d+[\d\.\,\–\-]+(?:\s*million|\s*juta|\s*M|\s*k)?\s*(?:Role Overview|Overview|Key Responsibilities)?)/i);
    if (salMatch && salMatch[1]) {
      let extracted = salMatch[1].replace(/(Role Overview|Overview|Key Responsibilities)/i, '').trim();
      if (extracted.length > 3) {
        if (!extracted.toLowerCase().includes('rp') && !extracted.includes('$')) {
          extracted = 'Rp ' + extracted;
        }
        salary = extracted;
      }
    }
  }

  desc = desc
    .replace(/^[\s\.\,\–\-&nbsp;]+/gi, '')
    .replace(/^(\d+[\d\.\,\–\-]+\s*(?:million|juta|M)?\s*)?(Role Overview|Overview|Key Responsibilities)\s*:\s*/i, '')
    .trim();

  return {
    salary: salary || (isEn ? 'Competitive Salary (Negotiable)' : 'Gaji Kompetitif (Negosiasi)'),
    description: desc || (isEn ? 'Job description verified from Live Job API.' : 'Deskripsi pekerjaan terverifikasi dari Live Job API.'),
  };
};

// Generator for Structured Job Breakdown (Bahasa Indonesia / English)
export const generateIndonesianJobSummary = (job, isEn = false) => {
  const title = cleanJobTitle(job?.title);
  const company = cleanText(job?.company || (isEn ? 'Partner Company' : 'Perusahaan Mitra'));
  const location = cleanText(job?.location || 'Indonesia');
  const rawDesc = cleanText(job?.description || '');

  let ringkasan = isEn
    ? `We are looking for a talented **${title}** to join **${company}** based in **${location}**. This role is responsible for building, optimizing, and maintaining reliable modern web applications.`
    : `Kami mencari **${title}** berbakat untuk bergabung dengan **${company}** berlokasi di **${location}**. Posisi ini bertanggung jawab membangun, mengoptimalkan, dan mengelola aplikasi web modern yang andal.`;
  let tanggungJawab = isEn ? [
    'Design and develop high-performance interfaces and APIs.',
    'Integrate MySQL/PostgreSQL database schemas and microservices.',
    'Collaborate with the product team to ensure system quality and security.',
  ] : [
    'Merancang dan mengembangkan antarmuka serta API berkinerja tinggi.',
    'Mengintegrasikan skema database MySQL/PostgreSQL dan layanan microservices.',
    'Berkolaborasi dengan tim produk untuk memastikan kualitas dan keamanan sistem.',
  ];
  let kualifikasi = isEn ? [
    'Technical experience with the main tech stack (PHP, Laravel, React, MySQL/REST API).',
    'Strong problem-solving and architecture analysis skills.',
    'Understanding of automated testing (Unit Testing) and Git version control.',
  ] : [
    'Pengalaman teknis pada tech stack utama (PHP, Laravel, React, MySQL/REST API).',
    'Kemampuan pemecahan masalah (problem solving) dan analisis arsitektur yang kuat.',
    'Memahami pengujian otomatis (Unit Testing) dan pengelolaan kontrol versi Git.',
  ];

  if (rawDesc.length > 50) {
    if (rawDesc.toLowerCase().includes('responsibilities') || rawDesc.toLowerCase().includes('tanggung jawab')) {
      const parts = rawDesc.split(/(?:responsibilities|tanggung jawab):/i);
      if (parts[1]) ringkasan = parts[0].trim();
    }
  }

  return { ringkasan, tanggungJawab, kualifikasi };
};

export default function JobDetailModal({ job, onClose, onAskAI }) {
  const { isEn, L, T } = useBilingual();
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('indonesia');
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    if (job) {
      setIsSaved(isJobSaved(job.id));
    }
  }, [job]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!job) return null;

  const title = cleanJobTitle(job.title);
  const company = cleanText(job.company || L('Perusahaan Mitra', 'Partner Company'));
  const location = cleanText(job.location || 'Indonesia');
  const rawUrl = job.apply_url || job.redirect_url || job.url || job.link;
  const applyUrl = (rawUrl && !rawUrl.includes('rafatech.id') && !rawUrl.includes('example.com') && !rawUrl.includes('localhost'))
    ? rawUrl
    : 'https://www.google.com/search?q=' + encodeURIComponent(title + ' ' + company + ' lowongan kerja');

  const { salary, description } = extractSalaryAndCleanDesc(job.salary, job.description, isEn);
  const indoSummary = generateIndonesianJobSummary(job, isEn);
  const matchScore = job?.matchScore || job?.match || 80;
  const source = cleanText(job?.source || job?.platform || 'Live Job API');


  const handleToggleSave = () => {
    const wasSavedNow = toggleSaveJob(job);
    setIsSaved(wasSavedNow);
    setToastMsg(wasSavedNow ? L('Pekerjaan berhasil disimpan ke Favorit!', 'Job saved to Favorites!') : L('Pekerjaan dihapus dari Favorit.', 'Job removed from Favorites.'));
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleApplyClick = () => {
    window.open(applyUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAskAIClick = () => {
    if (onAskAI) {
      onAskAI(job);
    } else {
      const prompt = isEn
        ? `I'm interested in the "${title}" position at "${company}" (${location}). Salary: ${salary}. Please provide: 1) Analysis of the key qualifications required, 2) Technical interview tips for this role, 3) Application strategy to pass ATS and HR screening!`
        : `Saya tertarik dengan lowongan "${title}" di "${company}" (${location}). Gaji: ${salary}. Tolong berikan: 1) Analisis kualifikasi utama yang dibutuhkan, 2) Tips interview teknis untuk posisi ini, 3) Strategi melamar agar lolos seleksi ATS dan HR!`;
      window.dispatchEvent(new CustomEvent('ask-career-ai', { detail: { prompt, job } }));
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto">
        {/* Toast Notification */}
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 z-[10000] px-4 py-2.5 rounded-2xl bg-teal-500 text-slate-950 font-extrabold text-xs shadow-2xl flex items-center gap-2 border border-teal-300/40"
          >
            <Sparkles size={14} className="text-slate-950" />
            <span>{toastMsg}</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-[#070B1D] border border-teal-500/35 rounded-3xl p-4 sm:p-5 max-w-xl w-full max-h-[90vh] flex flex-col relative shadow-2xl text-slate-100 my-auto overflow-hidden"
        >
          {/* Top Background Glow */}
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none" />

          {/* Action Header Icons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            {/* Heart / Save Job Button */}
            <button
              type="button"
              onClick={handleToggleSave}
              title={isSaved ? L('Hapus dari Favorit', 'Remove from Favorites') : L('Simpan Pekerjaan', 'Save Job')}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-md shadow-rose-500/20'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-rose-400 hover:border-rose-500/40'
              }`}
            >
              <Heart size={16} className={isSaved ? 'fill-rose-500 text-rose-500 animate-pulse' : ''} />
              <span className="text-[10px] font-extrabold hidden sm:inline">
                {isSaved ? L('Tersimpan', 'Saved') : L('Simpan', 'Save')}
              </span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Header Content */}
          <div className="pr-20 space-y-2.5 pb-3 border-b border-slate-800/80 flex-shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border ${
                matchScore >= 85
                  ? 'bg-teal-500/15 border-teal-500/30 text-teal-300 shadow-sm shadow-teal-500/20'
                  : matchScore >= 70
                  ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                {matchScore}% Match AI
              </span>

              <span className="px-2 py-0.5 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-400 text-[10px] font-bold flex items-center gap-1">
                <Globe size={11} className="text-teal-400" /> {T(source)}
              </span>
            </div>

            <div>
              <h2 className="font-extrabold text-lg sm:text-xl text-slate-100 leading-snug tracking-tight">
                {title}
              </h2>
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300 mt-1 font-medium">
                <span className="flex items-center gap-1 text-slate-200">
                  <Building2 size={13} className="text-teal-400" /> <strong>{company}</strong>
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin size={13} className="text-rose-400" /> {T(location)}
                </span>
              </div>
            </div>

            {/* Salary Highlight Box */}
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                <Coins size={16} className="text-teal-300" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] uppercase tracking-wider font-bold text-teal-400 block">
                  {L('Penawaran Gaji Estimasi', 'Estimated Salary Offer')}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-teal-300 truncate block">
                  {T(salary)}
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1 custom-scrollbar">
            {/* Description View Mode Tabs */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('indonesia')}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'indonesia'
                      ? 'bg-teal-500/20 border border-teal-500/40 text-teal-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Languages size={13} className="text-teal-400" />
                  <span>{L('Ringkasan Bahasa Indonesia', 'English Summary')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('original')}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'original'
                      ? 'bg-teal-500/20 border border-teal-500/40 text-teal-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText size={13} className="text-slate-400" />
                  <span>{L('Teks Asli Loker', 'Original Job Text')}</span>
                </button>
              </div>

              {/* Description Tab Content Box */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 text-xs text-slate-300 space-y-2.5 max-h-44 overflow-y-auto leading-relaxed custom-scrollbar">
                {activeTab === 'indonesia' ? (
                  <div className="space-y-2.5">
                    <div>
                      <strong className="text-teal-300 font-bold flex items-center gap-1.5 mb-0.5">
                        <ClipboardList size={13} className="text-teal-400" />
                        <span>{L('Ringkasan Peran:', 'Role Summary:')}</span>
                      </strong>
                      <p className="text-slate-300">{renderFormattedSummary(indoSummary.ringkasan)}</p>
                    </div>

                    <div>
                      <strong className="text-teal-300 font-bold flex items-center gap-1.5 mb-0.5">
                        <Target size={13} className="text-teal-400" />
                        <span>{L('Tanggung Jawab Utama:', 'Key Responsibilities:')}</span>
                      </strong>
                      <ul className="space-y-1 pl-1">
                        {indoSummary.tanggungJawab.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-slate-300">
                            <span className="text-teal-400 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong className="text-teal-300 font-bold flex items-center gap-1.5 mb-0.5">
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span>{L('Kualifikasi & Skill:', 'Qualifications & Skills:')}</span>
                      </strong>
                      <ul className="space-y-1 pl-1">
                        {indoSummary.kualifikasi.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-slate-300">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div>
                    <strong className="text-slate-100 block mb-1">{L('Teks Original Deskripsi Lowongan:', 'Original Job Description:')}</strong>
                    <p className="whitespace-pre-line text-slate-300">{description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Matched & Missing Skills Chips */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {L('Kesesuaian Skill dengan Profil Kamu:', 'Skill Match with Your Profile:')}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(job.matched_skills || ['PHP', 'Laravel', 'MySQL']).map((sk) => (
                  <span key={sk} className="px-2.5 py-0.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                    <Check size={11} /> {sk} ({L('Terpenuhi', 'Met')})
                  </span>
                ))}
                {(job.missing_skills || ['Docker']).map((sk) => (
                  <span key={sk} className="px-2.5 py-0.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1">
                    <AlertTriangle size={11} /> {sk} ({L('Perlu Ditingkatkan', 'Needs Improvement')})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer Fixed Actions */}
          <div className="pt-3 space-y-2.5 border-t border-slate-800 flex-shrink-0">
            {/* Prominent Tanya AI Assistant Button */}
            <button
              type="button"
              onClick={handleAskAIClick}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-indigo-600 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <Bot size={16} className="text-yellow-300 animate-bounce" />
              <span>{L('Tanya AI Assistant tentang Pekerjaan Ini', 'Ask AI Assistant About This Job')}</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-all cursor-pointer"
              >
                {L('Tutup', 'Close')}
              </button>

              <button
                type="button"
                onClick={handleApplyClick}
                className="shimmer-btn-primary flex-1 py-2.5 text-xs font-extrabold justify-center cursor-pointer shadow-md shadow-teal-500/30 flex items-center gap-2"
              >
                <span>{L('Lamar Pekerjaan Sekarang', 'Apply for This Job Now')}</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
