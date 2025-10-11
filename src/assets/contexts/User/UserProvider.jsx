import React, { useState, useEffect, useContext } from "react";
import UserContext from "./UserContext";
import AuthContext from "../Auth/AuthContext";
import Backend from "../../properties/Backend";
import NotificationContext from "../Notification/NotificationContext";

export default function UserProvider({ children }) {
  const { userDetails } = useContext(AuthContext); // from AuthProvider
  const [userInfo, setUserInfo] = useState(null);
  const { notifySuccess, notifyError } = useContext(NotificationContext);

  // ------------------- FETCH USER INFO -------------------
  const fetchUserInfo = async (retries = 3, delay = 1000) => {
    if (!userDetails || !userDetails.token) return;

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(
          `${Backend.THIRDEYEBACKEND.URL}um/user/users/${userDetails.userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: userDetails.token,
            },
          }
        );
        const data = await response.json();

        if (response.status >= 500) {
          if (i === retries - 1) {
            notifyError(data.errorMessage || "Server error while fetching user info");
            return;
          }
          await new Promise((res) => setTimeout(res, delay));
        } else {
          if (data.success) {
            const updatedUser = {
                ...userDetails,            // keep old info like token, userId
                lastName: data.response.lastName,
                phoneNumber: data.response.phoneNumber,
            };

            setUserInfo(updatedUser);             // for form filling
            localStorage.setItem("userDetails", JSON.stringify(updatedUser));      
          } else {
            notifyError(data.errorMessage || "Failed to load user info");
          }
          return;
        }
      } catch (error) {
        if (i === retries - 1) {
          notifyError("Network error. Could not fetch user info.");
          return;
        }
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  };

  // ------------------- UPDATE USER DETAILS -------------------
  const updateUserDetails = async (payload, retries = 3, delay = 1000) => {
    if (!userInfo || !userInfo.userId) {
      notifyError("User not found!");
      return;
    }

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(
          `${Backend.THIRDEYEBACKEND.URL}um/user/users/${userInfo.userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              token: userInfo.token,
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        if (response.status >= 500) {
          if (i === retries - 1) {
            notifyError(data.errorMessage || "Server error while updating user info");
            return;
          }
          await new Promise((res) => setTimeout(res, delay));
        } else {
          if (data.success) {
            const updatedUser = { ...userInfo, ...payload };
            setUserInfo(updatedUser);
            localStorage.setItem("userDetails", JSON.stringify(updatedUser));
            notifySuccess("User details updated successfully!");
          } else {
            notifyError(data.errorMessage || "Update failed!");
          }
          return;
        }
      } catch (error) {
        if (i === retries - 1) {
          notifyError("Network error. Could not update user info.");
          return;
        }
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  };

  // ------------------- LOAD FROM AUTH OR LOCALSTORAGE -------------------
  useEffect(() => {
    if (userDetails && userDetails.isLogin) {
      fetchUserInfo(); // fetch fresh data from backend
    } else {
      const storedUser = localStorage.getItem("userDetails");
      if (storedUser) setUserInfo(JSON.parse(storedUser));
      else setUserInfo(null);
    }
  }, [userDetails]);

  return (
    <UserContext.Provider value={{ userInfo, fetchUserInfo, updateUserDetails }}>
      {children}
    </UserContext.Provider>
  );
}
