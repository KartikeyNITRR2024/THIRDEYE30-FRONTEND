import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoCloudUpload } from "react-icons/io5";
import { MdOutlineAudioFile } from "react-icons/md";
import PageContext from "../../../contexts/VideoCreater/Page/PageContext";
import GeneratorsArea from "../../../components/VideoCreaterComponents/GeneratorsComponents/GeneratorsArea";
import { MdArrowBack } from "react-icons/md";
import { MdOutlineVideoSettings } from "react-icons/md";
import { TbBracketsContain, TbBracketsContainStart, TbBracketsContainEnd } from "react-icons/tb";
import { FaHeading } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { IoImagesSharp } from "react-icons/io5";
import { FaNewspaper } from "react-icons/fa6";

export default function VideoEditingArea({ onBack }) {
  const { page, updatePage } = useContext(PageContext);

  const stockpageItems = [
    {
      id: 71,
      name: "Video Setting",
      icon: <MdOutlineVideoSettings className="text-4xl" />,
    },
    {
      id: 72,
      name: "Intro Video",
      icon: <TbBracketsContainStart className="text-4xl" />,
    },
    {
      id: 73,
      name: "Outro Video",
      icon: <TbBracketsContainEnd className="text-4xl" />,
    },
    {
      id: 74,
      name: "Content Video",
      icon: <TbBracketsContain className="text-4xl" />,
    },
    {
      id: 75,
      name: "Header Area",
      icon: <FaHeading className="text-4xl" />,
    },
    {
      id: 76,
      name: "Graph Area",
      icon: <VscGraph className="text-4xl" />,
    },
    {
      id: 77,
      name: "News Image Area",
      icon: <IoImagesSharp className="text-4xl" />,
    },
    {
      id: 78,
      name: "News Area",
      icon: <FaNewspaper className="text-4xl" />,
    },
  ];

  const renderPage = () => {
    switch (page) {
      case 81:
        return <GeneratorsArea onBack={() => updatePage(null)} />;
      case 82:
        return <GeneratorsArea onBack={() => updatePage(null)} />;
      case 83:
        return <GeneratorsArea onBack={() => updatePage(null)} />;
      case 84:
        return <GeneratorsArea onBack={() => updatePage(null)} />;
      case 85:
        return <GeneratorsArea onBack={() => updatePage(null)} />;
      case 86:
        return <GeneratorsArea onBack={() => updatePage(null)} />;
      case 87:
        return <GeneratorsArea onBack={() => updatePage(null)} />;
      case 88:
        return <GeneratorsArea onBack={() => updatePage(null)} />;
      default:
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition font-medium text-sm md:text-base"
              >
                <MdArrowBack size={18} />
                Back
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stockpageItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="aspect-square flex flex-col items-center justify-center rounded-2xl shadow-md cursor-pointer transition-all duration-200 bg-white hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updatePage(item.id)}
                >
                  <div className="mb-2">{item.icon}</div>
                  <p className="text-lg font-semibold text-gray-800">
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
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={page || "grid"}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
