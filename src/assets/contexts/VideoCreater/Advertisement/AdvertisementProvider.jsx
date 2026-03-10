import { useState, useEffect, useContext, useCallback } from "react";
import AdvertisementContext from "./AdvertisementContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function AdvertisementProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess, 
    notifyConfirm // Added notifyConfirm
  } = useContext(NotificationContext);
  
  const [adList, setAdList] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    token: userDetails.token,
  });

  const sortAds = (list) => {
    return [...list].sort((a, b) => {
      if (a.active !== b.active) return a.active ? -1 : 1;
      return new Date(b.createdTime) - new Date(a.createdTime);
    });
  };

  // GET ALL - Removed silent logic, always shows loading
  const fetchAds = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Fetching Advertisements...");
    try {
      const { data } = await api.call("vm2/advertisements", {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) {
        setAdList(sortAds(data.response || []));
      } else {
        await notifyError(data.errorMessage || "Failed to load ads");
      }
    } catch (err) {
      notifyError("Network error: Failed to fetch ads");
    } finally {
      closeLoading();
    }
  }, [userDetails?.token]);

  // CREATE
  const addAd = async (adData) => {
    notifyLoading("Creating Ad Config...");
    try {
      const { data } = await api.call("vm2/advertisements", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(adData),
      });
      if (data.success) {
        notifySuccess("Ad Config Created");
        await fetchAds(); // Full refresh
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
  const updateAd = async (id, adData) => {
    notifyLoading("Updating Ad Config...");
    try {
      const { data } = await api.call(`vm2/advertisements/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(adData),
      });
      if (data.success) {
        notifySuccess("Ad Config Updated");
        await fetchAds(); // Full refresh
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
  const toggleAdStatus = async (id, currentStatus) => {
    notifyLoading("Updating Status...");
    try {
      const { data } = await api.call(`vm2/advertisements/${id}/${currentStatus ? 'deactivate' : 'activate'}`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (data.success) {
        setAdList(prev => sortAds(prev.map(ad => ad.id === id ? { ...ad, active: !currentStatus } : ad)));
        notifySuccess(!currentStatus ? "Ad Activated" : "Ad Deactivated");
      } else {
        await notifyError(data.errorMessage || "Status Change Failed");
      }
    } catch { 
      notifyError("Service error: Status Change Failed"); 
    } finally {
      closeLoading();
    }
  };

  // DELETE - Updated with notifyConfirm and data.errorMessage logic
  const deleteAd = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Are you sure you want to delete this advertisement configuration?");
    if (!ok) return;

    notifyLoading("Deleting Ad Config...");
    try {
      const { data } = await api.call(`vm2/advertisements/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (data.success) {
        setAdList(prev => prev.filter(ad => ad.id !== id));
        notifySuccess("Ad Deleted");
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
    if (page === 101 || page === 3) fetchAds();
  }, [page, fetchAds]);

  return (
    <AdvertisementContext.Provider value={{ 
      adList, fetchAds, addAd, updateAd, deleteAd, toggleAdStatus 
    }}>
      {children}
    </AdvertisementContext.Provider>
  );
}