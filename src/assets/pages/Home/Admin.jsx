import { useState, useEffect } from "react";
import Navbar from "../../components/NavbarComponents/Navbar";
import FooterNavbar from "../../components/NavbarComponents/FooterNavbar";
import { PiComputerTowerBold } from "react-icons/pi";
import { GrDocumentConfig } from "react-icons/gr";
import { GrUserSettings } from "react-icons/gr";
import { RiStockLine } from "react-icons/ri";
import backgroundimage from "../../images/backgroundimage.png";
import MicroservicesArea from "../../components/AdminComponents/MicroservicesComponents/MicroservicesArea";
import ConfigurtionArea from "../../components/AdminComponents/ConfigurationComponents/ConfigurationArea";
import UserArea from "../../components/AdminComponents/UsersComponents/Users";
import StocksArea from "../../components/AdminComponents/StocksComponents/StocksArea";

function AdminLogo(props) {
  const { name } = props;
  return <div className="text-2xl font-serif font-bold m-3">{name}</div>;
}

export default function Admin() {
  const settingArray = [
    { Id: 1, name: "Microservices", icon: <PiComputerTowerBold className="text-2xl" /> },
    { Id: 2, name: "Configuration", icon: <GrDocumentConfig className="text-2xl" /> },
    { Id: 3, name: "Users", icon: <GrUserSettings className="text-2xl" /> },
    { Id: 4, name: "Stocks", icon: <RiStockLine className="text-2xl" /> },
  ];

  const renderSettingArea = () => {
    switch (typeOfSetting) {
      case 1:
        return <MicroservicesArea />;
      case 2:
        return <ConfigurtionArea />;
      case 3:
        return <UserArea />;
      case 4:
        return <StocksArea />;
      default:
        return null;
    }
  };
  

  const [typeOfSetting, setTypeOfSetting] = useState(0);
  const [navProperties, setNavProperties] = useState({
    showOriginalNavbar: true,
    showBackButton: false,
    backButtonFunction: {},
    showExtraInfo: false,
    infoToShow: null,
  });

  useEffect(() => {
    const newNavProperty =
      typeOfSetting === 0
        ? {
            showOriginalNavbar: true,
            showBackButton: false,
            backButtonFunction: null,
            showExtraInfo: false,
            infoToShow: null,
          }
        : {
            showOriginalNavbar: false,
            showBackButton: true,
            backButtonFunction: backButtonFunction,
            showExtraInfo: true,
            infoToShow: <SettingLogo name={settingArray[typeOfSetting - 1].name} />,
          };
    setNavProperties(newNavProperty);
  }, [typeOfSetting]);

  const backButtonFunction = () => {
    setTypeOfSetting(0);
  };

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 h-16">
        <Navbar navProperties={navProperties} />
      </div>
      <div
        className={`mt-16 ${
          typeOfSetting === 0
            ? "h-[calc(100vh-4rem-4rem)]"
            : "h-[calc(100vh-4rem)]"
        } md:h-[calc(100vh-4rem)] overflow-y-auto bg-cover bg-center`}
        style={{ backgroundImage: `url(${backgroundimage})` }}
      >
        {typeOfSetting === 0 ? (
          <ul>
            {settingArray.map((setting) => (
              <li
                key={setting.Id}
                onClick={() => setTypeOfSetting(setting.Id)}
                className="p-2 m-2 flex items-center gap-2 cursor-pointer"
              >
                <div>{setting.icon}</div>
                <div className="text-2xl font-serif font-bold">{setting.name}</div>
              </li>
            ))}
          </ul>
        ) : (
          renderSettingArea()
        )}
      </div>
      {typeOfSetting === 0 && (
        <div className="fixed bottom-0 left-0 right-0 h-16 md:hidden">
          <FooterNavbar />
        </div>
      )}
    </div>
  );
}
