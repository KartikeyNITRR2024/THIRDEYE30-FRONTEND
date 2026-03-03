import { useState, useEffect, useContext, useCallback } from "react";
import StockContext from "./StockContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function StockProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  
  const [groups, setGroups] = useState([]);
  const [stocks, setStocks] = useState([]);
  const api = new ApiCaller();

  // --- COMMON HEADERS ---
  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  // --- GROUP CRUD ---
  const fetchGroups = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/stock-group", { method: "GET", headers: getHeaders() });
      if (data.success) setGroups(data.response || []);
    } catch { if (!silent) notifyError("Fetch Groups Failed"); }
    finally { if (!silent) closeLoading(); }
  }, [userDetails?.token]);

  const addGroup = async (dto) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/stock-group", { method: "POST", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { notifySuccess("Group Created"); fetchGroups(true); }
    } catch { notifyError("Create Failed"); } finally { closeLoading(); }
  };

  const updateGroup = async (id, dto) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/stock-group/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { notifySuccess("Group Updated"); fetchGroups(true); return true; }
    } catch { notifyError("Update Failed"); } finally { closeLoading(); }
  };

  const deleteGroup = async (id) => {
    if(!window.confirm("Delete this group?")) return;
    notifyLoading();
    try {
      await api.call(`vm2/stock-group/${id}`, { method: "DELETE", headers: getHeaders() });
      notifySuccess("Group Deleted");
      fetchGroups(true);
    } catch { notifyError("Delete Failed"); } finally { closeLoading(); }
  };

  const toggleGroupActive = async (id, status) => {
    try {
      await api.call(`vm2/stock-group/${id}/active?status=${status}`, { method: "PATCH", headers: getHeaders() });
      fetchGroups(true);
    } catch { notifyError("Toggle Failed"); }
  };

  // --- STOCK CRUD ---
  const fetchStocks = useCallback(async () => {
    if (!userDetails?.token) return;
    try {
      const { data } = await api.call("vm2/stock", { method: "GET", headers: getHeaders() });
      if (data.success) setStocks(data.response || []);
    } catch { console.error("Stock Fetch Failed"); }
  }, [userDetails?.token]);

  const addStock = async (dto) => {
    // Basic validation
    if (!dto.groupId || !dto.name) {
      notifyError("Missing Group or Ticker");
      return;
    }
    notifyLoading();
    try {
      const { data } = await api.call("vm2/stock", { 
        method: "POST", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Stock Added"); 
        await fetchStocks(); // Refresh list
        return true; 
      }
    } catch (err) { 
      notifyError("Add Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const updateStock = async (id, dto) => {
    notifyLoading();
    try {
      // Create a clean DTO without the ID inside the body (if your API requires it)
      const { id: _, ...updateData } = dto; 
      
      const { data } = await api.call(`vm2/stock/${id}`, { 
        method: "PUT", 
        headers: getHeaders(), 
        body: JSON.stringify(updateData) 
      });
      if (data.success) { 
        notifySuccess("Stock Updated"); 
        await fetchStocks(); 
        return true; 
      }
    } catch (err) { 
      notifyError("Update Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const deleteStock = async (id) => {
    notifyLoading();
    try {
      await api.call(`vm2/stock/${id}`, { method: "DELETE", headers: getHeaders() });
      notifySuccess("Stock Deleted");
      fetchStocks();
    } catch { notifyError("Delete Failed"); } finally { closeLoading(); }
  };

  const toggleStockActive = async (id, status) => {
    try {
      await api.call(`vm2/stock/${id}/active?status=${status}`, { method: "PATCH", headers: getHeaders() });
      fetchStocks();
    } catch { notifyError("Toggle Failed"); }
  };

  useEffect(() => {
    if ([3, 91, 92].includes(page)) { fetchGroups(); fetchStocks(); }
    else {setGroups([]); setStocks([])}
  }, [page]);

  return (
    <StockContext.Provider value={{ 
      groups, stocks, fetchGroups, addGroup, updateGroup, deleteGroup, toggleGroupActive,
      fetchStocks, addStock, updateStock, deleteStock, toggleStockActive 
    }}>
      {children}
    </StockContext.Provider>
  );
}