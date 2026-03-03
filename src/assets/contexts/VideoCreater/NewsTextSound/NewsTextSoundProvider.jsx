import { useState, useEffect, useContext, useCallback } from "react";
import NewsTextSoundContext from "./NewsTextSoundContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function NewsTextSoundProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  
  const [newsTextSounds, setNewsTextSounds] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  const fetchNewsTextSounds = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/news-text-sound", { method: "GET", headers: getHeaders() });
      if (data.success) setNewsTextSounds(data.response || []);
    } catch { 
      if (!silent) notifyError("Fetch News Text Styles Failed"); 
    } finally { 
      if (!silent) closeLoading(); 
    }
  }, [userDetails?.token]);

  const createNewsTextSound = async (dto) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/news-text-sound", { method: "POST", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("News Style Created"); 
        await fetchNewsTextSounds(true); 
        return true; 
      }
    } catch { notifyError("Creation Failed"); } finally { closeLoading(); }
  };

  const updateNewsTextSound = async (id, dto) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/news-text-sound/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("News Style Updated"); 
        await fetchNewsTextSounds(true); 
        return true; 
      }
    } catch { notifyError("Update Failed"); } finally { closeLoading(); }
  };

  const deleteNewsTextSound = async (id) => {
    if(!window.confirm("Delete this news style configuration?")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/news-text-sound/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Style Deleted");
        await fetchNewsTextSounds(true);
      }
    } catch { notifyError("Delete Failed"); } finally { closeLoading(); }
  };

  const activateNewsTextSound = async (id) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/news-text-sound/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Style Activated");
        await fetchNewsTextSounds(true);
      }
    } catch { notifyError("Activation Failed"); } finally { closeLoading(); }
  };

  useEffect(() => {
    if ([78].includes(page)) fetchNewsTextSounds(); // Assuming Page 78
  }, [page, fetchNewsTextSounds]);

  return (
    <NewsTextSoundContext.Provider value={{ newsTextSounds, createNewsTextSound, updateNewsTextSound, deleteNewsTextSound, activateNewsTextSound, fetchNewsTextSounds }}>
      {children}
    </NewsTextSoundContext.Provider>
  );
}