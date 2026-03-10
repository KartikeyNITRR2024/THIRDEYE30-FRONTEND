import { useState, useEffect, useContext, useCallback } from "react";
import StockContext from "./StockContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function StockProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess,
    notifyConfirm // Standardized custom confirmation
  } = useContext(NotificationContext);
  
  const [groups, setGroups] = useState([]);
  const [stocks, setStocks] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  // --- GROUP CRUD ---
  const fetchGroups = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Syncing Stock Groups...");
    try {
      const { data } = await api.call("vm2/stock-group", { method: "GET", headers: getHeaders() });
      if (data.success) {
        setGroups(data.response || []);
      } else {
        await notifyError(data.errorMessage || "Fetch Groups Failed");
      }
    } catch { 
      notifyError("Network error: Failed to fetch stock groups"); 
    } finally { 
      closeLoading(); 
    }
  }, [userDetails?.token]);

  const addGroup = async (dto) => {
    notifyLoading("Creating Stock Group...");
    try {
      const { data } = await api.call("vm2/stock-group", { 
        method: "POST", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Stock Group Created Successfully"); 
        await fetchGroups(); 
        return true;
      } else {
        await notifyError(data.errorMessage || "Group Creation Failed");
      }
    } catch { 
      notifyError("Service error: Group Creation Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const updateGroup = async (id, dto) => {
    notifyLoading("Updating Stock Group...");
    try {
      const { data } = await api.call(`vm2/stock-group/${id}`, { 
        method: "PUT", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Stock Group Updated Successfully"); 
        await fetchGroups(); 
        return true; 
      } else {
        await notifyError(data.errorMessage || "Group Update Failed");
      }
    } catch { 
      notifyError("Service error: Group Update Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const deleteGroup = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Are you sure you want to delete this group? All associated logic may be affected.");
    if (!ok) return;

    notifyLoading("Deleting Stock Group...");
    try {
      const { data } = await api.call(`vm2/stock-group/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Stock Group Deleted Successfully");
        await fetchGroups();
      } else {
        await notifyError(data.errorMessage || "Group Delete Failed");
      }
    } catch { 
      notifyError("Service error: Group Delete Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const toggleGroupActive = async (id, status) => {
    notifyLoading(status ? "Activating Group..." : "Deactivating Group...");
    try {
      const { data } = await api.call(`vm2/stock-group/${id}/active?status=${status}`, { 
        method: "PATCH", 
        headers: getHeaders() 
      });
      if (data.success) {
        notifySuccess(`Group ${status ? 'Activated' : 'Deactivated'}`);
        await fetchGroups();
      } else {
        await notifyError(data.errorMessage || "Toggle Failed");
      }
    } catch { 
      notifyError("Service error: Toggle Failed"); 
    } finally {
      closeLoading();
    }
  };

  // --- STOCK CRUD ---
  const fetchStocks = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Syncing Tickers...");
    try {
      const { data } = await api.call("vm2/stock", { method: "GET", headers: getHeaders() });
      if (data.success) {
        setStocks(data.response || []);
      } else {
        await notifyError(data.errorMessage || "Stock Fetch Failed");
      }
    } catch { 
      notifyError("Network error: Failed to fetch tickers");
    } finally {
      closeLoading();
    }
  }, [userDetails?.token]);

  const addStock = async (dto) => {
    if (!dto.groupId || !dto.name) {
      notifyError("Missing Group or Ticker Name");
      return;
    }
    notifyLoading("Adding Ticker...");
    try {
      const { data } = await api.call("vm2/stock", { 
        method: "POST", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Stock Added Successfully"); 
        await fetchStocks(); 
        return true; 
      } else {
        await notifyError(data.errorMessage || "Add Stock Failed");
      }
    } catch (err) { 
      notifyError("Service error: Add Stock Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const updateStock = async (id, dto) => {
    notifyLoading("Saving Ticker Changes...");
    try {
      const { id: _, ...updateData } = dto; 
      const { data } = await api.call(`vm2/stock/${id}`, { 
        method: "PUT", 
        headers: getHeaders(), 
        body: JSON.stringify(updateData) 
      });
      if (data.success) { 
        notifySuccess("Stock Updated Successfully"); 
        await fetchStocks(); 
        return true; 
      } else {
        await notifyError(data.errorMessage || "Update Stock Failed");
      }
    } catch (err) { 
      notifyError("Service error: Update Stock Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const deleteStock = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Delete this stock ticker?");
    if (!ok) return;

    notifyLoading("Removing Ticker...");
    try {
      const { data } = await api.call(`vm2/stock/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Stock Deleted Successfully");
        await fetchStocks();
      } else {
        await notifyError(data.errorMessage || "Delete Failed");
      }
    } catch { 
      notifyError("Service error: Delete Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const toggleStockActive = async (id, status) => {
    notifyLoading(status ? "Enabling Ticker..." : "Disabling Ticker...");
    try {
      const { data } = await api.call(`vm2/stock/${id}/active?status=${status}`, { 
        method: "PATCH", 
        headers: getHeaders() 
      });
      if (data.success) {
        notifySuccess(`Stock ${status ? 'Enabled' : 'Disabled'}`);
        await fetchStocks();
      } else {
        await notifyError(data.errorMessage || "Toggle Failed");
      }
    } catch { 
      notifyError("Service error: Toggle Failed"); 
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