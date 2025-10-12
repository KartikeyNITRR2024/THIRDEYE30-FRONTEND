import React, { useState, useEffect, useContext } from "react";
import ThresoldGroupContext from "./ThresoldGroupContext";
import AuthContext from "../../Auth/AuthContext";
import Backend from "../../../properties/Backend";
import NotificationContext from "../../Notification/NotificationContext";

export default function ThresoldGroupProvider({ children }) {
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifySuccess } = useContext(NotificationContext);

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH GROUPS ----------------
  const fetchThresoldGroups = async (retries = 3, delay = 1000) => {
    if (!userDetails?.userId || !userDetails?.token) return;

    setLoading(true);
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(
          `${Backend.THIRDEYEBACKEND.URL}um/user/threshold-groups/user/${userDetails.userId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json", token: userDetails.token },
          }
        );

        const data = await response.json();

        if (response.status >= 500) {
          if (i === retries - 1) notifyError("Server error fetching groups");
          await new Promise((res) => setTimeout(res, delay));
        } else {
          if (data.success) {
            setGroups(data.response || []);
          } else {
            notifyError(data.errorMessage || "Failed to load threshold groups");
          }
          setLoading(false);
          return;
        }
      } catch (err) {
        if (i === retries - 1) notifyError("Network error fetching threshold groups");
        await new Promise((res) => setTimeout(res, delay));
      }
    }
    setLoading(false);
  };

  // ---------------- ADD NEW GROUP ----------------
  const addGroup = async (newGroup) => {
    if (!userDetails?.userId || !userDetails?.token) return;

    const payload = {
      groupName: newGroup.groupName,
      active: true,
      allStocks: false,
      stockList: "",
    };

    try {
      const response = await fetch(
        `${Backend.THIRDEYEBACKEND.URL}um/user/threshold-groups/user/${userDetails.userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", token: userDetails.token },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

              console.log("HELLO");
        console.log(data.response);
        
      if (data.success) {

        setGroups((prev) => [...prev, { ...payload, id: data.response?.id || Date.now() }]);
        notifySuccess("Group created successfully!");
      } else {
        notifyError(data.errorMessage || "Failed to create group");
      }
    } catch (err) {
      notifyError("Network error. Could not create group.");
    }
  };

  // ---------------- FETCH SINGLE GROUP ----------------
  const fetchGroupById = async (groupId) => {
    if (!userDetails?.userId || !userDetails?.token) return;

    try {
      const response = await fetch(
        `${Backend.THIRDEYEBACKEND.URL}um/user/threshold-groups/${groupId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", token: userDetails.token },
        }
      );
      const data = await response.json();
      if (data.success) return data.response;
      notifyError(data.errorMessage || "Failed to fetch group details");
      return null;
    } catch (err) {
      notifyError("Network error fetching group details.");
      return null;
    }
  };

  // ---------------- UPDATE GROUP STATUS ----------------
  const updateGroupStatus = async (groupId, newActiveStatus, allStocks, stockList) => {
    if (!userDetails?.userId || !userDetails?.token) return;

    const currentGroup = groups.find((g) => g.id === groupId);
    if (!currentGroup) return;


      console.log(currentGroup);

    const payload = {
      groupName: currentGroup.groupName,
      active: newActiveStatus !== undefined ? newActiveStatus : currentGroup.active,
      allStocks: allStocks !== undefined ? allStocks : currentGroup.allStocks,
      stockList: stockList !== undefined ? stockList : currentGroup.stockList || "",
    };

        console.log(payload);

    try {
      const response = await fetch(
        `${Backend.THIRDEYEBACKEND.URL}um/user/threshold-groups/${groupId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", token: userDetails.token },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.success) {
        setGroups((prev) =>
          prev.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  active: newActiveStatus !== undefined ? newActiveStatus : g.active,
                  allStocks: allStocks !== undefined ? allStocks : g.allStocks,
                  stockList: stockList !== undefined ? stockList : g.stockList || "",
                }
              : g
          )
        );
        notifySuccess("Group updated successfully!");
      } else {
        notifyError(data.errorMessage || "Failed to update group status");
      }
    } catch (err) {
      notifyError("Network error updating group status.");
    }
  };

  // ---------------- DELETE GROUP ----------------
  const deleteGroup = async (groupId) => {
    if (!userDetails?.userId || !userDetails?.token) return;

    try {
      const response = await fetch(
        `${Backend.THIRDEYEBACKEND.URL}um/user/threshold-groups/${groupId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json", token: userDetails.token },
        }
      );

      const data = await response.json();

      if (data.success) {
        setGroups((prev) => prev.filter((g) => g.id !== groupId));
        notifySuccess("Group deleted successfully!");
      } else {
        notifyError(data.errorMessage || "Failed to delete group");
      }
    } catch (err) {
      notifyError("Network error deleting group.");
    }
  };

  useEffect(() => {
    if (userDetails?.isLogin) fetchThresoldGroups();
  }, [userDetails]);

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
