import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Welcome from "../pages/Welcome";
import Whiteboard from "../pages/Whiteboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        
        // auth routes
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        // dashboard
        <Route path="/dashboard" element={<Dashboard />} />

        // whiteboard routes
        <Route path="/whiteboard/:id" element={<Whiteboard />} />

      </Routes>
    </BrowserRouter>
  );
}