import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [boards, setBoards] = useState([]);
    const [invitedBoards, setInvitedBoards] = useState([]);
    const [boardUpdated, setBoardUpdated] = useState(true);

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

    

  return (
    <div className="min-h-screen bg-gray-100 p-4">

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
          onClick={logout}
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

        <div className="mt-6 bg-white p-6 rounded-xl shadow flex flex-col items-center justify-center text-center">
            Invited Whiteboards

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

    </div>
  );
}