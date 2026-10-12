import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { 
  Map, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Send, 
  MessageSquare, 
  Bot, 
  User, 
  RefreshCw, 
  Zap, 
  Target, 
  Clock, 
  ListTodo, 
  FolderGit2, 
  Award, 
  Activity, 
  FileText,
  AlertCircle,
  Edit3,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  X,
  Lock,
  Upload,
  ShieldAlert,
  Check,
  Compass,
  Flame,
  ArrowRight,
  Building2,
  Globe,
  Layers,
  Sparkle,
  Rocket,
  Crown,
  ShieldCheck,
  Box,
  Maximize2,
  Radio,
  Cpu
} from 'lucide-react';
import axios from 'axios';
import useBilingual from '../../i18n/useBilingual';

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

    const regex = /(\*\*(?:[^*]|\*[^*])+\*\*|\*(?:[^*])+\*|`[^`]+`)/g;
    const parts = safeContent.split(regex);

    return parts.map((part, idx) => {
      if (!part) return null;

      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        const clean = part.slice(2, -2);
        return (
          <span
            key={idx}
            className={isUser ? 'font-extrabold text-slate-950' : 'font-extrabold text-teal-300'}
          >
            {clean}
          </span>
        );
      }

      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        const clean = part.slice(1, -1);
        return (
          <span key={idx} className="italic opacity-90">
            {clean}
          </span>
        );
      }

      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        const clean = part.slice(1, -1);
        return (
          <code
            key={idx}
            className="bg-slate-800 text-teal-300 px-1.5 py-0.5 rounded text-[11px] font-mono border border-slate-700"
          >
            {clean}
          </code>
        );
      }

      return part;
    });
  };

  return (
    <div className="flex flex-col gap-1">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} className="h-1.5" />;
        }

        const bulletMatch = line.match(/^(\s*)([-*•])\s+(.*)/);
        if (bulletMatch) {
          return (
            <div key={lIdx} className="flex items-start gap-1.5 ml-0.5">
              <span className={`font-bold select-none ${isUser ? 'text-slate-950' : 'text-teal-400'}`}>•</span>
              <div className="flex-1">{renderInline(bulletMatch[3])}</div>
            </div>
          );
        }

        const numMatch = line.match(/^(\s*)(\d+[\.\)])\s+(.*)/);
        if (numMatch) {
          return (
            <div key={lIdx} className="flex items-start gap-1.5 ml-0.5">
              <span className={`font-semibold select-none ${isUser ? 'text-slate-950' : 'text-teal-400'}`}>{numMatch[2]}</span>
              <div className="flex-1">{renderInline(numMatch[3])}</div>
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

const pageContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const pageSectionVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * RoadmapContentSkeleton — Futuristic Shimmer Skeleton Placeholder for View Transitions
 */
function RoadmapContentSkeleton({ mode = '3dmap', isConsulting = false, L }) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Dynamic Status Notification during AI Building */}
      {isConsulting && (
        <div className="p-4 rounded-2xl bg-teal-500/15 border border-teal-500/35 flex items-center justify-between gap-3 text-xs text-teal-300">
          <div className="flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin text-teal-400" />
            <span className="font-extrabold">{L ? L('AI sedang meracik dan memetakan alur roadmap...', 'AI is building and mapping your roadmap...') : 'AI sedang meracik dan memetakan alur roadmap...'}</span>
          </div>
          <span className="text-[11px] text-teal-400/80 font-mono">100% Neural Matching</span>
        </div>
      )}

      {mode === '3dmap' && (
        <div className="space-y-5">
          {/* Top Control Bar Skeleton */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-800" />
              <div className="space-y-2">
                <div className="h-5 w-48 bg-slate-800 rounded-lg" />
                <div className="h-3 w-64 bg-slate-800/60 rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-28 bg-slate-800 rounded-xl" />
              <div className="h-8 w-36 bg-teal-500/20 rounded-xl" />
            </div>
          </div>

          {/* 3D Map Canvas Skeleton */}
          <div className="relative rounded-3xl bg-slate-950/80 border border-slate-800/80 p-8 min-h-[480px] overflow-hidden flex flex-col items-center justify-around gap-6">
            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-20 bg-teal-500/30 rounded-full" />
                    <div className="h-4 w-12 bg-slate-800 rounded" />
                  </div>
                  <div className="h-5 w-4/5 bg-slate-800 rounded-lg" />
                  <div className="h-3 w-full bg-slate-800/60 rounded" />
                  <div className="flex gap-1.5 pt-2">
                    <div className="h-5 w-14 bg-slate-800/50 rounded-md" />
                    <div className="h-5 w-16 bg-slate-800/50 rounded-md" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              {[4, 5].map((i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-24 bg-indigo-500/30 rounded-full" />
                    <div className="h-4 w-14 bg-slate-800 rounded" />
                  </div>
                  <div className="h-5 w-3/4 bg-slate-800 rounded-lg" />
                  <div className="h-3 w-5/6 bg-slate-800/60 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === 'roadmap' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div className="h-6 w-52 bg-slate-800 rounded-lg" />
            <div className="h-8 w-32 bg-teal-500/20 rounded-xl" />
          </div>

          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4 w-full max-w-2xl">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex-shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-28 bg-teal-500/30 rounded-full" />
                    <div className="h-3 w-20 bg-slate-800 rounded" />
                  </div>
                  <div className="h-5 w-2/3 bg-slate-800 rounded-lg" />
                  <div className="h-3 w-5/6 bg-slate-800/60 rounded" />
                  <div className="flex gap-2 pt-1">
                    <div className="h-4 w-16 bg-slate-800/50 rounded" />
                    <div className="h-4 w-20 bg-slate-800/50 rounded" />
                    <div className="h-4 w-24 bg-slate-800/50 rounded" />
                  </div>
                </div>
              </div>
              <div className="h-8 w-24 bg-slate-800 rounded-xl flex-shrink-0" />
            </div>
          ))}
        </div>
      )}

      {mode === 'chat' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20" />
            <div className="space-y-1.5">
              <div className="h-5 w-44 bg-slate-800 rounded" />
              <div className="h-3 w-32 bg-slate-800/60 rounded" />
            </div>
          </div>

          <div className="space-y-4 py-4 min-h-[300px]">
            <div className="flex items-start gap-3 max-w-lg">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex-shrink-0" />
              <div className="p-4 rounded-2xl bg-slate-800/80 w-full space-y-2">
                <div className="h-3.5 w-full bg-slate-700/80 rounded" />
                <div className="h-3.5 w-5/6 bg-slate-700/80 rounded" />
                <div className="h-3.5 w-3/4 bg-slate-700/80 rounded" />
              </div>
            </div>

            <div className="flex items-start justify-end gap-3 ml-auto max-w-md">
              <div className="p-4 rounded-2xl bg-indigo-600/30 w-full space-y-2">
                <div className="h-3.5 w-4/5 bg-indigo-400/40 rounded" />
                <div className="h-3.5 w-2/3 bg-indigo-400/40 rounded" />
              </div>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex-shrink-0" />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto py-2 border-t border-slate-800">
            <div className="h-8 w-48 bg-slate-800 rounded-xl flex-shrink-0" />
            <div className="h-8 w-56 bg-slate-800 rounded-xl flex-shrink-0" />
            <div className="h-8 w-40 bg-slate-800 rounded-xl flex-shrink-0" />
          </div>

          <div className="h-12 w-full bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between px-4">
            <div className="h-4 w-60 bg-slate-800 rounded" />
            <div className="w-8 h-8 rounded-xl bg-teal-500/30" />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Generate intelligent 5-stage milestones tailored to user's role and detected CV skills
 */
function getRoleTailoredNodes(roleName = 'Backend Developer', userSkills = [], isEn = false) {
  const roleLower = (roleName || '').toLowerCase();

  // 1. Frontend / React / Web UI
  if (roleLower.includes('front') || roleLower.includes('react') || roleLower.includes('vue') || roleLower.includes('angular') || roleLower.includes('web design')) {
    return isEn ? [
      {
        step: 1,
        title: `Stage 1: Core Modern Frontend & Component Architecture`,
        timeframe: "Month 1 - 2",
        status: "YOU ARE HERE",
        current: true,
        desc: `Master modern ES6+, React 19 Core, Clean Component Structure, and responsive styling with Tailwind CSS.`,
        action_items: [
          "Build reusable UI components with strict TypeScript prop types",
          "Implement responsive layouts with Tailwind CSS and mobile-first design",
          "Optimize resume and portfolio for Harvard ATS standards"
        ],
        recommended_projects: [`Modern Component Library & Dashboard UI`],
        key_skills: ["React", "JavaScript", "Tailwind CSS", "TypeScript"]
      },
      {
        step: 2,
        title: `Stage 2: State Management & Async API Integration`,
        timeframe: "Month 3 - 4",
        status: "IN PROGRESS",
        current: false,
        desc: `Handle complex global states using Zustand/TanStack Query and seamless REST/GraphQL API consumption.`,
        action_items: [
          "Implement global client state management with Zustand",
          "Integrate TanStack Query for caching, polling, and optimistic updates",
          "Build robust form handling with Zod and React Hook Form"
        ],
        recommended_projects: [`Real-Time Collaborative Web Application`],
        key_skills: ["Zustand", "TanStack Query", "REST API", "Zod"]
      },
      {
        step: 3,
        title: `Stage 3: Next.js App Router & Web Performance`,
        timeframe: "Month 5 - 7",
        status: "NEXT GOAL",
        current: false,
        desc: `Master Server Components, SSR/SSG rendering, SEO metadata, and Core Web Vitals optimization.`,
        action_items: [
          "Migrate applications to Next.js App Router with Server Components",
          "Achieve 95+ Google Lighthouse scores across LCP, INP, and CLS metrics",
          "Setup image optimization, dynamic imports, and bundle splitting"
        ],
        recommended_projects: [`High-Performance Next.js E-Commerce Portal`],
        key_skills: ["Next.js", "SSR/SSG", "Core Web Vitals", "SEO"]
      },
      {
        step: 4,
        title: `Stage 4: Automated Testing & CI/CD Pipeline`,
        timeframe: "Month 8 - 10",
        status: "FUTURE GOAL",
        current: false,
        desc: `Ensure bulletproof UI reliability through automated unit, integration, and E2E testing pipelines.`,
        action_items: [
          "Write Unit & Component Tests using Vitest and React Testing Library",
          "Implement End-to-End tests using Playwright for critical user flows",
          "Configure GitHub Actions to automatically run linter and test suites"
        ],
        recommended_projects: [`Fully Tested Enterprise Web App with Playwright E2E`],
        key_skills: ["Vitest", "Playwright", "Testing Library", "GitHub Actions"]
      },
      {
        step: 5,
        title: `Stage 5: Principal Frontend Architect & Remote Ready`,
        timeframe: "Month 11 - 12",
        status: "CAREER TARGET",
        current: false,
        desc: `Architect scalable micro-frontends, lead technical design decisions, and secure high-paying remote roles.`,
        action_items: [
          "Prepare for Frontend System Design interviews (Virtual DOM, SSR Caching, Micro-Frontends)",
          "Publish open-source packages or write in-depth technical case studies",
          "Apply to tech unicorn companies and global remote positions"
        ],
        recommended_projects: [`Micro-Frontend Architecture Enterprise Showcase`],
        key_skills: ["System Design", "Micro-Frontends", "Tech Leadership", "Remote Work"]
      }
    ] : [
      {
        step: 1,
        title: `Tahap 1: Penguatan Core Frontend & Arsitektur Komponen`,
        timeframe: "Bulan 1 - 2",
        status: "YOU ARE HERE",
        current: true,
        desc: `Menguasai ES6+ modern, React 19 Core, struktur komponen bersih, dan styling responsif dengan Tailwind CSS.`,
        action_items: [
          "Bangun komponen UI reusable dengan strict TypeScript types",
          "Terapkan layout responsif mobile-first dengan Tailwind CSS",
          "Optimasi ringkasan pengalaman dan keyword format Harvard ATS"
        ],
        recommended_projects: [`Koleksi UI Component Library & Dashboard`],
        key_skills: ["React", "JavaScript", "Tailwind CSS", "TypeScript"]
      },
      {
        step: 2,
        title: `Tahap 2: Manajemen State Global & Integrasi API Async`,
        timeframe: "Bulan 3 - 4",
        status: "IN PROGRESS",
        current: false,
        desc: `Mengelola state kompleks aplikasi menggunakan Zustand/TanStack Query dan konsumsi API REST/GraphQL.`,
        action_items: [
          "Implementasikan state management global dengan Zustand",
          "Gunakan TanStack Query untuk caching data dan optimistic updates",
          "Validasi formulir dinamis dengan React Hook Form & Zod"
        ],
        recommended_projects: [`Aplikasi Kolaborasi Real-Time Berbasis Web`],
        key_skills: ["Zustand", "TanStack Query", "REST API", "Zod"]
      },
      {
        step: 3,
        title: `Tahap 3: Next.js App Router & Optimasi Web Vitals`,
        timeframe: "Bulan 5 - 7",
        status: "NEXT GOAL",
        current: false,
        desc: `Menguasai Server Components, rendering SSR/SSG, metadata SEO, dan optimasi Core Web Vitals.`,
        action_items: [
          "Migrasi aplikasi ke Next.js App Router dengan Server Components",
          "Raih skor 95+ Google Lighthouse untuk metrik LCP, INP, dan CLS",
          "Terapkan image optimization, code-splitting, dan lazy loading"
        ],
        recommended_projects: [`Portal E-Commerce Cepat dengan Next.js SSR`],
        key_skills: ["Next.js", "SSR/SSG", "Core Web Vitals", "SEO"]
      },
      {
        step: 4,
        title: `Tahap 4: Automated Testing & CI/CD Pipeline`,
        timeframe: "Bulan 8 - 10",
        status: "FUTURE GOAL",
        current: false,
        desc: `Menjamin keandalan antarmuka melalui pengujian unit, integrasi, dan pipeline E2E otomatis.`,
        action_items: [
          "Tulis unit & component test dengan Vitest dan React Testing Library",
          "Implementasikan End-to-End test dengan Playwright untuk alur krusial",
          "Konfigurasi GitHub Actions untuk menjalankan build dan test otomatis"
        ],
        recommended_projects: [`Aplikasi Web Enterprise Teruji Otomatis`],
        key_skills: ["Vitest", "Playwright", "Testing Library", "GitHub Actions"]
      },
      {
        step: 5,
        title: `Tahap 5: Principal Frontend Architect & Kesiapan Remote`,
        timeframe: "Bulan 11 - 12",
        status: "CAREER TARGET",
        current: false,
        desc: `Merancang micro-frontends berskala besar, memimpin keputusan arsitektur UI, dan siap berkarir remote global.`,
        action_items: [
          "Kuasai Frontend System Design (Virtual DOM, SSR Caching, Micro-Frontends)",
          "Publikasikan package open-source atau studi kasus teknis mendalam",
          "Melamar ke lowongan tech unicorn dan posisi remote internasional"
        ],
        recommended_projects: [`Portofolio Arsitektur Micro-Frontend Skala Besar`],
        key_skills: ["System Design", "Micro-Frontends", "Tech Leadership", "Remote Work"]
      }
    ];
  }

  // 2. UI/UX Designer / Product Designer
  if (roleLower.includes('design') || roleLower.includes('ui') || roleLower.includes('ux') || roleLower.includes('figma')) {
    return isEn ? [
      {
        step: 1,
        title: `Stage 1: Visual Design Fundamentals & Figma Mastery`,
        timeframe: "Month 1 - 2",
        status: "YOU ARE HERE",
        current: true,
        desc: `Master typography, spatial grids, modern design standards, and advanced Figma Auto-Layout.`,
        action_items: [
          "Master Figma Auto-Layout, Components, and Variant properties",
          "Apply 8pt grid system, accessible contrast, and visual hierarchy",
          "Curate case study portfolio highlighting problem-solving process"
        ],
        recommended_projects: [`Mobile App Redesign & Visual Spec`],
        key_skills: ["Figma", "Auto-Layout", "Visual Hierarchy", "Typography"]
      },
      {
        step: 2,
        title: `Stage 2: User Research & Interactive Prototyping`,
        timeframe: "Month 3 - 4",
        status: "IN PROGRESS",
        current: false,
        desc: `Conduct user interviews, wireframing, journey mapping, and high-fidelity smart animated prototypes.`,
        action_items: [
          "Conduct user interviews and synthesize insights into User Personas",
          "Create low-fidelity wireframes and user flow journey maps",
          "Build advanced interactive prototypes with Figma Smart Animate"
        ],
        recommended_projects: [`End-to-End User Experience Case Study`],
        key_skills: ["User Research", "Wireframing", "Smart Animate", "Journey Mapping"]
      },
      {
        step: 3,
        title: `Stage 3: Scalable Design Systems & Token Architecture`,
        timeframe: "Month 5 - 7",
        status: "NEXT GOAL",
        current: false,
        desc: `Build enterprise design systems with design tokens, variable modes, and developer handoff specs.`,
        action_items: [
          "Establish scalable Design Tokens for colors, spacing, and typography",
          "Create dark/light variable modes in Figma",
          "Document component guidelines for seamless frontend developer handoff"
        ],
        recommended_projects: [`Multi-Brand Enterprise Design System`],
        key_skills: ["Design Systems", "Design Tokens", "Figma Variables", "Dev Handoff"]
      },
      {
        step: 4,
        title: `Stage 4: Usability Testing, CRO & Product Analytics`,
        timeframe: "Month 8 - 10",
        status: "FUTURE GOAL",
        current: false,
        desc: `Validate designs with user testing, analyze conversion funnels, and optimize product metrics.`,
        action_items: [
          "Run moderated & unmoderated Usability Testing with Maze / Lookback",
          "Analyze user funnels using Mixpanel / Hotjar heatmaps",
          "Formulate A/B testing hypotheses to boost signup conversion"
        ],
        recommended_projects: [`Data-Driven Product Optimization Report`],
        key_skills: ["Usability Testing", "CRO", "Product Analytics", "A/B Testing"]
      },
      {
        step: 5,
        title: `Stage 5: Lead Product Designer & Design Strategy`,
        timeframe: "Month 11 - 12",
        status: "CAREER TARGET",
        current: false,
        desc: `Drive product vision, align business goals with user needs, and interview for Senior Product Design roles.`,
        action_items: [
          "Lead product discovery workshops and strategic roadmap definition",
          "Publish a polished web portfolio showcasing 3 high-impact case studies",
          "Apply for Senior Product Designer and global remote positions"
        ],
        recommended_projects: [`Strategic Product Innovation Whitepaper`],
        key_skills: ["Design Strategy", "Product Vision", "Leadership", "Executive Pitching"]
      }
    ] : [
      {
        step: 1,
        title: `Tahap 1: Penguasaan Visual UI & Figma Auto-Layout`,
        timeframe: "Bulan 1 - 2",
        status: "YOU ARE HERE",
        current: true,
        desc: `Menguasai tipografi, spatial grid 8pt, hierarki visual modern, dan fitur Auto-Layout Figma.`,
        action_items: [
          "Kuasai Figma Auto-Layout, Components, dan Variants secara mendalam",
          "Terapkan sistem grid 8pt dan standar kontras aksesibilitas WCAG",
          "Susun ringkasan portofolio kasus nyata yang berorientasi solusi"
        ],
        recommended_projects: [`Redesain Aplikasi Mobile & Visual Guideline`],
        key_skills: ["Figma", "Auto-Layout", "Visual Hierarchy", "Typography"]
      },
      {
        step: 2,
        title: `Tahap 2: Riset Pengguna & Prototyping Interaktif`,
        timeframe: "Bulan 3 - 4",
        status: "IN PROGRESS",
        current: false,
        desc: `Melakukan wawancara pengguna, wireframing, pemetaan journey, dan animasi interaktif tingkat lanjut.`,
        action_items: [
          "Lakukan wawancara pengguna dan formulasikan User Persona",
          "Buat wireframe dan alur user flow yang komprehensif",
          "Bangun prototipe interaktif menggunakan Figma Smart Animate"
        ],
        recommended_projects: [`Studi Kasus UX End-to-End Aplikasi Web`],
        key_skills: ["User Research", "Wireframing", "Smart Animate", "Journey Mapping"]
      },
      {
        step: 3,
        title: `Tahap 3: Scalable Design System & Token Variabel`,
        timeframe: "Bulan 5 - 7",
        status: "NEXT GOAL",
        current: false,
        desc: `Membangun sistem desain skala enterprise dengan design tokens, mode variabel, dan spesifikasi handoff.`,
        action_items: [
          "Bangun Design Tokens modular untuk warna, spasi, dan tipografi",
          "Konfigurasikan variabel mode tema Dark/Light di Figma",
          "Dokumentasikan panduan komponen untuk developer handoff"
        ],
        recommended_projects: [`Sistem Desain Multi-Platform Enterprise`],
        key_skills: ["Design Systems", "Design Tokens", "Figma Variables", "Dev Handoff"]
      },
      {
        step: 4,
        title: `Tahap 4: Usability Testing, CRO & Analitik Produk`,
        timeframe: "Bulan 8 - 10",
        status: "FUTURE GOAL",
        current: false,
        desc: `Memvalidasi desain dengan uji coba pengguna, analisis funnel, dan optimasi konversi bisnis.`,
        action_items: [
          "Jalankan Usability Testing terstruktur menggunakan Maze / Lookback",
          "Analisis perilaku pengguna melalui heatmap Hotjar / Mixpanel",
          "Rancang hipotesis uji A/B untuk meningkatkan tingkat konversi"
        ],
        recommended_projects: [`Laporan Optimasi UX Berbasis Data Metrik`],
        key_skills: ["Usability Testing", "CRO", "Product Analytics", "A/B Testing"]
      },
      {
        step: 5,
        title: `Tahap 5: Lead Product Designer & Strategi Desain`,
        timeframe: "Bulan 11 - 12",
        status: "CAREER TARGET",
        current: false,
        desc: `Memimpin visi desain produk, menyelaraskan tujuan bisnis, dan bersiap untuk posisi Lead / Senior.`,
        action_items: [
          "Fasilitasi workshop discovery produk dan perencanaan roadmap fitur",
          "Luncurkan portofolio web dengan 3 studi kasus berdampak tinggi",
          "Melamar ke posisi Senior / Lead Product Designer remote global"
        ],
        recommended_projects: [`Portofolio Strategi Produk Inovatif`],
        key_skills: ["Design Strategy", "Product Vision", "Leadership", "Executive Pitching"]
      }
    ];
  }

  // 3. Data / AI / Machine Learning
  if (roleLower.includes('data') || roleLower.includes('ai') || roleLower.includes('machine') || roleLower.includes('analyst') || roleLower.includes('scientist')) {
    return isEn ? [
      {
        step: 1,
        title: `Stage 1: Advanced SQL & Python Data Wrangling`,
        timeframe: "Month 1 - 2",
        status: "YOU ARE HERE",
        current: true,
        desc: `Master complex SQL queries, window functions, and data cleansing using Python Pandas/NumPy.`,
        action_items: [
          "Write complex SQL queries utilizing CTEs and Window Functions",
          "Cleanse, normalize, and transform raw messy datasets with Pandas",
          "Conduct Exploratory Data Analysis (EDA) to discover business patterns"
        ],
        recommended_projects: [`End-to-End Raw Data Cleansing & EDA Pipeline`],
        key_skills: ["SQL", "Python", "Pandas", "NumPy"]
      },
      {
        step: 2,
        title: `Stage 2: Business Intelligence & Interactive Dashboards`,
        timeframe: "Month 3 - 4",
        status: "IN PROGRESS",
        current: false,
        desc: `Build automated executive KPI dashboards using Tableau or Power BI with automated data refresh.`,
        action_items: [
          "Design executive metric dashboards tracking revenue and retention",
          "Model relational star/snowflake schemas for BI performance",
          "Automate weekly report summaries for business stakeholders"
        ],
        recommended_projects: [`Executive KPI Dashboard in PowerBI / Tableau`],
        key_skills: ["Power BI", "Tableau", "Data Modeling", "Business Metrics"]
      },
      {
        step: 3,
        title: `Stage 3: Machine Learning & Predictive Modeling`,
        timeframe: "Month 5 - 7",
        status: "NEXT GOAL",
        current: false,
        desc: `Train supervised and unsupervised machine learning algorithms using Scikit-Learn.`,
        action_items: [
          "Train classification and regression models (Random Forest, XGBoost)",
          "Evaluate model metrics with Cross-Validation and Confusion Matrices",
          "Deploy models as REST API endpoints using FastAPI"
        ],
        recommended_projects: [`Customer Churn Predictive Engine with FastAPI`],
        key_skills: ["Scikit-Learn", "XGBoost", "FastAPI", "Model Evaluation"]
      },
      {
        step: 4,
        title: `Stage 4: Deep Learning & LLM / AI Applications`,
        timeframe: "Month 8 - 10",
        status: "FUTURE GOAL",
        current: false,
        desc: `Implement Neural Networks with PyTorch, Vector Search, and generative AI RAG systems.`,
        action_items: [
          "Build deep neural network architectures using PyTorch",
          "Integrate LLM APIs with LangChain and vector databases (Pinecone/Chroma)",
          "Implement Retrieval-Augmented Generation (RAG) for internal knowledge bases"
        ],
        recommended_projects: [`Generative AI RAG Chat Assistant for Enterprise`],
        key_skills: ["PyTorch", "LLM Integration", "LangChain", "Vector DB"]
      },
      {
        step: 5,
        title: `Stage 5: Principal AI & Data Architect`,
        timeframe: "Month 11 - 12",
        status: "CAREER TARGET",
        current: false,
        desc: `Lead end-to-end MLOps deployment pipelines and drive corporate AI decision-making.`,
        action_items: [
          "Setup automated MLOps pipelines using MLflow and Docker",
          "Architect large-scale distributed data pipelines with Apache Spark",
          "Apply for Senior Data Scientist and AI Lead positions worldwide"
        ],
        recommended_projects: [`Production-Grade Distributed AI Architecture`],
        key_skills: ["MLOps", "Apache Spark", "Docker", "Data Architecture"]
      }
    ] : [
      {
        step: 1,
        title: `Tahap 1: SQL Lanjutan & Pengolahan Data dengan Python`,
        timeframe: "Bulan 1 - 2",
        status: "YOU ARE HERE",
        current: true,
        desc: `Menguasai query SQL kompleks, window functions, dan pembersihan data menggunakan Pandas/NumPy.`,
        action_items: [
          "Tulis query SQL kompleks dengan CTE dan Window Functions",
          "Bersihkan dan transformasikan dataset mentah dengan Pandas",
          "Lakukan Exploratory Data Analysis (EDA) untuk menemukan pola bisnis"
        ],
        recommended_projects: [`Pipeline Pembersihan Data & EDA End-to-End`],
        key_skills: ["SQL", "Python", "Pandas", "NumPy"]
      },
      {
        step: 2,
        title: `Tahap 2: Business Intelligence & Dashboard Interaktif`,
        timeframe: "Bulan 3 - 4",
        status: "IN PROGRESS",
        current: false,
        desc: `Membangun dashboard KPI eksekutif menggunakan Power BI / Tableau dengan pembaruan otomatis.`,
        action_items: [
          "Rancang dashboard analitik pelacak revenue dan retensi pengguna",
          "Model skema database star/snowflake untuk performa laporan BI",
          "Otomatisasi pengiriman ringkasan data mingguan bagi manajemen"
        ],
        recommended_projects: [`Dashboard Eksekutif KPI di PowerBI / Tableau`],
        key_skills: ["Power BI", "Tableau", "Data Modeling", "Business Metrics"]
      },
      {
        step: 3,
        title: `Tahap 3: Machine Learning & Pemodelan Prediktif`,
        timeframe: "Bulan 5 - 7",
        status: "NEXT GOAL",
        current: false,
        desc: `Melatih algoritma machine learning supervised & unsupervised dengan Scikit-Learn dan XGBoost.`,
        action_items: [
          "Latih model klasifikasi dan regresi (Random Forest, XGBoost)",
          "Evaluasi performa model dengan Cross-Validation & ROC-AUC",
          "Deploy model prediksi ke endpoint API menggunakan FastAPI"
        ],
        recommended_projects: [`Sistem Prediksi Churn Pelanggan dengan FastAPI`],
        key_skills: ["Scikit-Learn", "XGBoost", "FastAPI", "Model Evaluation"]
      },
      {
        step: 4,
        title: `Tahap 4: Deep Learning & Aplikasi Generatif AI / RAG`,
        timeframe: "Bulan 8 - 10",
        status: "FUTURE GOAL",
        current: false,
        desc: `Mengembangkan Neural Networks dengan PyTorch, vector embeddings, dan sistem AI RAG modern.`,
        action_items: [
          "Bangun arsitektur neural network menggunakan PyTorch",
          "Integrasikan LLM API dengan LangChain dan vector database",
          "Terapkan Retrieval-Augmented Generation (RAG) untuk dokumen perusahaan"
        ],
        recommended_projects: [`AI Assistant RAG Enterprise untuk Dokumen Bisnis`],
        key_skills: ["PyTorch", "LLM Integration", "LangChain", "Vector DB"]
      },
      {
        step: 5,
        title: `Tahap 5: Principal AI & Data Architect`,
        timeframe: "Bulan 11 - 12",
        status: "CAREER TARGET",
        current: false,
        desc: `Memimpin pipeline MLOps produksi dan merancang strategi arsitektur data berskala besar.`,
        action_items: [
          "Konfigurasikan pipeline MLOps otomatis dengan MLflow dan Docker",
          "Rancang arsitektur pipeline data terdistribusi dengan Apache Spark",
          "Melamar ke posisi Senior Data Scientist dan AI Specialist internasional"
        ],
        recommended_projects: [`Arsitektur AI & Data Terdistribusi Skala Produksi`],
        key_skills: ["MLOps", "Apache Spark", "Docker", "Data Architecture"]
      }
    ];
  }

  // 4. Default / Backend Developer
  const baseSkills = (userSkills && userSkills.length > 0) ? userSkills.slice(0, 4) : ["PHP", "Laravel", "MySQL", "REST API"];
  return isEn ? [
    {
      step: 1,
      title: `Stage 1: Core ${roleName} & Clean Code Mastery`,
      timeframe: "Month 1 - 2",
      status: "YOU ARE HERE",
      current: true,
      desc: `Master primary syntax, decoupled architecture, Service-Repository Pattern, and ATS CV enhancements.`,
      action_items: [
        "Refactor business logic into a dedicated Service Layer",
        "Implement FormRequest Validation & Standard API Responses",
        "Optimize experience summary and keywords for Harvard ATS format"
      ],
      recommended_projects: [`RESTful ${roleName} Monolith API Refactored`],
      key_skills: baseSkills
    },
    {
      step: 2,
      title: "Stage 2: Automated Testing & Caching Layer",
      timeframe: "Month 3 - 4",
      status: "IN PROGRESS",
      current: false,
      desc: "Implement Unit & Integration Testing alongside Redis Caching strategies for high performance.",
      action_items: [
        "Write Unit Tests with Pest / PHPUnit (target 75%+ coverage)",
        "Apply Redis Caching for frequently accessed data endpoints",
        "Integrate automated API Documentation using Swagger"
      ],
      recommended_projects: ["High-Speed Cached API Engine with Test Suite"],
      key_skills: ["Redis", "Unit Testing", "Pest", "Swagger"]
    },
    {
      step: 3,
      title: "Stage 3: Containerization & CI/CD Pipeline",
      timeframe: "Month 5 - 7",
      status: "NEXT GOAL",
      current: false,
      desc: "Isolate services with Docker containers and build automated deployment pipelines.",
      action_items: [
        "Create multi-stage Dockerfile & docker-compose for isolated database",
        "Setup GitHub Actions CI/CD for automated test & image builds",
        "Deploy application to cloud VPS (Linux, Nginx, SSL)"
      ],
      recommended_projects: ["Dockerized API Micro-Service with Automated CI/CD Pipeline"],
      key_skills: ["Docker", "Docker Compose", "GitHub Actions", "Linux"]
    },
    {
      step: 4,
      title: "Stage 4: Message Queues & Event-Driven Architecture",
      timeframe: "Month 8 - 10",
      status: "FUTURE GOAL",
      current: false,
      desc: "Handle large-scale background data processing using RabbitMQ / Redis Queues.",
      action_items: [
        "Implement Queue Workers for asynchronous email & task processing",
        "Install APM monitoring (Sentry / Grafana) for error tracking",
        "Design database indexing & large-scale query optimization"
      ],
      recommended_projects: ["High-Traffic Event-Driven Queue Engine"],
      key_skills: ["RabbitMQ", "Queue Workers", "Sentry", "Database Indexing"]
    },
    {
      step: 5,
      title: "Stage 5: Senior Tech Lead & System Design Mastery",
      timeframe: "Month 11 - 12",
      status: "CAREER TARGET",
      current: false,
      desc: "Lead distributed system architecture decisions and prepare for Senior/Lead level technical interviews.",
      action_items: [
        "Prepare for System Design Interviews (Load Balancing, Rate Limiting, Sharding)",
        "Write technical articles or contribute to Open Source projects",
        "Apply to tech unicorn companies / remote overseas positions"
      ],
      recommended_projects: ["Enterprise Distributed Architecture Portfolio"],
      key_skills: ["System Design", "Tech Leadership", "Distributed Systems"]
    }
  ] : [
    {
      step: 1,
      title: `Tahap 1: Penguatan Core ${roleName} & Clean Code`,
      timeframe: "Bulan 1 - 2",
      status: "YOU ARE HERE",
      current: true,
      desc: `Menguasai sintaks utama, arsitektur terpisah, Service-Repository Pattern, dan penguatan CV ATS.`,
      action_items: [
        "Refactor logika controller ke Service Layer terpisah",
        "Implementasikan FormRequest Validation & Standard API Response",
        "Optimasi ringkasan pengalaman dan keyword CV format Harvard ATS"
      ],
      recommended_projects: [`RESTful ${roleName} Monolith API Refactored`],
      key_skills: baseSkills
    },
    {
      step: 2,
      title: "Tahap 2: Automated Testing & Caching Layer",
      timeframe: "Bulan 3 - 4",
      status: "IN PROGRESS",
      current: false,
      desc: "Mengimplementasikan Unit & Integration Testing serta strategi Redis Caching untuk performa tinggi.",
      action_items: [
        "Tulis Unit Test dengan Pest / PHPUnit (target 75%+ coverage)",
        "Terapkan Redis Caching untuk endpoint data yang sering diakses",
        "Integrasikan Dokumentasi API otomatis dengan Swagger"
      ],
      recommended_projects: ["High-Speed Cached API Engine with Test Suite"],
      key_skills: ["Redis", "Unit Testing", "Pest", "Swagger"]
    },
    {
      step: 3,
      title: "Tahap 3: Containerization & CI/CD Pipeline",
      timeframe: "Bulan 5 - 7",
      status: "NEXT GOAL",
      current: false,
      desc: "Mengisolasi service dengan Docker container dan membangun pipeline otomatisasi deployment.",
      action_items: [
        "Buat multi-stage Dockerfile & docker-compose untuk database isolasi",
        "Setup GitHub Actions CI/CD untuk otomatisasi test & build image",
        "Deploy aplikasi ke cloud VPS (Linux, Nginx, SSL)"
      ],
      recommended_projects: ["Dockerized API Micro-Service with Automated CI/CD Pipeline"],
      key_skills: ["Docker", "Docker Compose", "GitHub Actions", "Linux"]
    },
    {
      step: 4,
      title: "Tahap 4: Message Queues & Event-Driven Architecture",
      timeframe: "Bulan 8 - 10",
      status: "FUTURE GOAL",
      current: false,
      desc: "Menangani pemrosesan background data besar menggunakan RabbitMQ / Redis Queues.",
      action_items: [
        "Implementasikan Queue Workers untuk asynchronous email & task processing",
        "Pasang APM monitoring (Sentry / Grafana) untuk error tracking",
        "Merancang database indexing & query optimization skala besar"
      ],
      recommended_projects: ["High-Traffic Event-Driven Queue Engine"],
      key_skills: ["RabbitMQ", "Queue Workers", "Sentry", "Database Indexing"]
    },
    {
      step: 5,
      title: "Tahap 5: Senior Tech Lead & System Design Mastery",
      timeframe: "Bulan 11 - 12",
      status: "CAREER TARGET",
      current: false,
      desc: "Memimpin keputusan arsitektur sistem terdistribusi dan kesiapan wawancara level Senior/Lead.",
      action_items: [
        "Persiapan System Design Interview (Load Balancing, Rate Limiting, Sharding)",
        "Tulis artikel teknis atau kontribusi Open Source",
        "Melamar ke perusahaan tech unicorn / remote overseas"
      ],
      recommended_projects: ["Enterprise Distributed Architecture Portfolio"],
      key_skills: ["System Design", "Tech Leadership", "Distributed Systems"]
    }
  ];
}

export default function CareerRoadmap({ stats = {}, user = {}, jobs = [] }) {

  const { isEn, L, T } = useBilingual();
  // Verify CV or active profile presence flexibly so logged in users are never incorrectly blocked
  const activeCv = stats?.activeCv || null;
  const userHasSkills = Boolean(stats?.userSkills && stats.userSkills.length > 0);
  const userHasRole = Boolean(user?.role || user?.target_role);
  const userHasCompletedOnboarding = Boolean(user?.onboarding_completed);
  
  // Unlock roadmap whenever active user profile, skills, CV, or onboarding is present
  const hasCv = Boolean(
    stats?.hasCv || 
    activeCv || 
    stats?.cvScore !== null || 
    userHasSkills || 
    userHasRole || 
    userHasCompletedOnboarding ||
    Boolean(user?.email || user?.name)
  );

  const userName = user?.name || L('Kandidat', 'Candidate');
  const initialRole = stats?.savedRoadmap?.target_role || activeCv?.detected_role || activeCv?.role_target || user?.target_role || user?.role || 'Backend Developer';
  const [targetRole, setTargetRole] = useState(initialRole);
  const userLevel = user?.level ? T(user.level) : L('Junior Level', 'Junior Level');
  const atsScore = activeCv?.ats_score || stats?.cvScore || 85;
  const cvFilename = activeCv?.filename || 'CV_Profil.pdf';
  const userSkills = stats?.userSkills || (user?.skills_list ? (typeof user.skills_list === 'string' ? user.skills_list.split(',').map(s => s.trim()) : Array.isArray(user.skills_list) ? user.skills_list : ['PHP', 'Laravel', 'MySQL']) : ['PHP', 'Laravel', 'MySQL']);

  // Active View Mode: '3dmap', 'roadmap', or 'chat'
  const [viewMode, setViewMode] = useState('3dmap');
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [is3DTilted, setIs3DTilted] = useState(true);
  const [inspectingNode, setInspectingNode] = useState(null);

  // Smooth View Mode Switcher with Skeleton Loader Transition
  const handleViewModeChange = (mode) => {
    if (mode === viewMode) return;
    setIsViewLoading(true);
    setViewMode(mode);
    setTimeout(() => {
      setIsViewLoading(false);
    }, 260);
  };

  // Loading & Toast Notification States
  const [isConsulting, setIsConsulting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Role Switcher Modal & Custom Role States
  const [isSwitchRoleModalOpen, setIsSwitchRoleModalOpen] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [showQuickPromptsManual, setShowQuickPromptsManual] = useState(false);

  // Selected Node Detail Modal State
  const [selectedNode, setSelectedNode] = useState(null);

  // Edit / Create Node Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNodeIndex, setEditingNodeIndex] = useState(null); // null if adding new node
  const [nodeFormData, setNodeFormData] = useState({
    title: '',
    timeframe: '',
    status: 'IN PROGRESS',
    current: false,
    desc: '',
    action_items_text: '',
    recommended_projects_text: '',
    key_skills_text: ''
  });

  // Checklist state for action items with persistent storage
  const checklistStorageKey = `career_ai_checklist_${user?.email || 'guest'}`;
  const [completedItems, setCompletedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(`career_ai_checklist_${user?.email || 'guest'}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(checklistStorageKey, JSON.stringify(completedItems));
    } catch (e) {}
  }, [completedItems, checklistStorageKey]);

  // Chat Conversation State
  const [conversation, setConversation] = useState([
    {
      sender: 'ai',
      text: isEn
        ? `Hello **${userName}**! I am your **Senior Tech Career Consultant AI**.\n\nI have analyzed your CV data (\`${cvFilename}\` with ATS Score **${atsScore}/100**) for the **${targetRole}** role.\n\nFeel free to **ask anything** about your career goals (e.g. switching roles, learning a new stack, overseas remote jobs, or salary promotions), and I will automatically build and refine your visual career roadmap!`
        : `Halo **${userName}**! Saya adalah **Senior Tech Career Consultant AI**.\n\nSaya telah menganalisis data CV Anda (\`${cvFilename}\` dengan Skor ATS **${atsScore}/100**) untuk target posisi **${targetRole}**.\n\nAnda dapat **curhat secara bebas** tentang impian karir Anda (misalnya: switch role, belajar stack baru, target remote overseas, atau promosi gaji), dan saya akan secara otomatis menyusun serta menyesuaikan peta jalan karir (*roadmap*) Anda di tab visual!`,
      timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');

  // Quick Prompts / Interactive Chips
  const [quickPrompts, setQuickPrompts] = useState(isEn ? [
    "I want to focus on reaching Senior Backend level & doubling my salary",
    "Please create a roadmap focused on DevOps, Docker & Kubernetes",
    "I want a career roadmap for applying to Overseas Remote Jobs",
    "I'm confused about choosing a specialization: Microservices vs Data Engineering"
  ] : [
    "Saya ingin fokus naik ke level Senior Backend & Gaji 2x lipat",
    "Tolong buatkan roadmap fokus belajar DevOps, Docker & Kubernetes",
    "Saya ingin karir roadmap untuk melamar Lowongan Remote Overseas",
    "Saya bingung menentukan spesialisasi: Microservices vs Data Engineering"
  ]);

  // Master Plan Summary Title
  const [masterPlanSummary, setMasterPlanSummary] = useState(
    isEn
      ? `Real-Time Career Roadmap for ${targetRole} — Tailored to ${cvFilename}`
      : `Peta Jalan Karir Real-Time ${targetRole} — Disesuaikan dengan ${cvFilename}`
  );

  // Dynamic Initial Roadmap Nodes tailored to User's Role & Skills
  const defaultInitialNodes = getRoleTailoredNodes(targetRole, userSkills, isEn);

  // User-specific localStorage key
  const storageKey = `career_ai_roadmap_${user?.email || 'guest'}`;

  // Load saved nodes from server stats, localStorage or use tailored defaults
  const [nodes, setNodes] = useState(() => {
    if (stats?.savedRoadmap?.nodes && Array.isArray(stats.savedRoadmap.nodes) && stats.savedRoadmap.nodes.length > 0) {
      return stats.savedRoadmap.nodes;
    }
    if (!hasCv) return defaultInitialNodes;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved roadmap from localStorage');
    }
    return defaultInitialNodes;
  });

  // Real-time synchronization when CV is uploaded or changes
  const prevCvIdRef = useRef(activeCv?.id || null);
  useEffect(() => {
    if (!activeCv) return;
    if (prevCvIdRef.current !== activeCv.id) {
      prevCvIdRef.current = activeCv.id;
      const detectedRole = activeCv.detected_role || activeCv.role_target || targetRole;
      if (detectedRole && detectedRole !== targetRole) {
        setTargetRole(detectedRole);
      }
      const cvSkills = activeCv.skills || userSkills;
      const tailoredNodes = getRoleTailoredNodes(detectedRole, cvSkills, isEn);
      setNodes(tailoredNodes);
      setMasterPlanSummary(
        isEn
          ? `Real-Time Career Roadmap for ${detectedRole} — Tailored to ${activeCv.filename || 'CV'}`
          : `Peta Jalan Karir Real-Time ${detectedRole} — Disesuaikan dengan ${activeCv.filename || 'CV'}`
      );
      showToast(
        isEn
          ? `✨ Roadmap successfully updated in real-time from CV: ${activeCv.filename || 'CV'}`
          : `✨ Roadmap berhasil diperbarui real-time dari CV: ${activeCv.filename || 'CV'}`
      );
    }
  }, [activeCv?.id, activeCv?.filename, activeCv?.detected_role, isEn]);

  // Interactive Entry State & Task Counter for HUD
  const [showEntryHud, setShowEntryHud] = useState(true);
  const totalTasksCount = nodes?.reduce((acc, curr) => acc + (curr.action_items?.length || 0), 0) || 0;
  const completedTasksCount = Object.keys(completedItems).filter(k => completedItems[k]).length;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Save nodes to localStorage on change
  useEffect(() => {
    if (!hasCv) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(nodes));
    } catch (e) {
      console.warn('Failed to save roadmap to localStorage');
    }
  }, [nodes, hasCv, storageKey]);

  // Sync nodes, prompts, & masterPlanSummary whenever language toggles
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) {
        setNodes(defaultInitialNodes);
      }
    } catch (e) {}

    setQuickPrompts(isEn ? [
      "I want to focus on reaching Senior Backend level & doubling my salary",
      "Please create a roadmap focused on DevOps, Docker & Kubernetes",
      "I want a career roadmap for applying to Overseas Remote Jobs",
      "I'm confused about choosing a specialization: Microservices vs Data Engineering"
    ] : [
      "Saya ingin fokus naik ke level Senior Backend & Gaji 2x lipat",
      "Tolong buatkan roadmap fokus belajar DevOps, Docker & Kubernetes",
      "Saya ingin karir roadmap untuk melamar Lowongan Remote Overseas",
      "Saya bingung menentukan spesialisasi: Microservices vs Data Engineering"
    ]);

    setMasterPlanSummary(
      isEn
        ? `Real-Time Career Roadmap for ${targetRole} — Tailored to ${cvFilename}`
        : `Peta Jalan Karir Real-Time ${targetRole} — Disesuaikan dengan ${cvFilename}`
    );
  }, [isEn, storageKey]);

  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartCurhat = (customPrompt = null, autoSend = false) => {
    handleViewModeChange('chat');
    setTimeout(() => {
      scrollToBottom();
      chatInputRef.current?.focus();
      if (customPrompt) {
        if (autoSend) {
          handleConsultAi(customPrompt);
        } else {
          setInputMessage(customPrompt);
        }
      }
    }, 150);
  };

  useEffect(() => {
    const handleAskEvent = (e) => {
      if (e.detail && e.detail.prompt) {
        handleStartCurhat(e.detail.prompt, true);
      }
    };
    window.addEventListener('ask-career-ai', handleAskEvent);
    return () => window.removeEventListener('ask-career-ai', handleAskEvent);
  }, []);

  useEffect(() => {
    if (viewMode === 'chat') {
      scrollToBottom();
      setTimeout(() => chatInputRef.current?.focus(), 150);
    }
  }, [conversation, viewMode]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Trigger automatic initial AI roadmap generation if user hasn't generated one
  const handleGenerateInitialAiRoadmap = async () => {
    if (isConsulting || !hasCv) return;
    setIsConsulting(true);
    showToast(L("✨ AI sedang menganalisis CV kamu untuk menyusun Roadmap terpersonalisasi...", "✨ AI is analyzing your CV to build a personalized Roadmap..."));
    try {
      const response = await axios.post('/api/career-roadmap/consult', {
        message: isEn
          ? `Please generate a 100% personalized 12-month career roadmap for the target position ${targetRole} based on my CV.`
          : `Tolong buatkan peta jalan karir 12 bulan yang 100% terpersonalisasi untuk posisi target ${targetRole} berdasarkan CV saya.`,
        history: []
      });

      if (response.data && response.data.success && response.data.data) {
        const resData = response.data.data;
        if (resData.nodes && resData.nodes.length > 0) {
          const newNodes = resData.nodes.map((nd, i) => ({
            ...nd,
            step: i + 1
          }));
          setNodes(newNodes);
          if (resData.master_plan_summary) setMasterPlanSummary(resData.master_plan_summary);
          showToast(L("✨ Peta Jalan Karir AI berhasil dibuat berdasarkan CV kamu!", "✨ AI Career Roadmap successfully generated based on your CV!"));
        }
      }
    } catch (err) {
      console.warn('Error generating initial AI roadmap:', err);
    } finally {
      setIsConsulting(false);
    }
  };

  const hasUserChatted = conversation.some(m => m.sender === 'user');

  // Popular Preset Career Tracks for Instant Roadmap Switching
  const popularTracks = [
    {
      role: 'Fullstack Developer',
      icon: '🚀',
      desc: isEn ? 'React 19, Node.js / Laravel API, Cloud Deploy & CI/CD' : 'React 19, Backend API tangguh (Node/Laravel) & Deployment Cloud'
    },
    {
      role: 'Backend Engineer & System Architect',
      icon: '⚙️',
      desc: isEn ? 'Clean Architecture, High Concurrency, Redis, RabbitMQ & Microservices' : 'Clean Architecture, Beban Tinggi, Redis Caching, RabbitMQ & Microservices'
    },
    {
      role: 'Frontend Developer',
      icon: '🎨',
      desc: isEn ? 'React 19, TypeScript, Next.js App Router, Tailwind CSS v4 & Web Vitals' : 'React 19, TypeScript, Next.js App Router, Tailwind CSS v4 & Web Vitals'
    },
    {
      role: 'DevOps & Cloud Engineer',
      icon: '☁️',
      desc: isEn ? 'Docker, CI/CD GitHub Actions, Kubernetes, Terraform IaC & Observability' : 'Docker, CI/CD GitHub Actions, Kubernetes, Terraform IaC & Observability'
    },
    {
      role: 'Cybersecurity Specialist',
      icon: '🛡️',
      desc: isEn ? 'Network Hardening, Vulnerability Assessment, OWASP Top 10 & SOC Operations' : 'Network Hardening, Vulnerability Assessment, OWASP Top 10 & SOC Operations'
    },
    {
      role: 'AI & Machine Learning Engineer',
      icon: '🤖',
      desc: isEn ? 'Python, PyTorch Deep Learning, LLM & RAG Vector Architecture, MLOps API' : 'Python, PyTorch Deep Learning, LLM & RAG Vector Architecture, MLOps API'
    },
    {
      role: 'Mobile App Developer',
      icon: '📱',
      desc: isEn ? 'Flutter / Dart, Cross-Platform UI, Local Database Sync & App Store Release' : 'Flutter / Dart, Cross-Platform UI, Sinkronisasi Lokal & App Store Release'
    },
    {
      role: 'Data Analyst & BI',
      icon: '📊',
      desc: isEn ? 'Advanced SQL, Python EDA, PowerBI/Tableau Executive Dashboards & A/B Testing' : 'Advanced SQL, Python EDA, Dashboard PowerBI/Tableau & A/B Testing'
    },
    {
      role: 'Senior Remote Engineer (Overseas)',
      icon: '🌐',
      desc: isEn ? 'System Design Interview, High Salary USD Contracts, Global ATS CV Standard' : 'System Design Interview, Kontrak Remote USD, Standar Global ATS CV'
    },
    {
      role: 'UI/UX & Product Designer',
      icon: '✨',
      desc: isEn ? 'Figma Auto-Layout, Design Systems, Usability Testing & Interactive Prototypes' : 'Figma Auto-Layout, Design Systems, Usability Testing & Interactive Prototypes'
    }
  ];

  // Handle Instant Roadmap Switching by Target Role
  const handleSwitchRoadmap = async (newRole) => {
    if (!newRole || isConsulting) return;
    setIsSwitchRoleModalOpen(false);
    setTargetRole(newRole);
    setIsConsulting(true);
    showToast(L(`🚀 AI sedang merancang ulang roadmap untuk ${newRole}...`, `🚀 AI is rebuilding roadmap for ${newRole}...`));

    const promptMessage = isEn
      ? `Please build and switch my 12-month career roadmap to ${newRole} with 5 detailed, realistic stages.`
      : `Tolong buatkan dan alihkan peta jalan karir 12 bulan saya ke arah spesialisasi ${newRole} lengkap dengan 5 tahap konkret dan portofolio nyata.`;

    const userMsg = {
      sender: 'user',
      text: isEn ? `Switch roadmap to: ${newRole}` : `Ganti roadmap karir ke: ${newRole}`,
      timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setConversation(prev => [...prev, userMsg]);
    if (viewMode !== 'chat') {
      handleViewModeChange('chat');
    }

    try {
      const response = await axios.post('/api/career-roadmap/consult', {
        message: promptMessage,
        target_role: newRole,
        history: conversation.slice(-4)
      });

      if (response.data && response.data.success && response.data.data) {
        const resData = response.data.data;
        const finalRole = resData.target_role || newRole;
        setTargetRole(finalRole);

        let generatedNodes = [];
        if (resData.nodes && resData.nodes.length > 0) {
          generatedNodes = resData.nodes.map((nd, i) => ({
            ...nd,
            step: i + 1
          }));
          setNodes(generatedNodes);

          // Save to server database
          axios.post('/api/career-roadmap/save', {
            nodes: generatedNodes,
            target_role: finalRole
          }).catch(e => console.warn('Failed to save roadmap to DB', e));
        }

        if (resData.master_plan_summary) {
          setMasterPlanSummary(resData.master_plan_summary);
        }

        const aiMsg = {
          sender: 'ai',
          text: resData.ai_reply || L(`Roadmap karir berhasil dialihkan ke ${finalRole}!`, `Career roadmap successfully switched to ${finalRole}!`),
          timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' }),
          updatedNodes: generatedNodes.length > 0 ? generatedNodes : null,
          roleTarget: finalRole
        };
        setConversation(prev => [...prev, aiMsg]);

        if (resData.quick_prompts && resData.quick_prompts.length > 0) {
          setQuickPrompts(resData.quick_prompts);
        }

        showToast(L(`✨ Roadmap karir berhasil dialihkan ke ${finalRole}!`, `✨ Career roadmap successfully switched to ${finalRole}!`));
      }
    } catch (err) {
      console.error('Error switching roadmap:', err);
      showToast(L("Gagal mengalihkan roadmap. Silakan coba lagi.", "Failed to switch roadmap. Please try again."));
    } finally {
      setIsConsulting(false);
    }
  };

  // Reset conversation to initial welcome message
  const handleResetChat = () => {
    setConversation([
      {
        sender: 'ai',
        text: isEn
          ? `Hello **${userName}**! I am your **Senior Tech Career Consultant AI**.\n\nI have analyzed your CV data (\`${cvFilename}\` with ATS Score **${atsScore}/100**) for the **${targetRole}** role.\n\nFeel free to **ask anything** about your career goals (e.g. switching roles, learning a new stack, overseas remote jobs, or salary promotions), and I will automatically build and refine your visual career roadmap!`
          : `Halo **${userName}**! Saya adalah **Senior Tech Career Consultant AI**.\n\nSaya telah menganalisis data CV Anda (\`${cvFilename}\` dengan Skor ATS **${atsScore}/100**) untuk target posisi **${targetRole}**.\n\nAnda dapat **curhat secara bebas** tentang impian karir Anda (misalnya: switch role, belajar stack baru, target remote overseas, atau promosi gaji), dan saya akan secara otomatis menyusun serta menyesuaikan peta jalan karir (*roadmap*) Anda di tab visual!`,
        timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setShowQuickPromptsManual(false);
    showToast(L("Obrolan curhat telah di-reset.", "Chat has been reset."));
  };

  // Handle AI Consultation & Chat (Curhat)
  const handleConsultAi = async (customText = null) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isConsulting) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setConversation(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsConsulting(true);

    try {
      const response = await axios.post('/api/career-roadmap/consult', {
        message: textToSend,
        target_role: targetRole,
        history: conversation.slice(-6)
      });

      if (response.data && response.data.success && response.data.data) {
        const resData = response.data.data;
        const newRole = resData.target_role || targetRole;
        if (newRole !== targetRole) {
          setTargetRole(newRole);
        }

        let hasNewNodes = false;
        let generatedNodes = [];
        if (resData.nodes && resData.nodes.length > 0) {
          generatedNodes = resData.nodes.map((nd, i) => ({
            ...nd,
            step: i + 1
          }));
          setNodes(generatedNodes);
          hasNewNodes = true;

          // Save to server database
          axios.post('/api/career-roadmap/save', {
            nodes: generatedNodes,
            target_role: newRole
          }).catch(e => console.warn('Failed to auto-save roadmap to DB', e));
        }

        if (resData.master_plan_summary) {
          setMasterPlanSummary(resData.master_plan_summary);
        }

        const aiMsg = {
          sender: 'ai',
          text: resData.ai_reply || L('Berikut rekomendasi penyesuaian alur roadmap karir untuk kamu.', 'Here are the recommended updates for your career roadmap.'),
          timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' }),
          updatedNodes: hasNewNodes ? generatedNodes : null,
          roleTarget: newRole
        };
        setConversation(prev => [...prev, aiMsg]);

        if (resData.quick_prompts && resData.quick_prompts.length > 0) {
          setQuickPrompts(resData.quick_prompts);
        }

        if (hasNewNodes) {
          showToast(L("✨ AI telah memperbarui alur Peta Jalan Karir!", "✨ AI has updated your Career Roadmap path!"));
        }
      } else {
        throw new Error('Respon server tidak valid');
      }
    } catch (err) {
      console.error('Error roadmap consultation:', err);
      const fallbackMsg = {
        sender: 'ai',
        text: isEn
          ? `Thank you for sharing! Based on your **${targetRole}** qualifications, I have prepared the best strategic path. You can review and edit your roadmap in the Visual Roadmap tab.`
          : `Terima kasih atas curhat Anda! Berdasarkan kualifikasi **${targetRole}**, saya telah menyusun alur strategi terbaik. Anda dapat meninjau dan meng-edit alur roadmap di tab Peta Jalan Visual.`,
        timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setConversation(prev => [...prev, fallbackMsg]);
    } finally {
      setIsConsulting(false);
    }
  };

  // Helper function to normalize steps (1, 2, 3...)
  const normalizeNodeSteps = (nodeList) => {
    return nodeList.map((nd, idx) => ({
      ...nd,
      step: idx + 1
    }));
  };

  // Move Node Up (Ubah Alur Roadmap)
  const handleMoveUp = (e, index) => {
    e.stopPropagation();
    if (index <= 0) return;
    const updated = [...nodes];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setNodes(normalizeNodeSteps(updated));
    showToast(isEn ? `Stage ${index + 1} moved to Stage ${index}.` : `Urutan Tahap ${index + 1} dipindahkan ke Tahap ${index}.`);
  };

  // Move Node Down (Ubah Alur Roadmap)
  const handleMoveDown = (e, index) => {
    e.stopPropagation();
    if (index >= nodes.length - 1) return;
    const updated = [...nodes];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setNodes(normalizeNodeSteps(updated));
    showToast(isEn ? `Stage ${index + 1} moved to Stage ${index + 2}.` : `Urutan Tahap ${index + 1} dipindahkan ke Tahap ${index + 2}.`);
  };

  // Delete Node (Hapus Fitur Roadmap Step)
  const handleDeleteNode = (e, index) => {
    e.stopPropagation();
    const targetTitle = nodes[index]?.title || (isEn ? `Stage ${index + 1}` : `Tahap ${index + 1}`);
    if (window.confirm(isEn ? `Are you sure you want to remove "${targetTitle}" from your roadmap?` : `Apakah Anda yakin ingin menghapus "${targetTitle}" dari alur roadmap?`)) {
      const updated = nodes.filter((_, i) => i !== index);
      setNodes(normalizeNodeSteps(updated));
      showToast(isEn ? `Stage "${targetTitle}" deleted.` : `Tahap "${targetTitle}" berhasil dihapus.`);
    }
  };

  // Open Edit Node Modal
  const handleOpenEditModal = (e, index) => {
    if (e) e.stopPropagation();
    const target = nodes[index];
    setEditingNodeIndex(index);
    setNodeFormData({
      title: target.title || '',
      timeframe: target.timeframe || '',
      status: target.status || 'IN PROGRESS',
      current: Boolean(target.current),
      desc: target.desc || '',
      action_items_text: Array.isArray(target.action_items) ? target.action_items.join('\n') : '',
      recommended_projects_text: Array.isArray(target.recommended_projects) ? target.recommended_projects.join('\n') : '',
      key_skills_text: Array.isArray(target.key_skills) ? target.key_skills.join(', ') : ''
    });
    setIsEditModalOpen(true);
  };

  // Open Create New Node Modal
  const handleOpenCreateModal = () => {
    setEditingNodeIndex(null);
    setNodeFormData({
      title: isEn ? `Stage ${nodes.length + 1}: New Specialization & Skills` : `Tahap ${nodes.length + 1}: Spesialisasi & Skill Baru`,
      timeframe: isEn ? `Month ${nodes.length * 2 + 1} - ${nodes.length * 2 + 2}` : `Bulan ${nodes.length * 2 + 1} - ${nodes.length * 2 + 2}`,
      status: 'NEXT GOAL',
      current: false,
      desc: isEn ? 'Describe goals and key skills for this new stage.' : 'Deskripsikan tujuan dan target keahlian utama pada tahap baru ini.',
      action_items_text: isEn ? 'Action item 1\nAction item 2' : 'Tugas aksi 1\nTugas aksi 2',
      recommended_projects_text: isEn ? 'Portfolio Project Name' : 'Nama Proyek Portofolio',
      key_skills_text: 'Skill1, Skill2'
    });
    setIsEditModalOpen(true);
  };

  // Save Node Changes (Edit or Add)
  const handleSaveNodeForm = (e) => {
    e.preventDefault();
    const actionItemsArr = (nodeFormData.action_items_text || '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    const recProjectsArr = (nodeFormData.recommended_projects_text || '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    const keySkillsArr = (nodeFormData.key_skills_text || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newNodeData = {
      title: nodeFormData.title,
      timeframe: nodeFormData.timeframe,
      status: nodeFormData.status,
      current: Boolean(nodeFormData.current),
      desc: nodeFormData.desc,
      action_items: actionItemsArr.length > 0 ? actionItemsArr : [isEn ? 'Planned action item' : 'Tugas aksi terencana'],
      recommended_projects: recProjectsArr.length > 0 ? recProjectsArr : [isEn ? 'Related Portfolio Project' : 'Proyek Portofolio Terkait'],
      key_skills: keySkillsArr.length > 0 ? keySkillsArr : ['PHP', 'Laravel']
    };

    let updatedNodes = [...nodes];
    if (editingNodeIndex !== null) {
      updatedNodes[editingNodeIndex] = {
        ...updatedNodes[editingNodeIndex],
        ...newNodeData
      };
      showToast(isEn ? `Stage "${nodeFormData.title}" updated.` : `Tahap "${nodeFormData.title}" berhasil diperbarui.`);
    } else {
      updatedNodes.push(newNodeData);
      showToast(isEn ? `New Stage "${nodeFormData.title}" added!` : `Tahap baru "${nodeFormData.title}" berhasil ditambahkan!`);
    }

    setNodes(normalizeNodeSteps(updatedNodes));
    setIsEditModalOpen(false);
  };

  // Reset Roadmap to default initial nodes
  const handleResetToDefault = () => {
    if (window.confirm(isEn ? "Are you sure you want to reset your roadmap to default AI recommendations? All custom edits will be reset." : "Apakah Anda yakin ingin mengembalikan alur roadmap ke rekomendasi awal AI? Semua perubahan kustom Anda akan diriset.")) {
      localStorage.removeItem(storageKey);
      setNodes(defaultInitialNodes);
      showToast(isEn ? "Career Roadmap reset to default AI recommendations." : "Peta Jalan Karir berhasil dikembalikan ke rekomendasi awal AI.");
    }
  };

  const toggleCheckItem = (stepNum, itemIdx) => {
    const key = `${stepNum}-${itemIdx}`;
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleAllItemsInStep = (stepNum, items = []) => {
    if (!items || items.length === 0) return;
    setCompletedItems(prev => {
      const next = { ...prev };
      let allChecked = true;
      for (let i = 0; i < items.length; i++) {
        if (!next[`${stepNum}-${i}`]) {
          allChecked = false;
          break;
        }
      }
      for (let i = 0; i < items.length; i++) {
        next[`${stepNum}-${i}`] = !allChecked;
      }
      return next;
    });
  };

  // Keyboard shortcut listener (ESC to close detail or edit modal)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedNode) setSelectedNode(null);
        if (isEditModalOpen) setIsEditModalOpen(false);
        if (isSwitchRoleModalOpen) setIsSwitchRoleModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, isEditModalOpen, isSwitchRoleModalOpen]);

  // ════════════════════════════════════════════════════════════════════════
  // ── UNLOCKED STATE WHEN USER HAS UPLOADED CV / ACTIVE PROFILE ──
  // ════════════════════════════════════════════════════════════════════════
  return (
    <motion.div initial="hidden" animate="visible" variants={pageContainerVariants} className="space-y-6">
      {/* Toast Notification Floating Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[3000] bg-teal-500 text-slate-950 font-bold px-5 py-3 rounded-2xl shadow-2xl border border-teal-300 text-xs flex items-center gap-2 animate-bounce">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── INTERACTIVE ENTRANCE HUD / RADAR INITIALIZATION BANNER ── */}
      <AnimatePresence>
        {showEntryHud && (
          <motion.div
            variants={pageSectionVariants}
            initial={{ opacity: 0, y: -25, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-teal-500/15 via-[#0B1030] to-indigo-500/15 border border-teal-400/40 shadow-[0_0_35px_rgba(20,184,166,0.22)] backdrop-blur-xl relative overflow-hidden"
          >
            {/* Hologram sweep scan line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-[shimmerSweep_3s_infinite]" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 shrink-0">
                    <Compass size={24} className="animate-spin text-white" style={{ animationDuration: '14s' }} />
                  </div>
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-teal-400 border-2 border-slate-950 animate-ping" />
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-teal-400 border-2 border-slate-950" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                      <Radio size={10} className="text-teal-400 animate-pulse" />
                      <span>AI NEURAL CAREER MATRIX ONLINE</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold">
                      {nodes.length} Level Quest Karir
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-slate-100 flex items-center gap-2">
                    <span>Peta Jalan Menuju <span className="text-teal-300">{targetRole}</span> Siap Dikelola</span>
                    <Sparkles size={16} className="text-teal-400 animate-pulse" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 max-w-xl leading-relaxed">
                    Sistem telah memetakan alur leveling dari posisi <strong className="text-slate-200">{userLevel}</strong> hingga Target Impian dengan skor ATS <strong className="text-teal-300">{atsScore}/100</strong>.
                  </p>
                </div>
              </div>

              {/* Quick Actions & Live Stats inside HUD */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end flex-wrap">
                <div className="px-3.5 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-left">
                  <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Checklist Karir
                  </div>
                  <div className="text-xs font-black text-teal-300 flex items-center gap-1">
                    <span>{completedTasksCount} / {totalTasksCount} Selesai</span>
                    <span className="text-[10px] text-slate-400">({progressPercent}%)</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleViewModeChange('3dmap');
                      const el = document.getElementById('roadmap-active-node');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="px-3 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-teal-300 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm hover:scale-[1.02]"
                  >
                    <Box size={13} />
                    <span>Fokus Peta 3D</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowEntryHud(false)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    title="Tutup Info HUD"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner: Header Profile & AI Consultation Mode Controls */}
      <motion.div variants={pageSectionVariants} className="bg-gradient-to-r from-slate-900 via-[#0B0F28] to-slate-950 border border-teal-500/30 rounded-3xl p-6 sm:p-7 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
              <Compass className="text-teal-400" size={28} />
              <span>{L('Peta Jalan Karir & Mentorship AI', 'AI Career Roadmap & Mentorship')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {L('Disusun otomatis oleh AI dari data CV', 'Automatically built by AI from CV data')} <strong className="text-teal-300">({cvFilename})</strong> {L('dan curhat kamu, serta', 'and your goals,')} <strong className="text-slate-200">{L('100% dapat di-edit, dihapus, atau diubah alurnya.', '100% editable and customizable.')}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* ATS Score Badge */}
            <div className="px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between sm:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center font-black text-teal-300 text-sm shrink-0">
                {atsScore}
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">{L('Skor ATS CV', 'CV ATS Score')}</div>
                <div className="text-xs font-bold text-teal-300">{L('TERVERIFIKASI ATS', 'ATS VERIFIED')}</div>
              </div>
            </div>

            {/* Quick Switch View Buttons with Touch-Friendly Responsive Layout */}
            <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleViewModeChange('3dmap')}
                className={`flex-1 sm:flex-initial py-2.5 sm:py-2 px-3 sm:px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[42px] ${
                  viewMode === '3dmap'
                    ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg shadow-teal-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Box size={14} className={viewMode === '3dmap' ? 'text-yellow-300 animate-pulse' : ''} />
                <span>{L('Peta 3D Isometric', '3D Isometric Map')}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleViewModeChange('roadmap')}
                className={`flex-1 sm:flex-initial py-2.5 sm:py-2 px-3 sm:px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[42px] ${
                  viewMode === 'roadmap'
                    ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Map size={14} />
                <span>{L('List Detail Roadmap', 'Roadmap Detail List')}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleViewModeChange('chat')}
                className={`flex-1 sm:flex-initial py-2.5 sm:py-2 px-3 sm:px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[42px] ${
                  viewMode === 'chat'
                    ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <MessageSquare size={14} />
                <span>{L('Curhat AI Coach', 'AI Coach Advice')}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── REAL-TIME AI CV RECOMMENDATION BANNER ── */}
      {activeCv && (
        <motion.div
          variants={pageSectionVariants}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-teal-500/15 via-[#0A102A] to-indigo-600/15 border border-teal-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-md shadow-teal-500/20 shrink-0">
              <Sparkles size={22} className="animate-spin text-teal-400" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  <span>{L('ROADMAP REKOMENDASI AI CV REAL-TIME', 'REAL-TIME AI CV ROADMAP RECOMMENDATION')}</span>
                </span>
                <span className="text-[11px] font-bold text-slate-300">
                  {cvFilename} • {L('Skor ATS', 'ATS Score')}: <strong className="text-teal-300">{atsScore}/100</strong>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {L(
                  `Roadmap diracik secara otomatis & real-time menyesuaikan spesialisasi ${targetRole} dan skill terverifikasi dari CV kamu.`,
                  `Roadmap is automatically generated in real-time matching ${targetRole} specialization and verified CV skills.`
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 relative z-10">
            <button
              type="button"
              onClick={handleGenerateInitialAiRoadmap}
              disabled={isConsulting}
              className="px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-teal-300 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02] disabled:opacity-50"
            >
              <RefreshCw size={13} className={isConsulting ? 'animate-spin' : ''} />
              <span>{L('Racik Ulang AI', 'Re-tune AI')}</span>
            </button>
          </div>
        </motion.div>
      )}



      {/* Main Content Area based on View Mode with Skeleton Loader transition */}
      {isViewLoading || isConsulting ? (
        <RoadmapContentSkeleton mode={viewMode} isConsulting={isConsulting} L={L} />
      ) : viewMode === '3dmap' ? (
        /* 3D ISOMETRIC SKILL QUEST ROADMAP MAP VIEW */
        <motion.div variants={pageSectionVariants} className="space-y-6">
          {/* Top Control Bar for 3D Map */}
          <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/85 to-indigo-950/50 border border-teal-500/30 rounded-3xl p-5 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shadow-md shadow-cyan-500/20">
                <Box size={22} className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-100">{L('Peta Jalan Karir 3D Isometric', '3D Isometric Career Roadmap')}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {L('Jelajahi alur karir', 'Explore career path for')} <strong className="text-cyan-300 font-bold">{targetRole}</strong> {L('dalam alur peta 3D interaktif. Klik kartu level node untuk inspeksi tugas.', 'in an interactive 3D map. Click node level cards to inspect tasks.')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
              <button
                onClick={() => setIs3DTilted(!is3DTilted)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  is3DTilted
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title={L('Beralih Antara Tampilan 3D Isometric & 2D Flat Map', 'Switch between 3D Isometric & 2D Flat Map view')}
              >
                <Box size={14} />
                <span>{is3DTilted ? L('Sudut 3D Tilted', '3D Tilted View') : L('Tampilan 2D Flat', '2D Flat View')}</span>
              </button>

              <button
                onClick={handleGenerateInitialAiRoadmap}
                disabled={isConsulting}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-teal-500/20 disabled:opacity-50"
              >
                  <Sparkles size={14} />
                  <span>{L('Perbarui Roadmap AI', 'Refresh AI Roadmap')}</span>
              </button>

              <button
                onClick={handleOpenCreateModal}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>{L('Tambah Level', 'Add Level')}</span>
              </button>
            </div>
          </div>

          {/* 3D Map Main Canvas & Sidebar Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* 3D Map Canvas Box (2 Cols) */}
            <div className="lg:col-span-2 bg-[#050816] border border-slate-800/90 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl min-h-[620px] flex flex-col justify-between">
              
              {/* Subtle Ambient Background Cyber Grid */}
              <div className="absolute inset-0 map-grid-bg opacity-40 pointer-events-none" />
              <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* 3D Perspective Container */}
              <div 
                className="relative z-10 py-6 transition-all duration-500"
                style={{
                  perspective: '1200px',
                  transform: is3DTilted ? 'rotateX(18deg) rotateZ(0deg)' : 'none',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* SVG Connecting Laser Pathways Between 3D Nodes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" style={{ minHeight: '520px' }}>
                  <defs>
                    <linearGradient id="laserGrad3d" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.9" />
                      <stop offset="25%" stopColor="#3B82F6" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.9" />
                      <stop offset="75%" stopColor="#EC4899" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  
                  {/* Glowing Pathway Lines connecting steps */}
                  {nodes.map((_, idx) => {
                    if (idx === nodes.length - 1) return null;
                    const y1 = 90 + idx * 170;
                    const y2 = 90 + (idx + 1) * 170;
                    const isEven = idx % 2 === 0;
                    const x1 = isEven ? '30%' : '70%';
                    const x2 = isEven ? '70%' : '30%';

                    return (
                      <g key={idx}>
                        {/* Outer Glow Path */}
                        <path
                          d={`M ${x1} ${y1} C ${x1} ${y1 + 80}, ${x2} ${y2 - 80}, ${x2} ${y2}`}
                          fill="none"
                          stroke="url(#laserGrad3d)"
                          strokeWidth="6"
                          strokeOpacity="0.4"
                          style={{ filter: 'blur(4px)' }}
                        />
                        {/* Core Animated Laser Path */}
                        <path
                          d={`M ${x1} ${y1} C ${x1} ${y1 + 80}, ${x2} ${y2 - 80}, ${x2} ${y2}`}
                          fill="none"
                          stroke="url(#laserGrad3d)"
                          strokeWidth="3.5"
                          strokeDasharray="8 8"
                          style={{ animation: 'laserFlow 2.5s linear infinite' }}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* 3D Nodes Serpentine Layout */}
                <div className="space-y-16 relative z-10">
                  {nodes.map((nd, index) => {
                    const isCurrent = Boolean(nd.current || nd.status === 'YOU ARE HERE');
                    const isCompleted = nd.status === 'COMPLETED';
                    const isNext = nd.status === 'NEXT GOAL';
                    const isTarget = nd.status === 'CAREER TARGET' || nd.status === 'FUTURE GOAL';
                    const isSelected = inspectingNode?.step === nd.step;

                    // Alternating positions (Left -> Right -> Left -> Right)
                    const alignClass = index % 2 === 0 ? 'justify-start md:ml-8' : 'justify-end md:mr-8';

                    // 3D Card Colors
                    const nodeBorderColor = isSelected
                      ? 'border-cyan-400 ring-2 ring-cyan-400/60 shadow-[0_0_35px_rgba(45,212,191,0.5)]'
                      : isCurrent
                      ? 'border-teal-400 shadow-[0_0_25px_rgba(45,212,191,0.3)]'
                      : isCompleted
                      ? 'border-emerald-500/60 shadow-lg shadow-emerald-950/30'
                      : isNext
                      ? 'border-indigo-500/60 shadow-lg shadow-indigo-950/30'
                      : 'border-slate-800 hover:border-slate-700';

                    const nodeBgColor = isSelected
                      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/90'
                      : isCurrent
                      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/85'
                      : isCompleted
                      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/50'
                      : isNext
                      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50'
                      : 'bg-slate-900/90';

                    return (
                      <motion.div
                        key={nd.step || index}
                        id={isCurrent ? 'roadmap-active-node' : undefined}
                        initial={{ opacity: 0, scale: 0.88, y: 35 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          duration: 0.55,
                          delay: 0.12 + index * 0.1,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        className="relative w-full flex flex-col items-center"
                      >
                        <div className={`flex items-center ${alignClass} w-full`}>
                          <motion.div
                            whileHover={{ y: -6, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setInspectingNode(nd);
                              setSelectedNode(nd);
                            }}
                            className={`isometric-card-3d relative w-full max-w-sm sm:max-w-md p-5 rounded-2xl border transition-all cursor-pointer group ${nodeBorderColor} ${nodeBgColor}`}
                            style={{
                              boxShadow: is3DTilted ? '0 20px 40px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.15)' : undefined
                            }}
                          >
                            {/* 3D Beacon Pulse Badge for Current Node with Shimmer */}
                            {isCurrent && (
                              <div className="shimmer-badge-info absolute -top-3.5 left-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-teal-500/40 animate-pulse border border-teal-200">
                                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                                <span>{L('LOKASI SAAT INI (YOU ARE HERE)', 'YOU ARE HERE')}</span>
                              </div>
                            )}

                            {isTarget && (
                              <div className="shimmer-badge-info absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-yellow-500/30 border border-yellow-200">
                                <Crown size={12} />
                                <span>{L('TARGET IMPIAN', 'DREAM TARGET')}</span>
                              </div>
                            )}

                            {/* Node Header */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center border shadow-md ${
                                  isCurrent
                                    ? 'bg-teal-400 text-slate-950 border-teal-300'
                                    : isCompleted
                                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                    : 'bg-slate-800 text-slate-200 border-slate-700'
                                }`}>
                                  {nd.step}
                                </div>
                                <div>
                                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                                    LEVEL {nd.step} • {nd.status === 'YOU ARE HERE' ? L('LOKASI SAAT INI', 'YOU ARE HERE') : T(nd.status)}
                                  </span>
                                  <span className="text-[11px] font-bold text-cyan-300">
                                    {T(nd.timeframe)}
                                  </span>
                                </div>
                              </div>

                              {/* Action Item Progress Indicator */}
                              {nd.action_items && (
                                <div className="shimmer-badge-info text-[11px] font-bold text-slate-200 bg-slate-950/90 px-3 py-1 rounded-xl border border-cyan-500/40 flex items-center gap-1.5 shadow-md shadow-cyan-500/15">
                                  <ListTodo size={12} className="text-cyan-400" />
                                  <span>{nd.action_items.filter((_, i) => completedItems[`${nd.step}-${i}`]).length} / {nd.action_items.length} {L('Task', 'Tasks')}</span>
                                </div>
                              )}
                            </div>

                            {/* Stage Title */}
                            <h4 className="font-extrabold text-sm sm:text-base text-slate-100 group-hover:text-cyan-300 transition-colors mb-2">
                              {T(nd.title)}
                            </h4>

                            <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                              {T(nd.desc)}
                            </p>

                            {/* Key Skill Badges Preview */}
                            {nd.key_skills && nd.key_skills.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
                                {nd.key_skills.slice(0, 4).map((sk, skIdx) => (
                                  <span key={skIdx} className="shimmer-pill-skill">
                                    {sk}
                                  </span>
                                ))}
                                {nd.key_skills.length > 4 && (
                                  <span className="text-[10px] text-cyan-300 font-bold">+{nd.key_skills.length - 4} {L('skill', 'skills')}</span>
                                )}
                              </div>
                            )}

                            {/* Shimmer Button Teaser Info */}
                            <div className="mt-3.5 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectingNode(nd);
                                  setSelectedNode(nd);
                                }}
                                className="shimmer-btn-primary px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold text-slate-100 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-teal-500/20"
                              >
                                <span>{L('Inspeksi Quest Detail', 'Inspect Quest Details')}</span>
                                <Compass size={13} className="text-cyan-300 animate-spin-slow" />
                              </button>

                              <span className="shimmer-badge-info text-[10px] font-extrabold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                                STAGE 0{nd.step}
                              </span>
                            </div>
                          </motion.div>
                        </div>

                        {/* Multi-Color Glowing Rainbow Laser Line Connector to Next Node */}
                        {index < nodes.length - 1 && (
                          <div className="my-5 py-1 flex flex-col items-center justify-center relative w-full z-10">
                            {/* Glowing Rainbow Laser Line */}
                            <div className="w-2 h-14 rainbow-laser-line rounded-full relative">
                              <div className="absolute inset-0 bg-white/50 blur-sm rounded-full animate-pulse" />
                            </div>

                            {/* Multi-color Cyber Connector Node Pill */}
                            <div className="shimmer-badge-info px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-400/60 text-[10px] font-black text-cyan-300 tracking-wider flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 my-1 backdrop-blur-md">
                              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                              <span>LEVEL 0{nd.step} ➔ LEVEL 0{nd.step + 1} PATHWAY</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* 3D Map Canvas Bottom Teaser Bar */}
              <div className="relative z-10 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-teal-400" />
                  <span>{L('Prospek Karir & Roadmap Disesuaikan Real-time dengan Profil & Skor ATS CV Kamu', 'Career Prospects & Roadmap Adjusted Real-time to Your Profile & ATS Score')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewModeChange('roadmap')}
                    className="text-cyan-300 hover:text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>{L('Tampilan List Detail & CRUD', 'List Detail View & CRUD')}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* 3D Quest Node Inspector Panel (1 Col) */}
            <div className="space-y-6">
              {inspectingNode ? (
                <div className="bg-slate-900/90 border border-cyan-500/40 rounded-3xl p-6 backdrop-blur-xl space-y-5 shadow-2xl relative">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Compass size={18} className="text-cyan-400" />
                      <h4 className="font-extrabold text-sm text-slate-100">{L('Detail Level', 'Level Details')} {inspectingNode.step}</h4>
                    </div>
                    <button
                      onClick={() => setInspectingNode(null)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                      {T(inspectingNode.timeframe)} • {inspectingNode.status === 'YOU ARE HERE' ? L('LOKASI SAAT INI', 'YOU ARE HERE') : T(inspectingNode.status)}
                    </span>

                    <h3 className="font-black text-lg text-slate-100">{T(inspectingNode.title)}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{T(inspectingNode.desc)}</p>
                  </div>

                  {/* Action Checklist */}
                  {inspectingNode.action_items && inspectingNode.action_items.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <ListTodo size={14} className="text-teal-400" />
                        <span>{L('Checklist Tugas Stage Ini:', 'Stage Task Checklist:')}</span>
                      </div>
                      <div className="space-y-1.5">
                        {inspectingNode.action_items.map((item, idx) => {
                          const isChecked = Boolean(completedItems[`${inspectingNode.step}-${idx}`]);
                          return (
                            <div
                              key={idx}
                              onClick={() => toggleCheckItem(inspectingNode.step, idx)}
                              className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center gap-2.5 ${
                                isChecked
                                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                isChecked ? 'bg-emerald-400 border-emerald-300 text-slate-950' : 'border-slate-700'
                              }`}>
                                {isChecked && <Check size={11} />}
                              </div>
                              <span className={`text-xs ${isChecked ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                                {item}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recommended Projects */}
                  {inspectingNode.recommended_projects && inspectingNode.recommended_projects.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                      <div className="text-[11px] font-extrabold text-indigo-300 flex items-center gap-1">
                        <FolderGit2 size={13} className="text-indigo-400" />
                        <span>{L('Rekomendasi Portofolio:', 'Recommended Portfolio:')}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-semibold">{inspectingNode.recommended_projects[0]}</p>
                    </div>
                  )}

                  {/* Ask AI Trigger */}
                  <button
                    onClick={() => {
                      handleViewModeChange('chat');
                      const prompt = isEn
                        ? `I would like to consult about Stage ${inspectingNode.step}: "${inspectingNode.title}" for a ${targetRole} career. What are concrete tips and the fastest strategy to master it?`
                        : `Saya ingin berkonsultasi mengenai Tahap ${inspectingNode.step}: "${inspectingNode.title}" untuk karir ${targetRole}. Apa saja tips konkret dan strategi tercepat untuk menguasainya?`;
                      window.dispatchEvent(new CustomEvent('ask-career-ai', { detail: { prompt } }));
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-teal-500/20"
                  >
                    <MessageSquare size={14} />
                    <span>{L('Curhat & Tanya AI Stage Ini', 'Ask AI About This Stage')}</span>
                  </button>
                </div>
              ) : (
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl text-center space-y-4 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                    <Compass size={24} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-200">{L('Inspeksi Level Node 3D', '3D Node Inspection')}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {L('Klik pada salah satu kartu level 3D di sebelah kiri untuk melihat checklist tugas, proyek portofolio, dan rekomendasi AI.', 'Click any 3D level card on the left to inspect task checklists, portfolio projects, and AI recommendations.')}
                    </p>
                  </div>
                </div>
              )}

              {/* Target Summary Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-sm border-b border-slate-800 pb-3">
                  <Target size={18} />
                  <span>{L('Target Ringkasan Karir', 'Career Target Summary')}</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold">{L('Posisi Target', 'Target Position')}</span>
                    <div className="font-extrabold text-slate-100">{targetRole}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold">{L('CV Terhubung', 'Connected CV')}</span>
                    <div className="font-extrabold text-cyan-300 truncate">{cvFilename} ({atsScore}/100 ATS)</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSwitchRoleModalOpen(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02]"
                  >
                    <RefreshCw size={13} className="text-teal-400" />
                    <span>{L('Ganti Target Karir / Roadmap', 'Switch Career Target / Roadmap')}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      ) : viewMode === 'roadmap' ? (
        /* ROADMAP VISUAL NODE VIEW */
        <motion.div variants={pageSectionVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Visual Vertical Node Timeline */}
          <div className="lg:col-span-2 bg-[#070B1D]/90 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-black text-lg text-slate-100 flex items-center gap-2">
                  <Layers size={18} className="text-teal-400" />
                  <span>{nodes.length} {L('Tahap Peta Jalan Karir Interaktif', 'Interactive Career Roadmap Stages')}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{masterPlanSummary}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleGenerateInitialAiRoadmap}
                  disabled={isConsulting}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-indigo-500/20 hover:from-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title={L('Generasi ulang alur roadmap menggunakan rekomendasi AI terbaru', 'Regenerate roadmap path using latest AI recommendations')}
                >
                  <Sparkles size={13} className="text-teal-400" />
                  <span>{L('Perbarui Roadmap AI', 'Refresh AI Roadmap')}</span>
                </button>

                <button
                  onClick={handleOpenCreateModal}
                  className="px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{L('Tambah Tahap', 'Add Stage')}</span>
                </button>

                <button
                  onClick={handleResetToDefault}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title={L('Reset ke Rekomendasi AI Awal', 'Reset to Initial AI Recommendation')}
                >
                  <RotateCcw size={13} />
                  <span>{L('Reset', 'Reset')}</span>
                </button>
              </div>
            </div>

            {/* Notification Bar */}
            <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between gap-3 text-xs text-teal-300">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="shrink-0 text-teal-400" />
                <span>{L('Klik kartu untuk detail • Gunakan tombol', 'Click card for details • Use')} <strong className="text-slate-100 font-bold">{L('Panah (⬆/⬇) / Edit / Hapus', 'Arrow buttons (⬆/⬇) / Edit / Delete')}</strong> {L('di setiap kartu untuk mengelola alur roadmap.', 'on each card to customize your roadmap flow.')}</span>
              </div>
            </div>

            {/* Vertical Nodes Cards List */}
            <div className="space-y-4">
              {nodes.map((nd, index) => {
                const isCurrent = Boolean(nd.current || nd.status === 'YOU ARE HERE');
                const isCompleted = nd.status === 'COMPLETED';
                const isNext = nd.status === 'NEXT GOAL';

                const statusBgColor = isCurrent
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  : isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : isNext
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/40';

                const cardBorderGlow = isCurrent
                  ? 'border-l-4 border-l-teal-400 border-y border-r border-slate-800 bg-gradient-to-r from-teal-500/10 via-slate-900 to-slate-900 shadow-xl shadow-teal-500/10'
                  : isCompleted
                  ? 'border-l-4 border-l-emerald-400 border-y border-r border-slate-800 bg-slate-900/70'
                  : isNext
                  ? 'border-l-4 border-l-indigo-400 border-y border-r border-slate-800 bg-slate-900/70'
                  : 'border-l-4 border-l-purple-400 border-y border-r border-slate-800 bg-slate-900/70';

                return (
                  <motion.div
                    key={nd.step || index}
                    initial={{ opacity: 0, x: -28 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.08 + Math.min(index, 7) * 0.06 }}
                    className="relative w-full flex flex-col items-center"
                  >
                    <motion.div
                      whileHover={{ y: -3, scale: 1.008 }}
                      whileTap={{ scale: 0.992 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      onClick={() => setSelectedNode(nd)}
                      className={`w-full p-5 rounded-2xl transition-all cursor-pointer group hover:border-teal-500/40 hover:bg-slate-900/90 relative overflow-hidden ${cardBorderGlow}`}
                    >
                      {/* Floating Beacon Badge for Current Node */}
                      {isCurrent && (
                        <div className="shimmer-badge-info inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase tracking-wider mb-2 border border-teal-400/50">
                          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                          <span>{L('LOKASI SAAT INI (YOU ARE HERE)', 'YOU ARE HERE')}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${statusBgColor}`}>
                            LEVEL {nd.step} • {nd.status === 'YOU ARE HERE' ? L('LOKASI SAAT INI', 'YOU ARE HERE') : T(nd.status)}
                          </span>
                          <span className="shimmer-badge-info text-[11px] font-bold text-teal-300/90 flex items-center gap-1 bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-800">
                            <Clock size={11} className="text-teal-400" />
                            {T(nd.timeframe)}
                          </span>
                        </div>

                        {/* Task Progress Badge */}
                        <div className="flex items-center gap-2">
                          {nd.action_items && (
                            <div className="shimmer-badge-info text-[11px] font-bold text-slate-200 bg-slate-950/90 px-2.5 py-1 rounded-lg border border-cyan-500/40 flex items-center gap-1">
                              <ListTodo size={12} className="text-cyan-400" />
                              <span>{nd.action_items.filter((_, i) => completedItems[`${nd.step}-${i}`]).length} / {nd.action_items.length} {L('Task', 'Tasks')}</span>
                            </div>
                          )}

                          {/* Interactive Node Action Controls */}
                          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => handleMoveUp(e, index)}
                              disabled={index === 0}
                              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-teal-300 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                              title={L('Pindahkan Ke Atas (Ubah Alur)', 'Move Up (Change Order)')}
                            >
                              <ArrowUp size={13} />
                            </button>
                            <button
                              onClick={(e) => handleMoveDown(e, index)}
                              disabled={index === nodes.length - 1}
                              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-teal-300 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                              title={L('Pindahkan Ke Bawah (Ubah Alur)', 'Move Down (Change Order)')}
                            >
                              <ArrowDown size={13} />
                            </button>
                            <button
                              onClick={(e) => handleOpenEditModal(e, index)}
                              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-teal-300 transition-all cursor-pointer"
                              title={L('Edit Tahap Ini', 'Edit This Stage')}
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteNode(e, index)}
                              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                              title={L('Hapus Tahap Ini', 'Delete This Stage')}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <h4 className="font-extrabold text-base text-slate-100 mb-1.5 group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                        <span>{T(nd.title)}</span>
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {T(nd.desc)}
                      </p>

                      {/* Interactive Action Items Checklist Inside Card */}
                      {nd.action_items && nd.action_items.length > 0 && (
                        <div className="mb-4 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <ListTodo size={11} className="text-teal-400" />
                            <span>{L('Daftar Aksi Konkret (Checklist):', 'Concrete Action Checklist:')}</span>
                          </div>
                          <div className="space-y-1">
                            {nd.action_items.slice(0, 3).map((item, itemIdx) => {
                              const isChecked = Boolean(completedItems[`${nd.step}-${itemIdx}`]);
                              return (
                                <div
                                  key={itemIdx}
                                  onClick={() => toggleCheckItem(nd.step, itemIdx)}
                                  className={`p-2 rounded-xl border text-[11px] transition-all cursor-pointer flex items-center gap-2 ${
                                    isChecked
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                    isChecked ? 'bg-emerald-400 border-emerald-300 text-slate-950' : 'border-slate-700'
                                  }`}>
                                    {isChecked && <Check size={10} />}
                                  </div>
                                  <span className={`truncate ${isChecked ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                                    {item}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Footer Row: Key Skills Tags & Shimmer Action Button */}
                      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                        {/* Key Skills */}
                        {nd.key_skills && nd.key_skills.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Zap size={12} className="text-cyan-400 mr-0.5" />
                            {nd.key_skills.map((sk, idx) => (
                              <span key={idx} className="shimmer-pill-skill">
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Shimmer Button Inspeksi Quest Detail */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNode(nd);
                            handleViewModeChange('3dmap');
                            setInspectingNode(nd);
                          }}
                          className="shimmer-btn-primary px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold text-slate-100 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-teal-500/20 ml-auto"
                        >
                          <span>{L('Inspeksi Quest Detail', 'Inspect Quest Details')}</span>
                          <Compass size={13} className="text-cyan-300" />
                        </button>
                      </div>
                    </motion.div>

                    {/* Multi-Color Glowing Rainbow Laser Line Connector */}
                    {index < nodes.length - 1 && (
                      <div className="my-3 py-1 flex flex-col items-center justify-center relative w-full z-10">
                        <div className="w-2 h-10 rainbow-laser-line rounded-full relative">
                          <div className="absolute inset-0 bg-white/50 blur-sm rounded-full animate-pulse" />
                        </div>
                        <div className="shimmer-badge-info px-3 py-0.5 rounded-full bg-slate-950/90 border border-cyan-400/50 text-[10px] font-black text-cyan-300 tracking-wider flex items-center gap-1.5 shadow-md shadow-cyan-500/20 my-1 backdrop-blur-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                          <span>PATHWAY LASER CONNECTOR</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Add Step Launcher */}
            <button
              onClick={handleOpenCreateModal}
              className="w-full py-4 border-2 border-dashed border-slate-800 hover:border-teal-500/50 rounded-2xl text-xs font-bold text-slate-400 hover:text-teal-300 transition-all flex items-center justify-center gap-2 cursor-pointer bg-slate-950/40 hover:bg-slate-900/60"
            >
              <Plus size={16} />
              <span>{L('Tambah Tahap Baru ke Roadmap', 'Add New Stage to Roadmap')}</span>
            </button>
          </div>

          {/* Right Column: AI Mentorship Summary */}
          <div className="space-y-6">
            {/* Target Role & Level Overview Card */}
            <div className="bg-[#070B1D]/90 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-2xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm border-b border-slate-800 pb-3">
                <Target size={18} />
                <span>{L('Target Ringkasan Karir', 'Career Target Summary')}</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{L('Target Posisi Pekerjaan', 'Target Job Position')}</div>
                  <div className="font-black text-teal-300 text-sm truncate">{targetRole}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase">{L('Status Level', 'Level Status')}</div>
                    <div className="font-extrabold text-indigo-300 text-xs mt-0.5">{userLevel}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase">{L('Dokumen CV', 'CV Document')}</div>
                    <div className="font-extrabold text-emerald-300 text-xs mt-0.5 truncate">{cvFilename}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#070B1D]/90 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-2xl space-y-5 shadow-xl">
              <div className="flex items-center gap-2.5 text-teal-300 font-bold text-sm">
                <div className="w-7 h-7 rounded-lg overflow-hidden border border-teal-500/40 p-0.5 bg-slate-950 shrink-0 shadow-sm shadow-teal-500/20">
                  <img
                    src="/assets/ayokerja-bot-avatar.png"
                    alt="AyoKerja Bot"
                    onError={(e) => { e.currentTarget.src = '/assets/robot/robot-welcome.webp'; }}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <span>{L('Curhat AI & Auto-Roadmap', 'AI Chat & Auto-Roadmap')}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-3">
                <p>
                  <strong className="text-teal-300">{L('Bagaimana Cara Kerjanya?', 'How Does It Work?')}</strong>
                </p>
                <p>
                  {L('Setiap kali kamu curhat atau berdiskusi dengan AI, AI akan membuatkan dan memperbarui alur tahap roadmap di samping ini secara otomatis.', 'Every time you discuss with AI, it automatically generates and updates your roadmap stages.')}
                </p>
                <p>
                  {L('Kamu juga bebas meng-edit judul, merubah urutan alur panah, menambah tahap baru, atau menghapus tahap yang tidak kamu butuhkan.', 'You are free to edit titles, reorder stages, add new levels, or remove unused steps.')}
                </p>
              </div>

              <button
                onClick={() => handleStartCurhat()}
                className="shimmer-btn-primary w-full justify-center py-3 text-xs font-bold cursor-pointer flex items-center gap-2 shadow-lg shadow-teal-500/20"
              >
                <MessageSquare size={14} />
                <span>{L('Mulai Curhat dengan AI', 'Start AI Career Chat')}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSwitchRoleModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-[1.01]"
              >
                <RefreshCw size={13} className="text-teal-400" />
                <span>{L('Ganti Target Karir / Roadmap', 'Switch Career Target / Roadmap')}</span>
              </button>
            </div>

            {/* Quick Consultation Suggestions Card */}
            <div className="bg-[#070B1D]/90 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-2xl space-y-4 shadow-xl">
              <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap size={14} className="text-amber-400" />
                <span>{L('Topik Curhat Popular', 'Popular Chat Topics')}</span>
              </h4>

              <div className="space-y-2">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStartCurhat(qp, true)}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-teal-500/50 hover:bg-slate-800/40 text-xs text-slate-300 hover:text-teal-300 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>{qp}</span>
                    <ChevronRight size={14} className="text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* INTERACTIVE CONSULTATION & CHAT VIEW */
        <motion.div variants={pageSectionVariants} className="bg-[#070B1D]/90 border border-slate-800/80 rounded-3xl p-5 sm:p-7 backdrop-blur-2xl flex flex-col h-[740px] shadow-2xl relative overflow-hidden">
          {/* Chat Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-teal-400 via-cyan-500 to-indigo-600 shadow-lg shadow-teal-500/25 shrink-0">
                <div className="w-full h-full rounded-[14px] bg-slate-950 overflow-hidden flex items-center justify-center">
                  <img
                    src="/assets/ayokerja-bot-avatar.png"
                    alt="AyoKerja AI Senior Consultant"
                    onError={(e) => { e.currentTarget.src = '/assets/robot/robot-welcome.webp'; }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-sm animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-100">AyoKerja Senior Consultant</h3>
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black border border-teal-500/30">
                    REAL-TIME AI
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                    {targetRole}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {L('Curhat Karir • AI otomatis menyusun & memperbarui alur roadmap kamu secara langsung', 'Career Chat • AI automatically compiles & updates your roadmap in real-time')}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setIsSwitchRoleModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02]"
                title={L('Ganti arah karir & susun roadmap baru', 'Switch career path & build new roadmap')}
              >
                <RefreshCw size={13} className="text-teal-400" />
                <span>{L('Ganti Roadmap', 'Switch Roadmap')}</span>
              </button>

              <button
                type="button"
                onClick={handleResetChat}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title={L('Mulai Curhat Baru', 'Reset Chat')}
              >
                <RotateCcw size={14} />
              </button>

              <button
                type="button"
                onClick={() => handleViewModeChange('roadmap')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Map size={14} className="text-teal-400" />
                <span className="hidden md:inline">{L('Lihat Roadmap Visual', 'View Visual Roadmap')}</span>
                <span className="md:hidden">{L('Visual', 'Visual')}</span>
              </button>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-tr from-teal-500 to-indigo-600 text-white shadow-md shadow-teal-500/20'
                      : 'p-0.5 bg-gradient-to-tr from-teal-500 to-cyan-500 shadow-md shadow-teal-500/20'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <User size={16} />
                  ) : (
                    <div className="w-full h-full rounded-[10px] bg-slate-950 overflow-hidden flex items-center justify-center">
                      <img
                        src="/assets/ayokerja-bot-avatar.png"
                        alt="AyoKerja AI"
                        onError={(e) => { e.currentTarget.src = '/assets/robot/robot-welcome.webp'; }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-slate-950 font-semibold rounded-tr-none shadow-md'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line shadow-md'
                  }`}
                >
                  <FormattedMessage text={msg.text} isUser={msg.sender === 'user'} />
                  
                  {/* Interactive Live Roadmap Preview Card inside AI message */}
                  {msg.sender === 'ai' && msg.updatedNodes && msg.updatedNodes.length > 0 && (
                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900/95 via-[#0A0F2B] to-slate-950 border border-teal-500/40 shadow-xl space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                          <span className="text-[11px] font-black text-teal-300 uppercase tracking-wider">
                            {L('Peta Jalan Karir Diperbarui', 'Roadmap Updated')} • {msg.roleTarget || targetRole}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                          {msg.updatedNodes.length} {L('Tahap', 'Stages')}
                        </span>
                      </div>

                      {/* Stage List Preview */}
                      <div className="space-y-1.5">
                        {msg.updatedNodes.map((stg, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs hover:border-teal-500/40 transition-colors"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="w-5 h-5 rounded-lg bg-teal-500/20 text-teal-300 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                                {stg.step || sIdx + 1}
                              </span>
                              <span className="font-bold text-slate-200 truncate">{stg.title}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400 shrink-0 ml-2">
                              {stg.timeframe}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Direct Navigation Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            handleViewModeChange('3dmap');
                            const el = document.getElementById('roadmap-active-node');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-slate-950 font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 cursor-pointer transition-all"
                        >
                          <Box size={13} />
                          <span>{L('Buka di Peta 3D Isometric', 'Open in 3D Isometric Map')}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleViewModeChange('roadmap')}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-extrabold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Map size={13} className="text-teal-400" />
                          <span>{L('List Detail', 'Detail List')}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Fallback Roadmap Button if no direct card */}
                  {msg.sender === 'ai' && !msg.updatedNodes && idx > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{L('Alur karir kamu aktif:', 'Your active career path:')} <strong>{targetRole}</strong></span>
                      <button
                        type="button"
                        onClick={() => handleViewModeChange('roadmap')}
                        className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Map size={11} />
                        <span>{L('Lihat Alur Roadmap', 'View Roadmap Path')} ({nodes.length} {L('Tahap', 'Stages')})</span>
                      </button>
                    </div>
                  )}

                  <div
                    className={`text-[10px] mt-2 text-right ${
                      msg.sender === 'user' ? 'text-slate-900/70 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isConsulting && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl p-0.5 bg-gradient-to-tr from-teal-500 to-cyan-500 shadow-md shadow-teal-500/20 shrink-0">
                  <div className="w-full h-full rounded-[10px] bg-slate-950 overflow-hidden flex items-center justify-center">
                    <img
                      src="/assets/ayokerja-bot-avatar.png"
                      alt="AI"
                      onError={(e) => { e.currentTarget.src = '/assets/robot/robot-welcome.webp'; }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-teal-400 text-xs font-semibold flex items-center gap-2 shadow-md">
                  <Sparkles size={14} className="animate-spin text-teal-400" />
                  <span>{L('AI sedang menganalisis curhat Anda & merancang alur roadmap baru...', 'AI is analyzing your input & designing a new roadmap...')}</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Chips: AUTO-HIDDEN WHEN USER STARTS CHATTING, CAN BE MANUALLY TOGGLED */}
          {(!hasUserChatted || showQuickPromptsManual) && (
            <div className="pt-3 border-t border-slate-800/80 mt-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={11} className="text-teal-400" />
                  <span>{L('Jawaban / Curhat Cepat:', 'Quick Chat Prompts:')}</span>
                </div>
                {hasUserChatted && (
                  <button
                    type="button"
                    onClick={() => setShowQuickPromptsManual(false)}
                    className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {L('Sembunyikan', 'Hide')}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleConsultAi(qp)}
                    disabled={isConsulting}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 text-[11px] font-semibold text-slate-300 hover:text-teal-300 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {qp}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input & Send Form */}
          <div className={`${hasUserChatted && !showQuickPromptsManual ? 'pt-3 border-t border-slate-800/80 mt-3' : ''}`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleConsultAi();
              }}
              className="flex items-center gap-2"
            >
              {/* Toggle Suggestions Button (Only shown if user has started chatting) */}
              {hasUserChatted && !showQuickPromptsManual && (
                <button
                  type="button"
                  onClick={() => setShowQuickPromptsManual(true)}
                  title={L('Tampilkan ide saran curhat', 'Show prompt ideas')}
                  className="px-3 py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-slate-400 hover:text-teal-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles size={13} className="text-teal-400" />
                  <span className="hidden sm:inline text-[11px]">{L('Ide Saran', 'Prompts')}</span>
                </button>
              )}

              <input
                ref={chatInputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={L(`Curhat target karir ${targetRole} atau ketik 'ganti roadmap ke Frontend'...`, `Discuss your ${targetRole} goals or type 'switch roadmap to DevOps'...`)}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-teal-500/80 rounded-2xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isConsulting}
                className="shimmer-btn-primary px-5 py-3 rounded-2xl text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center gap-2 shrink-0 shadow-lg shadow-teal-500/20"
              >
                <span>{L('Kirim Curhat', 'Send Message')}</span>
                <Send size={14} />
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* ── ENHANCED NODE DETAIL MODAL (QUEST DOSSIER) ── */}
      {selectedNode && !isEditModalOpen && (() => {
        // Calculate progress for current node
        const nodeTasks = selectedNode.action_items || [];
        const completedInThisNode = nodeTasks.filter((_, idx) => completedItems[`${selectedNode.step}-${idx}`]).length;
        const progressPct = nodeTasks.length > 0 ? Math.round((completedInThisNode / nodeTasks.length) * 100) : 0;
        const isAllNodeTasksDone = nodeTasks.length > 0 && completedInThisNode === nodeTasks.length;

        // Parse recommended portfolio projects into distinct actionable cards
        const rawProjects = selectedNode.recommended_projects;
        const projectList = Array.isArray(rawProjects) ? rawProjects : (rawProjects ? [rawProjects] : []);
        const parsedProjects = [];
        projectList.forEach(item => {
          if (!item) return;
          const str = String(item).trim();
          // Split by newline or commas before action verbs/nouns
          const lines = str.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          lines.forEach(line => {
            const subItems = line.split(/(?:,\s*|\s*;\s*)(?=(?:Setup|Build|Buat|Develop|Implementasi|Deploy|Create|Monitoring|Automasi|REST|API|[A-Z][a-z]+\s*(?:lab|server|monitoring|project|sederhana|aplikasi)))/i);
            subItems.forEach(si => {
              const clean = si.trim().replace(/^[-*•\d\.\)]\s*/, '');
              if (clean) parsedProjects.push(clean);
            });
          });
        });
        const finalProjects = parsedProjects.length > 0 ? parsedProjects : projectList;

        // Extract or fallback skills for this node
        let nodeSkills = Array.isArray(selectedNode.key_skills) && selectedNode.key_skills.length > 0
          ? selectedNode.key_skills
          : [];
        if (nodeSkills.length === 0) {
          const scanText = `${selectedNode.title || ''} ${selectedNode.desc || ''}`;
          const skillDictionary = [
            'Linux CLI', 'Linux', 'Networking', 'DNS', 'HTTP/HTTPS', 'TCP/IP', 'Firewall', 'UFW/Iptables', 'Bash Scripting', 'Bash', 'Python',
            'Docker', 'Kubernetes', 'CI/CD', 'Git', 'GitHub Actions', 'Terraform', 'Ansible', 'AWS', 'GCP', 'Azure',
            'React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Zustand', 'Vue', 'Node.js', 'Express',
            'Laravel', 'PHP', 'MySQL', 'PostgreSQL', 'Redis', 'REST API', 'GraphQL', 'Microservices', 'Pest', 'Nginx', 'SSH Hardening'
          ];
          const detected = skillDictionary.filter(kw => new RegExp(`\\b${kw.replace(/[\/]/g, '\\/')}\\b`, 'i').test(scanText));
          nodeSkills = detected.length > 0 ? detected.slice(0, 8) : ['Core Fundamentals', 'Practical Workflows', 'Problem Solving'];
        }

        const isCurrentLocation = selectedNode.status === 'YOU ARE HERE' || selectedNode.current;

        const modalContent = (
          <div 
            onClick={() => setSelectedNode(null)}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 lg:p-8 py-8 sm:py-12 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 border border-slate-800/90 hover:border-slate-700/80 rounded-3xl w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(20,184,166,0.12)] relative overflow-hidden flex flex-col max-h-[85vh] my-auto shrink-0"
            >
              {/* Futuristic Ambient Glowing Auras */}
              <div className="absolute -top-24 -left-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* ── MODAL HEADER ── */}
              <div className="relative z-10 px-6 sm:px-8 pt-7 pb-4 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md space-y-3 shrink-0">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                    {/* Stage Badge */}
                    <span className="text-xs font-black px-3.5 py-1 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300 border border-teal-500/40 shadow-sm shadow-teal-500/20 flex items-center gap-1.5">
                      <Target size={13} className="text-teal-400" />
                      <span>{L('TAHAP', 'STAGE')} {selectedNode.step}</span>
                    </span>

                    {/* Status Badge */}
                    <span className={`text-xs font-black px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
                      isCurrentLocation
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                        : selectedNode.status === 'IN PROGRESS'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : selectedNode.status === 'COMPLETED'
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    }`}>
                      {isCurrentLocation && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                      <span>
                        {isCurrentLocation ? L('LOKASI SAAT INI', 'YOU ARE HERE') : T(selectedNode.status)}
                      </span>
                    </span>

                    {/* Timeframe Badge */}
                    <span className="text-xs font-bold text-slate-300 bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-xl flex items-center gap-1.5">
                      <Clock size={12} className="text-teal-400" />
                      <span>{T(selectedNode.timeframe)}</span>
                    </span>
                  </div>

                  {/* Close (X) Button */}
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/70 text-slate-400 hover:text-white transition-all cursor-pointer shadow-md group shrink-0"
                    title={L('Tutup (Esc)', 'Close (Esc)')}
                  >
                    <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
                  </button>
                </div>

                {/* Stage Title & Mission Intro */}
                <div>
                  <h3 className="font-black text-xl sm:text-2xl text-slate-100 tracking-tight leading-snug">
                    {T(selectedNode.title)}
                  </h3>
                  <div className="mt-2.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/70 text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal">
                    {T(selectedNode.desc)}
                  </div>
                </div>
              </div>

              {/* ── MODAL SCROLLABLE BODY ── */}
              <div className="relative z-10 overflow-y-auto custom-scrollbar px-6 sm:px-8 py-5 space-y-6 flex-1">
                
                {/* 1. Stage Progress Tracker Bar */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950/80 via-teal-950/20 to-slate-950/80 border border-teal-500/30 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-teal-400" />
                      <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                        {L('Progress Penyelesaian Tahap', 'Stage Completion Progress')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-lg">
                        {completedInThisNode} / {nodeTasks.length} {L('Aksi', 'Actions')} ({progressPct}%)
                      </span>
                      {nodeTasks.length > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleAllItemsInStep(selectedNode.step, nodeTasks)}
                          className="text-[11px] font-bold text-slate-400 hover:text-teal-300 hover:underline transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw size={11} />
                          <span>{isAllNodeTasksDone ? L('Batal Semua', 'Uncheck All') : L('Tandai Semua Selesai', 'Mark All Done')}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(45,212,191,0.6)]"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  {isAllNodeTasksDone && (
                    <div className="flex items-center gap-2 text-emerald-300 text-xs font-extrabold pt-1">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span>{L('🎉 Luar biasa! Seluruh aksi konkret pada tahap ini telah diselesaikan.', '🎉 Excellent! All concrete actions in this stage have been marked complete.')}</span>
                    </div>
                  )}
                </div>

                {/* 2. Target Keahlian / Key Skills Tags */}
                {nodeSkills && nodeSkills.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Cpu size={14} className="text-teal-400" />
                        <span>{L('Keahlian Kunci & Kompetensi Utama:', 'Target Key Skills & Competencies:')}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-bold">{nodeSkills.length} {L('Keahlian', 'Skills')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {nodeSkills.map((skill, sIdx) => (
                        <span 
                          key={sIdx}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-teal-300 text-xs font-extrabold hover:border-teal-500/50 hover:bg-slate-800/80 transition-all flex items-center gap-1.5 shadow-sm group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400/80 group-hover:scale-125 transition-transform" />
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Interactive Checklist Action Items */}
                {nodeTasks.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ListTodo size={14} className="text-teal-400" />
                        <span>{L('Daftar Aksi Konkret (Checklist):', 'Concrete Action Checklist:')}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal">
                        {L('Klik item untuk update status progress', 'Click an item to toggle completion status')}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {nodeTasks.map((item, idx) => {
                        const isChecked = Boolean(completedItems[`${selectedNode.step}-${idx}`]);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleCheckItem(selectedNode.step, idx)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group relative overflow-hidden ${
                              isChecked
                                ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-200 shadow-sm'
                                : 'bg-slate-950/70 border-slate-800/90 text-slate-200 hover:border-slate-700 hover:bg-slate-900/60'
                            }`}
                          >
                            {/* Step Sequence Pill */}
                            <span className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md shrink-0 mt-0.5 transition-colors ${
                              isChecked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                            }`}>
                              0{idx + 1}
                            </span>

                            {/* Checkbox Icon Indicator */}
                            <div className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                              isChecked 
                                ? 'bg-emerald-400 border-emerald-300 text-slate-950 shadow-md shadow-emerald-500/30 scale-105' 
                                : 'border-slate-700 bg-slate-900 group-hover:border-teal-400'
                            }`}>
                              {isChecked && <Check size={13} className="stroke-[3]" />}
                            </div>

                            {/* Action Item Text */}
                            <span className={`text-xs sm:text-[13px] flex-1 leading-relaxed transition-all ${
                              isChecked ? 'line-through text-slate-400 font-medium' : 'text-slate-100 font-semibold'
                            }`}>
                              {item}
                            </span>

                            {/* Status Chip */}
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider transition-colors ${
                              isChecked 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                : 'bg-slate-900 text-slate-500 border border-slate-800'
                            }`}>
                              {isChecked ? L('Selesai ✓', 'Done ✓') : L('Belum', 'Pending')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. Rekomendasi Portofolio Proyek Nyata (Showcase Cards Grid) */}
                {finalProjects.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <FolderGit2 size={14} className="text-indigo-400" />
                        <span>{L('Rekomendasi Portofolio Proyek Nyata:', 'Real Portfolio Project Recommendations:')}</span>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                        {finalProjects.length} {L('Proyek Portofolio', 'Portfolio Projects')}
                      </span>
                    </div>

                    <div className={`grid gap-3 ${finalProjects.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                      {finalProjects.map((proj, pIdx) => (
                        <div 
                          key={pIdx}
                          className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-950/80 to-slate-900/90 border border-indigo-500/30 hover:border-indigo-500/60 transition-all space-y-3 group shadow-lg"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0">
                                <Rocket size={13} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                              </div>
                              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300">
                                {L('Proyek Portofolio', 'Portfolio Project')} #{pIdx + 1}
                              </span>
                            </div>

                            <span className="text-[10px] font-bold text-teal-300 bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 rounded-full">
                              {L('Bukti Kerja (Proof of Work)', 'Proof of Work')}
                            </span>
                          </div>

                          <p className="text-xs sm:text-[13px] text-slate-200 font-semibold leading-relaxed">
                            {proj}
                          </p>

                          <div className="pt-1 flex items-center justify-between border-t border-slate-800/80">
                            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                              <Sparkles size={11} className="text-teal-400" />
                              <span>GitHub Showcase Ready</span>
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                handleViewModeChange('chat');
                                setSelectedNode(null);
                                const prompt = isEn
                                  ? `I want to build this portfolio project for Stage ${selectedNode.step}: "${proj}". Can you guide me through the technical architecture, recommended tools, and step-by-step implementation?`
                                  : `Saya ingin mengerjakan proyek portofolio Tahap ${selectedNode.step}: "${proj}". Bisakah Anda jelaskan arsitektur teknis, tools rekomendasi, dan panduan langkah demi langkah pembuatannya?`;
                                window.dispatchEvent(new CustomEvent('ask-career-ai', { detail: { prompt } }));
                              }}
                              className="text-[11px] font-bold text-teal-300 hover:text-teal-200 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>{L('Tanya Panduan ke AI', 'Ask AI for Guide')}</span>
                              <ChevronRight size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. AI Recruiter Insight & Pro-Tip Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/30 via-slate-900 to-indigo-950/30 border border-teal-500/30 flex items-start gap-3 shadow-lg">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={16} className="text-teal-400" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h5 className="text-xs font-black text-teal-300 uppercase tracking-wider">
                      {L('Tips Strategis Rekruter dari AI', 'AI Strategic Recruiter Tip')}
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {L(
                        `Fokus utama tahap ${selectedNode.step} adalah membuktikan kemampuan praktis. Jangan sekadar membaca materi; unggah hasil lab, konfigurasi, dan proyek ke GitHub dengan README yang rapi. Rekruter 3x lebih memprioritaskan kandidat yang memiliki bukti kerja nyata.`,
                        `The primary focus of stage ${selectedNode.step} is verifiable hands-on competence. Document your lab configurations and project code on GitHub with clear README walkthroughs. Hiring managers prioritize candidates with tangible proof of work.`
                      )}
                    </p>
                  </div>
                </div>

              </div>

              {/* ── MODAL FOOTER ── */}
              <div className="relative z-10 px-6 sm:px-8 py-4 border-t border-slate-800/80 bg-slate-900/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Ask AI Consultation Button */}
                  <button
                    type="button"
                    onClick={() => {
                      handleViewModeChange('chat');
                      setSelectedNode(null);
                      const prompt = isEn
                        ? `I would like to consult about Stage ${selectedNode.step}: "${selectedNode.title}" for a ${targetRole} career. What are concrete tips, learning resources, and the fastest strategy to master it?`
                        : `Saya ingin berkonsultasi mengenai Tahap ${selectedNode.step}: "${selectedNode.title}" untuk karir ${targetRole}. Apa saja tips konkret, sumber belajar gratis, dan strategi tercepat untuk menguasainya?`;
                      window.dispatchEvent(new CustomEvent('ask-career-ai', { detail: { prompt } }));
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500/20 to-indigo-600/30 hover:from-teal-500/30 hover:to-indigo-600/40 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-teal-500/10"
                  >
                    <MessageSquare size={14} className="text-teal-400" />
                    <span>{L('Konsultasi Tahap Ini ke AI', 'Consult This Stage with AI')}</span>
                  </button>

                  {/* Edit Stage Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      const nodeIndex = nodes.findIndex(n => n.step === selectedNode.step);
                      setSelectedNode(null);
                      handleOpenEditModal(e, nodeIndex >= 0 ? nodeIndex : 0);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 size={14} />
                    <span>{L('Edit Tahap Ini', 'Edit This Stage')}</span>
                  </button>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="shimmer-btn-primary px-6 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-2 shadow-lg shadow-teal-500/20"
                >
                  <Check size={14} />
                  <span>{L('Tutup Detail', 'Close Details')}</span>
                </button>
              </div>

            </motion.div>
          </div>
        );

        return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
      })()}

      {/* CREATE / EDIT NODE MODAL */}
      {isEditModalOpen && (() => {
        const editContent = (
          <div 
            onClick={() => setIsEditModalOpen(false)}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 py-8 sm:py-12 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl relative my-auto shrink-0 max-h-[85vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-teal-400 font-extrabold text-base">
                  <Edit3 size={18} />
                  <span>{editingNodeIndex !== null ? `${L('Edit Tahap', 'Edit Stage')} ${editingNodeIndex + 1}` : L('Tambah Tahap Baru', 'Add New Stage')}</span>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveNodeForm} className="space-y-4">
                {/* Judul Tahap */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{L('Judul Tahap Roadmap', 'Roadmap Stage Title')}</label>
                  <input
                    type="text"
                    required
                    value={nodeFormData.title}
                    onChange={(e) => setNodeFormData({ ...nodeFormData, title: e.target.value })}
                    placeholder={L('Contoh: Tahap 2: Microservices & Docker Container', 'Example: Stage 2: Microservices & Docker Containers')}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100"
                  />
                </div>

                {/* Grid 2 Column: Timeframe & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">{L('Jangka Waktu', 'Timeframe')}</label>
                    <input
                      type="text"
                      required
                      value={nodeFormData.timeframe}
                      onChange={(e) => setNodeFormData({ ...nodeFormData, timeframe: e.target.value })}
                      placeholder={L('Contoh: Bulan 3 - 4', 'Example: Month 3 - 4')}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">{L('Status Tahap', 'Stage Status')}</label>
                    <select
                      value={nodeFormData.status}
                      onChange={(e) => setNodeFormData({ ...nodeFormData, status: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-xs text-slate-100 cursor-pointer"
                    >
                      <option value="YOU ARE HERE">YOU ARE HERE</option>
                      <option value="IN PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="NEXT GOAL">NEXT GOAL</option>
                      <option value="FUTURE TARGET">FUTURE TARGET</option>
                    </select>
                  </div>
                </div>

                {/* Is Current Stage Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isCurrentCheck"
                    checked={nodeFormData.current}
                    onChange={(e) => setNodeFormData({ ...nodeFormData, current: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-teal-500 bg-slate-950 cursor-pointer"
                  />
                  <label htmlFor="isCurrentCheck" className="text-xs font-semibold text-slate-300 cursor-pointer">
                    {L('Tandai sebagai Posisi Saya Saat Ini (YOU ARE HERE)', 'Mark as My Current Position (YOU ARE HERE)')}
                  </label>
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{L('Deskripsi Ringkas', 'Brief Description')}</label>
                  <textarea
                    rows={2}
                    required
                    value={nodeFormData.desc}
                    onChange={(e) => setNodeFormData({ ...nodeFormData, desc: e.target.value })}
                    placeholder={L('Penjelasan fokus utama tahap ini...', 'Summary of the main focus for this stage...')}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3.5 py-2 text-xs text-slate-100"
                  />
                </div>

                {/* Action Items (1 per line) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{L('Daftar Tugas Aksi (1 per baris)', 'Action Items List (1 per line)')}</label>
                  <textarea
                    rows={3}
                    value={nodeFormData.action_items_text}
                    onChange={(e) => setNodeFormData({ ...nodeFormData, action_items_text: e.target.value })}
                    placeholder={L('Refactor controller ke service layer\nTulis unit test Pest PHP', 'Refactor controller to service layer\nWrite Pest PHP unit tests')}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3.5 py-2 text-xs text-slate-100"
                  />
                </div>

                {/* Recommended Projects (1 per line) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{L('Rekomendasi Portofolio Proyek', 'Portfolio Project Recommendations')}</label>
                  <textarea
                    rows={2}
                    value={nodeFormData.recommended_projects_text}
                    onChange={(e) => setNodeFormData({ ...nodeFormData, recommended_projects_text: e.target.value })}
                    placeholder="Microservices E-Commerce API Engine"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3.5 py-2 text-xs text-slate-100"
                  />
                </div>

                {/* Target Key Skills */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{L('Target Key Skills (Dipisah Koma)', 'Target Key Skills (Comma Separated)')}</label>
                  <input
                    type="text"
                    value={nodeFormData.key_skills_text}
                    onChange={(e) => setNodeFormData({ ...nodeFormData, key_skills_text: e.target.value })}
                    placeholder="Docker, Redis, Pest, Swagger"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    {L('Batal', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="shimmer-btn-primary px-6 py-2.5 text-xs font-bold cursor-pointer"
                  >
                    <span>{editingNodeIndex !== null ? L('Simpan Perubahan', 'Save Changes') : L('Tambah Tahap', 'Add Stage')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
        return typeof document !== 'undefined' ? createPortal(editContent, document.body) : editContent;
      })()}

      {/* ── SWITCH CAREER TARGET & ROADMAP MODAL ── */}
      {isSwitchRoleModalOpen && (() => {
        const switchContent = (
          <div 
            onClick={() => setIsSwitchRoleModalOpen(false)}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 py-8 sm:py-12 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800/90 rounded-3xl p-6 sm:p-7 max-w-2xl w-full space-y-5 shadow-2xl relative my-auto shrink-0 max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0">
                    <RefreshCw size={20} className="animate-[spin_10s_linear_infinite]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                      <span>{L('Pilih Target / Spesialisasi Roadmap Baru', 'Choose New Target / Career Roadmap Track')}</span>
                      <Sparkles size={16} className="text-teal-400" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {L('AI akan otomatis merancang ulang 5 tahap roadmap, checklist skill, dan portofolio proyek sesuai target impian kamu.', 'AI will automatically re-engineer all 5 roadmap stages, skill checklists, and portfolio projects.')}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSwitchRoleModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body: Scrollable */}
              <div className="space-y-4 overflow-y-auto pr-1 flex-1">
                <div>
                  <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Zap size={14} className="text-amber-400" />
                    <span>{L('Jalur Karir Populer (Pilih & Langsung Aktifkan):', 'Popular Career Tracks (Select to Activate):')}</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {popularTracks.map((track, idx) => {
                      const isCurrent = targetRole.toLowerCase() === track.role.toLowerCase();
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSwitchRoadmap(track.role)}
                          disabled={isConsulting}
                          className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex items-start gap-3 ${
                            isCurrent
                              ? 'bg-teal-500/15 border-teal-400/60 shadow-lg shadow-teal-500/10'
                              : 'bg-slate-950/60 border-slate-800 hover:border-teal-500/40 hover:bg-slate-800/40'
                          }`}
                        >
                          <span className="text-2xl shrink-0 mt-0.5">{track.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className={`text-xs font-black truncate ${isCurrent ? 'text-teal-300' : 'text-slate-200 group-hover:text-teal-300'}`}>
                                {track.role}
                              </span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded-md bg-teal-400 text-slate-950 text-[9px] font-black shrink-0">
                                  {L('AKTIF', 'ACTIVE')}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-tight line-clamp-2">
                              {track.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Role Input */}
                <div className="pt-2 border-t border-slate-800/80">
                  <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Edit3 size={14} className="text-indigo-400" />
                    <span>{L('Atau Tulis Target Spesialisasi Kamu Sendiri:', 'Or Type Your Own Custom Role:')}</span>
                  </label>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (customRoleInput.trim()) {
                        handleSwitchRoadmap(customRoleInput.trim());
                      }
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={customRoleInput}
                      onChange={(e) => setCustomRoleInput(e.target.value)}
                      placeholder={L('Contoh: QA Automation Engineer, Game Developer, Security Analyst...', 'e.g. QA Automation Engineer, Game Developer, Security Analyst...')}
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!customRoleInput.trim() || isConsulting}
                      className="shimmer-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50 whitespace-nowrap flex items-center gap-1.5"
                    >
                      <Rocket size={14} />
                      <span>{L('Buat Roadmap AI', 'Generate Roadmap')}</span>
                    </button>
                  </form>
                </div>

                {/* AI Chat Note */}
                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-slate-300 text-[11px] flex items-start gap-2.5">
                  <Sparkles size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    {L(
                      'Tips: Kamu juga bisa mengganti roadmap secara alami kapan saja lewat chat curhat, misalnya: "Tolong ubah alur karir saya jadi DevOps Engineer", dan AI akan otomatis memperbarui peta visualmu!',
                      'Tip: You can also change the roadmap naturally anytime via chat, e.g. "Please change my career roadmap to DevOps Engineer", and AI will automatically update your visual map!'
                    )}
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSwitchRoleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  {L('Tutup', 'Close')}
                </button>
              </div>
            </div>
          </div>
        );
        return typeof document !== 'undefined' ? createPortal(switchContent, document.body) : switchContent;
      })()}
    </motion.div>
  );
}
