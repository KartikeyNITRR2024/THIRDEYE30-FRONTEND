import { useState, useEffect, useContext, useCallback } from "react";
import TelegramBotContext from "./TelegramBotContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function TelegramBotProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess,
    notifyConfirm // Standardized custom confirmation
  } = useContext(NotificationContext);
  
  const [botList, setBotList] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    token: userDetails.token,
  });

  // FETCH ALL BOTS - Standardized: No silent refresh, captures backend errors
  const fetchBots = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Syncing Telegram Bots...");
    try {
      const { data } = await api.call("vm2/telegram-bots", {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) {
        setBotList(data.response || []);
      } else {
        await notifyError(data.errorMessage || "Failed to fetch bots");
      }
    } catch (err) {
      notifyError("Network error: Could not reach bot service");
    } finally {
      closeLoading();
    }
  }, [userDetails?.token]);

  // ADD BOT
  const addBot = async (botData) => {
    notifyLoading("Registering Bot...");
    try {
      const { data } = await api.call("vm2/telegram-bots", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(botData),
      });
      if (data.success) {
        notifySuccess("Bot Registered Successfully");
        await fetchBots(); // Full refresh for UI transparency
        return true;
      } else {
        await notifyError(data.errorMessage || "Bot Registration Failed");
      }
    } catch {
      notifyError("Service error: Registration Failed");
    } finally {
      closeLoading();
    }
  };

  // UPDATE BOT
  const updateBot = async (id, botData) => {
    notifyLoading("Updating Bot Configuration...");
    try {
      const { data } = await api.call(`vm2/telegram-bots/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(botData),
      });
      if (data.success) {
        notifySuccess("Bot Configuration Updated");
        await fetchBots(); // Standardized full refresh
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
  const toggleBotStatus = async (id, currentStatus) => {
    const action = currentStatus ? "Deactivating" : "Activating";
    const endpoint = currentStatus ? "deactivate" : "activate";
    
    notifyLoading(`${action} Bot...`);
    try {
      const { data } = await api.call(`vm2/telegram-bots/${id}/${endpoint}`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (data.success) {
        notifySuccess(`Bot ${currentStatus ? 'Deactivated' : 'Activated'}`);
        await fetchBots();
      } else {
        await notifyError(data.errorMessage || "Status Update Failed");
      }
    } catch {
      notifyError("Service error: Status Update Failed");
    } finally {
      closeLoading();
    }
  };

  // DELETE BOT - Updated with notifyConfirm
  const deleteBot = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Are you sure you want to delete this bot configuration?");
    if (!ok) return;

    notifyLoading("Deleting Bot...");
    try {
      const { data } = await api.call(`vm2/telegram-bots/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (data.success) {
        notifySuccess("Bot Deleted");
        await fetchBots();
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
    if ([12].includes(page)) {
      fetchBots();
    } else {
      setBotList([]);
    }
  }, [page, fetchBots]);

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