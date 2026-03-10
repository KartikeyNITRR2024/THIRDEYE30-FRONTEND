import { useState, useEffect, useContext, useCallback } from "react";
import NewsTextSoundContext from "./NewsTextSoundContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function NewsTextSoundProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess,
    notifyConfirm // Use custom confirmation
  } = useContext(NotificationContext);
  
  const [newsTextSounds, setNewsTextSounds] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  // GET - Standardized: No silent refresh, handles backend error messages
  const fetchNewsTextSounds = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Syncing Text Styles...");
    try {
      const { data } = await api.call("vm2/news-text-sound", { method: "GET", headers: getHeaders() });
      if (data.success) {
        setNewsTextSounds(data.response || []);
      } else {
        await notifyError(data.errorMessage || "Fetch News Text Styles Failed");
      }
    } catch { 
      notifyError("Network error: Failed to load text styles"); 
    } finally { 
      closeLoading(); 
    }
  }, [userDetails?.token]);

  // CREATE
  const createNewsTextSound = async (dto) => {
    notifyLoading("Creating News Style...");
    try {
      const { data } = await api.call("vm2/news-text-sound", { 
        method: "POST", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("News Style Created"); 
        await fetchNewsTextSounds(); // Full refresh
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
  const updateNewsTextSound = async (id, dto) => {
    notifyLoading("Saving News Style...");
    try {
      const { data } = await api.call(`vm2/news-text-sound/${id}`, { 
        method: "PUT", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("News Style Updated"); 
        await fetchNewsTextSounds(); // Full refresh
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

  // DELETE - Updated with notifyConfirm and data.errorMessage
  const deleteNewsTextSound = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Are you sure you want to delete this news style configuration?");
    if (!ok) return;

    notifyLoading("Deleting Style...");
    try {
      const { data } = await api.call(`vm2/news-text-sound/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Style Deleted");
        await fetchNewsTextSounds(); // Full refresh
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
  const activateNewsTextSound = async (id) => {
    notifyLoading("Activating Style...");
    try {
      const { data } = await api.call(`vm2/news-text-sound/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Style Activated");
        await fetchNewsTextSounds(); // Full refresh
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
    if ([78].includes(page)) {
      fetchNewsTextSounds();
    } else {
      setNewsTextSounds([]);
    }
  }, [page, fetchNewsTextSounds]);

  return (
    <NewsTextSoundContext.Provider value={{ newsTextSounds, createNewsTextSound, updateNewsTextSound, deleteNewsTextSound, activateNewsTextSound, fetchNewsTextSounds }}>
      {children}
    </NewsTextSoundContext.Provider>
  );
}