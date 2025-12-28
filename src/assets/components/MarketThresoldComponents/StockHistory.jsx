import { useContext, useState, useMemo } from "react";
import StockContext from "../../contexts/Stock/StockContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StockHistory({ stock, onClose }) {
  const { stockHistory, clearStockHistory } = useContext(StockContext);
  const [view, setView] = useState("table");

  const close = () => {
    clearStockHistory();
    onClose();
  };

  // latest first for UI
  const reversedData = useMemo(
    () => [...stockHistory].reverse(),
    [stockHistory]
  );

  // -------- AUTO Y-AXIS CALCULATION --------
  const { yMin, yMax } = useMemo(() => {
    if (stockHistory.length === 0) {
      return { yMin: 0, yMax: 0 };
    }

    const prices = stockHistory.map((h) => h.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    const range = max - min || min * 0.01;

    // dynamic step based on volatility
    let step;
    if (range < 10) step = 5;
    else if (range < 50) step = 10;
    else if (range < 200) step = 20;
    else step = 50;

    const yMin = Math.floor(min / step) * step;
    const yMax = Math.ceil(max / step) * step;

    return { yMin, yMax };
  }, [stockHistory]);

  // ---------------------------------------

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        onClick={close}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl p-6 max-w-3xl w-full"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {stock.name} History
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => setView("table")}
                className={`px-3 py-1 rounded ${
                  view === "table" ? "bg-gray-300" : "bg-gray-200"
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setView("graph")}
                className={`px-3 py-1 rounded ${
                  view === "graph" ? "bg-gray-300" : "bg-gray-200"
                }`}
              >
                Graph
              </button>
            </div>
          </div>

          {/* TABLE VIEW */}
          {view === "table" && (
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-2">Time</th>
                    <th className="border px-2 py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {reversedData.map((h, i) => (
                    <tr key={i}>
                      <td className="border px-2 py-1">
                        {h.currentTime.substring(11, 19)}
                      </td>
                      <td className="border px-2 py-1 font-medium">
                        ₹{h.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* GRAPH VIEW */}
          {view === "graph" && (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reversedData}>
                  <XAxis
                    dataKey="currentTime"
                    tickFormatter={(v) => v.substring(11, 16)}
                  />

                  <YAxis
                    domain={[yMin, yMax]}
                    tickCount={6}
                  />

                  <Tooltip
                    labelFormatter={(v) => v.substring(11, 19)}
                    formatter={(v) => [`₹${v}`, "Price"]}
                  />

                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#000000"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <button
            onClick={close}
            className="mt-4 px-4 py-2 bg-gray-200 rounded"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
