import { useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../../components/NavbarComponents/Navbar";
import FooterNavbar from "../../components/NavbarComponents/FooterNavbar";
import backgroundimage from "../../images/backgroundimage.png";
import MarketThresoldGroups from "../../components/MarketThresoldComponents/MarketThresoldGroups";
import MarketThresoldGroup from "../../components/MarketThresoldComponents/MarketThresoldGroup";
import MarketThresoldContext from "../../contexts/MarketThresold/MarketThresold/MarketThresoldContext";

export default function MarketThresold() {

  const { page, selectedGroup, handleGroupClick, handleBackClick } =
    useContext(MarketThresoldContext);



  const navProperties = {
    showOriginalNavbar: true,
    showBackButton: false,
    backButtonFunction: {},
    showExtraInfo: false,
    infoToShow: null,
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
          {page === "group" ? (
            <motion.div
              key="group"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <MarketThresoldGroups onGroupClick={handleGroupClick} />
            </motion.div>
          ) : (
            <motion.div
              key="single"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <MarketThresoldGroup
                group={selectedGroup}
                onBack={handleBackClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-16 md:hidden">
        <FooterNavbar />
      </div>
    </div>
  );
}
