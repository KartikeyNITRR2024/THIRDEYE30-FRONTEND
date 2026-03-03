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

  const fetchGeneratorsUrls = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    
    try {
      const { data } = await api.call("vm2/content-generater", {
        method: "GET",
        headers: getHeaders(),
      });
      
      if (data.success) {
        setGeneratorsUrls(data.response || []);
        if (!silent) notifySuccess("Generator Links Synchronized");
      } else {
        notifyError(data.errorMessage || "Failed to fetch status checker link");
      }
    } catch (err) {
      notifyError("Network error while fetching status check link");
    } finally {
      if (!silent) closeLoading();
    }
  }, [userDetails?.token]);

  useEffect(() => {
    if (page === 8) {
      fetchGeneratorsUrls();
    } else {
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