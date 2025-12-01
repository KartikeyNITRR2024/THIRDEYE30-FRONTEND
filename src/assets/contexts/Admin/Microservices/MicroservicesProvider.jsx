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
  const [loading, setLoading] = useState(false);
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
      else notifyError(data.errorMessage || "Failed to fetch microservices status");
    } catch {
      notifyError("Network error while fetching microservices status");
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if(page === 1)
    {
        fetchMicroserviceStatus();
    }
    else
    {
        setMicroservicesStatus([])
    }
  }, [page]);

  return (
    <MicroservicesContext.Provider
      value={{
        microservicesStatus,
        loading,
        fetchMicroserviceStatus
      }}
    >
      {children}
    </MicroservicesContext.Provider>
  );
}
