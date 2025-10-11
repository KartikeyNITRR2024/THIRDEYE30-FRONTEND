import { useState } from "react";
import { MdArrowBack, MdDelete, MdAdd } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

export default function ChatID({ group, onBack }) {
  const [chats, setChats] = useState([
    { id: 1, workType: 1, chatName: "", chatID: "" },
  ]);

  const workTypeOptions = [1, 2];
  const chatNameOptions = ["Telegram", "WhatsApp", "Discord"]; // Example chat platforms

  const handleAddNew = (workType, chatName) => {
    if (!chatName) return; // Ensure chatName is selected

    const newId = chats.length ? Math.max(...chats.map((c) => c.id)) + 1 : 1;
    setChats([
      ...chats,
      { id: newId, workType: workType, chatName: chatName, chatID: "" },
    ]);
  };

  const handleDelete = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
  };

  const updateChat = (id, field, value) => {
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="chat-table"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="bg-white bg-opacity-95 rounded-xl p-4 shadow-md mt-6 max-w-full mx-auto"
      >
        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition text-sm md:text-base"
          >
            <MdArrowBack size={20} />
            Back
          </button>
          <div className="w-10"></div>
        </div>

        {/* Chat Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-center text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-2">Work Type</th>
                <th className="border px-2 py-2">Chat Name</th>
                <th className="border px-2 py-2 min-w-[120px]">Chat ID</th>
                <th className="border px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {/* Existing chats - editable chatID */}
                {chats.map((c) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="border px-2 py-2">
                      <select
                        value={c.workType}
                        onChange={(e) =>
                          updateChat(c.id, "workType", Number(e.target.value))
                        }
                        className="w-full border rounded px-1 py-1 text-center bg-gray-100"
                        disabled
                      >
                        {workTypeOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-2 py-2">
                      <input
                        type="text"
                        value={c.chatName}
                        readOnly
                        className="w-full text-center border rounded px-1 py-1 bg-gray-100"
                      />
                    </td>
                    <td className="border px-2 py-2">
                      <input
                        type="text"
                        placeholder="Chat ID"
                        value={c.chatID}
                        onChange={(e) =>
                          updateChat(c.id, "chatID", e.target.value)
                        }
                        className={`w-full text-center border rounded px-1 py-1 ${
                          !c.chatName ? "bg-gray-100" : "bg-white"
                        }`}
                      />
                    </td>
                    <td className="border px-2 py-2">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </motion.tr>
                ))}

                {/* Empty row to add new chat */}
                <motion.tr
                  key="new-chat"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="border px-2 py-2">
                    <select
                      defaultValue={1}
                      className="w-full border rounded px-1 py-1 text-center"
                    >
                      {workTypeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-2 py-2">
                    <select
                      defaultValue=""
                      onChange={(e) =>
                        handleAddNew(
                          1,
                          e.target.value
                        )
                      }
                      className="w-full border rounded px-1 py-1 text-center"
                    >
                      <option value="">Select Chat</option>
                      {chatNameOptions.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-2 py-2">
                    <input
                      type="text"
                      placeholder="Chat ID"
                      disabled
                      className="w-full text-center border rounded px-1 py-1 bg-gray-100"
                    />
                  </td>
                  <td className="border px-2 py-2">
                    <MdAdd size={24} className="text-blue-500 mx-auto" />
                  </td>
                </motion.tr>
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
