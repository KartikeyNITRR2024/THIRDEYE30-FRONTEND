import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GeneratorsContext from "../../../contexts/VideoCreater/Generators/GeneratorsContext";
import { MdArrowBack } from "react-icons/md";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { RiRefreshFill } from "react-icons/ri"; // Import the icon

export default function GeneratorsArea({ onBack }) {
  const { generatorsUrls } = useContext(GeneratorsContext);

  const activeServices = generatorsUrls?.filter((s) => s.active === true).length || 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="microservices-area"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="bg-white bg-opacity-95 rounded-xl p-4 shadow-md mt-6 max-w-full mx-auto"
      >
        {/* Header section remains the same */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition font-medium text-sm md:text-base"
          >
            <MdArrowBack size={18} />
            Back
          </button>

          <div className="bg-gray-200 text-black px-4 py-2 rounded-lg shadow-sm font-medium text-sm md:text-base flex items-center">
            Active: <span className="font-semibold">{activeServices}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {generatorsUrls?.map((checker) => {
            const isDisabled = !checker.active;

            return (
              <button
                key={checker.id}
                disabled={isDisabled}
                onClick={() => !isDisabled && window.open(checker.url, "_blank")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg shadow-sm transition font-medium text-sm md:text-base 
                  ${isDisabled 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
              >
                <span>{checker.type}</span>

                {/* Show Refresh icon if running, otherwise show External Link */}
                {checker.isRunning ? (
                  <RiRefreshFill size={18} className="animate-spin text-gray-500" />
                ) : (
                  <FaExternalLinkSquareAlt size={18} className={isDisabled ? "text-gray-400" : "text-black"} />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}