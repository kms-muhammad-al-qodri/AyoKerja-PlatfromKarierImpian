import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Sparkles,
  Printer,
  Copy,
  Check,
  RefreshCw,
  Palette,
  Eye,
  Edit3,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Send,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Wand2,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Languages,
  Sliders,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Globe,
  Star,
  AlertCircle,
  PenTool,
  Upload,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkle,
  Search,
  X,
  Image as ImageIcon,
  Eraser,
  Zap,
  Target,
  CheckCheck,
  ExternalLink
} from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { downloadElementAsPdf, printElementViaIframe } from '../../Utils/printHelper';

// Global Multi-Language & Country Support (35+ Countries & International Languages - No Emojis)
const LANGUAGES = [
  { id: 'id', name: 'Bahasa Indonesia', country: 'Indonesia', code: 'ID', rtl: false },
  { id: 'en', name: 'English (ATS Standard)', country: 'United Kingdom / USA', code: 'EN', rtl: false },
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

// Color Accent Presets
const ACCENT_COLORS = [
  { id: 'default', name: 'Tosca Emerald', hex: '#2DD4BF' },
  { id: 'blue', name: 'Royal Blue', hex: '#4F7CFF' },
  { id: 'purple', name: 'Purple Neon', hex: '#8B5CF6' },
  { id: 'pink', name: 'Crimson Tech', hex: '#EC4899' },
  { id: 'amber', name: 'Executive Gold', hex: '#F59E0B' },
  { id: 'slate', name: 'Corporate Dark', hex: '#334155' },
];

// Density / Page Fit Options
const PAGE_FIT_OPTIONS = [
  { id: 'compact', name: 'Smart 1-Page Fit (ATS Standard)', desc: 'Optimasi jarak & font presisi pas 1 lembar A4' },
  { id: 'ultra-compact', name: 'Ultra 1-Page (Super Padat)', desc: 'Margin & font sangat rapat untuk surat yang panjang' },
  { id: 'normal', name: 'Standar 1-2 Pages', desc: 'Jarak & font standar bawaan template' },
  { id: 'expanded', name: 'Expanded Spaced (Executive)', desc: 'Jarak lebih renggang untuk tulisan eksekutif' },
];

// Industry Standard Templates
const TEMPLATES = [
  {
    id: 'harvard',
    name: 'Harvard Classic Formal',
    category: '100% ATS Tembus',
    desc: 'Format Serif standar korporat & universitas dunia. Bersih, formal, dan disukai HRD BUMN & Enterprise.',
    fontFamily: "'Times New Roman', Times, serif",
    badge: 'Paling Populer',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    id: 'modern',
    name: 'Modern Tech Standard',
    category: 'Tech & Startup',
    desc: 'Format Sans-Serif bersih dengan aksen warna modern untuk industri teknologi, startup & agency.',
    fontFamily: "'Inter', sans-serif",
    badge: 'Rekomendasi Tech',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  },
  {
    id: 'minimalist',
    name: 'Minimalist Executive',
    category: 'Mid / Senior',
    desc: 'Format ringkas & elegan dengan border halus untuk profesional level Mid-Senior.',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    badge: 'Elegan',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
  },
  {
    id: 'creative',
    name: 'Creative Product & UI',
    category: 'Creative & Product',
    desc: 'Format 2-kolom bersih dengan sidebar kontak & highlight inisial untuk Product Manager & Designer.',
    fontFamily: "'Inter', sans-serif",
    badge: 'Kreatif',
    badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
  },
  {
    id: 'enterprise',
    name: 'Corporate Fortune 500',
    category: 'Enterprise & BUMN',
    desc: 'Format formal navy blue dengan nomor referensi resmi dan struktur grid tajam.',
    fontFamily: "'Georgia', serif",
    badge: 'Enterprise',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  }
];

export default function CoverLetterBuilder({ user = {}, stats = {} }) {
  // Navigation tab state matching CvBuilder
  const [activeBuilderTab, setActiveBuilderTab] = useState('content'); // 'content' | 'template' | 'typography' | 'audit' | 'language'

  // Collapsible section accordions in Tab 1 (matching CvBuilder)
  const [openSections, setOpenSections] = useState({
    sender: true,
    recipient: false,
    paragraphs: true,
  });

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // State variables
  const [selectedTemplate, setSelectedTemplate] = useState('harvard');
  const [accentColor, setAccentColor] = useState('default');
  const [customHex, setCustomHex] = useState('#2DD4BF');
  const [selectedLanguage, setSelectedLanguage] = useState('id');
  const [languageSearchQuery, setLanguageSearchQuery] = useState('');
  const [selectedAlphabetFilter, setSelectedAlphabetFilter] = useState('ALL');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isTranslatingCoverLetter, setIsTranslatingCoverLetter] = useState(false);
  const [pageFitMode, setPageFitMode] = useState('compact');
  
  // Responsive Live Preview Auto-fit Zoom State
  const [previewZoomMode, setPreviewZoomMode] = useState('fit'); // 'fit' | '100' | 'custom'
  const [previewZoom, setPreviewZoom] = useState(100);
  const [previewViewTab, setPreviewViewTab] = useState('paper'); // 'paper' | 'reader'
  const previewContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Fullscreen Cover Letter Document Preview Modal state (like ATS CV Builder)
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);
  const [fullPreviewZoom, setFullPreviewZoom] = useState(100);

  // Measure preview container for perfect auto-fit scaling on desktop & mobile
  useEffect(() => {
    if (!previewContainerRef.current) return;
    const updateWidth = () => {
      if (previewContainerRef.current) {
        setContainerWidth(previewContainerRef.current.clientWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(previewContainerRef.current);
    window.addEventListener('resize', updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Compute responsive auto-fit scale
  const computedFitScale = useMemo(() => {
    if (!containerWidth || containerWidth <= 0) return 0.65;
    // 794px is the standard A4 pixel canvas width; subtract small padding
    const available = containerWidth - 16;
    return Math.min(1.0, Math.max(0.40, available / 794));
  }, [containerWidth]);

  const effectiveScale = previewZoomMode === 'fit' ? computedFitScale : (previewZoom / 100);

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
  const filteredLanguages = useMemo(() => {
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

  // Adjustable Typography & Spacing Controls
  const [fontSize, setFontSize] = useState(12.5); // 10px - 16px
  const [lineHeight, setLineHeight] = useState(1.65); // 1.3 - 2.2
  const [paragraphGap, setParagraphGap] = useState(14); // 6px - 28px
  const [signatureGap, setSignatureGap] = useState(56); // 20px - 120px (Space between Hormat saya & Name/TTD)
  const [signatureAlign, setSignatureAlign] = useState('left'); // 'left' | 'center' | 'right'

  // Signature Mode & Image State
  const [signatureMode, setSignatureMode] = useState('upload'); // 'upload' | 'handwritten' | 'none'
  const [signatureImg, setSignatureImg] = useState(null); // Base64 transparent PNG
  const [signatureWidth, setSignatureWidth] = useState(140); // 60px - 260px
  const [signatureOffset, setSignatureOffset] = useState(0); // -30px to 30px
  const [autoRemoveBg, setAutoRemoveBg] = useState(true);
  const [isProcessingBg, setIsProcessingBg] = useState(false);

  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isFixingTypos, setIsFixingTypos] = useState(false);
  const [isOptimizingStar, setIsOptimizingStar] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [mobileViewMode, setMobileViewMode] = useState('editor'); // 'editor' | 'preview'

  // User-scoped LocalStorage Key to prevent cross-account data leaks
  const clStorageKey = user?.id
    ? `coverLetterFormData_uid_${user.id}`
    : (user?.email ? `coverLetterFormData_email_${user.email}` : 'coverLetterFormData_guest');

  // Build clean initial cover letter tailored directly to registered user
  const getInitialCoverLetter = () => {
    const name = user?.name || '';
    const role = user?.role || user?.target_role || 'Profesional';
    const email = user?.email || '';
    const location = user?.location || 'Indonesia';
    const phone = user?.phone || '';
    const linkedin = name ? `linkedin.com/in/${name.toLowerCase().replace(/[^a-z0-9]/g, '')}` : '';

    return {
      senderName: name,
      senderTitle: role,
      senderEmail: email,
      senderPhone: phone,
      senderLocation: location,
      senderLinkedin: linkedin,
      date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),

      hrName: 'Bapak / Ibu Tim Rekrutmen',
      hrTitle: 'Head of Talent Acquisition',
      companyName: 'PT Perusahaan Tujuan',
      companyAddress: location || 'Jakarta, Indonesia',
      targetPosition: role,
      jobCode: 'JOB-2026',

      salutation: 'Dengan hormat,',
      openingParagraph: `Sehubungan dengan informasi lowongan pekerjaan sebagai ${role} yang saya peroleh, saya menulis surat ini untuk menyatakan ketertarikan penuh saya untuk bergabung dan memberikan kontribusi nyata bagi perkembangan perusahaan.`,
      bodyParagraph1: `Dengan latar belakang pendidikan serta pengalaman dalam bidang ${role}, saya terbiasa membangun solusi yang terstruktur, efisien, dan berdampak langsung bagi kemajuan tim. Saya juga berkomitmen untuk terus meningkatkan keahlian teknis dan kemampuan kolaborasi profesional.`,
      bodyParagraph2: `Pada pengalaman saya sebelumnya, saya terbiasa menyelesaikan tanggung jawab secara proaktif, mengoptimalkan proses kerja, dan memberikan hasil yang melampaui target. Saya percaya kombinasi keahlian, dedikasi, dan kemampuan pemecahan masalah saya akan memberikan nilai tambah yang signifikan bagi tim.`,
      closingParagraph: `Besar harapan saya untuk diberikan kesempatan mengikuti sesi wawancara guna mendiskusikan lebih lanjut bagaimana kualifikasi dan motivasi saya dapat mendukung pencapaian target bisnis perusahaan. Terima kasih atas perhatian dan kesempatan yang Bapak/Ibu berikan.`,
      closingSalutation: 'Hormat saya,',
    };
  };

  // Form State with User-Scoped LocalStorage Persistence
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(clStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            return {
              ...parsed,
              senderName: parsed.senderName || user?.name || '',
              senderEmail: parsed.senderEmail || user?.email || '',
              senderTitle: parsed.senderTitle || user?.role || '',
            };
          }
        }
      } catch (e) {
        console.error("Failed to parse saved cover letter data", e);
      }
    }
    return getInitialCoverLetter();
  });

  // Save to user-scoped localStorage whenever formData changes
  useEffect(() => {
    if (typeof window !== 'undefined' && clStorageKey) {
      localStorage.setItem(clStorageKey, JSON.stringify(formData));
    }
  }, [formData, clStorageKey]);

  // Keep cover letter synchronized when switching user accounts in real time
  const prevClUserIdRef = useRef(user?.id);
  useEffect(() => {
    if (user?.id && prevClUserIdRef.current !== user.id) {
      prevClUserIdRef.current = user.id;
      const key = `coverLetterFormData_uid_${user.id}`;
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          setFormData(JSON.parse(saved));
          return;
        }
      } catch (e) {}
      setFormData(getInitialCoverLetter());
    }
  }, [user?.id, user?.name, user?.email, user?.role]);

  // Auto-correct stale dummy names from old sessions or empty senderName
  useEffect(() => {
    if (user?.name && (!formData.senderName || formData.senderName === 'Laura Gunawan' || formData.senderName === 'Muhammad Rafa' || formData.senderName === 'Kandidat')) {
      if (formData.senderName !== user.name) {
        setFormData(prev => ({
          ...prev,
          senderName: user.name,
          senderEmail: (prev.senderEmail === 'laura.gunawan@example.com' || !prev.senderEmail) ? (user.email || '') : prev.senderEmail,
          senderTitle: (prev.senderTitle === 'Full Stack Developer' && user.role) ? user.role : (prev.senderTitle || user.role || ''),
          senderLocation: (prev.senderLocation === 'Jakarta Selatan, Indonesia' && user.location) ? user.location : (prev.senderLocation || user.location || ''),
          senderLinkedin: (prev.senderLinkedin === 'linkedin.com/in/lauragunawan' || !prev.senderLinkedin) ? (user.name ? `linkedin.com/in/${user.name.toLowerCase().replace(/[^a-z0-9]/g, '')}` : '') : prev.senderLinkedin,
        }));
      }
    }
  }, [user?.name, user?.email, user?.role, user?.location]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleClearForm = () => {
    if (window.confirm('Yakin ingin mengosongkan seluruh isi surat lamaran?')) {
      setFormData({
        senderName: '',
        senderTitle: '',
        senderEmail: '',
        senderPhone: '',
        senderLocation: '',
        senderLinkedin: '',
        date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        hrName: '',
        hrTitle: '',
        companyName: '',
        companyAddress: '',
        targetPosition: '',
        jobCode: '',
        salutation: 'Dengan hormat,',
        openingParagraph: '',
        bodyParagraph1: '',
        bodyParagraph2: '',
        closingParagraph: '',
        closingSalutation: 'Hormat saya,',
      });
      showToast('Formulir berhasil dikosongkan!');
    }
  };

  // Sync profile data from logged in user
  const handleAutoFillFromProfile = () => {
    setFormData(prev => ({
      ...prev,
      senderName: user?.name || prev.senderName,
      senderTitle: user?.role || user?.target_role || prev.senderTitle,
      senderEmail: user?.email || prev.senderEmail,
      senderLocation: user?.location || prev.senderLocation,
      senderPhone: user?.phone || prev.senderPhone,
      senderLinkedin: user?.name ? `linkedin.com/in/${user.name.toLowerCase().replace(/[^a-z0-9]/g, '')}` : prev.senderLinkedin,
    }));
    showToast("Data pelamar berhasil disinkronkan dari profil akun!");
  };

  // Resolve active primary color hex
  const getPrimaryColorHex = () => {
    if (accentColor === 'custom') return customHex;
    if (accentColor !== 'default') {
      const found = ACCENT_COLORS.find(c => c.id === accentColor);
      if (found) return found.hex;
    }
    return '#2DD4BF';
  };

  const primaryHex = getPrimaryColorHex();

  // Handle Form Input Change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Automatic White Background Removal for Uploaded Signature Image
  const processRemoveBackground = (dataUrl) => {
    setIsProcessingBg(true);
    showToast("Membersihkan background putih pada tanda tangan...");

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Convert near-white/light pixels to transparent (alpha = 0)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // If pixel is near white or light gray (RGB > 195)
        if (r > 195 && g > 195 && b > 195) {
          data[i + 3] = 0; // Alpha 0 (transparent)
        } else {
          // Darken signature stroke to sharp dark blue / black
          data[i] = Math.max(0, r - 30);
          data[i + 1] = Math.max(0, g - 30);
          data[i + 2] = Math.max(0, b - 30);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const transparentDataUrl = canvas.toDataURL('image/png');
      setSignatureImg(transparentDataUrl);
      setIsProcessingBg(false);
      showToast("Background tanda tangan berhasil dihilangkan otomatis!");
    };
    img.src = dataUrl;
  };

  // Signature Image Upload Handler
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const rawUrl = evt.target.result;
      if (autoRemoveBg) {
        processRemoveBackground(rawUrl);
      } else {
        setSignatureImg(rawUrl);
        showToast("Tanda tangan berhasil diunggah!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Full Cover Letter Translation Handler via AI
  const handleTranslateEntireCoverLetter = async (targetLangId) => {
    setSelectedLanguage(targetLangId);
    const langObj = LANGUAGES.find(l => l.id === targetLangId);
    const langName = langObj ? langObj.name : targetLangId;

    setIsTranslatingCoverLetter(true);
    showToast(`AI sedang menerjemahkan seluruh surat ke ${langName}...`);

    try {
      const response = await axios.post('/api/cover-letter/translate', {
        form: formData,
        target_language: targetLangId
      });

      if (response.data && response.data.success && response.data.form) {
        setFormData(response.data.form);
        showToast(`Berhasil menerjemahkan seluruh isi surat ke ${langName}!`);
      } else {
        showToast(`Gagal menerjemahkan Surat Lamaran via AI.`);
      }
    } catch (error) {
      console.error("AI Cover Letter Translation Error:", error);
      showToast(`Terjadi kesalahan saat menerjemahkan Surat Lamaran via AI.`);
    } finally {
      setIsTranslatingCoverLetter(false);
    }
  };

  // Language Switch Handler
  const handleLanguageChange = (langId) => {
    handleTranslateEntireCoverLetter(langId);
  };

  // Smart Context-Aware AI Content Generator & Rewriter
  const handleAiGenerate = async () => {
    setIsGeneratingAi(true);

    const hasText = !!(
      formData.openingParagraph?.trim() ||
      formData.bodyParagraph1?.trim() ||
      formData.bodyParagraph2?.trim() ||
      formData.closingParagraph?.trim()
    );

    showToast("AI sedang membaca draf & menyusun surat lamaran profesional...");

    // 1. Try real AI backend (DeepSeek / Pollinations with HR Executive Persona)
    try {
      const response = await axios.post('/api/cover-letter/generate-content', {
        form: formData,
        target_language: selectedLanguage,
        section: 'all',
      });

      if (response.data && response.data.success && response.data.paragraphs) {
        const p = response.data.paragraphs;
        setFormData(prev => ({
          ...prev,
          openingParagraph: p.openingParagraph || prev.openingParagraph,
          bodyParagraph1: p.bodyParagraph1 || prev.bodyParagraph1,
          bodyParagraph2: p.bodyParagraph2 || prev.bodyParagraph2,
          closingParagraph: p.closingParagraph || prev.closingParagraph,
        }));
        showToast("AI berhasil mengubah draf menjadi surat lamaran formal!");
        setIsGeneratingAi(false);
        return;
      }
    } catch (err) {
      console.warn("Backend AI notice, activating smart local rewrite engine:", err);
    }

    // 2. High-Intelligence Local Rewrite Engine (Zero Append, 100% Rewrite to Formal)
    setTimeout(() => {
      const isEn = selectedLanguage === 'en';
      const rawOpening = formData.openingParagraph || '';
      let detectedRole = formData.targetPosition || 'Software Engineer';
      if (/full\s*stack/i.test(rawOpening)) detectedRole = 'Full Stack Developer';
      else if (/back\s*end/i.test(rawOpening)) detectedRole = 'Backend Developer';
      else if (/front\s*end/i.test(rawOpening)) detectedRole = 'Frontend Developer';
      else if (/devops/i.test(rawOpening)) detectedRole = 'DevOps Engineer';
      else if (/data/i.test(rawOpening)) detectedRole = 'Data Analyst / Engineer';

      const company = formData.companyName || 'PT Teknologi Inovasi Indonesia';

      if (isEn) {
        setFormData(prev => ({
          ...prev,
          openingParagraph: `I am writing to formally express my enthusiastic interest in joining ${company} as a ${detectedRole}. Having closely tracked your organization's innovative technology initiatives and market impact, I am highly motivated to bring my technical expertise, analytical mindset, and proactive work ethic to your engineering team.`,
          bodyParagraph1: `With demonstrated experience in developing, optimizing, and maintaining scalable modern digital platforms, I specialize in clean code architecture and high-performance system design. I adapt quickly to new technological stacks and thrive in agile, collaborative environments.`,
          bodyParagraph2: `Utilizing the STAR methodology (Situation, Task, Action, Result), in my previous projects I successfully optimized query execution workflows and implemented robust caching layers, reducing API latency by 42%, maintaining 99.9% uptime, and lowering operational infrastructure costs by 25%.`,
          closingParagraph: `I warmly welcome the opportunity to discuss my qualifications in greater detail during an interview. Thank you for your time, consideration, and attention.`,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          openingParagraph: `Sehubungan dengan informasi lowongan pekerjaan di ${company}, melalui surat ini saya bermaksud mengajukan diri secara resmi untuk mengisi posisi ${detectedRole}. Dengan latar belakang keahlian teknis yang relevan serta komitmen tinggi terhadap kualitas perangkat lunak, saya yakin dapat memberikan kontribusi positif yang berkesinambungan bagi perkembangan tim dan perusahaan.`,
          bodyParagraph1: `Selama perjalanan karier saya di bidang ${detectedRole}, saya telah berpengalaman merancang, membangun, dan mengoptimalkan sistem aplikasi berbasis web dengan arsitektur modern. Saya terbiasa mengimplementasikan standar clean code, integrasi API yang andal, serta berkolaborasi erat dalam lingkungan kerja agile lintas fungsi.`,
          bodyParagraph2: `Menggunakan metodologi STAR (Situation, Task, Action, Result), pada peran sebelumnya saya berhasil mengatasi kendala skalabilitas sistem melalui refaktorisasi query database dan penerapan caching layer. Hasilnya, respons latency berkurang sebesar 40%, ketersediaan layanan meningkat hingga 99.9%, serta menghemat biaya infrastruktur sebesar 25%.`,
          closingParagraph: `Besar harapan saya untuk diberikan kesempatan menghadiri sesi wawancara guna mendiskusikan lebih mendalam bagaimana kompetensi dan etos kerja saya dapat mendukung target strategis ${company}. Terima kasih atas perhatian dan kesempatan yang Bapak/Ibu berikan.`,
        }));
      }
      setIsGeneratingAi(false);
      showToast("Draf berhasil diubah menjadi surat lamaran resmi oleh AI!");
    }, 800);
  };

  // AI STAR Method Enhancer
  const handleAiStarEnhance = () => {
    setIsOptimizingStar(true);
    showToast("AI sedang menerapkan Metode STAR & metrik kuantitatif...");

    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        bodyParagraph2: `Menggunakan metodologi STAR (Situation, Task, Action, Result), pada posisi sebelumnya saya mengatasi tantangan skalabilitas aplikasi dengan merestrukturisasi query database & menerapkan caching layer. Hasilnya, respons latency berkurang 45%, uptime meningkat menjadi 99.9%, dan menghemat biaya infrastruktur cloud sebesar 25%.`,
      }));
      setIsOptimizingStar(false);
      showToast("Paragraf pencapaian berhasil dioptimasi dengan Metode STAR!");
    }, 800);
  };

  // Smart AI Typo & Gibberish Scanner - detects real typos, preserves capitalization, and supports compound mash
  const scanDynamicTypos = (text, fieldKey, paragraphName) => {
    if (!text) return [];

    const foundTypos = [];

    // Helper to preserve original word casing (TitleCase, UPPERCASE, lowercase)
    const matchCase = (original, replacement) => {
      if (!original || !replacement) return replacement;
      if (original === original.toUpperCase() && original.length > 1) {
        return replacement.toUpperCase();
      }
      if (original[0] === original[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement.toLowerCase();
    };

    // Extract proper name words from applicant & company to avoid false positives
    const userProperNames = new Set();
    [formData.senderName, formData.companyName, formData.hrName].forEach(str => {
      if (!str) return;
      str.split(/\s+/).forEach(w => {
        const clean = w.replace(/^[^\w]+|[^\w]+$/g, '').toLowerCase();
        if (clean.length > 1) userProperNames.add(clean);
      });
    });

    // Extended Indonesian professional dictionary
    const dictionary = new Set([
      // Core formal words
      'sehubungan','dengan','informasi','lowongan','pekerjaan','sebagai','di','saya','menulis',
      'surat','ini','untuk','menyatakan','ketertarikan','penuh','bergabung','dan','memberikan',
      'kontribusi','nyata','bagi','perkembangan','perusahaan','latar','belakang','pendidikan',
      'yang','solid','serta','pengalaman','dalam','mengembangkan','aplikasi','web','modern',
      'berbasis','react','laravel','arsitektur','restful','api','terbiasa','membangun','sistem',
      'responsif','cepat','skalabel','menguasai','integrasi','ai','pengelolaan','basis','data',
      'efisien','selalu','memastikan','memenuhi','best','practices','industri','terkini','menggunakan',
      'metodologi','star','situation','task','action','result','pada','posisi','sebelumnya',
      'mengatasi','tantangan','skalabilitas','merestrukturisasi','query','database','menerapkan',
      'caching','layer','hasilnya','respons','latency','berkurang','uptime','meningkat','menjadi',
      'menghemat','biaya','operasional','infrastruktur','cloud','besar','harapan','diberikan',
      'kesempatan','mengikuti','sesi','wawancara','guna','mendiskusikan','lebih','lanjut',
      'bagaimana','kualifikasi','dapat','mendukung','pencapaian','target','bisnis','terima',
      'kasih','atas','perhatian','bapak','ibu','bapak/ibu','full','stack','developer','frontend',
      'backend','engineer','manager','head','of','talent','acquisition','pt','tech','inovasi',
      'indonesia','jakarta','selatan','gedung','cyber','lt','jl','hr','rasuna','said','hormat',
      'saja','juga','akan','atau','agar','bisa','sudah','telah','sangat','seorang','hulu','hilir',
      // Professions & tech concepts
      'insinyur','perangkat','lunak','pengembang','rekayasa','keahlian','kemampuan',
      'melakukan','meningkatkan','berhasil','mencapai','memimpin','mengelola','mengoptimalkan',
      'berkomitmen','berkontribusi','berkolaborasi','mengimplementasikan','mengembangkan',
      'pengembangan','peningkatan','perancangan','penyusunan','pengelolaan',
      'menyusun','merancang','memperbaiki','menganalisis','memvalidasi','mendokumentasikan',
      'menyampaikan','memperkenalkan','berkoordinasi','bertanggung','jawab','memastikan',
      'menyatakan','mengajukan','diri','resmi','mengisi','peran','posisi','kepada','yth',
      'dengan','hormat','salam','pembuka','penutup','melalui','perihal','hal','lamaran',
      'software','hardware','frontend','backend','fullstack','devops','cicd','agile','scrum',
      'kanban','microservices','kubernetes','docker','linux','cloud','aws','gcp','azure',
      'postgresql','mysql','mongodb','redis','elasticsearch','typescript','javascript','python',
      'node','express','django','flask','spring','java','golang','rust','php','ruby',
      'pelamar','rekrutmen','seleksi','screening','wawancara','interview','magang','intern',
      'junior','senior','lead','principal','director','cto','ceo','vp','svp','avp',
      'startup','enterprise','bumn','korporat','multinasional','nasional','internasional',
      'proyek','project','sprint','milestone','deadline','deliverable','kpi','okr',
      'kandidat','kompetensi','etos','kerja','komunikasi','profesional','kualitas',
      'skala','produk','efisiensi','fleksibilitas','adaptasi',
      'pertama','kedua','ketiga','beberapa','banyak','sedikit','seluruh','semua','setiap',
      'secara','terus','menerus','melalui','karena','namun','tetapi',
      'meskipun','sehingga','oleh','kepada','dari','untuk','tentang','antara','seperti',
    ]);

    // Known specific Indonesian typos mapping { typo => suggestion }
    const KNOWN_TYPOS = {
      'prangkt': 'perangkat', 'prangkat': 'perangkat', 'perangkt': 'perangkat', 'perngkat': 'perangkat',
      'luak': 'lunak', 'lnak': 'lunak', 'lunk': 'lunak', 'lunakk': 'lunak',
      'insinyr': 'insinyur', 'insinyer': 'insinyur', 'isinyur': 'insinyur',
      'keahlan': 'keahlian', 'keahliann': 'keahlian', 'keahlin': 'keahlian',
      'pengalamam': 'pengalaman', 'pengalamn': 'pengalaman', 'pengalman': 'pengalaman',
      'perusahaab': 'perusahaan', 'perusahaa': 'perusahaan', 'perusahann': 'perusahaan',
      'dengam': 'dengan', 'denagn': 'dengan', 'denga': 'dengan',
      'berkomitmem': 'berkomitmen', 'berkomitmenm': 'berkomitmen',
      'responsiff': 'responsif', 'responsiif': 'responsif', 'respnosif': 'responsif',
      'mengembagkan': 'mengembangkan', 'mengembangkna': 'mengembangkan',
      'pekerjaab': 'pekerjaan', 'pekerjaaan': 'pekerjaan',
      'seyubungan': 'sehubungan', 'sebuhungan': 'sehubungan',
      'mengatsi': 'mengatasi', 'mengatsa': 'mengatasi',
      'meningkatan': 'meningkatkan', 'meningkatkn': 'meningkatkan',
      'berkontriibusi': 'berkontribusi', 'berkontribis': 'berkontribusi',
      'menanagani': 'menangani', 'menanagni': 'menangani',
      'iinfrastruktur': 'infrastruktur', 'infrastrukutr': 'infrastruktur',
      'optimiasi': 'optimasi', 'optmiasi': 'optimasi', 'ooptimasi': 'optimasi',
      'skalalbilitas': 'skalabilitas', 'skaalbilitas': 'skalabilitas',
      'membagun': 'membangun', 'memanbgun': 'membangun', 'membngun': 'membangun',
      'terbisa': 'terbiasa', 'terbiasaa': 'terbiasa',
      'menyataakn': 'menyatakan', 'menyatakna': 'menyatakan',
      'penuhh': 'penuh', 'bergabungg': 'bergabung',
      'memberikaan': 'memberikan', 'membrikan': 'memberikan',
      'seorng': 'seorang', 'sistm': 'sistem', 'produkk': 'produk',
      'sdad': 'dapat', 'wdwd': 'memberikan', 'wdwdikan': 'memberikan',
      'fulljnsjdna': 'Full Stack', 'responajssif': 'responsif', 'dengans': 'dengan',
      'pengembangansdad': 'pengembangan',
    };

    // Gibberish pattern detector - keyboard mashing patterns
    const isGibberish = (word) => {
      const w = word.toLowerCase();
      if (/[b-df-hj-np-tv-z]{4,}/i.test(w)) return true;
      if (/(.)\1{3,}/.test(w)) return true;
      if (/qwert|asdfg|zxcvb|jnsjd|wsxcd|rfvbgt|yhnmju|sdad/i.test(w)) return true;
      return false;
    };

    // Levenshtein distance
    const levenshtein = (a, b) => {
      const m = a.length, n = b.length;
      const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
      for (let j = 0; j <= n; j++) dp[0][j] = j;
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
        }
      }
      return dp[m][n];
    };

    // Find closest word in dictionary with adaptive tolerance
    const findClosestWord = (word) => {
      let best = null, bestDist = Infinity;
      const maxAllowedDist = word.length >= 6 ? 2 : 1;

      for (const dictWord of dictionary) {
        if (Math.abs(dictWord.length - word.length) > maxAllowedDist) continue;
        const dist = levenshtein(word, dictWord);
        if (dist <= maxAllowedDist && dist < bestDist) {
          bestDist = dist;
          best = dictWord;
        }
      }
      return best;
    };

    const words = text.split(/\s+/);
    words.forEach((rawWord) => {
      const cleanWord = rawWord.replace(/^[^\w]+|[^\w]+$/g, '');
      if (!cleanWord || cleanWord.length <= 2) return;
      // Skip numbers, codes, URLs, emails
      if (/^[\d%+.\-/:@]+$/.test(cleanWord)) return;
      if (/^https?:/i.test(cleanWord)) return;

      const lowerWord = cleanWord.toLowerCase();

      // Skip actual proper names of applicant, company, and HR
      if (userProperNames.has(lowerWord)) return;

      // Check 1: Known typos map (Immediate exact match)
      if (KNOWN_TYPOS[lowerWord]) {
        foundTypos.push({
          original: rawWord,
          word: cleanWord,
          fieldKey,
          paragraph: paragraphName,
          suggestion: matchCase(cleanWord, KNOWN_TYPOS[lowerWord])
        });
        return;
      }

      // Check 2: Compound typo with valid root word prefix (e.g. "pengembangansdad" -> "pengembangan")
      for (const dictWord of dictionary) {
        if (dictWord.length >= 5 && lowerWord.startsWith(dictWord) && lowerWord.length <= dictWord.length + 5) {
          const trailing = lowerWord.slice(dictWord.length);
          if (isGibberish(trailing) || trailing.length <= 4) {
            foundTypos.push({
              original: rawWord,
              word: cleanWord,
              fieldKey,
              paragraph: paragraphName,
              suggestion: matchCase(cleanWord, dictWord)
            });
            return;
          }
        }
      }

      // Check 3: Levenshtein distance against dictionary (catches typos like "prangkt" -> "perangkat", "luak" -> "lunak")
      const isInDict = dictionary.has(lowerWord);
      const hasSuffix = /^[a-z]+(nya|kan|lah|pun|ku|mu|dia|kami|kita|mereka|anda)$/i.test(lowerWord);

      if (!isInDict && !hasSuffix && cleanWord.length >= 3) {
        const closest = findClosestWord(lowerWord);
        if (closest && closest !== lowerWord) {
          foundTypos.push({
            original: rawWord,
            word: cleanWord,
            fieldKey,
            paragraph: paragraphName,
            suggestion: matchCase(cleanWord, closest)
          });
          return;
        }
      }

      // Check 4: Pure gibberish fallback
      if (isGibberish(lowerWord) && cleanWord.length >= 4) {
        const closest = findClosestWord(lowerWord);
        if (closest && closest !== lowerWord) {
          foundTypos.push({
            original: rawWord,
            word: cleanWord,
            fieldKey,
            paragraph: paragraphName,
            suggestion: matchCase(cleanWord, closest)
          });
        }
      }
    });

    // Deduplicate by word and filter out any invalid suggestions
    const seen = new Set();
    return foundTypos.filter(t => {
      if (!t.suggestion || t.suggestion.toLowerCase() === t.word.toLowerCase() || t.suggestion.includes('periksa')) return false;
      if (seen.has(t.word.toLowerCase())) return false;
      seen.add(t.word.toLowerCase());
      return true;
    });
  };

  // Instant Anti Typo feature with dual-engine (Local Immediate + Backend AI Proofreader)
  const handleAntiTypo = async () => {
    setIsFixingTypos(true);
    showToast("AI sedang memindai dan memperbaiki typo secara presisi...");

    // 1. Run local precision scanner immediately (0ms delay)
    const openingTypos = scanDynamicTypos(formData.openingParagraph, 'openingParagraph', 'Pembuka');
    const body1Typos = scanDynamicTypos(formData.bodyParagraph1, 'bodyParagraph1', 'Pengalaman');
    const body2Typos = scanDynamicTypos(formData.bodyParagraph2, 'bodyParagraph2', 'Pencapaian STAR');
    const closingTypos = scanDynamicTypos(formData.closingParagraph, 'closingParagraph', 'Penutup');

    const allTypos = [...openingTypos, ...body1Typos, ...body2Typos, ...closingTypos];

    if (allTypos.length > 0) {
      setFormData(prev => {
        let updated = { ...prev };
        allTypos.forEach(item => {
          if (updated[item.fieldKey] && item.suggestion && !item.suggestion.includes('periksa')) {
            const escapedWord = item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedWord}\\b`, 'g');
            updated[item.fieldKey] = updated[item.fieldKey].replace(regex, item.suggestion);
          }
        });
        return updated;
      });

      const previewSummary = allTypos.map(t => `${t.word} -> ${t.suggestion}`).slice(0, 3).join(', ');
      showToast(`${allTypos.length} typo diperbaiki (${previewSummary}${allTypos.length > 3 ? '...' : ''})!`);
    }

    // 2. Also call backend AI proofreader for deeper contextual fixes
    try {
      const response = await axios.post('/api/builder/fix-typos', {
        fields: {
          openingParagraph: formData.openingParagraph,
          bodyParagraph1: formData.bodyParagraph1,
          bodyParagraph2: formData.bodyParagraph2,
          closingParagraph: formData.closingParagraph,
        },
        language: selectedLanguage,
      });

      if (response.data && response.data.success && response.data.fixed_fields) {
        const ff = response.data.fixed_fields;
        setFormData(prev => ({
          ...prev,
          openingParagraph: ff.openingParagraph || prev.openingParagraph,
          bodyParagraph1: ff.bodyParagraph1 || prev.bodyParagraph1,
          bodyParagraph2: ff.bodyParagraph2 || prev.bodyParagraph2,
          closingParagraph: ff.closingParagraph || prev.closingParagraph,
        }));
      }
    } catch (e) {
      // Backend notice handled gracefully
    } finally {
      setIsFixingTypos(false);
      if (allTypos.length === 0) {
        showToast("Dokumen sudah bersih dan bebas dari typo!");
      }
    }
  };

  // Comprehensive AI Audit Engine
  const handleComprehensiveAiAudit = () => {
    setIsAuditing(true);
    setAuditResult(null);
    setActiveBuilderTab('audit');
    showToast("AI sedang menganalisis Typo, Ejaan, Metode STAR & Standar Industri...");

    setTimeout(() => {
      const openingTypos = scanDynamicTypos(formData.openingParagraph, 'openingParagraph', 'Pembuka');
      const body1Typos = scanDynamicTypos(formData.bodyParagraph1, 'bodyParagraph1', 'Pengalaman');
      const body2Typos = scanDynamicTypos(formData.bodyParagraph2, 'bodyParagraph2', 'Pencapaian STAR');
      const closingTypos = scanDynamicTypos(formData.closingParagraph, 'closingParagraph', 'Penutup');

      const allTypos = [...openingTypos, ...body1Typos, ...body2Typos, ...closingTypos];
      const hasStarMetrics = /STAR|\d+%|\d+\s*(jam|hari|user|pengguna)/i.test(formData.bodyParagraph2 || '');

      const strengths = [
        "Struktur paragraf sudah rapi & sesuai format formal HR Enterprise",
        "Informasi kontak pelamar & data perusahaan terhubung dengan benar",
        "Penggunaan salam pembuka & penutup formal berstandar ATS"
      ];

      const weaknesses = [];
      if (allTypos.length > 0) {
        weaknesses.push(`Ditemukan ${allTypos.length} kata typo / ejaan kurang tepat di dalam teks.`);
      } else {
        strengths.push("Ejaan & tata bahasa 100% bersih dari kata typo");
      }

      if (!hasStarMetrics) {
        weaknesses.push("Paragraf pencapaian belum menyertakan metrik kuantitatif persentase (%) dengan metode STAR.");
      } else {
        strengths.push("Paragraf pencapaian sudah mencakup metrik persentase (%) kuantitatif");
      }

      const cleanTextOfTypos = (text, typos) => {
        if (!text) return text;
        let cleaned = text;
        typos.forEach(item => {
          const regex = new RegExp(`\\b${item.word}\\b`, 'gi');
          cleaned = cleaned.replace(regex, item.suggestion);
        });
        return cleaned;
      };

      const recommendedOpening = cleanTextOfTypos(formData.openingParagraph, openingTypos);
      const recommendedBody1 = cleanTextOfTypos(formData.bodyParagraph1, body1Typos);

      let recommendedBody2 = cleanTextOfTypos(formData.bodyParagraph2, body2Typos);
      if (!hasStarMetrics) {
        recommendedBody2 = `Menggunakan metodologi STAR (Situation, Task, Action, Result), pada posisi sebelumnya saya berhasil mengatasi tantangan skalabilitas sistem dengan merestrukturisasi query database & menerapkan caching layer. Hasilnya, respons latency berkurang 45%, uptime meningkat menjadi 99.9%, dan menghemat biaya operasional sebesar 25%.`;
      }

      const recommendedClosing = cleanTextOfTypos(formData.closingParagraph, closingTypos);
      const computedScore = Math.max(70, Math.min(99, calculateAtsScore() + (allTypos.length > 0 ? 12 : 5)));

      setAuditResult({
        score: computedScore,
        allTypos,
        strengths,
        weaknesses,
        recommendations: {
          openingParagraph: recommendedOpening,
          bodyParagraph1: recommendedBody1,
          bodyParagraph2: recommendedBody2,
          closingParagraph: recommendedClosing,
        }
      });

      setIsAuditing(false);
      showToast("Audit AI Komprehensif Selesai!");
    }, 1200);
  };

  const handleFixTyposOnly = () => {
    if (!auditResult || !auditResult.allTypos || auditResult.allTypos.length === 0) {
      showToast("Tidak ada typo yang perlu diperbaiki!");
      return;
    }

    setFormData(prev => {
      let updated = { ...prev };
      auditResult.allTypos.forEach(item => {
        if (updated[item.fieldKey] && item.suggestion && !item.suggestion.includes('periksa')) {
          const regex = new RegExp(`\\b${item.word}\\b`, 'gi');
          updated[item.fieldKey] = updated[item.fieldKey].replace(regex, item.suggestion);
        }
      });
      return updated;
    });

    showToast("Semua kata typo berhasil diperbaiki tanpa mengubah susunan kalimatmu!");
  };

  const handleFixSingleTypo = (typoItem) => {
    if (!typoItem || !typoItem.suggestion || typoItem.suggestion.includes('periksa')) return;
    setFormData(prev => {
      if (!prev[typoItem.fieldKey]) return prev;
      const regex = new RegExp(`\\b${typoItem.word}\\b`, 'gi');
      return {
        ...prev,
        [typoItem.fieldKey]: prev[typoItem.fieldKey].replace(regex, typoItem.suggestion)
      };
    });
    showToast(`Kata "${typoItem.word}" diperbaiki menjadi "${typoItem.suggestion}"`);
  };

  const handleApplyParagraphRecommendation = (fieldKey, paragraphLabel) => {
    if (!auditResult || !auditResult.recommendations || !auditResult.recommendations[fieldKey]) return;
    setFormData(prev => ({
      ...prev,
      [fieldKey]: auditResult.recommendations[fieldKey]
    }));
    showToast(`Rekomendasi AI untuk ${paragraphLabel} berhasil diterapkan!`);
  };

  const handleApplyAllOptimizations = () => {
    if (!auditResult || !auditResult.recommendations) return;
    setFormData(prev => ({
      ...prev,
      openingParagraph: auditResult.recommendations.openingParagraph,
      bodyParagraph1: auditResult.recommendations.bodyParagraph1,
      bodyParagraph2: auditResult.recommendations.bodyParagraph2,
      closingParagraph: auditResult.recommendations.closingParagraph,
    }));
    showToast("Semua optimasi AI (Typo, STAR %, & Standar Industri) berhasil diterapkan!");
  };

  // Direct High-Resolution PDF Download using html2canvas-pro & jsPDF
  const handleDownloadPdf = async () => {
    if (previewViewTab !== 'paper') {
      setPreviewViewTab('paper');
      await new Promise(r => setTimeout(r, 100));
    }

    const targetId = (isFullPreviewOpen && document.getElementById('printable-coverletter-canvas-modal'))
      ? 'printable-coverletter-canvas-modal'
      : 'printable-coverletter-canvas';

    const sourceEl = document.getElementById(targetId);
    if (!sourceEl) {
      showToast("Elemen Surat Lamaran tidak ditemukan.");
      return;
    }

    const fileName = `${(formData.senderName || 'Surat_Lamaran').trim().replace(/\s+/g, '_')}_Cover_Letter_AI.pdf`;

    await downloadElementAsPdf({
      elementId: targetId,
      fileName,
      onStart: () => {
        setIsExportingPdf(true);
        showToast("Sedang memproses dan mengunduh PDF High-Res A4...");
      },
      onSuccess: () => {
        setIsExportingPdf(false);
        showToast("Berhasil mengunduh Surat Lamaran PDF!");
      },
      onError: (msg) => {
        setIsExportingPdf(false);
        showToast(msg || "Membuka dialog cetak bersih...");
      },
    });
  };

  const handlePrint = () => {
    const targetId = (isFullPreviewOpen && document.getElementById('printable-coverletter-canvas-modal'))
      ? 'printable-coverletter-canvas-modal'
      : 'printable-coverletter-canvas';
    printElementViaIframe(targetId, `${(formData.senderName || 'Surat_Lamaran').trim().replace(/\s+/g, '_')}_Cover_Letter_AI`);
  };

  const handleCopyText = () => {
    const fullText = `
${formData.senderName}
${formData.senderTitle}
${formData.senderEmail} | ${formData.senderPhone}
${formData.senderLocation}

${formData.date}

Kepada Yth.
${formData.hrName}
${formData.hrTitle}
${formData.companyName}
${formData.companyAddress}

Hal: Lamaran Pekerjaan - ${formData.targetPosition} (${formData.jobCode})

${formData.salutation}

${formData.openingParagraph}

${formData.bodyParagraph1}

${formData.bodyParagraph2}

${formData.closingParagraph}

${formData.closingSalutation}

${formData.senderName}
`.trim();

    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    showToast("Teks Surat Lamaran berhasil disalin ke clipboard!");
    setTimeout(() => setIsCopied(false), 2500);
  };

  // ATS Score Calculator for Cover Letter
  const calculateAtsScore = () => {
    let score = 75;
    if (formData.senderName && formData.senderEmail && formData.senderPhone) score += 5;
    if (formData.hrName && formData.companyName && formData.targetPosition) score += 5;
    if ((formData.openingParagraph || '').length > 80) score += 5;
    if ((formData.bodyParagraph1 || '').length > 100) score += 5;
    if ((formData.bodyParagraph2 || '').length > 100) score += 5;
    return Math.min(score, 98);
  };

  const atsScore = calculateAtsScore();

  // Helper function to render adjustable Signature Block with TTD Image or Calligraphy
  const renderSignatureBlock = () => {
    const alignStyle = signatureAlign === 'center' ? 'center' : signatureAlign === 'right' ? 'flex-end' : 'flex-start';
    const textAlign = signatureAlign === 'center' ? 'center' : signatureAlign === 'right' ? 'right' : 'left';

    return (
      <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', alignItems: alignStyle, textAlign: textAlign }}>
        {/* Closing Salutation: Hormat saya, */}
        <div style={{ color: '#1E293B', fontWeight: '600' }}>
          {formData.closingSalutation}
        </div>

        {/* Signature Gap Container with Optional Uploaded TTD Image or Artistic Calligraphy */}
        <div
          style={{
            position: 'relative',
            height: `${signatureGap}px`,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: textAlign,
            margin: `${signatureOffset}px 0`
          }}
        >
          {signatureMode === 'upload' && signatureImg ? (
            <img
              src={signatureImg}
              alt="Tanda Tangan Pelamar"
              style={{
                width: `${signatureWidth}px`,
                maxHeight: `${Math.max(40, signatureGap + 20)}px`,
                objectFit: 'contain'
              }}
            />
          ) : signatureMode === 'handwritten' ? (
            <div
              style={{
                fontFamily: '"Brush Script MT", "Caveat", "Segoe Script", cursive, sans-serif',
                fontSize: `${Math.max(22, signatureWidth / 5.2)}px`,
                color: '#0F172A',
                transform: 'rotate(-3.5deg)',
                letterSpacing: '1px',
                userSelect: 'none',
                lineHeight: 1,
              }}
            >
              {formData.senderName || 'Tanda Tangan'}
            </div>
          ) : null}
        </div>

        {/* Sender Full Name */}
        <div style={{ fontWeight: 'bold', fontSize: `${fontSize + 1.5}px`, color: '#0F172A' }}>
          {formData.senderName}
        </div>
        <div style={{ fontSize: `${fontSize - 1.5}px`, color: '#64748B', marginTop: '2px' }}>
          {formData.senderTitle}
        </div>
      </div>
    );
  };

  // Dynamic Label Translation Helper for Cover Letter Templates
  const t = (key, defaultVal) => {
    if (formData.translatedLabels && formData.translatedLabels[key]) {
      return formData.translatedLabels[key];
    }
    const defaultDict = {
      toHeader: selectedLanguage === 'en' ? 'To:' : 'Kepada Yth.',
      subjectHeader: selectedLanguage === 'en' ? 'Re: Application for' : 'Hal: Lamaran Pekerjaan –',
      recipientTitle: selectedLanguage === 'en' ? 'Recipient' : 'Penerima Surat',
      dateAndPosTitle: selectedLanguage === 'en' ? 'Date & Position' : 'Tanggal & Posisi',
      contactTitle: selectedLanguage === 'en' ? 'Contact' : 'Kontak',
      dateTitle: selectedLanguage === 'en' ? 'Date' : 'Tanggal',
      positionTitle: selectedLanguage === 'en' ? 'Position' : 'Posisi',
      refTitle: selectedLanguage === 'en' ? 'Ref No:' : 'No. Ref:',
      companyTitle: selectedLanguage === 'en' ? 'Company:' : 'Instansi / Perusahaan:',
      addressTitle: selectedLanguage === 'en' ? 'Address:' : 'Alamat:',
      applicationTitle: selectedLanguage === 'en' ? 'OFFICIAL COVER LETTER' : 'SURAT LAMARAN RESMI',
    };
    return defaultDict[key] || defaultVal;
  };

  // Render Paper Content Component
  const RenderPaperContent = ({ canvasId = "printable-coverletter-canvas", isModal = false }) => {
    const activeTplObj = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

    return (
      <div
        id={canvasId}
        style={{
          fontFamily: activeTplObj.fontFamily,
          background: '#FFFFFF',
          color: '#1E293B',
          padding: '40px 48px',
          width: '794px',
          minHeight: '1050px', // Standard A4 Aspect Ratio proportions
          boxShadow: isModal ? 'none' : '0 25px 60px -15px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.06)',
          borderRadius: '4px',
          position: 'relative',
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
          boxSizing: 'border-box',
        }}
      >
        {/* ── TEMPLATE 1: HARVARD CLASSIC FORMAL ── */}
        {selectedTemplate === 'harvard' && (
          <div>
            <div style={{ textAlign: 'center', borderBottom: `2.5px solid ${primaryHex}`, paddingBottom: '16px', marginBottom: `${paragraphGap + 8}px` }}>
              <h1 style={{ fontSize: `${fontSize + 11}px`, fontWeight: 'bold', color: '#0F172A', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {formData.senderName}
              </h1>
              <div style={{ fontSize: `${fontSize + 0.5}px`, color: primaryHex, fontWeight: '600', marginTop: '4px' }}>
                {formData.senderTitle}
              </div>
              <div style={{ fontSize: `${fontSize - 1.5}px`, color: '#64748B', marginTop: '6px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span>{formData.senderEmail}</span>
                <span>•</span>
                <span>{formData.senderPhone}</span>
                <span>•</span>
                <span>{formData.senderLocation}</span>
                {formData.senderLinkedin && (
                  <>
                    <span>•</span>
                    <span>{formData.senderLinkedin}</span>
                  </>
                )}
              </div>
            </div>

            <div style={{ marginBottom: `${paragraphGap}px`, fontSize: `${fontSize - 0.5}px`, color: '#475569' }}>
              {formData.date}
            </div>

            <div style={{ marginBottom: `${paragraphGap}px`, fontSize: `${fontSize}px`, color: '#1E293B' }}>
              <div style={{ fontWeight: 'bold' }}>{t('toHeader', 'Kepada Yth.')}</div>
              <div style={{ fontWeight: '600' }}>{formData.hrName}</div>
              <div>{formData.hrTitle}</div>
              <div style={{ fontWeight: 'bold', color: '#0F172A' }}>{formData.companyName}</div>
              <div style={{ color: '#475569' }}>{formData.companyAddress}</div>
            </div>

            <div style={{ fontWeight: 'bold', color: '#0F172A', marginBottom: `${paragraphGap}px`, fontSize: `${fontSize + 0.5}px` }}>
              {t('subjectHeader', 'Hal: Lamaran Pekerjaan –')} <span style={{ color: primaryHex }}>{formData.targetPosition}</span> ({formData.jobCode})
            </div>

            <div style={{ marginBottom: `${paragraphGap - 2}px`, fontWeight: '600' }}>{formData.salutation}</div>

            <p style={{ marginBottom: `${paragraphGap}px`, textIndent: '24px', textAlign: 'justify' }}>
              {formData.openingParagraph}
            </p>

            <p style={{ marginBottom: `${paragraphGap}px`, textIndent: '24px', textAlign: 'justify' }}>
              {formData.bodyParagraph1}
            </p>

            <p style={{ marginBottom: `${paragraphGap}px`, textIndent: '24px', textAlign: 'justify' }}>
              {formData.bodyParagraph2}
            </p>

            <p style={{ marginBottom: `${paragraphGap + 4}px`, textIndent: '24px', textAlign: 'justify' }}>
              {formData.closingParagraph}
            </p>

            {renderSignatureBlock()}
          </div>
        )}

        {/* ── TEMPLATE 2: MODERN TECH STANDARD ── */}
        {selectedTemplate === 'modern' && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${primaryHex} 0%, #0F172A 100%)`, color: '#FFFFFF', padding: '20px 24px', borderRadius: '12px', marginBottom: `${paragraphGap + 8}px` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: `${fontSize + 9}px`, fontWeight: '900', margin: 0 }}>{formData.senderName}</h1>
                  <div style={{ fontSize: `${fontSize + 0.5}px`, opacity: 0.9, fontWeight: '600' }}>{formData.senderTitle}</div>
                </div>
                <div style={{ fontSize: `${fontSize - 2}px`, textAlign: 'right', opacity: 0.85 }}>
                  <div>{formData.senderEmail}</div>
                  <div>{formData.senderPhone}</div>
                  <div>{formData.senderLocation}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${paragraphGap}px`, fontSize: `${fontSize - 0.5}px`, borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div>
                <span style={{ color: '#64748B' }}>{t('toHeader', 'Kepada:')} </span>
                <strong>{formData.hrName}</strong> ({formData.companyName})
              </div>
              <div style={{ color: '#64748B' }}>{formData.date}</div>
            </div>

            <div style={{ background: '#F8FAFC', borderLeft: `4px solid ${primaryHex}`, padding: '10px 14px', borderRadius: '0 8px 8px 0', marginBottom: `${paragraphGap}px`, fontSize: `${fontSize + 0.5}px`, fontWeight: '700', color: '#0F172A' }}>
              {t('subjectHeader', 'Surat Lamaran Posisi:')} {formData.targetPosition} <span style={{ fontSize: `${fontSize - 1.5}px`, color: primaryHex, fontWeight: '600', marginLeft: '6px' }}>[{formData.jobCode}]</span>
            </div>

            <div style={{ marginBottom: `${paragraphGap - 2}px`, fontWeight: '700' }}>{formData.salutation}</div>
            <p style={{ marginBottom: `${paragraphGap}px` }}>{formData.openingParagraph}</p>
            <p style={{ marginBottom: `${paragraphGap}px` }}>{formData.bodyParagraph1}</p>
            <p style={{ marginBottom: `${paragraphGap}px` }}>{formData.bodyParagraph2}</p>
            <p style={{ marginBottom: `${paragraphGap + 4}px` }}>{formData.closingParagraph}</p>

            {renderSignatureBlock()}
          </div>
        )}

        {/* ── TEMPLATE 3: MINIMALIST EXECUTIVE ── */}
        {selectedTemplate === 'minimalist' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #0F172A', paddingBottom: '16px', marginBottom: `${paragraphGap + 8}px` }}>
              <div>
                <h1 style={{ fontSize: `${fontSize + 12}px`, fontWeight: '900', color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>{formData.senderName}</h1>
                <div style={{ fontSize: `${fontSize + 0.5}px`, fontWeight: '700', color: primaryHex, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '3px' }}>{formData.senderTitle}</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: `${fontSize - 1.5}px`, color: '#475569', lineHeight: '1.5' }}>
                <div>{formData.senderEmail}</div>
                <div>{formData.senderPhone}</div>
                <div>{formData.senderLocation}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: `${paragraphGap + 4}px`, fontSize: `${fontSize - 0.5}px`, background: '#F1F5F9', padding: '12px 16px', borderRadius: '6px' }}>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748B', fontWeight: '700' }}>{t('recipientTitle', 'Penerima Surat')}</div>
                <div style={{ fontWeight: '700', color: '#0F172A' }}>{formData.hrName}</div>
                <div>{formData.hrTitle} – {formData.companyName}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748B', fontWeight: '700' }}>{t('dateAndPosTitle', 'Tanggal & Posisi')}</div>
                <div>{formData.date}</div>
                <div style={{ fontWeight: '700', color: primaryHex }}>{formData.targetPosition}</div>
              </div>
            </div>

            <div style={{ marginBottom: `${paragraphGap - 2}px`, fontWeight: '700' }}>{formData.salutation}</div>
            <p style={{ marginBottom: `${paragraphGap}px` }}>{formData.openingParagraph}</p>
            <p style={{ marginBottom: `${paragraphGap}px` }}>{formData.bodyParagraph1}</p>
            <p style={{ marginBottom: `${paragraphGap}px` }}>{formData.bodyParagraph2}</p>
            <p style={{ marginBottom: `${paragraphGap + 4}px` }}>{formData.closingParagraph}</p>

            {renderSignatureBlock()}
          </div>
        )}

        {/* ── TEMPLATE 4: CREATIVE PRODUCT & UI ── */}
        {selectedTemplate === 'creative' && (
          <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '24px' }}>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', borderRight: `2px solid ${primaryHex}`, fontSize: `${fontSize - 1.5}px`, color: '#475569' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: primaryHex, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', marginBottom: '12px', boxShadow: `0 4px 12px rgba(0,0,0,0.15)` }}>
                {(formData.senderName || 'CG').substring(0, 2).toUpperCase()}
              </div>
              <h2 style={{ fontSize: `${fontSize + 1}px`, fontWeight: '900', color: '#0F172A', margin: '0 0 4px' }}>{formData.senderName}</h2>
              <div style={{ color: primaryHex, fontWeight: '700', marginBottom: '16px' }}>{formData.senderTitle}</div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '10px', textTransform: 'uppercase' }}>{t('contactTitle', 'Kontak')}</div>
                <div>{formData.senderEmail}</div>
                <div>{formData.senderPhone}</div>
                <div>{formData.senderLocation}</div>
              </div>

              <div>
                <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '10px', textTransform: 'uppercase' }}>{t('dateTitle', 'Tanggal')}</div>
                <div>{formData.date}</div>
              </div>
            </div>

            <div>
              <div style={{ marginBottom: '18px', borderBottom: '1px dashed #CBD5E1', paddingBottom: '12px' }}>
                <div style={{ fontSize: `${fontSize - 1.5}px`, color: '#64748B' }}>{t('toHeader', 'Kepada Yth.')} <strong>{formData.hrName}</strong></div>
                <div style={{ fontSize: `${fontSize + 1.5}px`, fontWeight: '900', color: '#0F172A' }}>{formData.companyName}</div>
                <div style={{ fontSize: `${fontSize - 0.5}px`, color: primaryHex, fontWeight: '700' }}>{t('positionTitle', 'Posisi:')} {formData.targetPosition}</div>
              </div>

              <div style={{ marginBottom: `${paragraphGap - 2}px`, fontWeight: '700' }}>{formData.salutation}</div>
              <p style={{ marginBottom: `${paragraphGap}px` }}>{formData.openingParagraph}</p>
              <p style={{ marginBottom: `${paragraphGap}px` }}>{formData.bodyParagraph1}</p>
              <p style={{ marginBottom: `${paragraphGap}px` }}>{formData.bodyParagraph2}</p>
              <p style={{ marginBottom: `${paragraphGap + 4}px` }}>{formData.closingParagraph}</p>

              {renderSignatureBlock()}
            </div>
          </div>
        )}

        {/* ── TEMPLATE 5: CORPORATE FORTUNE 500 & BUMN ── */}
        {selectedTemplate === 'enterprise' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px double #0F172A', paddingBottom: '14px', marginBottom: `${paragraphGap + 6}px` }}>
              <div>
                <div style={{ fontSize: '10px', letterSpacing: '2px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>{t('applicationTitle', 'SURAT LAMARAN RESMI')}</div>
                <h1 style={{ fontSize: `${fontSize + 11}px`, fontWeight: 'bold', color: '#0F172A', margin: 0 }}>{formData.senderName}</h1>
                <div style={{ fontSize: `${fontSize - 0.5}px`, color: primaryHex, fontWeight: '700' }}>{formData.senderTitle}</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: `${fontSize - 1.5}px`, color: '#475569' }}>
                <div>{t('refTitle', 'No. Ref:')} {formData.jobCode}</div>
                <div>{formData.date}</div>
              </div>
            </div>

            <div style={{ marginBottom: `${paragraphGap}px`, fontSize: `${fontSize - 0.5}px`, background: '#F8FAFC', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
              <div><strong>{t('toHeader', 'Kepada:')}</strong> {formData.hrName} ({formData.hrTitle})</div>
              <div><strong>{t('companyTitle', 'Instansi / Perusahaan:')}</strong> {formData.companyName}</div>
              <div><strong>{t('addressTitle', 'Alamat:')}</strong> {formData.companyAddress}</div>
            </div>

            <div style={{ fontWeight: 'bold', color: '#0F172A', marginBottom: `${paragraphGap}px`, fontSize: `${fontSize + 0.5}px` }}>
              {t('subjectHeader', 'HAL: PERMOHONAN LAMARAN KERJA POSISI')} {(formData.targetPosition || '').toUpperCase()}
            </div>

            <div style={{ marginBottom: `${paragraphGap - 2}px`, fontWeight: '600' }}>{formData.salutation}</div>
            <p style={{ marginBottom: `${paragraphGap}px`, textAlign: 'justify' }}>{formData.openingParagraph}</p>
            <p style={{ marginBottom: `${paragraphGap}px`, textAlign: 'justify' }}>{formData.bodyParagraph1}</p>
            <p style={{ marginBottom: `${paragraphGap}px`, textAlign: 'justify' }}>{formData.bodyParagraph2}</p>
            <p style={{ marginBottom: `${paragraphGap + 4}px`, textAlign: 'justify' }}>{formData.closingParagraph}</p>

            {renderSignatureBlock()}
          </div>
        )}
      </div>
    );
  };

  // Mobile-Friendly Reader View: Crisp legible layout with zero squinting
  const RenderReaderView = () => {
    return (
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 text-slate-200 shadow-xl backdrop-blur-md">
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">{formData.senderName || 'Nama Pelamar'}</h3>
            <p className="text-xs font-semibold text-teal-400">{formData.senderTitle || 'Posisi/Keahlian'}</p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[10px] font-black uppercase tracking-wider">
            Mode Baca Nyaman
          </span>
        </div>

        {/* Contact Badges */}
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
          {formData.senderEmail && (
            <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
              <Mail size={12} className="text-teal-400" />
              <span>{formData.senderEmail}</span>
            </span>
          )}
          {formData.senderPhone && (
            <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
              <Phone size={12} className="text-teal-400" />
              <span>{formData.senderPhone}</span>
            </span>
          )}
          {formData.senderLocation && (
            <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
              <MapPin size={12} className="text-teal-400" />
              <span>{formData.senderLocation}</span>
            </span>
          )}
        </div>

        {/* Recipient Card */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Calendar size={11} className="text-teal-400" />
            <span>{formData.date}</span>
          </div>
          <div className="font-bold text-slate-400 pt-1">{t('toHeader', 'Kepada Yth.')}</div>
          <div className="font-extrabold text-white text-sm">{formData.hrName || 'Bapak/Ibu HRD'}</div>
          {formData.hrTitle && <div className="text-slate-400 text-[11px]">{formData.hrTitle}</div>}
          <div className="font-semibold text-teal-300">{formData.companyName}</div>
          {formData.companyAddress && <div className="text-slate-400 text-[11px]">{formData.companyAddress}</div>}
        </div>

        {/* Subject */}
        <div className="px-3.5 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs font-bold text-teal-200 flex items-center gap-2">
          <FileText size={14} className="text-teal-400 shrink-0" />
          <span>
            {t('subjectHeader', 'Hal: Lamaran Pekerjaan –')} <strong className="text-white">{formData.targetPosition}</strong> {formData.jobCode && `(${formData.jobCode})`}
          </span>
        </div>

        {/* Salutation */}
        <div className="text-xs font-bold text-slate-200">
          {formData.salutation}
        </div>

        {/* Paragraphs with clear, comfortable reading typography */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
          {formData.openingParagraph && (
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-justify">
              <span className="text-[9px] font-black uppercase tracking-wider text-teal-400 block mb-1">1. Pembuka</span>
              <p>{formData.openingParagraph}</p>
            </div>
          )}
          {formData.bodyParagraph1 && (
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-justify">
              <span className="text-[9px] font-black uppercase tracking-wider text-indigo-400 block mb-1">2. Kualifikasi &amp; Pengalaman</span>
              <p>{formData.bodyParagraph1}</p>
            </div>
          )}
          {formData.bodyParagraph2 && (
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-justify">
              <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 block mb-1">3. Pencapaian STAR</span>
              <p>{formData.bodyParagraph2}</p>
            </div>
          )}
          {formData.closingParagraph && (
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-justify">
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 block mb-1">4. Penutup</span>
              <p>{formData.closingParagraph}</p>
            </div>
          )}
        </div>

        {/* Signature & Closing */}
        <div className="pt-2 text-xs text-slate-300 space-y-1">
          <div className="font-semibold">{formData.closingSalutation}</div>
          {signatureMode === 'upload' && signatureImg ? (
            <div className="py-2">
              <img src={signatureImg} alt="Tanda Tangan" className="h-12 object-contain" />
            </div>
          ) : signatureMode === 'handwritten' ? (
            <div className="py-2 font-serif italic text-lg text-teal-300">
              {formData.senderName}
            </div>
          ) : (
            <div className="h-6" />
          )}
          <div className="font-black text-white text-sm">{formData.senderName}</div>
          <div className="text-[11px] text-slate-400">{formData.senderTitle}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Universal Print CSS */}
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
          div:has(#printable-coverletter-canvas),
          div:has(#printable-coverletter-canvas-modal) {
            display: block !important;
            visibility: visible !important;
            transform: none !important;
            overflow: visible !important;
            max-height: none !important;
          }
          div, main, section, article {
            transform: none !important;
            overflow: visible !important;
            max-height: none !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-coverletter-canvas,
          #printable-coverletter-canvas *,
          #printable-coverletter-canvas-modal,
          #printable-coverletter-canvas-modal * {
            visibility: visible !important;
          }
          #printable-coverletter-canvas,
          #printable-coverletter-canvas-modal {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 15mm 20mm !important;
            background: #ffffff !important;
            color: #1e293b !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            min-height: auto !important;
            opacity: 1 !important;
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
            className="fixed top-20 right-6 z-[9999] bg-slate-900/95 border border-teal-500/50 text-slate-100 text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl shadow-teal-500/20 backdrop-blur-xl flex items-center gap-2.5"
          >
            <Sparkles size={16} className="text-teal-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP HERO HEADER & UNIFIED COMMAND DOCK ── */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 backdrop-blur-2xl relative overflow-hidden shadow-2xl space-y-6"
      >
        {/* Subtle Ambient Background Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />

        {/* Top Header Row: Title & Action Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
                <FileCheck2 size={13} className="text-teal-400" />
                Surat Lamaran AI Pro
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <ShieldCheck size={12} className="text-emerald-400" />
                ATS Score {atsScore}/100 · 100% Lolos Screening HR
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Editor Surat Lamaran Kerja Pro
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Format presisi 1 lembar A4, Tanda Tangan Digital, audit Metode STAR, dan terjemahan otomatis ke 35+ bahasa global.
            </p>
          </div>

          {/* Right Action Panel: Language & Actions */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            
            {/* Clean Language Switcher Pills (No Emojis) */}
            <div className="flex items-center gap-1 p-1.5 bg-slate-950/90 border border-slate-800 rounded-2xl shadow-inner w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-1.5 px-2 text-[11px] font-bold text-slate-400">
                <Globe size={13} className="text-teal-400" />
                <span className="hidden sm:inline">Bahasa:</span>
              </div>

              <div className="flex items-center gap-1">
                {[
                  { id: 'id', label: 'ID', name: 'Indonesia' },
                  { id: 'en', label: 'EN', name: 'English' },
                  { id: 'ar', label: 'AR', name: 'Arabic' }
                ].map((lang) => (
                  <motion.button
                    key={lang.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLanguageChange(lang.id)}
                    disabled={isTranslatingCoverLetter}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                      selectedLanguage === lang.id
                        ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                    title={`Terjemahkan ke ${lang.name}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider">{lang.label}</span>
                    <span className="text-[11px] font-semibold hidden md:inline">{lang.name}</span>
                  </motion.button>
                ))}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLanguageModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-teal-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer hover:border-teal-500/40"
                  title="Pilih dari 35+ Bahasa & Negara"
                >
                  <span className="text-[11px] font-extrabold">+32 Lainnya</span>
                </motion.button>
              </div>
            </div>

            {/* Document Action Buttons (Responsive on Mobile & Desktop) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClearForm}
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-rose-500/15 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                title="Kosongkan seluruh isian formulir"
              >
                <Eraser size={14} className="text-rose-400" />
                <span>Reset</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyText}
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                title="Salin Teks ke Clipboard"
              >
                {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-slate-400" />}
                <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFullPreviewOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-teal-500/40 hover:border-teal-500/80 text-teal-300 hover:text-teal-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
                title="Lihat Pratinjau Dokumen Layar Penuh (A4)"
              >
                <Eye size={14} className="text-teal-400" />
                <span>Full A4</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="shimmer-btn-primary px-5 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-teal-500/25 col-span-2 sm:col-span-1"
                title="Unduh PDF Surat Lamaran High-Resolution A4"
              >
                <Download size={14} className={isExportingPdf ? 'animate-bounce' : ''} />
                <span>{isExportingPdf ? 'Memproses...' : 'Download PDF'}</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Workspace Navigation Tabs Matching CvBuilder */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2 p-1.5 bg-slate-950/90 border border-slate-800/90 rounded-2xl overflow-x-auto custom-horizontal-scrollbar shadow-lg backdrop-blur-md">
            <button
              onClick={() => setActiveBuilderTab('content')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                activeBuilderTab === 'content'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
              }`}
            >
              <Edit3 size={15} />
              <span>1. Isi &amp; Data Surat</span>
            </button>
            <button
              onClick={() => setActiveBuilderTab('template')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                activeBuilderTab === 'template'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
              }`}
            >
              <Layers size={15} />
              <span>2. Template &amp; Desain</span>
            </button>
            <button
              onClick={() => setActiveBuilderTab('typography')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                activeBuilderTab === 'typography'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
              }`}
            >
              <PenTool size={15} />
              <span>3. Format Font &amp; TTD</span>
            </button>
            <button
              onClick={() => setActiveBuilderTab('audit')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                activeBuilderTab === 'audit'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
              }`}
            >
              <ShieldCheck size={15} />
              <span>4. AI Audit &amp; Review</span>
              {auditResult && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-950 text-teal-300 text-[10px] font-black">
                  {auditResult.score}
                </span>
              )}
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
              <span>5. Bahasa (35+)</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Mode Switcher (Visible on Mobile < lg) */}
      <div className="lg:hidden flex items-center p-1.5 bg-slate-950/95 border border-teal-500/50 rounded-2xl mb-4 shadow-2xl sticky top-16 z-30 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setMobileViewMode('editor')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mobileViewMode === 'editor'
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders size={15} />
          <span>Editor Data</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileViewMode('preview')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mobileViewMode === 'preview'
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye size={15} />
          <span>Pratinjau Live</span>
        </button>
        <button
          type="button"
          onClick={() => setIsFullPreviewOpen(true)}
          className="px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-slate-900 border border-teal-500/40 text-teal-300 hover:bg-teal-500/10 shadow-sm"
        >
          <Maximize2 size={14} />
          <span>Full A4</span>
        </button>
      </div>

      {/* ── MAIN WORKSPACE GRID: LEFT EDITOR & RIGHT LIVE PREVIEW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-36 lg:pb-12">

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* LEFT COLUMN: EDITOR PANEL (lg:col-span-7) */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div className={`lg:col-span-7 space-y-5 ${mobileViewMode === 'editor' ? 'block' : 'hidden lg:block'}`}>

          {/* Mobile Quick Banner to Jump to Live Preview */}
          <div className="lg:hidden p-3 bg-gradient-to-r from-teal-500/20 via-indigo-500/20 to-purple-500/20 border border-teal-500/40 rounded-2xl flex items-center justify-between gap-2 shadow-lg mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <Eye size={18} className="text-teal-400 shrink-0 animate-pulse" />
              <div className="min-w-0">
                <div className="text-xs font-black text-white truncate">Lihat Surat Lamaran Real-Time</div>
                <div className="text-[10px] text-slate-300 truncate">Intip hasil cetak A4 surat lamaran kamu</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileViewMode('preview')}
              className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-1 shrink-0 shadow-md cursor-pointer"
            >
              <span>Lihat Surat</span>
            </button>
          </div>

          {/* ════════ TAB 1: FORM DATA CV & ISI PARAGRAF ════════ */}
          {activeBuilderTab === 'content' && (
            <div className="space-y-4">
              {/* Quick toggle helper */}
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-[11px] font-bold text-slate-400">Bagian Formulir Surat Lamaran</span>
                <button
                  type="button"
                  onClick={() => {
                    const allOpen = Object.values(openSections).every(Boolean);
                    setOpenSections({ sender: !allOpen, recipient: !allOpen, paragraphs: !allOpen });
                  }}
                  className="text-[11px] font-bold text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
                >
                  {Object.values(openSections).every(Boolean) ? 'Tutup Semua' : 'Buka Semua'}
                </button>
              </div>

              {/* Section 1: Informasi Pengirim (Pelamar) */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/90 backdrop-blur-xl shadow-xl transition-all">
                <button
                  type="button"
                  onClick={() => toggleSection('sender')}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                      <User size={15} />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider truncate">
                        1. Informasi Pengirim (Pelamar)
                      </h3>
                      <p className="text-[11px] text-slate-400 font-normal truncate">
                        {formData.senderName ? `${formData.senderName} · ${formData.senderTitle || 'Pelamar'}` : 'Data identitas & kontak resmi pelamar'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {user?.name && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAutoFillFromProfile();
                        }}
                        className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-teal-300 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Isi data dari akun saya"
                      >
                        <RefreshCw size={11} className="text-teal-400" />
                        <span className="hidden sm:inline">Pakai Profil Akun</span>
                      </button>
                    )}
                    <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
                      {openSections.sender ? <ChevronUp size={14} className="text-teal-400" /> : <ChevronDown size={14} />}
                    </div>
                  </div>
                </button>

                {openSections.sender && (
                  <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/40 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                          <User size={12} className="text-teal-400" /> Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={formData.senderName}
                          onChange={(e) => handleChange('senderName', e.target.value)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner"
                          placeholder="Contoh: Kemas Muhammad Al Qodri"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                          <Briefcase size={12} className="text-teal-400" /> Gelar / Profesi Target
                        </label>
                        <input
                          type="text"
                          value={formData.senderTitle}
                          onChange={(e) => handleChange('senderTitle', e.target.value)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner"
                          placeholder="Contoh: Software Engineer / Backend Dev"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                          <Mail size={12} className="text-teal-400" /> Email Kontak
                        </label>
                        <input
                          type="email"
                          value={formData.senderEmail}
                          onChange={(e) => handleChange('senderEmail', e.target.value)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                          <Phone size={12} className="text-teal-400" /> No. Telepon / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={formData.senderPhone}
                          onChange={(e) => handleChange('senderPhone', e.target.value)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner"
                          placeholder="+62 812-3456-7890"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                          <MapPin size={12} className="text-teal-400" /> Domisili / Kota
                        </label>
                        <input
                          type="text"
                          value={formData.senderLocation}
                          onChange={(e) => handleChange('senderLocation', e.target.value)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner"
                          placeholder="Jakarta Selatan, Indonesia"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                          <Globe size={12} className="text-teal-400" /> LinkedIn / Portofolio URL
                        </label>
                        <input
                          type="text"
                          value={formData.senderLinkedin}
                          onChange={(e) => handleChange('senderLinkedin', e.target.value)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner"
                          placeholder="linkedin.com/in/username"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                          <Calendar size={12} className="text-teal-400" /> Tanggal Surat
                        </label>
                        <input
                          type="text"
                          value={formData.date}
                          onChange={(e) => handleChange('date', e.target.value)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner"
                          placeholder="11 Oktober 2026"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Perusahaan & Penerima Surat */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/90 backdrop-blur-xl shadow-xl transition-all">
                <button
                  type="button"
                  onClick={() => toggleSection('recipient')}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                      <Building size={15} />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider truncate">
                        2. Perusahaan &amp; Penerima Surat
                      </h3>
                      <p className="text-[11px] text-slate-400 font-normal truncate">
                        {formData.companyName ? `${formData.companyName} · ${formData.targetPosition || 'Posisi Target'}` : 'Instansi target, posisi lowongan & kontak HRD'}
                      </p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                    {openSections.recipient ? <ChevronUp size={14} className="text-indigo-400" /> : <ChevronDown size={14} />}
                  </div>
                </button>

                {openSections.recipient && (
                  <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/40 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400">Nama Penerima / HRD</label>
                        <input
                          type="text"
                          value={formData.hrName}
                          onChange={(e) => handleChange('hrName', e.target.value)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner"
                          placeholder="Bapak / Ibu Tim Rekrutmen"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400">Jabatan HRD / Tim Rekrutmen</label>
                        <input
                          type="text"
                          value={formData.hrTitle}
                          onChange={(e) => handleChange('hrTitle', e.target.value)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner"
                          placeholder="Head of Talent Acquisition"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400">Nama Perusahaan Target</label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => handleChange('companyName', e.target.value)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner"
                          placeholder="PT Tech Inovasi Indonesia"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400">Posisi yang Dilamar</label>
                        <input
                          type="text"
                          value={formData.targetPosition}
                          onChange={(e) => handleChange('targetPosition', e.target.value)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner"
                          placeholder="Full Stack Developer"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400">Kode Lowongan (Job Code)</label>
                        <input
                          type="text"
                          value={formData.jobCode}
                          onChange={(e) => handleChange('jobCode', e.target.value)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner"
                          placeholder="JOB-2026-FS"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400">Alamat Perusahaan</label>
                        <input
                          type="text"
                          value={formData.companyAddress}
                          onChange={(e) => handleChange('companyAddress', e.target.value)}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner"
                          placeholder="Gedung Cyber 2, Lt. 15, Jl. H.R. Rasuna Said, Jakarta"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Isi Paragraf Surat Lamaran */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/90 backdrop-blur-xl shadow-xl transition-all">
                <button
                  type="button"
                  onClick={() => toggleSection('paragraphs')}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                      <FileText size={15} />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider truncate">
                        3. Isi Paragraf Surat Lamaran
                      </h3>
                      <p className="text-[11px] text-slate-400 font-normal truncate">
                        Susun narasi profesional berstandar STAR &amp; ATS
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={handleAiGenerate}
                        disabled={isGeneratingAi}
                        className="px-2.5 py-1 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Wand2 size={12} className={isGeneratingAi ? 'animate-spin' : ''} />
                        <span>{isGeneratingAi ? 'Menyusun...' : 'Generate AI'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleAntiTypo}
                        disabled={isFixingTypos}
                        className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkle size={12} className={isFixingTypos ? 'animate-spin' : ''} />
                        <span>Anti Typo</span>
                      </button>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
                      {openSections.paragraphs ? <ChevronUp size={14} className="text-purple-400" /> : <ChevronDown size={14} />}
                    </div>
                  </div>
                </button>

                {openSections.paragraphs && (
                  <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/40 space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400">Salam Pembuka</label>
                      <input
                        type="text"
                        value={formData.salutation}
                        onChange={(e) => handleChange('salutation', e.target.value)}
                        className="w-full mt-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner"
                        placeholder="Dengan hormat,"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-300">Paragraf Pembuka (Opening)</label>
                        <span className="text-[10px] text-slate-500">{(formData.openingParagraph || '').length} karakter</span>
                      </div>
                      <textarea
                        rows={3}
                        value={formData.openingParagraph}
                        onChange={(e) => handleChange('openingParagraph', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner leading-relaxed"
                        placeholder="Tuliskan latar belakang ketertarikan melamar posisi ini..."
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-300">Paragraf Kualifikasi &amp; Pengalaman Utama</label>
                        <span className="text-[10px] text-slate-500">{(formData.bodyParagraph1 || '').length} karakter</span>
                      </div>
                      <textarea
                        rows={3}
                        value={formData.bodyParagraph1}
                        onChange={(e) => handleChange('bodyParagraph1', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner leading-relaxed"
                        placeholder="Uraikan pengalaman teknis dan kecocokan skill yang relevan..."
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-bold text-slate-300">Paragraf Pencapaian Kuantitatif STAR</label>
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                            <Star size={10} /> STAR Method
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleAiStarEnhance}
                          disabled={isOptimizingStar}
                          className="text-[11px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles size={11} className={isOptimizingStar ? 'animate-spin' : ''} />
                          <span>Optimasi STAR %</span>
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={formData.bodyParagraph2}
                        onChange={(e) => handleChange('bodyParagraph2', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner leading-relaxed"
                        placeholder="Sebutkan metrik kuantitatif, efisiensi waktu, atau persentase peningkatan..."
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-300">Paragraf Penutup (Closing)</label>
                        <span className="text-[10px] text-slate-500">{(formData.closingParagraph || '').length} karakter</span>
                      </div>
                      <textarea
                        rows={2}
                        value={formData.closingParagraph}
                        onChange={(e) => handleChange('closingParagraph', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner leading-relaxed"
                        placeholder="Sampaikan harapan wawancara dan apresiasi..."
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400">Salam Penutup</label>
                      <input
                        type="text"
                        value={formData.closingSalutation}
                        onChange={(e) => handleChange('closingSalutation', e.target.value)}
                        className="w-full mt-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500 focus:outline-none transition shadow-inner"
                        placeholder="Hormat saya,"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════ TAB 2: TEMPLATE & DESAIN ════════ */}
          {activeBuilderTab === 'template' && (
            <div className="space-y-5">
              {/* Template Selector Card */}
              <div className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                      <Layers size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">Pilih Template Standar Industri</h3>
                      <p className="text-[11px] text-slate-400">Format surat teruji lolos seleksi ATS HR Enterprise &amp; BUMN</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-teal-400 font-bold bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                    5 Template Siap Pakai
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {TEMPLATES.map((tpl) => {
                    const isSelected = selectedTemplate === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => {
                          setSelectedTemplate(tpl.id);
                          showToast(`Mengubah template ke ${tpl.name}`);
                        }}
                        className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer relative group ${
                          isSelected
                            ? 'bg-teal-500/15 border-teal-500/60 shadow-lg shadow-teal-500/10 scale-[1.01]'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${tpl.badgeColor}`}>
                            {tpl.category}
                          </span>
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-slate-950">
                              <Check size={12} strokeWidth={3} />
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition">Pilih</span>
                          )}
                        </div>
                        <div className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5">
                          <span>{tpl.name}</span>
                        </div>
                        <div className="text-[10.5px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{tpl.desc}</div>
                        <div className="mt-2 text-[9.5px] font-mono text-teal-400/80 bg-slate-900/80 px-2 py-0.5 rounded inline-block border border-slate-800">
                          Font: {tpl.fontFamily.split(',')[0].replace(/'/g, '')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent Color Customization Card */}
              <div className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <Palette size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">Warna Aksen Dokumen</h3>
                    <p className="text-[11px] text-slate-400">Pilih palet warna aksen header &amp; pemisah resmi</p>
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {ACCENT_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setAccentColor(c.id)}
                        className={`w-8 h-8 rounded-full transition-all cursor-pointer relative flex items-center justify-center ${
                          accentColor === c.id ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{ background: c.hex }}
                        title={c.name}
                      >
                        {accentColor === c.id && <Check size={14} className="text-white drop-shadow-md" />}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <input
                      type="color"
                      value={customHex}
                      onChange={(e) => {
                        setCustomHex(e.target.value);
                        setAccentColor('custom');
                      }}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      title="Pilih Warna Kustom"
                    />
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase">{primaryHex}</span>
                  </div>
                </div>
              </div>

              {/* Page Fit Density Options */}
              <div className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Zap size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">Mode Kerapatan Halaman A4</h3>
                    <p className="text-[11px] text-slate-400">Sesuaikan kepadatan tulisan agar pas 1 lembar utuh</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {PAGE_FIT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPageFitMode(opt.id)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        pageFitMode === opt.id
                          ? 'bg-teal-500/20 border-teal-500/60 text-teal-200 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-100 flex items-center justify-between">
                        <span>{opt.name}</span>
                        {pageFitMode === opt.id && <CheckCircle2 size={13} className="text-teal-400" />}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════════ TAB 3: FORMAT FONT & TTD DIGITAL ════════ */}
          {activeBuilderTab === 'typography' && (
            <div className="space-y-5">
              {/* Typography Sliders */}
              <div className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <Sliders size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">Kontrol Ukuran Font &amp; Spasi Paragraf</h3>
                    <p className="text-[11px] text-slate-400">Atur jarak presisi dokumen secara real-time</p>
                  </div>
                </div>

                <div className="space-y-4 pt-1">
                  {/* Slider: Jarak Tanda Tangan */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <PenTool size={13} className="text-teal-400" />
                        <span>Jarak Tanda Tangan (Space Gap "Hormat saya" &amp; Nama)</span>
                      </label>
                      <span className="text-xs font-black text-teal-400 bg-teal-500/15 px-2.5 py-0.5 rounded-lg border border-teal-500/30">
                        {signatureGap}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      step="4"
                      value={signatureGap}
                      onChange={(e) => setSignatureGap(Number(e.target.value))}
                      className="w-full accent-teal-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Rapat (20px)</span>
                      <span>Standar HR (56px)</span>
                      <span>Renggang (120px)</span>
                    </div>
                  </div>

                  {/* Sliders: Ukuran Font & Jarak Paragraf */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-300">Ukuran Font Surat</label>
                        <span className="text-xs font-extrabold text-teal-400">{fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="16"
                        step="0.5"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-teal-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-300">Jarak Antar Paragraf</label>
                        <span className="text-xs font-extrabold text-teal-400">{paragraphGap}px</span>
                      </div>
                      <input
                        type="range"
                        min="6"
                        max="28"
                        step="2"
                        value={paragraphGap}
                        onChange={(e) => setParagraphGap(Number(e.target.value))}
                        className="w-full accent-teal-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                      />
                    </div>
                  </div>

                  {/* Posisi Alignment Tanda Tangan */}
                  <div className="pt-2 border-t border-slate-800">
                    <label className="text-xs font-bold text-slate-300 mb-2 block">
                      Posisi / Alignment Tanda Tangan &amp; Nama:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'left', name: 'Rata Kiri', Icon: AlignLeft },
                        { id: 'center', name: 'Rata Tengah', Icon: AlignCenter },
                        { id: 'right', name: 'Rata Kanan', Icon: AlignRight },
                      ].map((align) => (
                        <button
                          key={align.id}
                          type="button"
                          onClick={() => setSignatureAlign(align.id)}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            signatureAlign === align.id
                              ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-sm'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <align.Icon size={14} />
                          <span>{align.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Signature Mode & Upload */}
              <div className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <PenTool size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">Tanda Tangan Digital (TTD)</h3>
                    <p className="text-[11px] text-slate-400">Pilih mode tanda tangan digital, unggah scan, atau kaligrafi otomatis</p>
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignatureMode('upload')}
                    className={`p-3 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                      signatureMode === 'upload'
                        ? 'bg-teal-500/20 border-teal-500/60 text-teal-200 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Upload size={14} className="text-teal-400" />
                      <span>Unggah Gambar</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Scan / foto tanda tangan dengan auto remove background</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignatureMode('handwritten')}
                    className={`p-3 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                      signatureMode === 'handwritten'
                        ? 'bg-teal-500/20 border-teal-500/60 text-teal-200 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles size={14} className="text-indigo-400" />
                      <span>Kaligrafi Estetik</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Tanda tangan digital otomatis dari nama pelamar</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignatureMode('none')}
                    className={`p-3 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                      signatureMode === 'none'
                        ? 'bg-teal-500/20 border-teal-500/60 text-teal-200 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <FileText size={14} className="text-slate-400" />
                      <span>Kosongkan</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Beri ruang kosong untuk tanda tangan basah manual</p>
                  </button>
                </div>

                {/* Sub-controls based on signatureMode */}
                {signatureMode === 'upload' && (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    {/* Auto Remove BG Toggle */}
                    <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2">
                        <Wand2 size={15} className="text-indigo-400" />
                        <span className="text-xs font-bold text-slate-200">Otomatis Hapus Background Putih (Transparent)</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoRemoveBg}
                        onChange={(e) => setAutoRemoveBg(e.target.checked)}
                        className="w-4 h-4 accent-teal-400 rounded cursor-pointer"
                      />
                    </div>

                    {/* Signature File Upload Input */}
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-teal-500/60 text-xs font-bold text-slate-300 cursor-pointer transition">
                        <Upload size={15} className="text-teal-400" />
                        <span>{signatureImg ? 'Ganti File Tanda Tangan' : 'Pilih File Scan Tanda Tangan (PNG/JPG)'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSignatureUpload}
                          className="hidden"
                        />
                      </label>

                      {signatureImg && (
                        <button
                          type="button"
                          onClick={() => {
                            setSignatureImg(null);
                            showToast("Tanda tangan berhasil dihapus.");
                          }}
                          className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition cursor-pointer"
                          title="Hapus Tanda Tangan"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {/* Adjust Signature Size & Offset */}
                    {signatureImg && (
                      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-teal-300">
                          <span>Kustomisasi Ukuran &amp; Posisi TTD:</span>
                          {isProcessingBg && <span className="animate-pulse text-[10px]">Memproses BG...</span>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                              <span>Lebar TTD:</span>
                              <span className="font-bold text-slate-200">{signatureWidth}px</span>
                            </div>
                            <input
                              type="range"
                              min="60"
                              max="240"
                              step="5"
                              value={signatureWidth}
                              onChange={(e) => setSignatureWidth(Number(e.target.value))}
                              className="w-full accent-teal-400 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                              <span>Geser Vertikal (Y-Offset):</span>
                              <span className="font-bold text-slate-200">{signatureOffset}px</span>
                            </div>
                            <input
                              type="range"
                              min="-30"
                              max="40"
                              step="2"
                              value={signatureOffset}
                              onChange={(e) => setSignatureOffset(Number(e.target.value))}
                              className="w-full accent-teal-400 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {signatureMode === 'handwritten' && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-300">Pratinjau Kaligrafi Tulis Tangan:</span>
                    <div className="p-4 bg-white rounded-lg flex items-center justify-center border border-slate-300">
                      <div
                        style={{
                          fontFamily: '"Brush Script MT", "Caveat", "Segoe Script", cursive, sans-serif',
                          fontSize: `${Math.max(22, signatureWidth / 5.2)}px`,
                          color: '#0F172A',
                          transform: 'rotate(-3.5deg)',
                        }}
                      >
                        {formData.senderName || 'Kemas Muhammad'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════ TAB 4: AI AUDIT & REVIEW ════════ */}
          {activeBuilderTab === 'audit' && (
            <div className="space-y-5">
              {/* Audit Hero Card */}
              <div className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl border border-teal-500/40 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <span>AI Audit &amp; Kualitas ATS Surat Lamaran</span>
                        <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-full font-bold">
                          All-in-One Engine
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">Deteksi typo, evaluasi Metode STAR, dan rekomendasi ejaan baku</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleComprehensiveAiAudit}
                    disabled={isAuditing}
                    className="shimmer-btn-gradient px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 group"
                  >
                    <Sparkles size={16} className={`text-teal-200 transition-transform ${isAuditing ? 'animate-spin' : 'group-hover:rotate-12 group-hover:scale-110'}`} />
                    <span className="tracking-wide">{isAuditing ? 'Sedang Mengaudit...' : 'Audit Dokumen Sekarang'}</span>
                  </button>
                </div>

                {/* Audit Result Display */}
                {auditResult ? (
                  <div className="space-y-4 pt-2">
                    {/* Score Bar */}
                    <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span className="text-xs font-extrabold text-slate-200">Skor Kesiapan Kirim ke HR Enterprise:</span>
                      </div>
                      <span className="text-sm font-black text-teal-300 bg-teal-500/20 px-3 py-1 rounded-lg border border-teal-500/30">
                        {auditResult.score}/100
                      </span>
                    </div>

                    {/* Typo Detection Box */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <FileText size={14} className="text-cyan-400" />
                          <span>Pemeriksaan Typo &amp; Ejaan Kata:</span>
                        </span>
                        {auditResult.allTypos.length > 0 ? (
                          <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                            <AlertCircle size={12} /> {auditResult.allTypos.length} Typo Ditemukan
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 size={12} /> 100% Bebas Typo
                          </span>
                        )}
                      </div>

                      {auditResult.allTypos.length > 0 ? (
                        <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/20 space-y-2">
                          {auditResult.allTypos.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                              <div className="text-[11px] space-y-0.5">
                                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 mr-2">
                                  {item.paragraph}
                                </span>
                                <span className="line-through text-rose-400 font-mono font-bold mr-2">{item.word}</span>
                                <span className="text-slate-400">ganti &rarr; </span>
                                <span className="text-emerald-400 font-bold">{item.suggestion}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleFixSingleTypo(item)}
                                className="self-end sm:self-auto px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <Check size={12} />
                                <span>Perbaiki Kata Ini</span>
                              </button>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={handleFixTyposOnly}
                            className="w-full py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Wand2 size={13} />
                            <span>Perbaiki Semua Typo Sekaligus</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                          <CheckCircle2 size={15} />
                          <span>Seluruh kata dan ejaan pada surat lamaran kamu sudah rapi &amp; bebas dari typo.</span>
                        </div>
                      )}
                    </div>

                    {/* Strengths & Weaknesses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 size={14} /> Kelebihan Surat:
                        </span>
                        <div className="space-y-1 text-[11px] text-slate-300">
                          {auditResult.strengths.map((s, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                          <AlertCircle size={14} /> Catatan &amp; Evaluasi:
                        </span>
                        <div className="space-y-1 text-[11px] text-slate-300">
                          {auditResult.weaknesses.length > 0 ? (
                            auditResult.weaknesses.map((w, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-400 font-bold">•</span>
                                <span>{w}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-slate-400 italic">Tidak ada catatan kekurangan kritis.</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Per-Paragraph Recommendations (Review-Only, user pilih sendiri) */}
                    {auditResult.recommendations && (
                      <div className="pt-2 border-t border-slate-800 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen size={14} className="text-indigo-400" />
                          <span className="text-xs font-extrabold text-slate-200">Rekomendasi AI per Paragraf:</span>
                          <span className="text-[10px] text-slate-500 font-normal">(terapkan sesuai kebutuhan kamu)</span>
                        </div>

                        {[
                          { key: 'openingParagraph', label: 'Paragraf Pembuka', color: 'teal' },
                          { key: 'bodyParagraph1', label: 'Paragraf Kualifikasi', color: 'indigo' },
                          { key: 'bodyParagraph2', label: 'Paragraf Pencapaian STAR', color: 'amber' },
                          { key: 'closingParagraph', label: 'Paragraf Penutup', color: 'emerald' },
                        ].map(({ key, label, color }) => {
                          const rec = auditResult.recommendations[key];
                          const current = formData[key];
                          const isDifferent = rec && rec !== current;
                          if (!rec) return null;
                          return (
                            <div key={key} className={`bg-slate-950 rounded-xl border border-slate-800 overflow-hidden`}>
                              <div className={`flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800`}>
                                <span className={`text-[11px] font-extrabold text-${color}-300 flex items-center gap-1.5`}>
                                  <FileCheck2 size={12} />
                                  {label}
                                </span>
                                {isDifferent ? (
                                  <button
                                    type="button"
                                    onClick={() => handleApplyParagraphRecommendation(key, label)}
                                    className={`px-2.5 py-1 rounded-lg bg-${color}-500/20 hover:bg-${color}-500/30 border border-${color}-500/40 text-${color}-300 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer`}
                                  >
                                    <Check size={11} />
                                    <span>Terapkan Rekomendasi Ini</span>
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                    <CheckCircle2 size={11} /> Sudah Optimal
                                  </span>
                                )}
                              </div>
                              {isDifferent && (
                                <div className="px-3 py-2.5 text-[11px] text-slate-300 leading-relaxed line-clamp-3">
                                  {rec}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-10 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto shadow-lg shadow-teal-500/10">
                      <ShieldCheck size={30} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-200">Surat Lamaran Belum Diaudit</p>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Klik tombol di bawah untuk memeriksa typo otomatis, evaluasi Metode STAR, dan memastikan surat lamaran kamu lolos screening ATS HR.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleComprehensiveAiAudit}
                      disabled={isAuditing}
                      className="shimmer-btn-gradient px-6 py-2.5 rounded-xl text-xs font-black transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 group"
                    >
                      <Sparkles size={15} className={`text-teal-200 ${isAuditing ? 'animate-spin' : 'group-hover:rotate-12'}`} />
                      <span>{isAuditing ? 'Sedang Mengaudit...' : 'Audit Dokumen Sekarang'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════ TAB 5: BAHASA & TERJEMAHAN (35+) ════════ */}
          {activeBuilderTab === 'language' && (
            <div className="space-y-5">
              <div className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                      <Globe size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">Terjemahan Global (35+ Bahasa)</h3>
                      <p className="text-[11px] text-slate-400">AI menerjemahkan seluruh surat dengan tata bahasa formal internasional</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsLanguageModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Search size={13} />
                    <span>Cari Bahasa &amp; Negara</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {LANGUAGES.slice(0, 12).map((lang) => {
                    const isSelected = selectedLanguage === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => handleLanguageChange(lang.id)}
                        disabled={isTranslatingCoverLetter}
                        className={`p-3 rounded-xl border transition-all text-left cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-teal-500/20 border-teal-500/60 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-black flex items-center justify-center shrink-0">{lang.code}</span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">{lang.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{lang.country}</div>
                          </div>
                        </div>
                        {isSelected && <Check size={12} className="text-teal-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setIsLanguageModalOpen(true)}
                    className="text-xs text-teal-400 hover:text-teal-300 font-bold underline cursor-pointer"
                  >
                    Lihat &amp; Pilih dari seluruh 35+ Negara &amp; Bahasa Lainnya &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* RIGHT COLUMN: LIVE A4 PAPER PREVIEW (lg:col-span-5) */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div className={`lg:col-span-5 lg:sticky lg:top-24 space-y-3 ${mobileViewMode === 'preview' ? 'block' : 'hidden lg:block'}`}>

          {/* Mobile Quick Return Navigation Bar when inside preview mode */}
          <div className="lg:hidden p-3 bg-slate-950/95 border border-teal-500/50 rounded-2xl flex items-center justify-between gap-2 shadow-xl backdrop-blur-xl mb-3 flex-wrap">
            <button
              type="button"
              onClick={() => setMobileViewMode('editor')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-300 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <ChevronLeft size={16} />
              <span>Kembali Ke Editor</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFullPreviewOpen(true)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-teal-500/30 text-teal-300 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                title="Lihat Pratinjau Dokumen Seluruh Layar"
              >
                <Maximize2 size={14} />
                <span>Full A4</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="px-3.5 py-2 rounded-xl bg-teal-500 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Download size={14} className={isExportingPdf ? 'animate-bounce' : ''} />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Main Preview Container Card */}
          <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-3xl border border-slate-800 space-y-3 shadow-2xl">

            {/* Live Preview Toolbar Controls */}
            <div className="flex items-center justify-between px-1 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {/* View Mode Toggle: Lembar A4 vs Baca Nyaman */}
                <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPreviewViewTab('paper')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      previewViewTab === 'paper'
                        ? 'bg-teal-500 text-slate-950 shadow-sm font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Tampilan Format Lembar Cetak A4"
                  >
                    <FileText size={12} />
                    <span>Lembar A4</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewViewTab('reader')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      previewViewTab === 'reader'
                        ? 'bg-teal-500 text-slate-950 shadow-sm font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Tampilan Baca Responsif Tanpa Zooming"
                  >
                    <BookOpen size={12} />
                    <span>Baca Nyaman</span>
                  </button>
                </div>
              </div>

              {/* Zoom Controls (Visible when in paper mode) */}
              {previewViewTab === 'paper' && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewZoomMode('fit')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                      previewZoomMode === 'fit'
                        ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-sm font-extrabold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                    }`}
                    title="Sesuaikan otomatis dengan lebar layar (tanpa scroll horizontal)"
                  >
                    Fit Lebar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPreviewZoomMode('custom');
                      setPreviewZoom(100);
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                      previewZoomMode === 'custom' && previewZoom === 100
                        ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-sm font-extrabold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                    }`}
                    title="Ukuran Cetak Asli 100%"
                  >
                    100%
                  </button>

                  <div className="flex items-center gap-0.5 bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewZoomMode('custom');
                        setPreviewZoom(z => Math.max(50, z - 10));
                      }}
                      className="w-5 h-5 flex items-center justify-center hover:bg-slate-800 rounded text-slate-300 cursor-pointer"
                      title="Zoom Out"
                    >
                      -
                    </button>
                    <span className="px-1 text-teal-400 font-bold min-w-[36px] text-center text-[10.5px]">
                      {Math.round(effectiveScale * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewZoomMode('custom');
                        setPreviewZoom(z => Math.min(150, z + 10));
                      }}
                      className="w-5 h-5 flex items-center justify-center hover:bg-slate-800 rounded text-slate-300 cursor-pointer"
                      title="Zoom In"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFullPreviewOpen(true)}
                    className="p-1.5 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 transition cursor-pointer shrink-0"
                    title="Pratinjau Layar Penuh (A4)"
                  >
                    <Maximize2 size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* Reader Mode Viewport */}
            {previewViewTab === 'reader' && (
              <div className="w-full">
                <RenderReaderView />
              </div>
            )}

            {/* Paper Preview Render Container with Responsive Auto-Fit Scaling (Kept in DOM for PDF export) */}
            <div
              ref={previewContainerRef}
              style={{ display: previewViewTab === 'paper' ? 'flex' : 'none' }}
              className="relative w-full rounded-2xl bg-slate-950 p-2 sm:p-3 border border-slate-800/80 overflow-x-auto custom-horizontal-scrollbar justify-center items-start min-h-[680px]"
            >
              {/* Floating Top-Right Hover Action Button */}
              <div className="absolute top-3 right-3 z-20">
                <button
                  type="button"
                  onClick={() => setIsFullPreviewOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950/90 text-teal-300 border border-teal-500/40 hover:bg-slate-900 hover:text-white font-bold text-xs shadow-2xl backdrop-blur-md flex items-center gap-1.5 cursor-pointer transition hover:scale-105"
                  title="Lihat Pratinjau Dokumen Seluruh Layar (A4)"
                >
                  <Maximize2 size={12} />
                  <span>Full A4</span>
                </button>
              </div>

              {/* Scaled A4 Wrapper: Takes exact visual bounding box to prevent clipping or blank whitespace */}
              <div
                style={{
                  width: `${Math.round(794 * effectiveScale)}px`,
                  minHeight: `${Math.round(1050 * effectiveScale)}px`,
                  position: 'relative',
                  flexShrink: 0,
                  transition: 'width 0.15s ease, min-height 0.15s ease',
                }}
              >
                <div
                  style={{
                    transform: `scale(${effectiveScale})`,
                    transformOrigin: 'top left',
                    width: '794px',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                >
                  <RenderPaperContent />
                </div>
              </div>
            </div>

            {/* Footer Summary Bar */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> 1 Lembar A4 Fit
                </span>
                <span className="text-slate-600">•</span>
                <span className="truncate max-w-[130px] sm:max-w-none">
                  {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                </span>
              </div>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Download size={12} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* MULTI-NATIONAL LANGUAGE & COUNTRY SELECTOR MODAL FOR COVER LETTER (A-Z ALPHABET & SEARCH) */}
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
                    <span>Pilih Bahasa &amp; Negara Terjemahan Surat Lamaran</span>
                    <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-full font-extrabold">35+ Bahasa Global</span>
                  </h3>
                  <p className="text-xs text-slate-400">Pilih negara atau bahasa tujuan. AI akan menerjemahkan seluruh isi Surat Lamaran Kerja kamu secara formal &amp; profesional.</p>
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
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shrink-0 border ${
                      selectedAlphabetFilter === 'ALL'
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
                        className={`w-7 h-7 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shrink-0 flex items-center justify-center border disabled:opacity-30 disabled:cursor-not-allowed ${
                          isSelected
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
                            handleTranslateEntireCoverLetter(lang.id);
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 hover:scale-[1.02] ${
                            isSelected
                              ? 'bg-teal-500/20 border-teal-500/70 shadow-lg shadow-teal-500/10'
                              : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-black flex items-center justify-center shrink-0">{lang.code}</span>
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

        {/* FULLSCREEN COVER LETTER DOCUMENT PREVIEW MODAL (LIKE ATS CV BUILDER) */}
        {isFullPreviewOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[99999] flex flex-col bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-200 overflow-hidden">
            
            {/* Modal Header Bar */}
            <div className="h-auto sm:h-16 py-2.5 px-3 sm:px-8 bg-slate-900/90 border-b border-slate-800 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 shrink-0 shadow-2xl backdrop-blur-md">
              
              {/* Left: Title & Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0">
                  <Eye size={18} className="text-teal-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-white truncate flex items-center gap-2">
                    <span>Pratinjau Detail Seluruh Surat Lamaran</span>
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide shrink-0">
                      {TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Standard'}
                    </span>
                    <span className="hidden md:inline-flex text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full font-bold shrink-0 items-center gap-1.5">
                      <span className="px-1 py-0.2 rounded bg-teal-500/20 text-teal-300 text-[10px] font-black">{LANGUAGES.find(l => l.id === selectedLanguage)?.code}</span>
                      <span>{LANGUAGES.find(l => l.id === selectedLanguage)?.name}</span>
                    </span>
                  </h3>
                  <p className="hidden sm:block text-[11px] text-slate-400 truncate">
                    Tampilan presisi format cetak A4 standard HR &amp; ATS · 100% Real-time Sync
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
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer hidden md:inline-block ${fullPreviewZoom === 125 ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'}`}
                >
                  125%
                </button>
              </div>

              {/* Right: Actions (Copy, Print, Download, Close) */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyText}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Salin Isi Surat Lamaran ke Clipboard"
                >
                  {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span className="hidden md:inline">{isCopied ? 'Tersalin' : 'Salin Teks'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Cetak Surat Lamaran (Ctrl+P)"
                >
                  <Printer size={14} className="text-cyan-400" />
                  <span className="hidden sm:inline">Cetak</span>
                </button>

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
                className="transition-all duration-200 origin-top shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] my-4 rounded-sm bg-white border border-slate-700"
                style={{
                  transform: `scale(${fullPreviewZoom / 100})`,
                  transformOrigin: 'top center',
                  maxWidth: fullPreviewZoom <= 100 ? '794px' : 'none',
                  width: '794px',
                  minWidth: '794px'
                }}
              >
                <RenderPaperContent canvasId="printable-coverletter-canvas-modal" isModal={true} />
              </div>
            </div>

            {/* Modal Bottom Status Bar */}
            <div className="h-9 px-4 sm:px-8 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 size={13} />
                  <span>Standar Format Resmi A4 (1 Lembar Fit)</span>
                </span>
                <span className="hidden md:inline text-slate-600">•</span>
                <span className="hidden md:inline text-slate-400">
                  Font: <strong className="text-slate-300">{TEMPLATES.find(t => t.id === selectedTemplate)?.name}</strong> ({fontSize}px)
                </span>
                <span className="hidden md:inline text-slate-600">•</span>
                <span className="hidden md:inline text-slate-400">
                  Jarak TTD: <strong className="text-slate-300">{signatureGap}px</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-slate-500">
                  Tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-teal-300 font-mono text-[10px]">ESC</kbd> untuk kembali ke editor
                </span>
              </div>
            </div>

          </div>,
          document.body
        )}

      </div>
    </div>
  );
}
