import { useState, useEffect, useContext } from "react";
import UsersContext from "./UsersContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function UsersProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const {
    notifyError,
    notifySuccess,
    notifyLoading,
    closeLoading,
    notifyConfirm
  } = useContext(NotificationContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const api = new ApiCaller();

  // -------------------------------------
  // REUSABLE WRAPPER (auto loading, error)
  // -------------------------------------
  const apiWrapper = async (message, fn) => {
    notifyLoading(message);
    try {
      return await fn();
    } catch (error) {
      await notifyError("Network error! Please try again.");
    } finally {
      closeLoading();
    }
  };

  // -------------------------------------
  // FETCH USERS
  // -------------------------------------
  const fetchUsers = async () => {
    if (!userDetails?.token) return;

    await apiWrapper("Loading", async () => {
      const { data } = await api.call("um/admin/users", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });

      if (data.success) setUsers(data.response || []);
      else await notifyError(data.errorMessage || "Failed to load users");
    });
  };

  // -------------------------------------
  // DELETE USER (uses notifyConfirm)
  // -------------------------------------
  const deleteUser = async (userId) => {
    const ok = await notifyConfirm("Are you sure you want to delete this user?");
    if (!ok) return;

    await apiWrapper("Deleteing user with id "+userId,async () => {
      const { data } = await api.call(`um/admin/users/${userId}`, {
        method: "DELETE",
        headers: { token: userDetails.token },
      });

      if (data.success) {
        await notifySuccess(data.response);
        fetchUsers();
      } else await notifyError(data.errorMessage);
    });
  };

  // -------------------------------------
  // ACTIVATE USER
  // -------------------------------------
  const activateUser = async (userId) => {
    const ok = await notifyConfirm("Are you sure you want to activate this user?");
    if (!ok) return;

    await apiWrapper("Activating user with id "+userId,async () => {
      const { data } = await api.call(`um/admin/users/${userId}/activate`, {
        method: "PATCH",
        headers: { token: userDetails.token },
      });

      if (data.success) {
        await notifySuccess(data.response);
        fetchUsers();
      } else await notifyError(data.errorMessage);
    });
  };

  // -------------------------------------
  // DEACTIVATE USER
  // -------------------------------------
  const deactivateUser = async (userId) => {
    const ok = await notifyConfirm("Are you sure you want to deactivate this user?");
    if (!ok) return;

    await apiWrapper("Deactivating user with id "+userId,async () => {
      const { data } = await api.call(`um/admin/users/${userId}/deactivate`, {
        method: "PATCH",
        headers: { token: userDetails.token },
      });

      if (data.success) {
        await notifySuccess(data.response);
        fetchUsers();
      } else await notifyError(data.errorMessage);
    });
  };

  useEffect(() => {
    if (page === 3) fetchUsers();
    else setUsers([]);
  }, [page]);

  return (
    <UsersContext.Provider
      value={{
        users,
        loading,
        fetchUsers,
        deleteUser,
        activateUser,
        deactivateUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}
