import React, { useState, useRef, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import FullscreenLoader from '../Components/FullscreenLoader';
import useBilingual from '../i18n/useBilingual';
import {
  Sparkles, Upload, FileText, CheckCircle2, AlertTriangle,
  Award, Briefcase, ExternalLink, ChevronRight,
  RefreshCw, Zap, Check, Search, X, Bot, MessageSquare,
  Brain, GraduationCap, Clock,
  Lightbulb, MapPin, DollarSign, Users, Info, TrendingUp, BarChart3, ChevronDown,
  Code, Palette, Smartphone, Megaphone, PenTool, Activity, ShieldCheck,
  Layers, Compass, Rocket, Sprout, Flame, Globe, Building2, HelpCircle, Filter,
  ArrowUpRight, Plus, Edit3, Camera,
  LayoutGrid, Package, Handshake, HeartPulse
} from 'lucide-react';

import DashboardLayout from '../Layouts/DashboardLayout';

// ─── Helpers ───────────────────────────────────────────────────────────────

function getScoreColor(score, L) {
  if (score >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-500', stroke: 'stroke-emerald-400', light: 'bg-emerald-500/10 border-emerald-500/30', label: L ? L('Sangat Baik (Siap Bersaing)', 'Excellent (Competitive)') : 'Sangat Baik' };
  if (score >= 60) return { text: 'text-amber-400', bg: 'bg-amber-500', stroke: 'stroke-amber-400', light: 'bg-amber-500/10 border-amber-500/30', label: L ? L('Kompetitif (Perlu Optimasi)', 'Competitive (Needs Polish)') : 'Kompetitif' };
  return { text: 'text-rose-400', bg: 'bg-rose-500', stroke: 'stroke-rose-400', light: 'bg-rose-500/10 border-rose-500/30', label: L ? L('Perlu Tambahan Kata Kunci', 'Needs Keywords') : 'Perlu Ditingkatkan' };
}

function getVerdictStyle(badge) {
  if (badge === 'success') return { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-300' };
  if (badge === 'warning') return { bg: 'bg-amber-500/15', border: 'border-amber-500/40', text: 'text-amber-300' };
  return { bg: 'bg-rose-500/15', border: 'border-rose-500/40', text: 'text-rose-300' };
}

// ─── Circular Gauge ─────────────────────────────────────────────────────────

function ScoreGauge({ score, size = 148, strokeWidth = 10, L }) {
  const colors = getScoreColor(score, L);
  const r = (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" strokeWidth={strokeWidth} strokeLinecap="round"
          className={colors.stroke}
          style={{ strokeDasharray: circumference }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center">
        <motion.span className={`font-black ${colors.text} text-3xl sm:text-4xl leading-none`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          {score}
        </motion.span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ 100 ATS</span>
        <span className={`text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full mt-0.5 ${colors.light} ${colors.text}`}>
          {colors.label}
        </span>
      </div>
    </div>
  );
}

// ─── Progress Bar ────────────────────────────────────────────────────────────

function ScoreBar({ label, score, L }) {
  const colors = getScoreColor(score, L);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-300 font-semibold">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${colors.light}`}>{colors.label}</span>
          <span className={`text-xs font-black ${colors.text}`}>{score}%</span>
        </div>
      </div>
      <div className="w-full h-2.5 bg-slate-800/90 rounded-full overflow-hidden border border-slate-700/50">
        <motion.div
          className={`h-full rounded-full ${colors.bg}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  );
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────

function SkeletonPulse({ className = '' }) {
  return <div className={`animate-pulse bg-slate-800/70 rounded-xl ${className}`} />;
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <div className="w-36 h-36 rounded-full animate-pulse bg-gradient-to-tr from-slate-800 to-slate-700" />
            <SkeletonPulse className="h-6 w-32" />
          </div>
          <div className="flex-1 w-full space-y-4">
            <SkeletonPulse className="h-5 w-48" />
            <SkeletonPulse className="h-16 w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <SkeletonPulse className="h-3 w-3/4" />
                  <SkeletonPulse className="h-2 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <SkeletonPulse className="w-10 h-10 rounded-xl" />
              <SkeletonPulse className="h-5 w-40" />
            </div>
            {[...Array(4)].map((_, j) => (
              <SkeletonPulse key={j} className="h-10 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMPREHENSIVE ROLE DICTIONARY (IT, BUSINESS, CREATIVE, FINANCE, HR, ETC) ─

function getRoleOptions(L) {
  return [
    // ── TEKNOLOGI & IT ──
    { value: 'Software Engineer / Backend Dev', label: L('Backend Developer / Software Engineer', 'Backend Developer / Software Engineer'), desc: 'PHP, Laravel, Node.js, Python, Go, Java, REST API, MySQL', category: 'it_tech', icon: Code, color: '#3B82F6' },
    { value: 'Frontend Developer', label: L('Frontend Developer / Web Engineer', 'Frontend Developer / Web Engineer'), desc: 'React, Vue, Next.js, Tailwind CSS, TypeScript, JavaScript', category: 'it_tech', icon: Palette, color: '#EC4899' },
    { value: 'Full Stack Developer', label: L('Full Stack Web Developer', 'Full Stack Web Developer'), desc: 'Laravel + React, MERN, Next.js, Django, REST API, SQL', category: 'it_tech', icon: Zap, color: '#F59E0B' },
    { value: 'Mobile App Developer', label: L('Mobile App Developer (iOS/Android)', 'Mobile App Developer'), desc: 'Flutter, React Native, Kotlin, Swift, Mobile UI, Firebase', category: 'it_tech', icon: Smartphone, color: '#10B981' },
    { value: 'UI/UX Designer', label: L('UI/UX Designer & Product Designer', 'UI/UX & Product Designer'), desc: 'Figma, Wireframing, Prototyping, User Research, Design System', category: 'it_tech', icon: Sparkles, color: '#8B5CF6' },
    { value: 'DevOps & Cloud Engineer', label: L('DevOps & Cloud Engineer', 'DevOps & Cloud Engineer'), desc: 'Docker, Kubernetes, AWS, GCP, CI/CD, Linux, Terraform', category: 'it_tech', icon: Layers, color: '#06B6D4' },
    { value: 'QA / Software Tester', label: L('Quality Assurance (QA Tester)', 'Quality Assurance (QA Tester)'), desc: 'Manual & Automation Testing, Cypress, Selenium, Postman, Bug Tracking', category: 'it_tech', icon: ShieldCheck, color: '#14B8A6' },
    { value: 'Cybersecurity Specialist', label: L('Cybersecurity & Security Analyst', 'Cybersecurity Specialist'), desc: 'Penetration Testing, Ethical Hacking, SIEM, SOC, Network Security', category: 'it_tech', icon: ShieldCheck, color: '#EF4444' },
    { value: 'System Administrator & IT Support', label: L('IT Support & System Administrator', 'IT Support & SysAdmin'), desc: 'Troubleshooting, Windows Server, Linux, Active Directory, Hardware', category: 'it_tech', icon: Activity, color: '#64748B' },
    { value: 'Network Engineer', label: L('Network Engineer & Administrator', 'Network Engineer & Administrator'), desc: 'Cisco, Mikrotik, TCP/IP, VLAN, Firewall, VPN, Routing', category: 'it_tech', icon: Globe, color: '#0EA5E9' },
    { value: 'Database Administrator', label: L('Database Administrator (DBA)', 'Database Administrator (DBA)'), desc: 'MySQL, PostgreSQL, Oracle, MongoDB, Query Optimization, Backup', category: 'it_tech', icon: Layers, color: '#6366F1' },

    // ── DATA & KECERDASAN BUATAN ──
    { value: 'Data Analyst / Data Scientist', label: L('Data Analyst & Data Scientist', 'Data Analyst & Data Scientist'), desc: 'SQL, Python, Excel, Power BI, Tableau, Machine Learning, ETL', category: 'data_ai', icon: BarChart3, color: '#06B6D4' },
    { value: 'Business Intelligence Analyst', label: L('Business Intelligence (BI) Analyst', 'Business Intelligence (BI) Analyst'), desc: 'Power BI, Tableau, ETL, Data Warehousing, KPI Dashboards', category: 'data_ai', icon: TrendingUp, color: '#3B82F6' },
    { value: 'AI / Machine Learning Engineer', label: L('AI & Machine Learning Engineer', 'AI & Machine Learning Engineer'), desc: 'Python, PyTorch, TensorFlow, LLM, Computer Vision, NLP, RAG', category: 'data_ai', icon: Brain, color: '#A855F7' },

    // ── PEMASARAN & KONTEN ──
    { value: 'Digital Marketing / SEO', label: L('Digital Marketing Specialist', 'Digital Marketing Specialist'), desc: 'Google Ads, Meta Ads, SEO, SEM, Funnel, Campaign Management', category: 'marketing_content', icon: Megaphone, color: '#EF4444' },
    { value: 'SEO / SEM Specialist', label: L('SEO / SEM Specialist', 'SEO / SEM Specialist'), desc: 'Keyword Research, Technical SEO, On-Page/Off-Page, Ahrefs, Analytics', category: 'marketing_content', icon: Search, color: '#F97316' },
    { value: 'Social Media Specialist', label: L('Social Media Specialist / Manager', 'Social Media Specialist / Manager'), desc: 'Content Planning, Instagram, TikTok, Reels, Community Engagement', category: 'marketing_content', icon: Globe, color: '#EC4899' },
    { value: 'Copywriter / Content Creator', label: L('Copywriter & Content Writer', 'Copywriter & Content Writer'), desc: 'Copywriting, Artikel SEO, Storytelling, Scriptwriting, Content Plan', category: 'marketing_content', icon: PenTool, color: '#F97316' },
    { value: 'Public Relations / PR Specialist', label: L('Public Relations (PR) Specialist', 'Public Relations Specialist'), desc: 'Media Relations, Press Release, Brand Image, Corporate Communication', category: 'marketing_content', icon: Users, color: '#8B5CF6' },

    // ── DESAIN & MEDIA KREATIF ──
    { value: 'Graphic Designer', label: L('Graphic Designer / Desainer Grafis', 'Graphic Designer / Visual Artist'), desc: 'Photoshop, Illustrator, Canva, Branding, Typography, Visual Identity', category: 'design_creative', icon: Palette, color: '#EC4899' },
    { value: 'Video Editor & Motion Designer', label: L('Video Editor & Motion Designer', 'Video Editor & Motion Designer'), desc: 'Premiere Pro, After Effects, CapCut, DaVinci Resolve, Reels/TikTok', category: 'design_creative', icon: Camera, color: '#F43F5E' },
    { value: '3D Animator & Modeler', label: L('3D Animator & Modeler', '3D Animator & Modeler'), desc: 'Blender, Maya, 3ds Max, Texturing, Rendering, Character Rigging', category: 'design_creative', icon: Layers, color: '#8B5CF6' },

    // ── HRD, ADMIN & MANAJEMEN ──
    { value: 'HRD / Rekrutmen', label: L('HRD & Talent Acquisition Specialist', 'HR & Talent Acquisition Specialist'), desc: 'Rekrutmen, Sourcing, Interviewing, Job Posting, HRIS, People Ops', category: 'management_hr', icon: Users, color: '#10B981' },
    { value: 'Human Resources Generalist', label: L('HR Generalist / Personalia', 'HR Generalist / HR Ops'), desc: 'Payroll, BPJS, Hubungan Industrial, KPI, Onboarding, Administrasi HR', category: 'management_hr', icon: Users, color: '#059669' },
    { value: 'Staff Administrasi', label: L('Staff Administrasi Perkantoran', 'Office Administration Staff'), desc: 'Microsoft Office, Excel, Data Entry, Pengarsipan Dokumen, Korespondensi', category: 'management_hr', icon: FileText, color: '#3B82F6' },
    { value: 'General Affair / Operasional', label: L('General Affair & Ops Staff', 'General Affair & Operations'), desc: 'Pengadaan Inventaris, Fasilitas Kantor, Vendor, Operasional Gedung', category: 'management_hr', icon: Building2, color: '#64748B' },
    { value: 'Manajer / Team Lead', label: L('Project Manager / Scrum Master', 'Project Manager / Scrum Master'), desc: 'Agile, Scrum, JIRA, Trello, Leadership, Timeline, Budgeting', category: 'management_hr', icon: Briefcase, color: '#3B82F6' },
    { value: 'Product Manager', label: L('Product Manager', 'Product Manager'), desc: 'Product Strategy, PRD, Roadmap, User Stories, Sprint Planning', category: 'management_hr', icon: Rocket, color: '#F59E0B' },

    // ── KEUANGAN & AKUNTANSI ──
    { value: 'Finance / Akuntan', label: L('Staff Akuntansi / Akuntan', 'Accounting Staff / Accountant'), desc: 'Laporan Keuangan, Jurnal, Neraca, PSAK, Excel, Accurate, SAP', category: 'finance_accounting', icon: DollarSign, color: '#10B981' },
    { value: 'Finance Officer', label: L('Staff Keuangan (Finance Officer)', 'Finance Officer'), desc: 'Cash Flow, Budgeting, Invoicing, Rekonsiliasi Bank, Manajemen Dana', category: 'finance_accounting', icon: DollarSign, color: '#059669' },
    { value: 'Tax Consultant / Staf Pajak', label: L('Konsultan / Staf Perpajakan (Tax)', 'Tax Specialist / Consultant'), desc: 'PPh 21/23/Final, PPN, E-Faktur, E-SPT, Brevet Pajak A/B', category: 'finance_accounting', icon: FileText, color: '#D97706' },
    { value: 'Auditor Internal / Eksternal', label: L('Auditor Keuangan & Kepatuhan', 'Financial & Compliance Auditor'), desc: 'Audit Kepatuhan, Pengujian Substantif, Risk Assessment, Review Laporan', category: 'finance_accounting', icon: ShieldCheck, color: '#4F46E5' },

    // ── PENJUALAN & LAYANAN PELANGGAN ──
    { value: 'Sales Executive / B2B Sales', label: L('Sales Executive / Account Executive', 'Sales / Account Executive'), desc: 'B2B Sales, Negosiasi, Prospecting, Closing, Sales Funnel, CRM', category: 'sales_service', icon: Briefcase, color: '#EA580C' },
    { value: 'Business Development', label: L('Business Development Specialist', 'Business Development Specialist'), desc: 'Market Research, Kemitraan Bisnis, Ekspansi Pasar, Pitching', category: 'sales_service', icon: TrendingUp, color: '#2563EB' },
    { value: 'Customer Service / Call Center', label: L('Customer Service & Support', 'Customer Service & Support'), desc: 'Komunikasi Efektif, Handling Complaint, CRM, Zendesk, Live Chat', category: 'sales_service', icon: MessageSquare, color: '#0D9488' },

    // ── PENDIDIKAN & PELATIHAN ──
    { value: 'Guru / Dosen / Edukator', label: L('Guru / Tenaga Pendidik', 'Teacher / Educator'), desc: 'Kurikulum Merdeka, Manajemen Kelas, RPP, Evaluasi Belajar, E-Learning', category: 'education_training', icon: GraduationCap, color: '#8B5CF6' },
    { value: 'Dosen / Pengajar Akademik', label: L('Dosen & Akademisi Perguruan Tinggi', 'Lecturer / Academic Instructor'), desc: 'Tri Dharma PT, Riset Ilmiah, Publikasi Jurnal, Bimbingan Mahasiswa', category: 'education_training', icon: GraduationCap, color: '#6366F1' },
    { value: 'Instruktur Kursus / Corporate Trainer', label: L('Instruktur Pelatihan / Trainer', 'Corporate Trainer / Instructor'), desc: 'Penyusunan Modul, Public Speaking, Workshop Facilitation, Coaching', category: 'education_training', icon: Award, color: '#F59E0B' },

    // ── KESEHATAN & MEDIS ──
    { value: 'Dokter / Tenaga Kesehatan', label: L('Tenaga Medis / Perawat', 'Nurse / Medical Staff'), desc: 'SOP Pelayanan Pasien, Asuhan Keperawatan, Tanda Vital, STR Aktif', category: 'healthcare_medical', icon: Activity, color: '#EF4444' },
    { value: 'Apoteker / Farmasi', label: L('Apoteker & Tenaga Teknis Farmasi', 'Pharmacist / Pharmacy Staff'), desc: 'Dispensing Resep, Konseling Obat, Manajemen Stok Farmasi, BPOM', category: 'healthcare_medical', icon: Activity, color: '#10B981' },
    { value: 'Dokter Umum', label: L('Dokter Umum / Tenaga Medis Klinis', 'General Practitioner / Medical Doctor'), desc: 'Diagnosa Klinis, Pelayanan Rawat Jalan, Rekam Medis, STR / SIP Aktif', category: 'healthcare_medical', icon: Activity, color: '#DC2626' },
    { value: 'Ahli Gizi / Nutritionist', label: L('Ahli Gizi / Nutritionist', 'Nutritionist / Dietitian'), desc: 'Konsultasi Nutrisi, Perencanaan Menu, Edukasi Gizi Masyarakat', category: 'healthcare_medical', icon: Sprout, color: '#16A34A' },

    // ── LOGISTIK, F&B & TEKNIK ──
    { value: 'Staf Gudang & Logistik', label: L('Staf Gudang & Logistik', 'Warehouse & Logistics Staff'), desc: 'Stock Opname, Inventory Control, WMS, Surat Jalan, Picking & Packing', category: 'logistics_technical', icon: Building2, color: '#D97706' },
    { value: 'Supply Chain Specialist', label: L('Supply Chain & Procurement', 'Supply Chain & Procurement'), desc: 'Vendor Management, Pengadaan Barang, Logistik Distribusi, Negosiasi', category: 'logistics_technical', icon: Globe, color: '#2563EB' },
    { value: 'Barista / F&B Service', label: L('Barista & Layanan F&B', 'Barista & F&B Service'), desc: 'Espresso Machine, Manual Brew, Latte Art, Customer Hospitality, POS', category: 'logistics_technical', icon: Flame, color: '#B45309' },
    { value: 'Ahli K3 / HSE Officer', label: L('Ahli K3 (HSE Officer)', 'Health, Safety & Environment (HSE)'), desc: 'SOP Keselamatan Kerja, Audit K3, Investigasi Insiden, SMK3', category: 'logistics_technical', icon: ShieldCheck, color: '#CA8A04' },
    { value: 'Arsitek & Desain Interior', label: L('Arsitek & Desainer Interior', 'Architect & Interior Designer'), desc: 'AutoCAD, SketchUp, 3D Render, Gambar Kerja, Desain Ruang', category: 'logistics_technical', icon: Compass, color: '#7C3AED' },
    { value: 'Teknik Sipil / Pengawas Proyek', label: L('Teknik Sipil & Supervisor Proyek', 'Civil Engineer / Site Supervisor'), desc: 'RAB, Manajemen Proyek Konstruksi, Pengawasan Lapangan, Mutu Beton', category: 'logistics_technical', icon: Building2, color: '#475569' },
    { value: 'Wirausaha / Entrepreneur', label: L('Wirausaha / Bisnis Mandiri', 'Entrepreneur / Business Owner'), desc: 'Pengembangan Usaha, Strategi Penjualan, Manajemen Modal, Operasional', category: 'logistics_technical', icon: Rocket, color: '#F59E0B' },
    { value: 'Freelancer / Konsultan', label: L('Freelancer / Konsultan Bebas', 'Freelancer / Consultant'), desc: 'Manajemen Portofolio, Komunikasi Klien, Pengelolaan Proyek Mandiri', category: 'logistics_technical', icon: Globe, color: '#06B6D4' },
  ];
}

// ─── Searchable & Categorized Role Picker with Custom Support ───────────────

function RolePicker({ value, onChange, L }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const ref = useRef(null);

  const roleOptions = getRoleOptions(L);
  const selected = roleOptions.find((r) => r.value === value) || {
    value: value || 'Software Engineer / Backend Dev',
    label: value || 'Software Engineer / Backend Dev',
    desc: L('Posisi Kustom Pilihan Anda', 'Custom User-defined Position'),
    category: 'custom',
    icon: Briefcase,
    color: '#2DD4BF'
  };

  const categories = [
    { id: 'all', label: L('Semua Posisi', 'All Positions'), icon: LayoutGrid },
    { id: 'it_tech', label: L('IT & Software', 'IT & Software'), icon: Code },
    { id: 'data_ai', label: L('Data & AI', 'Data & AI'), icon: Brain },
    { id: 'marketing_content', label: L('Pemasaran & Konten', 'Marketing & Content'), icon: Megaphone },
    { id: 'design_creative', label: L('Desain & Media', 'Design & Media'), icon: Palette },
    { id: 'management_hr', label: L('HRD, Admin & Mgmt', 'HR, Admin & Mgmt'), icon: Users },
    { id: 'finance_accounting', label: L('Keuangan & Pajak', 'Finance & Tax'), icon: DollarSign },
    { id: 'sales_service', label: L('Sales & Layanan', 'Sales & Service'), icon: Handshake },
    { id: 'education_training', label: L('Pendidikan', 'Education'), icon: GraduationCap },
    { id: 'healthcare_medical', label: L('Medis & Kesehatan', 'Healthcare'), icon: HeartPulse },
    { id: 'logistics_technical', label: L('Logistik & Teknik', 'Logistics & Tech'), icon: Package },
  ];

  const filtered = roleOptions.filter((r) => {
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    const qLower = query.toLowerCase();
    const matchesQuery =
      !query ||
      r.label.toLowerCase().includes(qLower) ||
      r.desc.toLowerCase().includes(qLower) ||
      r.value.toLowerCase().includes(qLower);
    return matchesCategory && matchesQuery;
  });

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelectRole = (val) => {
    onChange(val);
    setOpen(false);
    setQuery('');
  };

  const handleApplyCustom = (e) => {
    e?.preventDefault();
    if (customInput.trim()) {
      onChange(customInput.trim());
      setOpen(false);
      setCustomInput('');
      setIsCustomMode(false);
    }
  };

  const SelectedIcon = selected.icon || Briefcase;

  return (
    <div ref={ref} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-slate-900/95 border border-slate-700/80 hover:border-cyan-500/70 rounded-2xl px-4 py-3.5 text-left text-slate-100 font-semibold focus:outline-none focus:border-cyan-400 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-lg shadow-black/40 group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border transition-transform group-hover:scale-105"
            style={{
              background: `${selected.color || '#2DD4BF'}15`,
              borderColor: `${selected.color || '#2DD4BF'}40`,
              color: selected.color || '#2DD4BF',
            }}
          >
            <SelectedIcon size={17} />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-sm text-slate-100 truncate flex items-center gap-2">
              <span>{selected.label}</span>
              {selected.category === 'custom' && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                  {L('Kustom', 'Custom')}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{selected.desc}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 text-cyan-400 text-xs font-bold">
          <span className="hidden sm:inline-block text-[11px] text-slate-400 group-hover:text-cyan-300 transition-colors">
            {L('Ganti', 'Change')}
          </span>
          <ChevronDown size={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Modal Container */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-[#090E25]/98 border border-cyan-500/40 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden backdrop-blur-2xl"
          >
            {/* Top Toolbar: Search & Mode Tabs */}
            <div className="p-3 border-b border-slate-800/90 space-y-2.5 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    autoFocus
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={L('Cari posisi (contoh: Backend, Marketing, Akuntan, Perawat, Guru, Barista)...', 'Search role (e.g. Backend, Marketing, Accountant, Nurse, Teacher, Barista)...')}
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Toggle Custom Direct Input */}
                <button
                  type="button"
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                    isCustomMode
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40'
                  }`}
                >
                  <Edit3 size={13} />
                  <span>{L('Ketik Kustom', 'Custom Input')}</span>
                </button>
              </div>

              {/* Direct Custom Input Form if toggled */}
              {isCustomMode && (
                <div className="p-2.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-cyan-300 font-bold">
                    <span>{L('Masukkan Nama Posisi Target Kustom:', 'Enter Custom Target Role Name:')}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{L('Bebas ketik apa saja', 'Any job title is supported')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder={L('Misal: Barista Specialty Coffee, Staf Gudang, Guru Bahasa Mandarin...', 'e.g. Barista Specialty Coffee, Warehouse Staff, Mandarin Teacher...')}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/40 text-xs text-white placeholder-slate-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustom}
                      className="shimmer-btn-primary px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      {L('Terapkan', 'Apply')}
                    </button>
                  </div>
                </div>
              )}

              {/* Category Horizontal Filter Pills */}
              {!isCustomMode && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-horizontal-scrollbar">
                  {categories.map((cat) => {
                    const CatIcon = cat.icon;
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-cyan-500/20 border border-cyan-500/60 text-cyan-300 shadow-sm shadow-cyan-500/10'
                            : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <CatIcon size={12} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Role List Container */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1 custom-horizontal-scrollbar">
              {/* Option to use custom query directly if typed */}
              {query.trim().length > 1 && (
                <button
                  type="button"
                  onClick={() => handleSelectRole(query.trim())}
                  className="w-full text-left p-3 rounded-2xl border border-dashed border-cyan-500/50 bg-cyan-950/20 hover:bg-cyan-950/40 transition-all cursor-pointer flex items-center gap-3 mb-1 text-cyan-300 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Plus size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black truncate">
                      {L('Gunakan Posisi Kustom:', 'Use Custom Position:')} "{query.trim()}"
                    </div>
                    <div className="text-[10px] text-cyan-400/80 mt-0.5">
                      {L('AI akan otomatis memahami dan menganalisis CV sesuai peran ini', 'AI will automatically adapt analysis to this specific role')}
                    </div>
                  </div>
                </button>
              )}

              {filtered.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <p className="text-xs text-slate-400">
                    {L('Tidak ada posisi dalam katalog yang persis sesuai.', 'No catalog position exactly matches your query.')}
                  </p>
                  {query && (
                    <button
                      type="button"
                      onClick={() => handleSelectRole(query.trim())}
                      className="shimmer-btn-primary px-4 py-2 text-xs font-bold rounded-xl cursor-pointer inline-flex items-center gap-2"
                    >
                      <Plus size={14} />
                      <span>{L('Gunakan', 'Use')} "{query.trim()}" {L('sebagai Posisi Target', 'as Target Position')}</span>
                    </button>
                  )}
                </div>
              ) : (
                filtered.map((opt) => {
                  const Icon = opt.icon || Briefcase;
                  const isSelected = value === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectRole(opt.value)}
                      className={`w-full text-left p-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-3 group ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/15 to-purple-500/10 border border-cyan-500/40 text-cyan-200'
                          : 'hover:bg-slate-900/90 text-slate-200 border border-transparent'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                        style={{
                          background: `${opt.color || '#2DD4BF'}15`,
                          borderColor: `${opt.color || '#2DD4BF'}30`,
                          color: opt.color || '#2DD4BF',
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-extrabold leading-tight text-slate-100 flex items-center justify-between">
                          <span className="truncate">{opt.label}</span>
                          {isSelected && <Check size={14} className="text-cyan-400 flex-shrink-0 ml-1" />}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5 group-hover:text-slate-300">
                          {opt.desc}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Scan Steps ──────────────────────────────────────────────────────────────

function getScanSteps(L) {
  return [
    { label: L('Membaca & menganalisis struktur berkas CV...', 'Reading & analyzing CV file structure...'), detail: L('Mengekstrak riwayat kerja & kata kunci', 'Extracting work history & keywords') },
    { label: L('Koneksi ke Evaluator CV Pintar Realtime...', 'Connecting to Realtime Smart CV Evaluator...'), detail: L('Memeriksa kecocokan dengan standar HRD', 'Checking match with HR standards') },
    { label: L('Memeriksa kekuatan & hal yang perlu diperbaiki...', 'Checking strengths & areas for improvement...'), detail: L('Pengecekan spesifik sesuai target posisi', 'Specific check based on target role') },
    { label: L('Mencari rekomendasi lowongan kerja cocok...', 'Searching for matching job listings...'), detail: L('Pencocokan data pekerjaan live', 'Live job data matching') },
    { label: L('Menyusun skor ATS & saran rekomendasi...', 'Compiling ATS score & recommendations...'), detail: L('Finalisasi laporan evaluasi', 'Finalizing evaluation report') },
  ];
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function CvAnalysis({
  auth,
  initialResult,
  initialJobs,
  targetRole: defaultRole,
  userRegisteredRole,
  stats,
  jobs: propsJobs
}) {
  const { isEn, L, T } = useBilingual();
  const { props: pageProps } = usePage();
  const authUser = pageProps.auth?.user || auth?.user || null;
  const userRegistered = userRegisteredRole || authUser?.target_role || null;

  const userState = {
    name: authUser?.name || 'User',
    role: authUser?.target_role || authUser?.role || 'Software Engineer',
    level: authUser?.experience_level || authUser?.level || 'Junior Level',
    avatar: authUser?.name ? authUser.name.substring(0, 2).toUpperCase() : 'AI',
  };

  const [file, setFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [targetRole, setTargetRole] = useState(defaultRole || userRegistered || 'Software Engineer / Backend Dev');
  const [inputMode, setInputMode] = useState('file');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [analysis, setAnalysis] = useState(initialResult || null);
  const [jobs, setJobs] = useState(initialJobs || []);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const scanSteps = getScanSteps(L);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyzeSubmit = (e) => {
    e.preventDefault();
    setIsScanning(true);
    setScanStep(0);
    const interval = setInterval(() => {
      setScanStep((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    const formData = new FormData();
    if (file && inputMode === 'file') formData.append('cv_file', file);
    if (cvText && inputMode === 'text') formData.append('cv_text', cvText);
    formData.append('target_role', targetRole);

    import('axios').then(({ default: axios }) => {
      axios.post('/analyze-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
        .then((res) => {
          clearInterval(interval);
          setIsScanning(false);
          if (res.data?.analysisResult) setAnalysis(res.data.analysisResult);
          if (res.data?.recommendedJobs) {
            setJobs(res.data.recommendedJobs || []);
          }
        })
        .catch((err) => {
          clearInterval(interval);
          setIsScanning(false);
          console.error('CV Analysis error:', err);
        });
    });
  };

  // Lock page scrolling when scanning AI HUD is active
  useEffect(() => {
    if (isScanning) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isScanning]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAskAiAboutCv = (topic, details) => {
    const prompt = isEn
      ? `Hi AyoKerja Bot! I'd like to consult about ${topic} from my CV analysis results:\n\n"${details}"\n\nPlease give in-depth advice and concrete improvement steps for me!`
      : `Halo AyoKerja Bot! Saya ingin berkonsultasi tentang ${topic} dari hasil analisis CV saya:\n\n"${details}"\n\nTolong berikan penjelasan mendalam dan saran konkret untuk saya ya!`;
    window.dispatchEvent(
      new CustomEvent('ask-career-ai', {
        detail: { prompt }
      })
    );
  };

  const verdictStyle = analysis ? getVerdictStyle(analysis.verdict_badge || 'warning') : null;

  return (
    <DashboardLayout user={userState} activeTab="analysis" setActiveTab={() => {}} totalJobs={0}>
      <Head title={L('Cek Kualitas CV — Evaluator CV Pintar', 'CV Quality Check — Smart CV Evaluator')} />

      {/* Fullscreen Loader when opening page */}
      <FullscreenLoader
        show={isInitialLoading}
        message={L('Loading...', 'Loading...')}
        submessage={L('Menganalisis Dokumen CV & Skor ATS...', 'Analyzing CV Documents & ATS Scores...')}
      />

      <div className="space-y-5">

        {/* ── Page Header with Shimmer Highlights ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {L('Cek Kualitas CV & Skor ATS', 'CV Quality Check & ATS Score')} <span className="shimmer-text">AI Realtime</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {L('Analisis tajam, objektif, dan realistis untuk semua profesi (IT, Bisnis, Desain, Keuangan, HRD, Medis & Umum).', 'Sharp, objective, and realistic analysis across all professions (IT, Business, Design, Finance, HR, Medical & General).')}
            </p>
          </div>
          <div className="shimmer-badge-info px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-cyan-400/50 text-[11px] font-black text-cyan-300 tracking-wider flex items-center gap-2 shadow-md shadow-cyan-500/20 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <Sparkles size={13} className="text-cyan-300 animate-pulse" />
            <span>{L('Senior HR Evaluator Aktif', 'Senior HR Evaluator Active')}</span>
          </div>
        </div>

        {/* ── Registered Profile Recommendation Card (if available) ── */}
        {userRegistered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/20 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 flex-shrink-0">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-[11px] text-cyan-300 font-bold uppercase tracking-wider">
                  {L('Rekomendasi Dari Pendaftaran Akun Kamu:', 'Recommended from Your Account Registration:')}
                </p>
                <p className="text-xs sm:text-sm font-black text-white">
                  {userRegistered}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTargetRole(userRegistered)}
              disabled={targetRole === userRegistered}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                targetRole === userRegistered
                  ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 cursor-default'
                  : 'shimmer-btn-primary'
              }`}
            >
              {targetRole === userRegistered ? (
                <><Check size={13} /> {L('Posisi Sedang Dipilih', 'Currently Selected')}</>
              ) : (
                <><Sparkles size={13} /> {L('Gunakan Posisi Ini', 'Use This Position')}</>
              )}
            </button>
          </motion.div>
        )}


        {/* ── MAIN UPLOAD / ANALYZE CARD ── */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="shimmer-border-box">
            <div className="bg-[#070B1D]/95 backdrop-blur-2xl rounded-[23px] p-5 sm:p-8 space-y-6">
              <form onSubmit={handleAnalyzeSubmit} className="space-y-6">

                {/* Form Controls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Target Role Picker */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={14} className="text-cyan-400" />
                        {L('Posisi yang Dilamar / Target Karir', 'Target Job Role / Career Goal')}
                      </span>
                      <span className="text-[10px] text-cyan-400 font-semibold lowercase">
                        {L('(umum & kustom didukung)', '(general & custom supported)')}
                      </span>
                    </label>
                    <RolePicker value={targetRole} onChange={setTargetRole} L={L} />
                  </div>

                  {/* Input Mode Selector */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                      <FileText size={14} className="text-indigo-400" />
                      {L('Cara Memasukkan CV', 'CV Input Method')}
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
                      {[
                        ['file', L('Unggah Berkas (PDF/DOCX)', 'Upload File (PDF/DOCX)'), Upload],
                        ['text', L('Tempel Teks CV', 'Paste CV Text'), FileText]
                      ].map(([mode, label, Icon]) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setInputMode(mode)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                            inputMode === mode
                              ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Icon size={14} />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* File Drop Zone or Textarea */}
                {inputMode === 'file' ? (
                  <div className="relative border-2 border-dashed border-slate-700/80 hover:border-cyan-400/80 rounded-2xl p-7 sm:p-9 text-center bg-slate-900/40 hover:bg-slate-900/60 transition-all group overflow-hidden">
                    {/* Background subtle shimmer line */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none" />
                    
                    <input
                      type="file"
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-400 transition-all shadow-lg shadow-cyan-500/10">
                        <Upload size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-slate-100">
                          {file ? file.name : L('Seret & Lepas berkas CV ke sini, atau klik untuk memilih', 'Drag & drop CV file here, or click to browse')}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {L('Format PDF, DOC, DOCX, TXT · Maksimal 10MB', 'Format PDF, DOC, DOCX, TXT · Maximum 10MB')}
                        </p>
                      </div>

                      {file && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-bold">
                          <Check size={13} />
                          <span>{L('Berkas Siap Diproses', 'File Ready')} ({Math.round(file.size / 1024)} KB)</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-300 mb-2">
                      {L('Isi Konten Teks CV Kamu', 'CV Text Content')}
                    </label>
                    <textarea
                      rows={7}
                      value={cvText}
                      onChange={(e) => setCvText(e.target.value)}
                      placeholder={L(
                        'Tempel isi CV kamu di sini (Ringkasan Profil, Pengalaman Kerja, Kualifikasi & Skill, Pendidikan, Proyek, Sertifikasi)...',
                        'Paste your full CV content here (Profile Summary, Work Experience, Qualifications & Skills, Education, Projects, Certifications)...'
                      )}
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none leading-relaxed"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1.5">
                        <Info size={12} className="text-cyan-400" />
                        {L('Semakin lengkap teks CV, semakin tajam dan akurat hasil penilaian skor ATS.', 'The more complete your CV text, the sharper and more accurate the ATS evaluation.')}
                      </span>
                      <span>{cvText.length} {L('karakter', 'characters')}</span>
                    </div>
                  </div>
                )}

                {/* Submit Action Button with Shimmer Sweep */}
                <button
                  type="submit"
                  disabled={isScanning}
                  className="shimmer-btn-primary w-full py-4 px-6 text-sm font-black justify-center cursor-pointer shadow-xl shadow-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  <Sparkles size={18} className="text-cyan-300 group-hover:rotate-12 transition-transform" />
                  <span>
                    {isScanning
                      ? L('Sedang Memeriksa & Menghitung Skor...', 'Analyzing & Calculating ATS Score...')
                      : L('Mulai Evaluasi CV AI (Senior HRD Realtime)', 'Start AI CV Evaluation (Realtime Senior HR)')}
                  </span>
                  {!isScanning && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* ── SCAN PROGRESS OVERLAY (Futuristic Robot Loading HUD) ── */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
              style={{ background: 'radial-gradient(ellipse at center, #070D22 0%, #020512 100%)' }}
            >
              {/* Dynamic Ambient Background Glows */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-cyan-500/15 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] bg-indigo-500/15 rounded-full blur-[120px]" />
              </div>

              {/* HUD Modal Container */}
              <motion.div
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-sm sm:max-w-md bg-[#080E24]/90 border border-cyan-500/40 rounded-3xl p-5 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-cyan-950/60 text-center space-y-5 my-auto"
              >
                {/* Top Status Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-extrabold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>{L('Evaluator CV Realtime Active', 'Realtime CV Evaluator Active')}</span>
                </div>

                {/* Robot Frame / Portal with Scanning Radar */}
                <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 p-[1px] shadow-lg shadow-cyan-500/10">
                    <div className="w-full h-full bg-[#050816] rounded-3xl overflow-hidden relative">
                      <div className="shimmer-radar-scan" />
                    </div>
                  </div>

                  {/* Scanning Laser Line */}
                  <motion.div
                    className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20 shadow-[0_0_14px_#22d3ee]"
                    animate={{ top: ['12%', '86%', '12%'] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  />

                  {/* Robot Image */}
                  <motion.img
                    src="/images/robot-cv.png"
                    alt={L('Robot Asisten CV', 'CV Assistant Robot')}
                    className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-2xl filter"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    style={{ filter: 'drop-shadow(0 0 20px rgba(34,211,238,0.3))' }}
                  />

                  {/* Floating Sparkles Accent */}
                  <motion.div
                    className="absolute -top-1 -right-1 text-cyan-400 z-20"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                  >
                    <Sparkles size={18} />
                  </motion.div>
                </div>

                {/* Text Header */}
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-1">
                    {L('Sedang Memeriksa CV Kamu', 'Analyzing Your CV')}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {L('Memproses target posisi', 'Processing target role')}{' '}
                    <span className="text-cyan-300 font-bold">{targetRole}</span>
                  </p>
                </div>

                {/* Active Step Box */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1 text-left flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                    <Brain size={16} className="animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-100 truncate">
                      {scanSteps[scanStep]?.label}
                    </p>
                    <p className="text-[10px] text-cyan-400/90 font-medium">
                      {scanSteps[scanStep]?.detail || L('Mohon tunggu sebentar...', 'Please wait a moment...')}
                    </p>
                  </div>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span>{L('Proses Analisis', 'Analysis Progress')}</span>
                    <span className="text-cyan-400 font-black">
                      {Math.round(((scanStep + 1) / scanSteps.length) * 100)}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800 relative">
                    <motion.div
                      className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 h-full rounded-full relative"
                      initial={{ width: '0%' }}
                      animate={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Step Segment Indicators */}
                <div className="flex justify-center gap-1.5 pt-1">
                  {scanSteps.map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-1.5 rounded-full"
                      animate={{
                        width: i <= scanStep ? (i === scanStep ? 24 : 16) : 10,
                        backgroundColor: i <= scanStep ? '#22d3ee' : '#1e293b',
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── RESULTS DISPLAY OR EMPTY STATE ── */}
        {analysis ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-6">

            {/* Score Hero Card */}
            <div className="shimmer-card-glow p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center">

                {/* Score Gauge & Status */}
                <div className="flex flex-col items-center gap-3 flex-shrink-0">
                  <ScoreGauge score={analysis.overall_score || 0} size={152} strokeWidth={10} L={L} />
                  <div className={`px-4 py-1.5 rounded-full border text-xs font-black text-center ${verdictStyle.bg} ${verdictStyle.border} ${verdictStyle.text}`}>
                    {T(analysis.verdict || L('DALAM PROSES', 'IN PROGRESS'))}
                  </div>
                  {analysis.career_level && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-bold">
                      <GraduationCap size={12} /> {T(analysis.career_level)}
                    </div>
                  )}
                  {analysis.years_of_experience && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Clock size={12} /> {T(analysis.years_of_experience)}
                    </div>
                  )}
                </div>

                {/* Details & Bars */}
                <div className="flex-1 w-full space-y-5">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Award size={18} className="text-cyan-400 flex-shrink-0" />
                        <h2 className="font-extrabold text-lg text-white">
                          {L('Hasil Evaluasi CV & Skor ATS', 'CV Evaluation Results & ATS Score')}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold">
                          {analysis.detected_role || targetRole}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAskAiAboutCv(L('Hasil Penilaian & Skor CV', 'CV Evaluation & Score Results'), analysis.ai_summary)}
                        className="shimmer-btn-outline py-1.5 px-3 text-xs font-bold text-teal-300 border-teal-500/40 hover:border-teal-400 group"
                      >
                        <Bot size={14} className="text-teal-400 group-hover:scale-110 transition-transform" />
                        <span>{L('Tanya AI Chat', 'Ask AI Chat')}</span>
                      </button>
                    </div>

                    <blockquote className="text-xs sm:text-sm text-slate-300 leading-relaxed italic bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 border-l-4 border-l-cyan-400/60 shadow-inner">
                      "{analysis.ai_summary}"
                    </blockquote>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <ScoreBar label={L('Kelengkapan Isi Konten CV', 'CV Content Completeness')} score={analysis.content_score || 0} L={L} />
                    <ScoreBar label={L('Format & Struktur ATS Friendly', 'ATS Structure & Formatting')} score={analysis.structure_score || 0} L={L} />
                    <ScoreBar label={L('Relevansi Kemampuan (Skills)', 'Skill Relevance')} score={analysis.skills_score || 0} L={L} />
                    <ScoreBar label={L('Kedalaman Riwayat Kerja', 'Work Experience Depth')} score={analysis.experience_score || 0} L={L} />
                    <ScoreBar label={L('Pencapaian & Metrik Kuantitatif', 'Quantitative Impact & Metrics')} score={analysis.impact_score || 0} L={L} />
                  </div>
                </div>
              </div>

              {/* ATS scoring explanation note */}
              <div className="mt-6 p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-3">
                <Info size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-cyan-200/80 leading-relaxed">
                  <strong className="text-cyan-300">{L('Pedoman Skor ATS:', 'ATS Score Guide:')}</strong>{' '}
                  {L(
                    'Skor dihitung langsung dari isi CV kamu oleh sistem AI secara transparan. Nilai 60–75 adalah hal yang wajar bagi pemula/fresh graduate; 76–88 tergolong kompetitif; dan 89+ memiliki daya saing tinggi untuk lolos screening pertama HRD.',
                    'Scores are calculated directly from your CV content by our AI system transparently. A score of 60–75 is normal for entry-level candidates; 76–88 is competitive; and 89+ has strong competitive advantage in passing initial HR screening.'
                  )}
                </p>
              </div>
            </div>

            {/* Strengths & Red Flags Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Keunggulan CV */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="p-6 rounded-3xl bg-slate-950/80 border border-emerald-500/30 space-y-4 shadow-lg shadow-emerald-950/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white">{L('Keunggulan CV Kamu', 'Your CV Strengths')}</h3>
                      <p className="text-[11px] text-emerald-400/80">{L('Poin positif yang terdeteksi dari berkas kamu', 'Positive points detected from your CV')}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAskAiAboutCv(L('Keunggulan CV Saya', 'My CV Strengths'), (analysis.strengths || []).join('; '))}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 text-[11px] font-bold transition-all cursor-pointer group"
                  >
                    <Bot size={13} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>{L('Tanya AI', 'Ask AI')}</span>
                  </button>
                </div>

                <ul className="space-y-2.5">
                  {analysis.strengths && analysis.strengths.length > 0 ? analysis.strengths.map((st, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-slate-200 leading-relaxed"
                    >
                      <Check size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{st}</span>
                    </motion.li>
                  )) : (
                    <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 text-center">
                      {L('Belum ada data tersedia', 'No data available yet')}
                    </li>
                  )}
                </ul>
              </motion.div>

              {/* Hal yang Perlu Diperbaiki */}
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-3xl bg-slate-950/80 border border-rose-900/40 space-y-4 shadow-lg shadow-rose-950/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white">{L('Hal yang Perlu Diperbaiki', 'Areas for Improvement')}</h3>
                      <p className="text-[11px] text-rose-400/80">{L('Segera optimasi sebelum mengirim lamaran kerja', 'Optimize these before sending job applications')}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAskAiAboutCv(L('Hal yang Perlu Diperbaiki di CV', 'Things to Fix in CV'), ((analysis.red_flags || analysis.opportunities) || []).join('; '))}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 hover:border-rose-400 text-rose-300 text-[11px] font-bold transition-all cursor-pointer group"
                  >
                    <Bot size={13} className="text-rose-400 group-hover:scale-110 transition-transform" />
                    <span>{L('Tanya AI', 'Ask AI')}</span>
                  </button>
                </div>

                <ul className="space-y-2.5">
                  {(analysis.red_flags || analysis.opportunities) && (analysis.red_flags || analysis.opportunities).length > 0
                    ? (analysis.red_flags || analysis.opportunities).map((rf, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-rose-950/25 border border-rose-800/35 text-xs text-slate-200 leading-relaxed"
                      >
                        <AlertTriangle size={15} className="text-rose-400 flex-shrink-0 mt-0.5" />
                        <span>{rf}</span>
                      </motion.li>
                    )) : (
                      <li className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-emerald-400 text-center font-semibold">
                        {L('Tidak ada masalah kritis yang ditemukan', 'No critical issues found')}
                      </li>
                    )}
                </ul>
              </motion.div>
            </div>

            {/* Rekomendasi Langkah Perbaikan Konkret */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950/95 to-indigo-950/30 border border-indigo-800/30 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">{L('Langkah Perbaikan CV Kamu', 'CV Improvement Steps')}</h3>
                    <p className="text-xs text-slate-400">{L('Rekomendasi konkret untuk meningkatkan peluang diterima kerja', 'Concrete recommendations to boost your hiring chances')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    type="button"
                    onClick={() => handleAskAiAboutCv(L('Langkah Perbaikan CV', 'CV Improvement Steps'), (analysis.actionable_recommendations || []).join('; '))}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 text-xs font-bold transition-all cursor-pointer group"
                  >
                    <Bot size={14} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span>{L('Konsultasi AI', 'AI Consultation')}</span>
                  </button>
                  <Link href="/cv-builder" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 transition-all flex-shrink-0 w-fit">
                    <FileText size={13} /> {L('Buat CV Baru', 'Create New CV')}
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.actionable_recommendations && analysis.actionable_recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3 group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </div>
                      <Lightbulb size={14} className="text-indigo-400" />
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">{rec}</p>
                  </motion.div>
                ))}
              </div>

              {/* Kata Kunci Rekomendasi (Shimmer Pills) */}
              {analysis.recommended_keywords && analysis.recommended_keywords.length > 0 && (
                <div className="pt-4 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-cyan-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      {L('Kata Kunci ATS Penting untuk Posisi Ini:', 'Important ATS Keywords for This Role:')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.recommended_keywords.map((kw, i) => (
                      <span key={i} className="shimmer-pill-skill">
                        <Sparkles size={10} className="text-cyan-400" />
                        <span>{kw}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Kemampuan yang Terdeteksi */}
            {analysis.detected_skills && analysis.detected_skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{L('Kemampuan yang Berhasil Terdeteksi', 'Detected Skills')}</h3>
                    <p className="text-[11px] text-slate-400">{L('Keahlian yang dibaca oleh sistem dari isi dokumen CV kamu', 'Skills successfully extracted from your CV document')}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.detected_skills.map((sk, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
                      <Check size={11} /> {sk}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Re-analyze Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setAnalysis(null)}
                className="shimmer-btn-outline px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-300 hover:text-cyan-400 cursor-pointer inline-flex items-center gap-2"
              >
                <RefreshCw size={15} />
                <span>{L('Periksa Dokumen CV Lain', 'Check Another CV Document')}</span>
              </button>
            </div>
          </motion.div>

        ) : isScanning ? (
          <AnalysisSkeleton />
        ) : (
          /* Empty State Guide */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 sm:p-12 rounded-3xl bg-slate-950/70 border border-slate-800 text-center max-w-2xl mx-auto space-y-5"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-500/10">
              <Brain size={32} />
            </div>
            <h3 className="text-xl font-black text-white">{L('Siap Memeriksa CV Kamu', 'Ready to Check Your CV')}</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
              {L('Pilih posisi target kamu (tersedia pilihan umum & kustom), unggah berkas CV atau tempel teksnya, lalu klik', 'Choose your target role (general & custom positions supported), upload your CV file or paste text, then click')}{' '}
              <strong className="text-cyan-300">"{L('Mulai Evaluasi CV AI', 'Start AI CV Evaluation')}"</strong>.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { step: '1', label: L('Pilih Posisi', 'Choose Role'), icon: <Briefcase size={16} /> },
                { step: '2', label: L('Unggah CV', 'Upload CV'), icon: <Upload size={16} /> },
                { step: '3', label: L('Skor & Saran', 'Score & Tips'), icon: <BarChart3 size={16} /> },
              ].map((s) => (
                <div key={s.step} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">{s.icon}</div>
                  <p className="text-xs text-slate-300 font-bold">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── LOWONGAN KERJA YANG COCOK (MATCHING JOBS) ── */}
        {jobs.length > 0 && (
          <div className="mt-12 sm:mt-16 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
                  <Briefcase className="text-cyan-400" size={22} />
                  <span>{L('Lowongan Kerja yang Sesuai untuk', 'Matching Job Listings for')} <span className="shimmer-text">{targetRole}</span></span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {L('Lowongan pekerjaan terverifikasi dari portal kerja live sesuai kualifikasi kamu', 'Verified live job listings matching your qualifications')}
                </p>
              </div>
              <span className="shimmer-badge-info px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-300">
                {jobs.length} {L('Lowongan Terdeteksi', 'Jobs Found')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {jobs.map((job, idx) => (
                <motion.div
                  key={job.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -3 }}
                  className="shimmer-card-glow p-5 sm:p-6 space-y-4 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-cyan-300 border border-slate-700 inline-block mb-2">
                        {T(job.source || 'Lowongan Terverifikasi')}
                      </span>
                      <h3 className="font-extrabold text-base text-white leading-snug group-hover:text-cyan-300 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                        <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                          <Users size={12} className="text-slate-500" /> {job.company}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin size={12} className="text-slate-500" /> {T(job.location)}
                        </span>
                      </div>
                    </div>

                    <div className={`px-2.5 py-1.5 rounded-xl text-xs font-black flex-shrink-0 ${
                      job.matchScore >= 85
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                        : job.matchScore >= 70
                        ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                        : 'bg-slate-800 border border-slate-700 text-slate-300'
                    }`}>
                      {job.matchScore}% {L('Cocok', 'Match')}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="space-y-2">
                    {job.matched_skills?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-bold">{L('Keahlian cocok:', 'Matched skills:')}</span>
                        {job.matched_skills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-[10px] font-semibold">
                            &#10003; {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {job.missing_skills?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-bold">{L('Perlu ditingkatkan:', 'Needs polish:')}</span>
                        {job.missing_skills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25 text-[10px] font-semibold">
                            ! {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <DollarSign size={13} /> {T(job.salary)}
                    </div>
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shimmer-btn-primary py-2 px-3.5 text-xs font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                    >
                      <span>{L('Lamar Posisi', 'Apply Job')}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}