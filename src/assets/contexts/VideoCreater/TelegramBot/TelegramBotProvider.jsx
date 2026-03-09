import { useState, useEffect, useContext, useCallback } from "react";
import TelegramBotContext from "./TelegramBotContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function TelegramBotProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  const [botList, setBotList] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    token: userDetails.token,
  });

  // FETCH ALL BOTS
  const fetchBots = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/telegram-bots", {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) {
        setBotList(data.response || []);
      }
    } catch (err) {
      if (!silent) notifyError("Failed to fetch bots");
    } finally {
      if (!silent) closeLoading();
    }
  }, [userDetails?.token]);

  // ADD BOT
  const addBot = async (botData) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/telegram-bots", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(botData),
      });
      if (data.success) {
        notifySuccess("Bot Registered Successfully");
        await fetchBots(true);
        return true;
      }
    } catch {
      notifyError("Bot Registration Failed");
    } finally {
      closeLoading();
    }
  };

  // UPDATE BOT (Added logic)
  const updateBot = async (id, botData) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/telegram-bots/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(botData),
      });
      if (data.success) {
        notifySuccess("Bot Configuration Updated");
        // Update local state and refresh
        setBotList(prev => prev.map(b => b.id === id ? { ...b, ...botData } : b));
        await fetchBots(true);
        return true;
      }
    } catch {
      notifyError("Update Failed");
    } finally {
      closeLoading();
    }
  };

  // TOGGLE STATUS (Activate/Deactivate)
  const toggleBotStatus = async (id, currentStatus) => {
    const endpoint = currentStatus ? "deactivate" : "activate";
    try {
      const { data } = await api.call(`vm2/telegram-bots/${id}/${endpoint}`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (data.success) {
        setBotList(prev => prev.map(b => b.id === id ? { ...b, active: !currentStatus } : b));
        notifySuccess(`Bot ${currentStatus ? 'Deactivated' : 'Activated'}`);
      }
    } catch {
      notifyError("Status Update Failed");
    }
  };

  // DELETE BOT
  const deleteBot = async (id) => {
    if (!window.confirm("Delete this bot configuration?")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/telegram-bots/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (data.success) {
        setBotList(prev => prev.filter(b => b.id !== id));
        notifySuccess("Bot Deleted");
      }
    } catch {
      notifyError("Delete Failed");
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if ([12].includes(page)) {
      fetchBots();
    } else {
      setBotList([]);
    }
  }, [page]);

  return (
    <TelegramBotContext.Provider value={{ 
      botList, 
      fetchBots, 
      addBot, 
      updateBot,
      deleteBot, 
      toggleBotStatus 
    }}>
      {children}
    </TelegramBotContext.Provider>
  );
}