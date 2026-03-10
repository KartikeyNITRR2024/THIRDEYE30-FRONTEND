import { useState, useEffect, useContext, useCallback } from "react";
import HeaderContext from "./HeaderContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function HeaderProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess, 
    notifyConfirm // Use custom confirmation
  } = useContext(NotificationContext);
  
  const [headers, setHeaders] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  // GET - Standardized: No silent refresh, handles backend error messages
  const fetchHeaders = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Loading Headers...");
    try {
      const { data } = await api.call("vm2/header", { method: "GET", headers: getHeaders() });
      if (data.success) {
        setHeaders(data.response || []);
      } else {
        await notifyError(data.errorMessage || "Fetch Headers Failed");
      }
    } catch { 
      notifyError("Network error: Failed to load headers"); 
    } finally { 
      closeLoading(); 
    }
  }, [userDetails?.token]);

  // CREATE
  const createHeader = async (dto) => {
    notifyLoading("Creating Header Style...");
    try {
      const { data } = await api.call("vm2/header", { 
        method: "POST", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Header Style Created"); 
        await fetchHeaders(); // Full refresh
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
  const updateHeader = async (id, dto) => {
    notifyLoading("Updating Header...");
    try {
      const { data } = await api.call(`vm2/header/${id}`, { 
        method: "PUT", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Header Updated"); 
        await fetchHeaders(); // Full refresh
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

  // DELETE
  const deleteHeader = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Are you sure you want to delete this header configuration?");
    if (!ok) return;

    notifyLoading("Deleting Header...");
    try {
      const { data } = await api.call(`vm2/header/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Header Deleted");
        await fetchHeaders(); // Full refresh
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
  const activateHeader = async (id) => {
    notifyLoading("Activating Header...");
    try {
      const { data } = await api.call(`vm2/header/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Header Activated");
        await fetchHeaders(); // Full refresh
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
    if ([75].includes(page)) fetchHeaders();
  }, [page, fetchHeaders]);

  return (
    <HeaderContext.Provider value={{ headers, createHeader, updateHeader, deleteHeader, activateHeader, fetchHeaders }}>
      {children}
    </HeaderContext.Provider>
  );
}