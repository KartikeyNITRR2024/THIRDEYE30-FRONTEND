import { useState, useEffect, useContext } from "react";
import { MdArrowBack, MdDelete, MdCheck } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import ChatIDContext from "../../contexts/MarketThresold/ChatID/ChatIDContext";
import PropertyContext from "../../contexts/Property/PropertyContext";
import LoadingPage from "../LoadingComponents/LoadingPage"; 

export default function ChatID({ group, onBack }) {
  const { chatIDs, fetchChatIDsByGroup, createChatID, deleteChatID, loading } = useContext(ChatIDContext);
  const { properties } = useContext(PropertyContext);
  const chatOptions = properties.ALL_ACTIVE_BOTS || [];
  const workTypeOptions = [1];

  const [newChat, setNewChat] = useState({ chatName: "", chatID: "", workType: 1 });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (group?.id) fetchChatIDsByGroup(group.id);
  }, [group]);

  const handleAdd = async () => {
    if (!newChat.chatName || !newChat.chatID) return;
    const payload = { chatId: newChat.chatID, workType: "THRESOLD", chatName: newChat.chatName };
    await createChatID(group.id, payload);
    setNewChat({ chatName: "", chatID: "", workType: 1 });
  };

  const handleDelete = async (id) => {
    if (!group?.id) return;
    await deleteChatID(id, group.id);
  };

  const handleChatNameSelect = (value) => {
    setNewChat((prev) => ({ ...prev, chatName: value }));
    if (value) setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  return (
    <div className="bg-white rounded-xl p-4 shadow-md mt-6 max-w-full mx-auto relative">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition text-sm md:text-base"
        >
          <MdArrowBack size={20} /> Back
        </button>
      </div>

      <div className="overflow-x-auto min-h-[200px] flex items-center justify-center">
        {loading ? (
          <LoadingPage/>
        ) : (
          <table className="w-full table-auto border-collapse text-center text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
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
                    <td className="border px-2 py-2">{c.workType}</td>
                    <td className="border px-2 py-2">{c.chatName}</td>
                    <td className="border px-2 py-2">{c.chatId}</td>
                    <td className="border px-2 py-2 flex justify-center gap-2">
                      <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700">
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </motion.tr>
                ))}

                <motion.tr
                  key="new-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="border px-2 py-2">
                    <select
                      value={newChat.workType}
                      className="w-full border rounded px-1 py-1 text-center"
                      onChange={(e) => setNewChat((prev) => ({ ...prev, workType: parseInt(e.target.value) }))}
                    >
                      {workTypeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="border px-2 py-2">
                    <select
                      value={newChat.chatName}
                      className="w-full border rounded px-1 py-1 text-center"
                      onChange={(e) => handleChatNameSelect(e.target.value)}
                    >
                      <option value="">Select Chat</option>
                      {chatOptions.map((name) => <option key={name} value={name}>{name}</option>)}
                    </select>
                  </td>
                  <td className="border px-2 py-2">
                    <input
                      type="text"
                      placeholder="Chat ID"
                      value={newChat.chatID}
                      disabled={!newChat.chatName}
                      onChange={(e) => setNewChat((prev) => ({ ...prev, chatID: e.target.value }))}
                      className={`w-full text-center border rounded px-1 py-1 ${!newChat.chatName ? "bg-gray-100" : "bg-white"}`}
                    />
                  </td>
                  <td className="border px-2 py-2">
                    <button
                      onClick={handleAdd}
                      disabled={!newChat.chatName || !newChat.chatID}
                      className="mx-auto text-green-500 hover:text-green-700"
                    >
                      <MdCheck size={24} />
                    </button>
                  </td>
                </motion.tr>
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4 text-black">Get Chat ID</h3>
            <p className="mb-4 text-gray-700 text-sm">
              OPEN TELEGRAM, search for the bot <strong>"{newChat.chatName}"</strong>, send a message and it will give you the Chat ID.
            </p>
            <button
              onClick={closePopup}
              className="px-3 py-1 rounded-lg bg-black text-white hover:bg-gray-900"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Summary:
// 1. Loading GIF replaces only the table until chat IDs are fetched.
// 2. Table renders after loading completes.
// 3. Maintains chat addition, deletion, and popup functionality.
// 4. Loading GIF is centered in the table area, mobile-friendly.
