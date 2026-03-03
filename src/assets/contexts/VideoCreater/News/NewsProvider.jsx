import { useState, useEffect, useContext, useCallback } from "react";
import NewsContext from "./NewsContext.jsx";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function NewsProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } =
    useContext(NotificationContext);
  const [newsList, setNewsList] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    token: userDetails.token,
  });

  // GET ALL NEWS
  const fetchNews = useCallback(
    async (silent = false) => {
      if (!userDetails?.token) return;
      if (!silent) notifyLoading();
      try {
        const { data } = await api.call("vm2/news", {
          method: "GET",
          headers: getHeaders(),
        });
        if (data.success) {
          // Sort by createdTime descending
          const sorted = (data.response || []).sort(
            (a, b) => new Date(b.createdTime) - new Date(a.createdTime),
          );
          setNewsList(sorted);
        }
      } catch {
        if (!silent) notifyError("Failed to fetch news list");
      } finally {
        if (!silent) closeLoading();
      }
    },
    [userDetails?.token],
  );

  // CREATE NEWS
  const addNews = async (dto) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call("vm2/news", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(dto),
      });
      if (data.success) {
        notifySuccess("News Created Successfully");
        await fetchNews(true); // Silent refresh
        return true;
      }
    } catch {
      notifyError("News Creation Failed");
    } finally {
      closeLoading();
    }
  };

  // UPDATE NEWS
  const updateNews = async (id, dto) => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/news/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(dto),
      });
      if (data.success) {
        notifySuccess("News Updated Successfully");
        await fetchNews(true); // Silent refresh
        return true;
      }
    } catch {
      notifyError("News Update Failed");
      return false;
    } finally {
      closeLoading();
    }
  };

  // DELETE NEWS
  const deleteNews = async (id) => {
    if (!userDetails?.token) return;
    if (!window.confirm("Are you sure you want to delete this news entry?"))
      return;

    notifyLoading();
    try {
      const { data } = await api.call(`vm2/news/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (data.success) {
        setNewsList((prev) => prev.filter((n) => n.id !== id));
        notifySuccess("News Deleted Successfully");
      }
    } catch {
      notifyError("News Delete Failed");
    } finally {
      closeLoading();
    }
  };

  const uploadNewsCsv = async (file, videoDetailsId) => {
    if (!userDetails?.token || !file || !videoDetailsId) return;

    notifyLoading();
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("videoDetailsId", videoDetailsId);
      const { data } = await api.call("vm2/news/upload-csv", {
        method: "POST",
        headers: {
          token: userDetails.token,
        },
        body: formData,
      });

      if (data.success) {
        notifySuccess("CSV Processed Successfully");
        await fetchNews(true);
        return true;
      }
    } catch (error) {
      notifyError("CSV Upload Failed");
      return false;
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if (page === 6) {
      fetchNews();
    } else {
      setNewsList([]);
    }
  }, [page, fetchNews]);

  return (
    <NewsContext.Provider
      value={{ newsList, fetchNews, addNews, updateNews, deleteNews, uploadNewsCsv }}
    >
      {children}
    </NewsContext.Provider>
  );
}
