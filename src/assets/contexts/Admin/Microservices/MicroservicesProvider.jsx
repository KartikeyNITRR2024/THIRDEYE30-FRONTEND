import { useState, useEffect, useContext } from "react";
import MicroservicesContext from "./MicroservicesContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function MicroservicesProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading } = useContext(NotificationContext);

  const [microservicesStatus, setMicroservicesStatus] = useState([]);
  const [statusCheckerUrls, setStatusCheckerUrls] = useState([]);
  const api = new ApiCaller();

  const fetchMicroserviceStatus = async () => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call("es/eurekasummary", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      if (data.success) setMicroservicesStatus(data.response || []);
      else await notifyError(data.errorMessage || "Failed to fetch microservices status");
    } catch {
      await  notifyError("Network error while fetching microservices status");
    } finally {
      closeLoading();
    }
  };

  const fetchStatusCheckerLink = async () => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call("pm/statuschecker/active", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      if (data.success) setStatusCheckerUrls(data.response || []);
      else await notifyError(data.errorMessage || "Failed to fetch status checker link");
    } catch {
      await notifyError("Network error while fetching status check link");
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if(page === 1)
    {
        fetchMicroserviceStatus();
        fetchStatusCheckerLink();
    }
    else
    {
        setMicroservicesStatus([]);
        setStatusCheckerUrls([]);
    }
  }, [page]);

  return (
    <MicroservicesContext.Provider
      value={{
        microservicesStatus,
        statusCheckerUrls,
        fetchMicroserviceStatus,
        setStatusCheckerUrls
      }}
    >
      {children}
    </MicroservicesContext.Provider>
  );
}
