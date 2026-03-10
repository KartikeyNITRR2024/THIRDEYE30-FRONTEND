import { useState, useEffect, useContext, useCallback } from "react";
import ContentVideoContext from "./ContentVideoContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function ContentVideoProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess, 
    notifyConfirm // Use custom confirmation
  } = useContext(NotificationContext);
  
  const [contentConfigs, setContentConfigs] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  // GET ALL - Removed silent refresh logic
  const fetchContentConfigs = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Loading Layouts...");
    try {
      const { data } = await api.call("vm2/content-video", { method: "GET", headers: getHeaders() });
      if (data.success) {
        setContentConfigs(data.response || []);
      } else {
        await notifyError(data.errorMessage || "Fetch Content Configs Failed");
      }
    } catch { 
      notifyError("Network error: Failed to load content configs"); 
    } finally { 
      closeLoading(); 
    }
  }, [userDetails?.token]);

  // CREATE
  const createContentConfig = async (dto) => {
    notifyLoading("Creating Layout...");
    try {
      const { data } = await api.call("vm2/content-video", { 
        method: "POST", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Content Layout Created"); 
        await fetchContentConfigs(); // Full refresh
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
  const updateContentConfig = async (id, dto) => {
    notifyLoading("Saving Changes...");
    try {
      const { data } = await api.call(`vm2/content-video/${id}`, { 
        method: "PUT", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Layout Updated Successfully"); 
        await fetchContentConfigs(); // Full refresh
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
  const deleteContentConfig = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Are you sure you want to delete this content layout configuration?");
    if (!ok) return;

    notifyLoading("Deleting Layout...");
    try {
      const { data } = await api.call(`vm2/content-video/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Layout Deleted");
        await fetchContentConfigs(); // Full refresh
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
  const activateContentConfig = async (id) => {
    notifyLoading("Activating Layout...");
    try {
      const { data } = await api.call(`vm2/content-video/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Layout Activated");
        await fetchContentConfigs(); // Full refresh
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
    if ([74].includes(page)) fetchContentConfigs();
    else setContentConfigs([]);
  }, [page, fetchContentConfigs]);

  return (
    <ContentVideoContext.Provider value={{ contentConfigs, createContentConfig, updateContentConfig, deleteContentConfig, activateContentConfig, fetchContentConfigs }}>
      {children}
    </ContentVideoContext.Provider>
  );
}