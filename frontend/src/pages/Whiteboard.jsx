import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

import Toolbar from "../components/Toolbar";
import Canvas from "../components/Canvas";

import socket from "../socket";
import Collaborators from "../components/Collaborators";

export default function Whiteboard() {
  const { id } = useParams();

  const [board, setBoard] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [tool, setTool] = useState("rect"); // rect | circle | line
  const [selectedId, setSelectedId] = useState(null);
    const [users, setUsers] = useState([]);

  

    useEffect(() => {
        socket.emit("join-board", id);
    }, [id]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await API.get(`/whiteboard/${id}`);
        console.log("this board: ", res.data.board)
        setBoard(res.data.board);
      } catch (err) {
        console.error(err.response?.data || err.message);
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

    fetchBoard();
    fetchShapes();
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

    useEffect(() => {
        const getUsers = async() => {
            const res = await API.get("/users");
            setUsers(res.data.users);
        }

        getUsers();
    })

    const inviteUser = async (userId) => {
        try {
            await API.post(`/whiteboard/${id}/invite`, {
            userId,
            });

            alert("User invited!");
        } catch (err) {
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <h1 className="text-xl font-bold">
          {board ? board.title : "Loading..."}
        </h1>
        
      </div>

      {board?.collaborators && (
            <Collaborators collaborators={board.collaborators} />
        )}

      <select onChange={(e) => inviteUser(e.target.value)}>
        <option>invite user</option>
        {users.map((user) => (
            <option key={user._id} value={user._id}>
            {user.name}
            </option>
        ))}
        </select>

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