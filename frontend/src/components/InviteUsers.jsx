import { useContext, useEffect, useState } from "react";
import { WhiteBoardContext } from "../context/WhiteBoardContext";
import API from "../api/axios";

function InviteUsers({
  inviteUser,
  fetchBoard
}) {
    const { collaborators, setCollaborators } = useContext(WhiteBoardContext);
  const [open, setOpen] = useState(false);
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

  return (
    <div className="relative inline-block">

      {/* Invite Button */}
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Invite User
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 max-w-[90vw] bg-white border rounded-lg shadow-lg p-3 z-50">

          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <strong className="text-sm">Select User</strong>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>

          {/* User List */}
          <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-1">
            {users?.length > 0 ? (
              (() => {
                const availableUsers = users.filter(
                  (user) =>
                    !collaborators?.some(
                      (collab) => collab._id === user._id
                    )
                );

                return availableUsers.length > 0 ? (
                  availableUsers.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-100 ${
                        selectedUser?._id === user._id
                          ? "bg-gray-200"
                          : ""
                      }`}
                    >
                      {user.name}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No users</p>
                );
              })()
            ) : (
              <p className="text-sm text-gray-500">No users</p>
            )}
          </div>

          {/* Invite Button */}
          <button
            disabled={!selectedUser}
            onClick={handleInvite}
            className={`mt-3 w-full py-2 rounded text-white ${
              selectedUser
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Invite User
          </button>
        </div>
      )}
    </div>
  );
}

export default InviteUsers;