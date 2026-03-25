import { useState, useEffect, useContext, useCallback } from "react";
import NewsContext from "./NewsContext.jsx";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function NewsProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess,
    notifyConfirm
  } = useContext(NotificationContext);
  
  const [newsList, setNewsList] = useState([]);
  const api = new ApiCaller();

  // Helper for standard JSON headers
  const getHeaders = () => ({
    "Content-Type": "application/json",
    token: userDetails.token,
  });

  /**
   * GET ALL NEWS
   * Fetches the news list from the backend and sorts by creation time.
   */
  const fetchNews = useCallback(
    async (silent = false) => {
      if (!userDetails?.token) return;
      if (!silent) notifyLoading("Syncing News Desk...");
      
      try {
        const { data } = await api.call("vm2/news", {
          method: "GET",
          headers: getHeaders(),
        });

        if (data.success) {
          // Sort by createdTime descending (newest first)
          const sorted = (data.response || []).sort(
            (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
          );
          setNewsList(sorted);
        } else {
          if (!silent) notifyError(data.errorMessage || "Failed to fetch news");
        }
      } catch (error) {
        if (!silent) notifyError("Network error: News fetch failed");
      } finally {
        if (!silent) closeLoading();
      }
    },
    [userDetails?.token]
  );

  /**
   * CREATE NEWS
   * Handles manual creation of a news segment including companyName.
   */
  const addNews = async (dto) => {
    if (!userDetails?.token) return;
    notifyLoading("Deploying News Asset...");
    
    try {
      const { data } = await api.call("vm2/news", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(dto),
      });

      if (data.success) {
        notifySuccess("News Created Successfully");
        await fetchNews(true); // Silent refresh to update the grid
        return true;
      } else {
        notifyError(data.errorMessage || "Creation Failed");
        return false;
      }
    } catch (error) {
      notifyError("Service error: Could not create news");
      return false;
    } finally {
      closeLoading();
    }
  };

  /**
   * UPDATE NEWS
   * Updates existing news metadata.
   */
  const updateNews = async (id, dto) => {
    if (!userDetails?.token) return;
    notifyLoading("Updating News Segment...");
    
    try {
      const { data } = await api.call(`vm2/news/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(dto),
      });

      if (data.success) {
        notifySuccess("News Updated Successfully");
        await fetchNews(true);
        return true;
      } else {
        notifyError(data.errorMessage || "Update Failed");
        return false;
      }
    } catch (error) {
      notifyError("Service error: Update Failed");
      return false;
    } finally {
      closeLoading();
    }
  };

  /**
   * DELETE NEWS
   * Removes a news segment after confirmation.
   */
  const deleteNews = async (id) => {
    if (!userDetails?.token) return;
    const ok = await notifyConfirm("Are you sure you want to delete this news?");
    if (!ok) return;

    notifyLoading("Purging News Asset...");
    try {
      const { data } = await api.call(`vm2/news/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (data.success) {
        setNewsList((prev) => prev.filter((n) => n.id !== id));
        notifySuccess("News Deleted Successfully");
      } else {
        notifyError(data.errorMessage || "Delete Failed");
      }
    } catch (error) {
      notifyError("Service error: Delete Failed");
    } finally {
      closeLoading();
    }
  };

  /**
   * UPLOAD NEWS CSV
   * Sends a Multipart/form-data request to the backend.
   * Note: Headers do NOT include 'Content-Type' as the browser sets it for FormData.
   */
  const uploadNewsCsv = async (file, videoDetailsId) => {
    if (!userDetails?.token || !file || !videoDetailsId) {
        notifyError("Missing file or target project");
        return false;
    }

    notifyLoading("Processing CSV Batch...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("videoDetailsId", videoDetailsId);

      const { data } = await api.call("vm2/news/upload-csv", {
        method: "POST",
        headers: {
          token: userDetails.token,
          // Do not set Content-Type for FormData
        },
        body: formData,
      });

      if (data.success) {
        notifySuccess("CSV Processed Successfully");
        await fetchNews(true);
        return true;
      } else {
        notifyError(data.errorMessage || "CSV Processing Failed");
        return false;
      }
    } catch (error) {
      notifyError("Network error: CSV Upload Failed");
      return false;
    } finally {
      closeLoading();
    }
  };

  // Auto-fetch logic based on Page Navigation
  useEffect(() => {
    // Page 6 is designated as the News Desk
    if (page === 6) {
      fetchNews();
    } else {
      setNewsList([]); // Clear memory when navigating away
    }
  }, [page, fetchNews]);

  return (
    <NewsContext.Provider
      value={{ 
        newsList, 
        fetchNews, 
        addNews, 
        updateNews, 
        deleteNews, 
        uploadNewsCsv 
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}