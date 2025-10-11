import { useState } from "react";
import { MdArrowBack, MdDelete, MdAdd } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

export default function Thresold({ group, onBack }) {
  const [thresholds, setThresholds] = useState([
    { id: 1, gapSeconds: 10, priceGap: 100, type: 0 },
    { id: 2, gapSeconds: 20, priceGap: 200, type: 1 },
  ]);

  const [newThreshold, setNewThreshold] = useState({
    gapSeconds: 10,
    priceGap: "",
    type: 0,
  });

  const timeOptions = [10, 20, 30, 60, 120]; // Gap dropdown options
  const typeOptions = [0, 1]; // Type options

  const handleAddNew = () => {
    if (newThreshold.gapSeconds === "" || newThreshold.priceGap === "") return;

    const newId = thresholds.length
      ? Math.max(...thresholds.map((t) => t.id)) + 1
      : 1;

    setThresholds([
      ...thresholds,
      {
        id: newId,
        gapSeconds: Number(newThreshold.gapSeconds),
        priceGap: Number(newThreshold.priceGap),
        type: Number(newThreshold.type),
      },
    ]);

    setNewThreshold({ gapSeconds: 10, priceGap: "", type: 0 });
  };

  const deleteThreshold = (id) => {
    setThresholds((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="threshold-table"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="bg-white bg-opacity-95 rounded-xl p-4 shadow-md mt-6 max-w-full mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition text-sm md:text-base"
          >
            <MdArrowBack size={20} />
            Back
          </button>
          <div className="w-10"></div>
        </div>

        {/* Threshold Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-center text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-2">Gap (seconds)</th>
                <th className="border px-2 py-2">Price Gap</th>
                <th className="border px-2 py-2 min-w-[80px]">Type</th>
                <th className="border px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {/* Existing thresholds - read-only except delete */}
                {thresholds.map((t) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="border px-2 py-2">
                      <input
                        type="number"
                        value={t.gapSeconds}
                        readOnly
                        className="w-full text-center border rounded px-1 py-1 bg-gray-100"
                      />
                    </td>
                    <td className="border px-2 py-2">
                      <input
                        type="number"
                        value={t.priceGap}
                        readOnly
                        className="w-full text-center border rounded px-1 py-1 bg-gray-100"
                      />
                    </td>
                    <td className="border px-2 py-2">
                      <input
                        type="text"
                        value={t.type}
                        readOnly
                        className="w-full text-center border rounded px-2 py-1 bg-gray-100"
                      />
                    </td>
                    <td className="border px-2 py-2">
                      <button
                        onClick={() => deleteThreshold(t.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </motion.tr>
                ))}

                {/* Empty row for new threshold */}
                <motion.tr
                  key="new-threshold"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="border px-2 py-2">
                    <select
                      value={newThreshold.gapSeconds}
                      onChange={(e) =>
                        setNewThreshold({ ...newThreshold, gapSeconds: e.target.value })
                      }
                      className="w-full border rounded px-1 py-1 text-center"
                    >
                      {[10, 20, 30, 60, 120].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-2 py-2">
                    <input
                      type="number"
                      placeholder="Price Gap"
                      value={newThreshold.priceGap}
                      onChange={(e) =>
                        setNewThreshold({ ...newThreshold, priceGap: e.target.value })
                      }
                      className="w-full text-center border rounded px-1 py-1"
                    />
                  </td>
                  <td className="border px-2 py-2">
                    <select
                      value={newThreshold.type}
                      onChange={(e) =>
                        setNewThreshold({ ...newThreshold, type: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1 text-center"
                    >
                      {[0, 1].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-2 py-2">
                    <button
                      onClick={handleAddNew}
                      className="flex items-center justify-center text-blue-500 transition mx-auto"
                    >
                      <MdAdd size={24} />
                    </button>
                  </td>
                </motion.tr>
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
