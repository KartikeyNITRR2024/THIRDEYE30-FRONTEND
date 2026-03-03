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

  const fetchCurrentVideo = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    
    try {
      const { data } = await api.call("vm2/current-video", {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) {
        setCurrentVideo(data.response);
      }
    } catch (err) {
      if (!silent) notifyError("Failed to fetch active video");
      console.error("Current video fetch failed", err);
    } finally {
      if (!silent) closeLoading();
    }
  }, [userDetails?.token]);

  const updateCurrentVideo = async (videoId) => {
    if (!userDetails?.token || !videoId) return;
    
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/current-video/${videoId}`, {
        method: "PUT",
        headers: getHeaders(),
      });
      
      if (data.success) {
        setCurrentVideo(data.response);
        notifySuccess("Active Video Updated Successfully");
        return true;
      }
    } catch (err) {
      notifyError("Failed to update active video");
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    // If navigating to page 4, fetch data
    if (page === 4) {
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