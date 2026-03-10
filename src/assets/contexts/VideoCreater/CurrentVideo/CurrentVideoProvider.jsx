import { useState, useEffect, useContext, useCallback } from "react";
import CurrentVideoContext from "./CurrentVideoContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function CurrentVideoProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  const [currentVideo, setCurrentVideo] = useState(null);
  const api = new ApiCaller();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    token: userDetails.token,
  });

  // GET - Standardized: No silent refresh, handles backend error messages
  const fetchCurrentVideo = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Syncing Active Video...");
    
    try {
      const { data } = await api.call("vm2/current-video", {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) {
        setCurrentVideo(data.response);
      } else {
        await notifyError(data.errorMessage || "Failed to fetch active video");
      }
    } catch (err) {
      notifyError("Network error: Could not load active video");
      console.error("Current video fetch failed", err);
    } finally {
      closeLoading();
    }
  }, [userDetails?.token]);

  // UPDATE
  const updateCurrentVideo = async (videoId) => {
    if (!userDetails?.token || !videoId) return;
    
    notifyLoading("Updating Selection...");
    try {
      const { data } = await api.call(`vm2/current-video/${videoId}`, {
        method: "PUT",
        headers: getHeaders(),
      });
      
      if (data.success) {
        setCurrentVideo(data.response);
        notifySuccess("Active Video Updated Successfully");
        return true;
      } else {
        await notifyError(data.errorMessage || "Failed to update active video");
      }
    } catch (err) {
      notifyError("Service error: Failed to update active video");
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    // If navigating to page 4 or 5, fetch data
    if (page === 4 || page === 5) {
      fetchCurrentVideo();
    } else {
      // Clear state when leaving the page to prevent stale data
      setCurrentVideo(null);
    }
  }, [page, fetchCurrentVideo]);

  return (
    <CurrentVideoContext.Provider value={{ 
        currentVideo, 
        fetchCurrentVideo, 
        updateCurrentVideo 
    }}>
      {children}
    </CurrentVideoContext.Provider>
  );
}