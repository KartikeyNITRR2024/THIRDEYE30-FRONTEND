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

  const getHeaders = () => ({ 
    token: userDetails.token 
  });

  // GET: All Multimedia
  const fetchMedia = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/multimedia", { 
        method: "GET", 
        headers: getHeaders() 
      });
      if (data.success) {
        setMediaList(data.response || []);
      }
    } catch { 
      if (!silent) notifyError("Fetch Media List Failed"); 
    } finally { 
      if (!silent) closeLoading(); 
    }
  }, [userDetails?.token]);

  // GET: Today's Multimedia
  const fetchTodayMedia = useCallback(async (silent = true) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/multimedia/today", { 
        method: "GET", 
        headers: getHeaders() 
      });
      if (data.success) {
        setTodayMedia(data.response || []);
      }
    } catch { 
      if (!silent) notifyError("Fetch Today's Media Failed");
    } finally {
      if (!silent) closeLoading();
    }
  }, [userDetails?.token]);

  // POST: Upload Media
  const uploadMedia = async (formData) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/multimedia/upload", { 
        method: "POST", 
        headers: { token: userDetails.token }, // Note: No 'Content-Type' for FormData
        body: formData 
      });
      if (data.success) { 
        notifySuccess("Media Uploaded Successfully"); 
        await fetchMedia(true); 
        await fetchTodayMedia(true);
        return true;
      }
    } catch { 
      notifyError("Upload Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  // GET: Media Info by Key
  const getMediaInfo = async (key) => {
    if (!key) return null;
    notifyLoading(); // Info fetch usually needs feedback if triggered by a button
    try {
      const { data } = await api.call(`vm2/multimedia/info/${key}`, { 
        method: "GET", 
        headers: getHeaders() 
      });
      if (data.success) {
        return data.response;
      }
    } catch { 
      notifyError("Failed to Retrieve Media Info"); 
    } finally {
        closeLoading();
    }
    return null;
  };

  // DELETE: Remove Asset
  const deleteMedia = async (id) => {
    if(!window.confirm("Delete this multimedia asset?")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/multimedia/${id}`, { 
        method: "DELETE", 
        headers: getHeaders() 
      });
      if (data.success) {
        notifySuccess("Asset Deleted Successfully");
        await fetchMedia(true);
        await fetchTodayMedia(true);
      }
    } catch { 
      notifyError("Delete Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  useEffect(() => {
    if ([1].includes(page)) { 
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