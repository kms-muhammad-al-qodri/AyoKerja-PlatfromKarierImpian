import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import axios from 'axios';

const LANGUAGES = [
  { code: 'id', label: 'Indonesia', flag: '🇮🇩', short: 'ID' },
  { code: 'en', label: 'English', flag: '🇬🇧', short: 'EN' },
];

/**
 * LanguageSwitcher — compact dropdown dengan bendera negara.
 * Props:
 *   - compact (bool): tampilan ringkas tanpa label teks, default false
 *   - className (string): extra class untuk wrapper
 */
export default function LanguageSwitcher({ compact = false, className = '' }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = async (code) => {
    if (code === i18n.language) {
      setOpen(false);
      return;
    }

    // 1. Update UI instantly
    i18n.changeLanguage(code);
    localStorage.setItem('ayokerja_lang', code);
    setOpen(false);

    // 2. Simpan ke database (jika user login) — silent, no error shown to user
    try {
      setSaving(true);
      await axios.patch('/api/user/language', { language: code });
    } catch {
      // Gagal simpan ke DB tidak masalah, localStorage tetap aktif
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        id="lang-switcher-btn"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 rounded-xl border transition-all duration-200 cursor-pointer select-none
          ${open
            ? 'bg-teal-500/15 border-teal-500/50 text-teal-300'
            : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:border-teal-500/40 hover:text-teal-300'
          }
          ${compact ? 'px-2 py-1.5' : 'px-3 py-1.5'}
        `}
        title="Change language / Ganti bahasa"
        aria-label="Language selector"
        aria-expanded={open}
      >
        <Globe size={14} className={open ? 'text-teal-400' : 'text-slate-400'} />
        <span className="text-[11px] font-bold tracking-wider">
          {currentLang.flag} {compact ? currentLang.short : currentLang.label}
        </span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? 'rotate-180 text-teal-400' : 'text-slate-500'}`}
        />
        {saving && (
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse ml-0.5" />
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 z-[999] min-w-[160px] bg-[#0C1129]/98 backdrop-blur-2xl border border-slate-700/70 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
          >
            {/* Header */}
            <div className="px-3 pt-2.5 pb-1.5 border-b border-slate-800/60">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                🌐 Platform Language
              </p>
            </div>

            {/* Options */}
            <div className="p-1.5 space-y-0.5">
              {LANGUAGES.map((lang) => {
                const isActive = i18n.language === lang.code;
                return (
                  <button
                    key={lang.code}
                    id={`lang-option-${lang.code}`}
                    onClick={() => handleChange(lang.code)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer
                      ${isActive
                        ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-teal-300 border border-teal-500/30'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white border border-transparent'
                      }
                    `}
                    aria-pressed={isActive}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0"
                      >
                        <Check size={13} className="text-teal-400" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-3 pb-2.5 pt-1 border-t border-slate-800/60">
              <p className="text-[9px] text-slate-600 text-center">
                Pilihan tersimpan otomatis
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
