import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Sparkles, GraduationCap, Briefcase, Zap, CheckCircle2,
  ArrowRight, ArrowLeft, Check, ShieldCheck, Cpu, Star, Rocket, AlertTriangle,
  MapPin, Search, ChevronDown, ChevronUp, Compass, X, Plus, Layers, Target, Code, Palette, Smartphone, BarChart3, Megaphone, PenTool, DollarSign, Activity, Globe, Users, Heart,
  Sprout, BookOpen, Flame, Gem, Shuffle, RefreshCw, Award, School, Building2, Sliders, Calendar, TrendingUp, CheckCheck
} from 'lucide-react';

const INDONESIA_CITIES = [
  'Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara',
  'Bandung, Jawa Barat', 'Surabaya, Jawa Timur', 'Medan, Sumatera Utara',
  'Makassar, Sulawesi Selatan', 'Semarang, Jawa Tengah', 'Yogyakarta, DIY',
  'Depok, Jawa Barat', 'Tangerang, Banten', 'Tangerang Selatan, Banten',
  'Bekasi, Jawa Barat', 'Bogor, Jawa Barat', 'Palembang, Sumatera Selatan',
  'Bali / Denpasar', 'Batam, Kepulauan Riau', 'Pekanbaru, Riau',
  'Balikpapan, Kalimantan Timur', 'Banjarmasin, Kalimantan Selatan',
  'Malang, Jawa Timur', 'Solo / Surakarta, Jawa Tengah', 'Samarinda, Kalimantan Timur',
  'Pontianak, Kalimantan Barat', 'Manado, Sulawesi Utara', 'Aceh / Banda Aceh',
  'Padang, Sumatera Barat', 'Jambi, Jambi', 'Kupang, Nusa Tenggara Timur',
  'Ambon, Maluku', 'Jayapura, Papua', 'Remote / Full Remote',
];

const CAREER_LEVEL_CONFIG = [
  {
    id: 'Fresh Graduate',
    title: 'Fresh Graduate',
    badge: '0-1 Thn',
    category: 'Entry Level',
    desc: 'Baru lulus, berfokus pada portofolio baru, skripsi/tugas akhir, & sertifikasi.',
    Icon: Sprout,
    color: '#10B981',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderActive: 'border-emerald-400',
    tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    aiTip: 'AI mengutamakan portofolio proyek hands-on, magang, & sertifikasi agar lolos screening awal ATS.',
  },
  {
    id: 'Mahasiswa Aktif',
    title: 'Mahasiswa Aktif',
    badge: 'Kampus / Siswa',
    category: 'Internship',
    desc: 'Sedang menempuh pendidikan, mencari peluang magang (intern) atau part-time.',
    Icon: BookOpen,
    color: '#06B6D4',
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    borderActive: 'border-cyan-400',
    tagBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    aiTip: 'AI menyaring lowongan magang bersertifikat dan posisi remote fleksibel sesuai jadwal kuliah.',
  },
  {
    id: 'Junior Level (0-2 Thn)',
    title: 'Junior Level',
    badge: '0-2 Thn',
    category: 'Early Pro',
    desc: 'Memiliki fondasi dasar industri, siap akselerasi skill dan berkontribusi tim.',
    Icon: Zap,
    color: '#F59E0B',
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    borderActive: 'border-amber-400',
    tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    aiTip: 'AI mencocokkan lowongan junior dengan program mentoring terbaik dan jalur promosi cepat.',
  },
  {
    id: 'Mid-Level (2-5 Thn)',
    title: 'Mid-Level',
    badge: '2-5 Thn',
    category: 'Autonomous',
    desc: 'Mampu mengeksekusi proyek end-to-end secara mandiri dan optimasi fitur.',
    Icon: Flame,
    color: '#F97316',
    gradient: 'from-orange-500/20 via-rose-500/10 to-transparent',
    borderActive: 'border-orange-400',
    tagBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    aiTip: 'AI memaksimalkan filter salary benchmark menengah-atas dan optimasi spesialisasi teknologi.',
  },
  {
    id: 'Senior Level (5+ Thn)',
    title: 'Senior Level',
    badge: '5+ Thn',
    category: 'Lead & Expert',
    desc: 'Arsitektur sistem skala besar, kepemimpinan tim teknis, & strategi solusi.',
    Icon: Gem,
    color: '#8B5CF6',
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    borderActive: 'border-purple-400',
    tagBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    aiTip: 'AI menonjolkan rekam jejak arsitektur sistem, leadership, dan strategi bisnis untuk posisi eksekutif.',
  },
  {
    id: 'Career Switcher',
    title: 'Career Switcher',
    badge: 'Lintas Jalur',
    category: 'Transition',
    desc: 'Beralih ke ranah baru dengan bekal kedewasaan profesional & transferable skills.',
    Icon: Shuffle,
    color: '#EC4899',
    gradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    borderActive: 'border-pink-400',
    tagBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    aiTip: 'AI memetakan keahlian transferable dan menyusun roadmap bridging skills agar cepat diakui.',
  },
  {
    id: 'Freelancer / Konsultan',
    title: 'Freelancer / Mandiri',
    badge: 'Independen',
    category: 'Contractor',
    desc: 'Bekerja berbasis proyek dinamis, portofolio beragam klien, jam fleksibel.',
    Icon: Globe,
    color: '#14B8A6',
    gradient: 'from-teal-500/20 via-cyan-500/10 to-transparent',
    borderActive: 'border-teal-400',
    tagBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    aiTip: 'AI mengutamakan lowongan remote contract, platform freelance global, dan tarif hourly kompetitif.',
  },
  {
    id: 'Kembali Bekerja',
    title: 'Kembali Bekerja',
    badge: 'Re-Entry',
    category: 'Comeback',
    desc: 'Siap aktif kembali ke dunia kerja profesional setelah masa jeda atau rehat.',
    Icon: RefreshCw,
    color: '#3B82F6',
    gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    borderActive: 'border-blue-400',
    tagBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    aiTip: 'AI memfasilitasi program re-skilling dan perusahaan ramah returnee dengan adaptasi bertahap.',
  },
];

const EDUCATION_OPTIONS = [
  'SD / Sederajat',
  'SMP / Sederajat',
  'SMA / SMK — Jurusan IPA',
  'SMA / SMK — Jurusan IPS',
  'SMA / SMK — Jurusan RPL / TKJ / IT',
  'SMA / SMK — Jurusan Lainnya',
  'D1 / D2 — Diploma',
  'D3 Teknik / Informatika / Komputer',
  'D3 Bisnis / Manajemen / Akuntansi',
  'D3 Kesehatan / Keperawatan',
  'D3 Desain / Seni',
  'D3 Lainnya',
  'S1 Teknik Informatika / Ilmu Komputer',
  'S1 Sistem Informasi / Teknologi Informasi',
  'S1 Teknik Elektro / Mesin / Sipil',
  'S1 Manajemen / Bisnis / Administrasi',
  'S1 Akuntansi / Keuangan',
  'S1 Hukum / Ilmu Politik',
  'S1 Kedokteran / Kesehatan Masyarakat',
  'S1 Psikologi',
  'S1 Komunikasi / Jurnalistik / PR',
  'S1 Pendidikan / Keguruan',
  'S1 Desain Komunikasi Visual / Seni',
  'S1 Pertanian / Peternakan',
  'S1 Lainnya',
  'S2 / Pascasarjana',
  'S3 / Doktoral',
  'Sedang Kuliah (Mahasiswa Aktif)',
  'Kursus / Bootcamp / Otodidak',
];

const EDUCATION_CATEGORIES = [
  { id: 'all', label: 'Semua Jenjang', icon: Sparkles },
  { id: 's1', label: '🎓 Sarjana (S1)', icon: GraduationCap, match: (opt) => opt.startsWith('S1') },
  { id: 'vokasi', label: '⚙️ Diploma (D1-D3)', icon: Zap, match: (opt) => opt.startsWith('D1') || opt.startsWith('D2') || opt.startsWith('D3') },
  { id: 'sekolah', label: '🏫 SMA / SMK', icon: School, match: (opt) => opt.startsWith('SMA') || opt.startsWith('SMK') || opt.startsWith('SMP') || opt.startsWith('SD') },
  { id: 'bootcamp', label: '💻 Bootcamp & Otodidak', icon: Code, match: (opt) => opt.includes('Bootcamp') || opt.includes('Kuliah') },
  { id: 'pasca', label: '🔬 Pascasarjana (S2/S3)', icon: Award, match: (opt) => opt.startsWith('S2') || opt.startsWith('S3') },
];

const POPULAR_EDUCATIONS = [
  'S1 Teknik Informatika / Ilmu Komputer',
  'S1 Sistem Informasi / Teknologi Informasi',
  'SMA / SMK — Jurusan RPL / TKJ / IT',
  'S1 Manajemen / Bisnis / Administrasi',
  'S1 Desain Komunikasi Visual / Seni',
  'Kursus / Bootcamp / Otodidak',
];

const EXPERIENCE_YEARS_OPTIONS = [
  '< 1 Tahun',
  '1 - 2 Tahun',
  '3 - 5 Tahun',
  '5 - 8 Tahun',
  '8+ Tahun',
];

const GRADUATION_STATUS_OPTIONS = [
  '🎓 Baru Lulus (2025/2026)',
  '⏳ Masih Berkuliah / Siswa',
  '💼 Lulus 2021 - 2024',
  '🏛️ Lulus Sebelum 2020',
];

function getEduBadge(eduStr) {
  if (!eduStr) return { label: 'UMUM', color: 'bg-slate-800 text-slate-300 border-slate-700' };
  if (eduStr.startsWith('S1')) return { label: 'SARJANA (S1)', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' };
  if (eduStr.startsWith('S2') || eduStr.startsWith('S3')) return { label: 'PASCASARJANA', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
  if (eduStr.startsWith('D1') || eduStr.startsWith('D2') || eduStr.startsWith('D3')) return { label: 'DIPLOMA (VOKASI)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
  if (eduStr.startsWith('SMA') || eduStr.startsWith('SMK')) return { label: 'MENENGAH (SMA/SMK)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
  if (eduStr.includes('Bootcamp') || eduStr.includes('Otodidak')) return { label: 'BOOTCAMP / NON-FORMAL', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
  return { label: 'PENDIDIKAN', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
}

function getAiStep1Analysis(level, education, experienceYears) {
  let matchScore = 94;
  let activeJobs = 340;
  let atsScore = 95;
  let demandLevel = 'Sangat Tinggi 🔥';

  if (level === 'Fresh Graduate') {
    matchScore = 93;
    activeJobs = 285;
    atsScore = 92;
    demandLevel = 'Tinggi (Entry Focus)';
  } else if (level === 'Mahasiswa Aktif') {
    matchScore = 90;
    activeJobs = 190;
    atsScore = 89;
    demandLevel = 'Magang & Flexi';
  } else if (level === 'Junior Level (0-2 Thn)') {
    matchScore = 95;
    activeJobs = 410;
    atsScore = 94;
    demandLevel = 'Sangat Tinggi 🔥';
  } else if (level === 'Mid-Level (2-5 Thn)') {
    matchScore = 98;
    activeJobs = 480;
    atsScore = 97;
    demandLevel = 'Peak Demand 🚀';
  } else if (level === 'Senior Level (5+ Thn)') {
    matchScore = 96;
    activeJobs = 230;
    atsScore = 98;
    demandLevel = 'High Compensation 💎';
  } else if (level === 'Career Switcher') {
    matchScore = 91;
    activeJobs = 310;
    atsScore = 90;
    demandLevel = 'Potensial Tinggi ✨';
  } else if (level === 'Freelancer / Konsultan') {
    matchScore = 94;
    activeJobs = 270;
    atsScore = 93;
    demandLevel = 'Global & Remote 🌐';
  } else if (level === 'Kembali Bekerja') {
    matchScore = 92;
    activeJobs = 250;
    atsScore = 91;
    demandLevel = 'Re-Skilling Friendly ✨';
  }

  const isTechEdu = /Informatika|Komputer|Sistem Informasi|RPL|TKJ|Bootcamp/i.test(education || '');
  if (isTechEdu) {
    activeJobs += 60;
  }

  const selectedLevelObj = CAREER_LEVEL_CONFIG.find(c => c.id === level);
  const advice = selectedLevelObj?.aiTip || `Profil Anda dengan tingkat "${level}" dan latar belakang "${education}" memiliki kompatibilitas tinggi dengan algoritma matching kami.`;

  return {
    matchScore,
    activeJobs,
    atsScore,
    demandLevel,
    advice,
  };
}

function LocationPickerModal({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [detectLoading, setDetectLoading] = useState(false);
  const ref = useRef(null);

  const filtered = INDONESIA_CITIES.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDetect = () => {
    if (!navigator.geolocation) return;
    setDetectLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.county || '';
          const state = data.address?.state || '';
          const country = data.address?.country || 'Indonesia';
          const loc = [city, state, country].filter(Boolean).join(', ');
          onChange(loc);
        } catch {
          onChange('Lokasi Terdeteksi');
        }
        setDetectLoading(false);
        setOpen(false);
      },
      () => setDetectLoading(false)
    );
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl px-4 py-3 text-xs text-slate-100 flex items-center justify-between outline-none cursor-pointer transition-all"
      >
        <div className="flex items-center gap-2">
          <MapPin size={15} className={value ? 'text-teal-400' : 'text-slate-500'} />
          <span className={value ? 'text-slate-100 font-semibold' : 'text-slate-500'}>
            {value || 'Pilih kota, kabupaten, atau domisili...'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {value && (
            <span
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
            >
              <X size={13} />
            </span>
          )}
          <ChevronDown size={14} className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-slate-900 border border-teal-500/40 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-2xl"
          >
            <div className="p-2.5 border-b border-slate-800 space-y-2">
              <button
                type="button"
                onClick={handleDetect}
                disabled={detectLoading}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-teal-500/20 to-indigo-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold hover:border-teal-400 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {detectLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-teal-400/40 border-t-teal-400 rounded-full animate-spin" />
                    <span>Mendeteksi Lokasi GPS...</span>
                  </>
                ) : (
                  <>
                    <Compass size={14} />
                    <span>Deteksi Lokasi Otomatis (GPS)</span>
                  </>
                )}
              </button>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama kota..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 outline-none focus:border-teal-400"
                />
              </div>
            </div>
            <div className="max-h-44 overflow-y-auto p-1.5 space-y-0.5">
              {filtered.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => { onChange(city); setOpen(false); setSearch(''); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    value === city
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'text-slate-300 hover:bg-slate-800/70'
                  }`}
                >
                  <MapPin size={12} className="text-slate-500" />
                  <span>{city}</span>
                </button>
              ))}
              {search && !filtered.includes(search) && (
                <button
                  type="button"
                  onClick={() => { onChange(search); setOpen(false); setSearch(''); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-teal-300 bg-teal-500/10 border border-dashed border-teal-500/30 hover:bg-teal-500/20 cursor-pointer"
                >
                  + Gunakan "{search}"
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OnboardingModal({ isOpen, onClose, user, onOnboardingComplete }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State — rich options matching registration
  const [education, setEducation] = useState(user?.education && user.education !== 'Belum diisi' ? user.education : 'S1 Teknik Informatika / Ilmu Komputer');
  const [level, setLevel] = useState(user?.level && user.level !== 'Belum diatur' ? user.level : 'Fresh Graduate');
  const [targetRole, setTargetRole] = useState(user?.role && user.role !== 'Belum diatur' ? user.role : 'Software Engineer / Backend Dev');
  const [customRole, setCustomRole] = useState('');
  const [location, setLocation] = useState(user?.location || '');
  const [workMode, setWorkMode] = useState(user?.work_mode || 'Remote / Hybrid');
  const [careerGoal, setCareerGoal] = useState(user?.career_goal || '');

  const [selectedSkills, setSelectedSkills] = useState(() => {
    if (user?.skills_list) {
      if (Array.isArray(user.skills_list)) return user.skills_list;
      if (typeof user.skills_list === 'string' && user.skills_list.trim() !== '') {
        return user.skills_list.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return ['PHP', 'Laravel', 'MySQL', 'React', 'Git'];
  });
  const [customSkill, setCustomSkill] = useState('');
  const [activeSkillCat, setActiveSkillCat] = useState('Pemrograman & IT');

  // Step 1 extra states
  const [eduSearch, setEduSearch] = useState('');
  const [eduCategory, setEduCategory] = useState('all');
  const [isEduBrowserOpen, setIsEduBrowserOpen] = useState(false);
  const [customEduInput, setCustomEduInput] = useState('');
  const [experienceDuration, setExperienceDuration] = useState('1 - 2 Tahun');
  const [graduationStatus, setGraduationStatus] = useState('🎓 Baru Lulus (2025/2026)');

  // Sync state when modal opens or user prop updates
  useEffect(() => {
    if (isOpen && user) {
      if (user.education && user.education !== 'Belum diisi') setEducation(user.education);
      if (user.level && user.level !== 'Belum diatur') setLevel(user.level);
      if (user.role && user.role !== 'Belum diatur') setTargetRole(user.role);
      if (user.location) setLocation(user.location);
      if (user.work_mode) setWorkMode(user.work_mode);
      if (user.career_goal) setCareerGoal(user.career_goal);
      if (user.skills_list) {
        if (Array.isArray(user.skills_list)) setSelectedSkills(user.skills_list);
        else if (typeof user.skills_list === 'string' && user.skills_list.trim() !== '') {
          setSelectedSkills(user.skills_list.split(',').map(s => s.trim()).filter(Boolean));
        }
      }
    }
  }, [isOpen, user]);

  const filteredEducations = useMemo(() => {
    return EDUCATION_OPTIONS.filter((opt) => {
      const catObj = EDUCATION_CATEGORIES.find((c) => c.id === eduCategory);
      const matchesCategory = catObj && catObj.match ? catObj.match(opt) : true;
      if (!matchesCategory) return false;
      if (eduSearch.trim()) {
        return opt.toLowerCase().includes(eduSearch.toLowerCase());
      }
      return true;
    });
  }, [eduCategory, eduSearch]);

  const aiAnalysis = useMemo(() => {
    return getAiStep1Analysis(level, education, experienceDuration);
  }, [level, education, experienceDuration]);

  // 15 Rich Target Roles from registration
  const TARGET_ROLES = [
    { id: 'Software Engineer / Backend Dev', title: 'Software Engineer / Backend Dev', Icon: Code, desc: 'Node.js, Python, PHP, Go, Java', color: '#3B82F6' },
    { id: 'Frontend Developer', title: 'Frontend Developer', Icon: Palette, desc: 'React, Vue, Angular, Tailwind', color: '#EC4899' },
    { id: 'Full Stack Developer', title: 'Full Stack Developer', Icon: Zap, desc: 'Laravel+React, MERN, Next.js', color: '#F59E0B' },
    { id: 'Mobile App Developer', title: 'Mobile App Developer', Icon: Smartphone, desc: 'Flutter, React Native, iOS/Android', color: '#10B981' },
    { id: 'UI/UX Designer', title: 'UI/UX Designer', Icon: Sparkles, desc: 'Figma, Prototyping, User Research', color: '#8B5CF6' },
    { id: 'Data Analyst / Data Scientist', title: 'Data Analyst / Data Scientist', Icon: BarChart3, desc: 'Python, SQL, Tableau, ML', color: '#06B6D4' },
    { id: 'Digital Marketing / SEO', title: 'Digital Marketing / SEO', Icon: Megaphone, desc: 'Google Ads, Meta, SEO, Content', color: '#EF4444' },
    { id: 'Copywriter / Content Creator', title: 'Copywriter / Content Creator', Icon: PenTool, desc: 'Artikel, Sosmed, Copywriting', color: '#F97316' },
    { id: 'Manajer / Team Lead', title: 'Manajer / Team Lead', Icon: Briefcase, desc: 'Project Mgmt, Leadership, Agile', color: '#3B82F6' },
    { id: 'HRD / Rekrutmen', title: 'HRD / Rekrutmen', Icon: Users, desc: 'Talent Acquisition, People Ops', color: '#10B981' },
    { id: 'Finance / Akuntan', title: 'Finance / Akuntan', Icon: DollarSign, desc: 'SAP, Excel, Laporan Keuangan', color: '#10B981' },
    { id: 'Dokter / Tenaga Kesehatan', title: 'Dokter / Tenaga Kesehatan', Icon: Activity, desc: 'Klinis, Administrasi RS, Farma', color: '#EF4444' },
    { id: 'Guru / Dosen / Edukator', title: 'Guru / Dosen / Edukator', Icon: GraduationCap, desc: 'Pengajaran, E-learning, Kurikulum', color: '#8B5CF6' },
    { id: 'Wirausaha / Entrepreneur', title: 'Wirausaha / Entrepreneur', Icon: Rocket, desc: 'Startup, Bisnis Sendiri, Founder', color: '#F59E0B' },
    { id: 'Freelancer / Konsultan', title: 'Freelancer / Konsultan', Icon: Globe, desc: 'Proyek bebas, multi-klien', color: '#06B6D4' },
  ];

  // Categorized Skills from registration
  const SKILLS_CATEGORIES = {
    'Pemrograman & IT': ['JavaScript', 'TypeScript', 'Python', 'PHP', 'Go', 'Java', 'C#', 'Ruby', 'Kotlin', 'Swift', 'Dart'],
    'Framework & Library': ['React', 'Vue.js', 'Angular', 'Next.js', 'Laravel', 'Django', 'Node.js', 'Express', 'Spring Boot', 'Flutter'],
    'Database & Cloud': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'AWS', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD'],
    'Desain': ['Figma', 'Adobe XD', 'Illustrator', 'Photoshop', 'Canva', 'Prototyping', 'UI Design', 'Motion Design'],
    'Marketing & Bisnis': ['SEO', 'Google Ads', 'Meta Ads', 'Copywriting', 'Content Strategy', 'Email Marketing', 'Social Media', 'Branding'],
    'Data & Analitik': ['Excel', 'Tableau', 'Power BI', 'Python (Data)', 'SQL', 'Machine Learning', 'Statistics', 'Google Analytics'],
    'Soft Skills': ['Public Speaking', 'Kepemimpinan', 'Manajemen Proyek', 'Negosiasi', 'Problem Solving', 'Komunikasi', 'Teamwork', 'Adaptasi'],
    'Umum': ['Microsoft Office', 'Git', 'Agile / Scrum', 'Bahasa Inggris', 'Bahasa Jepang', 'Bahasa Mandarin', 'Riset', 'Presentasi'],
  };

  const CURHAT_PRESETS = [
    'Saya baru lulus dan ingin segera dapat pekerjaan yang sesuai dengan jurusan saya.',
    'Saya ingin berpindah karir ke bidang baru dengan panduan roadmap yang terarah.',
    'Target saya adalah bekerja remote atau ke luar negeri dengan gaji USD $2.000+/bulan.',
    'Saya ingin naik level dari posisi saat ini menjadi Senior / Team Lead dalam 6-12 bulan.',
    'Saya ingin memulai bisnis sendiri atau menjadi freelancer yang penghasilannya stabil.',
    'Saya seorang ibu rumah tangga yang ingin kembali bekerja setelah jeda karir.',
    'Saya mahasiswa aktif yang ingin mempersiapkan diri sebelum lulus ke dunia kerja.',
  ];

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleAddCustomRole = (e) => {
    e.preventDefault();
    if (customRole.trim()) {
      setTargetRole(customRole.trim());
      setCustomRole('');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        education,
        experience_level: level,
        target_role: targetRole,
        skills_list: selectedSkills,
        location,
        work_mode: workMode,
        career_goal: careerGoal,
      };

      const response = await axios.post('/api/onboarding/complete', payload);

      if (response.data && response.data.success) {
        setStep(4); // Step 4: AI Re-Analysis Complete
        if (onOnboardingComplete) {
          onOnboardingComplete(response.data);
        }
      } else {
        setErrorMsg(response.data.message || 'Gagal menyimpan data profil.');
      }
    } catch (err) {
      console.error('Onboarding submit error:', err);
      setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan sistem saat menyimpan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-4xl bg-[#070B1D] border border-teal-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden text-slate-100 max-h-[92vh] overflow-y-auto"
      >
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />

        {/* Step Progress Header */}
        <div className="relative z-10 mb-6 pb-5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Sparkles size={20} className="text-white animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-black text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
                <span>PERBARUI PROFIL &amp; AI ANALYSIS</span>
                <span className="text-slate-600">•</span>
                <span className="text-teal-300">TAHAP {step} DARI 4</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-100">
                {step === 1 && 'Pendidikan & Level Pengalaman'}
                {step === 2 && 'Target Role Impian & Domisili'}
                {step === 3 && 'Keahlian (Skills) & Target Karir'}
                {step === 4 && 'Hasil Analisis Real-Time AI Website'}
              </h3>
            </div>
          </div>

          {/* Step Indicator Bullets */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(s)}
                className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                  s === step
                    ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md shadow-teal-500/30'
                    : s < step
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800/90 text-slate-500 hover:text-slate-300'
                }`}
              >
                {s < step && <Check size={11} className="text-emerald-400" />}
                <span>Tahap {s}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle size={15} className="text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* ── TAHAP 1: Pendidikan & Level Pengalaman ── */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="space-y-6 relative z-10">
            {/* ── SUBHEADER BANNER: AI Engine Status & Progress ── */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-teal-500/15 via-indigo-500/10 to-purple-500/15 border border-teal-500/30 flex items-center justify-between flex-wrap gap-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-md shadow-teal-500/20 shrink-0">
                  <Cpu size={18} className="animate-pulse text-teal-400" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-teal-300 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping inline-block" />
                    <span>AI MATCH ENGINE • REAL-TIME PROFILING</span>
                  </div>
                  <div className="text-xs text-slate-300 font-semibold mt-0.5">
                    Konfigurasi fondasi akademik & pengalaman untuk kalkulasi skor ATS optimal
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-teal-400/15 border border-teal-400/40 text-[11px] font-extrabold text-teal-300 flex items-center gap-1.5 shadow-sm">
                  <Sparkles size={12} className="text-teal-400" />
                  <span>Kesiapan AI: {aiAnalysis.matchScore}%</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300">
                  Tahap 1 / 4
                </span>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ── BAGIAN 1: STATUS & LEVEL KARIR SAAT INI ── */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    <Briefcase size={14} />
                  </div>
                  <label className="text-xs font-black text-slate-200 uppercase tracking-wider">
                    Status / Level Karir Saat Ini
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Pilihan Aktif:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-black uppercase tracking-wider">
                    {level}
                  </span>
                </div>
              </div>

              {/* 8 Modern Level Cards in Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {CAREER_LEVEL_CONFIG.map((lvl) => {
                  const IconComp = lvl.Icon;
                  const isSelected = level === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setLevel(lvl.id)}
                      className={`group relative p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${
                        isSelected
                          ? `bg-gradient-to-br ${lvl.gradient} ${lvl.borderActive} ring-2 ring-teal-400/40 shadow-lg shadow-teal-500/15 scale-[1.01]`
                          : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/60'
                      }`}
                    >
                      {/* Top Accent Line on Active */}
                      {isSelected && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 via-indigo-400 to-emerald-400" />
                      )}

                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 shadow-sm"
                          style={{
                            backgroundColor: isSelected ? `${lvl.color}25` : 'rgba(30, 41, 59, 0.7)',
                            borderColor: isSelected ? lvl.color : 'rgba(51, 65, 85, 0.6)',
                          }}
                        >
                          <IconComp
                            size={18}
                            style={{ color: isSelected ? lvl.color : '#94A3B8' }}
                            className={isSelected ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}
                          />
                        </div>

                        <span
                          className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                            isSelected
                              ? lvl.tagBg
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {lvl.badge}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4
                            className={`text-xs font-black transition-colors ${
                              isSelected ? 'text-slate-100' : 'text-slate-300 group-hover:text-slate-100'
                            }`}
                          >
                            {lvl.title}
                          </h4>
                          {isSelected && (
                            <CheckCircle2 size={15} className="text-teal-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed line-clamp-2">
                          {lvl.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sub-Selection: Estimasi Lama Pengalaman Praktis */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between flex-wrap gap-2.5">
                <div className="flex items-center gap-2">
                  <Sliders size={13} className="text-teal-400" />
                  <span className="text-[11px] font-bold text-slate-300">
                    Estimasi Lama Pengalaman Praktis / Kerja:
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {EXPERIENCE_YEARS_OPTIONS.map((yrs) => {
                    const isYrsActive = experienceDuration === yrs;
                    return (
                      <button
                        key={yrs}
                        type="button"
                        onClick={() => setExperienceDuration(yrs)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                          isYrsActive
                            ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md shadow-teal-500/20'
                            : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                        }`}
                      >
                        {yrs}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ── BAGIAN 2: PENDIDIKAN TERAKHIR / SEDANG DITEMPUH ── */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <GraduationCap size={14} />
                  </div>
                  <label className="text-xs font-black text-slate-200 uppercase tracking-wider">
                    Pendidikan Terakhir / Sedang Ditempuh
                  </label>
                </div>
                <span className="text-[10px] text-indigo-300 font-semibold flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  <span>{EDUCATION_OPTIONS.length} Pilihan Standar Industri</span>
                </span>
              </div>

              {/* Selected Education Hero Card */}
              {(() => {
                const badge = getEduBadge(education);
                return (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-teal-500/40 shadow-lg relative overflow-hidden flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 shrink-0">
                        <GraduationCap size={22} className="animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCheck size={12} />
                            <span>Pilihan Aktif Terhubung ke ATS</span>
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-100">
                          {education}
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEduBrowserOpen((v) => !v)}
                      className="px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-teal-300 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                    >
                      <Search size={13} />
                      <span>{isEduBrowserOpen ? 'Tutup Pilihan Jurusan' : 'Cari / Ganti Jurusan'}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isEduBrowserOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                );
              })()}

              {/* Quick Picks for Instant 1-Click Select */}
              <div className="space-y-1.5">
                <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Star size={12} className="text-amber-400" />
                  <span>Paling Sering Dipilih (Quick Picks):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_EDUCATIONS.map((pop) => {
                    const isPopActive = education === pop;
                    return (
                      <button
                        key={pop}
                        type="button"
                        onClick={() => {
                          setEducation(pop);
                          setIsEduBrowserOpen(false);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isPopActive
                            ? 'bg-teal-500/25 border border-teal-400 text-teal-300 shadow-sm'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        {isPopActive ? <Check size={11} className="text-teal-400" /> : <Plus size={11} className="text-slate-500" />}
                        <span>{pop}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Education Browser Drawer */}
              <AnimatePresence>
                {isEduBrowserOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden p-4 rounded-2xl bg-[#090D24] border border-teal-500/30 space-y-3.5 shadow-xl"
                  >
                    {/* Search & Counter */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        <input
                          autoFocus
                          type="text"
                          value={eduSearch}
                          onChange={(e) => setEduSearch(e.target.value)}
                          placeholder="Ketik kata kunci (contoh: Informatika, D3, Akuntansi, SMK, Kedokteran)..."
                          className="w-full bg-slate-950 border border-slate-800 focus:border-teal-400 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors"
                        />
                        {eduSearch && (
                          <button
                            type="button"
                            onClick={() => setEduSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                      <span className="text-[10.5px] font-bold text-slate-400 px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 whitespace-nowrap">
                        {filteredEducations.length} Cocok
                      </span>
                    </div>

                    {/* Category Filter Tabs */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1.5 custom-horizontal-scrollbar">
                      {EDUCATION_CATEGORIES.map((cat) => {
                        const CatIcon = cat.icon;
                        const isCatActive = eduCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setEduCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                              isCatActive
                                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md shadow-teal-500/20'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <CatIcon size={12} />
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Options Grid */}
                    <div className="max-h-56 overflow-y-auto p-1 space-y-1 custom-horizontal-scrollbar">
                      {filteredEducations.map((eduOption) => {
                        const isSelected = education === eduOption;
                        const badge = getEduBadge(eduOption);
                        return (
                          <button
                            key={eduOption}
                            type="button"
                            onClick={() => {
                              setEducation(eduOption);
                              setIsEduBrowserOpen(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-teal-500/20 border-teal-500 text-teal-200 shadow-sm'
                                : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-800/70 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${badge.color}`}>
                                {badge.label.split(' ')[0]}
                              </span>
                              <span className="truncate">{eduOption}</span>
                            </div>
                            {isSelected && (
                              <CheckCircle2 size={15} className="text-teal-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}

                      {filteredEducations.length === 0 && (
                        <div className="p-4 text-center text-slate-500 text-xs">
                          Tidak ditemukan jenjang yang cocok dengan "{eduSearch}". Gunakan form input kustom di bawah.
                        </div>
                      )}
                    </div>

                    {/* Custom Education Input */}
                    <div className="pt-2 border-t border-slate-800 flex gap-2">
                      <input
                        type="text"
                        value={customEduInput}
                        onChange={(e) => setCustomEduInput(e.target.value)}
                        placeholder="+ Ketik nama kampus / jurusan spesifikmu jika tidak ada..."
                        className="flex-1 bg-slate-950 border border-slate-800 focus:border-teal-400 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customEduInput.trim()) {
                            setEducation(customEduInput.trim());
                            setCustomEduInput('');
                            setIsEduBrowserOpen(false);
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                      >
                        Gunakan
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status Angkatan / Kelulusan */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between flex-wrap gap-2.5">
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-indigo-400" />
                  <span className="text-[11px] font-bold text-slate-300">
                    Status Angkatan / Periode Kelulusan:
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {GRADUATION_STATUS_OPTIONS.map((grad) => {
                    const isGradActive = graduationStatus === grad;
                    return (
                      <button
                        key={grad}
                        type="button"
                        onClick={() => setGraduationStatus(grad)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                          isGradActive
                            ? 'bg-gradient-to-r from-indigo-500 to-teal-500 text-white shadow-md shadow-indigo-500/20'
                            : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                        }`}
                      >
                        {grad}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ── BAGIAN 3: LIVE REAL-TIME AI READINESS & INSIGHT WIDGET ── */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-950/40 via-[#070B1D] to-indigo-950/40 border border-teal-500/35 relative overflow-hidden shadow-xl space-y-3.5">
              {/* Header Box */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                    <TrendingUp size={15} />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                      <span>Live AI Profiling Insight</span>
                      <span className="text-[9.5px] px-2 py-0.2 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 font-extrabold uppercase">
                        Real-Time
                      </span>
                    </h5>
                    <p className="text-[10px] text-slate-400">
                      Evaluasi algoritma pencocokan lowongan kerja berdasarkan input Tahap 1
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10.5px] text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
                  <CheckCheck size={13} className="text-emerald-400" />
                  <span>Kombinasi Profil Valid</span>
                </div>
              </div>

              {/* 3 Metric Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Peluang Lowongan Aktif
                  </div>
                  <div className="text-base font-extrabold text-teal-300 mt-0.5">
                    {aiAnalysis.activeJobs}+ Posisi
                  </div>
                  <div className="text-[9.5px] text-slate-500 mt-0.5">
                    Tersedia di Job Matching Engine
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Kesesuaian Skor ATS
                  </div>
                  <div className="text-base font-extrabold text-indigo-300 mt-0.5">
                    {aiAnalysis.atsScore}% Optimal
                  </div>
                  <div className="text-[9.5px] text-slate-500 mt-0.5">
                    Sistem Screening CV Otomatis
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Permintaan Pasar Kerja
                  </div>
                  <div className="text-base font-extrabold text-amber-300 mt-0.5">
                    {aiAnalysis.demandLevel}
                  </div>
                  <div className="text-[9.5px] text-slate-500 mt-0.5">
                    Tren Rekrutmen Industri 2026
                  </div>
                </div>
              </div>

              {/* AI Strategic Note */}
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-slate-200 text-xs flex items-start gap-2.5 leading-relaxed">
                <Sparkles size={16} className="text-teal-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <strong className="text-teal-300 font-extrabold">Rekomendasi AI Engine: </strong>
                  <span>{aiAnalysis.advice}</span>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ── FOOTER ACTIONS ── */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-800 mt-2 flex-wrap gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer flex items-center gap-2 transition-colors"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="shimmer-btn-primary px-6 py-3 text-xs font-extrabold cursor-pointer flex items-center gap-2 shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-all"
              >
                <span>Lanjut ke Tahap 2: Target &amp; Domisili</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* ── TAHAP 2: Target Role & Domisili / Modus Kerja ── */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="space-y-6 relative z-10 max-h-[62vh] overflow-y-auto pr-1">
            {/* Target Role Selector */}
            <div>
              <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Pilih Target Role / Posisi Impianmu</span>
                <span className="text-[10px] text-teal-400 font-semibold">15 Bidang Industri AI</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                {TARGET_ROLES.map((r) => {
                  const RIcon = r.Icon;
                  const isSelected = targetRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setTargetRole(r.id)}
                      className={`p-3 rounded-2xl border text-xs text-left transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-lg shadow-teal-500/10 scale-[1.01]'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 flex-shrink-0 mt-0.5">
                        <RIcon size={16} style={{ color: r.color }} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-extrabold text-slate-100 truncate">{r.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">{r.desc}</div>
                      </div>
                      {isSelected && <CheckCircle2 size={16} className="text-teal-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Role Input Form */}
              <form onSubmit={handleAddCustomRole} className="flex gap-2">
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="+ Ketik target posisi khusus jika tidak ada di daftar..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:border-teal-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Gunakan
                </button>
              </form>
            </div>

            {/* Domisili & Modus Kerja */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                  Domisili / Kota Tempat Tinggal
                </label>
                <LocationPickerModal value={location} onChange={setLocation} />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                  Preferensi Modus Kerja
                </label>
                <div className="flex gap-2">
                  {['Remote / Hybrid', 'Full Onsite / WFO', 'Flexible Hours'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setWorkMode(m)}
                      className={`flex-1 py-3 px-2 rounded-2xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                        workMode === m
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer flex items-center gap-2"
              >
                <ArrowLeft size={14} /> Kembali
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="shimmer-btn-primary px-6 py-3 text-xs font-extrabold cursor-pointer"
              >
                <span>Lanjut ke Tahap 3: Keahlian &amp; Target Karir</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* ── TAHAP 3: Keahlian (Skills) & Target / Curhat Karir ── */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="space-y-6 relative z-10 max-h-[62vh] overflow-y-auto pr-1">
            {/* Category Tabs for Skills */}
            <div>
              <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Pilih Keahlian Yang Kamu Kuasai ({selectedSkills.length} Terpilih)</span>
                <span className="text-[10px] text-indigo-400 font-semibold">Digunakan AI Matcher</span>
              </label>

              <div 
                onWheel={(e) => {
                  if (e.deltaY !== 0) {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }
                }}
                className="flex gap-1.5 overflow-x-auto pb-2 mb-3 custom-horizontal-scrollbar"
              >
                {Object.keys(SKILLS_CATEGORIES).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveSkillCat(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeSkillCat === cat
                        ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Skills Pills inside Active Category */}
              <div className="flex flex-wrap gap-2 mb-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                {SKILLS_CATEGORIES[activeSkillCat]?.map((sk) => {
                  const isSelected = selectedSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleSkill(sk)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-md shadow-teal-500/10'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {isSelected ? <Check size={12} className="text-teal-400" /> : '+'}
                      <span>{sk}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Skill */}
              <form onSubmit={handleAddCustomSkill} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="+ Tambah keahlian khusus lainnya..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:border-teal-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Tambah
                </button>
              </form>
            </div>

            {/* Target / Curhat Karir (Career Goal) */}
            <div>
              <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Heart size={14} className="text-teal-400" />
                <span>Target / Ambisi Karir Kamu (Curhat ke AI)</span>
              </label>

              <textarea
                rows={3}
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                placeholder="Ceritakan target karirmu... (contoh: Saya ingin menjadi Full Stack Dev dalam 6 bulan dan bekerja remote di perusahaan teknologi global)"
                className="w-full bg-slate-900 border border-slate-800 focus:border-teal-400 rounded-2xl p-3.5 text-xs text-slate-100 focus:outline-none resize-none mb-2"
              />

              {/* Curhat Presets */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Preset Target Cepat:</div>
                <div className="flex flex-wrap gap-1.5">
                  {CURHAT_PRESETS.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setCareerGoal(preset)}
                      className="text-[10.5px] font-semibold text-slate-400 hover:text-teal-300 bg-slate-900 border border-slate-800 hover:border-teal-500/40 px-2.5 py-1 rounded-xl transition-all cursor-pointer text-left"
                    >
                      💡 {preset.substring(0, 45)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit & Re-Analysis State */}
            {isSubmitting ? (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/60 via-slate-900 to-indigo-950/60 border border-teal-500/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center mx-auto animate-bounce">
                  <Cpu className="w-6 h-6 text-teal-400 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-teal-300">
                    Engine AI Sedang Menganalisis Ulang Profil &amp; Rekomendasi Website...
                  </h4>
                  <p className="text-xs text-slate-400">
                    Mencocokkan lowongan kerja real-time di {location || 'Indonesia'}, menghitung skor ATS, dan memperbarui Roadmap Karir...
                  </p>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-400 to-indigo-400 h-full w-4/5 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer flex items-center gap-2"
                >
                  <ArrowLeft size={14} /> Kembali
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="shimmer-btn-primary px-6 py-3 text-xs font-extrabold cursor-pointer"
                >
                  <span>Simpan &amp; Perbarui AI Analysis Website</span>
                  <Sparkles size={15} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* ── TAHAP 4: Hasil & AI Full-Site Re-Analysis Success ── */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {step === 4 && (
          <div className="space-y-5 text-center relative z-10 py-2">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 15 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-indigo-500 flex items-center justify-center mx-auto shadow-xl shadow-teal-500/30"
            >
              <Rocket size={32} className="text-white animate-pulse" />
            </motion.div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5">
                <Sparkles size={12} />
                Analisis AI Real-Time Full Website Selesai
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center justify-center gap-2">
                <span>Profil &amp; Rekomendasi AI Diperbarui!</span>
                <Sparkles size={20} className="text-teal-400" />
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                Sistem AI telah merekomendasikan ulang seluruh lowongan kerja, skor kecocokan karir, dan panduan skill untuk posisi <strong className="text-teal-300">{targetRole}</strong> ({level}) di <strong className="text-teal-300">{location || 'Indonesia'}</strong>.
              </p>
            </div>

            {/* AI Recommendation Summary Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Target Role &amp; Status</div>
                <div className="font-extrabold text-teal-300 mt-0.5 truncate">{targetRole}</div>
                <div className="text-[10px] text-slate-400">{level} • {workMode}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Skills Terverifikasi</div>
                <div className="font-extrabold text-indigo-300 mt-0.5 truncate">
                  {selectedSkills.length} Skill Utama
                </div>
                <div className="text-[10px] text-slate-400 truncate">{selectedSkills.slice(0, 3).join(', ')}...</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Domisili Target</div>
                <div className="font-extrabold text-emerald-300 mt-0.5 truncate">
                  {location || 'Indonesia'}
                </div>
                <div className="text-[10px] text-slate-400">Live API Jobs Sync</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="text-teal-400" />
              <span>Seluruh fitur di website kini menampilkan rekomendasi personal AI kamu!</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="shimmer-btn-primary w-full py-3.5 text-xs font-extrabold justify-center cursor-pointer shadow-lg shadow-teal-500/20"
              >
                <span>Lihat Rekomendasi Dashboard Baru</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
