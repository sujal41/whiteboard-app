import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function CanvasBg() {
  const canvasRef = useRef(null);
 
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
 
    const shapes = Array.from({ length: 14 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 20 + Math.random() * 70,
      type: ["rect", "circle", "line"][i % 3],
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      opacity: 0.04 + Math.random() * 0.08,
      color: ["#4ECDC4", "#FFE66D", "#FF6B6B", "#C7F2FF", "#ffffff"][i % 5],
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.005,
      w: 40 + Math.random() * 80,
      h: 30 + Math.random() * 60,
    }));
 
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
 
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapes.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.rot += s.rotV;
        if (s.x < -150) s.x = canvas.width + 150;
        if (s.x > canvas.width + 150) s.x = -150;
        if (s.y < -150) s.y = canvas.height + 150;
        if (s.y > canvas.height + 150) s.y = -150;
 
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.globalAlpha = s.opacity;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.5;
 
        if (s.type === "rect") ctx.strokeRect(-s.w / 2, -s.h / 2, s.w, s.h);
        else if (s.type === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, s.r, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(-s.w / 2, -s.h / 2);
          ctx.lineTo(s.w / 2, s.h / 2);
          ctx.stroke();
        }
        ctx.restore();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
 
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
 
const features = [
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <circle cx="17" cy="7" r="4" />
        <path d="M3 17l4 4 8-8" />
      </svg>
    ),
    label: "Shapes & Drawing",
    desc: "Rects, circles, lines — drag, resize, rotate",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    label: "Live Collaboration",
    desc: "Multiple users, one canvas, zero lag",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
    label: "Instant Invites",
    desc: "Share a link, get collaborators in seconds",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    label: "Any Device",
    desc: "Responsive canvas that works everywhere",
  },
];
 
export default function Welcome() {
  const navigate = useNavigate();
 
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans relative overflow-hidden">
 
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes blink {
          0%,100% { opacity:1; } 50% { opacity:0.3; }
        }
        .anim-1 { animation: fadeUp .6s ease both .1s; }
        .anim-2 { animation: fadeUp .6s ease both .22s; }
        .anim-3 { animation: fadeUp .6s ease both .34s; }
        .anim-4 { animation: fadeUp .6s ease both .46s; }
        .anim-5 { animation: fadeUp .6s ease both .58s; }
        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #4ECDC4 40%, #FFE66D 60%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 5s linear infinite;
        }
        .live-dot { animation: blink 1.8s ease-in-out infinite; }
      `}</style>
 
      <CanvasBg />
 
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(78,205,196,0.1) 0%, transparent 70%)" }} />
 
      {/* NAV */}
      <nav className="relative z-10 flex items-center justify-between px-5 sm:px-10 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 flex items-center justify-center">
            <svg width="18" height="18" fill="none" stroke="#4ECDC4" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect x="3" y="3" width="8" height="8" rx="1" />
              <circle cx="17" cy="7" r="4" />
              <path d="M3 17l4 4 8-8" />
            </svg>
          </div>
          <span className="font-display font-bold text-[17px] tracking-tight">DrawSync</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm text-white/60 border border-white/10 rounded-xl hover:border-white/25 hover:text-white hover:bg-white/5 transition-all"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 text-sm font-medium bg-[#4ECDC4] text-[#0a0a0f] rounded-xl hover:bg-[#5ee3da] transition-all hover:-translate-y-px"
          >
            Get started
          </button>
        </div>
      </nav>
 
      {/* HERO */}
      <main className="relative z-10 max-w-3xl mx-auto px-5 pt-16 sm:pt-24 pb-12 text-center">
        <div className="anim-1 mb-5">
          <span className="inline-flex items-center gap-2 bg-[#4ECDC4]/10 border border-[#4ECDC4]/20 rounded-full px-4 py-1.5 text-xs text-[#4ECDC4] font-medium tracking-wide">
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-[#4ECDC4] inline-block" />
            Live collaboration — powered by Socket.io
          </span>
        </div>
 
        <h1 className="anim-2 font-display font-extrabold text-[clamp(38px,7vw,68px)] leading-[1.05] tracking-tight mb-6">
          <span className="shimmer-text">Draw together,</span>
          <br />
          <span className="text-white/90">think faster.</span>
        </h1>
 
        <p className="anim-3 text-[17px] leading-relaxed text-white/45 max-w-lg mx-auto mb-10 font-light">
          A real-time whiteboard for teams. Create shapes, share boards, and
          collaborate live — with zero friction and full control.
        </p>
 
        <div className="anim-4 flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3.5 bg-[#4ECDC4] text-[#0a0a0f] font-medium text-sm rounded-xl hover:bg-[#5ee3da] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(78,205,196,.3)]"
          >
            Start for free
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3.5 text-sm text-white border border-white/15 rounded-xl hover:border-white/35 hover:bg-white/5 transition-all hover:-translate-y-0.5"
          >
            Sign in
          </button>
        </div>
 
        {/* Social proof */}
        <div className="anim-5 mt-8 flex items-center justify-center gap-3 text-white/30 text-xs">
          <div className="flex">
            {["#4ECDC4", "#FFE66D", "#FF6B6B", "#C7F2FF"].map((c, i) => (
              <div key={i} style={{ background: c, marginLeft: i === 0 ? 0 : -8 }}
                className="w-6 h-6 rounded-full border-2 border-[#0a0a0f] opacity-80" />
            ))}
          </div>
          <span className="ml-1">Built for real teams. Ready now.</span>
        </div>
      </main>
 
      {/* FEATURES */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {features.map((f, i) => (
            <div key={i}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-[#4ECDC4]/35 hover:bg-[#4ECDC4]/[0.04] hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-[#4ECDC4]/10 flex items-center justify-center text-[#4ECDC4] mb-3">
                {f.icon}
              </div>
              <div className="font-medium text-sm text-white mb-1">{f.label}</div>
              <div className="text-[11px] text-white/35 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
 
      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.05] px-5 sm:px-10 py-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-white/20 tracking-wide">© 2025 DrawSync</span>
        <div className="flex items-center gap-1 text-xs text-white/20">
          Inspired by
          {["Figma", "Excalidraw", "Miro"].map((t) => (
            <span key={t} className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-2 py-0.5 ml-1">{t}</span>
          ))}
        </div>
        <div className="flex gap-1.5">
          {["React", "Konva", "Socket.io", "MongoDB"].map((t) => (
            <span key={t} className="bg-white/[0.04] border border-white/[0.07] rounded-md px-2 py-0.5 text-[11px] text-white/30">{t}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}