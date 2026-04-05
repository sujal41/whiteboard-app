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
    <div className="min-h-screen bg-gray-100 p-4">
        <div>
      <h2>Notifications</h2>

      {notifications.map((n, i) => (
        <div
          key={i}
          onClick={() => navigate(`/whiteboard/${n.boardId}`)}
          className="p-3 bg-gray-100 rounded cursor-pointer mb-2 hover:bg-gray-200"
        >
          {n.message}
        </div>
      ))}
    </div>
        {/* 🔔 Toast Container */}
      <div className="fixed top-5 right-5 space-y-3 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => handleClick(toast)}
            className="bg-white shadow-lg border rounded-lg p-4 w-72 cursor-pointer hover:shadow-xl transition"
          >
            {/* ❌ Close Button */}
            <button
                onClick={(e) => {
                e.stopPropagation(); // prevent opening board
                dismissToast(toast.id);
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-sm"
            >
                ✕
            </button>
            <p className="text-sm font-medium">{toast.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              Click to open board
            </p>
          </div>
        ))}
      </div>

        {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
            
            <h2 className="text-lg font-semibold mb-4">
                Create Whiteboard
            </h2>

            <input
                type="text"
                placeholder="Enter board title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4 focus:outline-none"
            />

            <div className="flex justify-end gap-3">
                
                <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                Cancel
                </button>

                <button
                onClick={handleCreateWhiteboard}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                Create
                </button>

            </div>
            </div>
        </div>
        )}
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow gap-3">
        <h1 className="text-xl font-bold text-gray-800">
          Welcome, {user?.name}
        </h1>

        <button
          onClick={ () => {
            logout();
            navigate("/");
        }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Create Whiteboard Section */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow flex flex-col items-center justify-center text-center">
        
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Create a New Whiteboard
        </h2>

        <p className="text-gray-500 mb-4 text-sm">
          Start drawing and collaborating in real-time
        </p>

        <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition w-full sm:w-auto"
        >
        + Create Whiteboard
        </button>

      </div>
        
    {/* List Whiteboards Section */}
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
                Your Whiteboards
            </h2>

            {boards.length === 0 ? (
                <p className="text-gray-500 text-sm">
                No whiteboards yet. Create one!
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                
                {boards.map((board) => (
                    <div
                    key={board._id}
                    onClick={() => navigate(`/whiteboard/${board._id}`)}
                    className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                    >
                    <h3 className="font-semibold text-gray-800 truncate">
                        {board.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                        Created: {new Date(board.createdAt).toLocaleDateString()}
                    </p>
                    </div>
                ))}

                </div>
            )}
        </div>

        <div className="mt-6 bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">
                Invited Whiteboards
            </h2>

            {invitedBoards.length === 0 ? (
                <p className="text-gray-500 text-sm">
                No invited boards yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {invitedBoards.map((board) => (
                    <div
                    key={board._id}
                    onClick={() => navigate(`/whiteboard/${board._id}`)}
                    className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                    >
                    <h3 className="font-semibold text-gray-800 truncate text-left">
                        {board.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 text-left">
                        Created: {new Date(board.createdAt).toLocaleDateString()}
                    </p>
                    </div>
                ))}
                </div>
            )}
            </div>

        </div>
  );
}