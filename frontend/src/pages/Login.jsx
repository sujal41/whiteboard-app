import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await API.post("/auth/login", form);
      login(res.data);
      navigate("/dashboard");  
    } catch (error) {
      alert(error?.response?.data?.message || "something went wrong!");
    }
    
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4 text-white relative overflow-hidden">

    {/* Background glow */}
    <div className="absolute w-[400px] h-[400px] bg-[#4ECDC4]/10 blur-3xl rounded-full top-[-100px] left-[-100px]" />
    <div className="absolute w-[300px] h-[300px] bg-[#FFE66D]/10 blur-3xl rounded-full bottom-[-80px] right-[-80px]" />

    {/* Login Card */}
    <form
      onSubmit={handleSubmit}
      className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-2xl 
      bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl 
      shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
    >
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 font-display tracking-tight">
        Welcome Back
      </h2>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-3 rounded-lg bg-white/[0.05] border border-white/[0.08] 
        text-white placeholder:text-white/40 focus:outline-none focus:border-[#4ECDC4] 
        focus:bg-white/[0.07] transition"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 mb-5 rounded-lg bg-white/[0.05] border border-white/[0.08] 
        text-white placeholder:text-white/40 focus:outline-none focus:border-[#4ECDC4] 
        focus:bg-white/[0.07] transition"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      {/* Button */}
      <button
        className="w-full p-3 rounded-lg font-medium 
        bg-[#4ECDC4] text-black hover:brightness-110 
        active:scale-[0.98] transition-all"
      >
        Login
      </button>

      {/* Footer */}
      <p className="text-center text-sm text-white/40 mt-4">
        Don’t have an account?{" "}
        
        <span 
          onClick={() => navigate("/signup")}
          className="text-[#4ECDC4] cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </p>
    </form>
  </div>
);
}