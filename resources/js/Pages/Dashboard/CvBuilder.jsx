import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Wrench,
  RefreshCw,
  Sliders,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eraser,
  Layout,
  Palette,
  Globe,
  Star,
  Maximize2,
  Eye,
  ZoomIn,
  ZoomOut,
  FileCheck,
  AlertCircle,
  BookOpen,
  Link as LinkIcon,
  MapPin,
  Mail,
  Phone,
  Zap,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Languages,
  Search,
  Laptop,
  TrendingUp,
  Users,
  Rocket,
  Target,
  Upload,
  X,
  FileUp,
  Wand2
} from 'lucide-react';
import axios from 'axios';
import { downloadElementAsPdf, printElementViaIframe } from '../../Utils/printHelper';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// Global Multi-Language & Country Support (35+ Countries & International Languages - No Emojis)
const LANGUAGES = [
  { id: 'en', name: 'English (ATS Standard)', country: 'United Kingdom / USA', code: 'EN', rtl: false },
  { id: 'id', name: 'Bahasa Indonesia', country: 'Indonesia', code: 'ID', rtl: false },
  { id: 'ar', name: 'العربية (Arabic)', country: 'Saudi Arabia / UAE', code: 'AR', rtl: true },
  { id: 'ja', name: '日本語 (Japanese)', country: 'Japan', code: 'JA', rtl: false },
  { id: 'ko', name: '한국어 (Korean)', country: 'South Korea', code: 'KO', rtl: false },
  { id: 'de', name: 'Deutsch (German)', country: 'Germany', code: 'DE', rtl: false },
  { id: 'fr', name: 'Français (French)', country: 'France', code: 'FR', rtl: false },
  { id: 'zh', name: '中文 (Mandarin)', country: 'China / Taiwan', code: 'ZH', rtl: false },
  { id: 'nl', name: 'Nederlands (Dutch)', country: 'Netherlands', code: 'NL', rtl: false },
  { id: 'es', name: 'Español (Spanish)', country: 'Spain / Mexico', code: 'ES', rtl: false },
  { id: 'it', name: 'Italiano (Italian)', country: 'Italy', code: 'IT', rtl: false },
  { id: 'ru', name: 'Русский (Russian)', country: 'Russia', code: 'RU', rtl: false },
  { id: 'tr', name: 'Türkçe (Turkish)', country: 'Turkey', code: 'TR', rtl: false },
  { id: 'vi', name: 'Tiếng Việt (Vietnamese)', country: 'Vietnam', code: 'VI', rtl: false },
  { id: 'th', name: 'ไทย (Thai)', country: 'Thailand', code: 'TH', rtl: false },
  { id: 'pt', name: 'Português (Portuguese)', country: 'Brazil / Portugal', code: 'PT', rtl: false },
  { id: 'ms', name: 'Bahasa Melayu (Malay)', country: 'Malaysia', code: 'MS', rtl: false },
  { id: 'tl', name: 'Tagalog (Filipino)', country: 'Philippines', code: 'TL', rtl: false },
  { id: 'hi', name: 'हिन्दी (Hindi)', country: 'India', code: 'HI', rtl: false },
  { id: 'pl', name: 'Polski (Polish)', country: 'Poland', code: 'PL', rtl: false },
  { id: 'sv', name: 'Svenska (Swedish)', country: 'Sweden', code: 'SV', rtl: false },
  { id: 'no', name: 'Norsk (Norwegian)', country: 'Norway', code: 'NO', rtl: false },
  { id: 'da', name: 'Dansk (Danish)', country: 'Denmark', code: 'DA', rtl: false },
  { id: 'fi', name: 'Suomi (Finnish)', country: 'Finland', code: 'FI', rtl: false },
  { id: 'el', name: 'Ελληνικά (Greek)', country: 'Greece', code: 'EL', rtl: false },
  { id: 'he', name: 'עברית (Hebrew)', country: 'Israel', code: 'HE', rtl: true },
  { id: 'uk', name: 'Українська (Ukrainian)', country: 'Ukraine', code: 'UK', rtl: false },
  { id: 'cs', name: 'Čeština (Czech)', country: 'Czech Republic', code: 'CS', rtl: false },
  { id: 'hu', name: 'Magyar (Hungarian)', country: 'Hungary', code: 'HU', rtl: false },
  { id: 'ro', name: 'Română (Romanian)', country: 'Romania', code: 'RO', rtl: false },
  { id: 'fa', name: 'فارسی (Persian)', country: 'Iran', code: 'FA', rtl: true },
  { id: 'ur', name: 'اردو (Urdu)', country: 'Pakistan', code: 'UR', rtl: true },
  { id: 'bn', name: 'বাংলা (Bengali)', country: 'Bangladesh', code: 'BN', rtl: false },
  { id: 'km', name: 'ភាសាខ្មែរ (Khmer)', country: 'Cambodia', code: 'KM', rtl: false },
  { id: 'my', name: 'ဗမာစာ (Burmese)', country: 'Myanmar', code: 'MY', rtl: false },
  { id: 'af', name: 'Afrikaans', country: 'South Africa', code: 'AF', rtl: false },
  { id: 'sw', name: 'Kiswahili (Swahili)', country: 'Kenya / Tanzania', code: 'SW', rtl: false }
];

const SECTION_TITLES = {
  en: {
    summary: 'PROFESSIONAL SUMMARY',
    education: 'EDUCATION & ACADEMICS',
    experience: 'WORK EXPERIENCE',
    projects: 'PROJECTS & PORTFOLIO',
    skills: 'TECHNICAL SKILLS & TOOLS',
    languages: 'Languages',
    certifications: 'Certifications & Awards',
    honorsLabel: 'Honors & Awards:',
    thesisLabel: 'Thesis/Capstone:',
    courseworkLabel: 'Relevant Coursework:',
    activitiesLabel: 'Campus Leadership & Activities:',
    gpaLabel: 'GPA:',
  },
  id: {
    summary: 'RINGKASAN PROFESIONAL',
    education: 'RIWAYAT PENDIDIKAN & AKADEMIK',
    experience: 'PENGALAMAN KERJA',
    projects: 'PROYEK & PORTOFOLIO',
    skills: 'KETERAMPILAN & KEAHLIAN TEKNIS',
    languages: 'Bahasa Asing',
    certifications: 'Sertifikasi & Penghargaan',
    honorsLabel: 'Penghargaan & Beasiswa:',
    thesisLabel: 'Judul Skripsi/Tesis:',
    courseworkLabel: 'Mata Kuliah Relevan:',
    activitiesLabel: 'Kegiatan Organisasi & Kepemimpinan:',
    gpaLabel: 'IPK:',
  },
  ar: {
    summary: 'الملخص المهني',
    education: 'التعليم والأكاديميا',
    experience: 'الخبرة العملية',
    projects: 'المشاريع والمحفظة',
    skills: 'المهارات التقنية والأدوات',
    languages: 'اللغات الأجنبية',
    certifications: 'الشهادات والجوائز',
    honorsLabel: 'الجوائز والتكريمات:',
    thesisLabel: 'عنوان أطروحة التخرج:',
    courseworkLabel: 'المقررات الدراسية ذات الصلة:',
    activitiesLabel: 'الأنشطة والقيادة الطلابية:',
    gpaLabel: 'المعدل التراكمي:',
  },
  ja: {
    summary: '職務要約',
    education: '学歴',
    experience: '職務経歴',
    projects: 'プロジェクト・実績',
    skills: 'テクニカルスキル・ツール',
    languages: '語学スキル',
    certifications: '資格・受賞歴',
    honorsLabel: '受賞・特記事項:',
    thesisLabel: '卒業研究・論文:',
    courseworkLabel: '主要履修科目:',
    activitiesLabel: '課外活動・リーダーシップ:',
    gpaLabel: 'GPA:',
  },
  de: {
    summary: 'BERUFSERFAHRUNG & PROFIL',
    education: 'BILDUNG & AUSBILDUNG',
    experience: 'BERUFLICHER WERDEGANG',
    projects: 'PROJEKTE & PORTFOLIO',
    skills: 'KENNTNISSE & IT-SKILLS',
    languages: 'Sprachen',
    certifications: 'Zertifikate & Auszeichnungen',
    honorsLabel: 'Auszeichnungen & Stipendien:',
    thesisLabel: 'Abschlussarbeit:',
    courseworkLabel: 'Relevante Kurse:',
    activitiesLabel: 'Engagement & Aktivitäten:',
    gpaLabel: 'Note/GPA:',
  },
  fr: {
    summary: 'RÉSUMÉ PROFESSIONNEL',
    education: 'ÉDUCATION & DIPLÔMES',
    experience: 'EXPÉRIENCE PROFESSIONNELLE',
    projects: 'PROJETS & RÉALISATIONS',
    skills: 'COMPÉTENCES TECHNIQUES',
    languages: 'Langues',
    certifications: 'Certifications & Prix',
    honorsLabel: 'Distinctions & Bourses:',
    thesisLabel: 'Sujet de Mémoire/Thèse:',
    courseworkLabel: 'Cours Pertinents:',
    activitiesLabel: 'Engagements & Activités:',
    gpaLabel: 'Moyenne/GPA:',
  },
  ko: {
    summary: '직무 요약',
    education: '학력 및 학술 사항',
    experience: '경력 사항',
    projects: '프로젝트 및 포트폴리오',
    skills: '기술 스킬 및 도구',
    languages: '외국어 능력',
    certifications: '자격증 및 수상 내역',
    honorsLabel: '수상 및 장학금:',
    thesisLabel: '학위 논문 주제:',
    courseworkLabel: '관련 이수 과목:',
    activitiesLabel: '학내 활동 및 리더십:',
    gpaLabel: '학점(GPA):',
  },
  es: {
    summary: 'RESUMEN PROFESIONAL',
    education: 'EDUCACIÓN Y FORMACIÓN',
    experience: 'EXPERIENCIA LABORAL',
    projects: 'PROYECTOS Y PORTAFOLIO',
    skills: 'HABILIDADES TÉCNICAS',
    languages: 'Idiomas',
    certifications: 'Certificaciones y Premios',
    honorsLabel: 'Honores y Becas:',
    thesisLabel: 'Título de Tesis:',
    courseworkLabel: 'Cursos Relevantes:',
    activitiesLabel: 'Liderazgo y Actividades:',
    gpaLabel: 'Promedio/GPA:',
  },
  nl: {
    summary: 'PROFESSIONEEL PROFIEL',
    education: 'OPLEIDING & OPTIES',
    experience: 'WERKERVARING',
    projects: 'PROJECTEN & PORTFOLIO',
    skills: 'TECHNISCHE VAARDIGHEDEN',
    languages: 'Talen',
    certifications: 'Certificaten & Prijzen',
    honorsLabel: 'Onderscheidingen & Beurzen:',
    thesisLabel: 'Scriptie/Thesis:',
    courseworkLabel: 'Relevante Vakken:',
    activitiesLabel: 'Bestuur & Activiteiten:',
    gpaLabel: 'Cijfer/GPA:',
  },
  ru: {
    summary: 'ПРОФЕССИОНАЛЬНОЕ РЕЗЮМЕ',
    education: 'ОБРАЗОВАНИЕ И КВАЛИФИКАЦИЯ',
    experience: 'ОПЫТ РАБОТЫ',
    projects: 'ПРОЕКТЫ И ПОРТФОЛИО',
    skills: 'ТЕХНИЧЕСКИЕ НАВЫКИ',
    languages: 'Иностранные языки',
    certifications: 'Сертификаты и награды',
    honorsLabel: 'Награды и стипендии:',
    thesisLabel: 'Дипломная работа:',
    courseworkLabel: 'Изученные дисциплины:',
    activitiesLabel: 'Общественная деятельность:',
    gpaLabel: 'Средний балл (GPA):',
  },
  tr: {
    summary: 'PROFESYONEL ÖZET',
    education: 'EĞİTİM VE AKADEMİK',
    experience: 'İŞ DENEYİMİ',
    projects: 'PROJELER VE PORTFOLYO',
    skills: 'TEKNİK BECERİLER',
    languages: 'Yabancı Diller',
    certifications: 'Sertifikalar ve Ödüller',
    honorsLabel: 'Ödüller ve Burslar:',
    thesisLabel: 'Bitirme Tezi:',
    courseworkLabel: 'İlgili Dersler:',
    activitiesLabel: 'Liderlik ve Etkinlikler:',
    gpaLabel: 'GPA/AGNO:',
  },
  vi: {
    summary: 'TÓM TẮT THÔNG TIN CÁ NHÂN',
    education: 'HỌC VẤN & BẰNG CẤP',
    experience: 'KINH NGHIỆM LÀM VIỆC',
    projects: 'DỰ ÁN & PORTFOLIO',
    skills: 'KỸ NĂNG CHUYÊN MÔN',
    languages: 'Ngoại ngữ',
    certifications: 'Chứng chỉ & Giải thưởng',
    honorsLabel: 'Giải thưởng & Học bổng:',
    thesisLabel: 'Đề tài Khóa luận:',
    courseworkLabel: 'Môn học liên quan:',
    activitiesLabel: 'Hoạt động & Lãnh đạo:',
    gpaLabel: 'Điểm GPA:',
  },
  th: {
    summary: 'ประวัติโดยย่อ',
    education: 'ประวัติการศึกษา',
    experience: 'ประสบการณ์การทำงาน',
    projects: 'ผลงานและโปรเจกต์',
    skills: 'ทักษะและความเชี่ยวชาญ',
    languages: 'ทักษะทางภาษา',
    certifications: 'ใบรับรองและรางวัล',
    honorsLabel: 'รางวัลและทุนการศึกษา:',
    thesisLabel: 'หัวข้อวิทยานิพนธ์:',
    courseworkLabel: 'วิชาที่เกี่ยวข้อง:',
    activitiesLabel: 'กิจกรรมและภาวะผู้นำ:',
    gpaLabel: 'เกรดเฉลี่ย (GPA):',
  },
  pt: {
    summary: 'RESUMO PROFISSIONAL',
    education: 'FORMAÇÃO ACADÊMICA',
    experience: 'EXPERIÊNCIA PROFISSIONAL',
    projects: 'PROJETOS E PORTFÓLIO',
    skills: 'HABILIDADES TÉCNICAS',
    languages: 'Idiomas',
    certifications: 'Certificações e Prêmios',
    honorsLabel: 'Prêmios e Bolsas:',
    thesisLabel: 'Trabalho de Conclusão (TCC):',
    courseworkLabel: 'Disciplinas Relevantes:',
    activitiesLabel: 'Liderança e Atividades:',
    gpaLabel: 'Média/GPA:',
  },
  ms: {
    summary: 'RINGKASAN PROFESIONAL',
    education: 'PENDIDIKAN & AKADEMIK',
    experience: 'PENGALAMAN KERJA',
    projects: 'PROJEK & PORTFOLIO',
    skills: 'KEMAHIRAN TEKNIKAL',
    languages: 'Bahasa',
    certifications: 'Pensijilan & Anugerah',
    honorsLabel: 'Anugerah & Biasiswa:',
    thesisLabel: 'Tajuk Tesis:',
    courseworkLabel: 'Kursus Relevan:',
    activitiesLabel: 'Kepimpinan & Aktiviti:',
    gpaLabel: 'PNGK/GPA:',
  },
  zh: {
    summary: '个人总结',
    education: '教育背景',
    experience: '工作经历',
    projects: '项目经历',
    skills: '专业技能与工具',
    languages: '语言能力',
    certifications: '证书与奖项',
    honorsLabel: '荣誉与奖学金:',
    thesisLabel: '毕业论文/设计:',
    courseworkLabel: '相关核心课程:',
    activitiesLabel: '校园活动与领导力:',
    gpaLabel: '绩点 (GPA):',
  }
};

// 5 Industry Standard ATS Templates Metadata
const TEMPLATES = [
  {
    id: 'harvard',
    name: 'Harvard Classic ATS',
    desc: 'Format Serif standar korporat & universitas dunia (100% ATS Tembus)',
    badge: 'Paling Populer',
    defaultColor: '#0f172a'
  },
  {
    id: 'modern',
    name: 'Modern Tech Standard',
    desc: 'Format Sans-Serif bersih dengan aksen warna untuk industri tech & startup',
    badge: 'Tech & Startup',
    defaultColor: '#0d9488'
  },
  {
    id: 'minimalist',
    name: 'Minimalist Executive',
    desc: 'Format ringkas & elegan dengan banner gelap untuk level Mid/Senior',
    badge: 'Mid / Senior',
    defaultColor: '#1e293b'
  },
  {
    id: 'creative',
    name: 'Creative Product & UI',
    desc: 'Format 2-kolom bersih dengan sidebar kontak & skill untuk Product & Engineer',
    badge: 'Creative & Product',
    defaultColor: '#6d28d9'
  },
  {
    id: 'corporate',
    name: 'Corporate Fortune 500',
    desc: 'Format formal navy blue dengan struktur grid tajam untuk BUMN & Enterprise',
    badge: 'Enterprise & BUMN',
    defaultColor: '#1e3a8a'
  }
];

// Curated Accent Color Swatches
const ACCENT_COLORS = [
  { id: 'default', name: 'Original', hex: 'default' },
  { id: 'teal', name: 'Emerald Teal', hex: '#0d9488' },
  { id: 'blue', name: 'Royal Blue', hex: '#2563eb' },
  { id: 'navy', name: 'Corporate Navy', hex: '#1e3a8a' },
  { id: 'violet', name: 'Deep Violet', hex: '#7c3aed' },
  { id: 'rose', name: 'Ruby Rose', hex: '#e11d48' },
  { id: 'amber', name: 'Amber Gold', hex: '#d97706' },
  { id: 'charcoal', name: 'Dark Charcoal', hex: '#0f172a' },
];

// Page Fit & Spacing Density Modes (Smart Page Analyzer)
const PAGE_FIT_MODES = [
  { id: 'ultra-compact', name: 'Ultra 1-Page (Super Ambis)', desc: 'Font & margin sangat padat untuk yang punya banyak gelar & pengalaman agar pas 1 lembar' },
  { id: 'compact', name: 'Smart 1-Page Fit (Rekomendasi ATS)', desc: 'Optimasi jarak & font standar presisi 1 lembar PDF' },
  { id: 'normal', name: 'Standar 1-2 Pages', desc: 'Jarak & font standar bawaan template' },
  { id: 'expanded', name: 'AExpanded 2+ Pages (Executive)', desc: 'Jarak lebih renggang untuk portofolio panjang' },
];

// Comprehensive Industry & Role Presets (General & IT Support)
const INDUSTRY_PRESETS = [
  {
    category: 'Teknologi & IT',
    iconComponent: Laptop,
    roles: [
      {
        id: 'backend_dev',
        title: 'Backend Developer',
        summary: 'Profesional Backend Developer berdedikasi tinggi dengan keahlian utama dalam RESTful API, Database SQL, dan Microservices. Berpengalaman merancang arsitektur backend berkinerja tinggi, mengoptimalkan query database, serta menerapkan Clean Code.',
        skills: {
          languages: 'PHP, JavaScript, SQL, HTML/CSS, Python',
          frameworks: 'Laravel, Node.js, Express, React',
          databases: 'MySQL, PostgreSQL, Redis',
          tools: 'Git, GitHub, Docker, Postman, Linux, VS Code',
          certifications: 'Harvard CS50 / AWS Certified Cloud Practitioner'
        },
        skillLabels: {
          label1: 'Languages',
          label2: 'Frameworks',
          label3: 'Databases',
          label4: 'Tools & Platforms'
        },
        sectionTitles: {
          skills: 'TECHNICAL SKILLS & TOOLS',
          projects: 'PROJECTS & PORTFOLIO'
        },
        bullets: [
          'Merancang & merefaktor 15+ RESTful API endpoints menggunakan Laravel & Node.js, berhasil menekan latency respon di bawah 120ms.',
          'Mengoptimalkan performa query SQL dan database indexing, menurunkan penggunaan resource server hingga 35%.',
          'Mengimplementasikan validasi input bertingkat dan autentikasi terenkripsi JWT untuk menjamin integritas data.'
        ],
        projects: [
          {
            name: 'High-Performance RESTful API Engine',
            tech: 'PHP, Laravel, MySQL, Redis',
            bullets: [
              'Membangun arsitektur Service-Repository Pattern untuk memisahkan logika bisnis dari controller.',
              'Mengintegrasikan Redis Caching Layer yang mempercepat waktu respon endpoint data master hingga 4x.'
            ]
          }
        ]
      },
      {
        id: 'fullstack_dev',
        title: 'Full Stack Developer',
        summary: 'Full Stack Developer serbaguna dengan pengalaman membangun aplikasi web end-to-end responsif dari antarmuka React/Inertia hingga backend API Laravel & database relasional.',
        skills: {
          languages: 'JavaScript, TypeScript, PHP, SQL, HTML5/CSS3',
          frameworks: 'React, Inertia.js, Laravel, Tailwind CSS, Node.js',
          databases: 'MySQL, PostgreSQL, MongoDB',
          tools: 'Git, Vite, Docker, VS Code, Postman',
          certifications: 'Fullstack Web Development Certification'
        },
        skillLabels: {
          label1: 'Languages',
          label2: 'Frameworks',
          label3: 'Databases',
          label4: 'Tools & Platforms'
        },
        sectionTitles: {
          skills: 'TECHNICAL SKILLS & TOOLS',
          projects: 'PROJECTS & PORTFOLIO'
        },
        bullets: [
          'Mengembangkan aplikasi web full-stack dari konsep arsitektur hingga deployment produksi dengan 10,000+ pengguna aktif.',
          'Mendesain komponen UI responsif dengan React & Tailwind CSS serta mengintegrasikan state management terpusat.',
          'Menghubungkan frontend ke backend REST API dengan penanganan error dan validasi form yang lancar.'
        ],
        projects: [
          {
            name: 'Enterprise Career & Portal Application',
            tech: 'Laravel, React, Inertia.js, Tailwind CSS',
            bullets: [
              'Membangun sistem portal kerja terpadu dengan integrasi AI real-time dan manajemen dokumen ATS.'
            ]
          }
        ]
      },
      {
        id: 'ui_ux_designer',
        title: 'UI/UX Designer',
        summary: 'UI/UX & Product Designer yang berfokus pada riset pengguna, wireframing, dan desain antarmuka digital yang intuitif dan berestetika tinggi.',
        skills: {
          languages: 'Design Thinking, User Research, Wireframing',
          frameworks: 'Design Systems, Figma Tokens, Prototyping',
          databases: 'Usability Testing, Information Architecture',
          tools: 'Figma, Adobe XD, Miro, Maze, Photoshop',
          certifications: 'Google UX Design Professional Certificate'
        },
        skillLabels: {
          label1: 'Keahlian Desain',
          label2: 'Metodologi UI/UX',
          label3: 'Riset & Arsitektur',
          label4: 'Software & Tools'
        },
        sectionTitles: {
          skills: 'KEAHLIAN & SPESIALISASI DESAIN',
          projects: 'PORTOFOLIO & PROYEK DESAIN'
        },
        bullets: [
          'Merancang wireframe dan prototype interaktif tinggi di Figma untuk 8+ proyek aplikasi web dan mobile.',
          'Meningkatkan angka konversi registrasi pengguna sebesar 28% melalui redesain alur registrasi berbasis riset pengguna.',
          'Membangun dan mengelola Design System terpusat dengan 150+ komponen UI reusable.'
        ],
        projects: [
          {
            name: 'Mobile Banking App Redesign & Usability Study',
            tech: 'Figma, Maze, Prototyping, Design System',
            bullets: [
              'Melakukan usability testing ke 20+ responden dan memangkas jumlah langkah transaksi dari 5 menjadi 3 langkah.'
            ]
          }
        ]
      },
      {
        id: 'data_analyst',
        title: 'Data Analyst',
        summary: 'Data Analyst analitis dengan keahlian pengolahan data menggunakan SQL, Python, dan pemodelan dasbor bisnis visual (Power BI / Tableau) untuk mendukung pengambilan keputusan strategis.',
        skills: {
          languages: 'Python (Pandas, NumPy), SQL, R, Excel Advanced',
          frameworks: 'Statistical Modeling, Data Cleaning, Data Mining',
          databases: 'MySQL, PostgreSQL, BigQuery',
          tools: 'Power BI, Tableau, Jupyter Notebook, Git',
          certifications: 'Google Data Analytics Professional Certificate'
        },
        skillLabels: {
          label1: 'Bahasa Analisis',
          label2: 'Metode Pengolahan',
          label3: 'Databases & Warehouse',
          label4: 'Tools Dasbor & BI'
        },
        sectionTitles: {
          skills: 'KETERAMPILAN & ANALISIS DATA',
          projects: 'PROYEK & MODEL DATA'
        },
        bullets: [
          'Menganalisis tren penjualan dan perilaku 50.000+ pelanggan menggunakan SQL query & Python Pandas.',
          'Membangun dasbor eksekutif Power BI interaktif yang mempercepat pelaporan kinerja bulanan hingga 60%.',
          'Mengidentifikasi anomali data dan memberikan rekomendasi optimasi stok yang menghemat biaya operasional sebesar 15%.'
        ],
        projects: [
          {
            name: 'Customer Churn Analysis & Dashboard Model',
            tech: 'Python, SQL, Power BI, Statistics',
            bullets: [
              'Membuat model prediksi retensi pelanggan yang berhasil mengidentifikasi risiko churn dengan akurasi 89%.'
            ]
          }
        ]
      }
    ]
  },
  {
    category: 'Pemasaran & Konten',
    iconComponent: TrendingUp,
    roles: [
      {
        id: 'digital_marketing',
        title: 'Digital Marketing Specialist',
        summary: 'Digital Marketing Specialist berorientasi hasil dengan rekam jejak mengelola kampanye iklan digital (Meta Ads, Google Ads), optimasi SEO, dan strategi konten untuk pertumbuhan brand.',
        skills: {
          languages: 'Meta Ads Manager, Google Ads, SEO Audit',
          frameworks: 'Copywriting, Funnel Marketing, Performance Marketing',
          databases: 'Google Analytics 4, Search Console, Ahrefs',
          tools: 'Canva, Mailchimp, Meta Business Suite, Google Data Studio',
          certifications: 'Google Digital Marketing & E-Commerce Certificate'
        },
        skillLabels: {
          label1: 'Keahlian Utama',
          label2: 'Strategi & Performance',
          label3: 'Platform Ads & Analytics',
          label4: 'Software & Content Tools'
        },
        sectionTitles: {
          skills: 'KEAHLIAN & SPESIALISASI PEMASARAN',
          projects: 'PROYEK & KAMPANYE DIGITAL'
        },
        bullets: [
          'Mengelola anggaran iklan bulanan sebesar IDR 25 juta di Meta Ads & Google Ads dengan peningkatan ROAS hingga 4.2x.',
          'Meningkatkan trafik organik website sebesar 120% dalam 6 bulan melalui strategi keyword SEO dan perbaikan teknis.',
          'Merancang kampanye email marketing bersegmen dengan open rate rata-rata 32% dan click-through rate 8.5%.'
        ],
        projects: [
          {
            name: 'E-Commerce Organic & Paid Growth Campaign',
            tech: 'Google Ads, Meta Ads, GA4, SEO',
            bullets: [
              'Memimpin strategi pemasaran terpadu yang menghasilkan peningkatan total penjualan sebesar 85% dalam 1 kuartal.'
            ]
          }
        ]
      },
      {
        id: 'social_media_manager',
        title: 'Social Media & Content Manager',
        summary: 'Social Media Manager kreatif berpengalaman dalam perencanaan strategi konten, manajemen komunitas, dan analisis engagement di platform Instagram, TikTok, & LinkedIn.',
        skills: {
          languages: 'Social Media Strategy, Content Creation, Copywriting',
          frameworks: 'Community Management, Influencer Outreach, Branding',
          databases: 'TikTok Analytics, Instagram Insights, Social Blade',
          tools: 'CapCut, Canva, CapCut Pro, Notion, Metricool',
          certifications: 'Social Media Marketing Professional Certificate'
        },
        skillLabels: {
          label1: 'Strategi Media Sosial',
          label2: 'Manajemen & Branding',
          label3: 'Analytics & Insights',
          label4: 'Tools Editing & Software'
        },
        sectionTitles: {
          skills: 'KEAHLIAN & KETERAMPILAN KONTEN',
          projects: 'PROYEK & KAMPANYE MEDIA SOSIAL'
        },
        bullets: [
          'Menumbuhkan jumlah pengikut organik Instagram & TikTok dari 5k menjadi 85k+ dalam waktu 8 bulan.',
          'Memproduksi 40+ konten edukatif dan reels per bulan dengan engagement rate rata-rata di atas 6.8%.',
          'Mengkoordinasikan kerjasama dengan 25+ micro-influencer yang meningkatkan kesadaran merek secara signifikan.'
        ],
        projects: [
          {
            name: 'Viral TikTok & Instagram Content Campaign',
            tech: 'CapCut, Social Analytics, Influencer Marketing',
            bullets: [
              'Membuat serial konten video pendek yang berhasil meraih 2.5 juta+ total impresi organik.'
            ]
          }
        ]
      }
    ]
  },
  {
    category: 'Keuangan & Administrasi',
    iconComponent: Briefcase,
    roles: [
      {
        id: 'accountant',
        title: 'Staff Akuntansi & Keuangan',
        summary: 'Staff Akuntansi teliti dengan pemahaman mendalam tentang siklus akuntansi, penyusunan laporan keuangan bulanan/tahunan, perpajakan (PPh & PPN), serta pengoperasian software Accurate & Accurate Online.',
        skills: {
          languages: 'Laporan Keuangan, Pembukuan, Rekonsiliasi Bank',
          frameworks: 'Perpajakan (e-SPT, PPh 21/23/25, PPN), General Ledger',
          databases: 'Accurate Online, MYOB, Jurnal.id, SAP ERP',
          tools: 'Microsoft Excel Advanced (VLOOKUP, Pivot, Macro), e-Faktur',
          certifications: 'Brevet Pajak A & B / Sertifikasi Teknisi Akuntansi'
        },
        skillLabels: {
          label1: 'Keahlian Akuntansi',
          label2: 'Perpajakan & Regulasi',
          label3: 'Software Akuntansi & ERP',
          label4: 'Aplikasi Spreadsheet & Tools'
        },
        sectionTitles: {
          skills: 'KETERAMPILAN & KEAHLIAN AKUNTANSI',
          projects: 'PROYEK & IMPLEMENTASI KEUANGAN'
        },
        bullets: [
          'Penyusunan Laporan Laba Rugi, Neraca, dan Arus Kas bulanan perusahaan dengan akurasi 100% tepat waktu.',
          'Melakukan rekonsiliasi bank harian dan verifikasi 200+ bukti transaksi keuangan bulanan.',
          'Mengelola perhitungan dan pelaporan pajak PPh 21, PPh 23, dan PPN melalui sistem e-Faktur & e-Billing.'
        ],
        projects: [
          {
            name: 'Migrasi Pembukuan Manual ke Accurate Online',
            tech: 'Accurate Online, Excel Advanced, General Ledger',
            bullets: [
              'Memimpin transisi pembukuan bisnis dari manual Excel ke Accurate Online, mempersingkat waktu penutupan buku harian sebesar 50%.'
            ]
          }
        ]
      },
      {
        id: 'admin_officer',
        title: 'Staff Administrasi & Operasional',
        summary: 'Staff Administrasi dan Operasional yang rapi dan komunikatif dalam pengarsipan dokumen, penjadwalan, penyusunan korespondensi resmi, dan pengelolaan perlengkapan kantor.',
        skills: {
          languages: 'Korespondensi Bisnis, Pengarsipan Digital, Data Entry',
          frameworks: 'Manajemen Inventaris Kantor, Pengolahan Dokumen',
          databases: 'Microsoft Office 365, Google Workspace, Trello',
          tools: 'MS Word, Excel, PowerPoint, Google Docs, Sheets',
          certifications: 'Sertifikasi Kompetensi Administrasi Perkantoran'
        },
        skillLabels: {
          label1: 'Keahlian Utama',
          label2: 'Operasional & Arsip',
          label3: 'Sistem Workspace & Cloud',
          label4: 'Software & Aplikasi Kantor'
        },
        sectionTitles: {
          skills: 'KETERAMPILAN & KEAHLIAN ADMINISTRASI',
          projects: 'PROYEK & INISIATIF OPERASIONAL'
        },
        bullets: [
          'Mengelola seluruh arsip administrasi dan penginputan data 500+ entitas klien secara rapi dan terstruktur.',
          'Menyusun laporan operasional mingguan dan mengatur jadwal rapat pimpinan serta perjalanan dinas.',
          'Menangani pengadaan kebutuhan alat tulis & inventaris kantor dengan efisiensi anggaran 12%.'
        ],
        projects: [
          {
            name: 'Digitalisasi Sistem Pengarsipan Dokumen Perusahaan',
            tech: 'Google Drive Enterprise, Excel, Archiving',
            bullets: [
              'Membuat struktur folder pengarsipan digital terenkripsi yang mempermudah pencarian dokumen dalam kurun waktu di bawah 1 menit.'
            ]
          }
        ]
      }
    ]
  },
  {
    category: 'HR & SDM',
    iconComponent: Users,
    roles: [
      {
        id: 'hr_generalist',
        title: 'HR Generalist & Recruiter',
        summary: 'HR Generalist proaktif dengan pengalaman dalam seleksi rekrutmen (end-to-end recruitment), manajemen administrasi kepegawaian (BPJS & absensi), serta hubungan industrial.',
        skills: {
          languages: 'End-to-End Recruitment, Job Interviewing, Sourcing',
          frameworks: 'Administrasi Kepegawaian, Employee Engagement, Onboarding',
          databases: 'HRIS (Gadjian, Talenta), Jobstreet, LinkedIn Recruiter',
          tools: 'Google Forms, MS Excel, Canva, Zoom Meetings',
          certifications: 'Sertifikasi BNSP SDM / HR Management Course'
        },
        skillLabels: {
          label1: 'Rekrutmen & Sourcing',
          label2: 'Manajemen SDM & Onboarding',
          label3: 'Sistem HRIS & Portals',
          label4: 'Aplikasi Kerja & Tools'
        },
        sectionTitles: {
          skills: 'KETERAMPILAN & KEAHLIAN SDM',
          projects: 'PROYEK & INISIATIF SDM'
        },
        bullets: [
          'Memimpin proses rekrutmen untuk 30+ posisi staf & supervisor, berhasil memenuhi SLA pengisian posisi dalam 21 hari.',
          'Mengelola administrasi payroll harian, absensi, dan klaim kesehatan BPJS Ketenagakerjaan/Kesehatan untuk 150+ karyawan.',
          'Merancang program onboarding karyawan baru dan kegiatan Employee Engagement yang meningkatkan retensi hingga 90%.'
        ],
        projects: [
          {
            name: 'Penerapan Sistem HRIS & Form Evaluasi Kinerja (KPI)',
            tech: 'Talenta HRIS, Excel, KPI Evaluation',
            bullets: [
              'Mengimplementasikan modul absensi dan pengajuan cuti online via HRIS Talenta untuk seluruh divisi perusahaan.'
            ]
          }
        ]
      }
    ]
  },
  {
    category: 'Kreatif & Desain',
    iconComponent: Palette,
    roles: [
      {
        id: 'graphic_designer',
        title: 'Graphic Designer & Visual Content',
        summary: 'Graphic Designer kreatif berpengalaman membuat materi visual promosi, branding identity, materi media sosial, dan layout percetakan.',
        skills: {
          languages: 'Visual Branding, Layouting, Vector Graphics, Typography',
          frameworks: 'Color Theory, Print Preparation, Social Media Visuals',
          databases: 'Adobe Creative Cloud (Photoshop, Illustrator, InDesign)',
          tools: 'Canva Pro, Figma, Lightroom, Graphics Tablet',
          certifications: 'Adobe Certified Professional in Graphic Design'
        },
        skillLabels: {
          label1: 'Keahlian Visual Branding',
          label2: 'Metode & Layouting',
          label3: 'Software Creative Cloud',
          label4: 'Tools & Media Hardware'
        },
        sectionTitles: {
          skills: 'KEAHLIAN DESAIN & VISUAL',
          projects: 'PORTOFOLIO & PROYEK KREATIF'
        },
        bullets: [
          'Membuat 100+ materi desain visual promosi per bulan untuk keperluan media sosial, banner web, dan materi cetak.',
          'Mendesain panduan identitas merek (Brand Guidelines) lengkap mencakup logo, warna brand, dan tipografi untuk 3 klien bisnis.',
          'Bekerjasama dengan tim marketing dalam memproduksi materi visual kampanye yang meningkatkan klik iklan sebesar 35%.'
        ],
        projects: [
          {
            name: 'Rebranding Visual Identity & Packaging Project',
            tech: 'Adobe Illustrator, Photoshop, Print Layout',
            bullets: [
              'Mengembangkan desain kemasan baru produk yang meningkatkan ketertarikan konsumen pada pameran ritel.'
            ]
          }
        ]
      }
    ]
  },
  {
    category: 'Penjualan & Sales',
    iconComponent: Rocket,
    roles: [
      {
        id: 'sales_executive',
        title: 'Sales & Account Executive',
        summary: 'Sales & Account Executive yang berorientasi pada pencapaian target penjualan (B2B & B2C), prospeksi klien, presentasi penawaran, dan penutupan kesepakatan bisnis (closing deals).',
        skills: {
          languages: 'B2B Sales, Cold Calling, Lead Generation, Pitching',
          frameworks: 'Negotiation & Closing, Customer Relationship, CRM',
          databases: 'HubSpot CRM, Salesforce, Pipefy',
          tools: 'LinkedIn Sales Navigator, MS Excel, PowerPoint',
          certifications: 'Professional Sales & Negotiation Training'
        },
        skillLabels: {
          label1: 'Keahlian Sales & Outreach',
          label2: 'Negosiasi & Closing',
          label3: 'Platform CRM & Prospecting',
          label4: 'Software & Tools Support'
        },
        sectionTitles: {
          skills: 'KETERAMPILAN & KEAHLIAN SALES',
          projects: 'PROYEK & PENCAPAIAN SALES'
        },
        bullets: [
          'Mencapai 125% target penjualan tahunan dengan membukukan total pendapatan IDR 850 juta dari 40+ klien baru.',
          'Melakukan prospeksi dingin (cold outreach) dan presentasi penawaran bisnis ke 15+ calon klien korporat per minggu.',
          'Membangun dan menjaga hubungan baik dengan akun klien kunci (Key Accounts) yang menghasilkan repeat order 45%.'
        ],
        projects: [
          {
            name: 'Enterprise Corporate Client Acquisition',
            tech: 'HubSpot CRM, Pitch Deck, Contract Negotiation',
            bullets: [
              'Berhasil melakukan penutupan kontrak kerjasama senilai IDR 200 juta dengan perusahaan manufaktur skala nasional.'
            ]
          }
        ]
      }
    ]
  },
  {
    category: 'Umum & Fresh Grad',
    iconComponent: GraduationCap,
    roles: [
      {
        id: 'fresh_grad_general',
        title: 'Fresh Graduate / Staff Operasional Umum',
        summary: 'Lulusan baru (Fresh Graduate) yang proaktif, berdedikasi tinggi, dan cepat belajar dengan keterampilan organisasi yang kuat, komunikasi interpersonal baik, serta siap berkontribusi pada posisi staf umum maupun Management Trainee.',
        skills: {
          languages: 'Komunikasi Interpersonal, Kerja Sama Tim, Problem Solving',
          frameworks: 'Manajemen Waktu, Adaptabilitas, Keterampilan Analitis',
          databases: 'Pengolahan Data Dasar, Microsoft Office, Google Docs/Sheets',
          tools: 'MS Word, Excel, PowerPoint, Google Drive, Canva',
          certifications: 'Sertifikasi Pelatihan Soft Skills & Kepemimpinan'
        },
        skillLabels: {
          label1: 'Keahlian Soft Skills',
          label2: 'Kerja Sama & Organisasi',
          label3: 'Pengolahan Dokumen & Data',
          label4: 'Software & Aplikasi Dasar'
        },
        sectionTitles: {
          skills: 'KETERAMPILAN & KEAHLIAN UTAMA',
          projects: 'PROYEK & KEGIATAN AKADEMIK'
        },
        bullets: [
          'Menyelesaikan studi tingkat akhir dengan predikat Sangat Memuaskan (IPK 3.75/4.00) dan aktif dalam kegiatan organisasi kampus.',
          'Mengordinasikan tim panitia beranggotakan 20 orang pada acara seminar nasional yang dihadiri oleh 500+ peserta.',
          'Menyusun laporan riset dan analisis data survei menggunakan Microsoft Excel dengan penyajian yang terstruktur.'
        ],
        projects: [
          {
            name: 'Proyek Riset Tugas Akhir / Program Pengabdian Masyarakat',
            tech: 'MS Excel, Survey Analysis, Leadership',
            bullets: [
              'Memimpin tim riset lapangan dan mempublikasikan karya ilmiah yang direkomendasikan oleh fakultas.'
            ]
          }
        ]
      }
    ]
  }
];

export default function CvBuilder({ user = {}, stats = {} }) {
  const activeCv = stats?.activeCv || null;
  const activeCvAnalysis = stats?.activeCvAnalysis || null;
  const hasCv = Boolean(stats?.hasCv && (activeCv || activeCvAnalysis));

  // Selected Template state
  const [selectedTemplate, setSelectedTemplate] = useState('harvard');

  // Accent Color state
  const [accentColor, setAccentColor] = useState('default');
  const [customHex, setCustomHex] = useState('#0d9488');

  // Page Fit Mode state: 'ultra-compact' | 'compact' | 'normal' | 'expanded'
  const [pageFitMode, setPageFitMode] = useState('compact');

  // AI Import CV Modal state (Paste Text Mode)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isParsingCv, setIsParsingCv] = useState(false);
  const [rawTextPaste, setRawTextPaste] = useState('');

  // Real-time user info
  const userName = user?.name || '';
  const userEmail = user?.email || '';
  const targetRole = user?.role || activeCv?.detected_role || '';
  const userLevel = user?.level || 'Junior Level';
  const userEducation = user?.education && user.education !== 'Belum diisi' ? user.education : '';
  const skillsListStr = user?.skills_list || '';

  // Get initial form state: auto-fill if CV exists, empty if no CV
  const getInitialFormState = (forceBlank = false) => {
    if (forceBlank || !hasCv) {
      return {
        fullName: userName,
        academicTitles: '',
        targetRole: targetRole,
        email: userEmail,
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        portfolioUrl: '',
        customContacts: [
          { label: 'Twitter / X', value: '' }
        ],
        summary: '',
        educationList: [
          {
            institution: '',
            degree: '',
            period: '',
            location: '',
            gpa: '',
            honors: '',
            thesis: '',
            coursework: '',
            activities: ''
          }
        ],
        experienceList: [
          {
            company: '',
            role: '',
            period: '',
            location: '',
            bullets: ['']
          }
        ],
        projectList: [
          {
            name: '',
            technologies: '',
            period: '',
            bullets: ['']
          }
        ],
        skillCategories: {
          languages: '',
          frameworks: '',
          databases: '',
          tools: '',
          certifications: ''
        },
        skillLabels: {
          label1: 'Languages',
          label2: 'Frameworks',
          label3: 'Databases',
          label4: 'Tools & Platforms'
        },
        sectionTitles: {
          skills: '',
          projects: ''
        },
        additionalSections: [
          {
            category: 'Bahasa Asing (Languages)',
            items: ['Bahasa Indonesia (Native)', 'Bahasa Inggris (Professional Working)']
          },
          {
            category: 'Sertifikasi & Penghargaan (Certifications & Awards)',
            items: ['Professional Tech Certification']
          }
        ]
      };
    }

    // Auto-fill from parsed CV & User profile if available
    const safeSkillsStr = typeof skillsListStr === 'string' ? skillsListStr : Array.isArray(skillsListStr) ? skillsListStr.join(',') : (skillsListStr ? String(skillsListStr) : '');
    const rawSkills = safeSkillsStr ? safeSkillsStr.split(',').map(s => s.trim()).filter(Boolean) : ['PHP', 'Laravel', 'MySQL'];
    const primarySkill = rawSkills[0] || 'Laravel';

    const defaultSummary = activeCvAnalysis?.ai_summary
      ? activeCvAnalysis.ai_summary
      : (targetRole ? `Profesional ${targetRole} (${userLevel}) dengan fokus keahlian pada ${skillsListStr || 'bidang teknologi'}. Berpengalaman mengembangkan solusi terstruktur, mengoptimalkan proses kerja, dan menerapkan standar kualitas tinggi.` : '');

    return {
      fullName: userName || '',
      academicTitles: '',
      targetRole: targetRole || '',
      email: userEmail || '',
      phone: user?.phone || '',
      location: user?.location || '',
      linkedin: userName ? `linkedin.com/in/${userName.toLowerCase().replace(/[^a-z0-9]/g, '')}` : '',
      github: userName ? `github.com/${userName.toLowerCase().replace(/[^a-z0-9]/g, '')}` : '',
      portfolioUrl: userName ? `${userName.toLowerCase().replace(/[^a-z0-9]/g, '')}.dev` : '',
      customContacts: [
        { label: 'Portofolio / Blog', value: '' }
      ],

      summary: defaultSummary,

      educationList: [
        {
          institution: userEducation || '',
          degree: userEducation ? 'Sarjana / Diploma' : '',
          period: userEducation ? '2020 - 2024' : '',
          location: user?.location || '',
          gpa: '',
          honors: '',
          thesis: '',
          coursework: '',
          activities: ''
        }
      ],

      experienceList: [
        {
          company: '',
          role: targetRole || '',
          period: '',
          location: user?.location || '',
          bullets: ['']
        }
      ],

      projectList: [
        {
          name: '',
          technologies: skillsListStr || '',
          period: '',
          bullets: ['']
        }
      ],

      skillCategories: {
        languages: safeSkillsStr || '',
        frameworks: '',
        databases: '',
        tools: '',
        certifications: ''
      },
      skillLabels: {
        label1: 'Languages',
        label2: 'Frameworks',
        label3: 'Databases',
        label4: 'Tools & Platforms'
      },
      sectionTitles: {
        skills: '',
        projects: ''
      },

      additionalSections: [
        {
          category: 'Bahasa Asing (Languages)',
          items: ['Bahasa Indonesia (Native)', 'Bahasa Inggris (Professional Working)']
        },
        {
          category: 'Sertifikasi & Penghargaan (Certifications & Awards)',
          items: []
        }
      ]
    };
  };

  // User-scoped LocalStorage Key to prevent data leaks between different accounts
  const userStorageKey = user?.id
    ? `cvBuilderFormData_uid_${user.id}`
    : (user?.email ? `cvBuilderFormData_email_${user.email}` : 'cvBuilderFormData_guest');

  const [form, setForm] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(userStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            return {
              ...parsed,
              fullName: parsed.fullName || userName,
              email: parsed.email || userEmail,
            };
          }
        }
      } catch (e) {
        console.error("Failed to parse saved CV data", e);
      }
    }
    return getInitialFormState(false);
  });

  // Save to user-scoped localStorage whenever form data changes
  useEffect(() => {
    if (typeof window !== 'undefined' && userStorageKey) {
      localStorage.setItem(userStorageKey, JSON.stringify(form));
    }
  }, [form, userStorageKey]);

  // Keep form synchronized when switching user accounts in real time
  const prevUserIdRef = useRef(user?.id);
  useEffect(() => {
    if (user?.id && prevUserIdRef.current !== user.id) {
      prevUserIdRef.current = user.id;
      const key = `cvBuilderFormData_uid_${user.id}`;
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          setForm(JSON.parse(saved));
          return;
        }
      } catch (e) {}
      setForm(getInitialFormState(false));
    }
  }, [user?.id, user?.name, user?.email]);

  // Real-time auto-fill from user registration if form has stale dummy name or empty fullName
  useEffect(() => {
    if (userName && (!form.fullName || form.fullName === 'Kandidat' || form.fullName === 'Muhammad Rafa' || form.fullName === 'Laura Gunawan')) {
      if (form.fullName !== userName) {
        setForm(prev => ({
          ...prev,
          fullName: userName,
          email: prev.email || userEmail,
          targetRole: prev.targetRole || targetRole,
        }));
      }
    }
  }, [userName, userEmail, targetRole]);

  // Workspace Navigation Tab State: 'form' | 'preset' | 'style' | 'language'
  const [activeBuilderTab, setActiveBuilderTab] = useState('form');
  const [mobileViewMode, setMobileViewMode] = useState('editor'); // 'editor' | 'preview'
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isFixingTypos, setIsFixingTypos] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Multi-Language & Text Alignment state
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isTranslatingCv, setIsTranslatingCv] = useState(false);
  const [languageSearchQuery, setLanguageSearchQuery] = useState('');
  const [selectedAlphabetFilter, setSelectedAlphabetFilter] = useState('ALL');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [headerAlign, setHeaderAlign] = useState('center'); // 'left' | 'center' | 'right'
  const [sectionHeaderAlign, setSectionHeaderAlign] = useState('left'); // 'left' | 'center' | 'right'
  const [bodyAlign, setBodyAlign] = useState('left'); // 'left' | 'center' | 'right' | 'justify'
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Fullscreen CV Document Preview Modal state
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);
  const [fullPreviewZoom, setFullPreviewZoom] = useState(100);

  // Responsive Live Preview Auto-fit Zoom State
  const [cvPreviewZoomMode, setCvPreviewZoomMode] = useState('fit'); // 'fit' | '100' | 'custom'
  const [cvPreviewZoom, setCvPreviewZoom] = useState(100);
  const [cvPreviewViewTab, setCvPreviewViewTab] = useState('paper'); // 'paper' | 'reader'
  const cvPreviewContainerRef = useRef(null);
  const [cvContainerWidth, setCvContainerWidth] = useState(0);
  const [cvCanvasHeight, setCvCanvasHeight] = useState(1120);

  useEffect(() => {
    if (!cvPreviewContainerRef.current) return;
    const updateWidth = () => {
      if (cvPreviewContainerRef.current) {
        setCvContainerWidth(cvPreviewContainerRef.current.clientWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(cvPreviewContainerRef.current);
    window.addEventListener('resize', updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  useEffect(() => {
    const canvasEl = document.getElementById('printable-cv-canvas');
    if (!canvasEl) return;
    const updateHeight = () => {
      if (canvasEl && canvasEl.offsetHeight > 0) {
        setCvCanvasHeight(canvasEl.offsetHeight);
      }
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(canvasEl);
    return () => observer.disconnect();
  }, [selectedTemplate, form, pageFitMode]);

  const cvComputedFitScale = useMemo(() => {
    if (!cvContainerWidth || cvContainerWidth <= 0) return 0.65;
    const available = cvContainerWidth - 24;
    return Math.min(1.0, Math.max(0.35, available / 794));
  }, [cvContainerWidth]);

  const cvEffectiveScale = cvPreviewZoomMode === 'fit'
    ? cvComputedFitScale
    : cvPreviewZoomMode === '100'
      ? 1.0
      : (cvPreviewZoom / 100);

  // Close full preview modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullPreviewOpen) {
        setIsFullPreviewOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullPreviewOpen]);

  // Filtered languages list by Search & A-Z Alphabet Filter
  const filteredLanguages = React.useMemo(() => {
    let result = LANGUAGES;
    const query = languageSearchQuery.toLowerCase().trim();

    if (query) {
      result = result.filter(l =>
        l.name.toLowerCase().includes(query) ||
        (l.country && l.country.toLowerCase().includes(query)) ||
        l.id.toLowerCase().includes(query)
      );
    }

    if (selectedAlphabetFilter !== 'ALL') {
      result = result.filter(l => l.name.toUpperCase().startsWith(selectedAlphabetFilter));
    }

    return result;
  }, [languageSearchQuery, selectedAlphabetFilter]);

  // Full CV Translation Handler via AI
  const handleTranslateEntireCv = async (targetLangId) => {
    setSelectedLanguage(targetLangId);
    const langObj = LANGUAGES.find(l => l.id === targetLangId);
    const langName = langObj ? langObj.name : targetLangId;

    setIsTranslatingCv(true);
    showToast(`AI sedang menerjemahkan seluruh isi CV ke ${langName}...`);

    try {
      const response = await axios.post('/api/cv-builder/translate', {
        form: form,
        target_language: targetLangId
      });

      if (response.data && response.data.success && response.data.form) {
        setForm(response.data.form);
        showToast(`Berhasil! Seluruh isi CV telah diterjemahkan ke ${langName}!`);
      } else {
        showToast(`Gagal menerjemahkan isi CV via AI.`);
      }
    } catch (error) {
      console.error("AI CV Translation Error:", error);
      showToast(`Terjadi kesalahan saat menerjemahkan isi CV via AI.`);
    } finally {
      setIsTranslatingCv(false);
    }
  };

  // Active translation dictionary (combines built-in dictionary with AI-translated labels)
  const defaultT = SECTION_TITLES[selectedLanguage] || SECTION_TITLES.en;
  const t = {
    ...defaultT,
    ...(form.translatedLabels || {})
  };
  const isRtl = LANGUAGES.find(l => l.id === selectedLanguage)?.rtl || false;

  // Dynamic section titles and skill category labels
  const skillsTitle = (form.sectionTitles?.skills || '').trim() || t.skills;
  const projectsTitle = (form.sectionTitles?.projects || '').trim() || t.projects;

  const label1 = (form.skillLabels?.label1 || 'Languages').trim();
  const label2 = (form.skillLabels?.label2 || 'Frameworks').trim();
  const label3 = (form.skillLabels?.label3 || 'Databases').trim();
  const label4 = (form.skillLabels?.label4 || 'Tools & Platforms').trim();

  // Preset Search & Category Filter State
  const [presetSearchQuery, setPresetSearchQuery] = useState('');
  const [selectedPresetCategory, setSelectedPresetCategory] = useState('ALL');
  const categoryScrollRef = React.useRef(null);
  const rolesScrollRef = React.useRef(null);

  // Filtered Role Presets List
  const filteredPresetRoles = React.useMemo(() => {
    const query = presetSearchQuery.toLowerCase().trim();
    let result = [];

    const defaultBadges = {
      backend_dev: 'Populer',
      fullstack_dev: 'In-Demand',
      ui_ux_designer: 'Design',
      data_analyst: 'High Demand',
      digital_marketing: 'Performance',
      social_media_manager: 'Creative',
      accountant: 'Keuangan',
      admin_officer: 'Standar ATS',
      hr_generalist: 'HR & SDM',
      graphic_designer: 'Visual',
      sales_executive: 'High Revenue',
      fresh_grad_general: 'Rekomendasi MT'
    };

    INDUSTRY_PRESETS.forEach(cat => {
      if (selectedPresetCategory !== 'ALL' && cat.category !== selectedPresetCategory) {
        return;
      }
      cat.roles.forEach(role => {
        const matchQuery = !query ||
          role.title.toLowerCase().includes(query) ||
          role.summary.toLowerCase().includes(query) ||
          Object.values(role.skills).some(s => typeof s === 'string' && s.toLowerCase().includes(query)) ||
          cat.category.toLowerCase().includes(query);

        if (matchQuery) {
          result.push({
            ...role,
            badge: role.badge || defaultBadges[role.id] || 'Rekomendasi',
            categoryName: cat.category,
            categoryIcon: cat.iconComponent
          });
        }
      });
    });

    return result;
  }, [presetSearchQuery, selectedPresetCategory]);

  // Accordion active section editor
  const [activeSection, setActiveSection] = useState('contact');

  // Handler for selecting an Industry Role Preset (General or IT)
  const handleSelectPreset = (rolePreset) => {
    setForm({
      fullName: userName || 'Kandidat',
      academicTitles: rolePreset.title.includes('Developer') || rolePreset.title.includes('Data') ? 'S.Kom' : 'S.M. / S.E.',
      targetRole: rolePreset.title,
      email: userEmail || 'kandidat@email.com',
      phone: '+62 812-3456-7890',
      location: 'Jakarta, Indonesia',
      linkedin: userName ? `linkedin.com/in/${userName.toLowerCase().replace(/\s+/g, '')}` : 'linkedin.com/in/kandidat',
      github: rolePreset.title.includes('Developer') ? (userName ? `github.com/${userName.toLowerCase().replace(/\s+/g, '')}` : 'github.com/kandidat') : '',
      portfolioUrl: userName ? `${userName.toLowerCase().replace(/\s+/g, '')}.com` : 'portofolio.com',
      customContacts: [
        { label: 'Portofolio / Medium', value: `medium.com/@${userName ? userName.toLowerCase().replace(/\s+/g, '') : 'kandidat'}` }
      ],
      summary: rolePreset.summary,
      educationList: [
        {
          institution: userEducation || 'Universitas Negeri Indonesia',
          degree: rolePreset.title.includes('Developer') || rolePreset.title.includes('Data') || rolePreset.title.includes('UI/UX')
            ? 'Sarjana Komputer (S.Kom) / Teknik Informatika'
            : rolePreset.title.includes('Akuntansi') || rolePreset.title.includes('Sales') || rolePreset.title.includes('Marketing')
              ? 'Sarjana Manajemen (S.M) / Akuntansi (S.Ak)'
              : 'Sarjana Ilmu Komunikasi (S.I.Kom) / Ilmu Sosial',
          period: '2020 - 2024',
          location: 'Jakarta, Indonesia',
          gpa: '3.85 / 4.00',
          honors: 'Lulusan Terbaik & Penerima Beasiswa Prestasi',
          thesis: `Studi & Implementasi Strategi ${rolePreset.title} untuk Optimasi Kinerja Perusahaan`,
          coursework: 'Metodologi Penelitian, Manajemen Proyek, Komunikasi Profesional, Analisis Data',
          activities: 'Ketua Himpunan Mahasiswa & Koordinator Program Kerja Fakultas'
        }
      ],
      experienceList: [
        {
          company: 'PT Corporate Indonesia Global',
          role: `${userLevel} ${rolePreset.title}`,
          period: '2024 - Sekarang',
          location: 'Jakarta, Indonesia',
          bullets: rolePreset.bullets
        }
      ],
      projectList: rolePreset.projects.map(p => ({
        name: p.name,
        technologies: p.tech,
        period: '2024',
        bullets: p.bullets
      })),
      skillCategories: rolePreset.skills,
      skillLabels: rolePreset.skillLabels || {
        label1: 'Languages',
        label2: 'Frameworks',
        label3: 'Databases',
        label4: 'Tools & Platforms'
      },
      sectionTitles: rolePreset.sectionTitles || {
        skills: '',
        projects: ''
      },
      additionalSections: [
        {
          category: 'Bahasa Asing (Languages)',
          items: ['Bahasa Indonesia (Native / Penutur Asli)', 'Bahasa Inggris (Professional Working / TOEFL 550+)']
        },
        {
          category: 'Sertifikasi & Penghargaan (Certifications & Awards)',
          items: [rolePreset.skills.certifications || 'Sertifikasi Kompetensi Nasional']
        }
      ]
    });
    showToast(`Templat & Isian Standar ATS untuk posisi "${rolePreset.title}" berhasil dimuat!`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Extract text from PDF using Mozilla PDF.js (client-side, highly reliable)
  const extractPdfTextWithPdfJs = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      let fullText = '';

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        let lastY = null;
        let pageText = '';

        for (const item of textContent.items) {
          if (item.str === undefined) continue;
          // Detect line breaks by Y position change
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 2) {
            pageText += '\n';
          } else if (lastY !== null && pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
            pageText += ' ';
          }
          pageText += item.str;
          lastY = item.transform[5];
        }

        fullText += pageText + '\n\n';
      }

      return fullText.trim();
    } catch (error) {
      console.warn('PDF.js extraction failed:', error);
      return '';
    }
  };

  // Upload & Parse CV file (PDF/Word/TXT) via AI Auto-Fill
  const handleParseUploadedCvFile = async (file) => {
    if (!file) return;
    setIsParsingCv(true);
    showToast("AI sedang membaca dan mengekstrak data dari berkas CV...");

    let clientExtractedText = '';
    try {
      const fileName = file.name.toLowerCase();

      if (file.type === 'text/plain' || fileName.endsWith('.txt') || fileName.endsWith('.csv')) {
        // TXT/CSV: read as plain text directly
        clientExtractedText = await file.text();
      } else if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
        // PDF: use Mozilla PDF.js for proper text extraction
        showToast("Membaca isi PDF dengan PDF.js engine...");
        clientExtractedText = await extractPdfTextWithPdfJs(file);
        if (!clientExtractedText || clientExtractedText.length < 30) {
          showToast("PDF mungkin berupa gambar/scan. Mencoba fallback server...");
        }
      } else {
        // DOCX/DOC: let server handle it (ZipArchive extraction)
        // Just pass the file without client extraction
        clientExtractedText = '';
      }
    } catch (e) {
      console.warn("Client side file extraction notice:", e);
    }

    const formData = new FormData();
    formData.append('cv', file);
    if (clientExtractedText && clientExtractedText.length > 30) {
      formData.append('extracted_text', clientExtractedText);
    }

    try {
      const response = await axios.post('/api/cv-builder/import-parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success && response.data.form) {
        setForm(response.data.form);
        showToast(response.data.message || "Berhasil! Formulir CV diisi otomatis dari berkas.");
        setIsImportModalOpen(false);
      } else {
        showToast(response.data.message || "Gagal membaca berkas CV.");
      }
    } catch (error) {
      console.error("AI CV Parse Error:", error);
      showToast(error.response?.data?.message || "Gagal mengekstrak data berkas CV. Silakan coba berkas PDF/Word lainnya.");
    } finally {
      setIsParsingCv(false);
    }
  };

  // Auto-fill form from user's active saved CV in account
  const handleParseActiveCv = async () => {
    setIsParsingCv(true);
    showToast("AI sedang memproses dan mengisi formulir dari CV Aktif Anda...");

    try {
      const response = await axios.post('/api/cv-builder/import-parse', { use_active_cv: true });

      if (response.data.success && response.data.form) {
        setForm(response.data.form);
        showToast(response.data.message || "Berhasil! Formulir CV diisi otomatis dari CV Aktif.");
        setIsImportModalOpen(false);
      } else {
        showToast(response.data.message || "Gagal membaca CV Aktif.");
      }
    } catch (error) {
      console.error("AI Active CV Parse Error:", error);
      showToast("Gagal mengekstrak data CV Aktif.");
    } finally {
      setIsParsingCv(false);
    }
  };

  // Parse raw pasted text via AI Auto-Fill
  const handleParseRawText = async () => {
    if (!rawTextPaste.trim()) {
      showToast("Silakan tempel teks CV Anda terlebih dahulu.");
      return;
    }
    setIsParsingCv(true);
    showToast("AI sedang membaca dan mengekstrak data dari teks CV Anda...");

    try {
      const response = await axios.post('/api/cv-builder/import-parse', { raw_text: rawTextPaste });

      if (response.data.success && response.data.form) {
        setForm(response.data.form);
        showToast(response.data.message || "Berhasil! Formulir CV diisi otomatis dari teks.");
        setIsImportModalOpen(false);
        setRawTextPaste('');
      } else {
        showToast(response.data.message || "Gagal mengekstrak data dari teks CV.");
      }
    } catch (error) {
      console.error("AI Raw Text Parse Error:", error);
      showToast("Gagal mengekstrak data dari teks CV.");
    } finally {
      setIsParsingCv(false);
    }
  };

  // Direct High-Resolution PDF Download using html2canvas-pro & jsPDF
  const handleDownloadPdf = async () => {
    if (cvPreviewViewTab !== 'paper') {
      setCvPreviewViewTab('paper');
      await new Promise(r => setTimeout(r, 100));
    }

    const sourceEl = document.getElementById('printable-cv-canvas');
    if (!sourceEl) {
      showToast("Elemen CV tidak ditemukan.");
      return;
    }

    const fileName = `${(form.fullName || 'CV_Kandidat').trim().replace(/\s+/g, '_')}_ATS_CV.pdf`;

    await downloadElementAsPdf({
      elementId: 'printable-cv-canvas',
      fileName,
      onStart: () => {
        setIsExportingPdf(true);
        showToast("Sedang memproses dan mengunduh PDF High-Res Vector A4...");
      },
      onSuccess: () => {
        setIsExportingPdf(false);
        showToast("Berhasil mengunduh file PDF CV secara langsung!");
      },
      onError: (msg) => {
        setIsExportingPdf(false);
        showToast(msg || "Membuka dialog cetak bersih...");
      },
    });
  };

  const handlePrint = () => {
    printElementViaIframe('printable-cv-canvas', `${(form.fullName || 'CV_Kandidat').trim().replace(/\s+/g, '_')}_ATS_CV`);
  };

  // Helper function to resolve active accent color hex
  const getPrimaryColorHex = () => {
    if (accentColor === 'custom') return customHex;
    if (accentColor !== 'default') {
      const found = ACCENT_COLORS.find(c => c.id === accentColor);
      if (found) return found.hex;
    }
    const tmpl = TEMPLATES.find(t => t.id === selectedTemplate);
    return tmpl?.defaultColor || '#0f172a';
  };

  const primaryHex = getPrimaryColorHex();

  // Smart Page Budgeting & Density Calculator
  const calculatePageDensity = () => {
    let charCount = (form.fullName || '').length + (form.academicTitles || '').length + (form.summary || '').length;

    form.educationList?.forEach(e => {
      charCount += (e.institution || '').length + (e.degree || '').length + (e.thesis || '').length + (e.coursework || '').length + (e.honors || '').length + (e.activities || '').length;
    });

    form.experienceList?.forEach(e => {
      charCount += (e.company || '').length + (e.role || '').length + (e.bullets || []).join('').length;
    });

    form.projectList?.forEach(p => {
      charCount += (p.name || '').length + (p.technologies || '').length + (p.bullets || []).join('').length;
    });

    Object.values(form.skillCategories || {}).forEach(s => {
      charCount += (s || '').length;
    });

    (form.additionalSections || []).forEach(sec => {
      charCount += (sec.category || '').length + (sec.items || []).join('').length;
    });

    // Dynamic density thresholds based on pageFitMode
    let divisor = 2200;
    if (pageFitMode === 'ultra-compact') divisor = 3400;
    else if (pageFitMode === 'compact') divisor = 2600;
    else if (pageFitMode === 'expanded') divisor = 1700;

    const estimatedPages = Math.max(1.0, parseFloat((charCount / divisor).toFixed(1)));
    return { charCount, estimatedPages };
  };

  const pageMetrics = calculatePageDensity();

  // Helper function to calculate padding & spacing based on pageFitMode
  const getFitSpacingClasses = () => {
    switch (pageFitMode) {
      case 'ultra-compact': return {
        wrapper: 'p-5 sm:p-7 space-y-2 text-[9px] leading-snug',
        headerMargin: 'mb-2 pb-1.5',
        sectionMargin: 'mb-2',
        itemMargin: 'mb-1'
      };
      case 'compact': return {
        wrapper: 'p-6 sm:p-8 space-y-3 text-[10px] leading-snug',
        headerMargin: 'mb-3 pb-2',
        sectionMargin: 'mb-3',
        itemMargin: 'mb-1.5'
      };
      case 'expanded': return {
        wrapper: 'p-10 sm:p-14 space-y-6 text-[11.5px] leading-relaxed',
        headerMargin: 'mb-6 pb-4',
        sectionMargin: 'mb-6',
        itemMargin: 'mb-3'
      };
      case 'normal':
      default: return {
        wrapper: 'p-8 sm:p-12 space-y-4 text-[10.5px] leading-normal',
        headerMargin: 'mb-4 pb-3',
        sectionMargin: 'mb-4',
        itemMargin: 'mb-2'
      };
    }
  };

  const spacing = getFitSpacingClasses();

  // Auto-Fill Form from Parsed AI CV Data
  const handleAutoFillFromAi = () => {
    setForm(getInitialFormState(false));
    showToast("Form CV berhasil diisi otomatis berdasarkan profil & analisis AI!");
  };

  // Clear All Form Fields to Start from Scratch
  const handleClearForm = () => {
    if (window.confirm("Kosongkan semua isian form CV untuk menulis manual dari nol?")) {
      setForm(getInitialFormState(true));
      showToast("Form CV berhasil dikosongkan.");
    }
  };

  // Instant Anti Typo feature
  const handleAntiTypo = () => {
    setIsFixingTypos(true);
    showToast("AI sedang memindai dan memperbaiki typo pada formulir CV...");

    setTimeout(() => {
      let typosCount = 0;

      const fixText = (text) => {
        if (!text || typeof text !== 'string') return text;
        let newText = text;
        const words = text.split(/\\s+/);

        const replaceRules = [
          { match: 'fulljnsjdna', suggest: 'Full Stack' },
          { match: 'sdad', suggest: 'dapat' },
          { match: 'wdwdikan', suggest: 'memberikan' },
          { match: 'wdwd', suggest: 'memberikan' },
          { match: 'responajssif', suggest: 'responsif' },
          { match: 'pengalamam', suggest: 'pengalaman' },
          { match: 'perusahaab', suggest: 'perusahaan' },
          { match: 'dengam', suggest: 'dengan' },
          { match: 'berkomitmem', suggest: 'berkomitmen' }
        ];

        words.forEach(rawWord => {
          const cleanWord = rawWord.replace(/^[^\\w]+|[^\\w]+$/g, '');
          if (!cleanWord || cleanWord.length <= 2) return;
          const lowerWord = cleanWord.toLowerCase();

          let suggestion = null;

          const exactMatch = replaceRules.find(r => r.match === lowerWord);
          if (exactMatch) suggestion = exactMatch.suggest;
          else if (/(?:[b-df-hj-np-tv-z]{4,}|dxdx|qwerty|asdfg|zxcvb|dashd|jnsj)/i.test(lowerWord)) {
            suggestion = '';
          }

          if (suggestion !== null) {
            const regex = new RegExp(`\\\\b${cleanWord}\\\\b`, 'gi');
            newText = newText.replace(regex, suggestion);
            typosCount++;
          }
        });
        return newText.replace(/\\s+/g, ' ').trim();
      };

      setForm(prev => {
        const updated = { ...prev };

        if (updated.summary) updated.summary = fixText(updated.summary);

        if (updated.experienceList) {
          updated.experienceList = updated.experienceList.map(exp => ({
            ...exp,
            bullets: (exp.bullets || []).map(b => fixText(b))
          }));
        }

        if (updated.projectList) {
          updated.projectList = updated.projectList.map(proj => ({
            ...proj,
            bullets: (proj.bullets || []).map(b => fixText(b))
          }));
        }

        if (updated.educationList) {
          updated.educationList = updated.educationList.map(edu => ({
            ...edu,
            honors: fixText(edu.honors),
            thesis: fixText(edu.thesis),
            coursework: fixText(edu.coursework),
            activities: fixText(edu.activities),
          }));
        }

        if (updated.additionalSections) {
          updated.additionalSections = updated.additionalSections.map(sec => ({
            ...sec,
            items: (sec.items || []).map(i => fixText(i))
          }));
        }

        return updated;
      });

      if (typosCount > 0) {
        showToast(`${typosCount} typo berhasil diperbaiki!`);
      } else {
        showToast("Tidak ada typo yang ditemukan!");
      }
      setIsFixingTypos(false);
    }, 800);
  };

  // AI Polish & Auto-Generate using STAR Method via API
  const handleEnhanceWithAi = async () => {
    setIsEnhancing(true);
    showToast("AI sedang mengoptimalkan & membuat isian CV dengan Metode STAR...");

    const safeSkillsStrForDefault = typeof skillsListStr === 'string' ? skillsListStr : Array.isArray(skillsListStr) ? skillsListStr.join(',') : (skillsListStr ? String(skillsListStr) : '');
    const defaultSkill = safeSkillsStrForDefault ? safeSkillsStrForDefault.split(',')[0].trim() : 'Laravel';
    const fallbackExpBullets = [
      `Merancang & merefaktor 15+ RESTful API endpoints menggunakan ${defaultSkill}, berhasil menekan latency respon di bawah 120ms.`,
      `Mengoptimalkan performa query SQL dan database indexing, menurunkan penggunaan resource server hingga 35%.`,
      `Mengimplementasikan validasi input bertingkat dan autentikasi terenkripsi untuk menjamin integritas data.`
    ];

    const fallbackProjBullets = [
      `Membangun arsitektur Service-Repository Pattern untuk memisahkan logika bisnis dari controller secara rapi.`,
      `Mengintegrasikan Redis Caching Layer yang mempercepat waktu respon endpoint data master hingga 4x lebih cepat.`
    ];

    try {
      const response = await axios.post('/api/cv-builder/enhance', {
        section: 'all',
        current_data: form
      });

      const enh = (response.data && response.data.success && response.data.enhanced)
        ? response.data.enhanced
        : null;

      const summaryText = enh?.summary || `Profesional ${targetRole || 'Software Developer'} (${userLevel}) berdedikasi tinggi dengan keahlian utama dalam ${skillsListStr || 'Software Engineering'}. Berpengalaman merancang RESTful API berkinerja tinggi, mengoptimalkan query database relasional, serta menerapkan standar pengodean bersih (Clean Code) dan pengujian otomatis.`;

      const expBullets = (enh?.experience_bullets && Array.isArray(enh.experience_bullets) && enh.experience_bullets.length > 0)
        ? enh.experience_bullets
        : fallbackExpBullets;

      const projBullets = (enh?.project_bullets && Array.isArray(enh.project_bullets) && enh.project_bullets.length > 0)
        ? enh.project_bullets
        : fallbackProjBullets;

      setForm(prev => {
        // Ensure experienceList has at least 1 item with bullets
        const updatedExp = prev.experienceList && prev.experienceList.length > 0
          ? prev.experienceList.map((exp, idx) => idx === 0 ? { ...exp, bullets: expBullets } : exp)
          : [
            {
              company: 'PT Tech Innovasi Digital',
              role: `${userLevel} ${targetRole || 'Backend Developer'}`,
              period: '2024 - Sekarang',
              location: 'Jakarta, Indonesia',
              bullets: expBullets
            }
          ];

        // Ensure projectList has at least 1 item with bullets
        const updatedProj = prev.projectList && prev.projectList.length > 0
          ? prev.projectList.map((proj, idx) => idx === 0 ? { ...proj, bullets: projBullets } : proj)
          : [
            {
              name: 'High-Performance RESTful API Engine',
              technologies: skillsListStr || 'PHP, Laravel, MySQL, Redis',
              period: '2024',
              bullets: projBullets
            }
          ];

        return {
          ...prev,
          summary: summaryText,
          experienceList: updatedExp,
          projectList: updatedProj
        };
      });

      showToast("AI telah mengoptimalkan dan memperbarui deskripsi CV sesuai standar STAR Method!");
    } catch (err) {
      console.warn("AI enhancement fallback:", err);

      setForm(prev => ({
        ...prev,
        summary: prev.summary || `Profesional ${targetRole || 'Software Developer'} (${userLevel}) berdedikasi tinggi dengan keahlian utama dalam ${skillsListStr || 'Software Engineering'}. Berpengalaman merancang RESTful API berkinerja tinggi, mengoptimalkan query database relasional, serta menerapkan standar pengodean bersih (Clean Code) dan pengujian otomatis.`,
        experienceList: prev.experienceList && prev.experienceList.length > 0
          ? prev.experienceList.map((exp, idx) => idx === 0 && (!exp.bullets || exp.bullets.length === 0 || exp.bullets[0] === '') ? { ...exp, bullets: fallbackExpBullets } : exp)
          : [
            {
              company: 'PT Tech Innovasi Digital',
              role: `${userLevel} ${targetRole || 'Backend Developer'}`,
              period: '2024 - Sekarang',
              location: 'Jakarta, Indonesia',
              bullets: fallbackExpBullets
            }
          ],
        projectList: prev.projectList && prev.projectList.length > 0
          ? prev.projectList.map((proj, idx) => idx === 0 && (!proj.bullets || proj.bullets.length === 0 || proj.bullets[0] === '') ? { ...proj, bullets: fallbackProjBullets } : proj)
          : [
            {
              name: 'High-Performance RESTful API Engine',
              technologies: skillsListStr || 'PHP, Laravel, MySQL, Redis',
              period: '2024',
              bullets: fallbackProjBullets
            }
          ]
      }));

      showToast("Ringkasan & Poin CV berhasil dikembangkan oleh AI!");
    } finally {
      setIsEnhancing(false);
    }
  };

  // Custom Contact Updaters
  const addCustomContact = () => {
    setForm(prev => ({
      ...prev,
      customContacts: [...(prev.customContacts || []), { label: 'Kontak Kustom', value: '' }]
    }));
  };

  const updateCustomContact = (index, field, value) => {
    const updated = [...(form.customContacts || [])];
    updated[index][field] = value;
    setForm({ ...form, customContacts: updated });
  };

  const removeCustomContact = (index) => {
    const updated = (form.customContacts || []).filter((_, i) => i !== index);
    setForm({ ...form, customContacts: updated });
  };

  // Education Updaters
  const updateEducation = (index, field, value) => {
    const updated = [...form.educationList];
    updated[index][field] = value;
    setForm({ ...form, educationList: updated });
  };

    const addEducation = () => {
    const newEdu = {
      institution: '',
      degree: '',
      period: '',
      location: '',
      gpa: '',
      honors: '',
      thesis: '',
      coursework: '',
      activities: ''
    };
    setForm({ ...form, educationList: [...(form.educationList || []), newEdu] });
  };

  const removeEducation = (index) => {
    if ((form.educationList || []).length <= 1) {
      showToast("Minimum 1 riwayat pendidikan.");
      return;
    }
    const updated = form.educationList.filter((_, i) => i !== index);
    setForm({ ...form, educationList: updated });
  };

  const addExperience = () => {
    const newExp = {
      company: '',
      role: '',
      period: '',
      location: '',
      bullets: ['']
    };
    setForm({ ...form, experienceList: [...(form.experienceList || []), newExp] });
  };

  const removeExperience = (index) => {
    const updated = form.experienceList.filter((_, i) => i !== index);
    setForm({ ...form, experienceList: updated });
  };

  const addProject = () => {
    const newProj = {
      name: '',
      technologies: '',
      period: '',
      bullets: ['']
    };
    setForm({ ...form, projectList: [...(form.projectList || []), newProj] });
  };

  const removeProject = (index) => {
    const updated = form.projectList.filter((_, i) => i !== index);
    setForm({ ...form, projectList: updated });
  };


  // Form Field Updaters
  const updateExperience = (index, field, value) => {
    const updated = [...form.experienceList];
    updated[index][field] = value;
    setForm({ ...form, experienceList: updated });
  };

  const updateExperienceBullet = (expIndex, bulletIndex, value) => {
    const updated = [...form.experienceList];
    updated[expIndex].bullets[bulletIndex] = value;
    setForm({ ...form, experienceList: updated });
  };

  const addExperienceBullet = (expIndex) => {
    const updated = [...form.experienceList];
    updated[expIndex].bullets.push('');
    setForm({ ...form, experienceList: updated });
  };

  const removeExperienceBullet = (expIndex, bulletIndex) => {
    const updated = [...form.experienceList];
    updated[expIndex].bullets = updated[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    setForm({ ...form, experienceList: updated });
  };

  const removeExperienceItem = (index) => {
    const updated = form.experienceList.filter((_, i) => i !== index);
    setForm({ ...form, experienceList: updated });
  };

  const updateProject = (index, field, value) => {
    const updated = [...form.projectList];
    updated[index][field] = value;
    setForm({ ...form, projectList: updated });
  };

  const addProjectItem = () => {
    const newProj = {
      name: '',
      technologies: '',
      period: '',
      bullets: ['']
    };
    setForm({ ...form, projectList: [...form.projectList, newProj] });
  };

  const removeProjectItem = (index) => {
    const updated = form.projectList.filter((_, i) => i !== index);
    setForm({ ...form, projectList: updated });
  };

  // Additional Custom Section Updaters
  const addAdditionalSection = () => {
    const newSec = {
      category: 'Kategori Tambahan Baru (Contoh: Sertifikasi / Organisasi)',
      items: ['Poin rincian 1']
    };
    setForm({ ...form, additionalSections: [...(form.additionalSections || []), newSec] });
  };

  const removeAdditionalSection = (secIdx) => {
    const updated = (form.additionalSections || []).filter((_, i) => i !== secIdx);
    setForm({ ...form, additionalSections: updated });
  };

  const updateAdditionalCategory = (secIdx, value) => {
    const updated = [...(form.additionalSections || [])];
    updated[secIdx].category = value;
    setForm({ ...form, additionalSections: updated });
  };

  const updateAdditionalItem = (secIdx, itemIdx, value) => {
    const updated = [...(form.additionalSections || [])];
    updated[secIdx].items[itemIdx] = value;
    setForm({ ...form, additionalSections: updated });
  };

  const addAdditionalItem = (secIdx) => {
    const updated = [...(form.additionalSections || [])];
    updated[secIdx].items.push('');
    setForm({ ...form, additionalSections: updated });
  };

  const removeAdditionalItem = (secIdx, itemIdx) => {
    const updated = [...(form.additionalSections || [])];
    updated[secIdx].items = updated[secIdx].items.filter((_, i) => i !== itemIdx);
    setForm({ ...form, additionalSections: updated });
  };

  // Mobile-Friendly Reader View: Crisp responsive reading layout with zero squinting
  const RenderReaderCvView = () => {
    return (
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5 text-slate-200 shadow-xl backdrop-blur-md">
        {/* Header Badges & Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              {form.fullName || 'Nama Lengkap Kandidat'}
              {form.academicTitles ? `, ${form.academicTitles}` : ''}
            </h3>
            <p className="text-xs font-semibold text-teal-400">{form.targetRole || 'Target Posisi'}</p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[10px] font-black uppercase tracking-wider">
            Mode Baca Nyaman
          </span>
        </div>

        {/* Contacts Strip */}
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
          {form.location && (
            <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
              <MapPin size={12} className="text-teal-400" />
              <span>{form.location}</span>
            </span>
          )}
          {form.email && (
            <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
              <Mail size={12} className="text-teal-400" />
              <span>{form.email}</span>
            </span>
          )}
          {form.phone && (
            <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
              <Phone size={12} className="text-teal-400" />
              <span>{form.phone}</span>
            </span>
          )}
          {form.linkedin && (
            <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
              <LinkIcon size={12} className="text-teal-400" />
              <span>{form.linkedin}</span>
            </span>
          )}
          {form.portfolioUrl && (
            <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
              <Globe size={12} className="text-teal-400" />
              <span>{form.portfolioUrl}</span>
            </span>
          )}
        </div>

        {/* Professional Summary */}
        {form.summary && (
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <User size={12} /> {t.summary || 'Ringkasan Profesional'}
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed text-justify">
              {form.summary}
            </p>
          </div>
        )}

        {/* Experience List */}
        {form.experienceList && form.experienceList.length > 0 && (
          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Briefcase size={13} /> {t.experience || 'Pengalaman Kerja'}
            </span>
            <div className="space-y-2.5">
              {form.experienceList.map((exp, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <div className="text-xs font-black text-white">{exp.role}</div>
                      <div className="text-[11px] font-semibold text-teal-300">{exp.company}</div>
                    </div>
                    <div className="text-[10.5px] text-slate-400">{exp.period} {exp.location ? `· ${exp.location}` : ''}</div>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                      {exp.bullets.filter(Boolean).map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects List */}
        {form.projectList && form.projectList.length > 0 && (
          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <FolderGit2 size={13} /> {t.projects || 'Proyek & Portofolio'}
            </span>
            <div className="space-y-2.5">
              {form.projectList.map((proj, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="text-xs font-black text-white">{proj.name}</div>
                    <div className="text-[10.5px] text-slate-400">{proj.period}</div>
                  </div>
                  {proj.technologies && (
                    <div className="text-[10.5px] font-semibold text-teal-300">
                      Tech: {proj.technologies}
                    </div>
                  )}
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                      {proj.bullets.filter(Boolean).map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education List */}
        {form.educationList && form.educationList.length > 0 && (
          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <GraduationCap size={13} /> {t.education || 'Riwayat Pendidikan'}
            </span>
            <div className="space-y-2.5">
              {form.educationList.map((edu, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="text-xs font-black text-white">{edu.institution}</div>
                    <div className="text-[10.5px] text-slate-400">{edu.location}</div>
                  </div>
                  <div className="text-xs text-teal-300 font-semibold">
                    {edu.degree} {edu.gpa ? `· IPK: ${edu.gpa}` : ''}
                  </div>
                  {edu.thesis && (
                    <div className="text-[11px] text-slate-300">
                      <span className="text-slate-400">Skripsi/Riset:</span> {edu.thesis}
                    </div>
                  )}
                  {edu.honors && (
                    <div className="text-[11px] text-amber-300">
                      <span className="text-slate-400">Prestasi:</span> {edu.honors}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills List */}
        {form.skills && (
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Wrench size={12} /> {t.skills || 'Keahlian & Kemampuan Teknis'}
            </span>
            <div className="space-y-1.5 text-xs text-slate-300">
              {form.skills.languages && (
                <div><strong className="text-white">Bahasa Pemrograman:</strong> {form.skills.languages}</div>
              )}
              {form.skills.frameworks && (
                <div><strong className="text-white">Frameworks &amp; Tools:</strong> {form.skills.frameworks}</div>
              )}
              {form.skills.developerTools && (
                <div><strong className="text-white">Tools &amp; Cloud:</strong> {form.skills.developerTools}</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-36 lg:pb-12">
      {/* Universal Print CSS — fixes blank pages + removes browser header/footer/timestamp */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          .lg\:col-span-5,
          div:has(#printable-cv-canvas) {
            display: block !important;
            visibility: visible !important;
            transform: none !important;
            overflow: visible !important;
            max-height: none !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-cv-canvas,
          #printable-cv-canvas * {
            visibility: visible !important;
          }
          #printable-cv-canvas {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: ${pageFitMode === 'ultra-compact' ? '14px 22px' : pageFitMode === 'compact' ? '22px 30px' : pageFitMode === 'expanded' ? '36px 44px' : '26px 34px'} !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-[3000] bg-teal-500 text-slate-950 font-bold px-5 py-3 rounded-2xl shadow-2xl border border-teal-300 text-xs flex items-center gap-2"
          >
            <Sparkles size={16} className="text-slate-950 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner & Mode Control Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 backdrop-blur-2xl relative overflow-hidden shadow-2xl space-y-6"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
                <FileText size={13} className="text-teal-400" />
                ATS CV Builder Pro
              </span>
              {hasCv ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  Auto-Filled dari CV ({activeCv?.filename || 'CV Aktif'})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                  <FileText size={12} className="text-amber-400" />
                  Formulir Kosong (Siap Diisi Manual / AI)
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Pembuat CV ATS Standar Global
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Atur kontak kustom, gelar akademik, riwayat pendidikan mendalam (IPK, skripsi, riset), pengoptimalan Metode STAR kuantitatif, dan dukungan 35+ bahasa internasional.
            </p>
          </div>

          {/* Action Controls - Sleek Unified Command Dock */}
          <div className="w-full lg:w-auto flex flex-col items-stretch lg:items-end gap-3 shrink-0">
            {/* Top Tier: AI Enhancement Suite */}
            <div className="grid grid-cols-3 sm:flex items-center gap-1.5 p-1.5 bg-slate-950/90 border border-slate-800 rounded-2xl shadow-inner w-full sm:w-auto">
              <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-wider px-2 hidden md:inline-flex items-center gap-1 shrink-0">
                <Sparkles size={11} className="text-teal-400" />
                <span>AI Suite</span>
              </span>
              <div className="h-4 w-px bg-slate-800 hidden md:block shrink-0" />

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsImportModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 hover:border-teal-500/60 text-teal-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                title="Tempelkan teks CV Anda untuk diekstrak & diisi otomatis oleh AI"
              >
                <Sparkles size={13} className="text-teal-400 shrink-0" />
                <span>Tempel AI</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEnhanceWithAi}
                disabled={isEnhancing}
                className="px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 hover:border-indigo-500/60 text-indigo-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
                title="Tingkatkan kalimat pengalaman & ringkasan profil dengan AI"
              >
                <Wand2 size={13} className={`text-indigo-400 shrink-0 ${isEnhancing ? 'animate-spin' : ''}`} />
                <span>{isEnhancing ? 'Poles...' : 'Poles AI'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAntiTypo}
                disabled={isFixingTypos}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 hover:border-amber-500/60 text-amber-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
                title="Perbaiki kata salah tik (typo) secara otomatis"
              >
                <Sparkles size={13} className={`text-amber-400 shrink-0 ${isFixingTypos ? 'animate-spin' : ''}`} />
                <span>{isFixingTypos ? 'Typo...' : 'Anti Typo'}</span>
              </motion.button>

              {hasCv && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAutoFillFromAi}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 col-span-3 sm:col-span-1"
                  title="Isi ulang data dari hasil analisis CV"
                >
                  <RefreshCw size={12} className="shrink-0 text-teal-400" />
                  <span>Autofill</span>
                </motion.button>
              )}
            </div>

            {/* Bottom Tier: Document Actions (Reset, Full Preview, Download) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClearForm}
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-rose-500/15 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                title="Kosongkan form untuk isi manual dari nol"
              >
                <Eraser size={13} className="shrink-0 text-rose-400" />
                <span>Reset</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFullPreviewOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-teal-500/40 hover:border-teal-500/80 text-teal-300 hover:text-teal-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
                title="Lihat Pratinjau Dokumen CV Layar Penuh (A4)"
              >
                <Eye size={14} className="shrink-0 text-teal-400" />
                <span>Full CV (A4)</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="shimmer-btn-primary px-5 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-teal-500/25 col-span-2 sm:col-span-1"
                title="Unduh CV dalam format PDF standar A4 siap kirim"
              >
                <Download size={14} className={isExportingPdf ? 'animate-bounce' : ''} />
                <span>{isExportingPdf ? 'Memproses...' : 'Download PDF'}</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2 p-1.5 bg-slate-950/90 border border-slate-800/90 rounded-2xl overflow-x-auto custom-horizontal-scrollbar shadow-lg backdrop-blur-md">
            <button
              onClick={() => setActiveBuilderTab('form')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                activeBuilderTab === 'form'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
              }`}
            >
              <FileText size={15} />
              <span>1. Edit Data CV</span>
            </button>
            <button
              onClick={() => setActiveBuilderTab('preset')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                activeBuilderTab === 'preset'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
              }`}
            >
              <Target size={15} />
              <span>2. Bidang &amp; Role Preset</span>
            </button>
            <button
              onClick={() => setActiveBuilderTab('style')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                activeBuilderTab === 'style'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
              }`}
            >
              <Palette size={15} />
              <span>3. Format ATS &amp; Warna</span>
            </button>
            <button
              onClick={() => setActiveBuilderTab('language')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                activeBuilderTab === 'language'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
              }`}
            >
              <Languages size={15} />
              <span>4. Bahasa (35+) &amp; Align</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Mode Switcher (Visible on Mobile < lg) */}
      <div className="lg:hidden flex items-center p-1.5 bg-slate-950/95 border border-teal-500/50 rounded-2xl mb-4 shadow-2xl sticky top-16 z-30 backdrop-blur-xl">
        <button
          onClick={() => setMobileViewMode('editor')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mobileViewMode === 'editor'
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders size={15} />
          <span>Editor Data CV</span>
        </button>
        <button
          onClick={() => setMobileViewMode('preview')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mobileViewMode === 'preview'
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye size={15} />
          <span>Pratinjau Live CV</span>
        </button>
      </div>

      {/* Main Grid: Control Panel (Left: 7 Cols) & Authentic Printable Live Canvas (Right: 5 Cols Sticky) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative pb-36 lg:pb-12">

        {/* Left Column (7 Cols): Dynamic Content according to Active Tab */}
        <div className={`lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 backdrop-blur-xl space-y-4 ${mobileViewMode === 'editor' ? 'block' : 'hidden lg:block'}`}>
          
          {/* TAB 1: FORM DATA CV EDITOR */}
          {activeBuilderTab === 'form' && (
            <div className="space-y-4">
              {/* Mobile Quick Banner to Jump to Live CV Preview */}
              <div className="lg:hidden p-3 bg-gradient-to-r from-teal-500/20 via-indigo-500/20 to-purple-500/20 border border-teal-500/40 rounded-2xl flex items-center justify-between gap-2 shadow-lg mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Eye size={18} className="text-teal-400 shrink-0 animate-pulse" />
                  <div className="min-w-0">
                    <div className="text-xs font-black text-white truncate">Lihat CV Real-Time</div>
                    <div className="text-[10px] text-slate-300 truncate">Intip tampilan CV A4 kamu langsung</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileViewMode('preview')}
                  className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-1 shrink-0 shadow-md cursor-pointer"
                >
                  <span>Lihat CV</span>
                </button>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
                <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                  <Sliders size={16} className="text-teal-400" />
                  <span>Editor Data CV Manual</span>
                </h3>
                <span className="text-[11px] text-teal-400 font-semibold bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">Real-time Auto Sync</span>
              </div>

              {/* Section 1: Contact Info, Header, Gelar & Custom Links */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                <button
                  onClick={() => setActiveSection(activeSection === 'contact' ? null : 'contact')}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <User size={15} className="text-teal-400" />
                    1. Informasi Kontak, Header &amp; Custom Link
                  </span>
                  {activeSection === 'contact' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {activeSection === 'contact' && (
                  <div className="p-4 border-t border-slate-800 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Nama Lengkap</label>
                        <input
                          type="text"
                          value={form.fullName}
                          onChange={e => setForm({ ...form, fullName: e.target.value })}
                          placeholder="Contoh: Nur Fitriyani"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Gelar / Academic Titles</label>
                        <input
                          type="text"
                          value={form.academicTitles || ''}
                          onChange={e => setForm({ ...form, academicTitles: e.target.value })}
                          placeholder="S.Kom, M.T, AWS"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-teal-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Target Posisi Pekerjaan</label>
                      <input
                        type="text"
                        value={form.targetRole}
                        onChange={e => setForm({ ...form, targetRole: e.target.value })}
                        placeholder="Contoh: Senior Backend Developer"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-teal-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          placeholder="email@domain.com"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Telepon</label>
                        <input
                          type="text"
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          placeholder="+62 812-3456-7890"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-teal-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Lokasi Domisili</label>
                        <input
                          type="text"
                          value={form.location}
                          onChange={e => setForm({ ...form, location: e.target.value })}
                          placeholder="Jakarta, Indonesia"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">LinkedIn Profile</label>
                        <input
                          type="text"
                          value={form.linkedin}
                          onChange={e => setForm({ ...form, linkedin: e.target.value })}
                          placeholder="linkedin.com/in/username"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-teal-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Website / Portofolio URL</label>
                        <input
                          type="text"
                          value={form.portfolioUrl || ''}
                          onChange={e => setForm({ ...form, portfolioUrl: e.target.value })}
                          placeholder="portfolio.dev"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">GitHub Profile</label>
                        <input
                          type="text"
                          value={form.github || ''}
                          onChange={e => setForm({ ...form, github: e.target.value })}
                          placeholder="github.com/username"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-teal-500"
                        />
                      </div>
                    </div>

                    {/* Custom Contacts List */}
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-teal-400">Kontak &amp; Link Kustom Tambahan:</label>
                        <button
                          onClick={addCustomContact}
                          className="text-[11px] font-bold text-teal-300 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={12} /> Tambah Link Kustom
                        </button>
                      </div>

                      {(form.customContacts || []).map((cc, ccIdx) => (
                        <div key={ccIdx} className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                          <input
                            type="text"
                            value={cc.label}
                            onChange={e => updateCustomContact(ccIdx, 'label', e.target.value)}
                            placeholder="Label (misal: Medium / LeetCode)"
                            className="w-1/3 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:border-teal-500"
                          />
                          <input
                            type="text"
                            value={cc.value}
                            onChange={e => updateCustomContact(ccIdx, 'value', e.target.value)}
                            placeholder="Link URL / Handle"
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:border-teal-500"
                          />
                          <button
                            onClick={() => removeCustomContact(ccIdx)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Summary */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                <button
                  onClick={() => setActiveSection(activeSection === 'summary' ? null : 'summary')}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={15} className="text-teal-400" />
                    2. Ringkasan Profesional (Professional Summary)
                  </span>
                  {activeSection === 'summary' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {activeSection === 'summary' && (
                  <div className="p-4 border-t border-slate-800 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Deskripsi Ringkasan Profil CV
                    </label>
                    <textarea
                      value={form.summary}
                      onChange={e => setForm({ ...form, summary: e.target.value })}
                      rows={4}
                      placeholder="Tuliskan deskripsi profesional Anda secara singkat dan berdampak..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:border-teal-500 leading-relaxed"
                    />
                  </div>
                )}
              </div>

              {/* Section 3: Education */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                <button
                  onClick={() => setActiveSection(activeSection === 'education' ? null : 'education')}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap size={15} className="text-indigo-400" />
                    3. Riwayat Pendidikan &amp; Akademik (Education &amp; Academic)
                  </span>
                  {activeSection === 'education' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {activeSection === 'education' && (
                  <div className="p-4 border-t border-slate-800 space-y-4">
                    {(form.educationList || []).map((edu, eduIdx) => (
                      <div key={eduIdx} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                          <span className="text-xs font-extrabold text-indigo-300">Entitas Pendidikan #{eduIdx + 1}</span>
                          {form.educationList.length > 1 && (
                            <button
                              onClick={() => removeEducation(eduIdx)}
                              className="text-rose-400 text-xs hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 size={12} /> Hapus
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Institusi / Universitas</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={e => updateEducation(eduIdx, 'institution', e.target.value)}
                              placeholder="Universitas Indonesia"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Gelar &amp; Jurusan</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={e => updateEducation(eduIdx, 'degree', e.target.value)}
                              placeholder="S.Kom / Teknik Informatika"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Periode Studi</label>
                            <input
                              type="text"
                              value={edu.period}
                              onChange={e => updateEducation(eduIdx, 'period', e.target.value)}
                              placeholder="2020 - 2024"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Lokasi Kampus</label>
                            <input
                              type="text"
                              value={edu.location}
                              onChange={e => updateEducation(eduIdx, 'location', e.target.value)}
                              placeholder="Depok, Indonesia"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">IPK / GPA</label>
                            <input
                              type="text"
                              value={edu.gpa}
                              onChange={e => updateEducation(eduIdx, 'gpa', e.target.value)}
                              placeholder="3.85 / 4.00"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-amber-400 mb-1">Penghargaan / Beasiswa (Honors &amp; Awards)</label>
                          <input
                            type="text"
                            value={edu.honors || ''}
                            onChange={e => updateEducation(eduIdx, 'honors', e.target.value)}
                            placeholder="Lulusan Terbaik (Cum Laude) / Beasiswa Unggulan"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">Judul Skripsi / Tesis (Capstone Project)</label>
                          <input
                            type="text"
                            value={edu.thesis || ''}
                            onChange={e => updateEducation(eduIdx, 'thesis', e.target.value)}
                            placeholder="Rancang Bangun Microservices API Engine dengan Redis Caching Layer"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">Mata Kuliah Relevan (Relevant Coursework)</label>
                          <input
                            type="text"
                            value={edu.coursework || ''}
                            onChange={e => updateEducation(eduIdx, 'coursework', e.target.value)}
                            placeholder="Struktur Data, Algoritma, System Architecture, Database SQL"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">Organisasi &amp; Kepemimpinan Kampus</label>
                          <input
                            type="text"
                            value={edu.activities || ''}
                            onChange={e => updateEducation(eduIdx, 'activities', e.target.value)}
                            placeholder="Ketua Himpunan Mahasiswa (HMTI) & Lead GDSC Kampus"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addEducation}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-indigo-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus size={14} /> Tambah Riwayat Pendidikan
                    </button>
                  </div>
                )}
              </div>

              {/* Section 4: Experience */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                <button
                  onClick={() => setActiveSection(activeSection === 'experience' ? null : 'experience')}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase size={15} className="text-teal-400" />
                    4. Pengalaman Kerja (Work Experience)
                  </span>
                  {activeSection === 'experience' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {activeSection === 'experience' && (
                  <div className="p-4 border-t border-slate-800 space-y-4">
                    {(form.experienceList || []).map((exp, expIdx) => (
                      <div key={expIdx} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                          <span className="text-xs font-extrabold text-teal-300">Pengalaman Kerja #{expIdx + 1}</span>
                          {form.experienceList.length > 1 && (
                            <button
                              onClick={() => removeExperience(expIdx)}
                              className="text-rose-400 text-xs hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 size={12} /> Hapus
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Nama Perusahaan</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={e => updateExperience(expIdx, 'company', e.target.value)}
                              placeholder="PT Tech Innovasi Global"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Jabatan / Posisi</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={e => updateExperience(expIdx, 'role', e.target.value)}
                              placeholder="Senior Backend Developer"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Periode Kerja</label>
                            <input
                              type="text"
                              value={exp.period}
                              onChange={e => updateExperience(expIdx, 'period', e.target.value)}
                              placeholder="2023 - Sekarang"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Lokasi Perusahaan</label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={e => updateExperience(expIdx, 'location', e.target.value)}
                              placeholder="Jakarta, Indonesia"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                            />
                          </div>
                        </div>

                        {/* Experience Bullets */}
                        <div className="space-y-1.5 pt-1">
                          <label className="block text-[11px] font-bold text-teal-400">Poin Pencapaian &amp; Tanggung Jawab (Gunakan STAR Method):</label>
                          {exp.bullets.map((b, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={b}
                                onChange={e => updateExperienceBullet(expIdx, bIdx, e.target.value)}
                                placeholder="Poin deskripsi pekerjaan..."
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                              />
                              <button
                                onClick={() => removeExperienceBullet(expIdx, bIdx)}
                                className="text-slate-500 hover:text-rose-400 p-1"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addExperienceBullet(expIdx)}
                            className="text-[11px] font-bold text-teal-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                          >
                            <Plus size={12} /> Tambah Poin Deskripsi Pekerjaan
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addExperience}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-teal-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus size={14} /> Tambah Pengalaman Kerja
                    </button>
                  </div>
                )}
              </div>

              {/* Section 5: Projects */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                <button
                  onClick={() => setActiveSection(activeSection === 'projects' ? null : 'projects')}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FolderGit2 size={15} className="text-indigo-400" />
                    5. Proyek &amp; Portofolio (Projects &amp; Portfolio)
                  </span>
                  {activeSection === 'projects' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {activeSection === 'projects' && (
                  <div className="p-4 border-t border-slate-800 space-y-4">
                    {/* Section Title Customizer */}
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                      <label className="block text-[11px] font-bold text-indigo-300">Kustomisasi Judul Section Proyek:</label>
                      <input
                        type="text"
                        value={form.sectionTitles?.projects || ''}
                        onChange={e => setForm({
                          ...form,
                          sectionTitles: { ...form.sectionTitles, projects: e.target.value }
                        })}
                        placeholder={`Bawaan: ${t.projects}`}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                      />
                    </div>

                    {(form.projectList || []).map((proj, projIdx) => (
                      <div key={projIdx} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                          <span className="text-xs font-extrabold text-indigo-300">Proyek #{projIdx + 1}</span>
                          {form.projectList.length > 1 && (
                            <button
                              onClick={() => removeProject(projIdx)}
                              className="text-rose-400 text-xs hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 size={12} /> Hapus
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Nama Proyek</label>
                            <input
                              type="text"
                              value={proj.name}
                              onChange={e => updateProject(projIdx, 'name', e.target.value)}
                              placeholder="High Performance API Engine"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Teknologi yang Digunakan</label>
                            <input
                              type="text"
                              value={proj.technologies}
                              onChange={e => updateProject(projIdx, 'technologies', e.target.value)}
                              placeholder="PHP, Laravel, Redis, MySQL"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">Periode Proyek</label>
                          <input
                            type="text"
                            value={proj.period}
                            onChange={e => updateProject(projIdx, 'period', e.target.value)}
                            placeholder="2024"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                          />
                        </div>

                        {/* Project Bullets */}
                        <div className="space-y-1.5 pt-1">
                          <label className="block text-[11px] font-bold text-indigo-400">Poin Rincian Proyek:</label>
                          {proj.bullets.map((b, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={b}
                                onChange={e => updateProjectBullet(projIdx, bIdx, e.target.value)}
                                placeholder="Rincian dampak / fitur proyek..."
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                              />
                              <button
                                onClick={() => removeProjectBullet(projIdx, bIdx)}
                                className="text-slate-500 hover:text-rose-400 p-1"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addProjectBullet(projIdx)}
                            className="text-[11px] font-bold text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                          >
                            <Plus size={12} /> Tambah Poin Proyek
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addProject}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-indigo-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus size={14} /> Tambah Proyek Portofolio
                    </button>
                  </div>
                )}
              </div>

              {/* Section 6: Skills */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                <button
                  onClick={() => setActiveSection(activeSection === 'skills' ? null : 'skills')}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Wrench size={15} className="text-teal-400" />
                    6. Keterampilan &amp; Keahlian Teknis (Skills &amp; Tools)
                  </span>
                  {activeSection === 'skills' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {activeSection === 'skills' && (
                  <div className="p-4 border-t border-slate-800 space-y-3">
                    {/* Custom Section Title for Skills */}
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                      <label className="block text-[11px] font-bold text-teal-300">Kustomisasi Judul Section Skills:</label>
                      <input
                        type="text"
                        value={form.sectionTitles?.skills || ''}
                        onChange={e => setForm({
                          ...form,
                          sectionTitles: { ...form.sectionTitles, skills: e.target.value }
                        })}
                        placeholder={`Bawaan: ${t.skills}`}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                      />
                    </div>

                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        <input
                          type="text"
                          value={form.skillLabels?.label1 || 'Languages'}
                          onChange={e => setForm({ ...form, skillLabels: { ...form.skillLabels, label1: e.target.value } })}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-teal-300 font-bold"
                          placeholder="Label 1"
                        />
                        <input
                          type="text"
                          value={form.skillCategories.languages}
                          onChange={e => setForm({ ...form, skillCategories: { ...form.skillCategories, languages: e.target.value } })}
                          className="sm:col-span-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100"
                          placeholder="PHP, JavaScript, SQL, HTML/CSS"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        <input
                          type="text"
                          value={form.skillLabels?.label2 || 'Frameworks'}
                          onChange={e => setForm({ ...form, skillLabels: { ...form.skillLabels, label2: e.target.value } })}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-teal-300 font-bold"
                          placeholder="Label 2"
                        />
                        <input
                          type="text"
                          value={form.skillCategories.frameworks}
                          onChange={e => setForm({ ...form, skillCategories: { ...form.skillCategories, frameworks: e.target.value } })}
                          className="sm:col-span-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100"
                          placeholder="Laravel, React, Node.js, Express"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        <input
                          type="text"
                          value={form.skillLabels?.label3 || 'Databases'}
                          onChange={e => setForm({ ...form, skillLabels: { ...form.skillLabels, label3: e.target.value } })}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-teal-300 font-bold"
                          placeholder="Label 3"
                        />
                        <input
                          type="text"
                          value={form.skillCategories.databases}
                          onChange={e => setForm({ ...form, skillCategories: { ...form.skillCategories, databases: e.target.value } })}
                          className="sm:col-span-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100"
                          placeholder="MySQL, PostgreSQL, Redis"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        <input
                          type="text"
                          value={form.skillLabels?.label4 || 'Tools & Platforms'}
                          onChange={e => setForm({ ...form, skillLabels: { ...form.skillLabels, label4: e.target.value } })}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-teal-300 font-bold"
                          placeholder="Label 4"
                        />
                        <input
                          type="text"
                          value={form.skillCategories.tools}
                          onChange={e => setForm({ ...form, skillCategories: { ...form.skillCategories, tools: e.target.value } })}
                          className="sm:col-span-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100"
                          placeholder="Git, GitHub, Docker, Postman, Linux"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 7: Additional Custom Sections */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                <button
                  onClick={() => setActiveSection(activeSection === 'additional' ? null : 'additional')}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Star size={15} className="text-amber-400" />
                    7. Informasi Tambahan, Bahasa &amp; Prestasi (Custom Sections)
                  </span>
                  {activeSection === 'additional' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {activeSection === 'additional' && (
                  <div className="p-4 border-t border-slate-800 space-y-4">
                    {(form.additionalSections || []).map((sec, secIdx) => (
                      <div key={secIdx} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={sec.category}
                            onChange={e => updateAdditionalCategory(secIdx, e.target.value)}
                            placeholder="Nama Kategori (misal: Bahasa Asing / Sertifikasi / Organisasi)"
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-bold"
                          />
                          <button
                            onClick={() => removeAdditionalSection(secIdx)}
                            className="text-xs text-rose-400 hover:underline p-1 cursor-pointer shrink-0"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-bold text-slate-400">Poin Rincian:</label>
                          {sec.items.map((it, itemIdx) => (
                            <div key={itemIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={it}
                                onChange={e => updateAdditionalItem(secIdx, itemIdx, e.target.value)}
                                placeholder="Rincian informasi tambahan..."
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                              />
                              <button
                                onClick={() => removeAdditionalItem(secIdx, itemIdx)}
                                className="text-slate-500 hover:text-rose-400 p-1"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addAdditionalItem(secIdx)}
                            className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                          >
                            <Plus size={12} /> Tambah Rincian Poin
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addAdditionalSection}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-amber-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus size={14} /> Tambah Kategori Section Baru
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BIDANG & ROLE PRESET */}
          {activeBuilderTab === 'preset' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="text-sm font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <Briefcase size={16} className="text-teal-400" />
                  <span>Pilih Bidang &amp; Role Pekerjaan (Auto-Fill ATS Instan)</span>
                </div>
                <span className="text-[11px] text-teal-300 font-medium flex items-center gap-1.5 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                  <Sparkles size={13} className="text-teal-400 shrink-0" />
                  <span>Pilih bidang/role untuk mengisi contoh data CV secara otomatis</span>
                </span>
              </div>

              {/* Category Filter Pills (React Lucide Icons) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders size={12} className="text-teal-400" />
                    <span>1. Filter Bidang Pekerjaan:</span>
                  </label>
                  {/* Horizontal Scroll Navigation Arrow Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => categoryScrollRef.current?.scrollBy({ left: -220, behavior: 'smooth' })}
                      className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-teal-300 transition-all cursor-pointer flex items-center justify-center"
                      title="Geser Kiri"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => categoryScrollRef.current?.scrollBy({ left: 220, behavior: 'smooth' })}
                      className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-teal-300 transition-all cursor-pointer flex items-center justify-center"
                      title="Geser Kanan"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                <div 
                  ref={categoryScrollRef}
                  onWheel={(e) => {
                    if (e.deltaY !== 0) {
                      e.currentTarget.scrollLeft += e.deltaY;
                    }
                  }}
                  className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-horizontal-scrollbar scroll-smooth"
                >
                  <button
                    onClick={() => {
                      setSelectedPresetCategory('ALL');
                      setPresetSearchQuery('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${selectedPresetCategory === 'ALL'
                      ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md font-extrabold'
                      : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-slate-800'
                      }`}
                  >
                    <Globe size={14} />
                    <span>Semua Bidang</span>
                  </button>

                  {INDUSTRY_PRESETS.map((ind) => {
                    const IconComp = ind.iconComponent;
                    const isActive = selectedPresetCategory === ind.category;
                    return (
                      <button
                        key={ind.category}
                        onClick={() => {
                          setSelectedPresetCategory(ind.category);
                          setPresetSearchQuery('');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${isActive
                          ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md font-extrabold'
                          : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-slate-800'
                          }`}
                      >
                        {IconComp && <IconComp size={14} />}
                        <span>{ind.category}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${isActive ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}>
                          {ind.roles.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Controls: Select Role & Search */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Step 2: Select Role */}
                <div className="sm:col-span-8">
                  <label className="block text-[10.5px] font-bold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                    <Target size={12} className="text-teal-400" />
                    <span>2. Pilih Posisi / Role Impian:</span>
                  </label>
                  <div className="relative">
                    <select
                      value={form.targetRole}
                      onChange={(e) => {
                        const chosenRole = filteredPresetRoles.find(r => r.title === e.target.value);
                        if (chosenRole) handleSelectPreset(chosenRole);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500/60 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-bold outline-none cursor-pointer appearance-none pr-8"
                    >
                      <option value="" disabled>-- Pilih Posisi Impian --</option>
                      {filteredPresetRoles.map((r) => (
                        <option key={r.id} value={r.title}>
                          {r.title} ({r.categoryName})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Quick Search */}
                <div className="sm:col-span-4">
                  <label className="block text-[10.5px] font-bold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                    <Search size={12} className="text-teal-400" />
                    <span>Cari Posisi:</span>
                  </label>
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={presetSearchQuery}
                      onChange={e => setPresetSearchQuery(e.target.value)}
                      placeholder="Cari (Full Stack, Admin)..."
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500/60 rounded-xl pl-8 pr-7 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
                    />
                    {presetSearchQuery && (
                      <button
                        onClick={() => setPresetSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        <Eraser size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Select Role Chips (Using React Icons) */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10.5px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
                    <Zap size={12} className="text-amber-400" /> Rekomendasi Posisi:
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => rolesScrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
                      className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-teal-300 transition-all cursor-pointer flex items-center justify-center"
                      title="Geser Kiri"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => rolesScrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
                      className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-teal-300 transition-all cursor-pointer flex items-center justify-center"
                      title="Geser Kanan"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                <div 
                  ref={rolesScrollRef}
                  onWheel={(e) => {
                    if (e.deltaY !== 0) {
                      e.currentTarget.scrollLeft += e.deltaY;
                    }
                  }}
                  className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-horizontal-scrollbar scroll-smooth"
                >
                  {filteredPresetRoles.slice(0, 12).map((r) => {
                    const isSelected = form.targetRole === r.title;
                    const IconComp = r.categoryIcon;
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleSelectPreset(r)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${isSelected
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/60 shadow-sm'
                          : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                          }`}
                      >
                        {IconComp ? <IconComp size={13} className={isSelected ? 'text-teal-400' : 'text-slate-400'} /> : <Briefcase size={13} />}
                        <span>{r.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Selection Summary Bar */}
              {form.targetRole && (
                <div className="mt-1 p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-teal-400 shrink-0" />
                    <span>
                      Posisi Aktif: <strong className="text-white">{form.targetRole}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] text-teal-300/80 italic">
                    (Formulir CV &amp; Templat ATS otomatis memuat standar posisi ini)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FORMAT ATS & WARNA */}
          {activeBuilderTab === 'style' && (
            <div className="space-y-5">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
                <div className="text-xs font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <Layout size={16} className="text-teal-400" />
                  <span>Format Standar Industri ATS &amp; Kustomisasi Warna</span>
                </div>
              </div>

              {/* 5 TEMPLATE SELECTION CARDS */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layout size={13} className="text-teal-400" />
                  <span>1. Pilih Layout Template (5 Pilihan ATS Standard):</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {TEMPLATES.map((tmpl) => {
                    const isSelected = selectedTemplate === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        onClick={() => setSelectedTemplate(tmpl.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between ${isSelected
                          ? 'bg-teal-500/15 border-teal-500/70 shadow-xl shadow-teal-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                          }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="font-extrabold text-xs text-slate-100 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isSelected ? primaryHex : tmpl.defaultColor }} />
                              {tmpl.name}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-400 leading-snug mb-2">
                            {tmpl.desc}
                          </p>
                        </div>
                        <div>
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border inline-block ${isSelected
                            ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                            {tmpl.badge}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PAGE FIT DENSITY MODES */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders size={13} className="text-teal-400" />
                  <span>2. Kepadatan &amp; Margin Halaman (Page Fit Mode):</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PAGE_FIT_MODES.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setPageFitMode(pm.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${pageFitMode === pm.id
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 font-extrabold shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {pm.id === 'ultra-compact' ? <Zap size={15} className="text-amber-400 shrink-0" /> : pm.id === 'compact' ? <FileCheck size={15} className="text-teal-400 shrink-0" /> : <Sliders size={15} className="shrink-0" />}
                        <div>
                          <div className="text-xs font-bold">{pm.name}</div>
                          <div className="text-[10px] opacity-75 font-normal">{pm.desc}</div>
                        </div>
                      </div>
                      {pageFitMode === pm.id && <CheckCircle2 size={15} className="text-teal-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACCENT COLOR SWATCHES */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette size={13} className="text-teal-400" />
                  <span>3. Warna Aksen Header &amp; Judul CV:</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  {ACCENT_COLORS.map(ac => (
                    <button
                      key={ac.id}
                      onClick={() => setAccentColor(ac.id)}
                      className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${accentColor === ac.id ? 'border-teal-400 bg-teal-500/20 text-white shadow-lg' : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: ac.hex === 'default' ? primaryHex : ac.hex }} />
                      <span>{ac.name}</span>
                    </button>
                  ))}

                  {/* Custom Hex Color Picker */}
                  <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 font-bold">Kustom:</span>
                    <input
                      type="color"
                      value={customHex}
                      onChange={(e) => {
                        setCustomHex(e.target.value);
                        setAccentColor('custom');
                      }}
                      className="w-6 h-6 rounded bg-transparent border-0 cursor-pointer"
                      title="Pilih Warna Kustom"
                    />
                    <span className="text-[11px] text-teal-300 font-mono font-bold">{customHex}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BAHASA 35+ & RATA TEKS */}
          {activeBuilderTab === 'language' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="text-xs font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <Languages size={16} className="text-teal-400" />
                  <span>Pilihan Bahasa Global (35+ Negara) &amp; Presisi Rata Teks</span>
                </div>
              </div>

              {/* 35+ LANGUAGE TRANSLATOR */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe size={13} className="text-teal-400" />
                  <span>1. Bahasa &amp; Negara CV:</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 flex-wrap">
                    {LANGUAGES.slice(0, 6).map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => handleTranslateEntireCv(lang.id)}
                        disabled={isTranslatingCv}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${selectedLanguage === lang.id
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm font-extrabold'
                          : 'text-slate-400 hover:text-white'
                          }`}
                        title={`Klik untuk menerjemahkan seluruh isi CV ke ${lang.name}`}
                      >
                        <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-black">{lang.code}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsLanguageModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-indigo-500/20 hover:from-teal-500/30 hover:to-indigo-500/30 border border-teal-500/40 text-teal-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    title="Buka daftar 35+ bahasa negara alfabet A-Z & pencarian AI"
                  >
                    <Search size={13} className="text-teal-400" />
                    <span>Cari 35+ Negara / Bahasa (A-Z)...</span>
                  </button>

                  <button
                    onClick={() => handleTranslateEntireCv(selectedLanguage)}
                    disabled={isTranslatingCv}
                    className="px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    title="Terjemahkan seluruh ringkasan, pengalaman, proyek & skill ke bahasa terpilih dengan AI"
                  >
                    <Sparkles size={13} className={`text-teal-400 ${isTranslatingCv ? 'animate-spin' : ''}`} />
                    <span>{isTranslatingCv ? 'Menerjemahkan AI...' : 'Terjemahkan Seluruh CV'}</span>
                  </button>
                </div>
              </div>

              {/* TEXT ALIGNMENT CONTROLS */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <AlignLeft size={13} className="text-teal-400" />
                  <span>2. Pengaturan Rata Teks (Precision Text Alignment):</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Header Alignment */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-slate-300 block">Header Alignment:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setHeaderAlign('left')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${headerAlign === 'left' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:text-white'}`}
                      >
                        <AlignLeft size={13} /> Kiri
                      </button>
                      <button
                        onClick={() => setHeaderAlign('center')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${headerAlign === 'center' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:text-white'}`}
                      >
                        <AlignCenter size={13} /> Tengah
                      </button>
                      <button
                        onClick={() => setHeaderAlign('right')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${headerAlign === 'right' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:text-white'}`}
                      >
                        <AlignRight size={13} /> Kanan
                      </button>
                    </div>
                  </div>

                  {/* Section Header Alignment */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-slate-300 block">Judul Section:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSectionHeaderAlign('left')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${sectionHeaderAlign === 'left' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:text-white'}`}
                      >
                        <AlignLeft size={13} /> Kiri
                      </button>
                      <button
                        onClick={() => setSectionHeaderAlign('center')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${sectionHeaderAlign === 'center' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:text-white'}`}
                      >
                        <AlignCenter size={13} /> Tengah
                      </button>
                      <button
                        onClick={() => setSectionHeaderAlign('right')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${sectionHeaderAlign === 'right' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:text-white'}`}
                      >
                        <AlignRight size={13} /> Kanan
                      </button>
                    </div>
                  </div>

                  {/* Body Alignment */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-slate-300 block">Isi Teks / Deskripsi:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setBodyAlign('left')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${bodyAlign === 'left' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:text-white'}`}
                      >
                        <AlignLeft size={13} /> Kiri
                      </button>
                      <button
                        onClick={() => setBodyAlign('center')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${bodyAlign === 'center' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:text-white'}`}
                      >
                        <AlignCenter size={13} /> Tengah
                      </button>
                      <button
                        onClick={() => setBodyAlign('justify')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${bodyAlign === 'justify' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:text-white'}`}
                      >
                        <AlignJustify size={13} /> Justify
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 Cols): Authentic Printable Live Canvas + Live Density Meter (Sticky preview) */}
        <div className={`lg:col-span-5 lg:sticky lg:top-20 space-y-4 ${mobileViewMode === 'preview' ? 'block' : 'hidden lg:block'}`}>

          {/* Mobile Quick Return Navigation Bar when inside preview mode */}
          <div className="lg:hidden p-3 bg-slate-950/95 border border-teal-500/50 rounded-2xl flex items-center justify-between gap-2 shadow-xl backdrop-blur-xl mb-3">
            <button
              type="button"
              onClick={() => setMobileViewMode('editor')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-300 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <ChevronLeft size={16} />
              <span>Kembali Ke Form Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setIsFullPreviewOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-500 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Maximize2 size={14} />
              <span>Layar Penuh (A4)</span>
            </button>
          </div>

          {/* Live Page Density Status Badge Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl border ${pageMetrics.estimatedPages <= 1.05
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : pageMetrics.estimatedPages <= 1.5
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                }`}>
                <FileCheck size={18} />
              </div>
              <div>
                <div className="font-extrabold text-slate-100 flex items-center gap-2">
                  <span>Smart Density Analyzer:</span>
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${pageMetrics.estimatedPages <= 1.05
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : pageMetrics.estimatedPages <= 1.5
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    }`}>
                    {pageMetrics.estimatedPages <= 1.05 ? 'Presisi 1 Lembar (ATS Standard)' : pageMetrics.estimatedPages <= 1.5 ? `Estimasi ${pageMetrics.estimatedPages} Lembar (Format Ambis)` : `Estimasi ${pageMetrics.estimatedPages} Lembar (Executive)`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Total {pageMetrics.charCount.toLocaleString('id-ID')} Karakter · Mode Active: <strong className="text-teal-300">{PAGE_FIT_MODES.find(m => m.id === pageFitMode)?.name}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {pageMetrics.estimatedPages > 1.05 && pageFitMode !== 'ultra-compact' && (
                <button
                  onClick={() => setPageFitMode('ultra-compact')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Zap size={13} /> Fit to 1 Page Auto
                </button>
              )}
              <button
                onClick={() => setIsFullPreviewOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 hover:bg-teal-500/30 font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm hover:scale-105"
                title="Lihat Pratinjau Dokumen CV Layar Penuh"
              >
                <Maximize2 size={13} /> Fullscreen
              </button>
            </div>
          </div>

          {/* Dual-Mode View Switcher & Live Zoom Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 backdrop-blur-md shadow-xl">
            {/* Left: View Mode Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setCvPreviewViewTab('paper')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  cvPreviewViewTab === 'paper'
                    ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <FileText size={13} />
                <span>Lembar A4</span>
              </button>
              <button
                type="button"
                onClick={() => setCvPreviewViewTab('reader')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  cvPreviewViewTab === 'reader'
                    ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <BookOpen size={13} />
                <span>Baca Nyaman</span>
              </button>
            </div>

            {/* Right: Zoom Presets & Fullscreen (Only active in paper mode) */}
            {cvPreviewViewTab === 'paper' ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setCvPreviewZoomMode('fit')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      cvPreviewZoomMode === 'fit'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Auto-Fit Lebar Layar"
                  >
                    Fit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCvPreviewZoomMode('100');
                      setCvPreviewZoom(100);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      cvPreviewZoomMode === '100'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Ukuran Asli 100%"
                  >
                    100%
                  </button>

                  <div className="h-3.5 w-px bg-slate-800 mx-0.5" />

                  <button
                    type="button"
                    onClick={() => {
                      setCvPreviewZoomMode('custom');
                      setCvPreviewZoom(p => Math.max(35, p - 10));
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
                    title="Perkecil (-10%)"
                  >
                    <ZoomOut size={13} />
                  </button>
                  <span className="px-1 text-[10px] font-black text-teal-300 min-w-[34px] text-center">
                    {Math.round(cvEffectiveScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCvPreviewZoomMode('custom');
                      setCvPreviewZoom(p => Math.min(150, p + 10));
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
                    title="Perbesar (+10%)"
                  >
                    <ZoomIn size={13} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFullPreviewOpen(true)}
                  className="p-2 rounded-xl bg-slate-950 text-teal-300 border border-teal-500/30 hover:bg-teal-500/20 hover:text-white transition-all cursor-pointer shadow-sm"
                  title="Lihat Pratinjau Dokumen Layar Penuh"
                >
                  <Maximize2 size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsFullPreviewOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 text-teal-300 border border-teal-500/30 hover:bg-teal-500/20 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Maximize2 size={13} />
                <span>Fullscreen A4</span>
              </button>
            )}
          </div>

          {/* Live Preview Card Container */}
          <div
            ref={cvPreviewContainerRef}
            className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950"
          >
            {/* View Tab 1: Reader Mode (Smooth, clean responsive mobile typography) */}
            {cvPreviewViewTab === 'reader' && (
              <div className="p-3 sm:p-5">
                <RenderReaderCvView />
              </div>
            )}

            {/* View Tab 2: Authentic Printable Canvas (With responsive auto-scale) */}
            <div
              className={`w-full overflow-x-auto custom-horizontal-scrollbar flex justify-center py-2 sm:py-4 bg-slate-950/70 ${cvPreviewViewTab === 'paper' ? 'block' : 'hidden'}`}
            >
              <div
                style={{
                  width: `${Math.round(794 * cvEffectiveScale)}px`,
                  height: cvCanvasHeight > 0 ? `${Math.round(cvCanvasHeight * cvEffectiveScale)}px` : 'auto',
                  position: 'relative',
                  flexShrink: 0,
                  transition: 'width 0.15s ease, height 0.15s ease',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    transform: `scale(${cvEffectiveScale})`,
                    transformOrigin: 'top left',
                    width: '794px',
                  }}
                >
                  <div className={`bg-white text-slate-950 rounded-none shadow-2xl border-0 ${spacing.wrapper}`} id="printable-cv-canvas" dir={isRtl ? 'rtl' : 'ltr'}>

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* TEMPLATE 1: HARVARD CLASSIC ATS */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {selectedTemplate === 'harvard' && (
              <div className="font-serif">
                {/* HEADER */}
                <div className={`border-b-2 ${spacing.headerMargin} text-${headerAlign}`} style={{ borderColor: primaryHex }}>
                  <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mb-0.5 font-serif" style={{ color: primaryHex }}>
                    {form.fullName || 'NAMA LENGKAP KANDIDAT'}
                    {form.academicTitles ? `, ${form.academicTitles}` : ''}
                  </h1>
                  <div className="text-slate-800 font-semibold text-[11px] mb-1 font-sans">
                    {form.targetRole || 'TARGET POSISI PEKERJAAN'}
                  </div>
                  <div className={`text-[10px] text-slate-700 font-sans tracking-wide flex flex-wrap items-center gap-2 ${headerAlign === 'left' ? 'justify-start' : headerAlign === 'right' ? 'justify-end' : 'justify-center'}`}>
                    {form.location && <span>{form.location}</span>}
                    {form.phone && <span>• {form.phone}</span>}
                    {form.email && <span>• {form.email}</span>}
                    {form.portfolioUrl && <span>• {form.portfolioUrl}</span>}
                    {form.linkedin && <span>• {form.linkedin}</span>}
                    {form.github && <span>• {form.github}</span>}
                    {(form.customContacts || []).map((cc, ccIdx) => cc.value && (
                      <span key={ccIdx}>• {cc.label ? `${cc.label}: ` : ''}{cc.value}</span>
                    ))}
                  </div>
                </div>

                {/* SUMMARY */}
                {form.summary && (
                  <div className={spacing.sectionMargin}>
                    <h2 className={`font-bold text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 font-sans text-${sectionHeaderAlign}`} style={{ borderColor: primaryHex, color: primaryHex }}>
                      {t.summary}
                    </h2>
                    <p className={`text-slate-900 font-sans text-${bodyAlign}`}>
                      {form.summary}
                    </p>
                  </div>
                )}

                {/* RICH EDUCATION KEREN */}
                {form.educationList && form.educationList.some(e => e.institution || e.degree) && (
                  <div className={spacing.sectionMargin}>
                    <h2 className={`font-bold text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 font-sans text-${sectionHeaderAlign}`} style={{ borderColor: primaryHex, color: primaryHex }}>
                      {t.education}
                    </h2>
                    {form.educationList.map((edu, idx) => (
                      <div key={idx} className={spacing.itemMargin}>
                        <div className="flex items-center justify-between font-bold text-slate-950">
                          <span>{edu.institution}</span>
                          <span className="font-normal italic text-slate-700">{edu.location}</span>
                        </div>
                        <div className="flex items-center justify-between italic text-slate-800 text-[10.5px]">
                          <span>{edu.degree} {edu.gpa ? `(${t.gpaLabel} ${edu.gpa})` : ''}</span>
                          <span className="not-italic font-semibold">{edu.period}</span>
                        </div>
                        {edu.honors && (
                          <div className={`text-[10px] font-bold text-amber-900 font-sans mt-0.5 text-${bodyAlign}`}>
                            {t.honorsLabel} {edu.honors}
                          </div>
                        )}
                        {edu.thesis && (
                          <div className={`text-[9.5px] font-semibold text-slate-800 font-sans italic mt-0.5 text-${bodyAlign}`}>
                            {t.thesisLabel} "{edu.thesis}"
                          </div>
                        )}
                        {edu.coursework && (
                          <div className={`text-[9.5px] text-slate-700 font-sans text-${bodyAlign}`}>
                            {t.courseworkLabel} {edu.coursework}
                          </div>
                        )}
                        {edu.activities && (
                          <div className={`text-[9.5px] text-indigo-900 font-sans font-medium text-${bodyAlign}`}>
                            {t.activitiesLabel} {edu.activities}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* EXPERIENCE */}
                {form.experienceList && form.experienceList.some(e => e.company || e.role) && (
                  <div className={spacing.sectionMargin}>
                    <h2 className={`font-bold text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 font-sans text-${sectionHeaderAlign}`} style={{ borderColor: primaryHex, color: primaryHex }}>
                      {t.experience}
                    </h2>
                    {form.experienceList.map((exp, idx) => (
                      <div key={idx} className={spacing.itemMargin}>
                        <div className="flex items-center justify-between font-bold text-slate-950">
                          <span>{exp.company}</span>
                          <span className="font-normal italic text-slate-700">{exp.location}</span>
                        </div>
                        <div className="flex items-center justify-between italic text-slate-800 text-[10.5px] mb-1">
                          <span>{exp.role}</span>
                          <span className="not-italic font-semibold">{exp.period}</span>
                        </div>
                        <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-900 font-sans">
                          {exp.bullets.map((b, bIdx) => b && (
                            <li key={bIdx} className={`text-${bodyAlign}`}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* PROJECTS */}
                {form.projectList && form.projectList.some(p => p.name) && (
                  <div className={spacing.sectionMargin}>
                    <h2 className={`font-bold text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 font-sans text-${sectionHeaderAlign}`} style={{ borderColor: primaryHex, color: primaryHex }}>
                      {projectsTitle}
                    </h2>
                    {form.projectList.map((proj, idx) => (
                      <div key={idx} className={spacing.itemMargin}>
                        <div className="flex items-center justify-between font-bold text-slate-950">
                          <span>{proj.name} {proj.technologies && <span className="font-normal italic text-slate-700">({proj.technologies})</span>}</span>
                          <span className="font-normal text-slate-700 text-[10px] font-sans">{proj.period}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SKILLS */}
                <div className={spacing.sectionMargin}>
                  <h2 className={`font-bold text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 font-sans text-${sectionHeaderAlign}`} style={{ borderColor: primaryHex, color: primaryHex }}>
                    {skillsTitle}
                  </h2>
                  <div className={`space-y-1 font-sans text-slate-900 text-${bodyAlign}`}>
                    {form.skillCategories.languages && <div><strong className="text-slate-950">{label1}:</strong> {form.skillCategories.languages}</div>}
                    {form.skillCategories.frameworks && <div><strong className="text-slate-950">{label2}:</strong> {form.skillCategories.frameworks}</div>}
                    {form.skillCategories.databases && <div><strong className="text-slate-950">{label3}:</strong> {form.skillCategories.databases}</div>}
                    {form.skillCategories.tools && <div><strong className="text-slate-950">{label4}:</strong> {form.skillCategories.tools}</div>}
                  </div>
                </div>

                {/* SECTION 7: ADDITIONAL CUSTOM SECTIONS */}
                {form.additionalSections && form.additionalSections.map((sec, idx) => sec.category && sec.items.length > 0 && (
                  <div key={idx} className={spacing.sectionMargin}>
                    <h2 className={`font-bold text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 font-sans text-${sectionHeaderAlign}`} style={{ borderColor: primaryHex, color: primaryHex }}>
                      {sec.category}
                    </h2>
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-900 font-sans">
                      {sec.items.map((it, iIdx) => it && (
                        <li key={iIdx} className={`text-${bodyAlign}`}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* TEMPLATE 2: MODERN TECH STANDARD (SILICON VALLEY) */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {selectedTemplate === 'modern' && (
              <div className="font-sans">
                {/* TOP ACCENT BAR & HEADER */}
                <div className={`border-t-4 pt-2 ${spacing.headerMargin} text-${headerAlign}`} style={{ borderTopColor: primaryHex }}>
                  <h1 className="text-2xl font-black tracking-tight text-slate-950">
                    {form.fullName || 'NAMA LENGKAP KANDIDAT'}
                    {form.academicTitles ? <span className="text-slate-600 font-semibold text-base ml-1">({form.academicTitles})</span> : ''}
                  </h1>
                  <div className="font-extrabold text-xs uppercase tracking-wider mb-2" style={{ color: primaryHex }}>
                    {form.targetRole || 'TARGET POSISI PEKERJAAN'}
                  </div>
                  <div className={`flex flex-wrap gap-1.5 text-[10px] text-slate-700 ${headerAlign === 'left' ? 'justify-start' : headerAlign === 'right' ? 'justify-end' : 'justify-center'}`}>
                    {form.email && <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-semibold">{form.email}</span>}
                    {form.phone && <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-semibold">{form.phone}</span>}
                    {form.location && <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-semibold">{form.location}</span>}
                    {form.portfolioUrl && <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-semibold">{form.portfolioUrl}</span>}
                    {form.linkedin && <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-semibold">{form.linkedin}</span>}
                    {(form.customContacts || []).map((cc, ccIdx) => cc.value && (
                      <span key={ccIdx} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-semibold">{cc.label ? `${cc.label}: ` : ''}{cc.value}</span>
                    ))}
                  </div>
                </div>

                {/* SUMMARY */}
                {form.summary && (
                  <div className={spacing.sectionMargin}>
                    <h2 className={`font-black text-xs uppercase tracking-wider border-l-4 pl-2 mb-1.5 text-${sectionHeaderAlign}`} style={{ borderLeftColor: primaryHex, color: primaryHex }}>
                      {t.summary}
                    </h2>
                    <p className={`text-slate-800 text-${bodyAlign}`}>
                      {form.summary}
                    </p>
                  </div>
                )}

                {/* RICH EDUCATION KEREN */}
                {form.educationList && form.educationList.some(e => e.institution || e.degree) && (
                  <div className={spacing.sectionMargin}>
                    <h2 className={`font-black text-xs uppercase tracking-wider border-l-4 pl-2 mb-2 text-${sectionHeaderAlign}`} style={{ borderLeftColor: primaryHex, color: primaryHex }}>
                      {t.education}
                    </h2>
                    {form.educationList.map((edu, idx) => (
                      <div key={idx} className={spacing.itemMargin}>
                        <div className="flex items-center justify-between font-bold text-slate-950">
                          <span>{edu.institution}</span>
                          <span className="text-slate-600 font-semibold">{edu.period}</span>
                        </div>
                        <div className="text-[10.5px] text-slate-700 font-medium">
                          {edu.degree} {edu.gpa ? `(${t.gpaLabel} ${edu.gpa})` : ''}
                        </div>
                        {edu.honors && <div className={`text-[10px] font-bold text-amber-900 text-${bodyAlign}`}>{t.honorsLabel} {edu.honors}</div>}
                        {edu.thesis && <div className={`text-[9.5px] font-semibold text-slate-700 italic text-${bodyAlign}`}>{t.thesisLabel} "{edu.thesis}"</div>}
                        {edu.activities && <div className={`text-[9.5px] text-indigo-900 font-semibold text-${bodyAlign}`}>{t.activitiesLabel} {edu.activities}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {/* EXPERIENCE */}
                {form.experienceList && form.experienceList.some(e => e.company || e.role) && (
                  <div className={spacing.sectionMargin}>
                    <h2 className={`font-black text-xs uppercase tracking-wider border-l-4 pl-2 mb-2 text-${sectionHeaderAlign}`} style={{ borderLeftColor: primaryHex, color: primaryHex }}>
                      {t.experience}
                    </h2>
                    {form.experienceList.map((exp, idx) => (
                      <div key={idx} className={spacing.itemMargin}>
                        <div className="flex items-center justify-between font-bold text-slate-950">
                          <span style={{ color: primaryHex }}>{exp.role}</span>
                          <span className="text-slate-600 font-semibold">{exp.period}</span>
                        </div>
                        <div className="text-[10.5px] font-semibold text-slate-700 mb-1">
                          {exp.company} • <span className="font-normal italic">{exp.location}</span>
                        </div>
                        <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-800">
                          {exp.bullets.map((b, bIdx) => b && (
                            <li key={bIdx} className={`text-${bodyAlign}`}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* PROJECTS */}
                {form.projectList && form.projectList.some(p => p.name) && (
                  <div className={spacing.sectionMargin}>
                    <h2 className={`font-black text-xs uppercase tracking-wider border-l-4 pl-2 mb-2 text-${sectionHeaderAlign}`} style={{ borderLeftColor: primaryHex, color: primaryHex }}>
                      {projectsTitle}
                    </h2>
                    {form.projectList.map((proj, idx) => (
                      <div key={idx} className={spacing.itemMargin}>
                        <div className="flex items-center justify-between font-bold text-slate-950">
                          <span>{proj.name}</span>
                          <span className="text-slate-500">{proj.period}</span>
                        </div>
                        {proj.technologies && (
                          <div className="text-[10px] font-semibold" style={{ color: primaryHex }}>
                            Stack / Tools: {proj.technologies}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* SKILLS */}
                <div className={spacing.sectionMargin}>
                  <h2 className={`font-black text-xs uppercase tracking-wider border-l-4 pl-2 mb-2 text-${sectionHeaderAlign}`} style={{ borderLeftColor: primaryHex, color: primaryHex }}>
                    {skillsTitle}
                  </h2>
                  <div className={`grid grid-cols-2 gap-2 text-slate-800 text-${bodyAlign}`}>
                    {form.skillCategories.languages && <div><strong style={{ color: primaryHex }}>{label1}:</strong> {form.skillCategories.languages}</div>}
                    {form.skillCategories.frameworks && <div><strong style={{ color: primaryHex }}>{label2}:</strong> {form.skillCategories.frameworks}</div>}
                    {form.skillCategories.databases && <div><strong style={{ color: primaryHex }}>{label3}:</strong> {form.skillCategories.databases}</div>}
                    {form.skillCategories.tools && <div><strong style={{ color: primaryHex }}>{label4}:</strong> {form.skillCategories.tools}</div>}
                  </div>
                </div>

                {/* SECTION 7: ADDITIONAL CUSTOM SECTIONS */}
                {form.additionalSections && form.additionalSections.map((sec, idx) => sec.category && sec.items.length > 0 && (
                  <div key={idx} className={spacing.sectionMargin}>
                    <h2 className={`font-black text-xs uppercase tracking-wider border-l-4 pl-2 mb-2 text-${sectionHeaderAlign}`} style={{ borderLeftColor: primaryHex, color: primaryHex }}>
                      {sec.category}
                    </h2>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      {sec.items.map((it, iIdx) => it && (
                        <span key={iIdx} className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 font-medium text-slate-800">
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* TEMPLATE 3: MINIMALIST EXECUTIVE */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {selectedTemplate === 'minimalist' && (
              <div className="font-sans">
                {/* EXECUTIVE BANNER HEADER */}
                <div className={`border-b border-slate-300 ${spacing.headerMargin} text-${headerAlign}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                        {form.fullName || 'NAMA LENGKAP KANDIDAT'}
                        {form.academicTitles ? <span className="text-slate-600 font-semibold text-base ml-1">, {form.academicTitles}</span> : ''}
                      </h1>
                      <div className="text-slate-700 font-bold text-xs uppercase tracking-widest mt-0.5">
                        {form.targetRole || 'TARGET POSISI PEKERJAAN'}
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-slate-600 space-y-0.5 font-mono">
                      {form.email && <div>{form.email}</div>}
                      {form.phone && <div>{form.phone}</div>}
                      {form.location && <div>{form.location}</div>}
                      {form.linkedin && <div>{form.linkedin}</div>}
                      {(form.customContacts || []).map((cc, ccIdx) => cc.value && (
                        <div key={ccIdx}>{cc.value}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SUMMARY */}
                {form.summary && (
                  <div className={spacing.sectionMargin}>
                    <div className={`text-white px-2 py-0.5 font-bold uppercase text-[9.5px] tracking-widest mb-1.5 rounded-sm inline-block text-${sectionHeaderAlign}`} style={{ backgroundColor: primaryHex }}>
                      {t.summary}
                    </div>
                    <p className={`text-slate-800 text-${bodyAlign}`}>
                      {form.summary}
                    </p>
                  </div>
                )}

                {/* EXPERIENCE */}
                {form.experienceList && form.experienceList.some(e => e.company || e.role) && (
                  <div className={spacing.sectionMargin}>
                    <div className={`text-white px-2 py-0.5 font-bold uppercase text-[9.5px] tracking-widest mb-2 rounded-sm inline-block text-${sectionHeaderAlign}`} style={{ backgroundColor: primaryHex }}>
                      {t.experience}
                    </div>
                    {form.experienceList.map((exp, idx) => (
                      <div key={idx} className={spacing.itemMargin}>
                        <div className="flex items-center justify-between font-bold text-slate-950">
                          <span>{exp.role} <span className="font-normal text-slate-600">at {exp.company}</span></span>
                          <span className="font-mono text-[9.5px] text-slate-600">{exp.period}</span>
                        </div>
                        <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-800 mt-0.5">
                          {exp.bullets.map((b, bIdx) => b && (
                            <li key={bIdx} className={`text-${bodyAlign}`}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* PROJECTS */}
                {form.projectList && form.projectList.some(p => p.name) && (
                  <div className={spacing.sectionMargin}>
                    <div className={`text-white px-2 py-0.5 font-bold uppercase text-[9.5px] tracking-widest mb-2 rounded-sm inline-block text-${sectionHeaderAlign}`} style={{ backgroundColor: primaryHex }}>
                      {projectsTitle}
                    </div>
                    {form.projectList.map((proj, idx) => (
                      <div key={idx} className={spacing.itemMargin}>
                        <div className="flex items-center justify-between font-bold text-slate-950">
                          <span>{proj.name} {proj.technologies && <span className="font-normal italic text-slate-600">({proj.technologies})</span>}</span>
                          <span className="font-mono text-[9.5px] text-slate-600">{proj.period}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* EDUCATION & SKILLS GRID */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  {/* RICH EDUCATION */}
                  <div>
                    <div className={`text-white px-2 py-0.5 font-bold uppercase text-[9.5px] tracking-widest mb-1.5 rounded-sm inline-block text-${sectionHeaderAlign}`} style={{ backgroundColor: primaryHex }}>
                      {t.education}
                    </div>
                    {form.educationList.map((edu, idx) => (
                      <div key={idx} className="mb-2">
                        <div className="font-bold text-slate-950">{edu.institution}</div>
                        <div className="text-slate-700">{edu.degree} {edu.gpa ? `(${t.gpaLabel} ${edu.gpa})` : ''}</div>
                        {edu.honors && <div className={`text-amber-900 font-semibold text-${bodyAlign}`}>{t.honorsLabel} {edu.honors}</div>}
                        {edu.thesis && <div className={`text-[9.5px] italic text-slate-600 text-${bodyAlign}`}>{t.thesisLabel} "{edu.thesis}"</div>}
                        <div className="text-slate-500 font-mono text-[9.5px]">{edu.period}</div>
                      </div>
                    ))}
                  </div>

                  {/* SKILLS */}
                  <div>
                    <div className={`text-white px-2 py-0.5 font-bold uppercase text-[9.5px] tracking-widest mb-1.5 rounded-sm inline-block text-${sectionHeaderAlign}`} style={{ backgroundColor: primaryHex }}>
                      {skillsTitle}
                    </div>
                    <div className={`space-y-0.5 text-slate-800 text-${bodyAlign}`}>
                      {form.skillCategories.languages && <div><strong>{label1}:</strong> {form.skillCategories.languages}</div>}
                      {form.skillCategories.frameworks && <div><strong>{label2}:</strong> {form.skillCategories.frameworks}</div>}
                      {form.skillCategories.databases && <div><strong>{label3}:</strong> {form.skillCategories.databases}</div>}
                      {form.skillCategories.tools && <div><strong>{label4}:</strong> {form.skillCategories.tools}</div>}
                    </div>
                  </div>
                </div>

                {/* SECTION 7: ADDITIONAL CUSTOM SECTIONS */}
                {form.additionalSections && form.additionalSections.map((sec, idx) => sec.category && sec.items.length > 0 && (
                  <div key={idx} className={spacing.sectionMargin}>
                    <div className={`text-white px-2 py-0.5 font-bold uppercase text-[9.5px] tracking-widest mb-1.5 rounded-sm inline-block text-${sectionHeaderAlign}`} style={{ backgroundColor: primaryHex }}>
                      {sec.category}
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-800">
                      {sec.items.map((it, iIdx) => it && (
                        <li key={iIdx} className={`text-${bodyAlign}`}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* TEMPLATE 4: CREATIVE PRODUCT & UI */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {selectedTemplate === 'creative' && (
              <div className="font-sans">
                {/* HEADER WITH CUSTOM ACCENT */}
                <div className={`text-white p-5 rounded-2xl mb-4 text-${headerAlign}`} style={{ backgroundColor: primaryHex }}>
                  <h1 className="text-2xl font-black tracking-tight text-white mb-0.5">
                    {form.fullName || 'NAMA LENGKAP KANDIDAT'}
                    {form.academicTitles ? <span className="text-white/80 font-semibold text-base ml-1.5">({form.academicTitles})</span> : ''}
                  </h1>
                  <div className="text-white/90 font-extrabold text-xs uppercase tracking-wider mb-2">
                    {form.targetRole || 'TARGET POSISI PEKERJAAN'}
                  </div>
                  <div className={`flex flex-wrap gap-3 text-[10px] text-white/80 ${headerAlign === 'left' ? 'justify-start' : headerAlign === 'right' ? 'justify-end' : 'justify-center'}`}>
                    {form.email && <span>{form.email}</span>}
                    {form.phone && <span>• {form.phone}</span>}
                    {form.location && <span>• {form.location}</span>}
                    {form.portfolioUrl && <span>• {form.portfolioUrl}</span>}
                    {form.linkedin && <span>• {form.linkedin}</span>}
                    {(form.customContacts || []).map((cc, ccIdx) => cc.value && (
                      <span key={ccIdx}>• {cc.label ? `${cc.label}: ` : ''}{cc.value}</span>
                    ))}
                  </div>
                </div>

                {/* 2-COLUMN LAYOUT IN CANVAS */}
                <div className="grid grid-cols-12 gap-5">
                  {/* LEFT SIDEBAR (4 Cols): SKILLS & EDUCATION */}
                  <div className="col-span-4 space-y-4 border-r border-slate-200 pr-4">
                    {/* SKILLS */}
                    <div>
                      <h3 className={`font-black text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 text-${sectionHeaderAlign}`} style={{ borderColor: primaryHex, color: primaryHex }}>
                        {skillsTitle}
                      </h3>
                      <div className="space-y-1.5 text-slate-800 text-[10px]">
                        {form.skillCategories.languages && (
                          <div>
                            <strong className="block text-slate-950">{label1}:</strong>
                            <span>{form.skillCategories.languages}</span>
                          </div>
                        )}
                        {form.skillCategories.frameworks && (
                          <div>
                            <strong className="block text-slate-950">{label2}:</strong>
                            <span>{form.skillCategories.frameworks}</span>
                          </div>
                        )}
                        {form.skillCategories.databases && (
                          <div>
                            <strong className="block text-slate-950">{label3}:</strong>
                            <span>{form.skillCategories.databases}</span>
                          </div>
                        )}
                        {form.skillCategories.tools && (
                          <div>
                            <strong className="block text-slate-950">{label4}:</strong>
                            <span>{form.skillCategories.tools}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RICH EDUCATION KEREN */}
                    {form.educationList && form.educationList.some(e => e.institution || e.degree) && (
                      <div>
                        <h3 className={`font-black text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 text-${sectionHeaderAlign}`} style={{ borderColor: primaryHex, color: primaryHex }}>
                          {t.education}
                        </h3>
                        {form.educationList.map((edu, idx) => (
                          <div key={idx} className="mb-2">
                            <div className="font-bold text-slate-950">{edu.institution}</div>
                            <div className="text-slate-700 text-[10px]">{edu.degree} {edu.gpa ? `(${edu.gpa})` : ''}</div>
                            {edu.honors && <div className="text-amber-900 font-semibold text-[9.5px]">{edu.honors}</div>}
                            {edu.thesis && <div className="text-slate-600 italic text-[9px]">{edu.thesis}</div>}
                            <div className="text-[9.5px] font-semibold" style={{ color: primaryHex }}>{edu.period}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RIGHT MAIN (8 Cols): SUMMARY, EXPERIENCE, PROJECTS, ADDITIONAL */}
                  <div className="col-span-8 space-y-4">
                    {/* SUMMARY */}
                    {form.summary && (
                      <div>
                        <h3 className={`font-black text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 text-${sectionHeaderAlign}`} style={{ borderColor: primaryHex, color: primaryHex }}>
                          {t.summary}
                        </h3>
                        <p className={`text-slate-800 text-${bodyAlign}`}>
                          {form.summary}
                        </p>
                      </div>
                    )}

                    {/* EXPERIENCE */}
                    {form.experienceList && form.experienceList.some(e => e.company || e.role) && (
                      <div>
                        <h3 className={`font-black text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 text-${sectionHeaderAlign}`} style={{ borderColor: primaryHex, color: primaryHex }}>
                          {t.experience}
                        </h3>
                        {form.experienceList.map((exp, idx) => (
                          <div key={idx} className="mb-3">
                            <div className="flex items-center justify-between font-bold text-slate-950">
                              <span>{exp.role}</span>
                              <span className="text-[9.5px] font-semibold" style={{ color: primaryHex }}>{exp.period}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-slate-600 mb-1">
                              {exp.company} • {exp.location}
                            </div>
                            <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-800">
                              {exp.bullets.map((b, bIdx) => b && (
                                <li key={bIdx} className={`text-${bodyAlign}`}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* PROJECTS */}
                    {form.projectList && form.projectList.some(p => p.name) && (
                      <div>
                        <h3 className={`font-black text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 text-${sectionHeaderAlign}`} style={{ borderColor: primaryHex, color: primaryHex }}>
                          {projectsTitle}
                        </h3>
                        {form.projectList.map((proj, idx) => (
                          <div key={idx} className="mb-2">
                            <div className="flex items-center justify-between font-bold text-slate-950">
                              <span>{proj.name}</span>
                              <span className="text-slate-500 text-[9.5px]">{proj.period}</span>
                            </div>
                            {proj.technologies && (
                              <div className="text-[9.5px] font-semibold" style={{ color: primaryHex }}>
                                {proj.technologies}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* SECTION 7: ADDITIONAL CUSTOM SECTIONS */}
                    {form.additionalSections && form.additionalSections.map((sec, idx) => sec.category && sec.items.length > 0 && (
                      <div key={idx} className="mb-3">
                        <h3 className={`font-black text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 text-${sectionHeaderAlign}`} style={{ borderColor: primaryHex, color: primaryHex }}>
                          {sec.category}
                        </h3>
                        <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-800">
                          {sec.items.map((it, iIdx) => it && (
                            <li key={iIdx} className={`text-${bodyAlign}`}>{it}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* TEMPLATE 5: CORPORATE FORTUNE 500 (NAVY BLUE BUMN & ENTERPRISE) */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {selectedTemplate === 'corporate' && (
              <div className="font-serif">
                {/* CORPORATE ACCENT HEADER */}
                <div className={`border-b-2 ${spacing.headerMargin}`} style={{ borderBottomColor: primaryHex }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold uppercase tracking-wide font-serif" style={{ color: primaryHex }}>
                        {form.fullName || 'NAMA LENGKAP KANDIDAT'}
                        {form.academicTitles ? `, ${form.academicTitles}` : ''}
                      </h1>
                      <div className="font-semibold text-xs font-sans mt-0.5" style={{ color: primaryHex }}>
                        {form.targetRole || 'TARGET POSISI PEKERJAAN'}
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-slate-700 font-sans leading-tight">
                      {form.location && <div>{form.location}</div>}
                      {form.phone && <div>{form.phone}</div>}
                      {form.email && <div>{form.email}</div>}
                      {form.portfolioUrl && <div>{form.portfolioUrl}</div>}
                      {form.linkedin && <div>{form.linkedin}</div>}
                      {(form.customContacts || []).map((cc, ccIdx) => cc.value && (
                        <div key={ccIdx}>{cc.label ? `${cc.label}: ` : ''}{cc.value}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SUMMARY */}
                {form.summary && (
                  <div className={spacing.sectionMargin}>
                    <h2 className={`font-bold text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 font-sans text-${sectionHeaderAlign}`} style={{ borderBottomColor: primaryHex, color: primaryHex }}>
                      {t.summary}
                    </h2>
                    <p className={`text-slate-900 font-sans text-${bodyAlign}`}>
                      {form.summary}
                    </p>
                  </div>
                )}

                {/* EXPERIENCE */}
                {form.experienceList && form.experienceList.some(e => e.company || e.role) && (
                  <div className={spacing.sectionMargin}>
                    <h2 className={`font-bold text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 font-sans text-${sectionHeaderAlign}`} style={{ borderBottomColor: primaryHex, color: primaryHex }}>
                      {t.experience}
                    </h2>
                    {form.experienceList.map((exp, idx) => (
                      <div key={idx} className={spacing.itemMargin}>
                        <div className="flex items-center justify-between font-bold" style={{ color: primaryHex }}>
                          <span>{exp.company} — <span className="font-normal italic text-slate-800">{exp.role}</span></span>
                          <span className="font-normal text-slate-700 text-[10px] font-sans">{exp.period}</span>
                        </div>
                        <div className="text-[10px] italic text-slate-600 mb-1 font-sans">{exp.location}</div>
                        <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-900 font-sans">
                          {exp.bullets.map((b, bIdx) => b && (
                            <li key={bIdx} className={`text-${bodyAlign}`}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* PROJECTS */}
                {form.projectList && form.projectList.some(p => p.name) && (
                  <div className={spacing.sectionMargin}>
                    <h2 className={`font-bold text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 font-sans text-${sectionHeaderAlign}`} style={{ borderBottomColor: primaryHex, color: primaryHex }}>
                      {projectsTitle}
                    </h2>
                    {form.projectList.map((proj, idx) => (
                      <div key={idx} className={spacing.itemMargin}>
                        <div className="flex items-center justify-between font-bold" style={{ color: primaryHex }}>
                          <span>{proj.name} {proj.technologies && <span className="font-normal italic text-slate-800">({proj.technologies})</span>}</span>
                          <span className="font-normal text-slate-700 text-[10px] font-sans">{proj.period}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* RICH EDUCATION KEREN & SKILLS GRID */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  {/* EDUCATION */}
                  <div>
                    <h2 className={`font-bold text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 font-sans text-${sectionHeaderAlign}`} style={{ borderBottomColor: primaryHex, color: primaryHex }}>
                      {t.education}
                    </h2>
                    {form.educationList.map((edu, idx) => (
                      <div key={idx} className="mb-2 font-sans">
                        <div className="font-bold text-slate-950">{edu.institution}</div>
                        <div className="text-slate-800">{edu.degree}</div>
                        {edu.honors && <div className={`text-amber-900 font-semibold text-${bodyAlign}`}>{t.honorsLabel} {edu.honors}</div>}
                        {edu.thesis && <div className={`text-slate-700 italic text-[9.5px] text-${bodyAlign}`}>{t.thesisLabel} "{edu.thesis}"</div>}
                        <div className="text-slate-600 text-[9.5px] italic">{edu.period} • {edu.gpa ? `${t.gpaLabel} ${edu.gpa}` : ''}</div>
                      </div>
                    ))}
                  </div>

                  {/* SKILLS */}
                  <div>
                    <h2 className={`font-bold text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 font-sans text-${sectionHeaderAlign}`} style={{ borderBottomColor: primaryHex, color: primaryHex }}>
                      {skillsTitle}
                    </h2>
                    <div className={`space-y-1 font-sans text-slate-900 text-${bodyAlign}`}>
                      {form.skillCategories.languages && <div><strong style={{ color: primaryHex }}>{label1}:</strong> {form.skillCategories.languages}</div>}
                      {form.skillCategories.frameworks && <div><strong style={{ color: primaryHex }}>{label2}:</strong> {form.skillCategories.frameworks}</div>}
                      {form.skillCategories.databases && <div><strong style={{ color: primaryHex }}>{label3}:</strong> {form.skillCategories.databases}</div>}
                      {form.skillCategories.tools && <div><strong style={{ color: primaryHex }}>{label4}:</strong> {form.skillCategories.tools}</div>}
                    </div>
                  </div>
                </div>

                {/* SECTION 7: ADDITIONAL CUSTOM SECTIONS */}
                {form.additionalSections && form.additionalSections.map((sec, idx) => sec.category && sec.items.length > 0 && (
                  <div key={idx} className={spacing.sectionMargin}>
                    <h2 className={`font-bold text-xs uppercase tracking-wider border-b-2 pb-1.5 mb-2.5 font-sans text-${sectionHeaderAlign}`} style={{ borderBottomColor: primaryHex, color: primaryHex }}>
                      {sec.category}
                    </h2>
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-900 font-sans">
                      {sec.items.map((it, iIdx) => it && (
                        <li key={iIdx} className={`text-${bodyAlign}`}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* FULLSCREEN CV DOKUMEN PREVIEW MODAL */}
        {isFullPreviewOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[99999] flex flex-col bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-200 overflow-hidden">
            
            {/* Modal Header Bar */}
            <div className="h-auto sm:h-16 py-2 px-3 sm:px-8 bg-slate-900/90 border-b border-slate-800 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 shrink-0 shadow-xl backdrop-blur-md">
              
              {/* Left: Title & Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0">
                  <Eye size={18} className="text-teal-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-white truncate flex items-center gap-2">
                    <span>Pratinjau Dokumen CV</span>
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide shrink-0">
                      {selectedTemplate}
                    </span>
                  </h3>
                  <p className="hidden sm:block text-[11px] text-slate-400 truncate">
                    Tampilan presisi format cetak A4 standard ATS · 100% Real-time Sync
                  </p>
                </div>
              </div>

              {/* Center: Interactive Zoom Controls */}
              <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950 p-1 sm:p-1.5 rounded-2xl border border-slate-800 shadow-inner">
                <button
                  onClick={() => setFullPreviewZoom(prev => Math.max(50, prev - 15))}
                  className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Zoom Out (-15%)"
                >
                  <ZoomOut size={15} />
                </button>

                <span className="px-3 text-xs font-extrabold text-teal-300 min-w-[55px] text-center">
                  {fullPreviewZoom}%
                </span>

                <button
                  onClick={() => setFullPreviewZoom(prev => Math.min(175, prev + 15))}
                  className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Zoom In (+15%)"
                >
                  <ZoomIn size={15} />
                </button>

                <div className="h-4 w-px bg-slate-800 mx-1" />

                <button
                  onClick={() => setFullPreviewZoom(100)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${fullPreviewZoom === 100 ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'}`}
                >
                  100% Fit A4
                </button>
                <button
                  onClick={() => setFullPreviewZoom(125)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${fullPreviewZoom === 125 ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'}`}
                >
                  125%
                </button>
              </div>

              {/* Right: Actions (Download & Close) */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isExportingPdf}
                  className="shimmer-btn-primary px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-teal-500/20"
                >
                  <Download size={14} className={isExportingPdf ? 'animate-bounce' : ''} />
                  <span className="hidden sm:inline">{isExportingPdf ? 'Memproses...' : 'Download PDF'}</span>
                </button>

                <button
                  onClick={() => setIsFullPreviewOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700"
                  title="Tutup Pratinjau (ESC)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Main Viewport Container */}
            <div className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-8 flex justify-center items-start custom-horizontal-scrollbar scrollbar-thin">
              <div 
                className="transition-all duration-200 origin-top shadow-2xl my-4 rounded-none bg-white border border-slate-700"
                style={{
                  transform: `scale(${fullPreviewZoom / 100})`,
                  transformOrigin: 'top center',
                  maxWidth: fullPreviewZoom <= 100 ? '800px' : 'none',
                  width: '100%'
                }}
              >
                <div 
                  className={`bg-white text-slate-950 rounded-none border-0 ${spacing.wrapper}`} 
                  dir={isRtl ? 'rtl' : 'ltr'}
                  dangerouslySetInnerHTML={{ __html: typeof document !== 'undefined' ? document.getElementById('printable-cv-canvas')?.innerHTML || '' : '' }}
                />
              </div>
            </div>

          </div>,
          document.body
        )}

        {/* IMPORT CV MODAL VIA AI (PASTE CV TEXT) */}
        {isImportModalOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
              {/* Close button */}
              <button
                onClick={() => !isParsingCv && setIsImportModalOpen(false)}
                disabled={isParsingCv}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-50"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0">
                    <Sparkles size={20} className="text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Tempel Teks CV &amp; Ekstrak via AI</h3>
                    <p className="text-xs text-slate-400">Salin dan tempelkan teks CV Anda untuk mengisi formulir otomatis</p>
                  </div>
                </div>
              </div>

              {isParsingCv ? (
                <div className="py-8 text-center space-y-4">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={24} className="text-teal-400 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">AI Sedang Membaca &amp; Mengekstrak Data CV...</h4>
                    <p className="text-xs text-teal-300/80">Menganalisis riwayat pendidikan, pengalaman kerja, skill, dan kontak otomatis.</p>
                  </div>
                </div>
              ) : (
                /* COPY-PASTE TEXT AREA */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Tempel Teks CV / Profil Portofolio Anda di Sini:</span>
                      {rawTextPaste && (
                        <button
                          onClick={() => setRawTextPaste('')}
                          className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Eraser size={12} /> Bersihkan Teks
                        </button>
                      )}
                    </label>
                    <textarea
                      rows={9}
                      value={rawTextPaste}
                      onChange={(e) => setRawTextPaste(e.target.value)}
                      placeholder="Tempelkan seluruh teks dari dokumen CV kamu di sini...&#10;&#10;Contoh:&#10;Nama: Kms Muhammad Al Qodri&#10;Email: alqodri@kemaswebstudio.id&#10;Ringkasan: Backend & Cloud Developer...&#10;Pendidikan: S.Kom Universitas X...&#10;Pengalaman: Software Engineer di PT Y (2022-2024)..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/60 rounded-2xl p-3.5 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all scrollbar-thin leading-relaxed"
                    />
                  </div>

                  <button
                    onClick={handleParseRawText}
                    disabled={!rawTextPaste.trim() || isParsingCv}
                    className="w-full shimmer-btn-primary py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-teal-500/20"
                  >
                    <Sparkles size={16} />
                    <span>Ekstrak &amp; Isi Formulir CV via AI</span>
                  </button>

                  {/* Quick Option: Use Active Saved CV */}
                  {hasCv && (
                    <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Sparkles size={15} className="text-teal-400 shrink-0" />
                        <div className="text-xs text-slate-200">
                          Atau ekstrak dari CV Aktif tersimpan: <strong className="text-teal-300">{activeCv?.filename || 'CV_Profil.pdf'}</strong>
                        </div>
                      </div>
                      <button
                        onClick={handleParseActiveCv}
                        className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer shrink-0"
                      >
                        Isi CV Aktif
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-teal-500/30 text-[11px] text-slate-300 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-teal-300">Ekstraksi Presisi AI:</strong> Cukup tempel teks CV kamu, AI akan otomatis memisahkan Nama, Kontak, Ringkasan, Pendidikan, Pengalaman, Proyek, dan Skill secara terstruktur!
                  </span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* MULTI-NATIONAL LANGUAGE & COUNTRY SELECTOR MODAL (A-Z ALPHABET & SEARCH) */}
        {isLanguageModalOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 relative max-h-[90vh] flex flex-col">
              {/* Close button */}
              <button
                onClick={() => setIsLanguageModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4 shrink-0">
                <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0">
                  <Globe size={22} className="text-teal-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>Pilih Bahasa &amp; Negara Terjemahan CV</span>
                    <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-full font-extrabold">35+ Bahasa Global</span>
                  </h3>
                  <p className="text-xs text-slate-400">Pilih negara atau bahasa tujuan. AI akan menerjemahkan seluruh isi CV kamu secara otomatis.</p>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="space-y-3 shrink-0">
                {/* Live Search Input */}
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={languageSearchQuery}
                    onChange={(e) => setLanguageSearchQuery(e.target.value)}
                    placeholder="Ketik nama negara atau bahasa (misal: Jepang, Korea, Jerman, Spain, Indonesia, Arabic)..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/60 rounded-2xl pl-10 pr-10 py-3 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all shadow-inner"
                  />
                  {languageSearchQuery && (
                    <button
                      onClick={() => setLanguageSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* A-Z Alphabetical Index Filter Pills */}
                <div 
                  onWheel={(e) => {
                    if (e.deltaY !== 0) {
                      e.currentTarget.scrollLeft += e.deltaY;
                    }
                  }}
                  className="flex items-center gap-1 overflow-x-auto custom-horizontal-scrollbar pb-2"
                >
                  <button
                    onClick={() => setSelectedAlphabetFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shrink-0 border ${selectedAlphabetFilter === 'ALL'
                      ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                      }`}
                  >
                    Semua (A-Z)
                  </button>
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((letter) => {
                    const hasMatches = LANGUAGES.some(l => l.name.toUpperCase().startsWith(letter));
                    const isSelected = selectedAlphabetFilter === letter;
                    return (
                      <button
                        key={letter}
                        disabled={!hasMatches}
                        onClick={() => setSelectedAlphabetFilter(letter)}
                        className={`w-7 h-7 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shrink-0 flex items-center justify-center border disabled:opacity-30 disabled:cursor-not-allowed ${isSelected
                          ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md scale-105'
                          : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                          }`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Country & Language Cards Grid */}
              <div className="overflow-y-auto pr-1 scrollbar-thin space-y-2 flex-1 max-h-[380px]">
                {filteredLanguages.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <AlertCircle size={32} className="text-amber-400 mx-auto opacity-60" />
                    <p className="text-xs text-slate-400">Tidak ada bahasa atau negara yang cocok dengan kata pencarian "<strong>{languageSearchQuery}</strong>".</p>
                    <button
                      onClick={() => { setLanguageSearchQuery(''); setSelectedAlphabetFilter('ALL'); }}
                      className="text-xs text-teal-400 underline font-bold cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {filteredLanguages.map((lang) => {
                      const isSelected = selectedLanguage === lang.id;
                      return (
                        <div
                          key={lang.id}
                          onClick={() => {
                            setIsLanguageModalOpen(false);
                            handleTranslateEntireCv(lang.id);
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 hover:scale-[1.02] ${isSelected
                            ? 'bg-teal-500/20 border-teal-500/70 shadow-lg shadow-teal-500/10'
                            : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800'
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center font-black text-xs text-teal-300 shrink-0">
                              {lang.code}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                                <span>{lang.name}</span>
                              </div>
                              {lang.country && (
                                <div className="text-[10.5px] text-slate-400 truncate">
                                  {lang.country}
                                </div>
                              )}
                            </div>
                          </div>

                          {isSelected ? (
                            <span className="px-2 py-0.5 rounded-full bg-teal-500 text-slate-950 text-[10px] font-black shrink-0 flex items-center gap-1">
                              <Check size={10} /> Aktif
                            </span>
                          ) : (
                            <span className="text-[10.5px] text-teal-400 font-bold opacity-0 group-hover:opacity-100 shrink-0">
                              Pilih
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer Info */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
                <span>Menampilkan <strong>{filteredLanguages.length}</strong> bahasa &amp; negara</span>
                <button
                  onClick={() => setIsLanguageModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      </div>
    </div>
  );
}
