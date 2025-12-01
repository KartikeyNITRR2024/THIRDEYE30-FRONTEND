import { useState, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ConfigurationContext from "../../../contexts/Admin/Configuration/ConfigurationContext";
import LoadingPage from "../../LoadingComponents/LoadingPage";
import { Search } from "lucide-react";
import { MdArrowBack } from "react-icons/md";

export default function ConfigurtionArea({ onBack }) {
  const { configData, loading, fetchConfig, updateConfig } =
    useContext(ConfigurationContext);

  const [editableData, setEditableData] = useState({});
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
        cleaned[key] = value;
      } else if (typeof value === "number") {
        cleaned[key] = value;
      } else if (typeof value === "string") {
        const trimmed = value.trim();
        if (!isNaN(trimmed) && trimmed !== "") {
          cleaned[key] = trimmed.includes(".")
            ? parseFloat(trimmed)
            : parseInt(trimmed);
        } else {
          cleaned[key] = trimmed;
        }
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  };

  const handleSubmit = async () => {
    const sanitizedData = sanitizeData(editableData);

    const success = await updateConfig(sanitizedData);

    if (success) {
      fetchConfig(); // refresh after update
    }
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
        {/* Top Section */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-gray-200 text-black 
                                px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 
                                transition font-medium text-sm md:text-base"
          >
            <MdArrowBack size={18} />
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-gray-200 text-black 
                                px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 
                                transition font-medium text-sm md:text-base"
          >
            Submit
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search configuration..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full md:w-64"
          />
        </div>

        {/* Table Section */}
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
      </motion.div>
    </AnimatePresence>
  );
}
