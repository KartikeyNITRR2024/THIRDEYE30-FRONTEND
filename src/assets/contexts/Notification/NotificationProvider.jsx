import NotificationContext from "./NotificationContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function NotificationProvider({ children }) {
  const MySwal = withReactContent(Swal);

  const notifySuccess = (message = "Operation successful!") => {
    MySwal.fire({
      icon: "success",
      title: "Success",
      text: message,
      confirmButtonColor: "#3085d6",
    });
  };

  const notifyError = (message = "Something went wrong!") => {
    MySwal.fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonColor: "#d33",
    });
  };

  const notifyLoading = (message = "Loading...") => {
    MySwal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        MySwal.showLoading();
      },
    });
    return MySwal;
  };

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

// Summary:
// 1. Provides centralized notification functions for the app (success, error, loading, confirm).
// 2. Uses SweetAlert2 via withReactContent for styled alerts.
// 3. Includes handleResponse to automatically show success or error messages based on API responses.
// 4. All child components can access these notifications via NotificationContext.
