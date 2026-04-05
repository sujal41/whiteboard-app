import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [boards, setBoards] = useState([]);
    const [invitedBoards, setInvitedBoards] = useState([]);
    // const [boardUpdated, setBoardUpdated] = useState(true);
    const [toasts, setToasts] = useState([]);
     const [notifications, setNotifications] = useState([]);

    const navigate = useNavigate();

    const fetchBoards = async () => {
        try {
          const res = await API.get("/whiteboard");
            setBoards(res.data.boards);
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    const fetchInvitedBoards = async () => {
        try {
            const res = await API.get("/whiteboard/invited");
            setInvitedBoards(res.data.boards);
        } catch (err) {
        console.error(err.response?.data || err.message);
        }
    };

    
    const handleCreateWhiteboard = async () => {
        try {
            const res = await API.post("/whiteboard/create", {
            title,
            });

            console.log(res.data);

            setShowModal(false);
            setTitle("");
            fetchBoards();  // refresh boards again
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    useEffect(() => {

        fetchBoards();
        fetchInvitedBoards();
    }, []);


    useEffect(() => {
        socket.on("notification", (data) => {
            const id = Date.now();

            const newToast = { ...data, id };

            console.log("on notification data:", data);
             setNotifications((prev) => [...prev, data]);
            setToasts((prev) => [...prev, newToast]);

            // auto remove after 5 seconds
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 5000);
        });

        return () => {
            socket.off("notification");
        };
    }, []);

    const handleClick = (toast) => {
        navigate(`/whiteboard/${toast.boardId}`);
    };
    const dismissToast = (id) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
 
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(20px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .anim-1 { animation: fadeUp .5s ease both .05s; }
        .anim-2 { animation: fadeUp .5s ease both .15s; }
        .anim-3 { animation: fadeUp .5s ease both .25s; }
        .anim-4 { animation: fadeUp .5s ease both .35s; }
        .toast-in { animation: slideIn .3s ease both; }
        .live-dot { animation: blink 1.8s ease-in-out infinite; }
      `}</style>
 
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(78,205,196,0.07) 0%, transparent 70%)" }} />
 
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 h-[58px] border-b border-white/[0.06] bg-[#0a0a0f]/85 backdrop-blur-xl anim-1">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" fill="none" stroke="#4ECDC4" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect x="3" y="3" width="8" height="8" rx="1" />
              <circle cx="17" cy="7" r="4" />
              <path d="M3 17l4 4 8-8" />
            </svg>
          </div>
          <span className="font-display font-bold text-base tracking-tight">DrawSync</span>
        </div>
 
        {/* User + logout */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#4ECDC4]/15 border border-[#4ECDC4]/35 flex items-center justify-center font-display font-bold text-xs text-[#4ECDC4] flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="hidden sm:block text-sm text-white/50">{user?.name}</span>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="px-3 py-1.5 text-xs font-medium text-[#FF6B6B] bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 rounded-[9px] hover:bg-[#FF6B6B]/20 hover:border-[#FF6B6B]/40 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>
 
      {/* ── BODY ── */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20">
 
        {/* Welcome row */}
        <div className="anim-1 flex items-start justify-between flex-wrap gap-3 mb-7">
          <div>
            <p className="text-[11px] text-white/30 tracking-widest mb-1 uppercase">Dashboard</p>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
              Hey, {user?.name?.split(" ")[0]} 👋
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-[#4ECDC4] inline-block" />
            <span className="text-[11px] text-white/30">Live sync active</span>
          </div>
        </div>
 
        {/* Stats strip */}
        <div className="anim-2 grid grid-cols-3 gap-2.5 mb-7">
          {[
            { label: "My boards", value: boards?.length ?? 0, color: "#4ECDC4" },
            { label: "Shared with me", value: invitedBoards?.length ?? 0, color: "#FFE66D" },
            { label: "Notifications", value: notifications?.length ?? 0, color: "#FF6B6B" },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3 sm:p-4 text-center">
              <div className="font-display font-extrabold text-2xl sm:text-3xl leading-none" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-[11px] text-white/35 mt-1.5">{s.label}</div>
            </div>
          ))}
        </div>
 
        {/* Create CTA */}
        <div className="anim-3 mb-7">
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-[#4ECDC4]/[0.06] border border-dashed border-[#4ECDC4]/25 rounded-2xl py-7 flex flex-col items-center gap-2 hover:bg-[#4ECDC4]/10 hover:border-[#4ECDC4]/50 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#4ECDC4]/12 border border-[#4ECDC4]/25 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg width="20" height="20" fill="none" stroke="#4ECDC4" strokeWidth="2.2" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className="font-display font-bold text-sm text-[#4ECDC4]">New Whiteboard</span>
            <span className="text-xs text-white/30">Start drawing and collaborating in real-time</span>
          </button>
        </div>
 
        <hr className="border-white/[0.06] mb-7" />
 
        {/* My Whiteboards */}
        <div className="anim-3 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <svg width="15" height="15" fill="none" stroke="#4ECDC4" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="font-display font-bold text-sm">My Whiteboards</span>
            <span className="bg-[#4ECDC4]/10 border border-[#4ECDC4]/20 text-[#4ECDC4] text-[11px] px-2 py-0.5 rounded-full">
              {boards?.length ?? 0}
            </span>
          </div>
 
          {!boards || boards.length === 0 ? (
            <p className="text-sm text-white/30 pl-0.5">No boards yet — create your first one above.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {boards.map((board) => (
                <div
                  key={board._id}
                  onClick={() => navigate(`/whiteboard/${board._id}`)}
                  className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 cursor-pointer hover:border-[#4ECDC4]/35 hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4ECDC4]/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="w-full h-16 rounded-lg bg-[#4ECDC4]/[0.06] border border-[#4ECDC4]/10 flex items-center justify-center mb-3">
                    <svg width="28" height="28" fill="none" stroke="rgba(78,205,196,0.4)" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="8" height="6" rx="1" />
                      <circle cx="17" cy="8" r="4" />
                      <path d="M3 16l3 3 5-5" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-[13px] text-white truncate mb-1">{board.title}</h3>
                  <p className="text-[11px] text-white/30">
                    {new Date(board.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
 
        <hr className="border-white/[0.06] mb-7" />
 
        {/* Invited Whiteboards */}
        <div className="anim-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <svg width="15" height="15" fill="none" stroke="#FFE66D" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            <span className="font-display font-bold text-sm">Shared With Me</span>
            <span className="bg-[#FFE66D]/10 border border-[#FFE66D]/20 text-[#FFE66D] text-[11px] px-2 py-0.5 rounded-full">
              {invitedBoards?.length ?? 0}
            </span>
          </div>
 
          {!invitedBoards || invitedBoards.length === 0 ? (
            <p className="text-sm text-white/30">No boards shared with you yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {invitedBoards.map((board) => (
                <div
                  key={board._id}
                  onClick={() => navigate(`/whiteboard/${board._id}`)}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 cursor-pointer hover:border-[#FFE66D]/30 hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFE66D]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="w-full h-16 rounded-lg bg-[#FFE66D]/[0.04] border border-[#FFE66D]/10 flex items-center justify-center mb-3">
                    <svg width="28" height="28" fill="none" stroke="rgba(255,230,109,0.4)" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-[13px] text-white truncate mb-1">
                    {board.title}
                </h3>
                <h2 className="text-[11px] text-white/50 mb-1 flex items-center gap-1.5">
                    <span className="text-white/30">Owner:</span>
                    <span className="text-white/80 font-medium truncate">
                        {board.owner.name}
                    </span>
                </h2>
                  <p className="text-[11px] text-white/30 mb-2">
                    {new Date(board.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <span className="bg-[#FFE66D]/10 border border-[#FFE66D]/20 text-[#FFE66D] text-[10px] px-2 py-0.5 rounded-md tracking-wide">
                    INVITED
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
 
        {/* Notifications */}
        {notifications && notifications.length > 0 && (
          <>
            <hr className="border-white/[0.06] mb-7" />
            <div className="anim-4">
              <div className="flex items-center gap-2 mb-4">
                <svg width="15" height="15" fill="none" stroke="#FF6B6B" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                <span className="font-display font-bold text-sm">Notifications</span>
                <span className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[#FF6B6B] text-[11px] px-2 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {notifications.map((n, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(`/whiteboard/${n.boardId}`)}
                    className="flex items-start gap-3 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl cursor-pointer hover:border-[#4ECDC4]/25 hover:bg-[#4ECDC4]/[0.04] transition-all text-sm text-white/55"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" fill="none" stroke="#FF6B6B" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      </svg>
                    </div>
                    <span>{n.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
 
      {/* ── TOASTS ── */}
      <div className="fixed top-[70px] right-3 flex flex-col gap-2.5 z-[200] max-w-[calc(100vw-24px)]">
        {toasts?.map((toast) => (
          <div
            key={toast.id}
            className="toast-in w-[280px] bg-[#111118] border border-[#4ECDC4]/20 rounded-2xl p-4 cursor-pointer shadow-2xl hover:border-[#4ECDC4]/45 transition-all relative"
            onClick={() => handleClick(toast)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); dismissToast(toast.id); }}
              className="absolute top-2.5 right-2.5 w-5 h-5 flex items-center justify-center text-white/30 hover:text-white/60 text-base leading-none transition-colors"
            >×</button>
            <div className="w-7 h-0.5 rounded-full bg-[#4ECDC4] mb-2.5" />
            <p className="text-sm font-medium text-white leading-snug mb-1.5 pr-5">{toast.message}</p>
            <p className="text-[11px] text-[#4ECDC4]/60 flex items-center gap-1">
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Tap to open board
            </p>
          </div>
        ))}
      </div>
 
      {/* ── MODAL ── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-[100] px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#111118] border border-white/10 rounded-[18px] p-6 w-full max-w-md shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-display font-extrabold text-lg text-white mb-0.5">New Whiteboard</h2>
                <p className="text-xs text-white/35">Give your board a name to get started</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center bg-white/[0.06] border border-white/10 rounded-lg text-white/40 hover:text-white/70 text-lg transition-colors flex-shrink-0"
              >×</button>
            </div>
 
            <input
              type="text"
              placeholder="e.g. Product Brainstorm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateWhiteboard()}
              autoFocus
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#4ECDC4]/45 transition-colors mb-4"
            />
 
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-sm text-white/50 border border-white/10 rounded-xl hover:border-white/25 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWhiteboard}
                className="px-5 py-2.5 text-sm font-medium bg-[#4ECDC4] text-[#0a0a0f] rounded-xl hover:bg-[#5ee3da] hover:-translate-y-px transition-all"
              >
                Create board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}