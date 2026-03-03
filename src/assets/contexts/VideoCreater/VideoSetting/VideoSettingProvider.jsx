import { useState, useEffect, useContext, useCallback } from "react";
import VideoSettingContext from "./VideoSettingContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function VideoSettingProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  
  const [settings, setSettings] = useState([]);
  const [activeSetting, setActiveSetting] = useState(null);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  const fetchSettings = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/video-setting", { method: "GET", headers: getHeaders() });
      if (data.success) {
        setSettings(data.response || []);
        // Optional: notifySuccess("Settings Refreshed"); // Usually silent is better for fetches
      }
    } catch { 
      if (!silent) notifyError("Fetch Settings Failed"); 
    } finally { 
      if (!silent) closeLoading(); 
    }
  }, [userDetails?.token]);

  const fetchActiveSetting = useCallback(async () => {
    try {
      const { data } = await api.call("vm2/video-setting/active", { method: "GET", headers: getHeaders() });
      if (data.success) setActiveSetting(data.response);
    } catch { 
      console.error("Failed to fetch active setting"); 
    }
  }, [userDetails?.token]);

  const createSetting = async (dto) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/video-setting", { method: "POST", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("Setting Created Successfully"); 
        fetchSettings(true); 
      }
    } catch { 
      notifyError("Creation Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const updateSetting = async (id, dto) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/video-setting/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("Setting Updated Successfully"); 
        fetchSettings(true); 
        return true; 
      }
    } catch { 
      notifyError("Update Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const deleteSetting = async (id) => {
    if(!window.confirm("Delete this video configuration?")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/video-setting/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Setting Deleted Successfully");
        fetchSettings(true);
      }
    } catch { 
      notifyError("Delete Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const activateSetting = async (id) => {
    notifyLoading(); // Added loading for activation
    try {
      const { data } = await api.call(`vm2/video-setting/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Configuration Activated");
        fetchSettings(true);
        fetchActiveSetting();
      }
    } catch { 
      notifyError("Activation Failed"); 
    } finally {
      closeLoading(); // Added close loading
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