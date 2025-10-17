import { useState, useContext, useEffect } from "react";
import ChatIDContext from "./ChatIDContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import MarketThresoldContext from "../MarketThresold/MarketThresoldContext";

export default function ChatIDProvider({ children }) {
  const { userDetails } = useContext(AuthContext);
  const { page } = useContext(MarketThresoldContext);
  const { notifySuccess, notifyError } = useContext(NotificationContext);
  const [chatIDs, setChatIDs] = useState([]);
  const [loading, setLoading] = useState(false);
  const api = new ApiCaller();

  const fetchChatIDsByGroup = async (groupId) => {
    if (!userDetails?.token || !groupId) return;
    setLoading(true);

    try {
      const { data } = await api.call(
        `um/user/telegram-chat-ids/group/${groupId}`,
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

  const createChatID = async (groupId, payload) => {
    if (!userDetails?.token || !groupId) return;

    try {
      const { data } = await api.call(
        `um/user/telegram-chat-ids/${groupId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", token: userDetails.token },
          body: JSON.stringify(payload),
        }
      );

      if (data.success) {
        notifySuccess("Chat ID created successfully!");
        await fetchChatIDsByGroup(groupId);
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

  const deleteChatID = async (chatId, groupId) => {
    if (!userDetails?.token || !groupId) return;

    try {
      const { data } = await api.call(
        `um/user/telegram-chat-ids/${chatId}`,
        { method: "DELETE", headers: { "Content-Type": "application/json", token: userDetails.token } }
      );

      if (data.success) {
        notifySuccess("Chat ID deleted successfully!");
        await fetchChatIDsByGroup(groupId);
      } else {
        notifyError(data.errorMessage || "Failed to delete chat ID");
      }
    } catch {
      notifyError("Network error deleting chat ID");
    }
  };

    useEffect(() => {
        if (page === "group") {
          setChatIDs([]);
        }
    }, [page]);

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

// Summary:
// 1. Manages fetching, creating, and deleting Telegram chat IDs for a group.
// 2. Uses ApiCaller for API requests with retry and optional timeout.
// 3. Maintains chatIDs state and loading indicator for child components.
// 4. Provides notifySuccess and notifyError feedback via NotificationContext.
