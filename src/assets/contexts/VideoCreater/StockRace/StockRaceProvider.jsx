import { useState, useEffect, useContext, useCallback } from "react";
import StockRaceContext from "./StockRaceContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function StockRaceProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess,
    notifyConfirm // Use custom confirmation
  } = useContext(NotificationContext);
  
  const [stockRaces, setStockRaces] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  // GET ALL - Standardized: No silent refresh, captures backend errors
  const fetchStockRaces = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Syncing Race Styles...");
    try {
      const { data } = await api.call("vm2/stock-race", { method: "GET", headers: getHeaders() });
      if (data.success) {
        setStockRaces(data.response || []);
      } else {
        await notifyError(data.errorMessage || "Fetch Stock Races Failed");
      }
    } catch { 
      notifyError("Network error: Failed to fetch race styles"); 
    } finally { 
      closeLoading(); 
    }
  }, [userDetails?.token]);

  // CREATE
  const createStockRace = async (dto) => {
    notifyLoading("Creating Stock Race Style...");
    try {
      const { data } = await api.call("vm2/stock-race", { 
        method: "POST", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Stock Race Style Created"); 
        await fetchStockRaces(); // Full refresh
        return true; 
      } else {
        await notifyError(data.errorMessage || "Creation Failed");
      }
    } catch { 
      notifyError("Service error: Creation Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  // UPDATE
  const updateStockRace = async (id, dto) => {
    notifyLoading("Saving Race Configuration...");
    try {
      const { data } = await api.call(`vm2/stock-race/${id}`, { 
        method: "PUT", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Stock Race Updated"); 
        await fetchStockRaces(); // Full refresh
        return true; 
      } else {
        await notifyError(data.errorMessage || "Update Failed");
      }
    } catch { 
      notifyError("Service error: Update Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  // DELETE - Updated with notifyConfirm and data.errorMessage
  const deleteStockRace = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Delete this Stock Race configuration?");
    if (!ok) return;

    notifyLoading("Deleting Race Style...");
    try {
      const { data } = await api.call(`vm2/stock-race/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Stock Race Deleted");
        await fetchStockRaces(); // Full refresh
      } else {
        await notifyError(data.errorMessage || "Delete Failed");
      }
    } catch { 
      notifyError("Service error: Delete Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  // ACTIVATE
  const activateStockRace = async (id) => {
    notifyLoading("Activating Race Style...");
    try {
      const { data } = await api.call(`vm2/stock-race/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Stock Race Activated");
        await fetchStockRaces(); // Full refresh
      } else {
        await notifyError(data.errorMessage || "Activation Failed");
      }
    } catch { 
      notifyError("Service error: Activation Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  useEffect(() => {
    if ([76].includes(page)) {
      fetchStockRaces();
    } else {
      setStockRaces([]);
    }
  }, [page, fetchStockRaces]);

  return (
    <StockRaceContext.Provider value={{ stockRaces, createStockRace, updateStockRace, deleteStockRace, activateStockRace, fetchStockRaces }}>
      {children}
    </StockRaceContext.Provider>
  );
}