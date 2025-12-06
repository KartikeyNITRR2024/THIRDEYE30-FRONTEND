import thirdeyelogo from "../images/thirdeyelogo.png";
import backgroundimage from "../images/backgroundimage.png";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useContext, useEffect } from "react";
import AuthContext from "../contexts/Auth/AuthContext";
import NotificationContext from "../contexts/Notification/NotificationContext";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Verify() {
  const { verification, cleanAllVerificationData, verifyUser, verifyOtp } =
    useContext(AuthContext);
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
    } else {
      const result = await verifyOtp(otpValue);
      if (result.success) navigate("/login", { replace: true });
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
          key="verify-page"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
          className="p-10 rounded flex flex-col md:flex-row"
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
            className="md:p-20 md:border md:border-gray-600 md:backdrop-blur-sm flex flex-col items-center"
          >
            {verifyUser?.message && (
              <p className="text-center text-black font-semibold mb-4 px-4">
                {verifyUser.message}
              </p>
            )}

            {/* OTP */}
            <div className="flex space-x-3 my-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-black text-xl border border-black rounded-xl bg-white outline-none"
                />
              ))}
            </div>

            {/* Reset password fields */}
            {verifyUser?.mailType === 2 && (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="m-2 text-black bg-white -mx-1 p-3 w-full border border-black rounded-xl outline-none"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="m-2 text-black bg-white -mx-1 p-3 w-full border border-black rounded-xl outline-none"
                />
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="m-2 h-10 -mx-1 w-full bg-black text-white rounded-3xl font-semibold hover:bg-gray-900 transition"
            >
              Verify OTP
            </button>

            {/* Back to login */}
            <p className="text-center text-black mt-4 text-sm">
              Back to Login?{" "}
              <Link
                to="/"
                onClick={() => cleanAllVerificationData()}
                className="text-black hover:underline font-semibold"
              >
                Login
              </Link>
            </p>
          </form>
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center flex flex-col items-center space-y-1 text-black">
        <p className="font-semibold">Kartikey Thawait</p>

        <div className="flex space-x-4">
          <a href="mailto:kartikeythawait123@gmail.com" className="hover:text-gray-700">
            <FaEnvelope size={18} />
          </a>
          <a href="https://www.linkedin.com/in/kartikey-thawait-51583a221/" className="hover:text-gray-700">
            <FaLinkedin size={18} />
          </a>
          <a href="https://github.com/KartikeyNITRR2024" className="hover:text-gray-700">
            <FaGithub size={18} />
          </a>
        </div>
      </span>
    </div>
  );
}
