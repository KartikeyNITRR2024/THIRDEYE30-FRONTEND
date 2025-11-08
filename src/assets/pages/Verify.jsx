import thirdeyelogo from "../images/thirdeyelogo.png";
import backgroundimage from "../images/backgroundimage.png";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useContext, useEffect } from "react";
import AuthContext from "../contexts/Auth/AuthContext";
import NotificationContext from "../contexts/Notification/NotificationContext";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Verify() {
  const { verification, cleanAllVerificationData, verifyUser, verifyOtp } = useContext(AuthContext);
  const { notifyError } = useContext(NotificationContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!verification) navigate("/", { replace: true });
  }, [verification, navigate]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    // If mailType == 2 (Reset Password) -> Validate passwords
    if (verifyUser?.mailType === 2) {
      if (!newPassword || !confirmPassword) {
        notifyError("Please enter both password fields.");
        return;
      }
      if (newPassword.length < 8) {
        notifyError("Password must be at least 8 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        notifyError("Passwords do not match.");
        return;
      }

      const result = await verifyOtp(otpValue, newPassword);
      if (result.success) navigate("/", { replace: true });
    } 
    else {
      const result = await verifyOtp(otpValue);
      if (result.success) navigate("/login", { replace: true });
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundimage})` }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="verify-page"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
          className="text-white p-10 rounded flex flex-col md:flex-row"
        >
          <div className="mb-16 md:mb-0 flex items-center justify-center">
            <img className="md:w-2/3 md:h-auto" src={thirdeyelogo} alt="ThirdEye Logo" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="inputcred md:p-20 md:border md:border-gray-600 md:backdrop-blur-sm flex flex-col items-center"
          >
            {verifyUser?.message && (
              <p className="text-center text-black font-semibold mb-4 px-4">
                {verifyUser.message}
              </p>
            )}

            <div className="flex space-x-3 my-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-gray-700 text-xl border border-gray-500 rounded-xl focus:border-gray-700 outline-none"
                />
              ))}
            </div>

            {/* ✅ Show Password Fields Only When mailType == 2 */}
            {verifyUser?.mailType === 2 && (
              <>
                <input
                  className="m-2 text-gray-600 -mx-1 p-3 w-full border border-gray-600 rounded-xl outline-none"
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                  className="m-2 text-gray-600 -mx-1 p-3 w-full border border-gray-600 rounded-xl outline-none"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </>
            )}

            <button
              type="submit"
              className="m-2 btn h-10 -mx-1 w-full bg-blue-600 rounded-3xl text-white font-semibold hover:bg-blue-700 transition"
            >
              Verify OTP
            </button>

            <p className="text-center text-gray-300 mt-4 text-sm">
              Back to Login?{" "}
              <Link
                to="/"
                onClick={() => cleanAllVerificationData()}
                className="text-blue-400 hover:underline font-semibold"
              >
                Login
              </Link>
            </p>
          </form>
        </motion.div>
      </AnimatePresence>

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
