import React from 'react';
import { motion } from 'framer-motion';

export default function FullscreenLoader({
  show = true,
  message = 'Loading...',
  submessage = 'Menyiapkan platform AyoKerja...',
  variant = 'dark', // 'dark' (AyoKerja dark theme) or 'video' (100% exact match to screen recording)
}) {
  if (!show) return null;

  const isVideoVariant = variant === 'video';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 ${
        isVideoVariant
          ? 'bg-white text-black'
          : 'bg-[#060A1A] text-slate-100'
      }`}
    >
        {/* Background Glows for Dark Variant */}
        {!isVideoVariant && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full filter blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-[120px]" />
          </div>
        )}

        {/* Center Container */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
          
          {/* Moving Circle Inverted Text Effect */}
          <div className="relative inline-flex items-center justify-center px-8 py-6 select-none overflow-hidden rounded-3xl">
            
            {/* Base Text Layer */}
            <span
              className={`text-4xl sm:text-6xl font-black tracking-tight font-sans ${
                isVideoVariant ? 'text-black' : 'text-slate-100'
              }`}
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
                letterSpacing: '-0.02em',
              }}
            >
              {message}
            </span>

            {/* Sliding Circle Mask Layer */}
            <motion.div
              animate={{
                left: ['-25%', '105%', '-25%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.4,
                ease: 'easeInOut',
              }}
              className={`absolute top-1/2 -translate-y-1/2 w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mix-blend-difference pointer-events-none ${
                isVideoVariant
                  ? 'bg-black shadow-none'
                  : 'bg-white shadow-2xl shadow-teal-400/80'
              }`}
            />
          </div>

          {/* Submessage & Status Indicator */}
          {submessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2 max-w-sm"
            >
              <div className="flex items-center justify-center gap-2">
                <span className={`w-2 h-2 rounded-full animate-ping ${isVideoVariant ? 'bg-black' : 'bg-teal-400'}`} />
                <span className={`text-xs font-extrabold uppercase tracking-widest ${
                  isVideoVariant ? 'text-slate-600' : 'text-teal-300'
                }`}>
                  {submessage}
                </span>
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
  );
}
