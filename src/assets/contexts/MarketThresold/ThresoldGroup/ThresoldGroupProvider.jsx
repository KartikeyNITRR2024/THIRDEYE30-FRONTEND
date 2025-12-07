import { useState, useEffect, useContext } from "react";
import ThresoldGroupContext from "./ThresoldGroupContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import MarketThresoldContext from "../MarketThresold/MarketThresoldContext";

export default function ThresoldGroupProvider({ children }) {
  const { userDetails, login } = useContext(AuthContext);
  const { notifyError, notifySuccess, notifyLoading, closeLoading, notifyConfirm, notifyPrompt } = useContext(NotificationContext);
  const { page } = useContext(MarketThresoldContext);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const api = new ApiCaller();

  const fetchThresoldGroups = async () => {
    if (!userDetails?.userId || !userDetails?.token) return;
    notifyLoading();

    try {
      const { data } = await api.call(
        `um/user/threshold-groups/user/${userDetails.userId}`,
        { method: "GET", headers: { "Content-Type": "application/json", token: userDetails.token } }
      );

      setGroups(data?.success ? data.response || [] : []);
      if (!data?.success) await notifyError(data?.errorMessage || "Failed to load threshold groups");
    } catch {
      await notifyError("Network error fetching threshold groups");
    } finally {
      closeLoading();
    }
  };

  const addGroup = async () => {
  if (!userDetails?.userId || !userDetails?.token) return;

  // 🔥 Ask user for group name using SweetAlert prompt
  const groupName = await notifyPrompt(
    "Enter group name",
    "Create",
    "Cancel"
  );

  if (!groupName) return; // user cancelled

  // Build payload
  const payload = {
    groupName,
    active: true,
    allStocks: false,
    stockList: "",
  };

  notifyLoading("Creating Group");

  try {
    const { data } = await api.call(
      `um/user/threshold-groups/user/${userDetails.userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: userDetails.token,
        },
        body: JSON.stringify(payload),
      }
    );

    if (data?.success) {
      setGroups((prev) => [
        ...prev,
        { ...payload, id: data.response?.id ?? Date.now() },
      ]);

      await notifySuccess("Group created successfully!");
    } else {
      await notifyError(data?.errorMessage || "Failed to create group");
    }
  } catch {
    await notifyError("Network error. Could not create group.");
  } finally {
    closeLoading();
  }
};


  const fetchGroupById = async (groupId) => {
    if (!userDetails?.userId || !userDetails?.token) return null;
    notifyLoading();
    try {
      const { data } = await api.call(
        `um/user/threshold-groups/${groupId}`,
        { method: "GET", headers: { "Content-Type": "application/json", token: userDetails.token } }
      );

      if (data?.success) return data.response;
      await notifyError(data?.errorMessage || "Failed to fetch group details");
      return null;
    } catch {
      await notifyError("Network error fetching group details.");
      return null;
    } finally {
      closeLoading();
    }
  };

  const updateGroupStatus = async (groupId, newActiveStatus, allStocks, stockList) => {
    if (!userDetails?.userId || !userDetails?.token) return;

    const currentGroup = groups.find((g) => g.id === groupId);
    if (!currentGroup) return;
    notifyLoading("Updating status");
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
        await notifySuccess("Group updated successfully!");
      } else {
        await notifyError(data?.errorMessage || "Failed to update group status");
      }
    } catch {
      await notifyError("Network error updating group status.");
    } finally {
      closeLoading();
    }
  };

  const deleteGroup = async (groupId) => {
  if (!userDetails?.userId || !userDetails?.token) return;
  const ok = await notifyConfirm("Are you sure you want to delete this group?");
  if (!ok) return;

  notifyLoading("Deleting thresold group");
  try {
    const { data } = await api.call(
      `um/user/threshold-groups/${groupId}`,
      { method: "DELETE", headers: { "Content-Type": "application/json", token: userDetails.token } }
    );

    if (data?.success) {
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
      await notifySuccess("Group deleted successfully!");
    } else {
      await notifyError(data?.errorMessage || "Failed to delete group");
    }
  } catch {
    await notifyError("Network error deleting group.");
  } finally {
    closeLoading();
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
