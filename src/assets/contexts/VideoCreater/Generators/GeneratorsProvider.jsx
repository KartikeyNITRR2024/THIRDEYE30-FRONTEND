import { useState, useEffect, useContext, useCallback } from "react";
import GeneratorsContext from "./GeneratorsContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function GeneratorProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  const [generatorsUrls, setGeneratorsUrls] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    token: userDetails.token,
  });

  // GET - Standardized: Removed silent refresh, strict error checking
  const fetchGeneratorsUrls = useCallback(async () => {
    if (!userDetails?.token) return;
    
    notifyLoading("Syncing Generator Status...");
    
    try {
      const { data } = await api.call("vm2/content-generater", {
        method: "GET",
        headers: getHeaders(),
      });
      
      if (data.success) {
        setGeneratorsUrls(data.response || []);
        notifySuccess("Generator Links Synchronized");
      } else {
        // Correctly handle backend error message
        await notifyError(data.errorMessage || "Failed to fetch status checker link");
      }
    } catch (err) {
      notifyError("Network error: Could not reach generator service");
    } finally {
      closeLoading();
    }
  }, [userDetails?.token]);

  useEffect(() => {
    // If navigating to page 8, fetch data
    if (page === 8) {
      fetchGeneratorsUrls();
    } else {
      // Clear state when leaving the page
      setGeneratorsUrls([]);
    }
  }, [page, fetchGeneratorsUrls]);

  return (
    <GeneratorsContext.Provider
      value={{
        generatorsUrls,
        fetchGeneratorsUrls
      }}
    >
      {children}
    </GeneratorsContext.Provider>
  );
}