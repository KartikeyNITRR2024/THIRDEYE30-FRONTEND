import { useState, useEffect, useContext } from "react";
import GeneratorsContext from "./GeneratorsContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function GeneratorProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading } = useContext(NotificationContext);
  const [generatorsUrls, setGeneratorsUrls] = useState([]);
  const api = new ApiCaller();

  const fetchGeneratorsUrls = async () => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call("vm2/content-generater", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      if (data.success) setGeneratorsUrls(data.response || []);
      else await notifyError(data.errorMessage || "Failed to fetch status checker link");
    } catch {
      await notifyError("Network error while fetching status check link");
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if(page === 8)
    {
        fetchGeneratorsUrls();
    }
    else
    {
        setGeneratorsUrls([]);
    }
  }, [page]);

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
