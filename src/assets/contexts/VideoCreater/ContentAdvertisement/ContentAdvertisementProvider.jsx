import { useState, useEffect, useContext, useCallback } from "react";
import ContentAdvertisementContext from "./ContentAdvertisementContext";
import AdvertisementContext from "../Advertisement/AdvertisementContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function ContentAdvertisementProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { adList, fetchAds } = useContext(AdvertisementContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess, 
    notifyConfirm 
  } = useContext(NotificationContext);
  
  const [contentAdList, setContentAdList] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    token: userDetails?.token,
  });

  const sortList = (list) => {
    return [...list].sort((a, b) => {
      if (a.active !== b.active) return a.active ? -1 : 1;
      return new Date(b.createdTime) - new Date(a.createdTime);
    });
  };

  const getParentAdName = useCallback((id) => {
    const parent = adList.find(ad => ad.id === id);
    return parent ? parent.name : "Unknown Config";
  }, [adList]);

  // GET ALL - Always shows loading
  const fetchContentAds = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Loading Overlays...");
    try {
      const { data } = await api.call("vm2/content-advertisements", {
        method: "GET", 
        headers: getHeaders(),
      });
      if (data.success) {
        setContentAdList(sortList(data.response || []));
      } else {
        await notifyError(data.errorMessage || "Failed to load overlays");
      }
    } catch {
      notifyError("Network error: Failed to fetch overlays");
    } finally {
      closeLoading();
    }
  }, [userDetails?.token]);

  useEffect(() => {
    if (page === 102) {
      fetchContentAds();
      if (adList.length === 0) fetchAds(); // Fetch parents if missing
    }
  }, [page, fetchContentAds, adList.length, fetchAds]);

  // CREATE
  const addContentAd = async (adData) => {
    notifyLoading("Creating Overlay...");
    try {
      const { data } = await api.call("vm2/content-advertisements", {
        method: "POST", 
        headers: getHeaders(), 
        body: JSON.stringify(adData),
      });
      if (data.success) {
        notifySuccess("Overlay Created");
        await fetchContentAds(); // Full refresh
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
  const updateContentAd = async (id, adData) => {
    notifyLoading("Updating Overlay...");
    try {
      const { data } = await api.call(`vm2/content-advertisements/${id}`, {
        method: "PUT", 
        headers: getHeaders(), 
        body: JSON.stringify(adData),
      });
      if (data.success) {
        notifySuccess("Overlay Updated");
        await fetchContentAds(); // Full refresh
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

  // TOGGLE STATUS
  const toggleStatus = async (id, currentStatus) => {
    notifyLoading("Updating Status...");
    const endpoint = currentStatus ? 'deactivate' : 'activate';
    try {
      const { data } = await api.call(`vm2/content-advertisements/${id}/${endpoint}`, {
        method: "PATCH", 
        headers: getHeaders(),
      });
      if (data.success) {
        setContentAdList(prev => sortList(prev.map(ad => ad.id === id ? { ...ad, active: !currentStatus } : ad)));
        notifySuccess(!currentStatus ? "Overlay Activated" : "Overlay Deactivated");
      } else {
        await notifyError(data.errorMessage || "Status Change Failed");
      }
    } catch { 
      notifyError("Service error: Status Change Failed"); 
    } finally {
      closeLoading();
    }
  };

  // DELETE - Updated with notifyConfirm and data.errorMessage
  const deleteContentAd = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Are you sure you want to delete this overlay?");
    if (!ok) return;

    notifyLoading("Deleting Overlay...");
    try {
      const { data } = await api.call(`vm2/content-advertisements/${id}`, {
        method: "DELETE", 
        headers: getHeaders(),
      });
      if (data.success) {
        setContentAdList(prev => prev.filter(ad => ad.id !== id));
        notifySuccess("Overlay Deleted");
      } else {
        await notifyError(data.errorMessage || "Delete Failed");
      }
    } catch { 
      notifyError("Service error: Delete Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  return (
    <ContentAdvertisementContext.Provider value={{ 
      contentAdList, fetchContentAds, addContentAd, updateContentAd, 
      deleteContentAd, toggleStatus, getParentAdName, parentAds: adList 
    }}>
      {children}
    </ContentAdvertisementContext.Provider>
  );
}