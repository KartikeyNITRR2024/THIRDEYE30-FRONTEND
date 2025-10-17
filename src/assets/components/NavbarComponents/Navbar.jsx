import { useState, useContext } from "react";
import thirdeyelogo from "../../images/thirdeyelogo.png";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdLogout } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/Auth/AuthContext";
import MarketThresoldContext from "../../contexts/MarketThresold/MarketThresold/MarketThresoldContext";

export default function Navbar(props) {
  const navigate = useNavigate();
  const [options, setOptions] = useState(false);
  const { handleBackClick } = useContext(MarketThresoldContext);

  const { navProperties } = props;
  const { logout, userDetails } = useContext(AuthContext);

  const navigateFunc = (path) => {
    navigate(path);
  };

  const handleMarketThresoldClick = () => {
    handleBackClick();
    navigate("/marketthresold");
  };

  const isAdmin = userDetails.roles?.includes("ROLE_ADMIN");

  return (
    <nav className="h-full flex items-center mx-5 md:mx-10">
      {navProperties.showOriginalNavbar ? (
        <div className="flex justify-between items-center w-full">
          <div className="flex items-end">
            <img
              className="w-44 h-auto"
              src={thirdeyelogo}
              alt="thirdeyelogo"
            />
            <div className="hidden md:block">
              <ul className="flex gap-4">
                <li
                  onClick={handleMarketThresoldClick}
                  className="cursor-pointer text-black hover:text-gray-800"
                >
                  Dashboard
                </li>
                <li
                  onClick={() => navigateFunc("/setting")}
                  className="cursor-pointer text-black hover:text-gray-800"
                >
                  Setting
                </li>
                {isAdmin && (
                  <li
                    onClick={() => navigateFunc("/admin")}
                    className="cursor-pointer text-black hover:text-gray-800"
                  >
                    Admin
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="relative">
            <PiDotsThreeOutlineVerticalFill
              className="text-4xl cursor-pointer"
              onClick={() => setOptions(!options)}
            />
            {options && (
              <div className="absolute top-16 border border-gray-500 right-0 bg-white shadow-lg rounded-lg w-48 p-4 z-10">
                <ul>
                  <li
                    onClick={logout} // call logout from AuthContext
                    className="py-2 px-4 flex items-center hover:bg-gray-100 cursor-pointer gap-1"
                  >
                    <MdLogout className="text-xl" />
                    <span>Logout</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-start items-center">
          {navProperties.showBackButton && (
            <FaArrowLeft
              className="text-3xl"
              onClick={navProperties.backButtonFunction}
            />
          )}
          {navProperties.showExtraInfo && navProperties.infoToShow}
        </div>
      )}
    </nav>
  );
}
