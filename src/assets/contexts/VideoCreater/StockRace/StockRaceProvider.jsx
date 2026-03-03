import { useState, useEffect, useContext, useCallback } from "react";
import StockRaceContext from "./StockRaceContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function StockRaceProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  
  const [stockRaces, setStockRaces] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  const fetchStockRaces = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/stock-race", { method: "GET", headers: getHeaders() });
      if (data.success) setStockRaces(data.response || []);
    } catch { 
      if (!silent) notifyError("Fetch Stock Races Failed"); 
    } finally { 
      if (!silent) closeLoading(); 
    }
  }, [userDetails?.token]);

  const createStockRace = async (dto) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/stock-race", { method: "POST", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("Stock Race Style Created"); 
        await fetchStockRaces(true); 
        return true; 
      }
    } catch { notifyError("Creation Failed"); } finally { closeLoading(); }
  };

  const updateStockRace = async (id, dto) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/stock-race/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("Stock Race Updated"); 
        await fetchStockRaces(true); 
        return true; 
      }
    } catch { notifyError("Update Failed"); } finally { closeLoading(); }
  };

  const deleteStockRace = async (id) => {
    if(!window.confirm("Delete this Stock Race configuration?")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/stock-race/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Stock Race Deleted");
        await fetchStockRaces(true);
      }
    } catch { notifyError("Delete Failed"); } finally { closeLoading(); }
  };

  const activateStockRace = async (id) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/stock-race/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Stock Race Activated");
        await fetchStockRaces(true);
      }
    } catch { notifyError("Activation Failed"); } finally { closeLoading(); }
  };

  useEffect(() => {
    // Assuming Page 76 for Stock Race
    if ([76].includes(page)) fetchStockRaces();
  }, [page, fetchStockRaces]);

  return (
    <StockRaceContext.Provider value={{ stockRaces, createStockRace, updateStockRace, deleteStockRace, activateStockRace, fetchStockRaces }}>
      {children}
    </StockRaceContext.Provider>
  );
}