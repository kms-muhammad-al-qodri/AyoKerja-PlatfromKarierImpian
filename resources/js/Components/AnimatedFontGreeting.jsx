import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Sparkles, Wand2 } from 'lucide-react';

const FONT_PRESETS = [
  {
    id: 'space-grotesk',
    name: 'Tech Grotesk',
    fontFamily: "'Space Grotesk', sans-serif",
    gradient: 'from-teal-300 via-cyan-400 to-indigo-300',
    glow: 'drop-shadow-[0_0_20px_rgba(45,212,191,0.45)]',
    letterSpacing: 'tracking-normal',
    accentColor: '#2dd4bf',
  },
  {
    id: 'orbitron',
    name: 'Cyberpunk AI',
    fontFamily: "'Orbitron', sans-serif",
    gradient: 'from-cyan-400 via-blue-400 to-indigo-300',
    glow: 'drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]',
    letterSpacing: 'tracking-wider',
    accentColor: '#38bdf8',
  },
  {
    id: 'syne',
    name: 'Modern Syne',
    fontFamily: "'Syne', sans-serif",
    gradient: 'from-indigo-300 via-purple-300 to-teal-300',
    glow: 'drop-shadow-[0_0_20px_rgba(165,180,252,0.45)]',
    letterSpacing: 'tracking-tight',
    accentColor: '#a5b4fc',
  },
  {
    id: 'righteous',
    name: 'Neon Synth',
    fontFamily: "'Righteous', cursive",
    gradient: 'from-pink-400 via-purple-400 to-teal-300',
    glow: 'drop-shadow-[0_0_20px_rgba(244,114,182,0.5)]',
    letterSpacing: 'tracking-normal',
    accentColor: '#f472b6',
  },
  {
    id: 'fira-code',
    name: 'Matrix Code',
    fontFamily: "'Fira Code', monospace",
    gradient: 'from-emerald-400 via-teal-300 to-cyan-400',
    glow: 'drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]',
    letterSpacing: 'tracking-tighter',
    accentColor: '#34d399',
  },
  {
    id: 'playfair',
    name: 'Luxury Italic',
    fontFamily: "'Playfair Display', serif",
    gradient: 'from-amber-300 via-teal-300 to-cyan-300',
    glow: 'drop-shadow-[0_0_20px_rgba(252,211,77,0.45)]',
    letterSpacing: 'tracking-normal',
    styleExtra: { fontStyle: 'italic' },
    accentColor: '#fcd34d',
  },
  {
    id: 'comfortaa',
    name: 'Rounded Pop',
    fontFamily: "'Comfortaa', cursive",
    gradient: 'from-sky-300 via-indigo-300 to-teal-300',
    glow: 'drop-shadow-[0_0_20px_rgba(125,211,252,0.45)]',
    letterSpacing: 'tracking-normal',
    accentColor: '#7dd3fc',
  },
  {
    id: 'cinzel',
    name: 'Royal Classic',
    fontFamily: "'Cinzel', serif",
    gradient: 'from-teal-200 via-emerald-300 to-cyan-300',
    glow: 'drop-shadow-[0_0_20px_rgba(167,243,208,0.45)]',
    letterSpacing: 'tracking-widest',
    accentColor: '#a7f3d0',
  },
  {
    id: 'jakarta',
    name: 'Jakarta Sans',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    gradient: 'from-slate-100 via-teal-200 to-slate-100',
    glow: 'drop-shadow-[0_0_15px_rgba(241,245,249,0.3)]',
    letterSpacing: 'tracking-tight',
    accentColor: '#f1f5f9',
  },
];

export default function AnimatedFontGreeting({ greetingText, userName }) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % FONT_PRESETS.length);
    }, 2400);

    return () => clearInterval(timer);
  }, [isHovered]);

  const currentFont = FONT_PRESETS[index];

  const handleNextFont = () => {
    setIndex((prev) => (prev + 1) % FONT_PRESETS.length);
  };

  const letters = Array.from(greetingText || 'Selamat Pagi');

  return (
    <div
      className="relative flex flex-col items-start gap-1 group/typo"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Font Badge Indicator (Compact & Sleek) */}
      <div className="flex items-center gap-2 mb-0.5">
        <button
          type="button"
          onClick={handleNextFont}
          title="Klik untuk mengganti animasi font!"
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-teal-500/30 text-[10px] font-bold text-teal-300 hover:text-teal-200 transition-all cursor-pointer shadow-md group/btn"
        >
          <Wand2 className="w-3 h-3 text-teal-400 group-hover/btn:rotate-45 transition-transform duration-300" />
          <span className="font-mono text-[9px] uppercase tracking-wider">
            Typo Morph: {currentFont.name}
          </span>
          <RefreshCw className="w-2.5 h-2.5 text-slate-400 group-hover/btn:rotate-180 transition-transform duration-500 ml-0.5" />
        </button>
      </div>

      {/* Main Animated Heading */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-100 tracking-tight flex items-center flex-wrap leading-tight">
        {/* Kinetic Staggered Letter Flip for Greeting */}
        <span className="inline-flex items-center overflow-hidden py-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentFont.id}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.03,
                  },
                },
                exit: {
                  transition: {
                    staggerChildren: 0.02,
                  },
                },
              }}
              style={{
                fontFamily: currentFont.fontFamily,
                ...(currentFont.styleExtra || {}),
              }}
              className={`inline-flex items-center bg-gradient-to-r ${currentFont.gradient} bg-clip-text text-transparent ${currentFont.letterSpacing} ${currentFont.glow} transition-all duration-300`}
            >
              {letters.map((char, i) => (
                <motion.span
                  key={`${currentFont.id}-${i}`}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 12,
                      rotateX: -90,
                      filter: 'blur(6px)',
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      filter: 'blur(0px)',
                    },
                    exit: {
                      opacity: 0,
                      y: -12,
                      rotateX: 90,
                      filter: 'blur(6px)',
                    },
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="inline-block"
                  style={{
                    transformOrigin: '50% 50%',
                    whiteSpace: char === ' ' ? 'pre' : 'normal',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.span>
          </AnimatePresence>
        </span>

        {/* Comma and Name without awkward space */}
        <span className="text-slate-100 font-extrabold">,</span>
        <span className="ml-2 text-slate-100 font-extrabold">
          <span className="shimmer-text bg-gradient-to-r from-teal-200 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
            {userName || 'Kandidat'}
          </span>
          !
        </span>
      </h1>

      {/* Dynamic Glowing Accent Underline Beam */}
      <motion.div
        key={currentFont.id}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '100%', opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="h-0.5 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-transparent opacity-70 mt-1 max-w-xs shadow-[0_0_8px_#2dd4bf]"
      />
    </div>
  );
}
