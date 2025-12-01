import thirdeyelogo from "../images/thirdeyelogo.png";
import backgroundimage from "../images/backgroundimage.png";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useContext } from "react";
import AuthContext from "../contexts/Auth/AuthContext";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function SignUp() {
  const { signupFunction } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await signupFunction(formData);
    setLoading(false);
    if (response.success) navigate("/verify");
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
          key="signup-page"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row p-10 rounded"
        >
          {/* Logo */}
          <div className="mb-16 md:mb-0 flex items-center justify-center">
            <img
              className="md:w-2/3 md:h-auto"
              src={thirdeyelogo}
              alt="ThirdEye Logo"
              style={{ filter: "grayscale(100%)" }}
            />
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="md:p-20 md:border md:border-gray-500 md:backdrop-blur-sm"
          >
            {/* Email */}
            <input
              type="text"
              placeholder="Email"
              value={formData.userName}
              onChange={(e) => handleChange("userName", e.target.value)}
              className="m-2 text-black -mx-1 p-3 w-full border border-black rounded-xl bg-white placeholder-gray-600 focus:border-black"
              required
              disabled={loading}
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="m-2 text-black -mx-1 p-3 w-full border border-black rounded-xl bg-white placeholder-gray-600 focus:border-black"
              required
              disabled={loading}
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className="m-2 text-black -mx-1 p-3 w-full border border-black rounded-xl bg-white placeholder-gray-600 focus:border-black"
              required
              disabled={loading}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className={`m-2 h-10 -mx-1 w-full bg-black text-white rounded-3xl font-semibold hover:bg-gray-900 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login Link */}
            <p className="text-center text-black mt-4 text-sm">
              Already have an account?{" "}
              <Link to="/" className="text-black hover:underline font-semibold">
                Log in
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
