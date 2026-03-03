import { useState, useEffect, useContext, useCallback } from "react";
import MultiMediaContext from "./MultiMediaContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function MultiMediaProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  
  const [mediaList, setMediaList] = useState([]);
  const [todayMedia, setTodayMedia] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ token: userDetails.token });

  // GET: /vm2/multimedia (All)
  const fetchMedia = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/multimedia", { method: "GET", headers: getHeaders() });
      if (data.success) setMediaList(data.response || []);
    } catch { if (!silent) notifyError("Fetch All Failed"); }
    finally { if (!silent) closeLoading(); }
  }, [userDetails?.token]);

  // GET: /vm2/multimedia/today
  const fetchTodayMedia = useCallback(async () => {
    try {
      const { data } = await api.call("vm2/multimedia/today", { method: "GET", headers: getHeaders() });
      if (data.success) setTodayMedia(data.response || []);
    } catch { console.error("Today's fetch failed"); }
  }, [userDetails?.token]);

  // POST: /vm2/multimedia/upload
  const uploadMedia = async (formData) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/multimedia/upload", { 
        method: "POST", 
        headers: { token: userDetails.token }, 
        body: formData 
      });
      if (data.success) { 
        notifySuccess("Upload Successful"); 
        fetchMedia(true); 
        fetchTodayMedia();
        return true;
      }
    } catch { notifyError("Upload Failed"); } 
    finally { closeLoading(); }
  };

  // GET: /vm2/multimedia/info/{key}
  const getMediaInfo = async (key) => {
    try {
      const { data } = await api.call(`vm2/multimedia/info/${key}`, { method: "GET", headers: getHeaders() });
      return data.success ? data.response : null;
    } catch { notifyError("Failed to get info"); }
  };

  // DELETE: /vm2/multimedia/{id}
  const deleteMedia = async (id) => {
    if(!window.confirm("Delete this multimedia asset?")) return;
    notifyLoading();
    try {
      await api.call(`vm2/multimedia/${id}`, { method: "DELETE", headers: getHeaders() });
      notifySuccess("Deleted Successfully");
      fetchMedia(true);
      fetchTodayMedia();
    } catch { notifyError("Delete Failed"); } 
    finally { closeLoading(); }
  };

  useEffect(() => {
    if ([1].includes(page)) { // Assuming 93 is the MultiMedia page
      fetchMedia();
      fetchTodayMedia();
    } else {
      setMediaList([]);
      setTodayMedia([]);
    }
  }, [page, fetchMedia, fetchTodayMedia]);

  return (
    <MultiMediaContext.Provider value={{ 
      mediaList, todayMedia, fetchMedia, fetchTodayMedia, 
      uploadMedia, deleteMedia, getMediaInfo 
    }}>
      {children}
    </MultiMediaContext.Provider>
  );
}