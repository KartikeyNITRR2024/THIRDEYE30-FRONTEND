import thirdeyelogo from "../images/thirdeyelogo.png";
import backgroundimage from "../images/backgroundimage.png";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useContext, useEffect } from "react";
import AuthContext from "../contexts/Auth/AuthContext";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function ForgotPassword() {

  const { resetPassword, verification } = useContext(AuthContext);
  const navigate = useNavigate();

    useEffect(() => {
      if (verification)
      {
        navigate("/verify", { replace: true });
      }
    }, [verification]);

  const [formData, setFormData] = useState({
    userName: "",
    phoneNumber: ""
  });

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await resetPassword(formData);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundimage})` }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="forgot-pass-page"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
          className="text-white p-10 rounded flex flex-col md:flex-row"
        >
          {/* Logo Section - Same as Login */}
          <div className="mb-16 md:mb-0 flex items-center justify-center">
            <img
              className="md:w-2/3 md:h-auto w-40 h-auto"
              src={thirdeyelogo}
              alt="ThirdEye Logo"
            />
          </div>

          {/* Form Box */}
          <form
            onSubmit={handleSubmit}
            className="inputcred md:p-20 md:border md:border-gray-600 md:backdrop-blur-sm"
          >
            <h2 className="text-lg text-center font-semibold text-black mb-4">
              Forgot Password?
            </h2>

            <input
              className="m-2 text-gray-600 -mx-1 p-3 w-full border border-gray-600 rounded-xl focus:border-gray-700 hover:border-gray-700"
              type="text"
              placeholder="Registered Email/Username"
              value={formData.userName}
              onChange={(e) => handleChange("userName", e.target.value)}
            />

            <input
              className="m-2 text-gray-600 -mx-1 p-3 w-full border border-gray-600 rounded-xl focus:border-gray-700 hover:border-gray-700"
              type="text"
              placeholder="Registered Mobile Number"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />

            <button
              type="submit"
              className="m-2 btn h-10 -mx-1 w-full bg-blue-600 rounded-3xl text-white font-semibold hover:bg-blue-700 transition"
            >
              Send OTP
            </button>

            <p className="text-center text-gray-300 mt-4 text-sm">
              Back to Login?{" "}
              <Link
                to="/"
                className="text-blue-400 hover:underline font-semibold"
              >
                Login
              </Link>
            </p>
          </form>
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center flex flex-col items-center space-y-1">
        <p className="font-semibold text-black">Kartikey Thawait</p>
        <div className="flex space-x-4">
          <a href="mailto:kartikeythawait123@gmail.com"><FaEnvelope size={18} /></a>
          <a href="https://www.linkedin.com/in/kartikey-thawait-51583a221/"><FaLinkedin size={18} /></a>
          <a href="https://github.com/KartikeyNITRR2024"><FaGithub size={18} /></a>
        </div>
      </span>
    </div>
  );
}
