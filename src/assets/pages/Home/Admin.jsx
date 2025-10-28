import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../../components/NavbarComponents/Navbar";
import FooterNavbar from "../../components/NavbarComponents/FooterNavbar";
import backgroundimage from "../../images/backgroundimage.png";

import { PiComputerTowerBold } from "react-icons/pi";
import { GrDocumentConfig, GrUserSettings } from "react-icons/gr";
import { RiStockLine } from "react-icons/ri";

import MicroservicesArea from "../../components/AdminComponents/MicroservicesComponents/MicroservicesArea";
import ConfigurtionArea from "../../components/AdminComponents/ConfigurationComponents/ConfigurationArea";
import UserArea from "../../components/AdminComponents/UsersComponents/UsersArea";
import StocksArea from "../../components/AdminComponents/StocksComponents/StocksArea";

import PageContext from "../../contexts/Admin/Page/PageContext";

export default function Admin() {
  const { page, updatePage } = useContext(PageContext);

  const adminItems = [
    { id: 1, name: "Microservices", icon: <PiComputerTowerBold className="text-4xl" /> },
    { id: 2, name: "Configuration", icon: <GrDocumentConfig className="text-4xl" /> },
    { id: 3, name: "Users", icon: <GrUserSettings className="text-4xl" /> },
    { id: 4, name: "Stocks", icon: <RiStockLine className="text-4xl" /> },
  ];

  const navProperties = {
    showOriginalNavbar: true,
    showBackButton: page !== null,
    backButtonFunction: () => updatePage(null),
    showExtraInfo: false,
    infoToShow: null,
  };

  const renderPage = () => {
    switch (page) {
      case 1:
        return <MicroservicesArea />;
      case 2:
        return <ConfigurtionArea />;
      case 3:
        return <UserArea />;
      case 4:
        return <StocksArea />;
      default:
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {adminItems.map((item) => (
              <motion.div
                key={item.id}
                className="aspect-square flex flex-col items-center justify-center rounded-2xl shadow-md cursor-pointer transition-all duration-200 bg-white hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updatePage(item.id)}
              >
                <div className="mb-2">{item.icon}</div>
                <p className="text-lg font-semibold text-gray-800">{item.name}</p>
              </motion.div>
            ))}
          </div>
        );
    }
  };

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 h-16 z-10">
        <Navbar navProperties={navProperties} />
      </div>

      <div
        className="mt-16 h-[calc(100vh-4rem-4rem)] md:h-[calc(100vh-4rem)] overflow-y-auto bg-cover bg-center p-4"
        style={{ backgroundImage: `url(${backgroundimage})` }}
      >
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

      <div className="fixed bottom-0 left-0 right-0 h-16 md:hidden">
        <FooterNavbar />
      </div>
    </div>
  );
}
