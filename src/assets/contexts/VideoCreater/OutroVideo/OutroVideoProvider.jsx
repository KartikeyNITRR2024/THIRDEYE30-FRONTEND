import { useState, useEffect, useContext, useCallback } from "react";
import OutroVideoContext from "./OutroVideoContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function OutroVideoProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess,
    notifyConfirm // Standardized custom confirmation
  } = useContext(NotificationContext);
  
  const [outros, setOutros] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  // GET ALL - Standardized: No silent refresh, captures backend errors
  const fetchOutros = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Loading Outro Templates...");
    try {
      const { data } = await api.call("vm2/outro-video", { method: "GET", headers: getHeaders() });
      if (data.success) {
        setOutros(data.response || []);
      } else {
        await notifyError(data.errorMessage || "Fetch Outros Failed");
      }
    } catch { 
      notifyError("Network error: Failed to load outros"); 
    } finally { 
      closeLoading(); 
    }
  }, [userDetails?.token]);

  // CREATE
  const createOutro = async (dto) => {
    notifyLoading("Creating Outro...");
    try {
      const { data } = await api.call("vm2/outro-video", { 
        method: "POST", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Outro Created Successfully"); 
        await fetchOutros(); // Full refresh for UI transparency
        return true; 
      } else {
        await notifyError(data.errorMessage || "Outro Creation Failed");
      }
    } catch { 
      notifyError("Service error: Outro Creation Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  // UPDATE
  const updateOutro = async (id, dto) => {
    notifyLoading("Saving Outro Changes...");
    try {
      const { data } = await api.call(`vm2/outro-video/${id}`, { 
        method: "PUT", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Outro Updated Successfully"); 
        await fetchOutros(); // Full refresh
        return true; 
      } else {
        await notifyError(data.errorMessage || "Outro Update Failed");
      }
    } catch { 
      notifyError("Service error: Outro Update Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  // DELETE - Updated with notifyConfirm and data.errorMessage
  const deleteOutro = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Are you sure you want to delete this outro template?");
    if (!ok) return;

    notifyLoading("Deleting Outro...");
    try {
      const { data } = await api.call(`vm2/outro-video/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Outro Deleted Successfully");
        await fetchOutros(); // Full refresh
      } else {
        await notifyError(data.errorMessage || "Outro Delete Failed");
      }
    } catch { 
      notifyError("Service error: Outro Delete Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  // ACTIVATE
  const activateOutro = async (id) => {
    notifyLoading("Activating Template...");
    try {
      const { data } = await api.call(`vm2/outro-video/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Outro Template Activated Successfully");
        await fetchOutros(); // Full refresh
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
    if ([73].includes(page)) { 
      fetchOutros(); 
    } else {
      setOutros([]);
    }
  }, [page, fetchOutros]);

  return (
    <OutroVideoContext.Provider value={{ outros, createOutro, updateOutro, deleteOutro, activateOutro, fetchOutros }}>
      {children}
    </OutroVideoContext.Provider>
  );
}