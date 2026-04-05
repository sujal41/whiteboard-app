import React, { useContext, useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { WhiteBoardContext } from "../context/WhiteBoardContext";

const Collaborators = ({ fetchBoard }) => {
    const { board, setBoard, collaborators } = useContext(WhiteBoardContext);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleRemoveCollaborator = async (userId) => {
    try {
      await API.post(`/whiteboard/remove-collaborator`, {
        boardId: board._id,
        userId,
      });

      setBoard((prev) => ({
        ...prev,
        collaborators: prev.collaborators.filter(
          (u) => u._id !== userId
        ),
      }));

      await fetchBoard()
    } catch (err) {
        // console.log(err.response)
        // console.log(err)
        if(err?.response?.data?.message) alert(err?.response?.data?.message);
      console.error(err);
    }
  };

   useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
 
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 bg-white/[0.05] border border-white/[0.09] rounded-[9px] hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all whitespace-nowrap"
      >
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
        {collaborators?.length || 0}
      </button>
 
      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-52 bg-[#111118] border border-white/10 rounded-2xl p-3.5 z-[200] shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
          style={{ animation: "fadeDown .2s ease both" }}>
 
          <div className="flex items-center justify-between mb-3">
            <span className="font-display font-bold text-[13px] text-white">Collaborators</span>
            <button
              onClick={() => setOpen(false)}
              className="w-6 h-6 flex items-center justify-center bg-white/[0.06] border border-white/10 rounded-md text-white/40 hover:text-white/70 text-sm transition-colors"
            >×</button>
          </div>
 
          <div className="max-h-40 overflow-y-auto flex flex-col gap-1.5 pr-0.5">
            {collaborators?.length > 0 ? (
              collaborators.map((user) => (
                <div key={user._id}
                  className="flex items-center gap-2 px-2.5 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg hover:border-[#FF6B6B]/20 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#4ECDC4]/15 border border-[#4ECDC4]/30 flex items-center justify-center font-display font-bold text-[10px] text-[#4ECDC4] flex-shrink-0">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-xs text-white/70 flex-1 truncate">{user.name}</span>
                  <button
                    onClick={() => handleRemoveCollaborator(user._id)}
                    className="w-5 h-5 flex items-center justify-center bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 rounded-md text-[#FF6B6B] text-xs hover:bg-[#FF6B6B]/20 hover:border-[#FF6B6B]/40 transition-colors flex-shrink-0"
                    title="Remove"
                  >×</button>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/30 text-center py-3">No collaborators yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaborators;