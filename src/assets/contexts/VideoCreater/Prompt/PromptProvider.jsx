import { useState, useEffect, useContext, useCallback } from "react";
import PromptContext from "./PromptContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function PromptProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess,
    notifyConfirm // Use custom confirmation
  } = useContext(NotificationContext);
  
  const [promptList, setPromptList] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    token: userDetails.token,
  });

  // FETCH LIST (Lightweight DTO) - Standardized: No silent refresh
  const fetchPrompts = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Syncing Prompts...");
    try {
      const { data } = await api.call("vm2/prompts", {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) {
        setPromptList(data.response || []);
      } else {
        await notifyError(data.errorMessage || "Failed to load prompts");
      }
    } catch (err) {
      notifyError("Network error: Could not reach prompt service");
    } finally {
      closeLoading();
    }
  }, [userDetails?.token]);

  // FETCH FULL DETAIL (Heavy DTO with Prompt Text)
  const getFullPrompt = async (id) => {
    notifyLoading("Retrieving Prompt Details...");
    try {
      const { data } = await api.call(`vm2/prompts/${id}/full`, {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) {
        return data.response;
      } else {
        await notifyError(data.errorMessage || "Could not retrieve prompt text");
      }
    } catch {
      notifyError("Service error: Retrieval failed");
    } finally {
      closeLoading();
    }
    return null;
  };

  // CREATE
  const addPrompt = async (promptData) => {
    notifyLoading("Creating Prompt...");
    try {
      const { data } = await api.call("vm2/prompts", {
        method: "POST", 
        headers: getHeaders(),
        body: JSON.stringify(promptData),
      });
      if (data.success) {
        notifySuccess("Prompt Created");
        await fetchPrompts(); // Full refresh
        return true;
      } else {
        await notifyError(data.errorMessage || "Creation Failed");
      }
    } catch { 
      notifyError("Service error: Creation Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  // UPDATE
  const updatePrompt = async (id, promptData) => {
    notifyLoading("Updating Prompt...");
    try {
      const { data } = await api.call(`vm2/prompts/${id}`, {
        method: "PUT", 
        headers: getHeaders(),
        body: JSON.stringify(promptData),
      });
      if (data.success) {
        notifySuccess("Prompt Updated");
        await fetchPrompts(); // Full refresh
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

  // DELETE - Updated with notifyConfirm
  const deletePrompt = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Are you sure you want to delete this prompt?");
    if (!ok) return;

    notifyLoading("Deleting Prompt...");
    try {
      const { data } = await api.call(`vm2/prompts/${id}`, {
        method: "DELETE", 
        headers: getHeaders(),
      });
      if (data.success) {
        setPromptList(prev => prev.filter(p => p.id !== id));
        notifySuccess("Prompt Deleted");
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
    if (page === 11) {
      fetchPrompts();
    } else {
      setPromptList([]);
    }
  }, [page, fetchPrompts]);

  return (
    <PromptContext.Provider value={{ 
      promptList, fetchPrompts, addPrompt, updatePrompt, deletePrompt, getFullPrompt 
    }}>
      {children}
    </PromptContext.Provider>
  );
}