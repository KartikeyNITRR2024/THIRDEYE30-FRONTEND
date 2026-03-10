import { useState, useEffect, useContext, useCallback } from "react";
import NewsImageContext from "./NewsImageContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function NewsImageProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess,
    notifyConfirm // Use custom confirmation
  } = useContext(NotificationContext);
  
  const [newsImages, setNewsImages] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  // GET ALL - Standardized: No silent refresh, captures backend errors
  const fetchNewsImages = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Syncing Image Styles...");
    try {
      const { data } = await api.call("vm2/news-image", { method: "GET", headers: getHeaders() });
      if (data.success) {
        setNewsImages(data.response || []);
      } else {
        await notifyError(data.errorMessage || "Fetch News Images Failed");
      }
    } catch { 
      notifyError("Network error: Failed to fetch news image styles"); 
    } finally { 
      closeLoading(); 
    }
  }, [userDetails?.token]);

  // CREATE
  const createNewsImage = async (dto) => {
    notifyLoading("Creating News Image Style...");
    try {
      const { data } = await api.call("vm2/news-image", { 
        method: "POST", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("News Image Style Created"); 
        await fetchNewsImages(); // Full refresh
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
  const updateNewsImage = async (id, dto) => {
    notifyLoading("Saving Style Changes...");
    try {
      const { data } = await api.call(`vm2/news-image/${id}`, { 
        method: "PUT", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Style Updated"); 
        await fetchNewsImages(); // Full refresh
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
  const deleteNewsImage = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Are you sure you want to delete this news image style?");
    if (!ok) return;

    notifyLoading("Deleting Style...");
    try {
      const { data } = await api.call(`vm2/news-image/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Deleted Successfully");
        await fetchNewsImages(); // Full refresh
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
  const activateNewsImage = async (id) => {
    notifyLoading("Activating Style...");
    try {
      const { data } = await api.call(`vm2/news-image/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Style Activated");
        await fetchNewsImages(); // Full refresh
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
    if ([77].includes(page)) {
        fetchNewsImages();
    } else {
        setNewsImages([]);
    }
  }, [page, fetchNewsImages]);

  return (
    <NewsImageContext.Provider value={{ newsImages, createNewsImage, updateNewsImage, deleteNewsImage, activateNewsImage, fetchNewsImages }}>
      {children}
    </NewsImageContext.Provider>
  );
}