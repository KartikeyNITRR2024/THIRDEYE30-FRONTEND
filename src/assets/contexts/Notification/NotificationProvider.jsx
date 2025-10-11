import React from "react";
import NotificationContext from "./NotificationContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function NotificationProvider({ children }) {
  const MySwal = withReactContent(Swal);

  // Success alert
  const notifySuccess = (message = "Operation successful!") => {
    MySwal.fire({
      icon: "success",
      title: "Success",
      text: message,
      confirmButtonColor: "#3085d6",
    });
  };

  // Error alert
  const notifyError = (message = "Something went wrong!") => {
    MySwal.fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonColor: "#d33",
    });
  };

  // Loading alert
  const notifyLoading = (message = "Loading...") => {
    MySwal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        MySwal.showLoading();
      },
    });
    return MySwal; // Return instance to close later
  };

  // Confirmation alert
  const notifyConfirm = async (message = "Are you sure?") => {
    const result = await MySwal.fire({
      title: "Confirm",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });
    return result.isConfirmed;
  };

  // Handle backend response
  const handleResponse = (response) => {
    if (response.success) {
      notifySuccess(response.response?.toString() || "Operation successful!");
    } else {
      notifyError(response.errorMessage || "Operation failed!");
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifySuccess,
        notifyError,
        notifyLoading,
        notifyConfirm,
        handleResponse,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
