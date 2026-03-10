import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import VideoContext from "./VideoContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function VideoProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess,
    notifyConfirm // Standardized custom confirmation
  } = useContext(NotificationContext);
  
  const [videoList, setVideoList] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    token: userDetails.token,
  });

  const getBase = () => {
    return typeof api.getBaseUrl === 'function' ? api.getBaseUrl() : "http://localhost:8080/";
  };

  const getAudioUrl = (uuid) => {
    if (!uuid) return "";
    return `${getBase()}vm2/multimedia/view/${uuid}`;
  };

  // UI Helper: Calculate pending items
  const pendingVideosCount = useMemo(() => {
    return videoList.filter(v => !v.isCompleted).length;
  }, [videoList]);

  // FETCH ALL - Standardized: No silent refresh, captures backend errors
  const fetchVideos = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Syncing Video Queue...");
    try {
      const { data } = await api.call("vm2/videos", {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) {
        const sorted = (data.response || []).sort((a, b) => 
          new Date(b.createdDateTime) - new Date(a.createdDateTime)
        );
        setVideoList(sorted);
      } else {
        await notifyError(data.errorMessage || "Failed to fetch videos");
      }
    } catch (err) {
      notifyError("Network error: Could not reach video service");
    } finally {
      closeLoading();
    }
  }, [userDetails?.token]);

  // ADD VIDEO
  const addVideo = async (videoData) => {
    if (!userDetails?.token) return;
    notifyLoading("Initializing Video Generation...");
    try {
      const { data } = await api.call("vm2/videos", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ ...videoData, isCompleted: false }),
      });
      if (data.success) {
        notifySuccess("Video Created Successfully");
        await fetchVideos(); // Full refresh for UI transparency
        return true;
      } else {
        await notifyError(data.errorMessage || "Video Creation Failed");
      }
    } catch {
      notifyError("Service error: Video Creation Failed");
    } finally {
      closeLoading();
    }
  };

  // UPDATE VIDEO
  const updateVideo = async (id, videoData) => {
    if (!userDetails?.token) return;
    notifyLoading("Updating Video Settings...");
    try {
      const { data } = await api.call(`vm2/videos/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(videoData),
      });
      if (data.success) {
        notifySuccess("Video Updated Successfully");
        await fetchVideos(); // Full refresh
        return true;
      } else {
        await notifyError(data.errorMessage || "Video Update Failed");
      }
    } catch {
      notifyError("Service error: Video Update Failed");
      return false;
    } finally {
      closeLoading();
    }
  };

  // DELETE VIDEO - Updated with notifyConfirm
  const deleteVideo = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Are you sure you want to delete this video? This cannot be undone.");
    if (!ok) return;

    notifyLoading("Removing Video...");
    try {
      const { data } = await api.call(`vm2/videos/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (data.success) {
        notifySuccess("Video Deleted Successfully");
        await fetchVideos(); // Ensure list is 100% accurate
      } else {
        await notifyError(data.errorMessage || "Video Delete Failed");
      }
    } catch {
      notifyError("Service error: Delete Failed");
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if ([3, 4, 5].includes(page)) {
      fetchVideos();
    } else {
      setVideoList([]);
    }
  }, [page, fetchVideos]);

  return (
    <VideoContext.Provider value={{ 
      videoList, 
      pendingVideosCount, 
      fetchVideos, 
      addVideo, 
      updateVideo, 
      deleteVideo,
      getAudioUrl 
    }}>
      {children}
    </VideoContext.Provider>
  );
}