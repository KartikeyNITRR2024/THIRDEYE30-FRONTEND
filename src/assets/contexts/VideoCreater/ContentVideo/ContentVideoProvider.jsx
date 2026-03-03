import { useState, useEffect, useContext, useCallback } from "react";
import ContentVideoContext from "./ContentVideoContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function ContentVideoProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  
  const [contentConfigs, setContentConfigs] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  const fetchContentConfigs = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/content-video", { method: "GET", headers: getHeaders() });
      if (data.success) {
        setContentConfigs(data.response || []);
      }
    } catch { 
      if (!silent) notifyError("Fetch Content Configs Failed"); 
    } finally { 
      if (!silent) closeLoading(); 
    }
  }, [userDetails?.token]);

  const createContentConfig = async (dto) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/content-video", { method: "POST", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("Content Layout Created"); 
        await fetchContentConfigs(true); 
        return true; 
      }
    } catch { notifyError("Creation Failed"); } finally { closeLoading(); }
  };

  const updateContentConfig = async (id, dto) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/content-video/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("Layout Updated Successfully"); 
        await fetchContentConfigs(true); 
        return true; 
      }
    } catch { notifyError("Update Failed"); } finally { closeLoading(); }
  };

  const deleteContentConfig = async (id) => {
    if(!window.confirm("Delete this content layout configuration?")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/content-video/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Layout Deleted");
        await fetchContentConfigs(true);
      }
    } catch { notifyError("Delete Failed"); } finally { closeLoading(); }
  };

  const activateContentConfig = async (id) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/content-video/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Layout Activated");
        await fetchContentConfigs(true);
      }
    } catch { notifyError("Activation Failed"); } finally { closeLoading(); }
  };

  useEffect(() => {
    // Page 74 for Content Video
    if ([74].includes(page)) fetchContentConfigs();
    else setContentConfigs([]);
  }, [page, fetchContentConfigs]);

  return (
    <ContentVideoContext.Provider value={{ contentConfigs, createContentConfig, updateContentConfig, deleteContentConfig, activateContentConfig, fetchContentConfigs }}>
      {children}
    </ContentVideoContext.Provider>
  );
}