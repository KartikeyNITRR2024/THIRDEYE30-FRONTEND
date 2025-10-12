import thirdeyelogo from "../images/thirdeyelogo.png";
import backgroundimage from "../images/backgroundimage.png";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useContext, useEffect } from "react";
import AuthContext from "../contexts/Auth/AuthContext";
import NotificationContext from "../contexts/Notification/NotificationContext";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Login() {
  const { userDetails, loginFunction } = useContext(AuthContext);
  const { notifyError } = useContext(NotificationContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [loading, setLoading] = useState(false);

  // ✅ Automatically redirect if user already logged in
  useEffect(() => {
    if (userDetails?.isLogin) {
      navigate(userDetails.firstLogin ? "/setting" : "/marketthresold");
    }
  }, [userDetails?.isLogin, userDetails?.firstLogin, navigate]);

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validateForm = () => {
    if (!formData.userName || formData.userName.length < 4) {
      notifyError("Username must be at least 4 characters long.");
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      notifyError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await loginFunction(formData);
      if (!response.success) {
        notifyError(response.errorMessage || "Invalid credentials");
      }
      // ⚙️ Redirect handled automatically by useEffect
    } catch {
      notifyError("Something went wrong during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundimage})` }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="login-page"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
          className="text-white p-10 rounded flex flex-col md:flex-row"
        >
          {/* Left Logo Section */}
          <div className="mb-16 md:mb-0 flex items-center justify-center">
            <img
              className="md:w-2/3 md:h-auto"
              src={thirdeyelogo}
              alt="ThirdEye Logo"
            />
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="inputcred md:p-20 md:border md:border-gray-600 md:backdrop-blur-sm"
          >
            <input
              className="m-2 text-gray-600 -mx-1 p-3 w-full border border-gray-600 rounded-xl focus:border-gray-700 hover:border-gray-700"
              type="text"
              placeholder="Username"
              value={formData.userName}
              onChange={(e) => handleChange("userName", e.target.value)}
              required
              disabled={loading}
            />

            <input
              className="m-2 text-gray-600 -mx-1 p-3 w-full border border-gray-600 rounded-xl focus:border-gray-700 hover:border-gray-700"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
              disabled={loading}
            />

            <button
              type="submit"
              className={`m-2 btn h-10 -mx-1 w-full bg-blue-600 rounded-3xl text-white font-semibold hover:bg-blue-700 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <p className="text-center text-gray-300 mt-4 text-sm">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:underline font-semibold"
              >
                Create one
              </Link>
            </p>
          </form>
        </motion.div>
      </AnimatePresence>

      {/* Footer Section */}
      <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center flex flex-col items-center space-y-1">
        <p className="font-semibold text-black">Kartikey Thawait</p>
        <div className="flex space-x-4">
          <a
            href="mailto:kartikeythawait123@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900"
          >
            <FaEnvelope size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/kartikey-thawait-51583a221/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-700"
          >
            <FaLinkedin size={18} />
          </a>
          <a
            href="https://github.com/KartikeyNITRR2024"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900"
          >
            <FaGithub size={18} />
          </a>
        </div>
      </span>
    </div>
  );
}
