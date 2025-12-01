import { useState, useEffect, useContext } from "react";
import { MdArrowBack, MdDelete, MdAdd } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

import ChatIDContext from "../../contexts/MarketThresold/ChatID/ChatIDContext";
import PropertyContext from "../../contexts/Property/PropertyContext";
import NotificationContext from "../../contexts/Notification/NotificationContext";

import LoadingPage from "../LoadingComponents/LoadingPage";

export default function ChatID({ group, onBack }) {
  const { chatIDs, fetchChatIDsByGroup, createChatID, deleteChatID, loading } =
    useContext(ChatIDContext);

  const { properties } = useContext(PropertyContext);
  const { notifyInfo } = useContext(NotificationContext);

  const chatOptions = properties.ALL_ACTIVE_BOTS || [];
  const workTypeOptions = [1];

  const [newChat, setNewChat] = useState({
    chatName: "",
    chatID: "",
    workType: 1,
  });

  useEffect(() => {
    if (group?.id) fetchChatIDsByGroup(group.id);
  }, [group]);

  const handleAdd = async () => {
    if (!newChat.chatName || !newChat.chatID) return;

    const payload = {
      chatId: newChat.chatID,
      workType: "THRESOLD",
      chatName: newChat.chatName,
    };

    await createChatID(group.id, payload);
    setNewChat({ chatName: "", chatID: "", workType: 1 });
  };

  const handleDelete = async (id) => {
    if (!group?.id) return;
    await deleteChatID(id, group.id);
  };

  const handleChatNameSelect = async (value) => {
    setNewChat((prev) => ({ ...prev, chatName: value }));

    if (value) {
      await notifyInfo(
        `1. Open Telegram\n2. Search for bot "${value}"\n3. Send any message\n4. The bot will reply with your Chat ID`
      );
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md mt-6 max-w-full mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 
                     rounded-lg shadow-sm hover:bg-gray-300 transition font-medium"
        >
          <MdArrowBack size={18} />
          Back
        </button>
      </div>

      {/* TABLE OR LOADING */}
      {loading ? (
        <LoadingPage />
      ) : (
        <table className="w-full table-auto border-collapse text-center text-sm md:text-base">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border px-2 py-2">Work Type</th>
              <th className="border px-2 py-2">Chat Name</th>
              <th className="border px-2 py-2">Chat ID</th>
              <th className="border px-2 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {chatIDs.map((c) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="border px-2 py-2 text-black">{c.workType}</td>
                  <td className="border px-2 py-2 text-black">{c.chatName}</td>
                  <td className="border px-2 py-2 text-black">{c.chatId}</td>

                  <td className="border px-2 py-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-black hover:text-gray-600 transition"
                    >
                      <MdDelete size={20} />
                    </button>
                  </td>
                </motion.tr>
              ))}

              {/* NEW ENTRY ROW */}
              <motion.tr
                key="new-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Work Type */}
                <td className="border px-2 py-2">
                  <select
                    value={newChat.workType}
                    className="w-full border rounded px-1 py-1 text-center bg-white text-black"
                    onChange={(e) =>
                      setNewChat((prev) => ({
                        ...prev,
                        workType: parseInt(e.target.value),
                      }))
                    }
                  >
                    {workTypeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Chat Name */}
                <td className="border px-2 py-2">
                  <select
                    value={newChat.chatName}
                    className="w-full border rounded px-1 py-1 text-center bg-white text-black"
                    onChange={(e) => handleChatNameSelect(e.target.value)}
                  >
                    <option value="">Select Chat</option>
                    {chatOptions.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Chat ID */}
                <td className="border px-2 py-2">
                  <input
                    type="text"
                    placeholder="Chat ID"
                    value={newChat.chatID}
                    disabled={!newChat.chatName}
                    onChange={(e) =>
                      setNewChat((prev) => ({ ...prev, chatID: e.target.value }))
                    }
                    className={`w-full text-center border rounded px-1 py-1 
                      ${
                        !newChat.chatName
                          ? "bg-gray-100 text-gray-500"
                          : "bg-white text-black"
                      }`}
                  />
                </td>

                {/* Add button */}
                <td className="border px-2 py-2">
                  <button
                    onClick={handleAdd}
                    disabled={!newChat.chatName || !newChat.chatID}
                    className={`mx-auto text-black hover:text-gray-600 transition ${
                      !newChat.chatName || !newChat.chatID
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <MdAdd size={24} />
                  </button>
                </td>
              </motion.tr>
            </AnimatePresence>
          </tbody>
        </table>
      )}
    </div>
  );
}
