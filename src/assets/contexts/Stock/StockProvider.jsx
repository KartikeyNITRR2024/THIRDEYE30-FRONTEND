import { useState, useEffect, useContext } from "react";
import AuthContext from "../Auth/AuthContext";
import NotificationContext from "../Notification/NotificationContext";
import StockContext from "./StockContext";
import ApiCaller from "../../properties/Apicaller";

export default function StockProvider({ children }) {
  const { userDetails, login } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading } = useContext(NotificationContext);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const api = new ApiCaller();

  const fetchStocks = async () => {
    if (!userDetails?.token) return;
    // setLoading(true);
    // notifyLoading();
    try {
      const { data } = await api.call("sm/stocks/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: userDetails.token,
        },
      });

      if (data.success && Array.isArray(data.response)) {
        const formattedStocks = data.response.map((s) => ({
          id: s.uniqueId,
          uniqueId: s.uniqueId.toString().padStart(5, "0"),
          name: s.uniqueCode,
          marketCode: s.marketCode,
          currentTime: s.currentTime,
        }));
        setStocks(formattedStocks);
      } else {
        await notifyError(data.errorMessage || "Failed to load stocks");
      }
    } catch {
      await notifyError("Network error fetching stocks");
    } finally {
      // closeLoading();
    }
  };

  useEffect(() => {
    if (login)
    {
       fetchStocks();
    }
    else
    {
        setStocks([]);
    }
  }, [login]);

  return (
    <StockContext.Provider value={{ stocks, loading, fetchStocks }}>
      {children}
    </StockContext.Provider>
  );
}

// This StockProvider manages fetching and storing all stock data for the app.
// It uses ApiCaller for API requests with retry and optional timeout logic.
// Provides stocks state, loading indicator, and fetchStocks function to child components.
