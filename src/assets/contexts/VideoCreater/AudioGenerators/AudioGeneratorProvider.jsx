import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import AudioGeneratorContext from "./AudioGeneratorContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function AudioGeneratorProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  const [audioList, setAudioList] = useState([]);
  const api = new ApiCaller();

  const getBase = () => {
    return typeof api.getBaseUrl === 'function' ? api.getBaseUrl() : "http://localhost:8080/";
  };

  const getAudioUrl = (uuid) => {
    if (!uuid) return "";
    return `${getBase()}vm2/multimedia/view/${uuid}`;
  };

  // Calculate pending items for the UI badge
  const pendingCount = useMemo(() => {
    return audioList.filter(item => !item.isAudioGenerated).length;
  }, [audioList]);

  // GET ALL - Sorted by createdTime Descending
  const fetchAudioList = useCallback(async (showLoading = true) => {
    if (!userDetails?.token) return;
    if (showLoading) notifyLoading();
    
    try {
      const { data } = await api.call("vm2/audio-generate", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      
      if (data.success) {
        const sorted = (data.response || []).sort((a, b) => 
          new Date(b.createdTime) - new Date(a.createdTime)
        );
        setAudioList(sorted);
      }
    } catch (err) {
      if (showLoading) notifyError("Failed to fetch audio list");
    } finally {
      if (showLoading) closeLoading();
    }
  }, [userDetails?.token]);

  // CREATE
  const addAudio = async (content, autoDelete) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call("vm2/audio-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", token: userDetails.token },
        body: JSON.stringify({ content, autoDelete, isAudioGenerated: false }),
      });
      if (data.success) {
        notifySuccess("Generation Started");
        fetchAudioList(false);
      }
    } catch {
      notifyError("Creation failed");
    } finally {
      closeLoading();
    }
  };

  // DELETE
  const deleteAudio = async (id) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/audio-generate/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      if (data.success) {
        setAudioList(prev => prev.filter(item => item.id !== id));
        notifySuccess("Deleted");
      }
    } catch {
      notifyError("Delete failed");
    } finally {
      closeLoading();
    }
  };

  // Auto-Refresh Polling: Checks every 5s if items are pending
  useEffect(() => {
    let interval;
    if (page === 2 && pendingCount > 0) {
      interval = setInterval(() => {
        fetchAudioList(false); // Silent refresh
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [page, pendingCount, fetchAudioList]);

  useEffect(() => {
    if (page === 2) fetchAudioList();
    else setAudioList([]);
  }, [page, fetchAudioList]);

  return (
    <AudioGeneratorContext.Provider
      value={{ audioList, pendingCount, fetchAudioList, addAudio, deleteAudio, getAudioUrl }}
    >
      {children}
    </AudioGeneratorContext.Provider>
  );
}