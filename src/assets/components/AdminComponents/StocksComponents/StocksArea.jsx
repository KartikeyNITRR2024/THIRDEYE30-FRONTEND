import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StocksContext from "../../../contexts/Admin/Stocks/StocksContext";
import LoadingPage from "../../LoadingComponents/LoadingPage";
import { Search, Upload } from "lucide-react"; // icons

export default function StocksArea() {
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
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Stocks Information
          </h2>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search bar */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 text-gray-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Upload CSV button */}
            <label className="flex items-center gap-2 bg-black text-white text-sm px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-900 transition whitespace-nowrap">
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

            {/* Total count */}
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg whitespace-nowrap">
              Total:{" "}
              <span className="text-black">{filteredStocks?.length || 0}</span>
            </span>
          </div>
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
