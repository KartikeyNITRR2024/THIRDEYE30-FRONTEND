import { useState, useMemo, useContext, useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import ThresoldGroupContext from "../../contexts/MarketThresold/ThresoldGroup/ThresoldGroupContext";
import StockContext from "../../contexts/Stock/StockContext";
import PropertyContext from "../../contexts/Property/PropertyContext";
import NotificationContext from "../../contexts/Notification/NotificationContext";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import StockHistory from "./StockHistory";

export default function Stock({ group, onBack }) {
  const { notifyError } = useContext(NotificationContext);
  const { updateGroupStatus, fetchThresoldGroups } =
    useContext(ThresoldGroupContext);
  const { properties } = useContext(PropertyContext);
  const { stocks, fetchStockHistory } = useContext(StockContext);

  const [selectedStocks, setSelectedStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [didInitialSort, setDidInitialSort] = useState(false);
  const [activeStock, setActiveStock] = useState(null);

  useEffect(() => {
    if (!group || !stocks?.length) return;

    if (group.allStocks) {
      setSelectedStocks(stocks.map((s) => s.id));
    } else if (group.stockList) {
      const chunks = group.stockList.match(/.{1,5}/g) || [];
      setSelectedStocks(
        chunks.map((c) => parseInt(c, 10)).filter((n) => !isNaN(n))
      );
    }
    setDidInitialSort(true);
  }, [group, stocks]);

  const filteredStocks = useMemo(() => {
    const list = stocks.filter((s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!didInitialSort) return list;

    return [...list].sort((a, b) => {
      const aSel = selectedStocks.includes(a.id);
      const bSel = selectedStocks.includes(b.id);
      if (aSel && !bSel) return -1;
      if (!aSel && bSel) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [stocks, searchTerm, selectedStocks, didInitialSort]);

  const toggleSelect = (id) => {
    setSelectedStocks((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleStockClick = async (stock) => {
    setActiveStock(stock);
    await fetchStockHistory(stock.id);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
          className="bg-white bg-opacity-95 rounded-xl p-4 shadow-md mt-6"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 rounded-lg mb-4"
          >
            <MdArrowBack size={18} />
            Back
          </button>

          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-64 mb-4"
          />

          <table className="w-full table-auto border-collapse text-sm text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-2 text-left">Stock Name</th>
                <th className="border px-2 py-2">Select</th>
              </tr>
            </thead>

            <tbody>
              {filteredStocks.map((stock) => {
                const valid =
                  stock.price != null &&
                  stock.todaysOpeningPrice != null;

                let percentage = null;
                if (valid) {
                  percentage =
                    ((stock.price - stock.todaysOpeningPrice) * 100) /
                    stock.todaysOpeningPrice;
                }

                return (
                  <tr key={stock.id}>
                    <td
                      className="border px-2 py-2 text-left cursor-pointer"
                      onClick={() => handleStockClick(stock)}
                    >
                      <span>
                        {stock.name} {stock.marketCode}
                      </span>

                      {percentage !== null && (
                        <span
                          className={`ml-2 font-medium inline-flex items-center gap-1 ${
                            percentage >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {percentage >= 0 ? (
                            <GoTriangleUp />
                          ) : (
                            <GoTriangleDown />
                          )}
                          {percentage.toFixed(2)}%
                        </span>
                      )}
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
                );
              })}

              {filteredStocks.length === 0 && (
                <tr>
                  <td colSpan={2} className="border px-2 py-2 text-gray-500">
                    No stocks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </AnimatePresence>

      {activeStock && (
        <StockHistory
          stock={activeStock}
          onClose={() => setActiveStock(null)}
        />
      )}
    </>
  );
}
