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
    <div className="min-h-screen bg-gray-100 p-4 overflow-x-hidden">
      
       <button
      onClick={() => navigate("/dashboard")}
      className="top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-xl 
                 bg-white shadow-md hover:shadow-lg transition 
                 text-gray-700 hover:text-black border border-gray-200"
    >
      <ArrowLeft size={18} />
      <span className="text-sm font-medium">Back</span>
    </button>
      {/* Header */}
      {/* Header */}
    <div className="bg-white p-4 rounded-xl shadow mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">

    {/* Left: Board Title */}
    <div>
        {isEditing ? (
            <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsEditing(false)}
            className="text-2xl font-bold text-gray-800 border-b outline-none"
            />
        ) : (
            <h1
            onDoubleClick={() => setIsEditing(true)}
            className="text-2xl font-bold text-gray-800 cursor-pointer"
            >
            {title || "Untitled Board"}
            </h1>
        )}

        <p className="text-sm text-gray-500">
            Whiteboard (Owned By{" "}
            {board?.owner._id === user.id ? "You" : board?.owner.name})
        </p>
    </div>

    {/* Right: User Info */}
    <div className="flex items-center gap-2">
        <div className="text-right">
        <p className="text-sm text-gray-500">Logged in as</p>
        <p className="font-semibold text-gray-800">
            {user?.name}
        </p>
        </div>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
        {user?.name?.charAt(0)?.toUpperCase()}
        </div>
    </div>

    </div>

      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-3 p-3.5">

            {/* Left side */}
            <div className="w-full sm:w-auto">
                {board?.collaborators && (
                <Collaborators
                    fetchBoard={fetchBoard}
                />
                )}
            </div>

            {/* Right side */}
            <div className="w-full sm:w-auto">
                <InviteUsers inviteUser={inviteUser} fetchBoard={fetchBoard} />
            </div>

        </div>

      {/* Toolbar */}
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

      {/* Canvas */}
      <Canvas
        shapes={shapes}
        setShapes={setShapes}
        tool={tool}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        updateShape={updateShape} // 🔥 add this
      />
    </div>
  );
}