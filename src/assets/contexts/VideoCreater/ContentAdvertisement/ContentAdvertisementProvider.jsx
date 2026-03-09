import { useState, useEffect, useContext, useCallback } from "react";
import ContentAdvertisementContext from "./ContentAdvertisementContext";
import AdvertisementContext from "../Advertisement/AdvertisementContext"; // Import Parent Context
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function ContentAdvertisementProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { adList, fetchAds } = useContext(AdvertisementContext); // Get parent ads
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  
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

  // Helper function to get Parent Ad Name from ID
  const getParentAdName = useCallback((id) => {
    const parent = adList.find(ad => ad.id === id);
    return parent ? parent.name : "Unknown Config";
  }, [adList]);

  const fetchContentAds = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/content-advertisements", {
        method: "GET", headers: getHeaders(),
      });
      if (data.success) setContentAdList(sortList(data.response || []));
    } catch {
      if (!silent) notifyError("Failed to load overlays");
    } finally {
      if (!silent) closeLoading();
    }
  }, [userDetails?.token]);

  // Ensure parent ads are loaded when we are on the content page
  useEffect(() => {
    if (page === 102) {
      fetchContentAds();
      if (adList.length === 0) fetchAds(true); // Fetch parents silently if missing
    }
  }, [page, fetchContentAds, adList.length, fetchAds]);

  const addContentAd = async (adData) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/content-advertisements", {
        method: "POST", headers: getHeaders(), body: JSON.stringify(adData),
      });
      if (data.success) {
        notifySuccess("Overlay Created");
        await fetchContentAds(true);
        return true;
      }
    } catch { notifyError("Creation Failed"); } 
    finally { closeLoading(); }
  };

  const updateContentAd = async (id, adData) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/content-advertisements/${id}`, {
        method: "PUT", headers: getHeaders(), body: JSON.stringify(adData),
      });
      if (data.success) {
        notifySuccess("Overlay Updated");
        await fetchContentAds(true);
        return true;
      }
    } catch { notifyError("Update Failed"); }
    finally { closeLoading(); }
  };

  const toggleStatus = async (id, currentStatus) => {
    const endpoint = currentStatus ? 'deactivate' : 'activate';
    try {
      const { data } = await api.call(`vm2/content-advertisements/${id}/${endpoint}`, {
        method: "PATCH", headers: getHeaders(),
      });
      if (data.success) {
        setContentAdList(prev => sortList(prev.map(ad => ad.id === id ? { ...ad, active: !currentStatus } : ad)));
        notifySuccess(!currentStatus ? "Overlay Activated" : "Overlay Deactivated");
      }
    } catch { notifyError("Status Change Failed"); }
  };

  const deleteContentAd = async (id) => {
    if (!window.confirm("Delete this overlay?")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/content-advertisements/${id}`, {
        method: "DELETE", headers: getHeaders(),
      });
      if (data.success) {
        setContentAdList(prev => prev.filter(ad => ad.id !== id));
        notifySuccess("Overlay Deleted");
      }
    } catch { notifyError("Delete Failed"); }
    finally { closeLoading(); }
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