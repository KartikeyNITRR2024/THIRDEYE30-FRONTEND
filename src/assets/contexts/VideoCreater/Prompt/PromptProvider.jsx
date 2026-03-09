import { useState, useEffect, useContext, useCallback } from "react";
import PromptContext from "./PromptContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function PromptProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  const [promptList, setPromptList] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    token: userDetails.token,
  });

  // FETCH LIST (Lightweight DTO)
  const fetchPrompts = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/prompts", {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) setPromptList(data.response || []);
    } catch (err) {
      if (!silent) notifyError("Failed to load prompts");
    } finally {
      if (!silent) closeLoading();
    }
  }, [userDetails?.token]);

  // FETCH FULL DETAIL (Heavy DTO with Prompt Text)
  const getFullPrompt = async (id) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/prompts/${id}/full`, {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) return data.response;
    } catch {
      notifyError("Could not retrieve prompt text");
    } finally {
      closeLoading();
    }
    return null;
  };

  // CREATE
  const addPrompt = async (promptData) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/prompts", {
        method: "POST", headers: getHeaders(),
        body: JSON.stringify(promptData),
      });
      if (data.success) {
        notifySuccess("Prompt Created");
        await fetchPrompts(true);
        return true;
      }
    } catch { notifyError("Creation Failed"); } 
    finally { closeLoading(); }
  };

  // UPDATE
  const updatePrompt = async (id, promptData) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/prompts/${id}`, {
        method: "PUT", headers: getHeaders(),
        body: JSON.stringify(promptData),
      });
      if (data.success) {
        notifySuccess("Prompt Updated");
        await fetchPrompts(true);
        return true;
      }
    } catch { notifyError("Update Failed"); }
    finally { closeLoading(); }
  };

  // DELETE
  const deletePrompt = async (id) => {
    if (!window.confirm("Delete this prompt?")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/prompts/${id}`, {
        method: "DELETE", headers: getHeaders(),
      });
      if (data.success) {
        setPromptList(prev => prev.filter(p => p.id !== id));
        notifySuccess("Prompt Deleted");
      }
    } catch { notifyError("Delete Failed"); }
    finally { closeLoading(); }
  };

  useEffect(() => {
    if (page === 13) fetchPrompts();
  }, [page, fetchPrompts]);

  return (
    <PromptContext.Provider value={{ 
      promptList, fetchPrompts, addPrompt, updatePrompt, deletePrompt, getFullPrompt 
    }}>
      {children}
    </PromptContext.Provider>
  );
}