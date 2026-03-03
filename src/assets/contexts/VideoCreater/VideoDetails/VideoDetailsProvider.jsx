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

  // Standardized header helper
  const getHeaders = () => ({
    "Content-Type": "application/json",
    token: userDetails.token,
  });

  // FETCH ALL
  const fetchAllDetails = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/video-details", {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) {
        setDetailsList(data.response || []);
      }
    } catch {
      if (!silent) notifyError("Failed to Fetch Video Details");
    } finally {
      if (!silent) closeLoading();
    }
  }, [userDetails?.token]);

  // CREATE
  const createDetails = async (dto) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call("vm2/video-details", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(dto),
      });
      if (data.success) {
        notifySuccess("Video Details Saved Successfully");
        await fetchAllDetails(true);
        return true;
      }
    } catch {
      notifyError("Failed to Save Video Details");
    } finally {
      closeLoading();
    }
  };

  // UPDATE
  const updateDetails = async (id, dto) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/video-details/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(dto),
      });
      if (data.success) {
        notifySuccess("Video Details Updated Successfully");
        await fetchAllDetails(true);
        return true;
      }
    } catch {
      notifyError("Update Failed");
      return false;
    } finally {
      closeLoading();
    }
  };

  // DELETE
  const deleteDetails = async (id) => {
    if (!userDetails?.token) return;
    if (!window.confirm("Are you sure you want to delete these video details?")) return;

    notifyLoading();
    try {
      const { data } = await api.call(`vm2/video-details/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (data.success) {
        setDetailsList(prev => prev.filter(d => d.id !== id));
        notifySuccess("Video Details Deleted Successfully");
      }
    } catch {
      notifyError("Delete Failed");
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    // Triggers for pages 5 and 6
    if ([5, 6].includes(page)) {
      fetchAllDetails();
    } else {
      setDetailsList([]);
    }
  }, [page, fetchAllDetails]);

  return (
    <VideoDetailsContext.Provider value={{ 
      detailsList, 
      fetchAllDetails, 
      createDetails, 
      updateDetails, 
      deleteDetails 
    }}>
      {children}
    </VideoDetailsContext.Provider>
  );
}