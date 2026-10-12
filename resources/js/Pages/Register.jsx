import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../Components/LanguageSwitcher';
import {
  Sparkles, Mail, Lock, User as UserIcon,
  Eye, EyeOff, ArrowRight, ShieldCheck,
  Zap, CheckCircle2, ShieldAlert,
  Briefcase, Brain, MapPin, Globe,
  Camera, X, Search, ChevronDown, Check, Plus,
  Rocket, Star, GraduationCap, Target,
  MessageSquare, Layers, Award, Compass, Users,
  Sprout, Flame, Gem, Shuffle, RefreshCw,
  Code, Palette, Smartphone, BarChart3, Megaphone,
  PenTool, DollarSign, Activity, Building2, Send,
  FileText, Laptop,
} from 'lucide-react';
import FullscreenLoader from '../Components/FullscreenLoader';
import AuthRobotModal from '../Components/AuthRobotModal';
import AnimatedBackground from '../Components/AnimatedBackground';

/* ───────────────────────────────────────────────────────── */
/*  PASSWORD STRENGTH                                        */
/* ───────────────────────────────────────────────────────── */
function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: 'Min. 8 Karakter', ok: password.length >= 8 },
    { label: 'Huruf Besar', ok: /[A-Z]/.test(password) },
    { label: 'Angka/Simbol', ok: /[\d\W]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const barColors = ['#EF4444', '#F59E0B', '#2DD4BF'];
  const labelText = ['Lemah', 'Sedang', 'Kuat & Aman'];
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 99,
            background: i < score ? barColors[score - 1] : 'rgba(255,255,255,.08)',
            transition: 'background .3s ease',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: score > 0 ? barColors[score - 1] : '#475569', fontWeight: 600 }}>
          {score > 0 ? labelText[score - 1] : ''}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {checks.map((c) => (
            <span key={c.label} style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: c.ok ? '#2DD4BF' : '#475569', display: 'flex', alignItems: 'center', gap: 3 }}>
              <CheckCircle2 size={10} style={{ color: c.ok ? '#2DD4BF' : '#475569' }} />
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────── */
/*  SEARCHABLE DROPDOWN COMPONENT                           */
/* ───────────────────────────────────────────────────────── */
function SearchableDropdown({ value, onChange, options, placeholder, label, icon: Icon, allowCustom = false }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const filtered = options.filter(o =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (opt) => {
    onChange(opt);
    setOpen(false);
    setSearch('');
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', padding: '12px 42px 12px 42px', borderRadius: 12,
          background: '#0B1128', border: `1px solid ${open ? 'rgba(139,92,246,.6)' : 'rgba(255,255,255,.14)'}`,
          color: value ? '#F8FAFC' : '#475569', fontSize: 13, outline: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', textAlign: 'left',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: open ? '0 0 0 2px rgba(139,92,246,0.25)' : 'none',
        }}
      >
        {Icon && <Icon size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || placeholder}</span>
        <ChevronDown size={14} style={{ color: '#475569', flexShrink: 0, marginLeft: 8, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 999,
              background: 'rgba(10,15,40,0.98)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139,92,246,.35)', borderRadius: 14,
              overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            }}
          >
            {/* Search Input */}
            <div style={{ padding: '10px 10px 6px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
              <div style={{ position: 'relative' }}>
                <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari atau ketik..."
                  style={{
                    width: '100%', padding: '8px 10px 8px 30px', borderRadius: 8,
                    background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)',
                    color: '#F8FAFC', fontSize: 12, outline: 'none',
                  }}
                />
              </div>
            </div>
            {/* Options List */}
            <div style={{ maxHeight: 220, overflowY: 'auto', padding: '6px 6px' }}>
              {filtered.length > 0 ? filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none',
                    background: value === opt ? 'rgba(139,92,246,.2)' : 'transparent',
                    color: value === opt ? '#C4B5FD' : '#CBD5E1',
                    fontSize: 12, fontWeight: value === opt ? 700 : 500,
                    cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={e => { if (value !== opt) e.currentTarget.style.background = 'rgba(255,255,255,.05)'; }}
                  onMouseOut={e => { if (value !== opt) e.currentTarget.style.background = 'transparent'; }}
                >
                  {value === opt && <Check size={12} style={{ color: '#8B5CF6', flexShrink: 0 }} />}
                  {opt}
                </button>
              )) : (
                <div style={{ padding: '12px', textAlign: 'center', color: '#475569', fontSize: 12 }}>
                  {allowCustom && search ? (
                    <button
                      type="button"
                      onClick={() => handleSelect(search)}
                      style={{
                        width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px dashed rgba(139,92,246,.4)',
                        background: 'rgba(139,92,246,.1)', color: '#C4B5FD', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      + Gunakan "{search}"
                    </button>
                  ) : 'Tidak ada hasil'}
                </div>
              )}
              {allowCustom && search && filtered.length > 0 && !filtered.includes(search) && (
                <button
                  type="button"
                  onClick={() => handleSelect(search)}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px dashed rgba(139,92,246,.35)',
                    background: 'rgba(139,92,246,.08)', color: '#C4B5FD', fontSize: 11, fontWeight: 700,
                    cursor: 'pointer', textAlign: 'left', marginTop: 4,
                  }}
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

/* ───────────────────────────────────────────────────────── */
/*  LOCATION POPUP COMPONENT                                 */
/* ───────────────────────────────────────────────────────── */
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

function LocationPicker({ value, onChange }) {
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
        style={{
          width: '100%', padding: '12px 14px 12px 42px', borderRadius: 12,
          background: '#0B1128', border: `1px solid ${open ? 'rgba(45,212,191,.6)' : 'rgba(255,255,255,.14)'}`,
          color: value ? '#F8FAFC' : '#475569', fontSize: 13, outline: 'none',
          display: 'flex', alignItems: 'center', gap: 8,
          cursor: 'pointer', textAlign: 'left',
          boxShadow: open ? '0 0 0 2px rgba(45,212,191,0.2)' : 'none',
          transition: 'all 0.2s',
        }}
      >
        <MapPin size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: value ? '#2DD4BF' : '#475569' }} />
        <span style={{ flex: 1 }}>{value || 'Pilih kota, kabupaten, atau domisili...'}</span>
        {value && (
          <span
            onClick={(e) => { e.stopPropagation(); onChange(''); }}
            style={{ color: '#475569', cursor: 'pointer', marginLeft: 4 }}
          >
            <X size={14} />
          </span>
        )}
        <ChevronDown size={14} style={{ color: '#475569', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 1000,
              background: 'rgba(8,12,35,0.99)', backdropFilter: 'blur(24px)',
              border: '1px solid rgba(45,212,191,.3)', borderRadius: 16,
              overflow: 'hidden', boxShadow: '0 24px 70px rgba(0,0,0,0.8)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <button
                type="button"
                onClick={handleDetect}
                disabled={detectLoading}
                style={{
                  width: '100%', padding: '9px 14px', borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(45,212,191,.2), rgba(79,124,255,.15))',
                  border: '1px solid rgba(45,212,191,.3)',
                  color: '#2DD4BF', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
                  marginBottom: 8,
                }}
              >
                {detectLoading ? (
                  <><span style={{ width: 14, height: 14, border: '2px solid rgba(45,212,191,.3)', borderTopColor: '#2DD4BF', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} /> Mendeteksi Lokasi...</>
                ) : (
                  <><Compass size={14} /> Deteksi Lokasi Otomatis</>
                )}
              </button>
              <div style={{ position: 'relative' }}>
                <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari kota atau kabupaten..."
                  style={{
                    width: '100%', padding: '8px 10px 8px 30px', borderRadius: 8,
                    background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)',
                    color: '#F8FAFC', fontSize: 12, outline: 'none',
                  }}
                />
              </div>
            </div>
            {/* City List */}
            <div style={{ maxHeight: 200, overflowY: 'auto', padding: '6px' }}>
              {filtered.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => { onChange(city); setOpen(false); setSearch(''); }}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none',
                    background: value === city ? 'rgba(45,212,191,.15)' : 'transparent',
                    color: value === city ? '#2DD4BF' : '#CBD5E1',
                    fontSize: 12, cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={e => { if (value !== city) e.currentTarget.style.background = 'rgba(255,255,255,.05)'; }}
                  onMouseOut={e => { if (value !== city) e.currentTarget.style.background = 'transparent'; }}
                >
                  <MapPin size={11} style={{ color: '#475569', flexShrink: 0 }} />
                  {city}
                </button>
              ))}
              {search && !filtered.includes(search) && (
                <button
                  type="button"
                  onClick={() => { onChange(search); setOpen(false); setSearch(''); }}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px dashed rgba(45,212,191,.35)',
                    background: 'rgba(45,212,191,.08)', color: '#2DD4BF', fontSize: 11, fontWeight: 700,
                    cursor: 'pointer', textAlign: 'left', marginTop: 4,
                  }}
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

/* ───────────────────────────────────────────────────────── */
/*  AVATAR UPLOAD COMPONENT                                  */
/* ───────────────────────────────────────────────────────── */
function AvatarUpload({ preview, onFileChange }) {
  const inputRef = useRef(null);
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onFileChange(file);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => inputRef.current?.click()}
          style={{
            width: 80, height: 80, borderRadius: '50%', cursor: 'pointer',
            background: preview ? 'transparent' : 'linear-gradient(135deg, rgba(139,92,246,.3), rgba(45,212,191,.2))',
            border: '2px solid rgba(139,92,246,.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', position: 'relative',
            boxShadow: '0 0 24px rgba(139,92,246,.35)',
          }}
        >
          {preview ? (
            <img src={preview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Camera size={22} style={{ color: '#8B5CF6' }} />
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 8, fontWeight: 700, color: '#8B5CF6', textAlign: 'center', lineHeight: 1.2 }}>Upload Foto</span>
            </div>
          )}
          {/* Overlay on hover */}
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0, transition: 'opacity 0.2s',
          }}
            onMouseOver={e => e.currentTarget.style.opacity = 1}
            onMouseOut={e => e.currentTarget.style.opacity = 0}
          >
            <Camera size={20} style={{ color: '#fff' }} />
          </div>
        </motion.div>
        {preview && (
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 22, height: 22, borderRadius: '50%',
            background: 'linear-gradient(135deg,#8B5CF6,#14B8A6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', border: '2px solid rgba(7,11,26,1)',
          }}
            onClick={() => inputRef.current?.click()}
          >
            <Camera size={11} color="#fff" />
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>
      <div style={{ marginLeft: 14, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, color: '#F1F5F9' }}>
          Foto Profil <span style={{ color: '#475569', fontWeight: 500 }}>(Opsional)</span>
        </div>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: '#64748B' }}>
          JPG, PNG, WEBP • Maks. 2MB
        </div>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: '#8B5CF6', fontWeight: 600 }}>
          Membantu AI mengenali profil kamu <Sparkles size={13} style={{ display: 'inline', color: '#F59E0B', verticalAlign: 'middle' }} />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────── */
/*  MAIN REGISTER COMPONENT                                  */
/* ───────────────────────────────────────────────────────── */
export default function Register() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = Next (Right -> Center), -1 = Back (Left -> Center)
  const [showPwd, setShowPwd] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [stepError, setStepError] = useState('');
  const [robotModal, setRobotModal] = useState(null); // null | 'loading' | 'success' | 'error'
  const [authNavModal, setAuthNavModal] = useState(null); // null | 'login_loading'
  const [registerErrorMsg, setRegisterErrorMsg] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('Remote / Hybrid');

  const handleGoToLogin = (e) => {
    if (e) e.preventDefault();
    setAuthNavModal('login_loading');
    setTimeout(() => {
      router.visit('/login');
    }, 750);
  };

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    role: 'user',
    education: '',
    experience_level: 'Fresh Graduate',
    target_role: '',
    skills_list: [],
    career_goal: '',
    work_mode: 'Remote / Hybrid',
    location: '',
  });

  // ─── DATA CONSTANTS ────────────────────────────────────────
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

  const TARGET_ROLES = [
    { id: 'Software Engineer / Backend Dev', icon: Code, desc: 'Node.js, Python, PHP, Go, Java', color: '#3B82F6' },
    { id: 'Frontend Developer', icon: Palette, desc: 'React, Vue, Angular, Tailwind', color: '#EC4899' },
    { id: 'Full Stack Developer', icon: Zap, desc: 'Laravel+React, MERN, Next.js', color: '#F59E0B' },
    { id: 'Mobile App Developer', icon: Smartphone, desc: 'Flutter, React Native, iOS/Android', color: '#10B981' },
    { id: 'UI/UX Designer', icon: Sparkles, desc: 'Figma, Prototyping, User Research', color: '#8B5CF6' },
    { id: 'Data Analyst / Data Scientist', icon: BarChart3, desc: 'Python, SQL, Tableau, ML', color: '#06B6D4' },
    { id: 'Digital Marketing / SEO', icon: Megaphone, desc: 'Google Ads, Meta, SEO, Content', color: '#EF4444' },
    { id: 'Copywriter / Content Creator', icon: PenTool, desc: 'Artikel, Sosmed, Copywriting', color: '#F97316' },
    { id: 'Manajer / Team Lead', icon: Briefcase, desc: 'Project Mgmt, Leadership, Agile', color: '#3B82F6' },
    { id: 'HRD / Rekrutmen', icon: Users, desc: 'Talent Acquisition, People Ops', color: '#10B981' },
    { id: 'Finance / Akuntan', icon: DollarSign, desc: 'SAP, Excel, Laporan Keuangan', color: '#10B981' },
    { id: 'Dokter / Tenaga Kesehatan', icon: Activity, desc: 'Klinis, Administrasi RS, Farma', color: '#EF4444' },
    { id: 'Guru / Dosen / Edukator', icon: GraduationCap, desc: 'Pengajaran, E-learning, Kurikulum', color: '#8B5CF6' },
    { id: 'Wirausaha / Entrepreneur', icon: Rocket, desc: 'Startup, Bisnis Sendiri, Founder', color: '#F59E0B' },
    { id: 'Freelancer / Konsultan', icon: Globe, desc: 'Proyek bebas, multi-klien', color: '#06B6D4' },
  ];

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

  const ALL_SKILLS = Object.values(SKILLS_CATEGORIES).flat();
  const [activeSkillCat, setActiveSkillCat] = useState('Pemrograman & IT');

  const CURHAT_PRESETS = [
    'Saya baru lulus dan ingin segera dapat pekerjaan yang sesuai dengan jurusan saya.',
    'Saya ingin berpindah karir ke bidang baru dengan panduan roadmap yang terarah.',
    'Target saya adalah bekerja remote atau ke luar negeri dengan gaji USD $2.000+/bulan.',
    'Saya ingin naik level dari posisi saat ini menjadi Senior / Team Lead dalam 6-12 bulan.',
    'Saya ingin memulai bisnis sendiri atau menjadi freelancer yang penghasilannya stabil.',
    'Saya seorang ibu rumah tangga yang ingin kembali bekerja setelah jeda karir.',
    'Saya mahasiswa aktif yang ingin mempersiapkan diri sebelum lulus ke dunia kerja.',
  ];

  // ─── HANDLERS ────────────────────────────────────────────
  const toggleSkill = (skill) => {
    const current = Array.isArray(data.skills_list) ? data.skills_list : [];
    if (current.includes(skill)) {
      setData('skills_list', current.filter(s => s !== skill));
    } else {
      setData('skills_list', [...current, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e?.preventDefault();
    const trimmed = customSkill.trim();
    const current = Array.isArray(data.skills_list) ? data.skills_list : [];
    if (trimmed && !current.includes(trimmed)) {
      setData('skills_list', [...current, trimmed]);
      setCustomSkill('');
    }
  };

  const handleAddCustomRole = (e) => {
    e?.preventDefault();
    if (customRole.trim()) {
      setData('target_role', customRole.trim());
      setCustomRole('');
    }
  };

  const handleAvatarChange = (file) => {
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // Step Motion Variants with Custom Direction
  const stepVariants = {
    initial: (dir) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      transition: { duration: 0.22, ease: 'easeIn' },
    }),
  };

  // Step Validations & Directional Navigation
  const handleNextStep1 = () => {
    setStepError('');
    if (!data.name.trim()) return setStepError('Silakan isi Nama Lengkap kamu.');
    if (!data.email.trim() || !data.email.includes('@')) return setStepError('Silakan isi alamat email yang valid.');
    if (!data.password || data.password.length < 8) return setStepError('Kata sandi minimal 8 karakter.');
    setDirection(1);
    setStep(2);
  };

  const handleNextStep2 = () => {
    setStepError('');
    if (!data.education) return setStepError('Silakan pilih atau isi pendidikan kamu.');
    setDirection(1);
    setStep(3);
  };

  const handleNextStep3 = () => {
    setStepError('');
    if (!data.target_role) return setStepError('Silakan pilih atau isi target posisi / role impian kamu.');
    if (!data.skills_list || data.skills_list.length === 0) return setStepError('Silakan pilih atau tambahkan minimal 1 keahlian.');
    setDirection(1);
    setStep(4);
  };

  const handleNextStep4 = () => {
    setStepError('');
    if (!data.career_goal || data.career_goal.trim().length < 10) return setStepError('Ceritakan sedikit target karir kamu (minimal 10 karakter).');
    setDirection(1);
    setStep(5);
  };

  const handlePrevStep = (targetStep) => {
    setStepError('');
    setDirection(-1);
    setStep(targetStep);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRobotModal('loading');
    setRegisterErrorMsg('');

    if (typeof window !== 'undefined') {
      localStorage.removeItem('careerai_welcome_agreed');
      localStorage.removeItem('careerai_saved_jobs');
      sessionStorage.removeItem('careerai_saved_jobs');
      sessionStorage.removeItem('careerai_auth_user_id');
      sessionStorage.setItem('careerai_just_registered', 'true');
    }

    // Sync location and work_mode to form data before submit
    setData(prev => ({ ...prev, location, work_mode: workMode }));

    // Safety watchdog: In case of edge network hang, auto-check after 5s
    const safetyTimer = setTimeout(() => {
      if (document.cookie.includes('careerai_session') || document.cookie.includes('XSRF-TOKEN')) {
        window.location.href = '/dashboard';
      }
    }, 5000);

    post('/register', {
      onError: (errs) => {
        clearTimeout(safetyTimer);
        const msg = Object.values(errs)[0] || 'Gagal mendaftar. Silakan periksa kembali data kamu.';
        setRegisterErrorMsg(msg);
        setRobotModal('error');
      },
      onSuccess: () => {
        clearTimeout(safetyTimer);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('careerai_welcome_agreed');
          sessionStorage.setItem('careerai_just_registered', 'true');
        }
        setRobotModal('success');
      },
      onFinish: () => {
        clearTimeout(safetyTimer);
      },
    });
  };

  const totalSteps = 5;
  const progressPercent = Math.round((step / totalSteps) * 100);

  // Input style helper
  const inputStyle = {
    width: '100%', padding: '12px 14px 12px 42px', borderRadius: 12,
    background: '#0B1128', border: '1px solid rgba(255,255,255,.14)',
    color: '#F8FAFC', fontSize: 13, outline: 'none',
  };

  return (
    <>
      <Head title="Daftar Akun — AyoKerja" />
      <AuthRobotModal
        show={robotModal !== null}
        type={robotModal || 'loading'}
        title={
          robotModal === 'loading'
            ? 'Menyiapkan Akun & Profil AI...'
            : robotModal === 'success'
            ? 'Registrasi Berhasil!'
            : 'Gagal Mendaftar'
        }
        message={
          robotModal === 'loading'
            ? 'Mohon tunggu sejenak, AyoKerja sedang menyimpan profil dan memori karir kamu...'
            : robotModal === 'success'
            ? 'Selamat datang! Memori AI kamu telah aktif. Mengalihkan ke dashboard...'
            : (registerErrorMsg || errors.name || errors.email || errors.password || errors.general || 'Gagal mendaftar. Silakan periksa kembali data kamu.')
        }
        onClose={() => setRobotModal(null)}
      />

      <AuthRobotModal
        show={authNavModal !== null}
        type="loading"
        title="Membuka Halaman Login..."
        message="Mohon tunggu sejenak, mengalihkan ke sistem otentikasi AyoKerja..."
        onClose={() => setAuthNavModal(null)}
      />

      {/* Main Background */}
      <div style={{
        minHeight: '100vh',
        position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '30px 16px',
      }}>

        <AnimatedBackground />

        {/* Main Wrapper */}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* TOP NAV */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="reg-nav"
          >
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src="/assets/ayokerja-logo.png" alt="AyoKerja Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(2.2)' }} />
              </div>
              <div>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900, fontSize: 20, color: '#F8FAFC' }}>
                  AyoKerja
                </div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {t('header.subtitle', 'Asisten Karier Impian')}
                </div>
              </div>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <LanguageSwitcher compact={true} />
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#94A3B8' }}>{t('auth.register.hasAccount', 'Sudah punya akun?')}</span>
              <a href="/login" onClick={handleGoToLogin} style={{
                padding: '8px 18px', borderRadius: 10,
                background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)',
                color: '#C4B5FD', fontSize: 12, fontWeight: 700, textDecoration: 'none',
                transition: 'all 0.2s', cursor: 'pointer',
              }}>
                {t('nav.login', 'Masuk')}
              </a>
            </div>
          </motion.div>

          {/* MAIN TWO-COLUMN GRID */}
          <div className="reg-grid">

            {/* LEFT: Brand & Live AI Preview */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="reg-left-panel"
            >
              {/* Title Card */}
              <div style={{ padding: 24, borderRadius: 24, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 99, background: 'rgba(45,212,191,0.15)', border: '1px solid rgba(45,212,191,0.3)', color: '#2DD4BF', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                  <Brain size={14} /> Onboarding Bertenaga AI
                </div>
                <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 26, fontWeight: 900, lineHeight: 1.2, color: '#F1F5F9', marginBottom: 12, letterSpacing: '-0.5px' }}>
                  Daftar Sekali,<br />
                  <span style={{ background: 'linear-gradient(90deg, #2DD4BF, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    AI Langsung Paham Profilmu!
                  </span>
                </h1>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                  Data yang kamu isi akan otomatis diingat oleh AyoKerja. Saat masuk ke Dashboard, AI sudah siap membantu tanpa perlu ditanya dari awal!
                </p>
              </div>

              {/* Live AI Memory Card */}
              <motion.div
                animate={{ borderColor: ['rgba(45,212,191,0.3)', 'rgba(139,92,246,0.4)', 'rgba(45,212,191,0.3)'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ padding: 24, borderRadius: 24, background: 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(45,212,191,0.12),rgba(15,23,42,0.85))', backdropFilter: 'blur(24px)', border: '1px solid rgba(45,212,191,0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ width: 10, height: 10, borderRadius: 99, background: '#2DD4BF', boxShadow: '0 0 10px #2DD4BF' }}
                    />
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 800, color: '#2DD4BF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Pratinjau Memori AyoKerja — Live
                    </span>
                  </div>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: '#94A3B8', background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: 6 }}>
                    Sync: Aktif
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Avatar + Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 13, background: avatarPreview ? 'transparent' : 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#C4B5FD', flexShrink: 0, overflow: 'hidden' }}>
                      {avatarPreview ? <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (data.name ? data.name.charAt(0).toUpperCase() : '?')}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, fontWeight: 800, color: '#F1F5F9' }}>{data.name || 'Nama Kamu'}</div>
                      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: '#94A3B8' }}>{data.experience_level} • {location || 'Lokasi belum diisi'}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ padding: 12, borderRadius: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      { label: 'Target Role', value: data.target_role || '—', color: '#2DD4BF' },
                      { label: 'Mode Kerja', value: workMode, color: '#C4B5FD' },
                      { label: 'Pendidikan', value: data.education ? data.education.split(' — ')[0].split('/')[0].trim() : '—', color: '#94A3B8' },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, alignItems: 'center' }}>
                        <span style={{ color: '#64748B', fontWeight: 600 }}>{label}:</span>
                        <span style={{ color, fontWeight: 700, fontSize: 11, maxWidth: '60%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Skills tags */}
                  {Array.isArray(data.skills_list) && data.skills_list.length > 0 && (
                    <div>
                      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Keahlian Terpilih:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {data.skills_list.slice(0, 6).map(sk => (
                          <span key={sk} style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(45,212,191,.15)', border: '1px solid rgba(45,212,191,.3)', color: '#2DD4BF', fontSize: 10, fontWeight: 700 }}>{sk}</span>
                        ))}
                        {data.skills_list.length > 6 && (
                          <span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,.05)', color: '#64748B', fontSize: 10 }}>+{data.skills_list.length - 6} lainnya</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Career Goal Preview */}
                  {data.career_goal && (
                    <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                      <div style={{ fontSize: 10, color: '#8B5CF6', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MessageSquare size={12} /> Cerita ke AyoKerja:
                      </div>
                      <p style={{ margin: 0, fontStyle: 'italic', color: '#94A3B8', fontSize: 11, lineHeight: 1.5 }}>
                        "{data.career_goal.slice(0, 100)}{data.career_goal.length > 100 ? '...' : ''}"
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Benefits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: Target, text: 'AI langsung tahu target karirmu tanpa ditanya ulang', color: '#EC4899' },
                  { icon: FileText, text: 'Rekomendasi CV & lowongan sesuai profilmu secara personal', color: '#3B82F6' },
                  { icon: Rocket, text: 'Roadmap karir yang disesuaikan dengan impian dan kondisimu', color: '#8B5CF6' },
                ].map(({ icon: IconComponent, text, color }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                    <IconComponent size={16} style={{ color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#CBD5E1', fontWeight: 500 }}>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT: Form Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="reg-right-panel"
            >
              <div style={{ background: 'linear-gradient(135deg,rgba(139,92,246,.35),rgba(79,124,255,.3),rgba(45,212,191,.28))', borderRadius: 28, padding: 1, boxShadow: '0 30px 80px rgba(0,0,0,.6),0 0 60px rgba(139,92,246,.15)' }}>
                <div className="reg-card-inner">

                  {/* Top shimmer line */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(139,92,246,.5), rgba(45,212,191,.5), transparent)' }} />

                  {/* PROGRESS HEADER */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <motion.div
                          key={step}
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                          style={{ width: 28, height: 28, borderRadius: 9, background: 'linear-gradient(135deg,#8B5CF6,#14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff', boxShadow: '0 0 14px rgba(45,212,191,0.6)' }}
                        >
                          {step}
                        </motion.div>
                        <div>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 900, color: '#2DD4BF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            LANGKAH {step} DARI {totalSteps}
                          </div>
                          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, fontWeight: 800, color: '#F1F5F9' }}>
                            {step === 1 && '1. Profil & Akses Akun'}
                            {step === 2 && '2. Pendidikan & Status Karir'}
                            {step === 3 && '3. Target & Keahlian'}
                            {step === 4 && '4. Mode Kerja & Cerita Karir'}
                            {step === 5 && '5. Konfirmasi & Buat Akun'}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 900, color: '#2DD4BF' }}>{progressPercent}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <motion.div
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #8B5CF6, #4F7CFF, #2DD4BF)', boxShadow: '0 0 12px rgba(45,212,191,0.8)' }}
                      />
                    </div>
                    {/* Step pills */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                      {['Akun', 'Pendidikan', 'Keahlian', 'Karir', 'Selesai'].map((lbl, idx) => {
                        const sNum = idx + 1;
                        const isActive = sNum === step;
                        const isDone = sNum < step;
                        return (
                          <button
                            key={lbl}
                            type="button"
                            onClick={() => { if (isDone) setStep(sNum); }}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: isDone ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <motion.div
                              animate={{ scale: isActive ? [1, 1.15, 1] : 1 }}
                              transition={{ duration: 0.6, repeat: isActive ? Infinity : 0 }}
                              style={{ width: 16, height: 16, borderRadius: 99, background: isActive ? '#2DD4BF' : isDone ? '#8B5CF6' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 900, color: '#fff', boxShadow: isActive ? '0 0 10px #2DD4BF' : 'none' }}
                            >
                              {isDone ? '✓' : sNum}
                            </motion.div>
                            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, fontWeight: isActive ? 800 : 600, color: isActive ? '#2DD4BF' : isDone ? '#C4B5FD' : '#475569' }}>
                              {lbl}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ERROR BOX */}
                  <AnimatePresence>
                    {(errors.name || errors.email || errors.password || errors.general || stepError) && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ padding: '10px 14px', borderRadius: 12, marginBottom: 16, background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.4)', color: '#FCA5A5', fontSize: 12, fontFamily: "'Inter',sans-serif", display: 'flex', alignItems: 'flex-start', gap: 8 }}
                      >
                        <ShieldAlert size={16} style={{ flexShrink: 0, color: '#EF4444', marginTop: 1 }} />
                        <div>{errors.name || errors.email || errors.password || errors.general || stepError}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* FORM WIZARD */}
                  <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait" custom={direction}>

                      {/* ═══════════════════════════════════════ */}
                      {/* STEP 1: Profil & Akses Akun             */}
                      {/* ═══════════════════════════════════════ */}
                      {step === 1 && (
                        <motion.div key="step1" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                          {/* Avatar Upload */}
                          <AvatarUpload preview={avatarPreview} onFileChange={handleAvatarChange} />

                          {/* Nama */}
                          <div>
                            <label style={{ display: 'block', fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nama Lengkap *</label>
                            <div style={{ position: 'relative' }}>
                              <UserIcon size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                              <input
                                type="text" required autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan nama lengkap kamu"
                                style={{ ...inputStyle, transition: 'border-color 0.2s, box-shadow 0.2s' }}
                                onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,.6)'; e.target.style.boxShadow = '0 0 0 2px rgba(139,92,246,.2)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,.14)'; e.target.style.boxShadow = 'none'; }}
                              />
                            </div>
                          </div>

                          {/* Email */}
                          <div>
                            <label style={{ display: 'block', fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Alamat Email *</label>
                            <div style={{ position: 'relative' }}>
                              <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                              <input
                                type="email" required autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="contoh: nama@domain.com"
                                style={{ ...inputStyle, transition: 'border-color 0.2s, box-shadow 0.2s' }}
                                onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,.6)'; e.target.style.boxShadow = '0 0 0 2px rgba(139,92,246,.2)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,.14)'; e.target.style.boxShadow = 'none'; }}
                              />
                            </div>
                          </div>

                          {/* Password */}
                          <div>
                            <label style={{ display: 'block', fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Kata Sandi *</label>
                            <div style={{ position: 'relative' }}>
                              <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                              <input
                                type={showPwd ? 'text' : 'password'} required minLength={8} autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Minimal 8 karakter"
                                style={{ ...inputStyle, paddingRight: 46, transition: 'border-color 0.2s, box-shadow 0.2s' }}
                                onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,.6)'; e.target.style.boxShadow = '0 0 0 2px rgba(139,92,246,.2)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,.14)'; e.target.style.boxShadow = 'none'; }}
                              />
                              <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', padding: 0 }}>
                                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                              </button>
                            </div>
                            <PasswordStrength password={data.password} />
                          </div>

                          {/* Lokasi */}
                          <div>
                            <label style={{ display: 'block', fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              Lokasi / Domisili <span style={{ color: '#475569', fontWeight: 500 }}>(Opsional)</span>
                            </label>
                            <LocationPicker value={location} onChange={(val) => { setLocation(val); setData('location', val); }} />
                          </div>

                          <motion.button
                            type="button"
                            onClick={handleNextStep1}
                            whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(139,92,246,0.5)' }}
                            whileTap={{ scale: 0.98 }}
                            style={{ marginTop: 8, width: '100%', padding: '13px 20px', borderRadius: 14, background: 'linear-gradient(135deg, #8B5CF6, #4F7CFF)', border: 'none', color: '#FFF', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(139,92,246,0.4)' }}
                          >
                            <span>Lanjut ke Pendidikan & Karir</span> <ArrowRight size={16} />
                          </motion.button>
                        </motion.div>
                      )}

                      {/* ═══════════════════════════════════════ */}
                      {/* STEP 2: Pendidikan & Status Karir       */}
                      {/* ═══════════════════════════════════════ */}
                      {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                          {/* Pendidikan */}
                          <div>
                            <label style={{ display: 'block', fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              Pendidikan Terakhir / Sedang Ditempuh *
                            </label>
                            <SearchableDropdown
                              value={data.education}
                              onChange={(val) => setData('education', val)}
                              options={EDUCATION_OPTIONS}
                              placeholder="Pilih atau ketik pendidikanmu..."
                              icon={GraduationCap}
                              allowCustom={true}
                            />
                          </div>

                          {/* Level Karir */}
                          <div>
                            <label style={{ display: 'block', fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              Status & Level Karir Saat Ini *
                            </label>
                            <div className="reg-options-grid">
                              {[
                                { lvl: 'Mahasiswa Aktif', desc: 'Sedang berkuliah', icon: GraduationCap, color: '#4F7CFF' },
                                { lvl: 'Fresh Graduate', desc: 'Baru lulus (0-1 Thn)', icon: Sprout, color: '#2DD4BF' },
                                { lvl: 'Junior (0-2 Thn)', desc: 'Pengalaman 0-2 Thn', icon: Star, color: '#F59E0B' },
                                { lvl: 'Mid-Level (2-5 Thn)', desc: 'Pengalaman 2-5 Thn', icon: Flame, color: '#EC4899' },
                                { lvl: 'Senior (5+ Thn)', desc: 'Pengalaman 5+ Thn', icon: Gem, color: '#8B5CF6' },
                                { lvl: 'Career Switcher', desc: 'Pindah bidang karir', icon: Shuffle, color: '#3B82F6' },
                                { lvl: 'Freelancer / Mandiri', desc: 'Bekerja sendiri', icon: Globe, color: '#06B6D4' },
                                { lvl: 'Kembali Bekerja', desc: 'Setelah jeda karir', icon: RefreshCw, color: '#10B981' },
                              ].map(({ lvl, desc, icon: IconComponent, color }) => {
                                const isSelected = data.experience_level === lvl;
                                return (
                                  <motion.button
                                    key={lvl}
                                    type="button"
                                    onClick={() => setData('experience_level', lvl)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{ padding: '9px 10px', borderRadius: 11, border: '1px solid', borderColor: isSelected ? '#2DD4BF' : 'rgba(255,255,255,.08)', background: isSelected ? 'rgba(45,212,191,.15)' : 'rgba(255,255,255,.03)', color: isSelected ? '#2DD4BF' : '#94A3B8', cursor: 'pointer', textAlign: 'left', transition: 'all .2s' }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                                      <IconComponent size={14} style={{ color: isSelected ? '#2DD4BF' : color, flexShrink: 0 }} />
                                      <span style={{ fontSize: 11, fontWeight: 800 }}>{lvl}</span>
                                    </div>
                                    <div style={{ fontSize: 10, color: isSelected ? 'rgba(45,212,191,.7)' : '#64748B' }}>{desc}</div>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                            <button type="button" onClick={() => handlePrevStep(1)} style={{ padding: '12px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#CBD5E1', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>← Kembali</button>
                            <motion.button type="button" onClick={handleNextStep2} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1, padding: '12px 20px', borderRadius: 12, background: 'linear-gradient(135deg, #8B5CF6, #4F7CFF)', border: 'none', color: '#FFF', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                              <span>Lanjut ke Target & Keahlian</span> <ArrowRight size={16} />
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {/* ═══════════════════════════════════════ */}
                      {/* STEP 3: Target Role & Skills            */}
                      {/* ═══════════════════════════════════════ */}
                      {step === 3 && (
                        <motion.div key="step3" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                          {/* Target Role */}
                          <div>
                            <label style={{ display: 'block', fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              Target Posisi / Role Impian *
                            </label>
                            {/* Selected badge */}
                            {data.target_role && (
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 99, background: 'rgba(139,92,246,.25)', border: '1px solid rgba(139,92,246,.5)', marginBottom: 8 }}
                              >
                                <Check size={11} style={{ color: '#C4B5FD' }} />
                                <span style={{ color: '#C4B5FD', fontSize: 12, fontWeight: 700 }}>{data.target_role}</span>
                                <button type="button" onClick={() => setData('target_role', '')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B5CF6', display: 'flex', alignItems: 'center', padding: 0, marginLeft: 2 }}><X size={11} /></button>
                              </motion.div>
                            )}
                            <div className="reg-options-grid" style={{ maxHeight: 220, overflowY: 'auto', paddingRight: 4 }}>
                              {TARGET_ROLES.map((r) => {
                                const isSelected = data.target_role === r.id;
                                const IconComponent = r.icon;
                                return (
                                  <motion.button
                                    key={r.id}
                                    type="button"
                                    onClick={() => setData('target_role', r.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{ padding: '8px 9px', borderRadius: 10, border: '1px solid', borderColor: isSelected ? '#8B5CF6' : 'rgba(255,255,255,.08)', background: isSelected ? 'rgba(139,92,246,.22)' : 'rgba(255,255,255,.03)', color: isSelected ? '#C4B5FD' : '#94A3B8', cursor: 'pointer', textAlign: 'left', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, transition: 'all .2s' }}
                                  >
                                    <IconComponent size={14} style={{ flexShrink: 0, color: isSelected ? '#C4B5FD' : r.color }} />
                                    <div>
                                      <div style={{ fontSize: 11, lineHeight: 1.2 }}>{r.id.split(' / ')[0]}</div>
                                      <div style={{ fontSize: 9, color: isSelected ? 'rgba(196,181,253,.6)' : '#64748B', fontWeight: 500, marginTop: 1, lineHeight: 1.2 }}>{r.desc}</div>
                                    </div>
                                  </motion.button>
                                );
                              })}
                            </div>
                            {/* Custom Role */}
                            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                              <div style={{ position: 'relative', flex: 1 }}>
                                <Target size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                <input
                                  type="text"
                                  value={customRole}
                                  onChange={(e) => setCustomRole(e.target.value)}
                                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomRole(); } }}
                                  placeholder="Atau ketik target role kamu sendiri..."
                                  style={{ width: '100%', padding: '9px 10px 9px 30px', borderRadius: 9, background: '#0B1128', border: '1px solid rgba(255,255,255,.14)', color: '#F8FAFC', fontSize: 11, outline: 'none' }}
                                />
                              </div>
                              <button type="button" onClick={handleAddCustomRole} disabled={!customRole.trim()} style={{ padding: '8px 13px', borderRadius: 9, background: 'rgba(139,92,246,.2)', border: '1px solid rgba(139,92,246,.35)', color: '#C4B5FD', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Pilih</button>
                            </div>
                          </div>

                          {/* Skills */}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                              <label style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Kemampuan / Keahlian ({Array.isArray(data.skills_list) ? data.skills_list.length : 0} dipilih)
                              </label>
                            </div>

                            {/* Selected Skills Chips */}
                            {Array.isArray(data.skills_list) && data.skills_list.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                                {data.skills_list.map(sk => (
                                  <motion.span
                                    key={sk}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    style={{ padding: '3px 9px', borderRadius: 7, background: 'rgba(45,212,191,.18)', border: '1px solid rgba(45,212,191,.4)', color: '#2DD4BF', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 }}
                                  >
                                    {sk}
                                    <button type="button" onClick={() => toggleSkill(sk)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2DD4BF', display: 'flex', alignItems: 'center', padding: 0 }}><X size={9} /></button>
                                  </motion.span>
                                ))}
                              </div>
                            )}

                            {/* Category Tabs */}
                            <div style={{ display: 'flex', gap: 5, overflowX: 'auto', marginBottom: 8, paddingBottom: 4 }}>
                              {Object.keys(SKILLS_CATEGORIES).map(cat => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => setActiveSkillCat(cat)}
                                  style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid', whiteSpace: 'nowrap', borderColor: activeSkillCat === cat ? '#2DD4BF' : 'rgba(255,255,255,.1)', background: activeSkillCat === cat ? 'rgba(45,212,191,.15)' : 'rgba(255,255,255,.04)', color: activeSkillCat === cat ? '#2DD4BF' : '#64748B', fontSize: 10, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>

                            {/* Skills Grid */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8, maxHeight: 90, overflowY: 'auto' }}>
                              {SKILLS_CATEGORIES[activeSkillCat].map(sk => {
                                const isSel = Array.isArray(data.skills_list) && data.skills_list.includes(sk);
                                return (
                                  <button
                                    key={sk}
                                    type="button"
                                    onClick={() => toggleSkill(sk)}
                                    style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid', borderColor: isSel ? '#2DD4BF' : 'rgba(255,255,255,.08)', background: isSel ? 'rgba(45,212,191,.2)' : 'rgba(255,255,255,.03)', color: isSel ? '#2DD4BF' : '#94A3B8', cursor: 'pointer', fontSize: 11, fontWeight: 700, transition: 'all .15s' }}
                                  >
                                    {isSel ? '✓ ' : '+ '}{sk}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Custom Skill */}
                            <div style={{ display: 'flex', gap: 6 }}>
                              <input
                                type="text"
                                value={customSkill}
                                onChange={(e) => setCustomSkill(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomSkill(); } }}
                                placeholder="+ Tambah keahlian lainnya..."
                                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: '#0B1128', border: '1px solid rgba(255,255,255,.14)', color: '#F8FAFC', fontSize: 12, outline: 'none' }}
                              />
                              <button type="button" onClick={handleAddCustomSkill} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#F8FAFC', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Tambah</button>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                            <button type="button" onClick={() => handlePrevStep(2)} style={{ padding: '12px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#CBD5E1', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>← Kembali</button>
                            <motion.button type="button" onClick={handleNextStep3} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1, padding: '12px 20px', borderRadius: 12, background: 'linear-gradient(135deg, #8B5CF6, #4F7CFF)', border: 'none', color: '#FFF', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                              <span>Lanjut ke Cerita Karir</span> <ArrowRight size={16} />
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {/* ═══════════════════════════════════════ */}
                      {/* STEP 4: Mode Kerja & Cerita Karir       */}
                      {/* ═══════════════════════════════════════ */}
                      {step === 4 && (
                        <motion.div key="step4" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                          {/* Mode Kerja */}
                          <div>
                            <label style={{ display: 'block', fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              Preferensi Mode Kerja
                            </label>
                            <div className="reg-options-grid">
                              {[
                                { val: 'Remote / Full Remote', icon: Globe, desc: 'Kerja dari mana saja', color: '#3B82F6' },
                                { val: 'Hybrid / Fleksibel', icon: Laptop, desc: 'Kombinasi WFH & kantor', color: '#8B5CF6' },
                                { val: 'On-site / Kantor', icon: Building2, desc: 'Kerja di kantor langsung', color: '#F59E0B' },
                                { val: 'Freelance / Proyek', icon: Zap, desc: 'Proyek bebas, multi-klien', color: '#EC4899' },
                                { val: 'Remote Luar Negeri', icon: Send, desc: 'Target kerja overseas', color: '#06B6D4' },
                                { val: 'Wirausaha / Startup', icon: Rocket, desc: 'Bangun bisnis sendiri', color: '#10B981' },
                              ].map(({ val, icon: IconComponent, desc, color }) => {
                                const isSel = workMode === val;
                                return (
                                  <motion.button
                                    key={val}
                                    type="button"
                                    onClick={() => { setWorkMode(val); setData('work_mode', val); }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{ padding: '9px 10px', borderRadius: 11, border: '1px solid', borderColor: isSel ? '#2DD4BF' : 'rgba(255,255,255,.08)', background: isSel ? 'rgba(45,212,191,.15)' : 'rgba(255,255,255,.03)', color: isSel ? '#2DD4BF' : '#94A3B8', cursor: 'pointer', textAlign: 'left', transition: 'all .2s' }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                                      <IconComponent size={14} style={{ color: isSel ? '#2DD4BF' : color, flexShrink: 0 }} />
                                      <span style={{ fontSize: 11, fontWeight: 800 }}>{val}</span>
                                    </div>
                                    <div style={{ fontSize: 9, color: isSel ? 'rgba(45,212,191,.7)' : '#64748B' }}>{desc}</div>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Cerita Karir */}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                              <label style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <MessageSquare size={13} style={{ color: '#2DD4BF' }} />
                                Cerita Target Karir ke AyoKerja
                              </label>
                              <motion.span
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{ fontSize: 10, color: '#2DD4BF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                              >
                                <Sparkles size={11} style={{ color: '#F59E0B' }} />
                                Masuk Memori AI
                              </motion.span>
                            </div>
                            <textarea
                              rows={4}
                              value={data.career_goal}
                              onChange={(e) => setData('career_goal', e.target.value)}
                              placeholder="Ceritakan target karir, kendala yang kamu hadapi, ekspektasi gaji, atau impian jangka panjang kamu..."
                              style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#0B1128', border: '1px solid rgba(255,255,255,.14)', color: '#F8FAFC', fontSize: 12, outline: 'none', lineHeight: 1.6, resize: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                              onFocus={e => { e.target.style.borderColor = 'rgba(45,212,191,.6)'; e.target.style.boxShadow = '0 0 0 2px rgba(45,212,191,.2)'; }}
                              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,.14)'; e.target.style.boxShadow = 'none'; }}
                            />
                            {/* Preset Buttons */}
                            <div style={{ marginTop: 8 }}>
                              <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 5 }}>Atau pilih template cepat:</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {CURHAT_PRESETS.map((p, i) => (
                                  <motion.button
                                    key={i}
                                    type="button"
                                    onClick={() => setData('career_goal', p)}
                                    whileHover={{ x: 4, background: 'rgba(255,255,255,.06)' }}
                                    style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#94A3B8', fontSize: 10, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                                  >
                                    "{p}"
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                            <button type="button" onClick={() => handlePrevStep(3)} style={{ padding: '12px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#CBD5E1', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>← Kembali</button>
                            <motion.button type="button" onClick={handleNextStep4} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1, padding: '12px 20px', borderRadius: 12, background: 'linear-gradient(135deg, #8B5CF6, #4F7CFF)', border: 'none', color: '#FFF', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                              <span>Lihat Ringkasan & Konfirmasi</span> <ArrowRight size={16} />
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {/* ═══════════════════════════════════════ */}
                      {/* STEP 5: Konfirmasi Final                */}
                      {/* ═══════════════════════════════════════ */}
                      {step === 5 && (
                        <motion.div key="step5" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                          {/* Ready Banner */}
                          <motion.div
                            animate={{ boxShadow: ['0 0 20px rgba(45,212,191,0.2)', '0 0 40px rgba(45,212,191,0.4)', '0 0 20px rgba(45,212,191,0.2)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ padding: 16, borderRadius: 16, background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.3)', display: 'flex', alignItems: 'center', gap: 12 }}
                          >
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                              style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#2DD4BF,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                            >
                              <CheckCircle2 size={22} color="#fff" />
                            </motion.div>
                            <div>
                              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 800, color: '#F1F5F9' }}>Profil Siap Diinisialisasi!</div>
                              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: '#94A3B8' }}>Akun kamu akan dibuat & AyoKerja langsung mengenali profilmu.</div>
                            </div>
                          </motion.div>

                          {/* Summary */}
                          <div style={{ padding: 16, borderRadius: 14, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {/* Avatar + Name */}
                            {avatarPreview && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,.06)', marginBottom: 2 }}>
                                <img src={avatarPreview} alt="Avatar" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(139,92,246,.5)' }} />
                                <div>
                                  <div style={{ fontSize: 13, fontWeight: 800, color: '#F1F5F9' }}>{data.name}</div>
                                  <div style={{ fontSize: 11, color: '#64748B' }}>{data.email}</div>
                                </div>
                              </div>
                            )}
                            {[
                              { label: 'Nama', value: data.name },
                              { label: 'Email', value: data.email },
                              { label: 'Pendidikan', value: data.education },
                              { label: 'Level Karir', value: data.experience_level },
                              { label: 'Target Role', value: data.target_role, color: '#2DD4BF' },
                              { label: 'Lokasi', value: location || '—' },
                              { label: 'Mode Kerja', value: workMode, color: '#C4B5FD' },
                              { label: 'Keahlian', value: Array.isArray(data.skills_list) ? `${data.skills_list.slice(0, 4).join(', ')}${data.skills_list.length > 4 ? ` +${data.skills_list.length - 4}` : ''}` : '—', color: '#94A3B8' },
                            ].map(({ label, value, color }) => (
                              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, alignItems: 'center' }}>
                                <span style={{ color: '#64748B', fontWeight: 600 }}>{label}:</span>
                                <span style={{ color: color || '#F1F5F9', fontWeight: 700, fontSize: 11, maxWidth: '60%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || '—'}</span>
                              </div>
                            ))}
                          </div>

                          <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
                            <button type="button" onClick={() => handlePrevStep(4)} style={{ padding: '12px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#CBD5E1', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>← Edit</button>
                            <motion.button
                              id="register-submit"
                              type="submit"
                              disabled={processing}
                              whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(45,212,191,0.6)' }}
                              whileTap={{ scale: 0.98 }}
                              style={{ flex: 1, padding: '14px 20px', borderRadius: 14, background: 'linear-gradient(135deg,#14B8A6 0%,#8B5CF6 100%)', border: 'none', color: '#FFF', fontSize: 14, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 0 30px rgba(45,212,191,0.5)' }}
                            >
                              {processing ? <><span>Mendaftar...</span></> : <><span>Daftar & Masuk ke Dashboard</span> <Rocket size={18} /></>}
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </form>

                  {/* Footer Security */}
                  <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={16} style={{ color: '#2DD4BF', flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: '#64748B' }}>
                      Data onboarding langsung diingat oleh AyoKerja saat akun dibuat. Aman & terenkripsi penuh.
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Spin keyframe & Responsive Mobile CSS */}
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }

          .reg-grid {
            display: grid;
            grid-template-columns: 1fr 1.15fr;
            gap: 24px;
            align-items: start;
          }
          .reg-left-panel {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .reg-right-panel {
            width: 100%;
          }
          .reg-options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 7px;
          }
          .reg-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 22px;
            border-radius: 18px;
            background: rgba(15,23,42,0.75);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.08);
          }
          .reg-card-inner {
            background: rgba(7,11,26,.96);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            border-radius: 27px;
            padding: 24px 22px;
            position: relative;
            overflow: hidden;
          }

          @media (max-width: 900px) {
            .reg-grid {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
            }
            .reg-left-panel {
              order: 2 !important;
            }
            .reg-right-panel {
              order: 1 !important;
            }
            .reg-nav {
              padding: 10px 14px !important;
            }
            .reg-card-inner {
              padding: 18px 14px !important;
            }
          }

          @media (max-width: 520px) {
            .reg-options-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
