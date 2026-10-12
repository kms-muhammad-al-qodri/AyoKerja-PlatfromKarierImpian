import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedBackground — Ultra-Premium Futuristic Animated Canvas & Ambient Glow Background
 * Provides a unified visual theme across Landing, Login, and Register pages.
 * Features automatic device identification to optimize mobile performance and clean UI.
 */
export default function AnimatedBackground({ showGrid = true, showConstellation = true, showBlobs = true }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [isMobile, setIsMobile] = useState(false);

  // Device detection: identify mobile devices or small screens
  useEffect(() => {
    const checkDevice = () => {
      const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        typeof navigator !== 'undefined' ? navigator.userAgent : ''
      );
      const smallScreen = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
      setIsMobile(userAgentMobile || smallScreen);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const activeShowGrid = showGrid && !isMobile;
  const activeShowConstellation = showConstellation && !isMobile;

  useEffect(() => {
    if (!activeShowConstellation) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const COLORS = ['#2DD4BF', '#4F7CFF', '#8B5CF6', '#22D3EE', '#A78BFA', '#F472B6'];
    const particleCount = Math.min(55, Math.floor((width * height) / 16000) || 35);

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2.2 + 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI,
    }));

    let phase = 0;

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      phase += 0.02;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Mouse interactive ambient glow
      if (mx > 0 && my > 0) {
        const radGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 220);
        radGlow.addColorStop(0, 'rgba(45, 212, 191, 0.07)');
        radGlow.addColorStop(0.5, 'rgba(79, 124, 255, 0.04)');
        radGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = radGlow;
        ctx.fillRect(0, 0, width, height);
      }

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle distance repulse from cursor
        const dx = p.x - mx;
        const dy = p.y - my;
        const distMouse = Math.sqrt(dx * dx + dy * dy);
        if (distMouse < 140) {
          const angle = Math.atan2(dy, dx);
          const force = (140 - distMouse) * 0.008;
          p.x += Math.cos(angle) * force;
          p.y += Math.sin(angle) * force;
        }

        const currentAlpha = p.alpha + Math.sin(phase + p.pulse) * 0.15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(0.8, currentAlpha));
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Constellation dashed connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = (1 - dist / 125) * 0.16;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [activeShowConstellation]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Base Deep Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #050816 0%, #0A0D2E 45%, #07091A 100%)',
          zIndex: -3,
        }}
      />

      {/* Auth / Hero Image Texture Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/auth-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35,
          mixBlendMode: 'overlay',
          zIndex: -2,
        }}
      />

      {/* Futuristic Grid Overlay (Hidden on Mobile) */}
      {activeShowGrid && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)',
            zIndex: -1,
          }}
        />
      )}

      {/* Animated Floating Glow Blobs */}
      {showBlobs && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '-15%',
              left: '-10%',
              width: '55vw',
              height: '55vw',
              maxWidth: 750,
              maxHeight: 750,
              background: 'radial-gradient(ellipse at center, rgba(45, 212, 191, 0.22) 0%, transparent 70%)',
              filter: 'blur(100px)',
              animation: 'bgBlobFloatA 20s ease-in-out infinite alternate',
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-15%',
              right: '-10%',
              width: '60vw',
              height: '60vw',
              maxWidth: 800,
              maxHeight: 800,
              background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.20) 0%, transparent 70%)',
              filter: 'blur(110px)',
              animation: 'bgBlobFloatB 26s ease-in-out infinite alternate',
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '45vw',
              height: '45vw',
              maxWidth: 600,
              maxHeight: 600,
              background: 'radial-gradient(ellipse at center, rgba(79, 124, 255, 0.16) 0%, transparent 70%)',
              filter: 'blur(90px)',
              animation: 'bgBlobFloatC 22s ease-in-out infinite alternate',
              zIndex: 0,
            }}
          />
        </>
      )}

      {/* Canvas for Constellation Particles (Hidden on Mobile) */}
      {activeShowConstellation && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      {/* Global CSS for Animations */}
      <style>{`
        @keyframes bgBlobFloatA {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(60px, 40px) scale(1.1); }
          100% { transform: translate(-30px, 80px) scale(0.95); }
        }
        @keyframes bgBlobFloatB {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(-80px, -50px) scale(1.12); }
          100% { transform: translate(40px, -70px) scale(0.9); }
        }
        @keyframes bgBlobFloatC {
          0%   { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          50%  { transform: translate(-45%, -55%) scale(1.18) rotate(180deg); }
          100% { transform: translate(-55%, -45%) scale(0.88) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
