import { useState, useEffect, useContext } from "react";
import ConfigurationContext from "./ConfigurationContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function ConfigurationProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifySuccess, notifyLoading, closeLoading, notifyPrompt, notifyInfo } = useContext(NotificationContext);

  const [configData, setConfigData] = useState({});
  const [loading, setLoading] = useState(false);
  const api = new ApiCaller();

  const fetchConfig = async () => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call("pm/properties", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      if (data.success) setConfigData(data.response || {});
      else await notifyError(data.errorMessage || "Failed to fetch configuration");
    } catch {
      await notifyError("Network error while fetching configuration");
    } finally {
      closeLoading();
    }
  };

  const fetchServiceUpdateStatus = async () => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call("pm/properties/servicesupdating", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      if (data.success)
      {
         if(data.response)
         {
             await notifyInfo("Services are updating...");
         }
         else
         {
             await notifyInfo("Services updated");
         }
      }
      else await notifyError(data.errorMessage || "Failed to get service update status");
    } catch {
      await notifyError("Network error while fetching service update");
    } finally {
      closeLoading();
    }
  };

  const updateConfig = async (updates) => {
  if (!userDetails?.token || !updates) return;

  // 🔥 Ask for password using SweetAlert input
  const password = await notifyPrompt(
    "Enter admin password to continue",
    "Update",
    "Cancel"
  );

  if (!password) return false; // user cancelled

  notifyLoading("Updating configurations");

  try {
    const body = { password, updates };

    const { data } = await api.call("pm/properties/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: userDetails.token,
      },
      body: JSON.stringify(body),
    });

    if (data.success) {
      await notifySuccess("Configuration updated successfully!");
      setConfigData({ ...updates });
      return true;
    } else {
      await notifyError(data.errorMessage || "Failed to update configuration");
      return false;
    }
  } catch {
    await notifyError("Network error while updating configuration");
    return false;
  } finally {
    closeLoading();
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
        fetchServiceUpdateStatus
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
}
