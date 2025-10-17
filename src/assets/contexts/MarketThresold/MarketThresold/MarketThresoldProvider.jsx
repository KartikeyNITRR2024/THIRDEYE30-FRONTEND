import { useState, useContext, useEffect } from "react";
import MarketThresoldContext from "./MarketThresoldContext";
import AuthContext from "../../../contexts/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MarketThresoldProvider({ children }) {
  const { login } = useContext(AuthContext);
  const [page, setPage] = useState("group");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const navigate = useNavigate();

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setPage("single");
  };

  const handleBackClick = () => {
    setSelectedGroup(null);
    setPage("group");
  };

  useEffect(() => {
      if (!login) {
        handleBackClick();
        navigate("/");
      }
  }, [login]);

  return (
    <MarketThresoldContext.Provider
      value={{
        page,
        selectedGroup,
        handleGroupClick,
        handleBackClick,
      }}
    >
      {children}
    </MarketThresoldContext.Provider>
  );
}
