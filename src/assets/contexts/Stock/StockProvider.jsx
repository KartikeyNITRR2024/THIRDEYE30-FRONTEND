import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../Auth/AuthContext";
import NotificationContext from "../Notification/NotificationContext";
import Backend from "../../properties/Backend";
import StockContext from "./StockContext";

export default function StockProvider({ children }) {
  const { userDetails } = useContext(AuthContext);
  const { notifyError } = useContext(NotificationContext);

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStocks = async (retries = 3, delay = 1000) => {
    if (!userDetails?.token) return;

    setLoading(true);

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(`${Backend.THIRDEYEBACKEND.URL}sm/stocks/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: userDetails.token,
          },
        });

        const data = await response.json();

        if (response.status >= 500) {
          if (i === retries - 1) notifyError("Server error fetching stocks");
          await new Promise((res) => setTimeout(res, delay));
        } else {
          if (data.success && Array.isArray(data.response)) {
            const formattedStocks = data.response.map((s) => ({
              id: s.uniqueId,
              uniqueId: s.uniqueId.toString().padStart(5, "0"),
              name: s.uniqueCode,
              marketCode: s.marketCode,
              lastNightClosingPrice: s.lastNightClosingPrice,
              todaysOpeningPrice: s.todaysOpeningPrice,
              currentTime: s.currentTime,
            }));

            setStocks(formattedStocks);
          } else {
            notifyError(data.errorMessage || "Failed to load stocks");
          }
          setLoading(false);
          return;
        }
      } catch (err) {
        if (i === retries - 1) notifyError("Network error fetching stocks");
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (userDetails?.isLogin) fetchStocks();
  }, [userDetails]);

  return (
    <StockContext.Provider value={{ stocks, loading, fetchStocks }}>
      {children}
    </StockContext.Provider>
  );
}
