import React, { useState } from "react";
import API from "../api/axios";

const Collaborators = ({ collaborators, setBoard, board }) => {
  const [open, setOpen] = useState(false);

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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative inline-block">

      {/* Button (always visible) */}
      <button
        onClick={() => setOpen(true)}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
      >
        Collaborators ({collaborators?.length || 0})
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute mt-2 w-64 bg-white border rounded-lg shadow-lg p-3 z-50">

          {/* Header with close button */}
          <div className="flex justify-between items-center mb-2">
            <strong className="text-sm">Collaborators</strong>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>

          {/* List */}
          <div className="max-h-40 overflow-y-auto space-y-2">
            {collaborators?.length > 0 ? (
              collaborators.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center border px-2 py-1 rounded"
                >
                  <span>{user.name}</span>

                  <button
                    onClick={() => handleRemoveCollaborator(user._id)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No collaborators
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaborators;