import { useState, useEffect, useContext, useCallback } from "react";
import TtsSoundContext from "./TtsSoundContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function TtsSoundProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
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
      // If one is active and the other isn't, active wins
      if (a.active !== b.active) {
        return a.active ? -1 : 1;
      }
      // If both have same active status, sort by last used date
      return new Date(b.lastlyUsed) - new Date(a.lastlyUsed);
    });
  };

  // GET ALL
  const fetchSounds = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/tts-sounds", {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) {
        // Apply sorting here
        setSoundList(sortVoices(data.response || []));
      }
    } catch (err) {
      if (!silent) notifyError("Failed to load voices");
    } finally {
      if (!silent) closeLoading();
    }
  }, [userDetails?.token]);

  // CREATE
  const addSound = async (soundData) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/tts-sounds", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(soundData),
      });
      if (data.success) {
        notifySuccess("Voice Created");
        await fetchSounds(true);
        return true;
      }
    } catch { notifyError("Creation Failed"); } 
    finally { closeLoading(); }
  };

  // UPDATE
  const updateSound = async (id, soundData) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/tts-sounds/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(soundData),
      });
      if (data.success) {
        notifySuccess("Voice Updated");
        await fetchSounds(true);
        return true;
      }
    } catch { notifyError("Update Failed"); }
    finally { closeLoading(); }
  };

  // TOGGLE STATUS (Active/Inactive)
  const toggleSoundStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      const { data } = await api.call(`vm2/tts-sounds/${id}/${newStatus}`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (data.success) {
        // Update local state and re-sort so the item moves position if needed
        setSoundList(prev => {
          const updatedList = prev.map(s => s.id === id ? { ...s, active: newStatus } : s);
          return sortVoices(updatedList);
        });
        notifySuccess(newStatus ? "Voice Activated" : "Voice Deactivated");
      }
    } catch { notifyError("Status Update Failed"); }
  };

  // DELETE
  const deleteSound = async (id) => {
    if (!window.confirm("Permanent delete this voice?")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/tts-sounds/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (data.success) {
        setSoundList(prev => prev.filter(s => s.id !== id));
        notifySuccess("Voice Removed");
      }
    } catch { notifyError("Delete Failed"); }
    finally { closeLoading(); }
  };

  useEffect(() => {
    if (page === 79) fetchSounds();
  }, [page, fetchSounds]);

  return (
    <TtsSoundContext.Provider value={{ 
      soundList, fetchSounds, addSound, updateSound, deleteSound, toggleSoundStatus 
    }}>
      {children}
    </TtsSoundContext.Provider>
  );
}