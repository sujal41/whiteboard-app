
# 🧠 Collaborative Whiteboard App

A real-time collaborative whiteboard where multiple users can draw, edit, and interact simultaneously.

Built with a modern full-stack architecture using **React, Node.js, Socket.io, and MongoDB**.

---

# 🚀 Features

## 🎨 Interactive Drawing

* Create shapes like rectangles, circles, and lines
* Drag, resize, and rotate elements
* Change colors dynamically
* Smooth and responsive canvas interactions

## 🤝 Real-Time Collaboration

* Multiple users can work on the same board simultaneously
* Instant synchronization across all clients
* Shared canvas state with accurate positioning

## 👥 User Management

* Secure authentication system
* Create and manage personal whiteboards
* Invite other users to collaborate
* Remove users with instant effect

## 🔔 Live Notifications

* Real-time invite notifications
* Floating toast alerts
* Quick navigation to shared boards

---

# 🏗️ Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* React Konva (canvas rendering)
* Axios
* Socket.io Client

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Socket.io
* JWT Authentication

---

# 📂 Project Structure

```id="proj-structure"
root/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── socket.js
```

---

# ⚙️ Environment Setup

## Backend

```env
PORT=5009
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

## Frontend

```env
VITE_API_URL=http://localhost:5009/api
VITE_API_SOCKET_URL=http://localhost:5009
```

---

# 🔌 Real-Time Architecture

The application uses **Socket.io with room-based communication**:

* Each whiteboard operates in its own isolated channel
* Each user has a private channel for personal events (like notifications)

This ensures:

* Efficient real-time updates
* Scalable communication model
* Minimal unnecessary data transfer

---

# 🔐 Authentication

* Token-based authentication using JWT
* Secure access to protected resources
* Persistent login using local storage

---

# 🎯 Key Highlights

* Real-time collaborative editing
* Smooth canvas rendering and transformations
* Scalable backend architecture
* Clean separation of frontend and backend
* Responsive UI built with Tailwind CSS

---

# 🧪 Running the Project

## Backend

```bash
npm install
npm run dev
```

## Frontend

```bash
npm install
npm run dev
```

---

# 📌 Future Enhancements

* Persistent notification system
* User presence indicators (online/offline)
* Role-based permissions (viewer/editor)
* Undo/Redo functionality
* Zoom and pan support
* Export whiteboard as image/PDF

---

# 💡 Inspiration

Inspired by collaborative tools like:

* Figma
* Excalidraw
* Miro

---

# 👨‍💻 Author

A full-stack real-time application demonstrating:

* WebSocket communication
* Canvas-based UI systems
* Scalable collaboration architecture

---
