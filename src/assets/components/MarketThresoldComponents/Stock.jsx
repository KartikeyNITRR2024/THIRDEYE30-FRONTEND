import { useState, useMemo, useContext, useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import ThresoldGroupContext from "../../contexts/MarketThresold/ThresoldGroup/ThresoldGroupContext";
import StockContext from "../../contexts/Stock/StockContext";

export default function Stock({ group, onBack }) {
  const { updateGroupStatus, fetchThresoldGroups } = useContext(ThresoldGroupContext);
  const { stocks, loading } = useContext(StockContext);

  const [selectedStocks, setSelectedStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ✅ Autofill selected stocks when data loads
  useEffect(() => {
    if (!group || !stocks || stocks.length === 0) return;

    console.log("📦 Group from backend:", group);

    if (group.allStocks) {
      setSelectedStocks(stocks.map((s) => s.id));
      console.log("✅ Auto-selected ALL stocks");
    } else if (group.stockList && group.stockList.length > 0) {
      // Example: "0000100002000003"
      const chunkSize = 5;
      const chunks = group.stockList.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
      const ids = chunks.map((chunk) => parseInt(chunk, 10)).filter((num) => !isNaN(num));

      console.log("🧩 Parsed stock IDs:", ids);

      const stockIds = stocks.map((s) => s.id);
      const normalizedIds = ids.filter(
        (id) => stockIds.includes(id) || stockIds.includes(id.toString())
      );

      console.log("✅ Valid matched stock IDs:", normalizedIds);
      setSelectedStocks(normalizedIds);
    } else {
      setSelectedStocks([]);
    }
  }, [group, stocks]);

  // 🔍 Filter by name
  const filteredStocks = useMemo(() => {
    return stocks.filter((s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stocks, searchTerm]);

  // ✅ Select / Deselect all
  const toggleSelectAll = () => {
    if (selectedStocks.length === filteredStocks.length) {
      setSelectedStocks([]);
    } else {
      setSelectedStocks(filteredStocks.map((s) => s.id));
    }
  };

  // ✅ Toggle one
  const toggleSelect = (id) => {
    setSelectedStocks((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // ✅ Save changes
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const allSelected = selectedStocks.length === stocks.length;
    const stockIdsString = selectedStocks
      .sort((a, b) => Number(a) - Number(b))
      .map((id) => id.toString().padStart(5, "0"))
      .join("");

    console.log("🚀 Submitting payload:", {
      allSelected,
      stockIdsString,
    });

    await updateGroupStatus(
      group.id,
      undefined,
      allSelected,
      allSelected ? "" : stockIdsString
    );

    // ✅ Refresh the local group list in context
    await fetchThresoldGroups();

    // ✅ Update the current group object immediately in memory
    if (group) {
      group.allStocks = allSelected;
      group.stockList = allSelected ? "" : stockIdsString;
    }

    console.log("✅ Group updated locally & remotely");
    setSubmitting(false);
  };

  if (loading) return <p className="text-center mt-6">Loading stocks...</p>;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="stock-table"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="bg-white bg-opacity-95 rounded-xl p-4 shadow-md mt-6 max-w-full mx-auto"
      >
        {/* ---------------- Header Controls ---------------- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition text-sm md:text-base"
            >
              <MdArrowBack size={20} />
              Back
            </button>

            <button
              onClick={toggleSelectAll}
              disabled={submitting}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition text-sm md:text-base"
            >
              {selectedStocks.length === filteredStocks.length
                ? "Deselect All"
                : "Select All"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`px-3 py-1 rounded transition text-sm md:text-base ${
                submitting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full md:w-64"
          />
        </div>

        {/* ---------------- Stock Table ---------------- */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-center text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-2 text-left">Stock Name</th>
                <th className="border px-2 py-2">Select</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => (
                <tr key={stock.id}>
                  <td className="border px-2 py-2 text-left">{stock.name}</td>
                  <td className="border px-2 py-2">
                    <input
                      type="checkbox"
                      checked={selectedStocks.includes(stock.id)}
                      onChange={() => toggleSelect(stock.id)}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}

              {filteredStocks.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="border px-2 py-2 text-center text-gray-500"
                  >
                    No stocks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
