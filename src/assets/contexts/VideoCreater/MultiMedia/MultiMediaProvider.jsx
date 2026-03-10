import { useState, useEffect, useContext, useCallback } from "react";
import MultiMediaContext from "./MultiMediaContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function MultiMediaProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess, 
    notifyConfirm // Use custom confirmation
  } = useContext(NotificationContext);
  
  const [mediaList, setMediaList] = useState([]);
  const [todayMedia, setTodayMedia] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ 
    token: userDetails.token 
  });

  // GET: All Multimedia - Removed silent logic
  const fetchMedia = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Syncing Media Library...");
    try {
      const { data } = await api.call("vm2/multimedia", { 
        method: "GET", 
        headers: getHeaders() 
      });
      if (data.success) {
        setMediaList(data.response || []);
      } else {
        await notifyError(data.errorMessage || "Fetch Media List Failed");
      }
    } catch { 
      notifyError("Network error: Failed to fetch media list"); 
    } finally { 
      closeLoading(); 
    }
  }, [userDetails?.token]);

  // GET: Today's Multimedia - Removed silent logic
  const fetchTodayMedia = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Loading Recent Media...");
    try {
      const { data } = await api.call("vm2/multimedia/today", { 
        method: "GET", 
        headers: getHeaders() 
      });
      if (data.success) {
        setTodayMedia(data.response || []);
      } else {
        await notifyError(data.errorMessage || "Fetch Today's Media Failed");
      }
    } catch { 
      notifyError("Network error: Failed to fetch recent media");
    } finally {
      closeLoading();
    }
  }, [userDetails?.token]);

  // POST: Upload Media
  const uploadMedia = async (formData) => {
    notifyLoading("Uploading Asset...");
    try {
      const { data } = await api.call("vm2/multimedia/upload", { 
        method: "POST", 
        headers: { token: userDetails.token }, 
        body: formData 
      });
      if (data.success) { 
        notifySuccess("Media Uploaded Successfully"); 
        await fetchMedia(); 
        await fetchTodayMedia();
        return true;
      } else {
        await notifyError(data.errorMessage || "Upload Failed");
      }
    } catch { 
      notifyError("Service error: Upload Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  // GET: Media Info by Key
  const getMediaInfo = async (key) => {
    if (!key) return null;
    notifyLoading("Retrieving Media Info...");
    try {
      const { data } = await api.call(`vm2/multimedia/info/${key}`, { 
        method: "GET", 
        headers: getHeaders() 
      });
      if (data.success) {
        return data.response;
      } else {
        await notifyError(data.errorMessage || "Failed to Retrieve Media Info");
      }
    } catch { 
      notifyError("Network error: Failed to fetch info"); 
    } finally {
      closeLoading();
    }
    return null;
  };

  // DELETE: Remove Asset - Updated with notifyConfirm and data.errorMessage
  const deleteMedia = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Are you sure you want to delete this multimedia asset?");
    if (!ok) return;

    notifyLoading("Deleting Asset...");
    try {
      const { data } = await api.call(`vm2/multimedia/${id}`, { 
        method: "DELETE", 
        headers: getHeaders() 
      });
      if (data.success) {
        notifySuccess("Asset Deleted Successfully");
        await fetchMedia();
        await fetchTodayMedia();
      } else {
        await notifyError(data.errorMessage || "Delete Failed");
      }
    } catch { 
      notifyError("Service error: Delete Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  useEffect(() => {
    if ([1].includes(page)) { 
      // Synchronous looking calls but both will trigger loading sequentially or overlapped
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