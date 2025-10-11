import { RxDashboard } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";
import { RiAdminLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../contexts/Auth/AuthContext";

export default function FooterNavbar() {
  const navigate = useNavigate();
  const { userDetails } = useContext(AuthContext);

  const isAdmin = userDetails.roles?.includes("ROLE_ADMIN");

  return (
    <nav className="h-full">
      <ul className="flex justify-around items-center h-full">
        <li>
          <RxDashboard
            onClick={() => navigate("/marketthresold")}
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
              onClick={() => navigate("/admin")}
              className="text-4xl cursor-pointer"
            />
          </li>
        )}
      </ul>
    </nav>
  );
}
