import { useState, useContext, useEffect } from "react";
import ThresoldContext from "./ThresoldContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import MarketThresoldContext from "../MarketThresold/MarketThresoldContext";

export default function ThresoldProvider({ children }) {
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifySuccess } = useContext(NotificationContext);
  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const { page } = useContext(MarketThresoldContext);
  const api = new ApiCaller();

  const fetchThresholds = async (groupId) => {
    if (!userDetails?.token || !groupId) return;
    setLoading(true);

    try {
      const { data } = await api.call(`um/user/thresholds/group/${groupId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: userDetails.token,
        },
      });

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

  const addThreshold = async (groupId, newThreshold) => {
    if (!userDetails?.token || !groupId || !newThreshold) return;

    try {
      const { data } = await api.call(`um/user/thresholds/group/${groupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: userDetails.token,
        },
        body: JSON.stringify(newThreshold),
      });

      if (data.success) {
        notifySuccess("Threshold added successfully!");
        fetchThresholds(groupId);
      } else {
        notifyError(data.errorMessage || "Failed to add threshold");
      }
    } catch {
      notifyError("Network error while adding threshold");
    }
  };

  const deleteThreshold = async (thresholdId, groupId) => {
    if (!userDetails?.token || !thresholdId) return;

    try {
      const { data } = await api.call(`um/user/thresholds/${thresholdId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: userDetails.token,
        },
      });

      if (data.success) {
        notifySuccess("Threshold deleted successfully!");
        if (groupId) fetchThresholds(groupId);
      } else {
        notifyError(data.errorMessage || "Failed to delete threshold");
      }
    } catch {
      notifyError("Network error while deleting threshold");
    }
  };

  useEffect(() => {
    if (page === "group") {
      setThresholds([]);
    }
  }, [page]);

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

// Summary:
// 1. Manages fetching, adding, and deleting thresholds for a group.
// 2. Uses ApiCaller for API requests with retry and optional timeout.
// 3. Maintains thresholds state and loading indicator for child components.
// 4. Provides notifySuccess and notifyError feedback via NotificationContext.
