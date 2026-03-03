import { useState, useEffect, useContext, useCallback } from "react";
import OutroVideoContext from "./OutroVideoContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function OutroVideoProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  
  const [outros, setOutros] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  const fetchOutros = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/outro-video", { method: "GET", headers: getHeaders() });
      if (data.success) {
        setOutros(data.response || []);
      }
    } catch { 
      if (!silent) notifyError("Fetch Outros Failed"); 
    } finally { 
      if (!silent) closeLoading(); 
    }
  }, [userDetails?.token]);

  const createOutro = async (dto) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/outro-video", { 
        method: "POST", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Outro Created Successfully"); 
        await fetchOutros(true); 
        return true; 
      }
    } catch { 
      notifyError("Outro Creation Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const updateOutro = async (id, dto) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/outro-video/${id}`, { 
        method: "PUT", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Outro Updated Successfully"); 
        await fetchOutros(true); 
        return true; 
      }
    } catch { 
      notifyError("Outro Update Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const deleteOutro = async (id) => {
    if(!window.confirm("Delete this outro template?")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/outro-video/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Outro Deleted Successfully");
        await fetchOutros(true);
      }
    } catch { 
      notifyError("Outro Delete Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const activateOutro = async (id) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/outro-video/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Outro Template Activated Successfully");
        await fetchOutros(true);
      }
    } catch { 
      notifyError("Activation Failed"); 
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    // Assuming page 73 is for Outros (Intro was 72)
    if ([73].includes(page)) { 
      fetchOutros(); 
    } else {
      setOutros([]);
    }
  }, [page, fetchOutros]);

  return (
    <OutroVideoContext.Provider value={{ outros, createOutro, updateOutro, deleteOutro, activateOutro, fetchOutros }}>
      {children}
    </OutroVideoContext.Provider>
  );
}