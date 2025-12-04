import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MicroservicesContext from "../../../contexts/Admin/Microservices/MicroservicesContext";
import { MdArrowBack } from "react-icons/md";
import { FaExternalLinkSquareAlt } from "react-icons/fa";

export default function MicroservicesArea({ onBack }) {
  const { microservicesStatus, statusCheckerUrls } =
    useContext(MicroservicesContext);

  const activeServices =
    microservicesStatus?.filter((s) => s.upInstances === s.totalInstances)
      .length || 0;

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
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 
                               rounded-lg shadow-sm hover:bg-gray-300 transition 
                               font-medium text-sm md:text-base"
          >
            <MdArrowBack size={18} />
            Back
          </button>

          <div
            className="bg-gray-200 text-black px-4 py-2 rounded-lg shadow-sm 
                                  font-medium text-sm md:text-base flex items-center"
          >
            Active: <span className="font-semibold">{activeServices}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {statusCheckerUrls?.map((checker) => (
            <button
              key={checker.id}
              onClick={() => window.open(checker.statusCheckerUrl, "_blank")}
              className="w-full flex items-center justify-between bg-gray-200 text-black 
                 px-4 py-3 rounded-lg shadow-sm hover:bg-gray-300 transition 
                 font-medium text-sm md:text-base"
            >
              <span>{checker.statusCheckerName}</span>

              <FaExternalLinkSquareAlt size={18} className="text-black" />
            </button>
          ))}
        </div>

        {/* ============================
            DESKTOP TABLE VIEW
        ============================ */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="border px-2 py-2 text-left w-1/3">
                  Service Name
                </th>
                <th className="border px-2 py-2 text-center w-1/6">
                  Total Instances
                </th>
                <th className="border px-2 py-2 text-center w-1/6">
                  Up Instances
                </th>
                <th className="border px-2 py-2 text-center w-1/6">Status</th>
              </tr>
            </thead>

            <tbody>
              {microservicesStatus?.map((service) => {
                const isHealthy =
                  service.upInstances === service.totalInstances;

                return (
                  <tr
                    key={service.name}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="border px-2 py-1 text-black font-medium">
                      {service.name}
                    </td>

                    <td className="border px-2 py-1 text-center">
                      {service.totalInstances}
                    </td>

                    <td className="border px-2 py-1 text-center">
                      {service.upInstances}
                    </td>

                    <td className="border px-2 py-1 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          isHealthy
                            ? "bg-gray-300 text-black"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        {isHealthy ? "Healthy" : "Down"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ============================
            MOBILE CARD VIEW
        ============================ */}
        <div className="grid gap-4 md:hidden">
          {microservicesStatus?.map((service) => {
            const isHealthy = service.upInstances === service.totalInstances;

            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="border rounded-lg shadow-sm bg-white p-3"
              >
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-black">
                    {service.name}
                  </span>

                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      isHealthy
                        ? "bg-gray-300 text-black"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {isHealthy ? "Healthy" : "Down"}
                  </span>
                </div>

                <div className="text-sm text-black space-y-1">
                  <p>
                    <span className="font-medium">Total:</span>{" "}
                    {service.totalInstances}
                  </p>
                  <p>
                    <span className="font-medium">Up:</span>{" "}
                    {service.upInstances}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
