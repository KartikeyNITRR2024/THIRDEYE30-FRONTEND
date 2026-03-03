import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdArrowBack } from "react-icons/md";
import { FaLayerGroup } from "react-icons/fa";
import { RiStockFill } from "react-icons/ri";
import PageContext from "../../../contexts/VideoCreater/Page/PageContext";
import StockGroupArea from "./StockGroupArea";
import SingleStockArea from "./SingleStockArea";

export default function StockArea({ onBack }) {
  const { page, updatePage } = useContext(PageContext);

  // Define the menu items
  const stockpageItems = [
    {
      id: 91,
      name: "Stock Group",
      icon: <FaLayerGroup className="text-4xl" />,
    },
    {
      id: 92,
      name: "Stock",
      icon: <RiStockFill className="text-4xl" />,
    },
  ];

  const renderPage = () => {
    switch (page) {
      case 91:
        // Return to page 3 (or whatever ID your StockArea is assigned to)
        return <StockGroupArea onBack={() => updatePage(3)} />;
      case 92:
        return <SingleStockArea onBack={() => updatePage(3)} />;
      default:
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition font-bold text-sm"
              >
                <MdArrowBack size={18} /> BACK
              </button>
              <div className="text-right">
                <h2 className="text-sm font-black text-gray-700 uppercase">Market Assets</h2>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Select Management Mode</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stockpageItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="aspect-square flex flex-col items-center justify-center rounded-2xl shadow-md cursor-pointer transition-all duration-200 bg-white border border-gray-100 hover:shadow-xl hover:border-black"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {updatePage(item.id)}}
                >
                  <div className="mb-3 text-black">{item.icon}</div>
                  <p className="text-xs font-black uppercase text-gray-800 tracking-tighter">
                    {item.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-[400px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}