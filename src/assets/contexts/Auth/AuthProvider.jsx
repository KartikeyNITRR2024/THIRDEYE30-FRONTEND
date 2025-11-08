import { useState, useContext } from "react";
import AuthContext from "./AuthContext";
import NotificationContext from "../Notification/NotificationContext";
import ApiCaller from "../../properties/Apicaller";

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

  const [verifyUser, setVerifyUser] = useState({
       message: null,
       mailId: null,
       mailType: null
  });

  const [login, setLogin] = useState(false);
  const [verification, setVerification] = useState(false);

  const { notifySuccess, notifyError } = useContext(NotificationContext);
  const api = new ApiCaller();

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

  const cleanAllVerificationData = () => {
    setVerifyUser({
       message: null,
       mailId: null,
       mailType: null
    });
    setVerification(false);
  }

  const loginFunction = async (credentials) => {
    const payload = {
      userName: credentials.userName,
      password: credentials.password,
    };

    try {
      const { data } = await api.call(`um/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (data.success) {
        const res = data.response;
        if (res.loginSuccess) {
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
        }
        else if(res.errorType === 1)
        {
          cleanAllData();
          notifyError(res.message || "Login failed!");
        }
        else if(res.errorType === 2)
        {
          cleanAllData();
          setVerifyUser({
            message: res.message,
            mailId: res.mailId,
            mailType: res.mailType
          });
          setVerification(true);
        }
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

  const signupFunction = async (payload) => {
    if (payload.password !== payload.confirmPassword) {
      notifyError("Passwords do not match!");
      return { success: false, errorMessage: "Passwords do not match" };
    }

    try {
      const { data } = await api.call(`um/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: payload.userName,
          password: payload.password,
        }),
      });

      if (data.success) {
        const res = data.response;
        cleanAllData();
          setVerifyUser({
            message: res.message,
            mailId: res.id,
            mailType: res.getMailType
          });
        setVerification(true);
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

  const updateUserFunction = (details) => setUserDetails(details);

  const logout = () => {
    cleanAllData();
    localStorage.removeItem("userDetails");
    window.location.href = "/";
  };

  const verifyOtp = async (otpValue, newPassword = null) => {
    try {
      const { data } = await api.call(`um/auth/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mailId: verifyUser.mailId,
          mailType: verifyUser.mailType,
          otp: otpValue,
          newPassword: newPassword
        })
      });

      if (data.success && data.response.success) {
        notifySuccess(data.response.message);
        cleanAllVerificationData();
        return { success: true };
      } else {
        notifyError(data.errorMessage);
        return { success: false };
      }
    } catch (err) {
      notifyError("Something went wrong.");
      return { success: false };
    }
  };

  const resetPassword = async ({ userName, phoneNumber }) => {
  try {
    const { data } = await api.call(`um/auth/resetpassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, phoneNumber })
    });

    if (data.success && data.response.success) {
      setVerifyUser({
        message: data.response.message,
        mailId: data.response.mailId,
        mailType: data.response.mailType
      });
      setVerification(true);
    } else {
      notifyError(data.response.message || "Reset request failed.");
    }
    return data;
  } catch (err) {
    notifyError("Something went wrong.");
  }
};

  return (
    <AuthContext.Provider
      value={{
        login,
        userDetails,
        loginFunction,
        signupFunction,
        updateUserFunction,
        logout,
        verification,
        cleanAllVerificationData,
        verifyUser,
        verifyOtp,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// This AuthProvider manages user authentication state and provides login, signup, update, and logout functions.
// It uses ApiCaller for API requests with retry and optional timeout logic, and NotificationContext for feedback.
// All children components wrapped inside this provider can access user details and authentication functions via AuthContext.
