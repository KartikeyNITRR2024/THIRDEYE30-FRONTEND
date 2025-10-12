import React, { useState, useContext } from "react";
import ThresoldContext from "./ThresoldContext";
import AuthContext from "../../Auth/AuthContext";
import Backend from "../../../properties/Backend";
import NotificationContext from "../../Notification/NotificationContext";

export default function ThresoldProvider({ children }) {
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifySuccess } = useContext(NotificationContext);

  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH WITH RETRY ----------------
  const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url, options);
        const data = await res.json();
        if (res.status >= 500) {
          if (i === retries - 1) return data;
          await new Promise((r) => setTimeout(r, delay));
        } else {
          return data;
        }
      } catch (err) {
        if (i === retries - 1) return { success: false, errorMessage: err.message, response: null };
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  };

  // ---------------- FETCH THRESHOLDS ----------------
  const fetchThresholds = async (groupId) => {
    if (!userDetails?.token || !groupId) return;
    setLoading(true);
    try {
      const data = await fetchWithRetry(
        `${Backend.THIRDEYEBACKEND.URL}um/user/thresholds/group/${groupId}`,
        { method: "GET", headers: { "Content-Type": "application/json", token: userDetails.token } }
      );

      if (data.success) {
        setThresholds(data.response || []);
      } else {
        notifyError(data.errorMessage || "Failed to load thresholds");
      }
    } catch {
      notifyError("Network error while fetching thresholds");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- ADD THRESHOLD ----------------
  const addThreshold = async (groupId, newThreshold) => {
    if (!userDetails?.token || !groupId || !newThreshold) return;

    try {
      const data = await fetchWithRetry(
        `${Backend.THIRDEYEBACKEND.URL}um/user/thresholds/group/${groupId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", token: userDetails.token },
          body: JSON.stringify(newThreshold),
        }
      );

      if (data.success) {
        notifySuccess("Threshold added successfully!");
        fetchThresholds(groupId); // reload
      } else {
        notifyError(data.errorMessage || "Failed to add threshold");
      }
    } catch {
      notifyError("Network error while adding threshold");
    }
  };

  // ---------------- DELETE THRESHOLD ----------------
  const deleteThreshold = async (thresholdId, groupId) => {
    if (!userDetails?.token || !thresholdId) return;

    try {
      const data = await fetchWithRetry(
        `${Backend.THIRDEYEBACKEND.URL}um/user/thresholds/${thresholdId}`,
        { method: "DELETE", headers: { "Content-Type": "application/json", token: userDetails.token } }
      );

      if (data.success) {
        notifySuccess("Threshold deleted successfully!");
        if (groupId) fetchThresholds(groupId); // reload
      } else {
        notifyError(data.errorMessage || "Failed to delete threshold");
      }
    } catch {
      notifyError("Network error while deleting threshold");
    }
  };

  return (
    <ThresoldContext.Provider
      value={{
        thresholds,
        loading,
        fetchThresholds,
        addThreshold,
        deleteThreshold,
      }}
    >
      {children}
    </ThresoldContext.Provider>
  );
}
