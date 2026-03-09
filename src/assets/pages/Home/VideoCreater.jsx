import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../../components/NavbarComponents/Navbar";
import FooterNavbar from "../../components/NavbarComponents/FooterNavbar";
import backgroundimage from "../../images/backgroundimage.png";
import { SiKaggle } from "react-icons/si";
import { IoCloudUpload } from "react-icons/io5";
import { MdOutlineAudioFile } from "react-icons/md";
import { MdOutlineVideoSettings } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { FaNewspaper } from "react-icons/fa6";
import { RiStockFill } from "react-icons/ri";
import { MdVideoFile } from "react-icons/md";
import { MdVideoCall } from "react-icons/md";
import { RiAdvertisementFill } from "react-icons/ri";
import { RiFileWordFill } from "react-icons/ri";
import { FaTelegramPlane } from "react-icons/fa";
import VideoEditingArea from "../../components/VideoCreaterComponents/VideoEditingComponents/VideoEditingArea";
import GeneratorsArea from "../../components/VideoCreaterComponents/GeneratorsComponents/GeneratorsArea";
import AudioGenerateArea from "../../components/VideoCreaterComponents/AudioGenerateComponents/AudioGenerateArea";
import StockArea from "../../components/VideoCreaterComponents/StockComponents/StockArea";
import VideoArea from "../../components/VideoCreaterComponents/VideoComponents/VideoArea";
import CurrentVideoArea from "../../components/VideoCreaterComponents/CurrentVideoComponents/CurrentVideoArea";
import VideoDetailsArea from "../../components/VideoCreaterComponents/VideoDetailsComponents/VideoDetailsArea";
import NewsArea from "../../components/VideoCreaterComponents/NewsComponents/NewsArea";
import PageContext from "../../contexts/VideoCreater/Page/PageContext";
import StockGroupArea from "../../components/VideoCreaterComponents/StockComponents/StockGroupArea";
import SingleStockArea from "../../components/VideoCreaterComponents/StockComponents/SingleStockArea";
import MultiMediaArea from "../../components/VideoCreaterComponents/MultiMediaComponents/MultiMediaArea";
import VideoSettingArea from "../../components/VideoCreaterComponents/VideoSettingComponents/VideoSettingArea";
import IntroVideoArea from "../../components/VideoCreaterComponents/IntroVideoComponents/IntroVideoArea";
import OutroVideoArea from "../../components/VideoCreaterComponents/OutroVideoComponents/OutroVideoArea";
import ContentVideoArea from "../../components/VideoCreaterComponents/ContentVideoComponents/ContentVideoArea";
import HeaderArea from "../../components/VideoCreaterComponents/HeaderComponents/HeaderArea";
import StockRaceArea from "../../components/VideoCreaterComponents/StockRaceComponents/StockRaceArea";
import NewsImageArea from "../../components/VideoCreaterComponents/NewsImageComponents/NewsImageArea";
import NewsTextSoundArea from "../../components/VideoCreaterComponents/NewsTextSoundComponents/NewsTextSoundArea";
import TelegramBotArea from "../../components/VideoCreaterComponents/TelegramBotComponents/TelegramBotArea"; 
import PromptArea from "../../components/VideoCreaterComponents/PromtComponents/PromtArea";
import TtsSoundArea from "../../components/VideoCreaterComponents/TtsSoundComponents/TtsSoundArea";
import AdvertisementArea from "../../components/VideoCreaterComponents/AdvertisementComponents/AdvertisementArea";
import AdvertisementGroupArea from "../../components/VideoCreaterComponents/AdvertisementComponents/AdvertisementGroupArea";
import ContentAdvertisementArea from "../../components/VideoCreaterComponents/AdvertisementComponents/ContentAdvertisementArea";

export default function VideoCreater() {
  const { page, updatePage } = useContext(PageContext);
  const adminItems = [
    {
      id: 1,
      name: "Multimedia",
      icon: <IoCloudUpload className="text-4xl" />,
    },
    {
      id: 2,
      name: "Audio Creater",
      icon: <MdOutlineAudioFile className="text-4xl" />,
    },
    {
      id: 3,
      name: "New Video",
      icon: <MdVideoCall className="text-4xl" />,
    },
    {
      id: 4,
      name: "Set Current Video",
      icon: <IoVideocam className="text-4xl" />,
    },
    {
      id: 5,
      name: "Video Details",
      icon: <MdVideoFile className="text-4xl" />,
    },
    { id: 6, name: "News Creater", icon: <FaNewspaper className="text-4xl" /> },
    {
      id: 7,
      name: "Video Editing",
      icon: <MdOutlineVideoSettings className="text-4xl" />,
    },
    { id: 8, name: "Generators Urls", icon: <SiKaggle className="text-4xl" /> },
    { id: 9, name: "Stock Group", icon: <RiStockFill className="text-4xl" /> },
    { id: 10, name: "Advertisement", icon: <RiAdvertisementFill className="text-4xl" /> },
    { id: 11, name: "Promt", icon: <RiFileWordFill className="text-4xl" /> },
    { id: 12, name: "Telegram Bots", icon: <FaTelegramPlane className="text-4xl" /> },
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
        return <MultiMediaArea onBack={() => updatePage(null)} />;
      case 2:
        return <AudioGenerateArea onBack={() => updatePage(null)} />;
      case 3:
        return <VideoArea onBack={() => updatePage(null)} />;
      case 4:
        return <CurrentVideoArea onBack={() => updatePage(null)} />;
      case 5:
        return <VideoDetailsArea onBack={() => updatePage(null)} />;
      case 6:
        return <NewsArea onBack={() => updatePage(null)} />;
      case 7:
        return <VideoEditingArea onBack={() => updatePage(null)} />;
      case 8:
        return <GeneratorsArea onBack={() => updatePage(null)} />;
      case 9:
        return <StockArea onBack={() => updatePage(null)} />;
      case 10:
        return <AdvertisementArea onBack={() => updatePage(null)} />;
      case 11:
        return <PromptArea onBack={() => updatePage(null)} />;
      case 12:
        return <TelegramBotArea onBack={() => updatePage(null)} />;
      case 71:
        return <VideoSettingArea onBack={() => updatePage(7)} />;
      case 72:
        return <IntroVideoArea onBack={() => updatePage(7)} />;
      case 73:
        return <OutroVideoArea onBack={() => updatePage(7)} />;
      case 74:
        return <ContentVideoArea onBack={() => updatePage(7)} />;
      case 75:
        return <HeaderArea onBack={() => updatePage(7)} />;
      case 76:
        return <StockRaceArea onBack={() => updatePage(7)} />;
      case 77:
        return <NewsImageArea onBack={() => updatePage(7)} />;
      case 78:
        return <NewsTextSoundArea onBack={() => updatePage(7)} />;
      case 79:
        return <TtsSoundArea onBack={() => updatePage(7)} />;
      case 91:
        return <StockGroupArea onBack={() => updatePage(9)} />;
      case 92:
        return <SingleStockArea onBack={() => updatePage(9)} />;
      case 101:
        return <AdvertisementGroupArea onBack={() => updatePage(10)} />;
      case 102:
        return <ContentAdvertisementArea onBack={() => updatePage(10)} />;
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
                <p className="text-lg font-semibold text-gray-800">
                  {item.name}
                </p>
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
