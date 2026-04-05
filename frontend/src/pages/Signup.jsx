import { useContext, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

   const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Invalid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!validate()) return;

      const res = await API.post("/auth/signup", form);
      login(res.data);
      navigate("/dashboard");  
    } catch (error) {
      // console.error(err.response?.data || err.message);
      alert(error?.response?.data?.message || "something went wrong!");
    }
    
  };


return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 rounded-xl bg-white/[0.04] border border-white/[0.08]">

        <h2 className="text-xl font-bold mb-4 text-center">Signup</h2>

        {/* Name */}
        <input
          placeholder="Name"
          className="w-full p-3 mb-1 rounded bg-white/[0.05]"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <p className="text-red-400 text-xs mb-2">{errors.name}</p>

        {/* Email */}
        <input
          placeholder="Email"
          className="w-full p-3 mb-1 rounded bg-white/[0.05]"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <p className="text-red-400 text-xs mb-2">{errors.email}</p>

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-1 rounded bg-white/[0.05]"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <p className="text-red-400 text-xs mb-3">{errors.password}</p>

        <button className="w-full bg-[#4ECDC4] text-black p-3 rounded">
          Signup
        </button>

        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/login")} className="text-[#4ECDC4]">
            Login
          </button>
        </p>
      </form>
    </div>
  );
}