import NotificationContext from "./NotificationContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function NotificationProvider({ children }) {
  const MySwal = withReactContent(Swal);

  const BW = {
    confirm: "#000000",     // black
    cancel: "#555555",      // dark gray
    text: "#000000",        // black text
    title: "#000000",       // black title
  };

  const notifySuccess = async (message = "Operation successful!") => {
    const result = await MySwal.fire({
      icon: "success",
      title: "Success",
      text: message,
      confirmButtonColor: BW.confirm,
      color: BW.text,
    });
    return result;
  };

const notifyInfo = async (message = "") => {
  const result = await MySwal.fire({
    title: "Information",
    text: message,
    icon: "info",
    confirmButtonText: "OK",
    confirmButtonColor: BW.confirm,
    color: BW.text,
    showCancelButton: false,
  });
  return result;
};


  // ERROR (Black & White theme)
  const notifyError = async (message = "Something went wrong!") => {
    const result = await MySwal.fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonColor: BW.confirm,
      color: BW.text,
    });
    return result;
  };

let loadingCount = 0;
let loadingStartTime = null;


const notifyLoading = (message = "Loading...") => {
  loadingCount++;
  if (loadingCount === 1) {
    loadingStartTime = performance.now();

    MySwal.fire({
      title: message,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => MySwal.showLoading(),
      color: BW.text,
    });
  }
};


const closeLoading = () => {
  loadingCount--;

  if (loadingCount <= 0) {
    loadingCount = 0;
    if (loadingStartTime !== null) {
      const elapsed = performance.now() - loadingStartTime;
      console.log(`Loader visible for ${elapsed.toFixed(2)} ms`);
      loadingStartTime = null;
    }

    MySwal.close();
  }
};

  // CONFIRM (Black & White buttons)
  const notifyConfirm = async (message = "Are you sure?") => {
    const result = await MySwal.fire({
      title: "Confirm",
      text: message,
      icon: "warning",
      color: BW.text,
      showCancelButton: true,

      confirmButtonText: "Yes",
      cancelButtonText: "No",

      confirmButtonColor: BW.confirm,
      cancelButtonColor: BW.cancel,
    });
    return result.isConfirmed;
  };

  // TEXT INPUT PROMPT (Black & White)
  const notifyPrompt = async (
    message = "Enter value",
    confirmText = "OK",
    cancelText = "Cancel"
  ) => {
    const result = await MySwal.fire({
      title: message,
      input: "text",
      inputPlaceholder: "Type here...",
      inputAttributes: { autocapitalize: "off" },

      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,

      confirmButtonColor: BW.confirm,
      cancelButtonColor: BW.cancel,
      color: BW.text,

      preConfirm: (value) => {
        if (!value || !value.trim()) {
          MySwal.showValidationMessage("This field cannot be empty!");
        }
        return value;
      },

      allowOutsideClick: () => !MySwal.isLoading(),
    });

    return result.isConfirmed ? result.value : null;
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
        closeLoading,
        notifyConfirm,
        notifyPrompt,
        handleResponse,
        notifyInfo
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
