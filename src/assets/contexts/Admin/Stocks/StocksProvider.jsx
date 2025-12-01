import { useState, useEffect, useContext } from "react";
import StocksContext from "./StocksContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function StocksProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifySuccess, notifyLoading, closeLoading } = useContext(NotificationContext);

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const api = new ApiCaller();

  // 🔹 Fetch all stocks
  const fetchStocks = async () => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call("sm/stocks/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: userDetails.token,
        },
      });
      if (data.success) {
        setStocks(data.response || []);
      } else {
        notifyError(data.errorMessage || "Failed to fetch stock list");
      }
    } catch {
      notifyError("Network error while fetching stock list");
    } finally {
      closeLoading();
    }
  };

  // 🔹 Upload stocks CSV
  const uploadStocksCSV = async (file) => {
    if (!userDetails?.token) {
      notifyError("Unauthorized — please log in again");
      return false;
    }
    if (!file) {
      notifyError("Please select a CSV file to upload");
      return false;
    }
    notifyLoading("Uploading stocks");
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const { data } = await api.call("sm/stocks/uploadCSV", {
        method: "POST",
        headers: {
          token: userDetails.token,
        },
        body: formData,
      });

      if (data?.success) {
        notifySuccess("Stocks uploaded successfully");
        await fetchStocks(); // refresh list
        return true;
      } else {
        notifyError(data?.errorMessage || "Upload failed");
        return false;
      }
    } catch {
      notifyError("Network error during CSV upload");
      return false;
    } finally {
      setUploading(false);
      closeLoading();
    }
  };

  useEffect(() => {
    if (page === 4) {
      fetchStocks();
    } else {
      setStocks([]);
    }
  }, [page]);

  return (
    <StocksContext.Provider
      value={{
        stocks,
        loading,
        uploading,
        fetchStocks,
        uploadStocksCSV,
      }}
    >
      {children}
    </StocksContext.Provider>
  );
}
