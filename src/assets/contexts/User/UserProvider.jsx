import { useState, useEffect, useContext } from "react";
import UserContext from "./UserContext";
import AuthContext from "../Auth/AuthContext";
import NotificationContext from "../Notification/NotificationContext";
import ApiCaller from "../../properties/Apicaller";
import { useNavigate } from "react-router-dom";

export default function UserProvider({ children }) {
  const { userDetails, login } = useContext(AuthContext);
  const { notifySuccess, notifyError, notifyLoading, closeLoading, notifyConfirm } = useContext(NotificationContext);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const api = new ApiCaller();

  const fetchUserInfo = async () => {
    if (!userDetails?.token) return;
    notifyLoading();
    try {
      const { data } = await api.call(`um/user/users/${userDetails.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: userDetails.token,
        },
      });

      if (data.success) {
        const updatedUser = {
          ...userDetails,
          lastName: data.response.lastName,
          phoneNumber: data.response.phoneNumber,
        };
        setUserInfo(updatedUser);
        localStorage.setItem("userDetails", JSON.stringify(updatedUser));
      } else {
        notifyError(data.errorMessage || "Failed to load user info");
      }
    } catch {
      notifyError("Network error. Could not fetch user info.");
    } finally {
      closeLoading();
    }
  };

  const updateUserDetails = async (payload) => {
    if (!userInfo?.userId) {
      notifyError("User not found!");
      return;
    }
    const ok = await notifyConfirm("Update user details?");
    if (!ok) return;
    notifyLoading("Updating user details");

    try {
      const { data } = await api.call(`um/user/users/${userInfo.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: userInfo.token,
        },
        body: JSON.stringify(payload),
      });

      if (data.success) {
        const updatedUser = { ...userInfo, ...payload };
        setUserInfo(updatedUser);
        localStorage.setItem("userDetails", JSON.stringify(updatedUser));
        notifySuccess("User details updated successfully!");
      } else {
        notifyError(data.errorMessage || "Update failed!");
      }
    } catch {
      notifyError("Network error. Could not update user info.");
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if (login)
    {
       fetchUserInfo();
    }
    else
    {
        setUserInfo(null);
        navigate("/");
    }
  }, [login]);

  return (
    <UserContext.Provider value={{ userInfo, fetchUserInfo, updateUserDetails }}>
      {children}
    </UserContext.Provider>
  );
}

// This UserProvider manages fetching and updating user information.
// It uses ApiCaller for API requests with retries and optional timeout.
// Provides userInfo state and functions (fetchUserInfo, updateUserDetails) to child components.
