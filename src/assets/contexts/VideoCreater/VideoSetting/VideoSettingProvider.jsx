import { useState, useEffect, useContext, useCallback } from "react";
import VideoSettingContext from "./VideoSettingContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function VideoSettingProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess,
    notifyConfirm // Standardized custom confirmation
  } = useContext(NotificationContext);
  
  const [settings, setSettings] = useState([]);
  const [activeSetting, setActiveSetting] = useState(null);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  // FETCH ALL - Standardized: No silent refresh, captures backend errors
  const fetchSettings = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Syncing Video Settings...");
    try {
      const { data } = await api.call("vm2/video-setting", { method: "GET", headers: getHeaders() });
      if (data.success) {
        setSettings(data.response || []);
      } else {
        await notifyError(data.errorMessage || "Fetch Settings Failed");
      }
    } catch { 
      notifyError("Network error: Failed to fetch settings"); 
    } finally { 
      closeLoading(); 
    }
  }, [userDetails?.token]);

  // FETCH ACTIVE
  const fetchActiveSetting = useCallback(async () => {
    if (!userDetails?.token) return;
    try {
      const { data } = await api.call("vm2/video-setting/active", { method: "GET", headers: getHeaders() });
      if (data.success) {
        setActiveSetting(data.response);
      }
    } catch { 
      console.error("Failed to fetch active setting"); 
    }
  }, [userDetails?.token]);

  // CREATE
  const createSetting = async (dto) => {
    notifyLoading("Creating Configuration...");
    try {
      const { data } = await api.call("vm2/video-setting", { 
        method: "POST", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Setting Created Successfully"); 
        await fetchSettings(); // Full refresh
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
  const updateSetting = async (id, dto) => {
    notifyLoading("Saving Configuration...");
    try {
      const { data } = await api.call(`vm2/video-setting/${id}`, { 
        method: "PUT", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Setting Updated Successfully"); 
        await fetchSettings(); // Full refresh
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

  // DELETE - Updated with notifyConfirm
  const deleteSetting = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Are you sure you want to delete this video configuration?");
    if (!ok) return;

    notifyLoading("Deleting Configuration...");
    try {
      const { data } = await api.call(`vm2/video-setting/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Setting Deleted Successfully");
        await fetchSettings(); // Full refresh
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
  const activateSetting = async (id) => {
    notifyLoading("Activating Configuration...");
    try {
      const { data } = await api.call(`vm2/video-setting/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Configuration Activated");
        await fetchSettings();
        await fetchActiveSetting();
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
    if ([71].includes(page)) { 
      fetchSettings(); 
      fetchActiveSetting(); 
    } else { 
      setSettings([]); 
      setActiveSetting(null); 
    }
  }, [page, fetchSettings, fetchActiveSetting]);

  return (
    <VideoSettingContext.Provider value={{ 
      settings, activeSetting, fetchSettings, createSetting, updateSetting, deleteSetting, activateSetting 
    }}>
      {children}
    </VideoSettingContext.Provider>
  );
}