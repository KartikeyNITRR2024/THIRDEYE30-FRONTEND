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

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  // --- GROUP CRUD ---
  const fetchGroups = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/stock-group", { method: "GET", headers: getHeaders() });
      if (data.success) setGroups(data.response || []);
    } catch { 
      if (!silent) notifyError("Fetch Groups Failed"); 
    } finally { 
      if (!silent) closeLoading(); 
    }
  }, [userDetails?.token]);

  const addGroup = async (dto) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/stock-group", { method: "POST", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("Stock Group Created Successfully"); 
        await fetchGroups(true); 
        return true;
      }
    } catch { 
      notifyError("Group Creation Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const updateGroup = async (id, dto) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/stock-group/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("Stock Group Updated Successfully"); 
        await fetchGroups(true); 
        return true; 
      }
    } catch { 
      notifyError("Group Update Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const deleteGroup = async (id) => {
    if(!window.confirm("Are you sure you want to delete this group? All associated logic may be affected.")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/stock-group/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Stock Group Deleted Successfully");
        await fetchGroups(true);
      }
    } catch { 
      notifyError("Group Delete Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const toggleGroupActive = async (id, status) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/stock-group/${id}/active?status=${status}`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess(`Group ${status ? 'Activated' : 'Deactivated'}`);
        await fetchGroups(true);
      }
    } catch { 
      notifyError("Toggle Failed"); 
    } finally {
      closeLoading();
    }
  };

  // --- STOCK CRUD ---
  const fetchStocks = useCallback(async (silent = true) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/stock", { method: "GET", headers: getHeaders() });
      if (data.success) setStocks(data.response || []);
    } catch { 
      if (!silent) notifyError("Stock Fetch Failed");
    } finally {
      if (!silent) closeLoading();
    }
  }, [userDetails?.token]);

  const addStock = async (dto) => {
    if (!dto.groupId || !dto.name) {
      notifyError("Missing Group or Ticker Name");
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
        notifySuccess("Stock Added Successfully"); 
        await fetchStocks(true); 
        return true; 
      }
    } catch (err) { 
      notifyError("Add Stock Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const updateStock = async (id, dto) => {
    notifyLoading();
    try {
      const { id: _, ...updateData } = dto; 
      const { data } = await api.call(`vm2/stock/${id}`, { 
        method: "PUT", 
        headers: getHeaders(), 
        body: JSON.stringify(updateData) 
      });
      if (data.success) { 
        notifySuccess("Stock Updated Successfully"); 
        await fetchStocks(true); 
        return true; 
      }
    } catch (err) { 
      notifyError("Update Stock Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const deleteStock = async (id) => {
    if(!window.confirm("Delete this stock ticker?")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/stock/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Stock Deleted Successfully");
        await fetchStocks(true);
      }
    } catch { 
      notifyError("Delete Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const toggleStockActive = async (id, status) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/stock/${id}/active?status=${status}`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess(`Stock ${status ? 'Enabled' : 'Disabled'}`);
        await fetchStocks(true);
      }
    } catch { 
      notifyError("Toggle Failed"); 
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if ([3, 91, 92].includes(page)) { 
      fetchGroups(); 
      fetchStocks(); 
    } else {
      setGroups([]); 
      setStocks([]);
    }
  }, [page, fetchGroups, fetchStocks]);

  return (
    <StockContext.Provider value={{ 
      groups, stocks, fetchGroups, addGroup, updateGroup, deleteGroup, toggleGroupActive,
      fetchStocks, addStock, updateStock, deleteStock, toggleStockActive 
    }}>
      {children}
    </StockContext.Provider>
  );
}