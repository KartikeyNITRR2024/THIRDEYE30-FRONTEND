import { useState, useEffect, useContext, useCallback } from "react";
import HeaderContext from "./HeaderContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../../VideoCreater/Page/PageContext";

export default function HeaderProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifyLoading, closeLoading, notifySuccess } = useContext(NotificationContext);
  
  const [headers, setHeaders] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({ "Content-Type": "application/json", token: userDetails.token });

  const fetchHeaders = useCallback(async (silent = false) => {
    if (!userDetails?.token) return;
    if (!silent) notifyLoading();
    try {
      const { data } = await api.call("vm2/header", { method: "GET", headers: getHeaders() });
      if (data.success) setHeaders(data.response || []);
    } catch { 
      if (!silent) notifyError("Fetch Headers Failed"); 
    } finally { 
      if (!silent) closeLoading(); 
    }
  }, [userDetails?.token]);

  const createHeader = async (dto) => {
    notifyLoading();
    try {
      const { data } = await api.call("vm2/header", { method: "POST", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("Header Style Created"); 
        await fetchHeaders(true); 
        return true; 
      }
    } catch { notifyError("Creation Failed"); } finally { closeLoading(); }
  };

  const updateHeader = async (id, dto) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/header/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(dto) });
      if (data.success) { 
        notifySuccess("Header Updated"); 
        await fetchHeaders(true); 
        return true; 
      }
    } catch { notifyError("Update Failed"); } finally { closeLoading(); }
  };

  const deleteHeader = async (id) => {
    if(!window.confirm("Delete this header configuration?")) return;
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/header/${id}`, { method: "DELETE", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Header Deleted");
        await fetchHeaders(true);
      }
    } catch { notifyError("Delete Failed"); } finally { closeLoading(); }
  };

  const activateHeader = async (id) => {
    notifyLoading();
    try {
      const { data } = await api.call(`vm2/header/${id}/activate`, { method: "PATCH", headers: getHeaders() });
      if (data.success) {
        notifySuccess("Header Activated");
        await fetchHeaders(true);
      }
    } catch { notifyError("Activation Failed"); } finally { closeLoading(); }
  };

  useEffect(() => {
    if ([75].includes(page)) fetchHeaders();
  }, [page, fetchHeaders]);

  return (
    <HeaderContext.Provider value={{ headers, createHeader, updateHeader, deleteHeader, activateHeader, fetchHeaders }}>
      {children}
    </HeaderContext.Provider>
  );
}