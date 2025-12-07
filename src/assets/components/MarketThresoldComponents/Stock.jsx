import { useState, useMemo, useContext, useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import ThresoldGroupContext from "../../contexts/MarketThresold/ThresoldGroup/ThresoldGroupContext";
import StockContext from "../../contexts/Stock/StockContext";
import PropertyContext from "../../contexts/Property/PropertyContext";
import NotificationContext from "../../contexts/Notification/NotificationContext";

export default function Stock({ group, onBack }) {
  const { notifyError } = useContext(NotificationContext);
  const { updateGroupStatus, fetchThresoldGroups } = useContext(ThresoldGroupContext);
  const { properties } = useContext(PropertyContext);
  const { stocks } = useContext(StockContext);

  const [selectedStocks, setSelectedStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [didInitialSort, setDidInitialSort] = useState(false);

  useEffect(() => {
    if (!group || !stocks?.length) return;

    if (group.allStocks) {
      setSelectedStocks(stocks.map((s) => s.id));
    } else if (group.stockList) {
      const chunkSize = 5;
      const chunks = group.stockList.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
      const ids = chunks.map((chunk) => parseInt(chunk, 10)).filter((n) => !isNaN(n));
      setSelectedStocks(ids);
    }

    setDidInitialSort(true);
  }, [group, stocks]);

  const filteredStocks = useMemo(() => {
    const list = stocks.filter((s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!didInitialSort) return list;

    const selectedFirst = [...list].sort((a, b) => {
      const aSel = selectedStocks.includes(a.id);
      const bSel = selectedStocks.includes(b.id);
      if (aSel && !bSel) return -1;
      if (!aSel && bSel) return 1;
      return a.name.localeCompare(b.name);
    });

    return selectedFirst;
  }, [stocks, searchTerm, selectedStocks, didInitialSort]);

  const toggleSelect = (id) => {
    setSelectedStocks((prev) => {
      const isSelected = prev.includes(id);

      if (!isSelected) {
        if (properties?.SELECT_ALL_STOCKS === 0) {
          const max = properties.MAXIMUM_NO_OF_STOCK_PER_GROUP;
          if (prev.length >= max) {
            notifyError(`You can select maximum ${max} stocks.`);
            return prev;
          }
        }
        return [...prev, id];
      } else {
        return prev.filter((s) => s !== id);
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedStocks.length === filteredStocks.length) {
      setSelectedStocks([]);
      return;
    }

    if (properties?.SELECT_ALL_STOCKS === 1) {
      setSelectedStocks(filteredStocks.map((s) => s.id));
      return;
    }

    const limit = properties.MAXIMUM_NO_OF_STOCK_PER_GROUP;
    if (filteredStocks.length > limit) {
      notifyError(`You can select maximum ${limit} stocks.`);
      setSelectedStocks(filteredStocks.slice(0, limit).map((s) => s.id));
      return;
    }

    setSelectedStocks(filteredStocks.map((s) => s.id));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const allSelected = selectedStocks.length === stocks.length;

    const stockIdsString = selectedStocks
      .sort((a, b) => a - b)
      .map((id) => id.toString().padStart(5, "0"))
      .join("");

    await updateGroupStatus(group.id, undefined, allSelected, allSelected ? "" : stockIdsString);
    await fetchThresoldGroups();

    if (group) {
      group.allStocks = allSelected;
      group.stockList = allSelected ? "" : stockIdsString;
    }

    setSubmitting(false);
  };

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
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition"
          >
            <MdArrowBack size={18} />
            Back
          </button>

          {properties?.SELECT_ALL_STOCKS === 1 && (
            <button
              onClick={toggleSelectAll}
              disabled={submitting}
              className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition"
            >
              {selectedStocks.length === filteredStocks.length ? "Deselect All" : "Select All"}
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>

          {properties?.SELECT_ALL_STOCKS === 0 ? ( 
            <div className="bg-gray-200 text-black px-4 py-2 rounded-lg shadow-sm font-medium text-sm md:text-base flex items-center">
              {selectedStocks.length} / {properties.MAXIMUM_NO_OF_STOCK_PER_GROUP} selected
            </div>
          ) : (
            <div className="bg-gray-200 text-black px-4 py-2 rounded-lg shadow-sm font-medium text-sm md:text-base flex items-center">
              {selectedStocks.length} selected
            </div>
          )}

        </div>

        <input
          type="text"
          placeholder="Search stocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-2 py-1 text-sm w-full md:w-64 mb-4"
        />

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-2 text-left">Stock Name</th>
                <th className="border px-2 py-2">Select</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => (
                <tr key={stock.id}>
                  <td className="border px-2 py-2 text-left">
                    {stock.name + " " + stock.marketCode}
                  </td>
                  <td className="border px-2 py-2">
                    <input
                      type="checkbox"
                      checked={selectedStocks.includes(stock.id)}
                      onChange={() => toggleSelect(stock.id)}
                      className="w-5 h-5 cursor-pointer appearance-none border border-black rounded-sm checked:bg-black"
                    />
                  </td>
                </tr>
              ))}

              {filteredStocks.length === 0 && (
                <tr>
                  <td colSpan={2} className="border px-2 py-2 text-gray-500">
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
