import thirdeyelogo from "../images/thirdeyelogo.png";
import backgroundimage from "../images/backgroundimage.png";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useContext, useEffect } from "react";
import AuthContext from "../contexts/Auth/AuthContext";
import NotificationContext from "../contexts/Notification/NotificationContext";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Login() {
  const { login, userDetails, loginFunction, verification } = useContext(AuthContext);
  const { notifyError } = useContext(NotificationContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (verification) navigate("/verify", { replace: true });
    if (login && userDetails) {
      const path = userDetails.firstLogin ? "/setting" : "/marketthresold";
      navigate(path, { replace: true });
    }
  }, [login, userDetails, navigate, verification]);

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
      if (!response.success) notifyError(response.errorMessage || "Invalid credentials");
    } catch {
      notifyError("Something went wrong during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen relative bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundimage})`,
        filter: "grayscale(100%)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="login-page"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row p-10 rounded"
        >
          {/* Left Logo */}
          <div className="mb-16 md:mb-0 flex items-center justify-center">
            <img
              className="md:w-2/3 md:h-auto"
              src={thirdeyelogo}
              alt="ThirdEye Logo"
              style={{ filter: "grayscale(100%)" }}
            />
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="md:p-20 md:border md:border-gray-400 md:backdrop-blur-sm"
          >
            <input
              className="m-2 text-black -mx-1 p-3 w-full border border-black rounded-xl
                         bg-white placeholder-gray-500 focus:border-black hover:border-black"
              type="text"
              placeholder="Enter email / username"
              value={formData.userName}
              onChange={(e) => handleChange("userName", e.target.value)}
              required
              disabled={loading}
            />

            <input
              className="m-2 text-black -mx-1 p-3 w-full border border-black rounded-xl
                         bg-white placeholder-gray-500 focus:border-black hover:border-black"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
              disabled={loading}
            />

            <button
              type="submit"
              className={`m-2 h-10 -mx-1 w-full bg-black text-white rounded-3xl font-semibold 
                         hover:bg-gray-900 transition ${
                           loading ? "opacity-50 cursor-not-allowed" : ""
                         }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <p className="text-center text-black mt-4 text-sm">
              <Link to="/forgetpassword" className="text-black hover:underline font-semibold">
                Forget Password
              </Link>
            </p>

            <p className="text-center text-black mt-4 text-sm">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-black hover:underline font-semibold">
                Create one
              </Link>
            </p>
          </form>
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center flex flex-col items-center space-y-1">
        <p className="font-semibold text-black">Kartikey Thawait</p>

        <div className="flex space-x-4">
          <a
            href="mailto:kartikeythawait123@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-700"
          >
            <FaEnvelope size={18} />
          </a>

          <a
            href="https://www.linkedin.com/in/kartikey-thawait-51583a221/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-700"
          >
            <FaLinkedin size={18} />
          </a>

          <a
            href="https://github.com/KartikeyNITRR2024"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-700"
          >
            <FaGithub size={18} />
          </a>
        </div>
      </span>
    </div>
  );
}
