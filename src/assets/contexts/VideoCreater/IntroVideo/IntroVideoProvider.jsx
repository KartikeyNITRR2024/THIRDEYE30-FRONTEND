import { useState, useEffect, useContext, useCallback } from "react";
import IntroVideoContext from "./IntroVideoContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function IntroVideoProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess,
    notifyConfirm // Use custom confirmation
  } = useContext(NotificationContext);
  
  const [intros, setIntros] = useState([]);
  const [activeIntro, setActiveIntro] = useState(null);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  // GET - Removed silent logic, added strict error checking
  const fetchIntros = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Loading Intro Templates...");
    try {
      const { data } = await api.call("vm2/intro-video", { method: "GET", headers: getHeaders() });
      if (data.success) {
        setIntros(data.response || []);
      } else {
        await notifyError(data.errorMessage || "Fetch Intros Failed");
      }
    } catch { 
      notifyError("Network error: Failed to load intros"); 
    } finally { 
      closeLoading(); 
    }
  }, [userDetails?.token]);

  // CREATE
  const createIntro = async (dto) => {
    notifyLoading("Creating Intro...");
    try {
      const { data } = await api.call("vm2/intro-video", { 
        method: "POST", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Intro Created Successfully"); 
        await fetchIntros(); // Full refresh
        return true; 
      } else {
        await notifyError(data.errorMessage || "Creation Failed");
      }
    } catch { 
      notifyError("Service error: Creation Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  // UPDATE
  const updateIntro = async (id, dto) => {
    notifyLoading("Updating Intro...");
    try {
      const { data } = await api.call(`vm2/intro-video/${id}`, { 
        method: "PUT", 
        headers: getHeaders(), 
        body: JSON.stringify(dto) 
      });
      if (data.success) { 
        notifySuccess("Intro Updated Successfully"); 
        await fetchIntros(); // Full refresh
        return true; 
      } else {
        await notifyError(data.errorMessage || "Update Failed");
      }
    } catch { 
      notifyError("Service error: Update Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  // DELETE
  const deleteIntro = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Are you sure you want to delete this intro template?");
    if (!ok) return;

    notifyLoading("Deleting Intro...");
    try {
      const { data } = await api.call(`vm2/intro-video/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Intro Deleted Successfully");
        await fetchIntros(); // Full refresh
      } else {
        await notifyError(data.errorMessage || "Delete Failed");
      }
    } catch { 
      notifyError("Service error: Delete Failed"); 
    } finally { 
      closeLoading(); 
    }
  };

  // ACTIVATE
  const activateIntro = async (id) => {
    notifyLoading("Activating Template...");
    try {
      const { data } = await api.call(`vm2/intro-video/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Intro Template Activated Successfully");
        await fetchIntros(); // Full refresh
      } else {
        await notifyError(data.errorMessage || "Activation Failed");
      }
    } catch { 
      notifyError("Service error: Activation Failed"); 
    } finally {
      closeLoading();
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