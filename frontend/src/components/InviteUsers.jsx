import { useContext, useEffect, useRef, useState } from "react";
import { WhiteBoardContext } from "../context/WhiteBoardContext";
import API from "../api/axios";

function InviteUsers({
  inviteUser,
  fetchBoard
}) {
    const { collaborators, setCollaborators } = useContext(WhiteBoardContext);
  const [open, setOpen] = useState(false);
   const ref = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);

  const getUsers = async() => {
    const res = await API.get("/users");
    console.log("got users: ", res?.data?.users)
    setUsers(res?.data?.users || []);
}

  const handleInvite = async () => {
    if (!selectedUser) return;

    try {
      await inviteUser(selectedUser._id);

      // ✅ update local state immediately
      setCollaborators((prev) => [...prev, selectedUser]);

      // reset UI
      setOpen(false);
      setSelectedUser(null);
      await fetchBoard();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() =>{
    getUsers();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
 
  const availableUsers = users?.filter(
    (u) => !collaborators?.some((c) => c._id === u._id)
  ) ?? [];
 
  return (
    <div ref={ref} className="relative inline-block">
 
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#4ECDC4] bg-[#4ECDC4]/10 border border-[#4ECDC4]/25 rounded-[9px] hover:bg-[#4ECDC4]/18 hover:border-[#4ECDC4]/45 transition-all whitespace-nowrap"
      >
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" /><line x1="16" y1="11" x2="22" y2="11" />
        </svg>
        Invite
      </button>
 
      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-52 bg-[#111118] border border-white/10 rounded-2xl p-3.5 z-[200] shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
          style={{ animation: "fadeDown .2s ease both" }}>
 
          <div className="flex items-center justify-between mb-3">
            <span className="font-display font-bold text-[13px] text-white">Invite user</span>
            <button
              onClick={() => setOpen(false)}
              className="w-6 h-6 flex items-center justify-center bg-white/[0.06] border border-white/10 rounded-md text-white/40 hover:text-white/70 text-sm transition-colors"
            >×</button>
          </div>
 
          <div className="max-h-40 overflow-y-auto flex flex-col gap-1 mb-3 pr-0.5">
            {availableUsers.length > 0 ? (
              availableUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all border ${
                    selectedUser?._id === user._id
                      ? "bg-[#4ECDC4]/10 border-[#4ECDC4]/30"
                      : "bg-transparent border-transparent hover:bg-white/[0.04] hover:border-white/[0.07]"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-display font-bold text-[10px] flex-shrink-0 border transition-colors ${
                    selectedUser?._id === user._id
                      ? "bg-[#4ECDC4]/15 border-[#4ECDC4]/35 text-[#4ECDC4]"
                      : "bg-white/[0.07] border-white/10 text-white/50"
                  }`}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className={`text-xs flex-1 truncate transition-colors ${
                    selectedUser?._id === user._id ? "text-[#4ECDC4]" : "text-white/65"
                  }`}>{user.name}</span>
                  {selectedUser?._id === user._id && (
                    <svg width="11" height="11" fill="none" stroke="#4ECDC4" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-white/30 text-center py-3">No users to invite</p>
            )}
          </div>
 
          <button
            disabled={!selectedUser}
            onClick={handleInvite}
            className={`w-full py-2 rounded-xl text-sm font-medium transition-all ${
              selectedUser
                ? "bg-[#4ECDC4] text-[#0a0a0f] hover:bg-[#5ee3da] hover:-translate-y-px"
                : "bg-white/[0.05] text-white/25 cursor-not-allowed"
            }`}
          >
            {selectedUser ? `Invite ${selectedUser.name.split(" ")[0]}` : "Select a user"}
          </button>
        </div>
      )}
    </div>
  );
}

export default InviteUsers;