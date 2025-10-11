import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function Alert() {
  const MySwal = withReactContent(Swal);
  const showSuccess = (message = "Operation successful!") => {
    MySwal.fire({
      icon: "success",
      title: "Success",
      text: message,
      confirmButtonColor: "#3085d6",
    });
  };
  const showError = (message = "Something went wrong!") => {
    MySwal.fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonColor: "#d33",
    });
  };
  const showLoading = (message = "Loading...") => {
    MySwal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        MySwal.showLoading();
      },
    });
    return MySwal;
  };
  const showConfirm = async (message = "Are you sure?") => {
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
      showSuccess(response.response?.toString() || "Operation successful!");
    } else {
      showError(response.errorMessage || "Operation failed!");
    }
  };
  const successResponse = {
    success: true,
    errorCode: 0,
    errorMessage: null,
    response: "This is a successful operation!",
  };
  const failureResponse = {
    success: false,
    errorCode: 101,
    errorMessage: "This operation failed!",
    response: null,
  };
  const handleShowLoading = async () => {
    const loader = showLoading("Please wait...");
    setTimeout(() => {
      loader.close();
      showSuccess("Loading finished!");
    }, 2000);
  };
  const handleShowConfirm = async () => {
    const confirmed = await showConfirm("Do you want to proceed?");
    if (confirmed) {
      showSuccess("You clicked Yes!");
    } else {
      showError("You clicked No!");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">SweetAlert2 Demo</h1>

      <button
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        onClick={() => showSuccess("This is a success alert!")}
      >
        Show Success Alert
      </button>

      <button
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        onClick={() => showError("This is an error alert!")}
      >
        Show Error Alert
      </button>

      <button
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={handleShowLoading}
      >
        Show Loading Alert
      </button>

      <button
        className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        onClick={handleShowConfirm}
      >
        Show Confirmation Alert
      </button>

      <button
        className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        onClick={() => handleResponse(successResponse)}
      >
        Show Success Response
      </button>

      <button
        className="px-6 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
        onClick={() => handleResponse(failureResponse)}
      >
        Show Failure Response
      </button>
    </div>
  );
}
