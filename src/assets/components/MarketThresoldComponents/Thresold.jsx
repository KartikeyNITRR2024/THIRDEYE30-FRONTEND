import { useState, useEffect, useContext } from "react";
import { MdArrowBack, MdDelete, MdAdd } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import PropertyContext from "../../contexts/Property/PropertyContext";
import ThresoldContext from "../../contexts/MarketThresold/Thresold/ThresoldContext";
import LoadingPage from "../LoadingComponents/LoadingPage";
import NotificationContext from "../../contexts/Notification/NotificationContext";
import AuthContext from "../../contexts/Auth/AuthContext";

export default function Thresold({ group, onBack }) {
  const { userDetails } = useContext(AuthContext);
  const { notifyError } = useContext(NotificationContext);
  const { properties } = useContext(PropertyContext);
  const { thresholds, loading, fetchThresholds, addThreshold, deleteThreshold } =
    useContext(ThresoldContext);

  const [newThreshold, setNewThreshold] = useState({
    gapSeconds: "",
    priceGap: "",
    type: "",
  });

  useEffect(() => {
    if (group?.id) fetchThresholds(group.id);
  }, [group?.id]);

  const handleAddNew = () => {
    if (newThreshold.gapSeconds === "") {
      notifyError("Please select gap.");
      return;
    }

    if (newThreshold.type === "") {
      notifyError("Please select type.");
      return;
    }

    if (newThreshold.priceGap === "") {
      notifyError("Price gap is required.");
      return;
    }

    const price = Number(newThreshold.priceGap);

    if (!userDetails.roles.includes("ROLE_ADMIN") && properties.IS_ZERO_ALLOWED == 2 && price === 0) {
      notifyError("Price gap cannot be zero.");
      return;
    }

    if (properties.IS_ZERO_ALLOWED == 0 && price === 0) {
      notifyError("Price gap cannot be zero.");
      return;
    }



    addThreshold(group.id, {
      priceGap: price,
      timeGapInSeconds: Number(newThreshold.gapSeconds),
      type: Number(newThreshold.type),
    });

    setNewThreshold({
      gapSeconds: "",
      priceGap: "",
      type: "",
    });
  };

  const handleDelete = (thresholdId) => {
    deleteThreshold(thresholdId, group.id);
  };

  const reachedMax =
    thresholds.length >= properties.MAXIMUM_NO_OF_THRESOLD_PER_GROUP;

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

          <div className="bg-gray-200 text-black px-4 py-2 rounded-lg shadow-sm 
                          font-medium text-sm md:text-base flex items-center"
          >
            {thresholds.length} / {properties.MAXIMUM_NO_OF_THRESOLD_PER_GROUP} created
          </div>
        </div>

        {loading ? (
          <LoadingPage />
        ) : (
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
                          value={t.timeGapInSeconds}
                          readOnly
                          className="w-full text-center border rounded px-2 py-1 bg-gray-100"
                        />
                      </td>

                      <td className="border px-2 py-2">
                        <input
                          type="number"
                          value={t.priceGap}
                          readOnly
                          className="w-full text-center border rounded px-2 py-1 bg-gray-100"
                        />
                      </td>

                      <td className="border px-2 py-2">
                        <input
                          type="text"
                          value={t.type == 0 ? "Percent" : "Price"}
                          readOnly
                          className="w-full text-center border rounded px-2 py-1 bg-gray-100"
                        />
                      </td>

                      <td className="border px-2 py-2">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-black hover:text-gray-700"
                        >
                          <MdDelete size={20} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}

                  {!reachedMax && (
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
                          className="w-full border rounded px-2 py-1 text-center appearance-none"
                        >
                          <option value="">Select Gap</option>
                          {properties.TIME_GAP_LIST_FOR_THRESOLD_IN_SECONDS.map((opt) => (
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
                          className="w-full text-center border rounded px-2 py-1"
                        />
                      </td>

                      <td className="border px-2 py-2">
                        <select
                          value={newThreshold.type}
                          onChange={(e) =>
                            setNewThreshold({ ...newThreshold, type: e.target.value })
                          }
                          className="w-full border rounded px-2 py-1 text-center appearance-none"
                        >
                          <option value="">Select Type</option>
                          <option value={0}>Percent</option>
                          <option value={1}>Price</option>
                        </select>
                      </td>

                      <td className="border px-2 py-2">
                        <button
                          onClick={handleAddNew}
                          className="flex items-center justify-center text-black hover:text-gray-700 transition mx-auto"
                        >
                          <MdAdd size={24} />
                        </button>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
