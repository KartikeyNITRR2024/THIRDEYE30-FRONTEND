import { useState, useEffect, useContext, useCallback } from "react";
import NewsImageContext from "./NewsImageContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function NewsImageProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  
  const [newsImages, setNewsImages] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  const fetchNewsImages = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/news-image", { method: "GET", headers: getHeaders() });
      if (data.success) setNewsImages(data.response || []);
    } catch { 
      if (!silent) notifyError("Fetch News Images Failed"); 
    } finally { 
      if (!silent) closeLoading(); 
    }
  }, [userDetails?.token]);

  const createNewsImage = async (dto) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/news-image", { method: "POST", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("News Image Style Created"); 
        await fetchNewsImages(true); 
        return true; 
      }
    } catch { notifyError("Creation Failed"); } finally { closeLoading(); }
  };

  const updateNewsImage = async (id, dto) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/news-image/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("Style Updated"); 
        await fetchNewsImages(true); 
        return true; 
      }
    } catch { notifyError("Update Failed"); } finally { closeLoading(); }
  };

  const deleteNewsImage = async (id) => {
    if(!window.confirm("Delete this style?")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/news-image/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Deleted Successfully");
        await fetchNewsImages(true);
      }
    } catch { notifyError("Delete Failed"); } finally { closeLoading(); }
  };

  const activateNewsImage = async (id) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/news-image/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Style Activated");
        await fetchNewsImages(true);
      }
    } catch { notifyError("Activation Failed"); } finally { closeLoading(); }
  };

  useEffect(() => {
    if ([77].includes(page)) fetchNewsImages(); // Assuming Page 77 for News Image
  }, [page, fetchNewsImages]);

  return (
    <NewsImageContext.Provider value={{ newsImages, createNewsImage, updateNewsImage, deleteNewsImage, activateNewsImage, fetchNewsImages }}>
      {children}
    </NewsImageContext.Provider>
  );
}