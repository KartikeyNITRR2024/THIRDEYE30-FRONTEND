import { useState, useEffect, useContext } from "react";
import ThresoldGroupContext from "./ThresoldGroupContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import MarketThresoldContext from "../MarketThresold/MarketThresoldContext";

export default function ThresoldGroupProvider({ children }) {
  const { userDetails, login } = useContext(AuthContext);
  const { notifyError, notifySuccess } = useContext(NotificationContext);
  const { page } = useContext(MarketThresoldContext);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const api = new ApiCaller();

  const fetchThresoldGroups = async () => {
    if (!userDetails?.userId || !userDetails?.token) return;
    setLoading(true);

    try {
      const { data } = await api.call(
        `um/user/threshold-groups/user/${userDetails.userId}`,
        { method: "GET", headers: { "Content-Type": "application/json", token: userDetails.token } }
      );

      setGroups(data?.success ? data.response || [] : []);
      if (!data?.success) notifyError(data?.errorMessage || "Failed to load threshold groups");
    } catch {
      notifyError("Network error fetching threshold groups");
    } finally {
      setLoading(false);
    }
  };

  const addGroup = async (newGroup) => {
    if (!userDetails?.userId || !userDetails?.token) return;

    const payload = { groupName: newGroup.groupName, active: true, allStocks: false, stockList: "" };

    try {
      const { data } = await api.call(
        `um/user/threshold-groups/user/${userDetails.userId}`,
        { method: "POST", headers: { "Content-Type": "application/json", token: userDetails.token }, body: JSON.stringify(payload) }
      );

      if (data?.success) {
        setGroups((prev) => [...prev, { ...payload, id: data.response?.id ?? Date.now() }]);
        notifySuccess("Group created successfully!");
      } else {
        notifyError(data?.errorMessage || "Failed to create group");
      }
    } catch {
      notifyError("Network error. Could not create group.");
    }
  };

  const fetchGroupById = async (groupId) => {
    if (!userDetails?.userId || !userDetails?.token) return null;

    try {
      const { data } = await api.call(
        `um/user/threshold-groups/${groupId}`,
        { method: "GET", headers: { "Content-Type": "application/json", token: userDetails.token } }
      );

      if (data?.success) return data.response;
      notifyError(data?.errorMessage || "Failed to fetch group details");
      return null;
    } catch {
      notifyError("Network error fetching group details.");
      return null;
    }
  };

  const updateGroupStatus = async (groupId, newActiveStatus, allStocks, stockList) => {
    if (!userDetails?.userId || !userDetails?.token) return;

    const currentGroup = groups.find((g) => g.id === groupId);
    if (!currentGroup) return;

    const payload = {
      groupName: currentGroup.groupName,
      active: newActiveStatus ?? currentGroup.active,
      allStocks: allStocks ?? currentGroup.allStocks,
      stockList: (stockList ?? currentGroup.stockList) || "",
    };

    try {
      const { data } = await api.call(
        `um/user/threshold-groups/${groupId}`,
        { method: "PUT", headers: { "Content-Type": "application/json", token: userDetails.token }, body: JSON.stringify(payload) }
      );

      if (data?.success) {
        setGroups((prev) =>
          prev.map((g) => (g.id === groupId ? { ...g, ...payload } : g))
        );
        notifySuccess("Group updated successfully!");
      } else {
        notifyError(data?.errorMessage || "Failed to update group status");
      }
    } catch {
      notifyError("Network error updating group status.");
    }
  };

  const deleteGroup = async (groupId) => {
    if (!userDetails?.userId || !userDetails?.token) return;

    try {
      const { data } = await api.call(
        `um/user/threshold-groups/${groupId}`,
        { method: "DELETE", headers: { "Content-Type": "application/json", token: userDetails.token } }
      );

      if (data?.success) {
        setGroups((prev) => prev.filter((g) => g.id !== groupId));
        notifySuccess("Group deleted successfully!");
      } else {
        notifyError(data?.errorMessage || "Failed to delete group");
      }
    } catch {
      notifyError("Network error deleting group.");
    }
  };

  useEffect(() => {
    if (login) fetchThresoldGroups();
    else setGroups([]);
  }, [login]);

  useEffect(() => {
    if (page === "group") {
      fetchThresoldGroups();
    }
  }, [page]);

  return (
    <ThresoldGroupContext.Provider
      value={{
        groups,
        loading,
        fetchThresoldGroups,
        addGroup,
        fetchGroupById,
        updateGroupStatus,
        deleteGroup,
      }}
    >
      {children}
    </ThresoldGroupContext.Provider>
  );
}

/*
Summary:
1. Fetches, adds, updates, and deletes threshold groups via ApiCaller.
2. Nullish coalescing ensures proper fallback values without parse errors.
3. Maintains local state for groups and loading for UI updates.
4. Notifications are handled through NotificationContext for success/error feedback.
*/
