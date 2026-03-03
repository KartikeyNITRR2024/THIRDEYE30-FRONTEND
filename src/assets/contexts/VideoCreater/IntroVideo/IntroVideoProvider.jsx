import { useState, useEffect, useContext, useCallback } from "react";
import IntroVideoContext from "./IntroVideoContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function IntroVideoProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  
  const [intros, setIntros] = useState([]);
  const [activeIntro, setActiveIntro] = useState(null);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  const fetchIntros = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/intro-video", { method: "GET", headers: getHeaders() });
      if (data.success) {
        setIntros(data.response || []);
      }
    } catch { 
      if (!silent) notifyError("Fetch Intros Failed"); 
    } finally { 
      if (!silent) closeLoading(); 
    }
  }, [userDetails?.token]);

  const createIntro = async (dto) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/intro-video", { method: "POST", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("Intro Created Successfully"); 
        await fetchIntros(true); 
        return true; 
      }
    } catch { 
      notifyError("Creation Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const updateIntro = async (id, dto) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/intro-video/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("Intro Updated Successfully"); 
        await fetchIntros(true); 
        return true; 
      }
    } catch { 
      notifyError("Update Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const deleteIntro = async (id) => {
    if(!window.confirm("Delete this intro template?")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/intro-video/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Intro Deleted Successfully");
        await fetchIntros(true);
      }
    } catch { 
      notifyError("Delete Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  const activateIntro = async (id) => {
    notifyLoading(); // Added loading for activation
    try {
      const { data } = await api.call(`vm2/intro-video/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Intro Template Activated Successfully");
        await fetchIntros(true);
      }
    } catch { 
      notifyError("Activation Failed"); 
    } finally {
      closeLoading(); // Added close loading
    }
  };

  useEffect(() => {
    if ([72].includes(page)) { 
      fetchIntros(); 
    } else {
      setIntros([]);
      setActiveIntro(null);
    }
  }, [page, fetchIntros]);

  return (
    <IntroVideoContext.Provider value={{ intros, activeIntro, createIntro, updateIntro, deleteIntro, activateIntro, fetchIntros }}>
      {children}
    </IntroVideoContext.Provider>
  );
}