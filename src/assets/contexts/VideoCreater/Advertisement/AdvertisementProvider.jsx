import { useState, useEffect, useContext, useCallback } from "react";
import AdvertisementContext from "./AdvertisementContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function AdvertisementProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
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

  // GET ALL
  const fetchAds = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/advertisements", {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) setAdList(sortAds(data.response || []));
    } catch (err) {
      if (!silent) notifyError("Failed to load ads");
    } finally {
      if (!silent) closeLoading();
    }
  }, [userDetails?.token]);

  // CREATE
  const addAd = async (adData) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/advertisements", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(adData),
      });
      if (data.success) {
        notifySuccess("Ad Config Created");
        await fetchAds(true);
        return true;
      }
    } catch { notifyError("Creation Failed"); } 
    finally { closeLoading(); }
  };

  // UPDATE
  const updateAd = async (id, adData) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/advertisements/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(adData),
      });
      if (data.success) {
        notifySuccess("Ad Config Updated");
        await fetchAds(true);
        return true;
      }
    } catch { notifyError("Update Failed"); }
    finally { closeLoading(); }
  };

  // TOGGLE STATUS (Uses your activate/deactivate endpoints)
  const toggleAdStatus = async (id, currentStatus) => {
    const endpoint = currentStatus ? 'deactivate' : 'activate';
    try {
      const { data } = await api.call(`vm2/advertisements/${id}/${endpoint}`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (data.success) {
        setAdList(prev => sortAds(prev.map(ad => ad.id === id ? { ...ad, active: !currentStatus } : ad)));
        notifySuccess(!currentStatus ? "Ad Activated" : "Ad Deactivated");
      }
    } catch { notifyError("Status Change Failed"); }
  };

  // DELETE
  const deleteAd = async (id) => {
    if (!window.confirm("Delete this advertisement configuration?")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/advertisements/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (data.success) {
        setAdList(prev => prev.filter(ad => ad.id !== id));
        notifySuccess("Ad Deleted");
      }
    } catch { notifyError("Delete Failed"); }
    finally { closeLoading(); }
  };

  useEffect(() => {
    if (page === 101) fetchAds();
  }, [page, fetchAds]);

  return (
    <AdvertisementContext.Provider value={{ 
      adList, fetchAds, addAd, updateAd, deleteAd, toggleAdStatus 
    }}>
      {children}
    </AdvertisementContext.Provider>
  );
}