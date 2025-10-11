import thirdeyelogo from "../images/thirdeyelogo.png";
import backgroundimage from "../images/backgroundimage.png";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function NotFound() {
  return (
    <div
      className="flex items-center justify-center min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundimage})` }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="notfound-page"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
          className="text-white p-10 rounded flex flex-col items-center"
        >
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center">
            <img
              className="md:w-2/3 md:h-auto"
              src={thirdeyelogo}
              alt="ThirdEye Logo"
            />
          </div>

          {/* 404 Message */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-100">
            404
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-center text-gray-200">
            Page Not Found
          </p>

          {/* Link to Home/Login */}
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 rounded-3xl text-white font-semibold hover:bg-blue-700 transition"
          >
            Go to Login
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <span className="absolute text-black bottom-4 left-1/2 transform -translate-x-1/2 text-sm">
        Kartikey
      </span>
    </div>
  );
}
