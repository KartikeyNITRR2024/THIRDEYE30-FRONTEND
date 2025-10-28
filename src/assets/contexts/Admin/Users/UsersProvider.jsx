import { useState, useEffect, useContext } from "react";
import UsersContext from "./UsersContext";
import AuthContext from "../../Auth/AuthContext";
import NotificationContext from "../../Notification/NotificationContext";
import ApiCaller from "../../../properties/Apicaller";
import PageContext from "../Page/PageContext";

export default function UsersProvider({ children }) {
  const { page } = useContext(PageContext);
  const { userDetails } = useContext(AuthContext);
  const { notifyError, notifySuccess } = useContext(NotificationContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const api = new ApiCaller();

  const fetchUsers = async () => {
    if (!userDetails?.token) return;
    setLoading(true);
    try {
      const { data } = await api.call("um/admin/users", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: userDetails.token },
      });
      if (data.success) setUsers(data.response || []);
      else notifyError(data.errorMessage || "Failed to fetch users");
    } catch {
      notifyError("Network error while fetching users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const { data } = await api.call(`um/admin/users/${userId}`, {
        method: "DELETE",
        headers: { token: userDetails.token },
      });
      if (data.success) {
        notifySuccess(data.response);
        fetchUsers();
      } else notifyError(data.errorMessage);
    } catch {
      notifyError("Network error while deleting user");
    }
  };

  const activateUser = async (userId) => {
    try {
      const { data } = await api.call(`um/admin/users/${userId}/activate`, {
        method: "PATCH",
        headers: { token: userDetails.token },
      });
      if (data.success) {
        notifySuccess(data.response);
        fetchUsers();
      } else notifyError(data.errorMessage);
    } catch {
      notifyError("Network error while activating user");
    }
  };

  const deactivateUser = async (userId) => {
    try {
      const { data } = await api.call(`um/admin/users/${userId}/deactivate`, {
        method: "PATCH",
        headers: { token: userDetails.token },
      });
      if (data.success) {
        notifySuccess(data.response);
        fetchUsers();
      } else notifyError(data.errorMessage);
    } catch {
      notifyError("Network error while deactivating user");
    }
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
