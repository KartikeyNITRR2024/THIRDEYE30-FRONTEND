import { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "../Auth/AuthContext";
import NotificationContext from "../Notification/NotificationContext";
import StockContext from "./StockContext";
import ApiCaller from "../../properties/Apicaller";

export default function StockProvider({ children }) {
  const { userDetails, login } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading } = useContext(NotificationContext);

  const [stocks, setStocks] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const api = new ApiCaller();
  const intervalRef = useRef(null); 

  const fetchStocks = async () => {
    if (!userDetails?.token) return;

    try {
      const { data } = await api.call("sm/stocks/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: userDetails.token,
        },
      });

      if (data.success && Array.isArray(data.response)) {
        setStocks(
          data.response.map((s) => ({
            id: s.uniqueId,
            uniqueId: s.uniqueId.toString().padStart(5, "0"),
            name: s.uniqueCode,
            marketCode: s.marketCode,
            currentTime: s.currentTime,
            price: s.price,
            todaysOpeningPrice: s.todaysOpeningPrice,
            lastNightClosingPrice: s.lastNightClosingPrice,
          }))
        );
      } else {
        await notifyError(data.errorMessage || "Failed to load stocks");
      }
    } catch {
      await notifyError("Network error fetching stocks");
    }
  };

  const fetchStockHistory = async (stockId) => {
  if (!userDetails?.token) return;

  notifyLoading();
  const MAX_RETRIES = 2;
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      const { data, status } = await api.call(`sm/stocks/history/${stockId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: userDetails.token,
        },
      });
      if (data?.success && Array.isArray(data.response)) {
        setStockHistory(data.response);
        return;
      }
      if (status === 404 && attempt < MAX_RETRIES) {
        attempt++;
        await new Promise((res) => setTimeout(res, 500));
        continue;
      }
      await notifyError(data?.errorMessage || "Failed to load history");
      return;
    } catch (err) {
      if (err?.response?.status === 404 && attempt < MAX_RETRIES) {
        attempt++;
        await new Promise((res) => setTimeout(res, 500));
        continue;
      }
      await notifyError("Network error fetching history");
      return;
    } finally {
      closeLoading();
    }
  }
};


  const clearStockHistory = () => {
    setStockHistory([]);
  };

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (login && userDetails?.token) {
      fetchStocks();
      intervalRef.current = setInterval(() => {
        fetchStocks();
      }, 30_000);
    } else {
      setStocks([]);
      clearStockHistory();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [login, userDetails?.token]);

  return (
    <StockContext.Provider
      value={{
        stocks,
        loading,
        fetchStocks,
        stockHistory,
        fetchStockHistory,
        clearStockHistory,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}
