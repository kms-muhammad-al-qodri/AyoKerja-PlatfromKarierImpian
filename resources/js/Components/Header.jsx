import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import {
  Sparkles,
  Menu,
  X,
  LogIn,
  UserPlus,
  ChevronRight,
  LogOut,
  Briefcase,
  FileText,
  Brain,
  Map,
  BarChart3,
  FileCheck2,
} from 'lucide-react';

const Header = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');

  const { url, props } = usePage();

  const isDashboard = url.startsWith('/dashboard') || url.startsWith('/cv-builder') || url.startsWith('/cover-letter') || url.startsWith('/upload') || url.startsWith('/analyze-cv');
  const user = props.auth?.user || props.user || null;

  // Guest Landing Links
  const GUEST_LINKS = [
    { label: t('nav.home', 'Beranda'), href: '/#hero' },
    { label: t('nav.howItWorks', 'Cara Kerja'), href: '/#alur' },
    { label: t('nav.services', 'Layanan Kami'), href: '/#fitur' },
    { label: t('nav.advantages', 'Keunggulan Pintar'), href: '/#ai-intelligence' },
    { label: t('nav.testimonials', 'Kisah Sukses'), href: '/#testimoni' },
  ];

  // Dashboard App Links
  const DASHBOARD_LINKS = [
    { label: t('dashboard.tabs.overview', 'Ringkasan Karier'), href: '/dashboard?tab=overview', icon: Brain },
    { label: t('dashboard.tabs.analysis', 'Cek Kualitas CV'), href: '/analyze-cv', icon: BarChart3 },
    { label: t('dashboard.tabs.jobs', 'Rekomendasi Kerja'), href: '/dashboard?tab=jobs', icon: Briefcase },
    { label: t('dashboard.tabs.roadmap', 'Rencana Karier'), href: '/dashboard?tab=roadmap', icon: Map },
    { label: t('dashboard.tabs.cvBuilder', 'Buat CV Otomatis'), href: '/cv-builder', icon: FileText },
    { label: t('dashboard.tabs.coverLetter', 'Surat Lamaran AI'), href: '/cover-letter', icon: FileCheck2 },
  ];

  const activeLinks = isDashboard ? DASHBOARD_LINKS : GUEST_LINKS;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ScrollSpy & Hash sync handler
  useEffect(() => {
    if (isDashboard) return;

    const sectionIds = ['#hero', '#alur', '#fitur', '#ai-intelligence', '#testimoni'];

    const handleScrollSpy = () => {
      const scrollPos = window.scrollY + 140; // threshold offset for fixed header
      
      // Bottom of page check
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 60) {
        setActiveHash('#testimoni');
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.querySelector(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveHash(id);
            break;
          }
        }
      }
    };

    const handleHashChange = () => {
      if (window.location.hash) {
        setActiveHash(window.location.hash);
      } else {
        handleScrollSpy();
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    handleScrollSpy(); // Initial check on mount

    return () => {
      window.removeEventListener('scroll', handleScrollSpy);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [isDashboard]);

  useEffect(() => {
    setMenuOpen(false);
  }, [url]);

  const handleNavClick = (e, href) => {
    if (!isDashboard && href.includes('#')) {
      const targetId = href.substring(href.indexOf('#'));
      const el = document.querySelector(targetId);
      if (el) {
        e.preventDefault();
        setActiveHash(targetId);
        window.history.pushState(null, '', targetId);
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const checkIsActive = (linkHref) => {
    if (isDashboard) {
      return url === linkHref;
    }
    if (linkHref === '/#hero' || linkHref === '/') {
      return !activeHash || activeHash === '#hero';
    }
    const hashPart = linkHref.substring(linkHref.indexOf('#'));
    return activeHash === hashPart;
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('careerai_auth_user_id');
      sessionStorage.removeItem('careerai_saved_jobs');
      sessionStorage.removeItem('careerai_just_registered');
    }
    router.post('/logout');
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}
      >
        <div style={{
          position: 'relative',
          background: scrolled ? 'rgba(5,8,22,0.96)' : 'transparent',
          backdropFilter: scrolled ? 'blur(28px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(28px)' : 'none',
          boxShadow: scrolled
            ? '0 10px 40px rgba(0,0,0,0.65), 0 0 30px rgba(45,212,191,0.15)'
            : 'none',
          transition: 'all 0.35s ease',
        }}>
          {/* Animated Top & Bottom Shimmer Border Line */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '1.5px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.6) 25%, rgba(79,124,255,0.8) 50%, rgba(139,92,246,0.7) 75%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmerText 3.5s linear infinite',
              opacity: scrolled ? 1 : 0.4,
              transition: 'opacity 0.35s ease',
            }}
          />

          <div style={{
            maxWidth: '1200px', margin: '0 auto', padding: '0 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            height: '70px',
          }}>

            {/* ── Logo with Shimmer Glow ── */}
            <Link href={user ? "/dashboard" : "/"} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                position: 'relative', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <img src="/assets/ayokerja-logo.png" alt="AyoKerja Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(2.2)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="shimmer-text" style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontWeight: 900, fontSize: '21px', letterSpacing: '-0.5px', lineHeight: 1.1,
                }}>
                  AyoKerja
                </span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: 700, color: '#2DD4BF', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {t('header.subtitle', 'Asisten Karier Impian')}
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav Glass Pill ── */}
            <style>{`
              @keyframes shimmerSweepNav {
                0%   { transform: translateX(-120%) skewX(-15deg); }
                100% { transform: translateX(220%) skewX(-15deg); }
              }
              @keyframes shimmerDotGlow {
                0%, 100% { opacity: 0.7; transform: scale(1); box-shadow: 0 0 6px #2DD4BF; }
                50%      { opacity: 1; transform: scale(1.35); box-shadow: 0 0 12px #2DD4BF, 0 0 22px #4F7CFF; }
              }
              .nav-link-item {
                transition: color 0.25s ease;
                position: relative;
              }
              .nav-link-item:hover {
                color: #2DD4BF !important;
              }
            `}</style>

            <nav className="desktop-nav" style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: scrolled ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.03)',
              border: scrolled ? '1px solid rgba(45,212,191,0.25)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '99px', padding: '5px 8px',
              backdropFilter: 'blur(16px)',
              boxShadow: scrolled ? '0 4px 25px rgba(0,0,0,0.5), 0 0 20px rgba(45,212,191,0.12)' : 'none',
              transition: 'all 0.35s ease',
              position: 'relative',
            }}>
              {activeLinks.map(link => {
                const isActive = checkIsActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="nav-link-item"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '13px',
                      color: isActive ? '#2DD4BF' : '#CBD5E1',
                      textDecoration: 'none',
                      padding: '7px 16px',
                      borderRadius: '99px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      whiteSpace: 'nowrap',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {/* Animated Sliding Glass Pill Background via Framer Motion layoutId */}
                    {isActive && (
                      <motion.div
                        layoutId="activeHeaderNavPill"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '99px',
                          background: 'linear-gradient(135deg, rgba(20,184,166,0.28) 0%, rgba(79,124,255,0.28) 50%, rgba(139,92,246,0.28) 100%)',
                          border: '1px solid rgba(45,212,191,0.55)',
                          boxShadow: '0 0 20px rgba(45,212,191,0.38), inset 0 0 14px rgba(45,212,191,0.2)',
                          zIndex: -1,
                          overflow: 'hidden',
                        }}
                      >
                        {/* Active Shimmer Light Sweep */}
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '99px',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
                            animation: 'shimmerSweepNav 2.8s ease-in-out infinite',
                            pointerEvents: 'none',
                          }}
                        />
                      </motion.div>
                    )}

                    {/* Glowing Shimmer Dot */}
                    {isActive && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#2DD4BF',
                          animation: 'shimmerDotGlow 2s ease-in-out infinite',
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                      />
                    )}

                    {link.icon && <link.icon size={14} color={isActive ? '#2DD4BF' : '#94A3B8'} />}
                    <span className={isActive ? "shimmer-text" : ""}>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* ── Right Actions ── */}
            <div className="header-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* 🌐 Language Switcher — selalu tampil di semua halaman */}
              <LanguageSwitcher compact={true} />

              {user ? (
                /* Authenticated User Profile Pill (Clickable link to /dashboard) */
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link href="/dashboard" style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(45,212,191,0.3)',
                    borderRadius: '99px', padding: '4px 12px 4px 5px',
                    textDecoration: 'none', cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 0 15px rgba(45,212,191,0.15)'
                  }} title="Buka Dashboard Karier">
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4F7CFF 0%, #14B8A6 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '11px', color: '#fff',
                      flexShrink: 0,
                    }}>
                      {user.name ? user.name.substring(0, 2).toUpperCase() : 'RD'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '12px', color: '#F8FAFC' }}>
                        {user.name}
                      </span>
                      <span className="header-guest-btn-text" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '10px', color: '#2DD4BF' }}>
                        {t('header.mainMenu', 'Menu Utama →')}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title={t('nav.logout', 'Keluar')}
                    className="header-guest-btn-text"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      borderRadius: '10px', padding: '8px', color: '#F87171',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                /* Guest Mode Buttons */
                <>
                  <Link
                    href="/login"
                    className="header-guest-btn"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '13px',
                      color: '#CBD5E1', textDecoration: 'none',
                      padding: '8px 16px', borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.12)',
                      background: 'rgba(255,255,255,0.04)',
                      transition: 'all 0.25s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <LogIn size={15} />
                    <span className="header-guest-btn-text">{t('nav.login', 'Masuk')}</span>
                  </Link>

                  <Link
                    href="/register"
                    className="header-guest-btn"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '13px',
                      color: '#fff', textDecoration: 'none',
                      padding: '8px 18px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #14B8A6 0%, #4F7CFF 100%)',
                      boxShadow: '0 0 20px rgba(45,212,191,0.35)',
                      transition: 'all 0.25s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <UserPlus size={15} />
                    <span className="header-guest-btn-text">{t('nav.register', 'Daftar Gratis')}</span>
                  </Link>
                </>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="mobile-menu-btn"
                aria-label="Toggle Menu"
                style={{
                  display: 'none', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(45,212,191,0.3)', borderRadius: '10px',
                  padding: '8px', color: '#2DD4BF', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', top: '70px', left: 0, right: 0, zIndex: 999,
              background: 'rgba(5, 8, 22, 0.98)', backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              borderBottom: '1px solid rgba(45,212,191,0.2)', padding: '20px 18px 24px',
              maxHeight: 'calc(100vh - 70px)', overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* User Profile Card inside Mobile Drawer if logged in */}
              {user && (
                <div style={{
                  padding: '12px 14px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(20,184,166,0.12) 0%, rgba(79,124,255,0.12) 100%)',
                  border: '1px solid rgba(45,212,191,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '6px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4F7CFF 0%, #14B8A6 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '13px', color: '#fff',
                    }}>
                      {user.name ? user.name.substring(0, 2).toUpperCase() : 'RD'}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '14px', color: '#F8FAFC' }}>
                        {user.name}
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#2DD4BF' }}>
                        {user.email || 'Pengguna Aktif'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px', padding: '6px 10px', color: '#F87171',
                      fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    <LogOut size={14} /> Keluar
                  </button>
                </div>
              )}

              {/* Mobile Drawer Navigation Links */}
              {activeLinks.map(link => {
                const isActive = checkIsActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      handleNavClick(e, link.href);
                      setMenuOpen(false);
                    }}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '14px',
                      color: isActive ? '#2DD4BF' : '#CBD5E1',
                      textDecoration: 'none',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(20,184,166,0.18) 0%, rgba(79,124,255,0.18) 100%)'
                        : 'rgba(255,255,255,0.03)',
                      border: isActive ? '1px solid rgba(45,212,191,0.4)' : '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {link.icon ? (
                        <link.icon size={16} color={isActive ? '#2DD4BF' : '#94A3B8'} />
                      ) : isActive && (
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#2DD4BF',
                            boxShadow: '0 0 8px #2DD4BF',
                            display: 'inline-block',
                          }}
                        />
                      )}
                      <span>{link.label}</span>
                    </span>
                    <ChevronRight size={16} color={isActive ? '#2DD4BF' : '#64748B'} />
                  </Link>
                );
              })}

              {/* Mobile Guest Auth Buttons */}
              {!user && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '14px',
                      color: '#CBD5E1', textDecoration: 'none', padding: '12px 16px',
                      borderRadius: '12px', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}
                  >
                    <LogIn size={16} color="#94A3B8" /> Masuk Akun
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '14px',
                      color: '#fff', textDecoration: 'none', padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #14B8A6 0%, #4F7CFF 100%)',
                      boxShadow: '0 0 20px rgba(45,212,191,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}
                  >
                    <UserPlus size={16} /> Daftar Akun Gratis
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

