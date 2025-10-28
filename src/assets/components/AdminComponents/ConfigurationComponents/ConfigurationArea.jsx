import { useState, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ConfigurationContext from "../../../contexts/Admin/Configuration/ConfigurationContext";
import LoadingPage from "../../LoadingComponents/LoadingPage";
import { Search } from "lucide-react";

export default function ConfigurtionArea({ onBack }) {
  const { configData, loading, fetchConfig, updateConfig } =
    useContext(ConfigurationContext);

  const [editableData, setEditableData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setEditableData(configData);
  }, [configData]);

  const handleChange = (key, value) => {
    setEditableData({ ...editableData, [key]: value });
  };

  const sanitizeData = (data) => {
    const cleaned = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === "" || value === null || value === undefined) {
        cleaned[key] = value; // keep empty or null as-is
      } 
      else if (typeof value === "number") {
        cleaned[key] = value; // already a number
      } 
      else if (typeof value === "string") {
        const trimmed = value.trim();
        // if it's numeric string like "123" or "3.14"
        if (!isNaN(trimmed) && trimmed !== "") {
          cleaned[key] = trimmed.includes(".") ? parseFloat(trimmed) : parseInt(trimmed);
        } else {
          cleaned[key] = trimmed; // keep as string
        }
      } 
      else {
        cleaned[key] = value; // for booleans or others
      }
    }
    return cleaned;
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const sanitizedData = sanitizeData(editableData);
    const success = await updateConfig(password, sanitizedData);

    if (success) {
      setModalOpen(false);
      setPassword("");
      fetchConfig();
    }

    setSubmitting(false);
  };

  if (loading) return <LoadingPage />;

  const filteredKeys = Object.keys(editableData).filter((key) =>
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="config-area"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="bg-white bg-opacity-95 rounded-xl p-4 shadow-md mt-6 max-w-full mx-auto"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
          {/* Header (Left) */}
          <h2 className="text-lg font-semibold text-gray-800">
            Configurations
          </h2>

          {/* Search + Submit (Right) */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            {/* Search bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search configuration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-black text-white hover:bg-gray-900 transition text-sm sm:text-base"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm md:text-base">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-100">
                <th className="border px-2 py-2 text-left">Configuration</th>
                <th className="border px-2 py-2 text-left">Value</th>
              </tr>
            </thead>

            <tbody className="grid md:table-row-group gap-4">
              <AnimatePresence>
                {filteredKeys.map((key) => (
                  <motion.tr
                    key={key}
                    className="grid grid-cols-1 md:grid-cols-2 border md:border-none rounded-lg md:rounded-none bg-white md:bg-transparent p-2 md:p-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="border md:border-none px-2 py-1 font-medium bg-gray-50 md:bg-transparent">
                      {key}
                    </td>
                    <td className="border md:border-none px-2 py-1">
                      <input
                        type="text"
                        value={editableData[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full text-center border rounded px-2 py-1 md:border md:px-2 md:py-1"
                      />
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Password Modal */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg w-80"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <h3 className="text-lg font-semibold mb-4">
                  Enter Password to Submit
                </h3>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`px-3 py-1 rounded-lg text-white ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-900"
                    }`}
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
