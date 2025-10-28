import { useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UsersContext from "../../../contexts/Admin/Users/UsersContext";
import LoadingPage from "../../LoadingComponents/LoadingPage";

export default function UserArea() {
  const { users, loading, deleteUser, activateUser, deactivateUser } =
    useContext(UsersContext);

  const [confirmAction, setConfirmAction] = useState(null); // {type, userId}

  if (loading) return <LoadingPage />;

  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter((u) => u.active).length || 0;

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const { type, userId } = confirmAction;

    if (type === "delete") await deleteUser(userId);
    if (type === "activate") await activateUser(userId);
    if (type === "deactivate") await deactivateUser(userId);

    setConfirmAction(null);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="users-area"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="bg-white bg-opacity-95 rounded-xl p-4 shadow-md mt-6 max-w-full mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            User Management
          </h2>

          <div className="text-sm md:text-base text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
            Active:{" "}
            <span className="font-semibold text-green-600">{activeUsers}</span> /{" "}
            {totalUsers}
          </div>
        </div>

        {/* TABLE VIEW (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border px-2 py-2 text-left">User ID</th>
                <th className="border px-2 py-2 text-left">Username</th>
                <th className="border px-2 py-2 text-left">Name</th>
                <th className="border px-2 py-2 text-center">Phone</th>
                <th className="border px-2 py-2 text-center">First Login</th>
                <th className="border px-2 py-2 text-center">Status</th>
                <th className="border px-2 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {users?.map((user) => {
                  const fullName =
                    (user.firstName || "") +
                    (user.lastName ? " " + user.lastName : "");

                  return (
                    <motion.tr
                      key={user.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="border px-2 py-1">{user.userId}</td>
                      <td className="border px-2 py-1 break-all">
                        {user.userName || "—"}
                      </td>
                      <td className="border px-2 py-1">{fullName.trim() || "—"}</td>
                      <td className="border px-2 py-1 text-center">
                        {user.phoneNumber || "—"}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {user.firstLogin ? "Yes" : "No"}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="border px-2 py-1 text-center space-x-1">
                        {user.active ? (
                          <button
                            onClick={() =>
                              setConfirmAction({ type: "deactivate", userId: user.userId })
                            }
                            className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setConfirmAction({ type: "activate", userId: user.userId })
                            }
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                          >
                            Activate
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setConfirmAction({ type: "delete", userId: user.userId })
                          }
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="grid gap-4 md:hidden">
          {users?.map((user) => {
            const fullName =
              (user.firstName || "") + (user.lastName ? " " + user.lastName : "");
            return (
              <motion.div
                key={user.userId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="border rounded-lg shadow-sm bg-white p-3"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{user.userName}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm">
                  <span className="font-medium">ID:</span> {user.userId}
                </p>
                {!user.firstLogin && (
                  <>
                    <p className="text-sm">
                      <span className="font-medium">Name:</span>{" "}
                      {fullName.trim() || "—"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span>{" "}
                      {user.phoneNumber || "—"}
                    </p>
                  </>
                )}
                <div className="flex gap-2 mt-3">
                  {user.active ? (
                    <button
                      onClick={() =>
                        setConfirmAction({ type: "deactivate", userId: user.userId })
                      }
                      className="flex-1 bg-yellow-100 text-yellow-700 text-xs rounded py-1 hover:bg-yellow-200"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setConfirmAction({ type: "activate", userId: user.userId })
                      }
                      className="flex-1 bg-green-100 text-green-700 text-xs rounded py-1 hover:bg-green-200"
                    >
                      Activate
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setConfirmAction({ type: "delete", userId: user.userId })
                    }
                    className="flex-1 bg-red-100 text-red-700 text-xs rounded py-1 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CONFIRM MODAL */}
        <AnimatePresence>
          {confirmAction && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg w-80"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <h3 className="text-lg font-semibold mb-4">
                  {confirmAction.type === "delete"
                    ? "Delete User?"
                    : confirmAction.type === "activate"
                    ? "Activate User?"
                    : "Deactivate User?"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to{" "}
                  <strong>{confirmAction.type}</strong> this user?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`px-3 py-1 rounded-lg text-white ${
                      confirmAction.type === "delete"
                        ? "bg-red-600 hover:bg-red-700"
                        : confirmAction.type === "activate"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-yellow-600 hover:bg-yellow-700"
                    }`}
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
