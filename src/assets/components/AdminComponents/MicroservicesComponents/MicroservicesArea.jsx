import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MicroservicesContext from "../../../contexts/Admin/Microservices/MicroservicesContext";
import LoadingPage from "../../LoadingComponents/LoadingPage";

export default function MicroservicesArea({ onBack }) {
  const { microservicesStatus, loading } = useContext(MicroservicesContext);

  if (loading) return <LoadingPage />;

  const activeServices =
    microservicesStatus?.filter(
      (s) => s.upInstances === s.totalInstances
    ).length || 0;

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
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Microservices Status
          </h2>

          <div className="text-sm md:text-base text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
            Active:{" "}
            <span className="font-semibold text-green-600">
              {activeServices}
            </span>
          </div>
        </div>

        {/* ✅ TABLE VIEW (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
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
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="border px-2 py-1 font-medium text-gray-800">
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
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
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

        {/* ✅ CARD VIEW (Mobile) */}
        <div className="grid gap-4 md:hidden">
          {microservicesStatus?.map((service) => {
            const isHealthy =
              service.upInstances === service.totalInstances;

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
                  <span className="font-semibold text-gray-800">
                    {service.name}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      isHealthy
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isHealthy ? "Healthy" : "Down"}
                  </span>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
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
