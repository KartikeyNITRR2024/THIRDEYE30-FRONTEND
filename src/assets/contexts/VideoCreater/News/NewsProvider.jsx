import { useState, useEffect, useContext, useCallback } from "react";
import NewsContext from "./NewsContext.jsx";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function NewsProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  const [newsList, setNewsList] = useState([]);
  const api = new ApiCaller();

  const fetchNews = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/news", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      if (data.success) {
        // Sort by createdTime descending
        const sorted = (data.response || []).sort((a, b) => 
          new Date(b.createdTime) - new Date(a.createdTime)
        );
        setNewsList(sorted);
      }
    } catch {
      if (!silent) notifyError("Failed to fetch news");
    } finally {
      if (!silent) closeLoading();
    }
  }, [userDetails?.token]);

  const addNews = async (dto) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call("vm2/news", {
        method: "POST",
        headers: { "Content-Type": "application/json", token: userDetails.token },
        body: JSON.stringify(dto),
      });
      if (data.success) {
        notifySuccess("News Created");
        await fetchNews(true);
      }
    } catch {
      notifyError("Creation failed");
    } finally {
      closeLoading();
    }
  };

  const updateNews = async (id, dto) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", token: userDetails.token },
        body: JSON.stringify(dto),
      });
      if (data.success) {
        notifySuccess("News Updated");
        await fetchNews(true);
        return true;
      }
    } catch {
      notifyError("Update failed");
      return false;
    } finally {
      closeLoading();
    }
  };

  const deleteNews = async (id) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/news/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      if (data.success) {
        setNewsList(prev => prev.filter(n => n.id !== id));
        notifySuccess("News Deleted");
      }
    } catch {
      notifyError("Delete failed");
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if (page === 6) fetchNews();
    else setNewsList([]);
  }, [page, fetchNews]);

  return (
    <NewsContext.Provider value={{ newsList, fetchNews, addNews, updateNews, deleteNews }}>
      {children}
    </NewsContext.Provider>
  );
}