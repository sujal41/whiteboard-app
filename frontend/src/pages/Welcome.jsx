import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-indigo-600 px-4">
      
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Whiteboard App
        </h1>

        <p className="text-gray-500 mb-6">
          Draw, collaborate and share ideas in real-time
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition"
          >
            Signup
          </button>
        </div>

      </div>

      {/* Footer */}
      <p className="text-white mt-6 text-sm opacity-80">
        Real-time collaborative whiteboard 🚀
      </p>
    </div>
  );
}