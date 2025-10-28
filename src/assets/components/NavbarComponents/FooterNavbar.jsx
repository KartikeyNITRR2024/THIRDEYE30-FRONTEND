import { RxDashboard } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";
import { RiAdminLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../contexts/Auth/AuthContext";
import PageContext from "../../contexts/Admin/Page/PageContext";
import MarketThresoldContext from "../../contexts/MarketThresold/MarketThresold/MarketThresoldContext";

export default function FooterNavbar() {
  const navigate = useNavigate();
  const { userDetails } = useContext(AuthContext);
  const { resetPage } = useContext(PageContext);
  const { handleBackClick } = useContext(MarketThresoldContext);

  const isAdmin = userDetails.roles?.includes("ROLE_ADMIN");

  const handleMarketThresoldClick = () => {
    handleBackClick();
    navigate("/marketthresold");
  };

  const handleAdminClick = () => {
    resetPage();
    navigate("/admin");
  };

  return (
    <nav className="h-full">
      <ul className="flex justify-around items-center h-full">
        <li>
          <RxDashboard
            onClick={handleMarketThresoldClick}
            className="text-4xl cursor-pointer"
          />
        </li>
        <li>
          <IoSettingsOutline
            onClick={() => navigate("/setting")}
            className="text-4xl cursor-pointer"
          />
        </li>
        {isAdmin && (
          <li>
            <RiAdminLine
              onClick={handleAdminClick}
              className="text-4xl cursor-pointer"
            />
          </li>
        )}
      </ul>
    </nav>
  );
}
