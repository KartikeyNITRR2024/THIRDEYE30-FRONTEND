import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UsersContext from "../../../contexts/Admin/Users/UsersContext";
import LoadingPage from "../../LoadingComponents/LoadingPage";
import { MdArrowBack } from "react-icons/md";

export default function UserArea({ onBack }) {
  const { users, loading, deleteUser, activateUser, deactivateUser } =
    useContext(UsersContext);

  if (loading) return <LoadingPage />;

  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter((u) => u.active).length || 0;

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

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 
                               rounded-lg shadow-sm hover:bg-gray-300 transition 
                               font-medium text-sm md:text-base"
          >
            <MdArrowBack size={18} />
            Back
          </button>

          <div
            className="bg-gray-200 text-black px-4 py-2 rounded-lg shadow-sm 
                                  font-medium text-sm md:text-base flex items-center"
          >
            Active:{" "} <span className="font-semibold">{totalUsers}</span>
          </div>
        </div>

        {/* ============================
            DESKTOP TABLE VIEW
        ============================ */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-200 text-black">
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
              {users?.map((user) => {
                const fullName =
                  (user.firstName || "") +
                  (user.lastName ? " " + user.lastName : "");

                return (
                  <tr key={user.userId} className="hover:bg-gray-100">
                    <td className="border px-2 py-1">{user.userId}</td>
                    <td className="border px-2 py-1 break-all">
                      {user.userName}
                    </td>
                    <td className="border px-2 py-1">{fullName.trim()}</td>
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
                            ? "bg-gray-300 text-black"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="border px-2 py-1 text-center space-x-2">
                      {user.active ? (
                        <button
                          onClick={() => deactivateUser(user.userId)}
                          className="text-xs bg-gray-200 text-black px-2 py-1 rounded hover:bg-gray-300"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => activateUser(user.userId)}
                          className="text-xs bg-gray-200 text-black px-2 py-1 rounded hover:bg-gray-300"
                        >
                          Activate
                        </button>
                      )}

                      <button
                        onClick={() => deleteUser(user.userId)}
                        className="text-xs bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ============================
            MOBILE LIST VIEW
        ============================ */}
        <div className="grid gap-4 md:hidden">
          {users?.map((user) => {
            const fullName =
              (user.firstName || "") +
              (user.lastName ? " " + user.lastName : "");

            return (
              <div
                key={user.userId}
                className="border rounded-lg shadow-sm bg-white p-3"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-black">
                    {user.userName}
                  </span>

                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.active
                        ? "bg-gray-300 text-black"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-sm text-black">
                  <span className="font-medium">ID:</span> {user.userId}
                </p>

                <p className="text-sm text-black">
                  <span className="font-medium">Name:</span> {fullName.trim()}
                </p>

                <p className="text-sm text-black">
                  <span className="font-medium">Phone:</span>{" "}
                  {user.phoneNumber || "—"}
                </p>

                <div className="flex gap-2 mt-3">
                  {user.active ? (
                    <button
                      onClick={() => deactivateUser(user.userId)}
                      className="flex-1 bg-gray-200 text-black text-xs rounded py-1 hover:bg-gray-300"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => activateUser(user.userId)}
                      className="flex-1 bg-gray-200 text-black text-xs rounded py-1 hover:bg-gray-300"
                    >
                      Activate
                    </button>
                  )}

                  <button
                    onClick={() => deleteUser(user.userId)}
                    className="flex-1 bg-gray-300 text-black text-xs rounded py-1 hover:bg-gray-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
