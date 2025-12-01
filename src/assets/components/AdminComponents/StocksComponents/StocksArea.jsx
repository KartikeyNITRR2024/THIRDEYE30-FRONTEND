import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StocksContext from "../../../contexts/Admin/Stocks/StocksContext";
import LoadingPage from "../../LoadingComponents/LoadingPage";
import { Search, Upload } from "lucide-react";
import { MdArrowBack } from "react-icons/md"; // icons

export default function StocksArea({ onBack }) {
  const { stocks, loading, fetchStocks, uploadStocksCSV, uploading } =
    useContext(StocksContext);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!stocks || stocks.length === 0) {
      fetchStocks();
    }
  }, []);

  if (loading) return <LoadingPage />;

  // 🔹 Filter logic
  const filteredStocks = stocks?.filter((stock) =>
    Object.values(stock).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // 🔹 Handle CSV upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadStocksCSV(file);
      e.target.value = ""; // reset input
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="stocks-area"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="bg-white bg-opacity-95 rounded-xl p-4 shadow-md mt-6 max-w-full mx-auto"
      >

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

          <label className="flex items-center gap-2 bg-gray-200 text-black 
                            px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 
                            transition font-medium text-sm md:text-base">
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload CSV"}
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
          </label>

           <div
            className="bg-gray-200 text-black px-4 py-2 rounded-lg shadow-sm 
                                  font-medium text-sm md:text-base flex items-center"
          >
            Total:{" "} <span className="font-semibold">{filteredStocks?.length || 0}</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded px-2 py-1 text-sm w-full md:w-64"
              />
        </div>

        {/* Table / Responsive Grid */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm md:text-base">
            {/* Table Header for Desktop */}
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-100 text-gray-700">
                {filteredStocks.length > 0 &&
                  Object.keys(filteredStocks[0]).map((key) => (
                    <th
                      key={key}
                      className="border px-2 py-2 text-left capitalize"
                    >
                      {key.replace(/_/g, " ")}
                    </th>
                  ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="grid md:table-row-group gap-4">
              <AnimatePresence>
                {filteredStocks?.map((stock, idx) => (
                  <motion.tr
                    key={idx}
                    className="grid grid-cols-1 md:table-row border md:border-none rounded-lg md:rounded-none bg-white md:bg-transparent p-2 md:p-0 shadow-sm md:shadow-none"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {Object.entries(stock).map(([key, value]) => (
                      <td
                        key={key}
                        className="border md:border px-2 py-1 text-gray-800 text-sm break-words"
                      >
                        <span className="font-medium md:hidden block text-gray-600">
                          {key.replace(/_/g, " ")}:
                        </span>
                        {String(value ?? "-")}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* No Results */}
        {!filteredStocks?.length && (
          <div className="text-center text-gray-500 mt-4">
            No matching stocks found.
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
