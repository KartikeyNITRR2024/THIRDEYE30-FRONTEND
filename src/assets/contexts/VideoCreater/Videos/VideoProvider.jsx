import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import VideoContext from "./VideoContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function VideoProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  const [videoList, setVideoList] = useState([]);
  const api = new ApiCaller();

  // Standardized header helper
  const getHeaders = () => ({
    "Content-Type": "application/json",
    token: userDetails.token,
  });

  // Calculate pending items for the UI
  const pendingVideosCount = useMemo(() => {
    return videoList.filter(v => !v.isCompleted).length;
  }, [videoList]);

  // FETCH ALL VIDEOS
  const fetchVideos = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/videos", {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) {
        // Sort descending by createdDateTime
        const sorted = (data.response || []).sort((a, b) => 
          new Date(b.createdDateTime) - new Date(a.createdDateTime)
        );
        setVideoList(sorted);
      }
    } catch (err) {
      if (!silent) notifyError("Failed to fetch videos");
    } finally {
      if (!silent) closeLoading();
    }
  }, [userDetails?.token]);

  // ADD VIDEO
  const addVideo = async (videoData) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call("vm2/videos", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ ...videoData, isCompleted: false }),
      });
      if (data.success) {
        notifySuccess("Video Created Successfully");
        await fetchVideos(true);
        return true;
      }
    } catch {
      notifyError("Video Creation Failed");
    } finally {
      closeLoading();
    }
  };

  // UPDATE VIDEO
  const updateVideo = async (id, videoData) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/videos/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(videoData),
      });
      if (data.success) {
        notifySuccess("Video Updated Successfully");
        await fetchVideos(true);
        return true;
      }
    } catch {
      notifyError("Video Update Failed");
      return false;
    } finally {
      closeLoading();
    }
  };

  // DELETE VIDEO
  const deleteVideo = async (id) => {
    if (!userDetails?.token) return;
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    notifyLoading();
    try {
      const { data } = await api.call(`vm2/videos/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (data.success) {
        setVideoList(prev => prev.filter(v => v.id !== id));
        notifySuccess("Video Deleted Successfully");
      }
    } catch {
      notifyError("Video Delete Failed");
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
      deleteVideo 
    }}>
      {children}
    </VideoContext.Provider>
  );
}