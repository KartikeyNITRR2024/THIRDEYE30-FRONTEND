import React, { useContext } from "react";
import NotificationContext from "../contexts/Notification/NotificationContext";

export default function AlertDemo() {
  const { notifySuccess, notifyError, notifyLoading, notifyConfirm, handleResponse } =
    useContext(NotificationContext);

  const demoResponse = { success: true, errorCode: 0, errorMessage: null, response: "Demo success!" };

  return (
    <div className="p-6 flex flex-col gap-3">
      <button onClick={() => notifySuccess("Success!")}>Success</button>
      <button onClick={() => notifyError("Error!")}>Error</button>
      <button
        onClick={() => {
          const loader = notifyLoading();
          setTimeout(() => loader.close(), 2000);
        }}
      >
        Loading
      </button>
      <button
        onClick={async () => {
          const confirmed = await notifyConfirm("Are you sure?");
          if (confirmed) notifySuccess("Confirmed!");
          else notifyError("Cancelled!");
        }}
      >
        Confirm
      </button>
      <button onClick={() => handleResponse(demoResponse)}>Handle Response</button>
    </div>
  );
}