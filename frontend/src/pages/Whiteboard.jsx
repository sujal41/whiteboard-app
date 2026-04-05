import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { ArrowLeft } from "lucide-react";

import Toolbar from "../components/Toolbar";
import Canvas from "../components/Canvas";

import socket from "../socket";
import Collaborators from "../components/Collaborators";
import InviteUsers from "../components/InviteUsers";
import { AuthContext } from "../context/AuthContext";
import { WhiteBoardContext } from "../context/WhiteBoardContext";

export default function Whiteboard() {
    const { id } = useParams();
    const { user, logout } = useContext(AuthContext);

    const navigate = useNavigate();

    const { 
        board, setBoard, 
        setCollaborators 
    } = useContext(WhiteBoardContext);
//   const [board, setBoard] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState("");
  
    const [shapes, setShapes] = useState([]);
    const [tool, setTool] = useState("rect"); // rect | circle | line
    const [selectedId, setSelectedId] = useState(null);

    const fetchBoard = async () => {
      try {
        const res = await API.get(`/whiteboard/${id}`);
        console.log("this board: ", res.data.board)
        setBoard(res.data.board);
        setCollaborators(res.data.board.collaborators);
        setTitle(res.data.board.title || "Couldn't fetch board title!");
      } catch (err) {
        console.error(err.response?.data || err.message);
        navigate("/dashboard");
      }
    };
    
    const fetchShapes = async () => {
        try {
            const res = await API.get(`/shapes/${id}`);
            const normalized = res.data.shapes.map((s) => ({
                ...s,
                id: s.shapeId, // 🔥 normalize
            }));

            setShapes(normalized);
        } catch (err) {
            alert(err?.response?.data?.message || "something went wrong!");
            console.error(err.response?.data || err.message);
        }
    };

    useEffect(() => {
        socket.emit("join-board", id);
        
        socket.on("board:removed", (data) => {
            if (data.boardId === id) {
            alert(data.message); // or toast

            navigate("/dashboard");
            }
        });

        console.log("user: ", user);
        fetchBoard();
        fetchShapes();

        
        return () => {
            socket.off("board:removed");
        };
    }, [id]);


    useEffect(() => {
        socket.on("shape:created", (shape) => {
            setShapes((prev) => [...prev, shape]);
        });

        socket.on("shape:updated", (updated) => {
            setShapes((prev) =>
            prev.map((s) =>
                s.shapeId === updated.shapeId ? updated : s
            )
            );
        });

        socket.on("shape:deleted", (shapeId) => {
            setShapes((prev) =>
            prev.filter((s) => s.shapeId !== shapeId)
            );
        });

        return () => {
            socket.off("shape:created");
            socket.off("shape:updated");
            socket.off("shape:deleted");
        };
    }, []);


    

    const inviteUser = async (userId) => {
        try {
            await API.post(`/whiteboard/${id}/invite`, {
                userId,
            });

            alert("User invited!");
        } catch (err) {
            if(err?.response?.data?.message) alert(err?.response?.data?.message);
            console.error(err);
        }
    };

    
    


  // 🔥 COMMON UPDATE FUNCTION
    const updateShape = async (updated) => {
        setShapes((prev) =>
        prev.map((s) =>
            s.shapeId === updated.shapeId ? updated : s
        )
        );

        // 🔥 ONLY send required fields
        const payload = {
            x: updated.x,
            y: updated.y,
            width: updated.width,
            height: updated.height,
            radius: updated.radius,
            points: updated.points,
            fill: updated.fill,
            stroke: updated.stroke,
            strokeWidth: updated.strokeWidth,
        };

        try {
        await API.put(`/shapes/${updated.shapeId}`, payload);
        } catch (err) {
        console.error(err.response?.data || err.message);
        }

        // 🔥 SOCKET EMIT
        socket.emit("shape:update", {
            boardId: id,
            shape: updated,
        });
    };

    const deleteShape = async (shapeId) => {
        // remove from UI first (optimistic)
        setShapes((prev) =>
            prev.filter((s) => s.shapeId !== shapeId)
        );

         setSelectedId(null); // 🔥 important

        try {
            await API.delete(`/shapes/${shapeId}`);

            // 🔥 SOCKET EMIT
            socket.emit("shape:delete", {
                boardId: id,
                shapeId,
            });
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    const renameBoard = async () => {
        try {
            await API.patch(`/whiteboard/rename/${board._id}`, { title });
            await fetchBoard();
            alert("Board name renamed successfully");
        } catch (err) {
            console.log("error during rename: ", err);
            alert("Coudldn't rename board title !");
        }
    };

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            setIsEditing(false);
            await renameBoard();
        }

        if (e.key === "Escape") {
            setIsEditing(false);
            setTitle(board.title); // reset
        }
    };

  return (
    <div className="h-screen bg-[#0a0a0f] text-white font-sans flex flex-col overflow-hidden">
 
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }
        @keyframes fadeDown {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .wb-in  { animation: fadeDown .4s ease both; }
        .wb-in2 { animation: fadeDown .4s ease both .08s; }
        .wb-in3 { animation: fadeDown .4s ease both .15s; }
        .live-dot { animation: blink 1.8s ease-in-out infinite; }
        .wb-title-input {
          background: transparent;
          border: none;
          border-bottom: 1.5px solid rgba(78,205,196,0.55);
          outline: none;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(14px, 2vw, 18px);
          letter-spacing: -0.02em;
          max-width: 260px;
          padding: 1px 0;
        }
      `}</style>
 
      {/* ── NAV ── */}
      <nav className="wb-in flex items-center gap-2.5 px-3 sm:px-5 border-b border-white/[0.06] bg-[#0a0a0f]/90 backdrop-blur-xl z-40 flex-shrink-0 flex-wrap py-2 sm:py-0 sm:h-[58px]">
 
        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/55 bg-white/[0.05] border border-white/10 rounded-[9px] hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all flex-shrink-0"
        >
          <ArrowLeft size={13} />
          <span>Back</span>
        </button>
 
        <div className="w-px h-5 bg-white/[0.08] flex-shrink-0 hidden sm:block" />
 
        {/* Logo mark */}
        <div className="w-7 h-7 rounded-lg bg-[#4ECDC4]/10 border border-[#4ECDC4]/25 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" fill="none" stroke="#4ECDC4" strokeWidth="1.8" viewBox="0 0 24 24">
            <rect x="3" y="3" width="8" height="8" rx="1" />
            <circle cx="17" cy="7" r="4" />
            <path d="M3 17l4 4 8-8" />
          </svg>
        </div>
 
        {/* Title */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => setIsEditing(false)}
              className="wb-title-input"
            />
          ) : (
            <h1
              onDoubleClick={() => setIsEditing(true)}
              title="Double-click to rename"
              className="font-display font-extrabold text-sm sm:text-[17px] tracking-tight text-white truncate max-w-[200px] sm:max-w-xs cursor-text"
            >
              {title || "Untitled Board"}
            </h1>
          )}
        </div>
 
        {/* Owner badge */}
        <span className="flex items-center gap-1 bg-[#FFE66D]/[0.08] border border-[#FFE66D]/15 rounded-md px-2 py-0.5 text-[11px] text-[#FFE66D] flex-shrink-0 hidden sm:flex">
          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          {board?.owner?._id === user?.id ? "Owner" : board?.owner?.name}
        </span>
 
        {/* Live dot */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="live-dot w-1.5 h-1.5 rounded-full bg-[#4ECDC4] inline-block" />
          <span className="text-[11px] text-white/30 hidden sm:block">Live</span>
        </div>
 
        <div className="w-px h-5 bg-white/[0.08] flex-shrink-0 hidden sm:block" />
 
        {/* User */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] text-white/30 leading-none">Signed in as</p>
            <p className="text-xs font-medium text-white/70 leading-snug">{user?.name}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#4ECDC4]/15 border border-[#4ECDC4]/35 flex items-center justify-center font-display font-bold text-xs text-[#4ECDC4]">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      </nav>
 
      {/* ── CONTROLS ROW ── */}
      <div className="wb-in2 flex items-center justify-between gap-2 px-3 sm:px-5 py-2 border-b border-white/[0.05] bg-[#0a0a0f]/80 backdrop-blur-md z-30 flex-shrink-0 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {board?.collaborators && <Collaborators fetchBoard={fetchBoard} />}
          <div className="w-px h-4 bg-white/[0.08] hidden sm:block" />
          <InviteUsers inviteUser={inviteUser} fetchBoard={fetchBoard} />
        </div>
        <div className="flex-shrink-0">
          <Toolbar
            tool={tool}
            setTool={setTool}
            selectedId={selectedId}
            shapes={shapes}
            updateShape={updateShape}
            deleteShape={deleteShape}
            setShapes={setShapes}
            setSelectedId={setSelectedId}
          />
        </div>
      </div>
 
      {/* ── CANVAS ── */}
      <div className="wb-in3 flex-1 relative overflow-hidden">
        {/* Dot grid bg */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 w-full h-full">
          <Canvas
            shapes={shapes}
            setShapes={setShapes}
            tool={tool}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            updateShape={updateShape}
          />
        </div>
      </div>
    </div>
  );
}