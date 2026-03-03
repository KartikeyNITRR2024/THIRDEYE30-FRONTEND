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

  const pendingVideosCount = useMemo(() => {
    return videoList.filter(v => !v.isCompleted).length;
  }, [videoList]);

  const fetchVideos = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/videos", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: userDetails.token },
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

  const addVideo = async (videoData) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call("vm2/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json", token: userDetails.token },
        body: JSON.stringify({ ...videoData, isCompleted: false }),
      });
      if (data.success) {
        notifySuccess("Created Successfully");
        await fetchVideos(true);
      }
    } catch {
      notifyError("Creation failed");
    } finally {
      closeLoading();
    }
  };

  const updateVideo = async (id, videoData) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", token: userDetails.token },
        body: JSON.stringify(videoData),
      });
      if (data.success) {
        notifySuccess("Updated Successfully");
        await fetchVideos(true);
        return true;
      }
    } catch {
      notifyError("Update failed");
      return false;
    } finally {
      closeLoading();
    }
  };

  const deleteVideo = async (id) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/videos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      if (data.success) {
        setVideoList(prev => prev.filter(v => v.id !== id));
        notifySuccess("Deleted");
      }
    } catch {
      notifyError("Delete failed");
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if (page === 3 || page === 4 || page === 5) fetchVideos();
    else setVideoList([])
  }, [page, fetchVideos]);

  return (
    <VideoContext.Provider value={{ videoList, pendingVideosCount, fetchVideos, addVideo, updateVideo, deleteVideo }}>
      {children}
    </VideoContext.Provider>
  );
}