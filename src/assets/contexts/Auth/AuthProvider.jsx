import React, { useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import Backend from "../../properties/Backend";
import NotificationContext from "../Notification/NotificationContext";

export default function AuthProvider({ children }) {
  const [userDetails, setUserDetails] = useState({
    userId: null,
    token: null,
    userName: null,
    firstName: null,
    lastName: null,
    roles: null,
    firstLogin: null,
  });

  const [login, setLogin] = useState(false);

  const { notifySuccess, notifyError } = useContext(NotificationContext);

  const cleanAllData = () => {
    setUserDetails({
      userId: null,
      token: null,
      userName: null,
      firstName: null,
      lastName: null,
      roles: null,
      firstLogin: null,
    });
    setLogin(false);
  };

  // ------------------- HELPER: fetch with retry -------------------
  const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);

        // Parse JSON even on error
        const data = await response.json();

        // Retry only on server errors (status >= 500)
        if (response.status >= 500) {
          if (i === retries - 1) return data; // last attempt
          await new Promise((res) => setTimeout(res, delay));
        } else {
          // For client errors or success, return immediately
          return data;
        }
      } catch (error) {
        // Network errors
        if (i === retries - 1) {
          return { success: false, errorMessage: error.message, response: null };
        }
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  };

  // ------------------- LOGIN -------------------
  const loginFunction = async (credentials) => {
    const payload = { userName: credentials.userName, password: credentials.password };

    try {
      const data = await fetchWithRetry(
        `${Backend.THIRDEYEBACKEND.URL}um/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (data.success) {
        const res = data.response;
        setLogin(true);
        setUserDetails({
          userId: res.userId,
          token: res.token,
          userName: res.userName,
          firstName: res.firstName,
          lastName: res.lastName,
          roles: res.roles,
          firstLogin: res.firstLogin,
        });
        notifySuccess(`Welcome, ${res.firstName || res.userName}!`);
      } else {
        cleanAllData();
        notifyError(data.errorMessage || "Login failed!");
      }

      return data;
    } catch (error) {
      cleanAllData();
      console.error("Login error:", error);
      notifyError("Network error or server not found. Please try again.");
      return { success: false, errorMessage: error.message, response: null };
    }
  };

  // ------------------- SIGNUP -------------------
  const signupFunction = async (payload) => {
    if (payload.password !== payload.confirmPassword) {
      notifyError("Passwords do not match!");
      return { success: false, errorMessage: "Passwords do not match" };
    }

    try {
      const data = await fetchWithRetry(
        `${Backend.THIRDEYEBACKEND.URL}um/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userName: payload.userName, password: payload.password }),
        }
      );

      if (data.success) {
        notifySuccess(`Account created for ${payload.userName}`);
      } else {
        notifyError(data.errorMessage || "Sign up failed!");
      }

      return data;
    } catch (error) {
      console.error("Sign up error:", error);
      notifyError("Network error or server not found. Please try again.");
      return { success: false, errorMessage: error.message, response: null };
    }
  };

  // ------------------- UPDATE USER / LOGOUT -------------------
  const updateUserFunction = (details) => setUserDetails(details);

  const logout = () => {
    cleanAllData();
    localStorage.removeItem("userDetails");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{ login, userDetails, loginFunction, signupFunction, updateUserFunction, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
