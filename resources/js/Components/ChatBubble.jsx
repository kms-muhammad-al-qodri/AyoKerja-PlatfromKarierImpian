import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
const CS_ROBOT_WEBM = '/assets/robot/robot-cs-idle.webm';
const ROBOT_CS_WEBM = '/assets/robot/robot-cs-chat.webm';
import {
  Bot,
  Sparkles,
  X,
  Send,
  MessageSquare,
  RotateCcw,
  User,
  Zap,
  Lightbulb,
  FileText,
  Briefcase,
  ChevronDown,
  Maximize2,
  Minimize2,
  Copy,
  Check
} from 'lucide-react';

// Quick prompts dan initial messages sekarang di-compute di dalam komponen
// agar bisa reaktif terhadap perubahan bahasa (lihat di dalam ChatBubble component)


// Component to render message text cleanly without raw markdown symbols (**bold**, *italic*, `code`, etc.)
const FormattedMessage = ({ text, isUser }) => {
  if (!text) return null;

  let strText = text;
  if (typeof text !== 'string') {
    if (typeof text === 'object') {
      strText = text.reply || text.message || text.text || text.content || JSON.stringify(text);
    } else {
      strText = String(text);
    }
  }

  if (typeof strText !== 'string') {
    strText = String(strText || '');
  }

  const lines = strText.split('\n');

  const renderInline = (contentStr) => {
    if (!contentStr) return null;
    const safeContent = typeof contentStr === 'string' ? contentStr : String(contentStr);

    // Tokenize **bold**, *italic*, `code`
    const regex = /(\*\*(?:[^*]|\*[^*])+\*\*|\*(?:[^*])+\*|`[^`]+`)/g;
    const parts = safeContent.split(regex);

    return parts.map((part, idx) => {
      if (!part) return null;

      // Bold: **text**
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        const clean = part.slice(2, -2);
        return (
          <span
            key={idx}
            style={{
              fontWeight: 700,
              color: isUser ? '#FFFFFF' : '#38BDF8',
            }}
          >
            {clean}
          </span>
        );
      }

      // Italic: *text*
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        const clean = part.slice(1, -1);
        return (
          <span
            key={idx}
            style={{
              fontStyle: 'italic',
              opacity: 0.9,
            }}
          >
            {clean}
          </span>
        );
      }

      // Code: `text`
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        const clean = part.slice(1, -1);
        return (
          <code
            key={idx}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1px 5px',
              borderRadius: '4px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: isUser ? '#FFFFFF' : '#2DD4BF',
            }}
          >
            {clean}
          </code>
        );
      }

      return part;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} style={{ height: '6px' }} />;
        }

        // Bullet point: - item or * item
        const bulletMatch = line.match(/^(\s*)([-*•])\s+(.*)/);
        if (bulletMatch) {
          return (
            <div key={lIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginLeft: '2px' }}>
              <span style={{ color: isUser ? '#FFFFFF' : '#2DD4BF', fontWeight: 'bold', userSelect: 'none' }}>•</span>
              <div style={{ flex: 1 }}>{renderInline(bulletMatch[3])}</div>
            </div>
          );
        }

        // Numbered item: 1. item or 1) item
        const numMatch = line.match(/^(\s*)(\d+[\.\)])\s+(.*)/);
        if (numMatch) {
          return (
            <div key={lIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginLeft: '2px' }}>
              <span style={{ color: isUser ? '#FFFFFF' : '#2DD4BF', fontWeight: 600, userSelect: 'none' }}>{numMatch[2]}</span>
              <div style={{ flex: 1 }}>{renderInline(numMatch[3])}</div>
            </div>
          );
        }

        return (
          <div key={lIdx}>
            {renderInline(line)}
          </div>
        );
      })}
    </div>
  );
};

// English fallback responder
const generateMockAIResponseEn = (userText) => {
  const q = userText.toLowerCase().trim();
  if (/^(hi|hello|hey)\b/.test(q) || q.includes('who are you') || q.includes('good morning') || q.includes('good evening')) {
    return `Hi! I'm **AyoKerja Assistant**, your digital career companion.\n\nI can help you with:\n- **CV Analysis & ATS Score Check**\n- **Real-Time Job Recommendations**\n- **Career Roadmap & Skill Upgrades**\n- **Technical Interview Preparation**\n\nWhat can I help you with today?`;
  }
  if (q.includes('how to') || q.includes('how do i') || q.includes('steps')) {
    return `To use the **CV Check & Analysis** feature on AyoKerja:\n\n1. **Choose Your CV**: Click **'Check CV Now'** on the landing page or open the **CV Analysis** menu in the dashboard.\n2. **Upload File (PDF/DOCX)**: Make sure your CV is text-based (not a scanned image).\n3. **Automatic AI Analysis**: The AI instantly calculates your **ATS Score (0-100)**, detects missing keywords, and gives specific improvement tips in real time!`;
  }
  if (q.includes('thank')) {
    return `You're welcome! Wishing you success in your career. Feel free to ask me anything anytime!`;
  }
  if (q.includes('interested in the') || q.includes('application strategy') || q.includes('position at')) {
    let title = 'Software Engineer';
    let company = 'Target Company';
    const titleMatch = userText.match(/the\s+["']([^"']+)["']\s+position/i);
    const companyMatch = userText.match(/at\s+["']([^"']+)["']/i);
    if (titleMatch) title = titleMatch[1];
    if (companyMatch) company = companyMatch[1];
    return `**AI Qualification Analysis & Application Strategy:**\n\nI've analyzed the **${title}** role at **${company}**!\n\n1. **Key ATS Qualifications**:\n- Make sure core technical keywords from the job description appear explicitly in your CV.\n- Use a Harvard ATS format so HR parsers can read it 100%.\n\n2. **Technical & HR Interview Tips at ${company}**:\n- **STAR Method**: Prepare 2 real project examples where you solved architecture or performance problems.\n- **HR Questions**: Research ${company} and explain the value you can bring.\n\n3. **Winning Strategy & Salary Negotiation**:\n- Include a GitHub repository or live demo to significantly boost your leverage.\n- Ask insightful questions about the team's expectations for the first 90 days.\n\n*Pro Tip*: Click **Apply** on the job card to open the official application page!`;
  }
  if (q.includes('match') || q.includes('score') || q.includes('percentage')) {
    return `**AI Match Percentage Analysis:**\n\n- **Match Score**: **92%** (Great Fit!)\n- **Skills Met**: PHP, Laravel, MySQL, REST API\n- **Skills to Improve**: Docker, Redis / Microservices\n\n**AI Recommendation**: Your profile is highly relevant! Adding a GitHub portfolio link to your CV greatly increases your interview chances.`;
  }
  if (q.includes('ats') || q.includes('cv') || q.includes('resume')) {
    return `**Tips to Pass ATS (Applicant Tracking System):**\n\n1. **Use a Standard Format**: Clean fonts like Arial / Inter; avoid complex tables or graphics.\n2. **Specific Keywords**: Include technical keywords from your target job description.\n3. **Quantifiable Results**: Write *"Improved web performance by 40%"* instead of just *"Built a website"*.\n\n*You can also use our **CV Analysis** feature for an automatic score!*`;
  }
  if (q.includes('fresh grad') || q.includes('career') || q.includes('recommend')) {
    return `**Fresh Graduate Career Guide 2026:**\n\n1. **Identify Core Skills**: Map your hard skills & soft skills.\n2. **Build Real Portfolio**: Real projects / case studies matter more than theory.\n3. **Try the AI Career Matcher**: Upload your CV to be matched automatically with 500+ current opportunities!`;
  }
  if (q.includes('gap') || q.includes('skill') || q.includes('job')) {
    return `**Skill Gap Analysis:**\n\nAyoKerja can compare **your CV vs the job description** instantly! You'll get:\n- Match percentage (Match Score)\n- Skills you're missing\n- Free learning module recommendations to close the gap.`;
  }
  if (q.includes('interview')) {
    return `**Technical & HR Interview Tips:**\n\n- **Use the STAR Method**: (Situation, Task, Action, Result) when describing experience.\n- **Research the Company**: Understand their products & key industry challenges.\n- **Prepare Questions**: Ask about team culture & expectations for the first 3 months.`;
  }
  return `I'm ready to help you with your career and CV!\n\nAs **AyoKerja Assistant**, I can:\n- **Analyze Your CV Quality & ATS Score**\n- **Provide a Career Roadmap & Skill Gap Analysis**\n- **Match Your Profile with the Best Jobs**\n\nTry the **"Check CV Now"** button or ask me a specific question!`;
};

const generateMockAIResponse = (userText, isEn = false) =>
  isEn ? generateMockAIResponseEn(userText) : generateMockAIResponseId(userText);

// Contextual Intelligent AI Responder Fallback (Bahasa Indonesia)
const generateMockAIResponseId = (userText) => {
  const query = userText.toLowerCase().trim();

  // 1. "gimana caranya", "caranya gimana", "itu gimana", "bagaimana caranya"
  if (
    query.includes('gimana caranya') ||
    query.includes('caranya gimana') ||
    query.includes('itu gimana') ||
    query.includes('bagaimana caranya') ||
    query.includes('gimana cara') ||
    query.includes('cara pakenya') ||
    query.includes('cara pakainya') ||
    query.includes('langkahnya')
  ) {
    return `Untuk menggunakan fitur **Cek & Analisis CV** di AyoKerja, ikuti langkah mudah ini bre:\n\n1. **Pilih Berkas CV**: Klik tombol **'Cek CV Sekarang'** di landing page atau masuk ke menu **Analisis CV** di dashboard.\n2. **Unggah File (PDF/DOCX)**: Pastikan format CV kamu berbentuk teks (bukan hasil scan/gambar JPG).\n3. **Analisis Otomatis AI**: Sistem AI akan langsung menghitung **Skor ATS (0-100)**, mendeteksi kata kunci yang kurang, serta memberikan saran perbaikan spesifik secara real-time!\n\nCobalah langsung klik tombol **Cek CV Sekarang** di atas atau buat akun gratis untuk melihat hasilnya!`;
  }

  // 2. Greetings & Introductions
  if (
    query === 'halo' ||
    query === 'hai' ||
    query === 'hi' ||
    query.includes('halo ') ||
    query.includes('hai ') ||
    query.includes('siapa kamu') ||
    query.includes('selamat pagi') ||
    query.includes('selamat siang') ||
    query.includes('selamat malam') ||
    query.includes('apa kabar')
  ) {
    return `Halo! Aku **AyoKerja Assistant**, AI pendamping karir digital kamu.\n\nAku siap bantu kamu:\n- **Analisis & Cek Skor ATS CV**\n- **Rekomendasi Lowongan Kerja Real-Time**\n- **Roadmap Karir & Upgrade Skill**\n- **Persiapan Interview Teknis**\n\nAda yang bisa aku bantu hari ini bre?`;
  }

  // 3. Permission to ask
  if (query.includes('boleh nanya') || query.includes('bisa nanya') || query.includes('mau nanya') || query.includes('nanya dong')) {
    return `Boleh banget bre! Silakan tanyakan apa saja seputar karir, CV, atau lowongan kerja.\n\nTopik yang bisa kamu tanyakan:\n- *\"Gimana cara bikin CV tembus ATS?\"*\n- *\"Gimana caranya analisis CV di sini?\"*\n- *\"Tips jawab pertanyaan interview teknis?\"*\n\nGas tanyain aja!`;
  }

  // 4. Thank you
  if (query.includes('makasih') || query.includes('terima kasih') || query.includes('thanks') || query.includes('thank you')) {
    return `Sama-sama bre! Semoga karirmu makin sukses dan lancar. Kalau ada pertanyaan lagi, jangan ragu tanyakan ke aku ya!`;
  }

  if (query.includes('presntase') || query.includes('persentase') || query.includes('match') || query.includes('skor') || query.includes('cocok')) {
    return `**Analisis Persentase Kecocokan AI:**\n\n- **Match Score**: **92%** (Sangat Cocok!)\n- **Skill Terpenuhi**: PHP, Laravel, MySQL, REST API\n- **Skill Perlu Ditingkatkan**: Docker, Redis / Microservices\n\n**Rekomendasi AI**: Profil kamu sebagai Backend Engineer memiliki relevansi yang sangat tinggi! Peluang dipanggil wawancara sangat besar jika kamu menyertakan link portofolio GitHub di CV.`;
  }

  if (query.includes('tertarik dengan lowongan') || query.includes('tertarik dengan posisi') || query.includes('informasi job') || query.includes('tanya ai') || query.includes('strategi melamar')) {
    let title = 'Software Engineer';
    let company = 'Perusahaan Target';
    const titleMatch = userText.match(/lowongan\s+["\']([^"\']+)["\']/i);
    const companyMatch = userText.match(/di\s+["\']([^"\']+)["\']/i);
    if (titleMatch) title = titleMatch[1];
    if (companyMatch) company = companyMatch[1];

    return `**Analisis Kualifikasi & Strategi Melamar AI:**\n\nSaya telah menganalisis detail lowongan **${title}** di **${company}**!\n\n1. **Analisis Kualifikasi Utama ATS**:\n- Pastikan kata kunci teknis utama (Laravel, React, PHP, MySQL, REST API) tercantum secara eksplisit di CV kamu.\n- Format CV menggunakan standar Harvard ATS agar dapat dibaca 100% oleh parser HRD.\n\n2. **Tips Wawancara Teknis & HR di ${company}**:\n- **Metode STAR**: Siapkan 2 contoh proyek nyata di mana kamu memecahkan masalah arsitektur atau performa sistem.\n- **Pertanyaan HR**: Riset profil ${company} dan sampaikan motivasi serta nilai tambah yang bisa kamu bawa.\n\n3. **Strategi Menang Seleksi & Negosiasi Gaji**:\n- Sertakan repositori GitHub atau demo aplikasi aktif untuk meningkatkan nilai tawar kamu secara signifikan.\n- Ajukan pertanyaan mendalam mengenai ekspektasi tim pada 90 hari pertama.\n\n*Tips Pro*: Klik tombol **Lamar** pada kartu pekerjaan untuk langsung membuka halaman pendaftaran resmi!`;
  }

  if (query.includes('posisi') || query.includes('lowongan') || query.includes('perusahaan')) {
    return `**Analisis AI Spesifik Lowongan Pekerjaan:**\n\n1. **Kualifikasi Utama**: Posisi ini membutuhkan pemahaman teknis yang solid pada core stack & pemecahan masalah.\n2. **Rekomendasi Dokumen CV**: Pastikan CV kamu berformat Harvard ATS & mencantumkan kata kunci relevan untuk posisi ini.\n3. **Strategi Lolos Seleksi**: Siapkan portofolio projek nyata & gunakan metode STAR (Situation, Task, Action, Result) saat wawancara teknis.\n\n*Semoga sukses! Klik tombol **Lamar Pekerjaan Sekarang** untuk membuka portal pendaftaran resmi.*`;
  }

  if (query.includes('ats') || query.includes('cv')) {
    return `**Tips CV Tembus Sistem ATS (Applicant Tracking System):**\n\n1. **Gunakan Format Standard**: Pakai font bersih seperti Arial / Inter, dan hindari tabel rumit atau grafik di CV.\n2. **Kata Kunci Spesifik**: Masukkan kata kunci teknis dari deskripsi pekerjaan targetmu.\n3. **Fokus pada Pencapaian (Quantifiable Results)**: Tulis *"Meningkatkan performa web sebesar 40%"* dibanding sekadar *"Membuat web"*.\n\n*Kamu juga bisa manfaatkan fitur **Analisis CV** di platform kami untuk skor otomatis!*`;
  }

  if (query.includes('fresh grad') || query.includes('karir') || query.includes('rekomendasi')) {
    return `**Panduan Karir Fresh Graduate 2026:**\n\n1. **Identifikasi Core Skill**: Petakan keahlian utama (Hard Skills) & soft skills kamu.\n2. **Bangun Portofolio Nyata**: Projek nyata / case study jauh lebih dihargai dibanding teori.\n3. **Coba AI Career Matcher**: Unggah CV-mu di platform ini untuk dicocokkan otomatis dengan 500+ peluang karir terkini!`;
  }

  if (query.includes('gap') || query.includes('loker') || query.includes('skill')) {
    return `**Analisis Gap Skill:**\n\nPlatform AyoKerja bisa membandingkan **CV kamu vs Deskripsi Loker** secara instan! Kamu akan mendapatkan:\n- Persentase kecocokan (Match Score)\n- Skill yang belum kamu miliki\n- Rekomendasi modul belajar gratis untuk menutup gap tersebut.`;
  }

  if (query.includes('interview') || query.includes('wawancara')) {
    return `**Tips Hadapi Interview Teknis & HR:**\n\n- **Gunakan Metode STAR**: (Situation, Task, Action, Result) saat menceritakan pengalaman.\n- **Riset Perusahaan**: Pahami produk & tantangan utama industri mereka.\n- **Siapkan Pertanyaan**: Tanyakan tentang budaya tim & ekspektasi 3 bulan pertama.`;
  }

  return `Aku siap bantuin kamu seputar karir dan CV bre!\n\nSebagai **AyoKerja Assistant**, aku bisa membantumu:\n- **Menganalisis Kualitas & Skor ATS CV**\n- **Memberikan Peta Jalan Karir & Skill Gap**\n- **Mencocokkan Profilmu dengan Lowongan Kerja Terbaik**\n\nCobalah gunakan tombol **"Cek CV Sekarang"** di landing page atau tanyakan pertanyaan spesifik!`;
};

export default function ChatBubble() {
  const { t, i18n } = useTranslation();
  const isEn = (i18n.resolvedLanguage || i18n.language || 'id').startsWith('en');
  const L = (id, en) => (isEn ? en : id);
  const [isOpen, setIsOpen] = useState(false);

  // Quick prompts — reaktif terhadap bahasa
  const QUICK_PROMPTS = [
    { icon: FileText, text: t('ai.quickPrompts.ats') },
    { icon: Briefcase, text: t('ai.quickPrompts.freshGrad') },
    { icon: Lightbulb, text: t('ai.quickPrompts.skillGap') },
    { icon: Zap, text: t('ai.quickPrompts.interview') },
  ];

  // Welcome message — reaktif terhadap bahasa
  const initialMessages = [
    {
      id: 1,
      sender: 'ai',
      text: t('ai.welcome'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [activeJob, setActiveJob] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isAllCopied, setIsAllCopied] = useState(false);
  const [showPromptsManual, setShowPromptsManual] = useState(false);
  const messagesEndRef = useRef(null);

  // Helper untuk membersihkan format markdown teks agar siap disalin
  const getCleanText = (text) => {
    if (!text) return '';
    let strText = text;
    if (typeof text !== 'string') {
      if (typeof text === 'object') {
        strText = text.reply || text.message || text.text || text.content || JSON.stringify(text);
      } else {
        strText = String(text);
      }
    }
    return String(strText || '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .trim();
  };

  // Salin pesan individual
  const handleCopyMessage = async (msgId, text) => {
    const clean = getCleanText(text);
    if (!clean) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(clean);
      } else {
        const el = document.createElement('textarea');
        el.value = clean;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Gagal menyalin pesan: ', err);
    }
  };

  // Salin seluruh percakapan
  const handleCopyAllMessages = async () => {
    if (!messages || messages.length === 0) return;
    const fullTranscript = messages
      .map((m) => {
        const senderName = m.sender === 'user' ? 'Saya' : 'AyoKerja Assistant';
        return `[${senderName} • ${m.time}]\n${getCleanText(m.text)}`;
      })
      .join('\n\n---\n\n');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullTranscript);
      } else {
        const el = document.createElement('textarea');
        el.value = fullTranscript;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setIsAllCopied(true);
      setTimeout(() => setIsAllCopied(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin seluruh obrolan: ', err);
    }
  };

  // Keyboard shortcut Esc untuk keluar fullscreen atau tutup chat
  useEffect(() => {
    const handleKeyDownGlobal = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDownGlobal);
    return () => window.removeEventListener('keydown', handleKeyDownGlobal);
  }, [isFullscreen, isOpen]);

  // Reset welcome message saat bahasa berubah
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: t('ai.welcome'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setShowPromptsManual(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  // Custom Event Listener for "Tanya AI tentang Pekerjaan Ini"
  useEffect(() => {
    const handleAskEvent = (e) => {
      const promptText = e.detail?.prompt;
      const jobData = e.detail?.job;
      if (jobData) setActiveJob(jobData);
      if (promptText) {
        setIsOpen(true);
        setShowTeaser(false);
        setShowPromptsManual(false);
        handleSendMessage(promptText, jobData);
      }
    };
    window.addEventListener('ask-career-ai', handleAskEvent);
    return () => window.removeEventListener('ask-career-ai', handleAskEvent);
  }, [activeJob]);

  // Auto scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowTeaser(false);
    }
  }, [messages, isOpen, isTyping]);

  // Handle Send Message (Calls Real Backend AI API using DeepSeek)
  const handleSendMessage = async (textToSend, overrideJob = null) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    setShowPromptsManual(false);

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time,
    };

    const historyPayload = messages.slice(-10).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const response = await axios.post('/api/career-ai/chat', {
        message: text.trim(),
        job: overrideJob || activeJob,
        history: historyPayload,
        system_prompt: t('ai.systemPrompt'), // 🌐 sistem prompt dinamis sesuai bahasa
        language: i18n.language,
      });

      let rawReply = response.data?.reply || response.data?.message || response.data;
      if (rawReply && typeof rawReply === 'object' && rawReply.fallback) {
        rawReply = '';
      } else if (typeof rawReply === 'object' && rawReply !== null) {
        rawReply = rawReply.reply || rawReply.message || rawReply.text || rawReply.content || JSON.stringify(rawReply);
      }
      const replyText = typeof rawReply === 'string' && rawReply.trim() ? rawReply : generateMockAIResponse(text, isEn);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('AI Chat API request notice:', err);
      const aiReplyText = generateMockAIResponse(text, isEn);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: t('ai.welcome'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setActiveJob(null);
    setIsTyping(false);
    setShowPromptsManual(false);
  };

  return (
    <>
      {/* Floating Widget Positioner */}
      <div id="tour-ai-chat" className={`chat-bubble-fixed-wrapper ${isFullscreen ? 'has-fullscreen' : ''}`}>

        {/* Fullscreen Backdrop (Click outside to exit fullscreen) */}
        {isFullscreen && isOpen && (
          <div
            className="chat-fullscreen-backdrop"
            onClick={() => setIsFullscreen(false)}
          />
        )}

        {/* Teaser Bubble (Showed before opening chat) */}
        <AnimatePresence>
          {showTeaser && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(true)}
              style={{
                position: 'absolute',
                bottom: '70px',
                right: '0px',
                width: 'max-content',
                maxWidth: '260px',
                padding: '10px 14px',
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(79, 124, 255, 0.4)',
                borderRadius: '16px 16px 4px 16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(79,124,255,0.2)',
                color: '#F8FAFC',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.4) 0%, rgba(79, 124, 255, 0.4) 100%)',
                  border: '1px solid rgba(45, 212, 191, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 0 12px rgba(45, 212, 191, 0.4)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img
                  src="/assets/ayokerja-bot-avatar.png"
                  alt="AyoKerja Bot"
                  onError={(e) => { e.target.src = '/assets/robot/robot-welcome.webp'; }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }}
                />
              </div>
              <div>
                <span style={{ fontWeight: 600, display: 'block', fontSize: '12px', color: '#2DD4BF' }}>
                  AyoKerja Bot
                </span>
                <span style={{ color: '#CBD5E1', fontSize: '12px' }}>{L('Tanya seputar CV & Karir!', 'Ask about CVs & Careers!')}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTeaser(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '2px',
                  marginLeft: '4px',
                }}
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Popup Box with 3D MacBook Unfolding Opening Animation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              layout
              initial={{
                opacity: 0,
                scale: 0.25,
                rotateX: -35,
                rotateY: 8,
                y: 80,
                transformOrigin: 'bottom right',
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateX: 0,
                rotateY: 0,
                y: 0,
                transition: {
                  type: 'spring',
                  stiffness: 300,
                  damping: 24,
                  mass: 0.75,
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.3,
                rotateX: -25,
                y: 50,
                transition: { duration: 0.2, ease: 'easeIn' },
              }}
              className={`chat-popup-box ${isFullscreen ? 'is-fullscreen' : ''}`}
            >
              {/* Header */}
              <div
                style={{
                  padding: isFullscreen ? '16px 24px' : '14px 18px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(20, 184, 166, 0.25) 100%)',
                        border: '1px solid rgba(45, 212, 191, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 14px rgba(20, 184, 166, 0.3)',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <Bot size={22} color="#2DD4BF" style={{ position: 'absolute' }} />
                      <video
                        src={ROBOT_CS_WEBM}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                          width: '40px',
                          height: '40px',
                          objectFit: 'contain',
                          mixBlendMode: 'screen',
                          filter: 'brightness(1.05) contrast(1.1) drop-shadow(0 0 6px rgba(45, 212, 191, 0.4))',
                          pointerEvents: 'none',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#2DD4BF',
                        border: '2.5px solid #0B1121',
                        boxShadow: '0 0 8px #2DD4BF',
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#F8FAFC' }}>
                        AyoKerja Assistant
                      </h4>
                      <Sparkles size={13} color="#4F7CFF" />
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{L('AI Karir • Online & Siap Bantu', 'Career AI • Online & Ready to Help')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Reset Obrolan */}
                  <button
                    onClick={handleResetChat}
                    title={L('Reset Obrolan', 'Reset Chat')}
                    className="chat-header-btn"
                  >
                    <RotateCcw size={15} />
                  </button>

                  {/* Salin Seluruh Obrolan */}
                  <button
                    onClick={handleCopyAllMessages}
                    title={isAllCopied ? L('Semua Percakapan Tersalin!', 'All Messages Copied!') : L('Salin Seluruh Obrolan', 'Copy All Chat')}
                    className="chat-header-btn"
                  >
                    {isAllCopied ? <Check size={15} color="#2DD4BF" /> : <Copy size={15} />}
                  </button>

                  {/* Layar Penuh / Perkecil */}
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={isFullscreen ? L('Perkecil Tampilan (Esc)', 'Exit Fullscreen (Esc)') : L('Layar Penuh', 'Full Screen')}
                    className="chat-header-btn"
                  >
                    {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  </button>

                  {/* Tutup Chat */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsFullscreen(false);
                    }}
                    title={L('Tutup Chat (Esc)', 'Close Chat (Esc)')}
                    className="chat-header-btn chat-header-btn-close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Message Body Area */}
              <div
                style={{
                  flex: 1,
                  padding: isFullscreen ? '20px 24px' : '16px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    maxWidth: isFullscreen ? '860px' : '100%',
                    width: '100%',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          maxWidth: isFullscreen ? '780px' : '88%',
                          flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                        }}
                      >
                        {/* Avatar */}
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background:
                              msg.sender === 'user'
                                ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                                : 'linear-gradient(135deg, #4F7CFF 0%, #22D3EE 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        >
                          {msg.sender === 'user' ? (
                            <User size={14} color="#FFF" />
                          ) : (
                            <Bot size={14} color="#FFF" />
                          )}
                        </div>

                        {/* Bubble Text */}
                        <div
                          style={{
                            padding: isFullscreen ? '12px 18px' : '10px 14px',
                            borderRadius:
                              msg.sender === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                            background:
                              msg.sender === 'user'
                                ? 'linear-gradient(135deg, #4F7CFF 0%, #4338CA 100%)'
                                : 'rgba(255, 255, 255, 0.05)',
                            border:
                              msg.sender === 'user'
                                ? '1px solid rgba(79, 124, 255, 0.4)'
                                : '1px solid rgba(255, 255, 255, 0.09)',
                            color: '#F8FAFC',
                            fontSize: isFullscreen ? '14px' : '13px',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          <FormattedMessage text={msg.text} isUser={msg.sender === 'user'} />
                        </div>
                      </div>

                      {/* Footer Info: Time & Copy Action */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '4px',
                          paddingLeft: msg.sender === 'ai' ? '36px' : '0',
                          paddingRight: msg.sender === 'user' ? '36px' : '0',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            color: '#64748B',
                          }}
                        >
                          {msg.time}
                        </span>

                        {/* Copy Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          title={copiedId === msg.id ? L('Tersalin!', 'Copied!') : L('Salin Pesan', 'Copy Message')}
                          className="chat-bubble-copy-btn"
                          style={{
                            background: copiedId === msg.id ? 'rgba(45, 212, 191, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            border: copiedId === msg.id ? '1px solid rgba(45, 212, 191, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '6px',
                            padding: '2px 7px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '10px',
                            color: copiedId === msg.id ? '#2DD4BF' : '#94A3B8',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (copiedId !== msg.id) {
                              e.currentTarget.style.color = '#F8FAFC';
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (copiedId !== msg.id) {
                              e.currentTarget.style.color = '#94A3B8';
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            }
                          }}
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check size={11} color="#2DD4BF" />
                              <span style={{ fontWeight: 600 }}>{L('Tersalin!', 'Copied!')}</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>{L('Salin', 'Copy')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #4F7CFF 0%, #22D3EE 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Bot size={14} color="#FFF" />
                      </div>
                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: '4px 16px 16px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.09)',
                          display: 'flex',
                          gap: '4px',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '11px', color: '#94A3B8', marginRight: '6px' }}>
                          {L('AI berpikir', 'AI is thinking')}
                        </span>
                        <motion.div
                          animate={{ scale: [1, 1.4, 1] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                          style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#4F7CFF' }}
                        />
                        <motion.div
                          animate={{ scale: [1, 1.4, 1] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                          style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6366F1' }}
                        />
                        <motion.div
                          animate={{ scale: [1, 1.4, 1] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                          style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#8B5CF6' }}
                        />
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Quick Prompts Bar: Dihapus saat pesan sudah diunggah/ada percakapan agar tidak menghalangi */}
              <AnimatePresence>
                {(messages.length <= 1 || showPromptsManual) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      padding: '0 14px 10px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      overflow: 'hidden',
                      maxWidth: isFullscreen ? '860px' : '100%',
                      margin: '0 auto',
                      width: '100%',
                    }}
                  >
                    {QUICK_PROMPTS.map((prompt, idx) => {
                      const IconComp = prompt.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setShowPromptsManual(false);
                            handleSendMessage(prompt.text);
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '20px',
                            padding: '6px 12px',
                            color: '#CBD5E1',
                            fontSize: '11px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            textAlign: 'left',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(79, 124, 255, 0.15)';
                            e.currentTarget.style.borderColor = 'rgba(79, 124, 255, 0.4)';
                            e.currentTarget.style.color = '#F8FAFC';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.color = '#CBD5E1';
                          }}
                        >
                          <IconComp size={12} color="#4F7CFF" />
                          <span>{prompt.text}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Area */}
              <div
                style={{
                  padding: isFullscreen ? '14px 24px' : '12px 14px',
                  background: 'rgba(15, 23, 42, 0.95)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    maxWidth: isFullscreen ? '860px' : '100%',
                    margin: '0 auto',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {/* Prompt Ideas Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setShowPromptsManual((prev) => !prev)}
                      title={showPromptsManual ? L('Tutup Ide Topik', 'Close Topic Ideas') : L('Ide Pertanyaan Karir', 'Career Topic Ideas')}
                      style={{
                        background: showPromptsManual ? 'rgba(79, 124, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: showPromptsManual ? '1px solid rgba(79, 124, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        width: '38px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: showPromptsManual ? '#38BDF8' : '#94A3B8',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#F8FAFC';
                        e.currentTarget.style.borderColor = 'rgba(79, 124, 255, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = showPromptsManual ? '#38BDF8' : '#94A3B8';
                        e.currentTarget.style.borderColor = showPromptsManual ? 'rgba(79, 124, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      <Lightbulb size={16} />
                    </button>

                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={L('Ketik pertanyaan karirmu...', 'Type your career question...')}
                      disabled={isTyping}
                      className="chat-input-field"
                      style={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        color: '#F8FAFC',
                        outline: 'none',
                        transition: 'all 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(79, 124, 255, 0.6)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                    />

                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isTyping}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        background: inputValue.trim() && !isTyping
                          ? 'linear-gradient(135deg, #4F7CFF 0%, #6366F1 100%)'
                          : 'rgba(255, 255, 255, 0.08)',
                        border: 'none',
                        color: '#FFF',
                        cursor: inputValue.trim() && !isTyping ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: inputValue.trim() && !isTyping ? '0 0 15px rgba(79, 124, 255, 0.4)' : 'none',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      <Send size={16} />
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      fontSize: '10px',
                      color: '#64748B',
                    }}
                  >
                    <Sparkles size={10} color="#4F7CFF" />
                    <span>{L('Ditenagai oleh AyoKerja Intelligence Engine', 'Powered by AyoKerja Intelligence Engine')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Trigger Button */}
        {!isFullscreen && (
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="shimmer-badge-info"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              background: isOpen
                ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
                : 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(11, 15, 38, 0.95) 50%, rgba(20, 184, 166, 0.25) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(45, 212, 191, 0.45)',
              boxShadow: isOpen
                ? '0 10px 25px rgba(0, 0, 0, 0.6)'
                : '0 8px 25px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 0 18px rgba(45, 212, 191, 0.25)',
              color: '#FFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              outline: 'none',
              overflow: 'hidden',
            }}
          >
            {isOpen ? (
              <ChevronDown size={28} className="text-teal-300" />
            ) : (
              <>
                <Bot size={26} color="#2DD4BF" style={{ position: 'absolute' }} />
                <video
                  src={CS_ROBOT_WEBM}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                    mixBlendMode: 'screen',
                    pointerEvents: 'none',
                    filter: 'brightness(1.05) contrast(1.1) drop-shadow(0 0 6px rgba(45, 212, 191, 0.5))',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
                {/* Soft Pulse Glow ring */}
                <span
                  style={{
                    position: 'absolute',
                    inset: '-2px',
                    borderRadius: '22px',
                    border: '1.5px solid rgba(45, 212, 191, 0.4)',
                    animation: 'pulseGlow 2.5s infinite',
                    pointerEvents: 'none',
                  }}
                />
              </>
            )}
          </motion.button>
        )}
      </div>

      <style>{`
        .chat-bubble-fixed-wrapper {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          transition: all 0.3s ease;
        }

        /* Fullscreen mode wrapper */
        .chat-bubble-fixed-wrapper.has-fullscreen {
          position: fixed !important;
          inset: 0 !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100dvh !important;
          max-width: 100vw !important;
          max-height: 100dvh !important;
          z-index: 999999 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 20px !important;
        }

        .chat-fullscreen-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(4, 8, 20, 0.78);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 1;
        }

        .chat-popup-box {
          position: absolute;
          bottom: 76px;
          right: 0;
          width: calc(100vw - 32px);
          max-width: 410px;
          height: 570px;
          max-height: calc(100vh - 120px);
          background: rgba(11, 17, 33, 0.95);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(45, 212, 191, 0.35);
          border-radius: 24px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(20, 184, 166, 0.25);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 2;
        }

        .chat-popup-box.is-fullscreen {
          position: relative !important;
          bottom: auto !important;
          right: auto !important;
          width: min(980px, calc(100vw - 32px)) !important;
          max-width: 1020px !important;
          height: min(880px, calc(100dvh - 40px)) !important;
          max-height: calc(100dvh - 40px) !important;
          border-radius: 24px !important;
          border: 1.5px solid rgba(45, 212, 191, 0.45) !important;
          box-shadow: 0 35px 90px rgba(0, 0, 0, 0.9), 0 0 60px rgba(45, 212, 191, 0.3) !important;
        }

        .chat-header-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 6px;
          color: #94A3B8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          min-width: 30px;
          min-height: 30px;
        }

        .chat-header-btn:hover {
          color: #F8FAFC;
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.18);
        }

        .chat-header-btn-close:hover {
          color: #F43F5E !important;
          background: rgba(244, 63, 94, 0.15) !important;
          border-color: rgba(244, 63, 94, 0.3) !important;
        }

        .chat-input-field {
          font-size: 14px;
        }

        /* Elevate on mobile to sit comfortably above mobile bottom dock */
        @media (max-width: 1023px) {
          .chat-bubble-fixed-wrapper:not(.has-fullscreen) {
            bottom: 96px !important;
            right: 16px !important;
          }
        }

        /* Mobile Responsive Adjustments */
        @media (max-width: 767px) {
          .chat-bubble-fixed-wrapper.has-fullscreen {
            padding: 0 !important;
          }

          .chat-popup-box.is-fullscreen {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100dvh !important;
            max-height: 100dvh !important;
            border-radius: 0 !important;
            border: none !important;
            padding-top: env(safe-area-inset-top, 0px) !important;
            padding-bottom: env(safe-area-inset-bottom, 0px) !important;
          }

          .chat-bubble-fixed-wrapper:not(.has-fullscreen) .chat-popup-box {
            position: fixed !important;
            bottom: 96px !important;
            right: 12px !important;
            left: 12px !important;
            width: auto !important;
            max-width: none !important;
            height: auto !important;
            max-height: min(540px, calc(100dvh - 110px)) !important;
          }

          .chat-input-field {
            font-size: 16px !important; /* Prevents auto-zoom on iOS */
          }
        }

        /* Hide completely during printing and PDF exports */
        @media print {
          .chat-bubble-fixed-wrapper {
            display: none !important;
            visibility: hidden !important;
          }
        }

        @keyframes pulseGlow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.12);
            opacity: 0.2;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );
}
