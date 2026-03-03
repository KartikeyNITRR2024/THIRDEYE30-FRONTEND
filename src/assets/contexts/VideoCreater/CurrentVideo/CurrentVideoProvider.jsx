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

  const fetchCurrentVideo = useCallback(async () => {
    if (!userDetails?.token) return;
    try {
      const { data } = await api.call("vm2/current-video", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      if (data.success) {
        setCurrentVideo(data.response);
      }
    } catch (err) {
      console.error("Current video fetch failed", err);
    }
  }, [userDetails?.token]);

  const updateCurrentVideo = async (videoId) => {
    if (!userDetails?.token || !videoId) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/current-video/${videoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      if (data.success) {
        setCurrentVideo(data.response);
        notifySuccess("Active video updated");
      }
    } catch (err) {
      notifyError("Failed to update active video");
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if (page === 4) fetchCurrentVideo();
    else setCurrentVideo(null);
  }, [page, fetchCurrentVideo]);

  return (
    <CurrentVideoContext.Provider value={{ currentVideo, fetchCurrentVideo, updateCurrentVideo }}>
      {children}
    </CurrentVideoContext.Provider>
  );
}