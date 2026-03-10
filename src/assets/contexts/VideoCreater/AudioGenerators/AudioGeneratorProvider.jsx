import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import AudioGeneratorContext from "./AudioGeneratorContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function AudioGeneratorProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess, 
    notifyConfirm 
  } = useContext(NotificationContext);
  
  const [audioList, setAudioList] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ 
    "Content-Type": "application/json", 
    token: userDetails.token 
  });

  const getBase = () => {
    return typeof api.getBaseUrl === 'function' ? api.getBaseUrl() : "http://localhost:8080/";
  };

  const getAudioUrl = (uuid) => {
    if (!uuid) return "";
    return `${getBase()}vm2/multimedia/view/${uuid}`;
  };

  const pendingCount = useMemo(() => {
    return audioList.filter(item => !item.isAudioGenerated).length;
  }, [audioList]);

  // GET ALL
  const fetchAudioList = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Syncing Audio Library...");
    
    try {
      const { data } = await api.call("vm2/audio-generate", {
        method: "GET",
        headers: getHeaders(),
      });
      
      if (data.success) {
        const sorted = (data.response || []).sort((a, b) => 
          new Date(b.createdTime) - new Date(a.createdTime)
        );
        setAudioList(sorted);
      } else {
        await notifyError(data.errorMessage || "Failed to load audio list");
      }
    } catch (err) {
      notifyError("Network error: Could not reach the server");
    } finally {
      closeLoading();
    }
  }, [userDetails?.token]);

  // CREATE
  const addAudio = async (content, autoDelete) => {
    if (!userDetails?.token) return;
    notifyLoading("Initializing Generation...");
    try {
      const { data } = await api.call("vm2/audio-generate", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ content, autoDelete, isAudioGenerated: false }),
      });
      
      if (data.success) {
        notifySuccess("Audio Generation Started");
        await fetchAudioList(); // Refresh after creation
        return true;
      } else {
        await notifyError(data.errorMessage || "Audio Creation Failed");
      }
    } catch {
      notifyError("Service error: Audio Creation Failed");
    } finally {
      closeLoading();
    }
  };

  // DELETE
  const deleteAudio = async (id) => {
    if (!userDetails?.token || !id) return;
    
    // Custom confirmation dialog
    const ok = await notifyConfirm("Are you sure you want to delete this audio?");
    if (!ok) return;
    
    notifyLoading("Deleting Audio Asset...");
    try {
      const { data } = await api.call(`vm2/audio-generate/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      
      if (data.success) {
        setAudioList(prev => prev.filter(item => item.id !== id));
        notifySuccess("Audio Deleted Successfully");
      } else {
        await notifyError(data.errorMessage || "Audio Delete Failed");
      }
    } catch {
      notifyError("Service error: Audio Delete Failed");
    } finally {
      closeLoading();
    }
  };

  // Removed Polling Interval entirely
  useEffect(() => {
    if (page === 2) {
      fetchAudioList();
    } else {
      setAudioList([]);
    }
  }, [page, fetchAudioList]);

  return (
    <AudioGeneratorContext.Provider
      value={{ audioList, pendingCount, fetchAudioList, addAudio, deleteAudio, getAudioUrl }}
    >
      {children}
    </AudioGeneratorContext.Provider>
  );
}