import React from 'react'

const Collaborators = ( { collaborators }) => {
  return (
    <div>
        <p>
            Collaborators:{" "}
            {collaborators?.length > 0
                ? `${collaborators?.length}`
                : "No collaborators"}
        </p>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {collaborators.map(user => (
            <div
            key={user._id}
            style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 10px",
                border: "1px solid #ccc",
                borderRadius: "20px",
                background: "#f5f5f5"
            }}
            >
            <span>{user.name}</span>

            <button
                onClick={() => handleRemoveCollaborator(user._id)}
                style={{
                marginLeft: "8px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: "bold"
                }}
            >
                ✕
            </button>
            </div>
        ))}
        </div>
    </div>
  )
}

export default Collaborators