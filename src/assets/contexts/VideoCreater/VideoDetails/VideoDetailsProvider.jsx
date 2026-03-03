import { useState, useEffect, useContext, useCallback } from "react";
import VideoDetailsContext from "./VideoDetailsContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function VideoDetailsProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  const [detailsList, setDetailsList] = useState([]);
  const api = new ApiCaller();

  const fetchAllDetails = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/video-details", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      if (data.success) {
        setDetailsList(data.response || []);
      }
    } catch {
      if (!silent) notifyError("Failed to fetch details");
    } finally {
      if (!silent) closeLoading();
    }
  }, [userDetails?.token]);

  const createDetails = async (dto) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call("vm2/video-details", {
        method: "POST",
        headers: { "Content-Type": "application/json", token: userDetails.token },
        body: JSON.stringify(dto),
      });
      if (data.success) {
        notifySuccess("Details Saved");
        await fetchAllDetails(true);
      }
    } catch {
      notifyError("Save failed");
    } finally {
      closeLoading();
    }
  };

  const updateDetails = async (id, dto) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/video-details/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", token: userDetails.token },
        body: JSON.stringify(dto),
      });
      if (data.success) {
        notifySuccess("Updated Successfully");
        await fetchAllDetails(true);
        return true;
      }
    } catch {
      notifyError("Update failed");
      return false;
    } finally {
      closeLoading();
    }
  };

  const deleteDetails = async (id) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/video-details/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      if (data.success) {
        setDetailsList(prev => prev.filter(d => d.id !== id));
        notifySuccess("Deleted");
      }
    } catch {
      notifyError("Delete failed");
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if (page === 5 || page == 6) fetchAllDetails();
    else setDetailsList([]);
  }, [page, fetchAllDetails]);

  return (
    <VideoDetailsContext.Provider value={{ detailsList, fetchAllDetails, createDetails, updateDetails, deleteDetails }}>
      {children}
    </VideoDetailsContext.Provider>
  );
}