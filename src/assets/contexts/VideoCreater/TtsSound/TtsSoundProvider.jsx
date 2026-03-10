import { useState, useEffect, useContext, useCallback } from "react";
import TtsSoundContext from "./TtsSoundContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function TtsSoundProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess,
    notifyConfirm // Standardized custom confirmation
  } = useContext(NotificationContext);
  
  const [soundList, setSoundList] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    token: userDetails.token,
  });

  /**
   * Helper function to sort voices: 
   * Active first, then by lastlyUsed date (descending)
   */
  const sortVoices = (list) => {
    return [...list].sort((a, b) => {
      if (a.active !== b.active) {
        return a.active ? -1 : 1;
      }
      return new Date(b.lastlyUsed) - new Date(a.lastlyUsed);
    });
  };

  // GET ALL - Standardized: No silent refresh, captures backend errors
  const fetchSounds = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Syncing Voice Library...");
    try {
      const { data } = await api.call("vm2/tts-sounds", {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) {
        setSoundList(sortVoices(data.response || []));
      } else {
        await notifyError(data.errorMessage || "Failed to load voices");
      }
    } catch (err) {
      notifyError("Network error: Could not reach voice service");
    } finally {
      closeLoading();
    }
  }, [userDetails?.token]);

  // CREATE
  const addSound = async (soundData) => {
    notifyLoading("Adding New Voice...");
    try {
      const { data } = await api.call("vm2/tts-sounds", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(soundData),
      });
      if (data.success) {
        notifySuccess("Voice Created");
        await fetchSounds(); // Full refresh
        return true;
      } else {
        await notifyError(data.errorMessage || "Creation Failed");
      }
    } catch { 
      notifyError("Service error: Creation Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  // UPDATE
  const updateSound = async (id, soundData) => {
    notifyLoading("Updating Voice Settings...");
    try {
      const { data } = await api.call(`vm2/tts-sounds/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(soundData),
      });
      if (data.success) {
        notifySuccess("Voice Updated");
        await fetchSounds(); // Full refresh
        return true;
      } else {
        await notifyError(data.errorMessage || "Update Failed");
      }
    } catch { 
      notifyError("Service error: Update Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  // TOGGLE STATUS
  const toggleSoundStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    notifyLoading(newStatus ? "Activating Voice..." : "Deactivating Voice...");
    try {
      const { data } = await api.call(`vm2/tts-sounds/${id}/${newStatus}`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (data.success) {
        notifySuccess(newStatus ? "Voice Activated" : "Voice Deactivated");
        await fetchSounds(); // Standardized full refresh ensures sorting is applied
      } else {
        await notifyError(data.errorMessage || "Status Update Failed");
      }
    } catch { 
      notifyError("Service error: Status Update Failed"); 
    } finally {
      closeLoading();
    }
  };

  // DELETE - Updated with notifyConfirm
  const deleteSound = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Permanently delete this voice configuration?");
    if (!ok) return;

    notifyLoading("Removing Voice...");
    try {
      const { data } = await api.call(`vm2/tts-sounds/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (data.success) {
        notifySuccess("Voice Removed");
        await fetchSounds();
      } else {
        await notifyError(data.errorMessage || "Delete Failed");
      }
    } catch { 
      notifyError("Service error: Delete Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  useEffect(() => {
    if (page === 79) {
      fetchSounds();
    } else {
      setSoundList([]);
    }
  }, [page, fetchSounds]);

  return (
    <TtsSoundContext.Provider value={{ 
      soundList, fetchSounds, addSound, updateSound, deleteSound, toggleSoundStatus 
    }}>
      {children}
    </TtsSoundContext.Provider>
  );
}