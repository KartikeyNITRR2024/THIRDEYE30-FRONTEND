import { useState, useMemo } from "react";
import { MdArrowBack } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

export default function Stock({ group, onBack }) {
  // Example stock list
  const stockList = [
    { id: 1, name: "AAPL" },
    { id: 2, name: "GOOGL" },
    { id: 3, name: "TSLA" },
    { id: 4, name: "AMZN" },
    { id: 5, name: "MSFT" },
    { id: 6, name: "NFLX" },
  ];

  const [selectedStocks, setSelectedStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter stocks based on search
  const filteredStocks = useMemo(() => {
    return stockList.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Toggle all selections
  const toggleSelectAll = () => {
    if (selectedStocks.length === filteredStocks.length) {
      setSelectedStocks([]);
    } else {
      setSelectedStocks(filteredStocks.map((s) => s.id));
    }
  };

  // Toggle individual stock
  const toggleSelect = (id) => {
    setSelectedStocks((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
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
        {/* Header Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 mb-4">
          {/* Left Group: Back, Select/Deselect, Submit */}
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
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition text-sm md:text-base"
            >
              {selectedStocks.length === filteredStocks.length
                ? "Deselect All"
                : "Select All"}
            </button>

            <button
              onClick={() => alert("Submitted!")}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition text-sm md:text-base"
            >
              Submit
            </button>
          </div>

          {/* Right: Search */}
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full md:w-64"
          />
        </div>

        {/* Stock Table */}
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
