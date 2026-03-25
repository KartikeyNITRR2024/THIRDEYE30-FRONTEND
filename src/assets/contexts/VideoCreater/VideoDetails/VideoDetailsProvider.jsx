import { useState, useEffect, useContext, useCallback } from "react";
import VideoDetailsContext from "./VideoDetailsContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function VideoDetailsProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { 
    notifyError, 
    notifyLoading, 
    closeLoading, 
    notifySuccess,
    notifyConfirm 
  } = useContext(NotificationContext);
  
  const [detailsList, setDetailsList] = useState([]);
  const api = new ApiCaller();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    token: userDetails.token,
  });

  const fetchAllDetails = useCallback(async () => {
    if (!userDetails?.token) return;
    notifyLoading("Syncing Video Library...");
    try {
      const { data } = await api.call("vm2/video-details", {
        method: "GET",
        headers: getHeaders(),
      });
      if (data.success) {
        setDetailsList(data.response || []);
      } else {
        await notifyError(data.errorMessage || "Failed to Fetch Video Details");
      }
    } catch {
      notifyError("Network error: Could not reach video details service");
    } finally {
      closeLoading();
    }
  }, [userDetails?.token]);

  const createDetails = async (dto) => {
    if (!userDetails?.token) return;
    notifyLoading("Saving Video Details...");
    try {
      const { data } = await api.call("vm2/video-details", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(dto),
      });
      if (data.success) {
        notifySuccess("Video Details Saved Successfully");
        await fetchAllDetails();
        return true;
      } else {
        await notifyError(data.errorMessage || "Failed to Save Video Details");
      }
    } catch {
      notifyError("Service error: Save Failed");
    } finally {
      closeLoading();
    }
  };

  const updateDetails = async (id, dto) => {
    if (!userDetails?.token) return;
    notifyLoading("Updating Video Details...");
    try {
      const { data } = await api.call(`vm2/video-details/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(dto),
      });
      if (data.success) {
        notifySuccess("Video Details Updated Successfully");
        await fetchAllDetails();
        return true;
      } else {
        await notifyError(data.errorMessage || "Update Failed");
        return false;
      }
    } catch {
      notifyError("Service error: Update Failed");
      return false;
    } finally {
      closeLoading();
    }
  };

  const deleteDetails = async (id) => {
    if (!userDetails?.token || !id) return;

    const ok = await notifyConfirm("Are you sure you want to delete these video details?");
    if (!ok) return;

    notifyLoading("Deleting Video Details...");
    try {
      const { data } = await api.call(`vm2/video-details/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (data.success) {
        setDetailsList(prev => prev.filter(d => d.id !== id));
        notifySuccess("Video Details Deleted Successfully");
      } else {
        await notifyError(data.errorMessage || "Delete Failed");
      }
    } catch {
      notifyError("Service error: Delete Failed");
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if ([5, 6].includes(page)) {
      fetchAllDetails();
    } else {
      setDetailsList([]);
    }
  }, [page, fetchAllDetails]);

  return (
    <VideoDetailsContext.Provider value={{ 
      detailsList, 
      fetchAllDetails, 
      createDetails, 
      updateDetails, 
      deleteDetails 
    }}>
      {children}
    </VideoDetailsContext.Provider>
  );
}