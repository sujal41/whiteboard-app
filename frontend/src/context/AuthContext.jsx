import { createContext, useEffect, useState } from "react";
import socket from "../socket";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    socket.emit("join-user", data.user.id);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  
  // useEffect(() => {
  //   if (user?._id) {
      
  //   }
  // }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}