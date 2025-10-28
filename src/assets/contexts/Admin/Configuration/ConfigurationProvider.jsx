import { useState, useEffect, useContext } from "react";
import ConfigurationContext from "./ConfigurationContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function ConfigurationProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifySuccess } = useContext(NotificationContext);

  const [configData, setConfigData] = useState({});
  const [loading, setLoading] = useState(false);
  const api = new ApiCaller();

  const fetchConfig = async () => {
    if (!userDetails?.token) return;
    setLoading(true);
    try {
      const { data } = await api.call("pm/properties", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      if (data.success) setConfigData(data.response || {});
      else notifyError(data.errorMessage || "Failed to fetch configuration");
    } catch {
      notifyError("Network error while fetching configuration");
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (password, updates) => {
    if (!userDetails?.token || !updates) return;
    try {
      const body = { password, updates };
      const { data } = await api.call("pm/properties/update", {
        method: "POST",
        headers: { "Content-Type": "application/json", token: userDetails.token },
        body: JSON.stringify(body),
      });

      if (data.success) {
        notifySuccess("Configuration updated successfully!");
        setConfigData({ ...updates });
        return true;
      } else {
        notifyError(data.errorMessage || "Failed to update configuration");
        return false;
      }
    } catch {
      notifyError("Network error while updating configuration");
      return false;
    }
  };

  useEffect(() => {
    if(page === 2)
    {
        fetchConfig();
    }
    else
    {
        setConfigData({})
    }
  }, [page]);

  return (
    <ConfigurationContext.Provider
      value={{
        configData,
        loading,
        fetchConfig,
        updateConfig,
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
}
