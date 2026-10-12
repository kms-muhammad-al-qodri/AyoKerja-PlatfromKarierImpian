import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ChatBubble from '../Components/ChatBubble';
import {
  Upload,
  Brain,
  BarChart3,
  Rocket,
  Search,
  Briefcase,
  TrendingUp,
  Map,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Star,
  Shield,
  ShieldCheck,
  Zap,
  Gift,
  Users,
  Target,
  ScanSearch,
  Route,
  Award,
  BadgeCheck,
  UserPlus,
  Bot,
  Wifi,
  Signal,
  Battery,
  Home,
  User,
  Sparkles,
  Smartphone,
  Laptop,
  Monitor,
  ChevronLeft,
  Play,
  Pause,
  LogOut,
  FileCheck2,
  Quote,
  Layers
} from 'lucide-react';

const userAvatarPng = '/assets/user-avatar.png';
const testiUser1 = '/assets/testi-user-1.png';
const testiUser2 = '/assets/testi-user-2.png';
const testiUser3 = '/assets/testi-user-3.png';
/* ─────────────────────────────────────────
   GLOBAL STYLES + SHIMMER KEYFRAMES
───────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @keyframes shimmerText {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes marqueeLeft {
      0%   { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    @keyframes marqueeRight {
      0%   { transform: translateX(-50%); }
      100% { transform: translateX(0%); }
    }
    @keyframes shimmerBorder {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }
    @keyframes shimmerSweep {
      0%   { transform: translateX(-100%) skewX(-15deg); }
      100% { transform: translateX(250%) skewX(-15deg); }
    }
    @keyframes dashOffset {
      0%   { stroke-dashoffset: 52; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes connectorPulse {
      0%, 100% { filter: drop-shadow(0 0 4px rgba(45, 212, 191, 0.4)); transform: scale(1); }
      50%      { filter: drop-shadow(0 0 14px rgba(79, 124, 255, 0.95)); transform: scale(1.25); }
    }
    @keyframes shimmerPulse {
      0%,100% { opacity: 0.4; }
      50%      { opacity: 1; }
    }
    @keyframes float1 {
      0%,100% { transform: translateY(0px) rotate(0deg); }
      50%      { transform: translateY(-16px) rotate(0.6deg); }
    }
    @keyframes float2 {
      0%,100% { transform: translateY(0px) rotate(0deg); }
      50%      { transform: translateY(-10px) rotate(-0.6deg); }
    }
    @keyframes float3 {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-8px); }
    }
    @keyframes blobDrift1 {
      0%,100% { transform: translate(0,0) scale(1); }
      33%      { transform: translate(50px,-40px) scale(1.06); }
      66%      { transform: translate(-30px,50px) scale(0.94); }
    }
    @keyframes blobDrift2 {
      0%,100% { transform: translate(0,0) scale(1); }
      40%      { transform: translate(-60px,30px) scale(1.1); }
      70%      { transform: translate(40px,-60px) scale(0.9); }
    }
    @keyframes blobDrift3 {
      0%,100% { transform: translate(0,0) scale(1); }
      50%      { transform: translate(30px,70px) scale(1.04); }
    }

    /* ── Shimmer text ── */
    .shimmer-text {
      background: linear-gradient(90deg, #4F7CFF 0%, #14B8A6 25%, #8B5CF6 50%, #2DD4BF 75%, #4F7CFF 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmerText 3s linear infinite;
    }

    /* ── Shimmer border card ── */
    .shimmer-border-card {
      position: relative; border-radius: 20px; padding: 1px;
      background: linear-gradient(120deg, rgba(79,124,255,0.45) 0%, rgba(20,184,166,0.45) 25%, rgba(139,92,246,0.45) 50%, rgba(45,212,191,0.45) 75%, rgba(79,124,255,0.45) 100%);
      background-size: 300% 300%;
      animation: shimmerBorder 4s ease infinite;
    }
    .shimmer-border-card-inner {
      background: rgba(5,8,22,0.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 19px; width: 100%; height: 100%;
    }

    /* ── Sweep shimmer ── */
    .sweep-parent { position: relative; overflow: hidden; }
    .sweep-parent::after {
      content: '';
      position: absolute; top: 0; left: 0;
      width: 50px; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
      animation: shimmerSweep 3.5s ease-in-out infinite;
    }

    /* ── Glass base ── */
    .glass-card {
      background: rgba(255,255,255,0.04);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 20px;
    }

    /* ── Buttons ── */
    .btn-primary {
      position: relative; overflow: hidden;
      display: inline-flex; align-items: center; gap: 8px;
      font-family: 'Inter',sans-serif; font-weight: 700; font-size: 15px;
      color: #fff; text-decoration: none;
      padding: 14px 28px; border-radius: 12px; border: none; cursor: pointer;
      background: linear-gradient(135deg, #4F7CFF 0%, #14B8A6 50%, #8B5CF6 100%);
      box-shadow: 0 0 30px rgba(20,184,166,0.35), 0 4px 20px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    }
    .btn-primary::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
      transform: translateX(-100%) skewX(-15deg);
      transition: transform 0.5s ease;
    }
    .btn-primary:hover { box-shadow: 0 0 56px rgba(45,212,191,0.6), 0 8px 30px rgba(0,0,0,0.4); transform: translateY(-2px); }
    .btn-primary:hover::before { transform: translateX(250%) skewX(-15deg); }

    .btn-outline {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: 'Inter',sans-serif; font-weight: 600; font-size: 15px;
      color: #CBD5E1; text-decoration: none;
      padding: 13px 26px; border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.15);
      background: rgba(255,255,255,0.04); backdrop-filter: blur(10px);
      transition: all 0.25s ease;
    }
    .btn-outline:hover {
      color: #F8FAFC; border-color: rgba(45,212,191,0.5);
      background: rgba(20,184,166,0.08);
      box-shadow: 0 0 24px rgba(45,212,191,0.2); transform: translateY(-2px);
    }

    /* ── Section label ── */
    .section-label {
      display: inline-block;
      font-family: 'Inter',sans-serif; font-size: 11px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 16px;
    }

    /* ── Badge dot ── */
    .badge-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #2DD4BF; box-shadow: 0 0 10px #2DD4BF;
      animation: shimmerPulse 2s ease-in-out infinite;
    }

    /* ── Skill tag ── */
    .skill-tag {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 10px; border-radius: 6px;
      font-family: 'Inter',sans-serif; font-size: 12px; font-weight: 500;
    }
    .skill-tosca   { background: rgba(20,184,166,0.12); border: 1px solid rgba(45,212,191,0.35); color: #2DD4BF; }
    .skill-matched { background: rgba(34,211,238,0.08); border: 1px solid rgba(34,211,238,0.22); color: #22D3EE; }
    .skill-missing  { background: rgba(251,191,36,0.08);  border: 1px solid rgba(251,191,36,0.22);  color: #F59E0B; }
    .skill-neutral  { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);  color: #94A3B8; }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .hero-grid   { flex-direction: column !important; }
      .hero-cards  { width: 100% !important; margin-top: 40px; min-height: 340px !important; }
      .ai-exp-grid { flex-direction: column !important; }
    }
    @media (max-width: 768px) {
      .steps-grid    { grid-template-columns: 1fr 1fr !important; }
      .features-grid { grid-template-columns: 1fr 1fr !important; }
      .stats-grid    { grid-template-columns: 1fr 1fr !important; }
      .flow-connector { display: none !important; }
      .testi-grid  { grid-template-columns: 1fr !important; }
    }
    @media (max-width: 520px) {
      .hero-cta      { flex-direction: column !important; align-items: stretch !important; }
      .steps-grid    { grid-template-columns: 1fr !important; }
      .features-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

/* ─────────────────────────────────────────
   UTILS
───────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' } }),
};

const AnimatedNumber = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setCount(target); clearInterval(t); } else setCount(cur);
    }, 20);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const ProgressBar = ({ label, value, color = '#4F7CFF', delay = 0 }) => (
  <div style={{ marginBottom: '10px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#64748B' }}>{label}</span>
      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#CBD5E1', fontWeight: 600 }}>{value}%</span>
    </div>
    <div style={{ height: '5px', borderRadius: '99px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden', position: 'relative' }}>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay, ease: 'easeOut' }}
        style={{ height: '100%', borderRadius: '99px', background: `linear-gradient(90deg,${color},#8B5CF6)`, position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)', animation: 'shimmerSweep 2s ease-in-out infinite' }} />
      </motion.div>
    </div>
  </div>
);
/* ─────────────────────────────────────────
   SHIMMER BROKEN LINE CONNECTOR COMPONENT
───────────────────────────────────────── */
const ShimmerBrokenConnector = ({ color = '#4F7CFF', active = false, stepIndex = 0 }) => {
  const cleanColor = color.replace('#', '');
  return (
    <div className="flow-connector" style={{ flex: '0 0 54px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '48px', position: 'relative' }}>
      <svg width="54" height="32" viewBox="0 0 54 32" fill="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`gradShimmer-${cleanColor}-${stepIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="50%" stopColor="#2DD4BF" stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Outer subtle glow line */}
        <path
          d="M 0 16 H 12 L 18 8 H 30 L 36 24 H 44 L 54 16"
          stroke={color}
          strokeWidth="3"
          strokeOpacity="0.15"
          fill="none"
        />

        {/* Base Broken / Dashed Line (Tanda patah-patah) */}
        <path
          d="M 0 16 H 12 L 18 8 H 30 L 36 24 H 44 L 54 16"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Animated Shimmer Laser Dash along the broken path */}
        <path
          d="M 0 16 H 12 L 18 8 H 30 L 36 24 H 44 L 54 16"
          stroke={`url(#gradShimmer-${cleanColor}-${stepIndex})`}
          strokeWidth="2.5"
          strokeDasharray="10 16"
          strokeLinecap="round"
          fill="none"
          style={{
            animation: 'dashOffset 1.6s linear infinite',
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />

        {/* Central glowing pulse node */}
        <g style={{ animation: 'connectorPulse 2s ease-in-out infinite' }}>
          <polygon
            points="24,11 28,16 24,21 20,16"
            fill={color}
          />
          <circle cx="24" cy="16" r="2" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};

const HeroConstellationCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Device detection: skip canvas particle rendering on mobile for clean UI & fast performance
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      typeof navigator !== 'undefined' ? navigator.userAgent : ''
    ) || (typeof window !== 'undefined' && window.innerWidth < 768);

    if (isMobileDevice) return;

    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId;

    let width = (canvas.width = parent.offsetWidth || window.innerWidth || 1200);
    let height = (canvas.height = parent.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const p = canvas.parentElement;
      width = canvas.width = p.offsetWidth || window.innerWidth || 1200;
      height = canvas.height = p.offsetHeight || 600;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(45, Math.floor((width * height) / 15000) || 30);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1,
      color: ['#2DD4BF', '#4F7CFF', '#8B5CF6', '#22D3EE'][Math.floor(Math.random() * 4)],
      alpha: Math.random() * 0.6 + 0.3,
    }));

    let animPhase = 0;
    const draw = () => {
      try {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        animPhase += 0.5;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
              ctx.beginPath();
              // Dashed broken lines with shimmer
              ctx.setLineDash([5, 4]);
              ctx.lineDashOffset = -animPhase * 0.4;

              const midX = (p.x + p2.x) / 2 + (i % 2 === 0 ? 4 : -4);
              const midY = (p.y + p2.y) / 2 + (j % 2 === 0 ? -4 : 4);

              ctx.moveTo(p.x, p.y);
              ctx.lineTo(midX, midY);
              ctx.lineTo(p2.x, p2.y);

              const lineAlpha = (1 - dist / 130) * 0.32;
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = lineAlpha;
              ctx.lineWidth = 1;
              ctx.stroke();
              ctx.setLineDash([]); // Reset line dash
            }
          }
        }
      } catch (e) {
        console.warn('Canvas render caught:', e);
      }
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.85,
      }}
    />
  );
};

/* ─────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────── */
const DEMO_ROLES = [
  {
    role: 'Digital Marketing',
    level: 'Level Specialist',
    score: 94,
    jobs: 38,
    skills: [
      { l: 'SEO & Content', matched: true },
      { l: 'Google Ads', matched: true },
      { l: 'Social Media Strategy', matched: true },
      { l: 'Copywriting', matched: true },
      { l: 'Data Analytics', matched: false },
    ],
  },
  {
    role: 'UI/UX Designer',
    level: 'Level Mid-Junior',
    score: 95,
    jobs: 31,
    skills: [
      { l: 'Figma', matched: true },
      { l: 'User Research', matched: true },
      { l: 'Wireframing', matched: true },
      { l: 'Prototyping', matched: true },
      { l: 'Design Systems', matched: false },
    ],
  },
  {
    role: 'Full Stack Developer',
    level: 'Level Mid-Senior',
    score: 98,
    jobs: 52,
    skills: [
      { l: 'React & Inertia', matched: true },
      { l: 'Laravel & PHP', matched: true },
      { l: 'Tailwind & CSS', matched: true },
      { l: 'REST API', matched: true },
      { l: 'Docker & DevOps', matched: false },
    ],
  },
];

/* ─────────────────────────────────────────
   ULTRA-PREMIUM 3D MULTI-DEVICE ECOSYSTEM SHOWCASE (MACBOOK PRO + IPHONE + SLIDER)
───────────────────────────────────────── */
const MultiDeviceShowcase3D = ({ currentDemo, DEMO_ROLES, selectedRoleIdx, setSelectedRoleIdx }) => {
  const [activeSlide, setActiveSlide] = useState(2);
  const [isPlaying, setIsPlaying] = useState(true);
  const [tilt, setTilt] = useState({ x: -3, y: 5 });
  const [isHovered, setIsHovered] = useState(false);
  // Click ripple sparks
  const [clickSparks, setClickSparks] = useState([]);
  // Drag-to-rotate
  const [dragStart, setDragStart] = useState(null);
  const [dragRotateY, setDragRotateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  // Left-right sway phase offset
  const [swayPhase, setSwayPhase] = useState(0);

  // Auto-play slide transition timer (Special 25s hold duration for Ecosystem Sync)
  useEffect(() => {
    if (!isPlaying) return;
    const currentDelay = activeSlide === 2 ? 25000 : 6000;
    const timer = setTimeout(() => {
      setActiveSlide(prev => (prev + 1) % 3);
    }, currentDelay);
    return () => clearTimeout(timer);
  }, [isPlaying, activeSlide]);

  // Continuous left-right sway animation loop
  useEffect(() => {
    let frame;
    let start = Date.now();
    const animate = () => {
      if (!isHovered && !isDragging) {
        const t = (Date.now() - start) / 1000;
        setSwayPhase(Math.sin(t * 0.55) * 9); // gentle ±9deg sway
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isHovered, isDragging]);

  const handleMouseMove = (e) => {
    if (isDragging && dragStart) {
      const dx = e.clientX - dragStart.x;
      setDragRotateY(dx * 0.35);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -14, y: x * 14 });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTilt({ x: -3, y: 5 });
    setIsHovered(false);
    if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
      // Spring back drag rotation
      setDragRotateY(prev => prev * 0.1);
    }
  };

  const handleMouseDown = (e) => {
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
    setIsHovered(false);
  };

  const handleMouseUp = (e) => {
    if (isDragging && dragStart) {
      const dx = Math.abs(e.clientX - dragStart.x);
      if (dx < 8) {
        // It was a click, not a drag — fire ripple spark
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const id = Date.now();
        setClickSparks(prev => [...prev, { id, cx, cy }]);
        setTimeout(() => setClickSparks(prev => prev.filter(s => s.id !== id)), 900);
      } else {
        // Snap rotate direction = switch slide
        if (dragRotateY > 25) setActiveSlide(prev => (prev + 2) % 3);
        else if (dragRotateY < -25) setActiveSlide(prev => (prev + 1) % 3);
      }
    }
    setIsDragging(false);
    setDragStart(null);
    setDragRotateY(0);
  };

  const SLIDES = [
    { id: 0, label: 'MacBook Pro 16"', icon: Laptop, badge: 'Desktop Workspace' },
    { id: 1, label: 'iPhone 16 Pro', icon: Smartphone, badge: 'Mobile App View' },
    { id: 2, label: 'Ecosystem Sync', icon: Layers, badge: 'Multi-Device 3D' },
  ];

  // MacBook Pro 16" Renderer Component
  const renderMacBook = (isMini = false) => (
    <div style={{ width: '100%', transformStyle: 'preserve-3d' }}>
      {/* Display Frame */}
      <div
        style={{
          background: 'linear-gradient(145deg, #334155 0%, #1e293b 40%, #0f172a 100%)',
          borderRadius: isMini ? '16px 16px 0 0' : '22px 22px 0 0',
          padding: isMini ? '6px 6px 0' : '8px 8px 0',
          border: '2px solid rgba(255, 255, 255, 0.18)',
          boxShadow: `
            0 25px 65px -10px rgba(0, 0, 0, 0.9),
            0 0 35px rgba(79, 124, 255, 0.25),
            inset 0 1px 2px rgba(255, 255, 255, 0.3)
          `,
          position: 'relative',
        }}
      >
        {/* Notch */}
        <div style={{ width: isMini ? '30px' : '40px', height: isMini ? '8px' : '11px', background: '#000000', borderRadius: '0 0 6px 6px', margin: '0 auto', position: 'relative', zIndex: 12, border: '1px solid rgba(255,255,255,0.1)', borderTop: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#1e293b' }} />
        </div>

        {/* Display Inner Content */}
        <div style={{ background: '#070a14', borderRadius: isMini ? '10px 10px 0 0' : '14px 14px 0 0', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {/* macOS Top Window Bar */}
          <div style={{ background: '#0b1120', padding: isMini ? '5px 8px' : '7px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />
            </div>
            <span style={{ fontSize: isMini ? '8.5px' : '10px', color: '#94A3B8', fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>AyoKerja Workspace / OVERVIEW AI</span>
            <span style={{ fontSize: isMini ? '7.5px' : '8.5px', color: '#2DD4BF', fontWeight: 700, background: 'rgba(20,184,166,0.12)', padding: '1px 5px', borderRadius: '4px' }}>AI Engine Active</span>
          </div>

          {/* Desktop Dashboard Grid (Image 2 Match) */}
          <div style={{ display: 'grid', gridTemplateColumns: isMini ? '110px 1fr' : '140px 1fr', minHeight: isMini ? '230px' : '310px', background: '#050816' }}>
            {/* Sidebar */}
            <div style={{ background: '#070b1a', borderRight: '1px solid rgba(255,255,255,0.06)', padding: isMini ? '8px 5px' : '12px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 2px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'linear-gradient(135deg,#4F7CFF,#2DD4BF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={12} color="#FFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 900, color: '#F8FAFC', lineHeight: 1 }}>AyoKerja</div>
                    <div style={{ fontSize: '6.5px', fontWeight: 800, color: '#2DD4BF', letterSpacing: '0.08em' }}>WORKSPACE AI</div>
                  </div>
                </div>

                {/* Category: UTAMA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '7px', fontWeight: 800, color: '#475569', letterSpacing: '0.08em', padding: '1px 4px' }}>UTAMA</span>
                  <div style={{ background: 'linear-gradient(90deg,rgba(79,124,255,0.25),rgba(45,212,191,0.25))', border: '1px solid rgba(45,212,191,0.4)', borderRadius: '6px', padding: '4px 6px', color: '#2DD4BF', fontSize: '8.5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Brain size={10} /> Overview AI
                  </div>
                  <div style={{ padding: '4px 6px', color: '#64748B', fontSize: '8.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <BarChart3 size={10} /> Analisis CV
                  </div>
                </div>

                {/* Category: KARIR */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '7px', fontWeight: 800, color: '#475569', letterSpacing: '0.08em', padding: '1px 4px' }}>KARIR</span>
                  <div style={{ padding: '4px 6px', color: '#64748B', fontSize: '8.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Briefcase size={10} /> Lowongan (20)
                  </div>
                  <div style={{ padding: '4px 6px', color: '#64748B', fontSize: '8.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Route size={10} /> Career Roadmap
                  </div>
                </div>

                {/* Category: ALAT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '7px', fontWeight: 800, color: '#475569', letterSpacing: '0.08em', padding: '1px 4px' }}>ALAT</span>
                  <div style={{ padding: '4px 6px', color: '#64748B', fontSize: '8.5px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FileText size={10} /> ATS CV Builder
                    </div>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#2DD4BF' }} />
                  </div>
                </div>
              </div>

              {/* Bottom User Pill */}
              <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '4px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#38bdf8', color: '#0f172a', fontWeight: 800, fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>LA</div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '8px', fontWeight: 900, color: '#F8FAFC', whiteSpace: 'nowrap' }}>laura gunawan</div>
                    <div style={{ fontSize: '6.5px', color: '#2DD4BF', whiteSpace: 'nowrap' }}>Full Stack Dev</div>
                  </div>
                </div>
                <LogOut size={9} color="#64748B" />
              </div>
            </div>

            {/* Content Area */}
            <div style={{ padding: isMini ? '8px' : '10px', overflow: 'hidden' }}>
              {/* User Greeting Banner */}
              <div style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.85))', border: '1px solid rgba(45,212,191,0.3)', borderRadius: '10px', padding: '8px 10px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '7.5px', color: '#2DD4BF', background: 'rgba(20,184,166,0.15)', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>Platform Karir Berbasis AI</span>
                    <span style={{ fontSize: '7.5px', color: '#818cf8', background: 'rgba(99,102,241,0.15)', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>Target Role: Full Stack Developer</span>
                  </div>
                  <button style={{ background: 'linear-gradient(90deg,#2DD4BF,#4F7CFF)', border: 'none', borderRadius: '5px', padding: '3px 7px', color: '#0f172a', fontSize: '8px', fontWeight: 800, cursor: 'pointer' }}>
                    + Upload / Analisis CV
                  </button>
                </div>
                <div style={{ fontSize: '10px', fontWeight: 900, color: '#F8FAFC' }}>
                  Selamat Malam, <span style={{ color: '#818cf8' }}>laura gunawan!</span>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
                {[
                  { label: 'Skor ATS CV Aktif', val: '65', max: '/100', status: 'Cukup Baik', color: '#2dd4bf', pct: 65 },
                  { label: 'Kecocokan Karir AI', val: '100', max: '%', status: 'Live API Match', color: '#818cf8', pct: 100 },
                  { label: 'Penguasaan Skill Target', val: '83', max: '%', status: '5/6 Skill', color: '#c084fc', pct: 83 },
                  { label: 'Koleksi CV Tersimpan', val: '1', max: ' Dok', status: 'Multi-CV Ready', color: '#38bdf8', pct: 100 },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', padding: '5px 6px' }}>
                    <div style={{ fontSize: '6.5px', color: '#64748B', fontWeight: 700, marginBottom: '1px', whiteSpace: 'nowrap' }}>{m.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: '#F8FAFC', lineHeight: 1 }}>
                      {m.val}<span style={{ fontSize: '7.5px', color: '#94a3b8' }}>{m.max}</span>
                    </div>
                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', margin: '3px 0 2px', overflow: 'hidden' }}>
                      <div style={{ width: `${m.pct}%`, height: '100%', background: m.color }} />
                    </div>
                    <span style={{ fontSize: '6px', color: m.color, fontWeight: 700 }}>{m.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Base */}
      <div
        style={{
          background: 'linear-gradient(to bottom, #1e293b 0%, #0f172a 100%)',
          height: isMini ? '10px' : '14px',
          borderRadius: '0 0 14px 14px',
          border: '2px solid rgba(255,255,255,0.14)',
          borderTop: 'none',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(0,0,0,0.7)',
        }}
      >
        <div style={{ width: '50px', height: '4px', background: '#020617', borderRadius: '0 0 4px 4px', border: '1px solid rgba(255,255,255,0.1)', borderTop: 'none' }} />
      </div>
    </div>
  );

  // iPhone 16 Pro Renderer Component
  const renderIphone = (isMini = false) => (
    <div
      style={{
        width: isMini ? '180px' : '245px',
        margin: '0 auto',
        background: 'linear-gradient(145deg, #3a4252 0%, #1c2230 35%, #0b0f1a 100%)',
        borderRadius: isMini ? '36px' : '46px',
        padding: isMini ? '7px' : '9px',
        boxShadow: `
          0 25px 65px -10px rgba(0, 0, 0, 0.9),
          0 0 35px rgba(45, 212, 191, 0.25),
          inset 0 1px 2px rgba(255, 255, 255, 0.35)
        `,
        border: '2px solid rgba(255, 255, 255, 0.18)',
        position: 'relative',
      }}
    >
      {/* Side Buttons (Action Button, Volume Keys, Power Lock Key) */}
      <div style={{ position: 'absolute', top: isMini ? '60px' : '85px', left: '-5px', width: '3px', height: isMini ? '16px' : '22px', background: '#475569', borderRadius: '2px 0 0 2px' }} />
      <div style={{ position: 'absolute', top: isMini ? '85px' : '118px', left: '-5px', width: '3px', height: isMini ? '22px' : '30px', background: '#475569', borderRadius: '2px 0 0 2px' }} />
      <div style={{ position: 'absolute', top: isMini ? '114px' : '156px', left: '-5px', width: '3px', height: isMini ? '22px' : '30px', background: '#475569', borderRadius: '2px 0 0 2px' }} />
      <div style={{ position: 'absolute', top: isMini ? '95px' : '130px', right: '-5px', width: '3px', height: isMini ? '32px' : '45px', background: '#475569', borderRadius: '0 2px 2px 0' }} />

      {/* Screen Frame */}
      <div
        style={{
          background: '#070a14',
          borderRadius: isMini ? '30px' : '38px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          minHeight: isMini ? '340px' : '470px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Status Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMini ? '6px 12px 3px' : '9px 14px 4px' }}>
          <span style={{ fontSize: isMini ? '8.5px' : '10px', fontWeight: 800, color: '#f8fafc' }}>09:41</span>
          <div style={{ width: isMini ? '65px' : '80px', height: isMini ? '15px' : '18px', background: '#000000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#2dd4bf' }} />
              <span style={{ fontSize: isMini ? '6.5px' : '7.5px', fontWeight: 800, color: '#2dd4bf' }}>AyoKerja</span>
            </div>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#334155' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#94a3b8', fontSize: '8px' }}>
            <Signal size={isMini ? 8 : 10} />
            <Wifi size={isMini ? 8 : 10} />
            <span style={{ fontSize: isMini ? '7px' : '8px', fontWeight: 800, color: '#f8fafc' }}>88%</span>
          </div>
        </div>

        {/* Screen Content */}
        <div style={{ padding: isMini ? '8px 10px 10px' : '12px 14px 14px', background: 'radial-gradient(circle at top, rgba(15,23,42,0.95), rgba(5,8,22,0.98))', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'linear-gradient(135deg,#4F7CFF,#2DD4BF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={12} color="#FFF" />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#F8FAFC', display: 'block', lineHeight: 1 }}>AyoKerja</span>
                  <span style={{ fontSize: '6.5px', fontWeight: 800, color: '#2DD4BF', letterSpacing: '0.05em' }}>PRO MOBILE</span>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '3px 7px', borderRadius: '6px', color: '#94A3B8', fontSize: '9px', fontWeight: 800 }}>
                ≡
              </div>
            </div>

            {/* User Greeting Card */}
            <div style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.8))', border: '1px solid rgba(45,212,191,0.35)', borderRadius: '12px', padding: isMini ? '8px' : '10px', marginBottom: '10px', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
              <div style={{ fontSize: '7.5px', color: '#2DD4BF', fontWeight: 800, marginBottom: '2px' }}>Platform Karir Berbasis AI</div>
              <div style={{ fontSize: isMini ? '11px' : '12.5px', fontWeight: 900, color: '#F8FAFC', marginBottom: '6px' }}>
                Selamat Malam, <span style={{ color: '#818cf8' }}>laura gunawan!</span>
              </div>
              <button style={{ width: '100%', background: 'linear-gradient(90deg,#2DD4BF,#4F7CFF)', border: 'none', borderRadius: '8px', padding: '6px', color: '#0f172a', fontSize: '9px', fontWeight: 900, cursor: 'pointer' }}>
                + Upload / Analisis CV
              </button>
            </div>

            {/* Stat Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
              <div style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '7px 8px' }}>
                <div style={{ fontSize: '7.5px', color: '#64748B', fontWeight: 700 }}>Skor ATS CV</div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#F8FAFC' }}>65<span style={{ fontSize: '9px', color: '#94a3b8' }}>/100</span></div>
                <div style={{ height: '3.5px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', margin: '4px 0 2px', overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', background: '#2dd4bf' }} />
                </div>
              </div>
              <div style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '7px 8px' }}>
                <div style={{ fontSize: '7.5px', color: '#64748B', fontWeight: 700 }}>Kecocokan Karir</div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#F8FAFC' }}>100<span style={{ fontSize: '9px', color: '#94a3b8' }}>%</span></div>
                <div style={{ height: '3.5px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', margin: '4px 0 2px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: '#818cf8' }} />
                </div>
              </div>
            </div>

            {/* Quick Action Feature Pill */}
            {!isMini && (
              <div style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(45,212,191,0.25)', borderRadius: '10px', padding: '8px 10px', marginBottom: '10px', display: 'flex', items: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={12} color="#2DD4BF" />
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#E2E8F0' }}>Auto-Sync ATS &amp; Roadmap</span>
                </div>
                <span style={{ fontSize: '8px', fontWeight: 800, color: '#2DD4BF' }}>Aktif ›</span>
              </div>
            )}
          </div>

          {/* Bottom Nav & iOS Home Bar */}
          <div>
            {/* Mobile Bottom Dock Navbar */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { icon: Brain, label: 'Overview', active: true },
                { icon: Briefcase, label: 'Lowongan', active: false },
                { icon: Route, label: 'Roadmap', active: false },
                { icon: FileText, label: 'CV ATS', active: false },
              ].map((nav, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', opacity: nav.active ? 1 : 0.45 }}>
                  <nav.icon size={12} color={nav.active ? '#2DD4BF' : '#94A3B8'} />
                  <span style={{ fontSize: '7.5px', fontWeight: nav.active ? 800 : 500, color: nav.active ? '#2DD4BF' : '#94A3B8' }}>{nav.label}</span>
                </div>
              ))}
            </div>

            {/* iOS Home Indicator Bar */}
            <div style={{ width: '80px', height: '3.5px', background: 'rgba(255,255,255,0.35)', borderRadius: '2px', margin: '7px auto 0' }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        perspective: '1300px',
        position: 'relative',
        width: '100%',
        maxWidth: '540px',
        minHeight: '480px',
        margin: '0 auto',
        padding: '0 0 10px',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
    >
      {/* Click Spark Ripples */}
      {clickSparks.map(spark => (
        <div key={spark.id} style={{ position: 'absolute', left: spark.cx, top: spark.cy, pointerEvents: 'none', zIndex: 99 }}>
          {/* Outer ripple ring */}
          <div style={{
            position: 'absolute',
            transform: 'translate(-50%,-50%)',
            width: '0px', height: '0px',
            borderRadius: '50%',
            border: '2px solid rgba(45,212,191,0.9)',
            animation: 'clickRipple 0.75s ease-out forwards',
          }} />
          {/* Inner glow */}
          <div style={{
            position: 'absolute',
            transform: 'translate(-50%,-50%)',
            width: '8px', height: '8px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(45,212,191,1) 0%, transparent 70%)',
            animation: 'clickGlow 0.5s ease-out forwards',
          }} />
          {/* Spark particles */}
          {[0,60,120,180,240,300].map(deg => (
            <div key={deg} style={{
              position: 'absolute',
              transform: `translate(-50%,-50%) rotate(${deg}deg)`,
              width: '2px', height: '2px',
              borderRadius: '50%',
              background: deg % 120 === 0 ? '#818cf8' : '#2dd4bf',
              animation: `sparkFly${deg} 0.65s ease-out forwards`,
            }} />
          ))}
        </div>
      ))}
      {/* Left/Right drag hint arrows */}
      {!isHovered && !isDragging && (
        <>
          <div style={{
            position: 'absolute', left: '-28px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 30, pointerEvents: 'none',
            animation: 'hintArrowLeft 1.8s ease-in-out infinite',
            opacity: 0.6,
          }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(45,212,191,0.15)', border: '1px solid rgba(45,212,191,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
              <ChevronLeft size={12} color="#2DD4BF" />
            </div>
          </div>
          <div style={{
            position: 'absolute', right: '-28px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 30, pointerEvents: 'none',
            animation: 'hintArrowRight 1.8s ease-in-out infinite',
            opacity: 0.6,
          }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(45,212,191,0.15)', border: '1px solid rgba(45,212,191,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
              <ChevronRight size={12} color="#2DD4BF" />
            </div>
          </div>
        </>
      )}
      {/* Ambient Glow Backlight */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '420px',
          background: 'radial-gradient(ellipse, rgba(79, 124, 255, 0.28) 0%, rgba(45, 212, 191, 0.22) 45%, transparent 75%)',
          filter: 'blur(55px)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Top Device Switcher Tabs & Auto-Play Control */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
          marginBottom: '20px',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(45, 212, 191, 0.3)',
          padding: '6px 10px',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
          {SLIDES.map((slide) => {
            const Icon = slide.icon;
            const isActive = activeSlide === slide.id;
            return (
              <button
                key={slide.id}
                onClick={() => {
                  setActiveSlide(slide.id);
                  setIsPlaying(false);
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '7px 10px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontFamily: "'Inter',sans-serif",
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(20,184,166,0.3) 0%, rgba(79,124,255,0.3) 100%)'
                    : 'transparent',
                  color: isActive ? '#F8FAFC' : '#64748B',
                  border: isActive ? '1px solid rgba(45,212,191,0.45)' : '1px solid transparent',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? '0 0 12px rgba(45,212,191,0.2)' : 'none',
                }}
              >
                <Icon size={13} color={isActive ? '#2DD4BF' : '#64748B'} />
                <span>{slide.label}</span>
              </button>
            );
          })}
        </div>

        {/* Auto-rotate Toggle */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Jeda Rotasi Otomatis' : 'Mulai Rotasi Otomatis'}
          style={{
            border: 'none',
            background: 'rgba(255, 255, 255, 0.05)',
            color: isPlaying ? '#2DD4BF' : '#64748B',
            borderRadius: '8px',
            padding: '7px 9px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
        </button>
      </div>

      {/* 3D Motion Container */}
      <motion.div
        animate={{
          rotateX: isHovered ? tilt.x : -3,
          rotateY: isHovered ? tilt.y : (isDragging ? dragRotateY : swayPhase),
          translateY: isHovered ? -3 : [0, -6, 0],
          scale: isDragging ? 1.02 : 1,
        }}
        transition={{
          rotateX: { duration: isHovered ? 0.12 : 0.3, ease: 'easeOut' },
          rotateY: { duration: isHovered ? 0.12 : (isDragging ? 0.05 : 0.08), ease: isDragging ? 'linear' : 'easeOut' },
          translateY: isHovered ? { duration: 0.12 } : { duration: 4.5, ease: 'easeInOut', repeat: Infinity },
          scale: { duration: 0.2 },
        }}
        style={{
          transformStyle: 'preserve-3d',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <AnimatePresence mode="wait">
          {/* ════════════════════════════════════════════════════════════ */}
          {/* SLIDE 0: MACBOOK PRO 16" 3D MOCKUP */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSlide === 0 && (
            <motion.div
              key="macbook-slide"
              initial={{ opacity: 0, scale: 0.92, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.92, rotateY: 15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: 'preserve-3d', padding: '10px 0' }}
            >
              {renderMacBook(false)}
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* SLIDE 1: IPHONE 16 PRO 3D MOCKUP */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSlide === 1 && (
            <motion.div
              key="iphone-slide"
              initial={{ opacity: 0, scale: 0.92, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.92, rotateY: 15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: 'preserve-3d', padding: '10px 0' }}
            >
              {renderIphone(false)}
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* SLIDE 2: ECOSYSTEM MULTI-DEVICE 3D SYNCHRONIZED VIEW */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSlide === 2 && (
            <motion.div
              key="ecosystem-slide"
              initial={{ opacity: 0, scale: 0.92, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.92, rotateY: 15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: 'preserve-3d', position: 'relative', minHeight: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}
            >
              {/* MacBook in background layer */}
              <div style={{ width: '82%', transform: 'translate3d(-35px, -15px, -40px) rotateY(-10deg)', opacity: 0.92 }}>
                {renderMacBook(true)}
              </div>

              {/* iPhone floating in foreground layer */}
              <div style={{ position: 'absolute', right: '-5px', bottom: '-15px', transform: 'translate3d(0, 15px, 50px) rotateY(10deg)', zIndex: 6 }}>
                {renderIphone(true)}
              </div>

              {/* Ecosystem Sync Pulsing Glass Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%) translateZ(90px)',
                  background: 'rgba(15, 23, 42, 0.94)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(45, 212, 191, 0.5)',
                  borderRadius: '12px',
                  padding: '6px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(45,212,191,0.3)',
                  whiteSpace: 'nowrap',
                  zIndex: 25,
                }}
              >
                <Sparkles size={13} color="#2DD4BF" />
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#F8FAFC' }}>Real-Time Ecosystem Auto-Sync</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating 3D Badge Left: Kecocokan Karir AI 100% */}
        <motion.div
          animate={{
            y: [-4, 6, -4],
            rotateZ: [-1, 1.5, -1],
          }}
          transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '-25px',
            zIndex: 35,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(79, 124, 255, 0.45)',
            borderRadius: '16px',
            padding: '9px 14px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 25px rgba(79,124,255,0.3)',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(120px)',
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
            <BadgeCheck size={12} color="#4F7CFF" />
            <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#4F7CFF', letterSpacing: '0.08em' }}>AI CAREER MATCH</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#F8FAFC' }}>98.4% Accuracy</div>
        </motion.div>

        {/* Floating 3D Badge Right: ATS Passed */}
        <motion.div
          animate={{
            y: [4, -6, 4],
            rotateZ: [1, -1.5, 1],
          }}
          transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '-18px',
            right: '-25px',
            zIndex: 35,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(45, 212, 191, 0.45)',
            borderRadius: '16px',
            padding: '9px 14px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 25px rgba(45,212,191,0.3)',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(120px)',
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
            <CheckCircle2 size={12} color="#2DD4BF" />
            <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#2DD4BF', letterSpacing: '0.08em' }}>STANDARD HARVARD ATS</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#F8FAFC' }}>Ready to Apply</div>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────
   ULTRA-PREMIUM 3D TESTIMONIAL CINEMA & INFINITE MARQUEE PROOF SHOWCASE
───────────────────────────────────────── */
const InteractiveTestimonials = () => {
  const { t } = useTranslation();
  const TESTIMONIALS_DATA = [
    {
      id: 0,
      name: 'Rizki D. Prasetya',
      shortName: 'Rizki D.',
      initials: 'RD',
      role: t('landing.tData.d0.role', 'Marketing Executive'),
      prevRole: t('landing.tData.d0.prev', 'Fresh Graduate'),
      company: 'PT Tech Innovasi Digital',
      location: 'Jakarta',
      color: '#2DD4BF',
      cRgb: '45, 212, 191',
      stars: 5,
      badge: t('landing.tData.d0.badge', 'Lolos Seleksi Berkas H+7'),
      metric: t('landing.tData.d0.metric', 'Gaji Up 2.2x'),
      quote: t('landing.tData.d0.quote', 'Saya tidak pernah membayangkan AI bisa membaca kualifikasi karier saya secara mendalam. Setelah memoles poin pengalaman dengan metode STAR & format Harvard ATS di platform ini, dalam seminggu profil saya langsung dilirik HR!'),
      tags: ['ATS Score 96', 'Harvard Format', 'Marketing Tech']
    },
    {
      id: 1,
      name: 'Alya S. Wardhani',
      shortName: 'Alya S.',
      initials: 'AS',
      role: t('landing.tData.d1.role', 'Junior UI/UX Designer'),
      prevRole: t('landing.tData.d1.prev', 'Mahasiswa Tingkat Akhir'),
      company: 'Unicorn Studio Design',
      location: 'Bandung',
      color: '#8B5CF6',
      cRgb: '139, 92, 246',
      stars: 5,
      badge: t('landing.tData.d1.badge', 'Roadmap Presisi 100%'),
      metric: t('landing.tData.d1.metric', 'Portofolio Verified'),
      quote: t('landing.tData.d1.quote', 'Peta jalan karier (Career Roadmap) dari AyoKerja sangat spesifik dengan latar belakang jurusan saya. Membantu saya menyusun portofolio dan mempelajari skill yang paling dicari HR industri saat ini!'),
      tags: ['Career Roadmap', 'UI/UX Design', 'Figma Pro']
    },
    {
      id: 2,
      name: 'Fajar I. Kencana',
      shortName: 'Fajar I.',
      initials: 'FK',
      role: 'Data Analyst & BI Specialist',
      prevRole: 'Career Switcher (Akuntansi)',
      company: 'Enterprise Data Corp',
      location: 'Surabaya',
      color: '#38BDF8',
      cRgb: '56, 189, 248',
      stars: 5,
      badge: 'Switch Career 2 Bulan',
      metric: 'Lulus Test Data',
      quote: 'Fitur rekomendasi karier dan analisis gap skill AI-nya juara banget! Saya beralih bidang dari Akuntansi ke Data Analytics tanpa kebingungan karena bimbingan AI yang sangat terarah.',
      tags: ['Career Switcher', 'SQL & Python', 'Data Analytics']
    },
    {
      id: 3,
      name: 'Amanda P. Larasati',
      shortName: 'Amanda P.',
      initials: 'AP',
      role: 'Full Stack Software Engineer',
      prevRole: 'Junior Developer',
      company: 'Digital Solutions Lab',
      location: 'Yogyakarta',
      color: '#EC4899',
      cRgb: '236, 72, 153',
      stars: 5,
      badge: 'Surat Lamaran & CV Instan',
      metric: 'Hemat 10x Waktu',
      quote: 'Fitur pembuat Surat Lamaran Kerja AI dan ATS CV Builder sangat menghemat waktu. Dokumen lamaran kerja saya langsung terlihat rapi, persuasif, dan berstandar korporat Fortune 500!',
      tags: ['Cover Letter AI', 'Full Stack', 'Fortune 500']
    },
    {
      id: 4,
      name: 'Kevin H. Saputra',
      shortName: 'Kevin H.',
      initials: 'KH',
      role: 'DevOps & Cloud Specialist',
      prevRole: 'Informatika Student',
      company: 'CloudTech Systems Enterprise',
      location: 'Jakarta',
      color: '#F59E0B',
      cRgb: '245, 158, 11',
      stars: 5,
      badge: '4x Panggilan HR',
      metric: '98% Match Rate',
      quote: 'Skor ATS Rekruiter dan feedback real-time membuat saya tahu persis kata kunci teknis apa yang kurang di CV saya. Hasilnya luar biasa, 4 panggilan kualifikasi kerja sekaligus!',
      tags: ['Skor ATS Rekruiter', 'AWS Cloud', 'DevOps Engine']
    },
    {
      id: 5,
      name: 'Nabila R. Putri',
      shortName: 'Nabila R.',
      initials: 'NR',
      role: 'HR Talent Acquisition Specialist',
      prevRole: 'Psychology Graduate',
      company: 'People First Indonesia',
      location: 'Semarang',
      color: '#10B981',
      cRgb: '16, 185, 129',
      stars: 5,
      badge: 'Standar Rekruiter HR',
      metric: 'HR Approved CV',
      quote: 'Sebagai praktisi HR, saya sangat mengapresiasi cara AyoKerja mengemas CV berstandar Harvard ATS. Formatnya bersih, runtut, dan langsung menonjolkan pencapaian kunci calon karyawan.',
      tags: ['Talent Acquisition', 'HR Approved', 'Harvard Standard']
    },
    {
      id: 6,
      name: 'Dimas A. Pratama',
      shortName: 'Dimas A.',
      initials: 'DP',
      role: 'Associate Product Manager',
      prevRole: 'Business Development',
      company: 'Nusantara Fintech Technology',
      location: 'Jakarta',
      color: '#6366F1',
      cRgb: '99, 102, 241',
      stars: 5,
      badge: 'Promosi Karir PM',
      metric: 'Scored 97/100 ATS',
      quote: 'Fitur Job Matching dan Analisis Gap Skill membantu saya bertransisi dari Business Development ke Product Management dengan strategi yang jelas. Sangat layak dicoba!',
      tags: ['Product Management', 'Job Matching', 'Fintech Tech']
    },
    {
      id: 7,
      name: 'Siti M. Rahmawati',
      shortName: 'Siti M.',
      initials: 'SR',
      role: 'SEO & Content Strategist',
      prevRole: 'Freelance Copywriter',
      company: 'Creative Media Asia',
      location: 'Malang',
      color: '#A855F7',
      cRgb: '168, 85, 247',
      stars: 5,
      badge: 'Diterima di Digital Agency',
      metric: 'Full Remote Job',
      quote: 'Dulu CV saya berantakan dan sering tertolak otomatis oleh sistem ATS. Setelah pakai AyoKerja, CV saya langsung rapi dan dipuji oleh Head of Marketing saat seleksi berkas!',
      tags: ['SEO Specialist', 'Content Strategy', 'Remote Work']
    },
    {
      id: 8,
      name: 'Bagus T. Kurniawan',
      shortName: 'Bagus T.',
      initials: 'BK',
      role: 'Cyber Security Engineer',
      prevRole: 'Network Administrator',
      company: 'SafeNet Tech Security',
      location: 'Tangerang',
      color: '#F43F5E',
      cRgb: '244, 63, 94',
      stars: 5,
      badge: 'Lolos BUMN Tech',
      metric: 'Sertifikasi Verified',
      quote: 'Saran optimasi STAR di bagian proyek teknis dari AI membuat portofolio keamanan siber saya terlihat sangat profesional dan dipercaya oleh BUMN IT.',
      tags: ['Cyber Security', 'STAR Method', 'BUMN Qualified']
    },
    {
      id: 9,
      name: 'Reza F. Hidayat',
      shortName: 'Reza F.',
      initials: 'RH',
      role: 'Account Executive Manager',
      prevRole: 'Sales Representative',
      company: 'Global Commerce International',
      location: 'Medan',
      color: '#14B8A6',
      cRgb: '20, 184, 166',
      stars: 5,
      badge: 'Top Performer Hire',
      metric: 'Gaji Up 3.0x',
      quote: 'Surat Lamaran Kerja AI-nya persuasif banget! AI membuat pesan pembuka yang langsung menarik perhatian VP Sales. Terima kasih AyoKerja!',
      tags: ['Account Executive', 'Sales Leadership', 'Corporate Tech']
    }
  ];

  const MARQUEE_ITEMS = [
    { name: 'Rizki D.', text: 'Lolos ATS & Seleksi H+7', color: '#2DD4BF' },
    { name: 'Alya S.', text: 'Roadmap UI/UX Presisi 100%', color: '#8B5CF6' },
    { name: 'Fajar I.', text: 'Switch Career Akuntansi -> Data', color: '#38BDF8' },
    { name: 'Amanda P.', text: 'Cover Letter AI Hemat 10x Waktu', color: '#EC4899' },
    { name: 'Kevin H.', text: '4x Panggilan HR Sekaligus', color: '#F59E0B' },
    { name: 'Nabila R.', text: 'CV Standar Harvard Disukai HR', color: '#10B981' },
    { name: 'Dimas A.', text: 'Lolos PM Fintech Score 97', color: '#6366F1' },
    { name: 'Siti M.', text: 'Diterima Remote Content Strategist', color: '#A855F7' },
    { name: 'Bagus T.', text: 'Optimasi STAR Lolos BUMN IT', color: '#F43F5E' },
    { name: 'Reza F.', text: 'Surat Lamaran AI Gaji Up 3x', color: '#14B8A6' },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [isPlaying, TESTIMONIALS_DATA.length]);

  const active = TESTIMONIALS_DATA[activeIdx];

  const handleNext = () => {
    setActiveIdx(prev => (prev + 1) % TESTIMONIALS_DATA.length);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setActiveIdx(prev => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
    setIsPlaying(false);
  };

  return (
    <section id="testimoni" className="relative py-24 overflow-hidden bg-gradient-to-b from-[#050816] via-[#080d21] to-[#050816] border-y border-white/5">
      {/* Ambient Radial Backlights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-radial from-teal-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 mb-4">
            <Sparkles size={14} className="text-teal-400" />
            <span className="text-xs font-extrabold text-teal-400 tracking-widest uppercase">{t('landing.testimonials.label', 'KATA PENGGUNA & BUKTI NYATA')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-50 tracking-tight mb-3.5 leading-tight">
            {t('landing.testimonials.title1', 'Ribuan karier ')} <span className="shimmer-text">{t('landing.testimonials.title2', 'sudah dimulai di sini.')}</span>
          </h2>
          <p className="text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            {t('landing.testimonials.subtitle', 'Kisah inspiratif para alumni & profesional yang berhasil meningkatkan skor ATS CV, menembus seleksi kerja, hingga berhasil switch career.')}
          </p>
        </motion.div>

        {/* ── CONTINUOUS INFINITE MARQUEE TICKER (TOP RIBBON - NO EMOJIS) ── */}
        <div className="overflow-hidden w-full mb-11 mask-linear-marquee">
          <div className="flex gap-3.5 w-max animate-marqueeLeft">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((m, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-xs font-bold text-slate-300 whitespace-nowrap shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" style={{ background: m.color }} />
                <strong className="text-slate-100">{m.name}:</strong>
                <span style={{ color: m.color }}>"{m.text}"</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MASTER 3D SHOWCASE CINEMA STAGE ── */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Main Glass Card Stage */}
          <motion.div
            layout
            className="relative bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-slate-900/95 backdrop-blur-2xl rounded-3xl p-8 md:p-11 shadow-2xl transition-all duration-300"
            style={{
              border: `1.5px solid rgba(${active.cRgb}, 0.5)`,
              boxShadow: `0 30px 70px rgba(0,0,0,0.85), 0 0 50px rgba(${active.cRgb}, 0.22)`,
            }}
          >
            {/* Top Stage Header Status Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2 mb-7 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: active.color, boxShadow: `0 0 10px ${active.color}` }} />
                <span className="text-xs font-extrabold tracking-wider" style={{ color: active.color }}>{t('landing.testimonials.successStory', 'CAREER SUCCESS STORY')}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black text-slate-100" style={{ background: `rgba(${active.cRgb}, 0.15)`, border: `1px solid rgba(${active.cRgb}, 0.35)` }}>
                <Sparkles size={13} color={active.color} />
                <span>{active.badge}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>{t('landing.testimonials.verifiedATS', 'Verified ATS Career Result')}</span>
              </div>
            </div>

            {/* Main Animated Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -18, scale: 0.97 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {/* Quote Typography */}
                <div className="relative mb-8 pl-2">
                  <Quote size={48} color={active.color} className="absolute -top-5 -left-4 opacity-20" />
                  <h3 className="font-extrabold text-xl md:text-2xl text-slate-100 leading-relaxed tracking-tight relative z-10">
                    "{active.quote}"
                  </h3>
                </div>

                {/* Achievement Tag Pills (Clean Hashtags, No Emojis) */}
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {active.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-xs font-bold px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                      # {tag}
                    </span>
                  ))}
                </div>

                {/* Profile Identity Bar (Glowing Initials Badge) */}
                <div className="flex items-center justify-between flex-wrap gap-5 bg-slate-900/80 border border-white/10 rounded-2xl p-4 md:p-6 mb-7">
                  
                  <div className="flex items-center gap-4">
                    {/* Glowing Initials Badge */}
                    <div
                      className="relative w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg text-slate-100 shrink-0"
                      style={{
                        background: `linear-gradient(135deg, rgba(${active.cRgb}, 0.4) 0%, rgba(15, 23, 42, 0.95) 100%)`,
                        border: `1.5px solid ${active.color}`,
                        boxShadow: `0 0 22px rgba(${active.cRgb}, 0.45)`,
                      }}
                    >
                      {active.initials}
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-sm" />
                    </div>

                    <div className="text-left">
                      <div className="text-lg font-black text-slate-100">
                        {active.name} <span className="text-xs font-semibold text-slate-400">({active.location})</span>
                      </div>
                      <div className="text-sm font-extrabold mt-0.5" style={{ color: active.color }}>
                        {active.role}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Perusahaan: <strong className="text-slate-200">{active.company}</strong> · <span className="italic">Latar belakang: {active.prevRole}</span>
                      </div>
                    </div>
                  </div>

                  {/* 5-Star Rating & Highlight Metric */}
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={15} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-extrabold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
                      {active.metric}
                    </span>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>

            {/* ── INTERACTIVE SELECTOR CAROUSEL BAR & CONTROLS ── */}
            <div className="border-t border-white/10 pt-5 flex items-center justify-between flex-wrap gap-3">
              
              {/* User Selection Pills (10 Pills Grid/Flex) */}
              <div className="flex items-center gap-2 flex-wrap flex-1">
                {TESTIMONIALS_DATA.map((item, idx) => {
                  const isSelected = activeIdx === idx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveIdx(idx);
                        setIsPlaying(false);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all duration-200"
                      style={{
                        background: isSelected ? `linear-gradient(135deg, rgba(${item.cRgb}, 0.28) 0%, rgba(15, 23, 42, 0.95) 100%)` : 'rgba(255, 255, 255, 0.04)',
                        color: isSelected ? '#F8FAFC' : '#64748B',
                        border: isSelected ? `1.5px solid rgba(${item.cRgb}, 0.65)` : '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: isSelected ? `0 0 18px rgba(${item.cRgb}, 0.35)` : 'none',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: isSelected ? item.color : '#475569' }} />
                      <span>{item.shortName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next & Auto-play Control Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  title="Testimoni Sebelumnya"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-100 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={handleNext}
                  title="Testimoni Selanjutnya"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-100 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? 'Jeda Rotasi Otomatis' : 'Mulai Rotasi Otomatis'}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isPlaying ? 'bg-teal-500/20 border border-teal-500/40 text-teal-400' : 'bg-white/5 border border-white/10 text-slate-400'}`}
                >
                  {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                </button>
              </div>

            </div>

          </motion.div>
        </div>

        {/* ── BOTTOM IMPACT METRIC STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { num: '4.9 / 5.0', label: t('landing.stats.s1.label', 'Rating Kepuasan Pengguna'), desc: t('landing.stats.s1.desc', 'Berdasarkan 2.400+ ulasan alumni & pencari kerja') },
            { num: '94%', label: t('landing.stats.s2.label', 'Seleksi Success Rate'), desc: t('landing.stats.s2.desc', 'Meningkatkan peluang lolos berkas & kualifikasi') },
            { num: '2.400+', label: t('landing.stats.s3.label', 'Karier Berhasil Dimulai'), desc: t('landing.stats.s3.desc', 'Tersebar di startup, BUMN, & Fortune 500') },
            { num: '< 10 Detik', label: t('landing.stats.s4.label', 'Kecepatan Analisis AI'), desc: t('landing.stats.s4.desc', 'Hasil evaluasi ATS & rekomendasi karier instan') },
          ].map((st, iIdx) => (
            <div
              key={iIdx}
              className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center"
            >
              <div className="shimmer-text font-black text-2xl mb-1">
                {st.num}
              </div>
              <div className="text-xs font-bold text-slate-100 mb-0.5">
                {st.label}
              </div>
              <div className="text-[11px] text-slate-400">
                {st.desc}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

const Landing = () => {
  const { t } = useTranslation();
  const { props } = usePage();
  const user = props?.auth?.user || props?.user || null;
  const [activeFlow, setActiveFlow] = useState(0);
  const [selectedRoleIdx, setSelectedRoleIdx] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const tTimer = setInterval(() => setActiveFlow(v => (v + 1) % 4), 2600);
    return () => clearInterval(tTimer);
  }, []);

  const currentDemo = DEMO_ROLES[selectedRoleIdx];

  const FLOW_STEPS = [
    { step: '01', Icon: Upload,    color: '#4F7CFF', cRgb: '79,124,255',   title: t('landing.procedure.step1.title', 'Upload CV Kamu'), desc: t('landing.procedure.step1.desc', 'Upload CV dalam format PDF atau DOCX. AI langsung membaca dan menganalisis kualifikasimu.'), detail: t('landing.procedure.step1.detail', 'Belum punya CV? Kamu bisa membuat CV dari awal dengan panduan AI kami.') },
    { step: '02', Icon: Brain,     color: '#8B5CF6', cRgb: '139,92,246',   title: t('landing.procedure.step2.title', 'AI Memahami Potensi'), desc: t('landing.procedure.step2.desc', 'AI menganalisis pengalaman, keahlian, pendidikan, dan arah kariermu dari berbagai industri.'), detail: t('landing.procedure.step2.detail', 'Bukan sekadar scan kata kunci biasa — AI memahami konteks lengkap kariermu.') },
    { step: '03', Icon: BarChart3, color: '#22D3EE', cRgb: '34,211,238',   title: t('landing.procedure.step3.title', 'Dapatkan Insight'), desc: t('landing.procedure.step3.desc', 'Profil karier lengkap, skor ATS, rekomendasi lowongan cocok, dan saran pengembangan karir.'), detail: t('landing.procedure.step3.detail', 'Disajikan dalam tampilan yang rapi, modern, dan langsung bisa kamu gunakan.') },
    { step: '04', Icon: Rocket,    color: '#6366F1', cRgb: '99,102,241',   title: t('landing.procedure.step4.title', 'Siap Melamar Kerja'), desc: t('landing.procedure.step4.desc', 'Buat & optimalkan CV format Harvard ATS, lalu siap melamar pekerjaan impianmu.'), detail: t('landing.procedure.step4.detail', 'Kamu tidak hanya tahu posisi yang cocok — tapi siap meraih karir tersebut.') },
  ];

  const FEATURES = [
    { Icon: Search,      color: '#4F7CFF', cRgb: '79,124,255',   title: t('landing.features.f1Title', 'Analisis CV Cerdas'),      desc: t('landing.features.f1Desc', 'AI menganalisis CV secara mendalam — skor ATS, kekuatan, kelemahan, dan poin perbaikan konkret.') },
    { Icon: Briefcase,   color: '#6366F1', cRgb: '99,102,241',   title: t('landing.features.f2Title', 'Job Matching Otomatis'),    desc: t('landing.features.f2Desc', 'AI mencocokkan profilmu dengan lowongan kerja nyata dari berbagai industri beserta % kecocokannya.') },
    { Icon: TrendingUp,  color: '#8B5CF6', cRgb: '139,92,246',   title: t('landing.features.f3Title', 'Rekomendasi Karir AI'),    desc: t('landing.features.f3Desc', 'Dapatkan saran dan arahan pengembangan karier yang terstruktur sesuai profilmu.') },
    { Icon: Map,         color: '#22D3EE', cRgb: '34,211,238',   title: t('landing.features.f4Title', 'Peta Jalan Karier'),        desc: t('landing.features.f4Desc', 'Panduan langkah demi langkah yang terstruktur dari posisimu sekarang menuju target kariermu.') },
    { Icon: FileText,    color: '#EC4899', cRgb: '236,72,153',   title: t('landing.features.f5Title', 'Buat CV Standar Harvard'),    desc: t('landing.features.f5Desc', 'Buat CV profesional format Harvard ATS-friendly yang disukai rekruiter dan HR di berbagai industri.') },
    { Icon: FileCheck2,  color: '#10B981', cRgb: '16,185,129',   title: t('landing.features.f6Title', 'Surat Lamaran Kerja AI'),  desc: t('landing.features.f6Desc', 'Buat Surat Lamaran Kerja (Cover Letter) persuasif & profesional secara otomatis yang disesuaikan dengan posisi impianmu.') },
    { Icon: ShieldCheck, color: '#F59E0B', cRgb: '245,158,11',   title: t('landing.features.f7Title', 'Skor ATS Rekruiter'),      desc: t('landing.features.f7Desc', 'Penilaian skor kelayakan CV berdasarkan kriteria otomatis standar rekruiter modern.') },
  ];

  const AI_FEATURES = [
    { Icon: Target,     color: '#4F7CFF', cRgb: '79,124,255',  title: t('landing.aiExp.f1Title', 'Analisis Arah Karier'), desc: t('landing.aiExp.f1Desc', 'Pahami peran dan bidang mana yang paling cocok berdasarkan latar belakang & pengalamanmu.') },
    { Icon: FileCheck2, color: '#8B5CF6', cRgb: '139,92,246',  title: t('landing.aiExp.f2Title', 'Surat Lamaran Kerja AI'), desc: t('landing.aiExp.f2Desc', 'Buat Cover Letter persuasif & profesional secara otomatis yang disesuaikan dengan posisi impianmu.') },
    { Icon: Route,      color: '#22D3EE', cRgb: '34,211,238',  title: t('landing.aiExp.f3Title', 'Roadmap Personal'),     desc: t('landing.aiExp.f3Desc', 'Langkah konkret dari posisimu sekarang menuju tujuan karier yang kamu impikan.') },
  ];

  return (
    <main style={{ background: '#050816', minHeight: '100vh', overflowX: 'hidden', fontFamily: "'Inter',sans-serif" }}>
      <Head title="Kecerdasan Karier AI & Job Matching Platform" />
      <GlobalStyles />
      <Header />

      {/* BACKGROUND BLOBS */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '0%',  left: '5%',  width: '700px', height: '700px', background: 'radial-gradient(ellipse,rgba(79,124,255,0.16) 0%,transparent 70%)',  filter: 'blur(110px)', animation: 'blobDrift1 20s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '25%', right: '0%', width: '550px', height: '550px', background: 'radial-gradient(ellipse,rgba(139,92,246,0.13) 0%,transparent 70%)', filter: 'blur(130px)', animation: 'blobDrift2 25s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '25%', width: '450px', height: '450px', background: 'radial-gradient(ellipse,rgba(34,211,238,0.09) 0%,transparent 70%)',  filter: 'blur(110px)', animation: 'blobDrift3 30s ease-in-out infinite' }} />
      </div>

      <div style={{ paddingTop: '88px', position: 'relative', zIndex: 1 }}>

        {/* ══ HERO (FULL SCREEN DESKTOP) ══ */}
        <section id="hero" style={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 88px)', display: 'flex', alignItems: 'center', padding: '40px 0' }}>
          {/* Interactive Neural Constellation Background (Hero Only) */}
          <HeroConstellationCanvas />

          <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            <div className="hero-grid" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '56px' }}>

            {/* Left Column */}
            <div style={{ flex: 1, maxWidth: '580px' }}>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              </motion.div>

              <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
                style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", fontSize: '58px', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-2.5px', margin: '0 0 22px' }}>
                <span style={{ color: '#F8FAFC' }}>{t('landing.hero.titlePart1', 'Karier kamu,')}</span><br />
                <span className="shimmer-text">{t('landing.hero.titlePart2', 'dipahami AI.')}</span>
              </motion.h1>

              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                style={{ fontFamily: "'Inter',sans-serif", fontSize: '17px', color: '#94A3B8', lineHeight: 1.75, marginBottom: '16px', maxWidth: '520px' }}>
                {t('landing.hero.subtitle', 'Upload CV kamu. AyoKerja memahami pengalaman, skill, dan arah kariermu — lalu tunjukkan pekerjaan yang tepat, gap yang perlu diisi, dan jalan untuk berkembang.')}
              </motion.p>

              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2.5}
                style={{ fontFamily: "'Inter',sans-serif", fontSize: '14px', color: '#64748B', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={15} color="#2DD4BF" />
                {t('landing.hero.target', 'Cocok untuk mahasiswa, fresh graduate, junior, hingga mid-level.')}
              </motion.p>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="hero-cta" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
                <Link href={user ? "/upload" : "/login"} className="btn-primary">
                  <Upload size={16} /> {t('landing.hero.ctaMain', 'Analisis CV Sekarang')}
                  <ArrowRight size={15} />
                </Link>
                <Link href={user ? "/cv-builder" : "/login"} className="btn-outline">
                  <FileText size={16} /> {t('landing.hero.ctaSecond', 'Buat CV dengan AI')}
                </Link>
              </motion.div>

              {/* Trust row */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex' }}>
                    {['#14B8A6', '#4F7CFF', '#8B5CF6', '#22D3EE', '#EC4899'].map((c, i) => (
                      <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg,${c},rgba(5,8,22,0.9))`, border: '2px solid #050816', marginLeft: i === 0 ? 0 : '-10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#F8FAFC', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                        {['RD', 'AL', 'SY', 'IM', 'FT'][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} color="#F59E0B" fill="#F59E0B" />)}
                    </div>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#64748B' }}>{t('landing.hero.trustedBy', 'Dipercaya 2.400+ pencari kerja')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '14px' }}>
                  {[{ Icon: Gift, label: t('common.free', 'Gratis') }, { Icon: Shield, label: t('landing.hero.dataSafe', 'Data Aman') }, { Icon: Zap, label: t('landing.hero.instant', 'Instan') }].map(({ Icon, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Icon size={13} color="#2DD4BF" />
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#64748B' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column: 3D Multi-Device Ecosystem Showcase (MacBook + iPhone + Tabs) */}
            <div className="hero-cards" style={{ flex: '0 0 540px', maxWidth: '540px', position: 'relative', paddingTop: '10px', paddingBottom: '20px' }}>
              <MultiDeviceShowcase3D
                currentDemo={currentDemo}
                DEMO_ROLES={DEMO_ROLES}
                selectedRoleIdx={selectedRoleIdx}
                setSelectedRoleIdx={setSelectedRoleIdx}
              />
            </div>
          </div>
        </div>
      </section>

        {/* ══ STATS BAR ══ */}
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.018)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px', textAlign: 'center' }}>
              {[
                { Icon: Users,    num: 2400,  suffix: '+', label: 'Pengguna Aktif' },
                { Icon: Target,   num: 94,    suffix: '%', label: 'Rata-rata Kecocokan' },
                { Icon: FileText, num: 12000, suffix: '+', label: 'CV Dianalisis' },
                { Icon: Star,     num: 98,    suffix: '%', label: 'Kepuasan Pengguna' },
              ].map(({ Icon, num, suffix, label }, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <Icon size={20} color="#4F7CFF" />
                  </div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900, fontSize: '36px', letterSpacing: '-1.5px' }}>
                    <span className="shimmer-text"><AnimatedNumber target={num} suffix={suffix} /></span>
                  </div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#475569', marginTop: '4px' }}>{label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ ALUR / FLOW ══ */}
        <section id="alur" style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="section-label" style={{ color: '#4F7CFF' }}>{t('landing.procedure.label', 'PROSEDUR PLATFORM')}</span>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", fontWeight: 900, fontSize: '42px', color: '#F8FAFC', letterSpacing: '-1.5px', margin: '0 0 14px' }}>
              {t('landing.procedure.title', 'Prosedur 4 Langkah Sederhana')}
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '16px', color: '#64748B', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
              {t('landing.procedure.subtitle', 'Empat prosedur sederhana berbasis AI yang akan memandu perjalanan kariermu dari awal hingga sukses.')}
            </p>
          </motion.div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap', gap: '0' }}>
            {FLOW_STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <motion.div
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  onClick={() => setActiveFlow(i)}
                  style={{
                    flex: '0 0 210px', maxWidth: '210px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                    padding: '24px 16px', borderRadius: '20px',
                    background: activeFlow === i ? `rgba(${s.cRgb},0.1)` : 'transparent',
                    border: activeFlow === i ? `1px solid rgba(${s.cRgb},0.3)` : '1px solid transparent',
                    boxShadow: activeFlow === i ? `0 0 40px rgba(${s.cRgb},0.12)` : 'none',
                    transition: 'all 0.35s ease', position: 'relative', overflow: 'hidden',
                  }}
                >
                  {activeFlow === i && (
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)', animation: 'shimmerSweep 2.5s ease-in-out infinite', pointerEvents: 'none' }} />
                  )}
                  <div style={{ width: '64px', height: '64px', borderRadius: '18px', marginBottom: '16px', background: `rgba(${s.cRgb},0.12)`, border: `1px solid rgba(${s.cRgb},0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: activeFlow === i ? `0 0 24px rgba(${s.cRgb},0.3)` : 'none', transition: 'box-shadow 0.3s ease' }}>
                    <s.Icon size={26} color={s.color} />
                  </div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 700, color: s.color, letterSpacing: '0.1em', marginBottom: '8px' }}>{s.step}</div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '15px', color: '#F8FAFC', margin: '0 0 8px' }}>{s.title}</h3>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                  <AnimatePresence>
                    {activeFlow === i && (
                      <motion.p initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 10 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.3 }}
                        style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: s.color, lineHeight: 1.55, overflow: 'hidden' }}>
                        {s.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {i < 3 && (
                  <ShimmerBrokenConnector color={s.color} active={activeFlow === i || activeFlow === i + 1} stepIndex={i} />
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section id="fitur" style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px' }}>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span className="section-label" style={{ color: '#8B5CF6' }}>{t('landing.features.label', 'FITUR UNGGULAN')}</span>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", fontWeight: 900, fontSize: '42px', color: '#F8FAFC', letterSpacing: '-1.5px', margin: '0 0 14px' }}>{t('landing.features.title', 'Semua yang kamu butuhkan')}</h2>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '16px', color: '#64748B', maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}>{t('landing.features.subtitle', 'AyoKerja bukan sekadar CV builder — platform lengkap untuk memahami dan mengembangkan karier.')}</p>
            </motion.div>

            <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
              {FEATURES.map((f, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 3}
                  whileHover={{ y: -5 }}
                  className="glass-card sweep-parent"
                  style={{ padding: '28px', transition: 'all 0.25s ease', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${f.cRgb},0.25)`; e.currentTarget.style.boxShadow = `0 0 40px rgba(${f.cRgb},0.1)`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', marginBottom: '18px', background: `rgba(${f.cRgb},0.1)`, border: `1px solid rgba(${f.cRgb},0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <f.Icon size={22} color={f.color} />
                  </div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", fontWeight: 700, fontSize: '15px', color: '#F8FAFC', margin: '0 0 10px' }}>{f.title}</h3>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ AI EXPERIENCE ══ */}
        <section id="ai-intelligence" style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px' }}>
          <div className="ai-exp-grid" style={{ display: 'flex', alignItems: 'center', gap: '64px' }}>
            {/* Left */}
            <div style={{ flex: 1 }}>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <span className="section-label" style={{ color: '#8B5CF6' }}>{t('landing.aiExp.label', 'AI INTELLIGENCE')}</span>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", fontWeight: 900, fontSize: '38px', color: '#F8FAFC', letterSpacing: '-1.2px', margin: '0 0 18px', lineHeight: 1.15 }}>
                  {t('landing.aiExp.title1', 'AI tidak hanya membaca CV kamu.')}<br />
                  <span className="shimmer-text">{t('landing.aiExp.title2', 'Dia memahami kariermu.')}</span>
                </h2>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '15px', color: '#64748B', lineHeight: 1.75, marginBottom: '32px' }}>
                  {t('landing.aiExp.desc', 'AyoKerja melampaui pencocokan kata kunci biasa. Dia membaca lintasan kariermu, kekuatanmu, potensimu — dan memberikan gambaran lengkap tentang di mana kamu berada dan ke mana kamu bisa pergi.')}
                </p>
              </motion.div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {AI_FEATURES.map((f, i) => (
                  <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                    className="glass-card sweep-parent"
                    style={{ display: 'flex', gap: '14px', padding: '16px', transition: 'all 0.2s ease', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${f.cRgb},0.25)`; e.currentTarget.style.background = `rgba(${f.cRgb},0.04)`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `rgba(${f.cRgb},0.1)`, border: `1px solid rgba(${f.cRgb},0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <f.Icon size={18} color={f.color} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: '14px', color: '#F8FAFC', marginBottom: '4px' }}>{f.title}</div>
                      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#64748B' }}>{f.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Career Profile Card */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{ flex: '0 0 360px', maxWidth: '360px' }}>
              <div className="shimmer-border-card">
                <div className="shimmer-border-card-inner" style={{ padding: '30px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <span className="badge-dot" style={{ background: '#2DD4BF', boxShadow: '0 0 10px #2DD4BF' }} />
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 700, color: '#2DD4BF', letterSpacing: '0.1em' }}>{t('landing.profile.badge', 'PROFIL KARIER')}</span>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                    <div style={{ position: 'relative', width: '76px', height: '76px', margin: '0 auto 12px' }}>
                      <div style={{
                        width: '76px',
                        height: '76px',
                        borderRadius: '50%',
                        padding: '3px',
                        background: 'linear-gradient(135deg, #14B8A6 0%, #4F7CFF 50%, #8B5CF6 100%)',
                        boxShadow: '0 0 25px rgba(45, 212, 191, 0.5), 0 0 15px rgba(79, 124, 255, 0.4)',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={userAvatarPng}
                          alt="Profil Pengguna"
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          background: '#2DD4BF',
                          border: '2.5px solid #050816',
                          boxShadow: '0 0 10px #2DD4BF',
                        }}
                      />
                    </div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '17px', color: '#F8FAFC' }}>{t('landing.profile.role', 'Digital Marketing Specialist')}</div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>{t('landing.profile.level', 'Level Specialist')}</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '10px', padding: '4px 12px', borderRadius: '99px', background: 'rgba(20, 184, 166, 0.12)', border: '1px solid rgba(45, 212, 191, 0.3)' }}>
                      <span className="shimmer-text" style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 700 }}>94%</span>
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#2DD4BF' }}>Confidence</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '10px', color: '#64748B', marginBottom: '8px', letterSpacing: '0.08em' }}>{t('landing.profile.mainSkill', 'SKILL UTAMA')}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {['SEO & Content', 'Google Ads', 'Social Media', 'Copywriting', 'Analytics', 'CRM'].map((sk, idx) => (
                        <span key={sk} className={`skill-tag ${idx % 2 === 0 ? 'skill-tosca' : 'skill-matched'}`}>{sk}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '10px', color: '#64748B', marginBottom: '10px', letterSpacing: '0.08em' }}>{t('landing.profile.profileScore', 'SKOR PROFIL')}</div>
                    <ProgressBar label={t('landing.profile.techSkill', 'Skill Teknis')} value={88} color="#2DD4BF" delay={0.2} />
                    <ProgressBar label={t('landing.profile.experience', 'Pengalaman')}   value={74} color="#4F7CFF" delay={0.35} />
                    <ProgressBar label={t('landing.profile.education', 'Pendidikan')}   value={95} color="#8B5CF6" delay={0.5} />
                  </div>

                  <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(20, 184, 166, 0.08)', border: '1px solid rgba(45, 212, 191, 0.22)', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <Brain size={12} color="#2DD4BF" />
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#2DD4BF', fontWeight: 600 }}>Insight AI</span>
                    </div>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#CBD5E1', lineHeight: 1.55, margin: 0 }}>{t('landing.profile.insight', 'Fondasi backend yang kuat dengan kemampuan full-stack berkembang. Fokus ke Docker dan cloud selanjutnya.')}</p>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#475569' }}>{t('landing.profile.careerPath', 'Arah Karier: ')}</span>
                    <span className="shimmer-text" style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 700 }}>{t('landing.profile.careerPathTarget', 'Backend → Full Stack')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ TESTIMONIALS (ULTRA-PREMIUM INTERACTIVE SPOTLIGHT MATCHING VIDEO) ══ */}
        <InteractiveTestimonials />

        {/* ══ CTA FINAL ══ */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 48px' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ textAlign: 'center', padding: '80px 40px', borderRadius: '28px', position: 'relative', overflow: 'hidden' }}>
            {/* shimmer border frame */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '28px', padding: '1px', background: 'linear-gradient(120deg,rgba(79,124,255,0.5),rgba(139,92,246,0.5),rgba(34,211,238,0.5),rgba(139,92,246,0.5),rgba(79,124,255,0.5))', backgroundSize: '300% 300%', animation: 'shimmerBorder 4s ease infinite', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '28px', background: 'rgba(5,8,22,0.93)', backdropFilter: 'blur(20px)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '250px', background: 'radial-gradient(ellipse,rgba(79,124,255,0.1) 0%,transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <span className="section-label" style={{ color: '#4F7CFF' }}>{t('landing.cta.label', 'MULAI SEKARANG')}</span>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", fontWeight: 900, fontSize: '46px', color: '#F8FAFC', letterSpacing: '-2px', margin: '0 0 16px', lineHeight: 1.1 }}>
                {t('landing.cta.title1', 'Siap memahami')}<br /><span className="shimmer-text">{t('landing.cta.title2', 'karier kamu?')}</span>
              </h2>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '16px', color: '#94A3B8', maxWidth: '450px', margin: '0 auto 40px', lineHeight: 1.7 }}>
                {t('landing.cta.desc', 'Bergabunglah dengan ribuan pengguna yang sudah menemukan arah kariernya. Upload CV sekarang — gratis, tanpa kartu kredit.')}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
                <Link href={user ? "/upload" : "/login"} className="btn-primary">
                  <Upload size={15} /> {t('landing.cta.btnMain', 'Analisis CV Sekarang')}
                  <ArrowRight size={15} />
                </Link>
                <Link href="/register" className="btn-outline">
                  <UserPlus size={15} /> {t('landing.cta.btnRegister', 'Daftar Gratis')}
                </Link>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {[{ Icon: Gift, label: t('landing.cta.f1', 'Gratis selamanya') }, { Icon: Shield, label: t('landing.cta.f2', 'Data terenkripsi') }, { Icon: Zap, label: t('landing.cta.f3', 'Hasil dalam detik') }].map(({ Icon, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon size={14} color="#4F7CFF" />
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#94A3B8' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

      </div>
      <ChatBubble />
      <Footer />
    </main>
  );
};

export default Landing;


