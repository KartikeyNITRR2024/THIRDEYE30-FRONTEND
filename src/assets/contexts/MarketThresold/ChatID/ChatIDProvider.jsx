import React, { useState, useContext } from "react";
import ChatIDContext from "./ChatIDContext";
import AuthContext from "../../Auth/AuthContext";
import Backend from "../../../properties/Backend";
import NotificationContext from "../../Notification/NotificationContext";

export default function ChatIDProvider({ children }) {
  const { userDetails } = useContext(AuthContext);
  const { notifySuccess, notifyError } = useContext(NotificationContext);

  const [chatIDs, setChatIDs] = useState([]);
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

  // ---------------- GET CHAT IDs BY GROUP ----------------
  const fetchChatIDsByGroup = async (groupId) => {
    if (!userDetails?.token || !groupId) return;
    setLoading(true);
    try {
      const data = await fetchWithRetry(
        `${Backend.THIRDEYEBACKEND.URL}um/user/telegram-chat-ids/group/${groupId}`,
        { method: "GET", headers: { "Content-Type": "application/json", token: userDetails.token } }
      );
      if (data.success) {
        setChatIDs(data.response || []);
      } else {
        notifyError(data.errorMessage || "Failed to fetch chat IDs");
      }
    } catch {
      notifyError("Network error fetching chat IDs");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- CREATE CHAT ID ----------------
  const createChatID = async (groupId, payload) => {
    if (!userDetails?.token || !groupId) return;
    try {
      const data = await fetchWithRetry(
        `${Backend.THIRDEYEBACKEND.URL}um/user/telegram-chat-ids/${groupId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", token: userDetails.token },
          body: JSON.stringify(payload),
        }
      );

      if (data.success) {
        notifySuccess("Chat ID created successfully!");
        await fetchChatIDsByGroup(groupId); // reload chat IDs
        return data.response;
      } else {
        notifyError(data.errorMessage || "Failed to create chat ID");
        return null;
      }
    } catch {
      notifyError("Network error creating chat ID");
      return null;
    }
  };

  // ---------------- DELETE CHAT ID ----------------
  const deleteChatID = async (chatId, groupId) => {
    if (!userDetails?.token || !groupId) return;
    try {
      const data = await fetchWithRetry(
        `${Backend.THIRDEYEBACKEND.URL}um/user/telegram-chat-ids/${chatId}`,
        { method: "DELETE", headers: { "Content-Type": "application/json", token: userDetails.token } }
      );

      if (data.success) {
        notifySuccess("Chat ID deleted successfully!");
        await fetchChatIDsByGroup(groupId); // reload chat IDs
      } else {
        notifyError(data.errorMessage || "Failed to delete chat ID");
      }
    } catch {
      notifyError("Network error deleting chat ID");
    }
  };

  return (
    <ChatIDContext.Provider
      value={{
        chatIDs,
        loading,
        fetchChatIDsByGroup,
        createChatID,
        deleteChatID,
      }}
    >
      {children}
    </ChatIDContext.Provider>
  );
}
